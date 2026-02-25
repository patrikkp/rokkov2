import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function toLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const today = new Date()

  const debug = {
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasCronSecret: !!process.env.CRON_SECRET,
    today: toLocalDateString(today),
    testEmailOverride: !!process.env.TEST_EMAIL,
  }

  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('user_id, reminder_days, reminder_enabled')
    .eq('reminder_enabled', true)

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message, debug }, { status: 500 })
  }

  if (!settings || settings.length === 0) {
    return NextResponse.json({ message: 'No users with reminders enabled', emailsSent: 0, debug })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  let emailsSent = 0
  const log: object[] = []

  for (const setting of settings) {
    const targetDate = new Date(today)
    targetDate.setDate(targetDate.getDate() + setting.reminder_days)
    const targetDateStr = toLocalDateString(targetDate)

    const { data: warranties } = await supabase
      .from('warranties')
      .select('product_name, brand, warranty_expires')
      .eq('user_id', setting.user_id)
      .eq('warranty_expires', targetDateStr)

    if (!warranties || warranties.length === 0) {
      log.push({ user_id: setting.user_id, targetDate: targetDateStr, warrantiesFound: 0 })
      continue
    }

    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(setting.user_id)
    const userEmail = userData?.user?.email ?? null

    // TEST_EMAIL override: koristi se kad nema verificirane domene u Resendu
    // Na produkciji s domenom makni TEST_EMAIL iz env-a
    const sendTo = process.env.TEST_EMAIL || userEmail

    let emailError = null
    if (sendTo) {
      const { error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'Rokko <onboarding@resend.dev>',
        to: sendTo,
        subject: `⚠️ ${warranties.length} warranty${warranties.length > 1 ? 'ies' : ''} expiring in ${setting.reminder_days} day${setting.reminder_days > 1 ? 's' : ''}`,
        html: buildEmailHtml(warranties, setting.reminder_days),
      })
      emailError = error?.message ?? null
      if (!error) emailsSent++
    }

    log.push({
      targetDate: targetDateStr,
      warrantiesFound: warranties.length,
      sentTo: sendTo ? sendTo.replace(/(.{2}).*@/, '$1***@') : null,
      userError: userError?.message ?? null,
      emailError,
    })
  }

  return NextResponse.json({ success: true, emailsSent, debug, log })
}

function buildEmailHtml(
  warranties: { product_name: string; brand: string | null; warranty_expires: string }[],
  days: number
) {
  const rows = warranties
    .map(
      (w) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;color:#ffffff">${w.product_name}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;color:#888888">${w.brand || '—'}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;color:#ff3131">${new Date(w.warranty_expires).toLocaleDateString('en-GB')}</td>
    </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<body style="background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:40px 20px">
  <div style="max-width:560px;margin:0 auto">
    <h1 style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:6px;text-transform:uppercase;margin-bottom:4px">ROKKO</h1>
    <p style="color:#444;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-bottom:40px">WARRANTY TRACKER</p>
    <p style="color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">
      ⚠️ Expiring in ${days} day${days > 1 ? 's' : ''}
    </p>
    <p style="color:#555;font-size:12px;margin-bottom:24px">
      The following warranties are expiring soon. Log in to Rokko to view details.
    </p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #1a1a1a">
      <thead>
        <tr style="background:#111">
          <th style="padding:10px 16px;text-align:left;color:#444;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:400">Product</th>
          <th style="padding:10px 16px;text-align:left;color:#444;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:400">Brand</th>
          <th style="padding:10px 16px;text-align:left;color:#444;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:400">Expires</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="color:#333;font-size:10px;margin-top:40px;letter-spacing:1px;text-transform:uppercase">
      You're receiving this because warranty reminders are enabled in your Rokko account.
    </p>
  </div>
</body>
</html>`
}
