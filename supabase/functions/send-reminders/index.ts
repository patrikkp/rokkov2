// Supabase Edge Function for sending warranty expiration reminders
// This function checks for warranties expiring soon and sends email notifications

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'ROKKO <noreply@rokkonew.com>'

interface Warranty {
  id: string
  user_id: string
  product_name: string
  brand: string | null
  warranty_expires: string
  email: string
  reminder_days: number
}

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send email: ${error}`)
  }

  return await response.json()
}

function getEmailTemplate(warranty: Warranty, daysUntilExpiry: number, locale: string = 'en') {
  const isExpiringToday = daysUntilExpiry === 0
  const isExpired = daysUntilExpiry < 0
  
  const templates: Record<string, { subject: string; title: string; message: string; action: string }> = {
    en: {
      subject: isExpiringToday 
        ? `⚠️ ${warranty.product_name} warranty expires TODAY!`
        : isExpired
        ? `❌ ${warranty.product_name} warranty has EXPIRED`
        : `⏰ ${warranty.product_name} warranty expires in ${daysUntilExpiry} days`,
      title: isExpiringToday 
        ? 'Warranty Expires TODAY!'
        : isExpired
        ? 'Warranty Has Expired'
        : 'Warranty Expiring Soon',
      message: isExpiringToday
        ? `Your ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} warranty expires <strong>TODAY</strong> (${warranty.warranty_expires}).`
        : isExpired
        ? `Your ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} warranty expired on <strong>${warranty.warranty_expires}</strong>.`
        : `Your ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} warranty expires in <strong>${daysUntilExpiry} days</strong> (${warranty.warranty_expires}).`,
      action: 'View in ROKKO',
    },
    hr: {
      subject: isExpiringToday 
        ? `⚠️ Garancija za ${warranty.product_name} ističe DANAS!`
        : isExpired
        ? `❌ Garancija za ${warranty.product_name} je ISTEKLA`
        : `⏰ Garancija za ${warranty.product_name} ističe za ${daysUntilExpiry} dana`,
      title: isExpiringToday 
        ? 'Garancija ističe DANAS!'
        : isExpired
        ? 'Garancija je istekla'
        : 'Garancija uskoro ističe',
      message: isExpiringToday
        ? `Vaša garancija za ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} ističe <strong>DANAS</strong> (${warranty.warranty_expires}).`
        : isExpired
        ? `Vaša garancija za ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} je istekla <strong>${warranty.warranty_expires}</strong>.`
        : `Vaša garancija za ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} ističe za <strong>${daysUntilExpiry} dana</strong> (${warranty.warranty_expires}).`,
      action: 'Pogledaj u ROKKO',
    },
    sr: {
      subject: isExpiringToday 
        ? `⚠️ Garancija za ${warranty.product_name} ističe DANAS!`
        : isExpired
        ? `❌ Garancija za ${warranty.product_name} je ISTEKLA`
        : `⏰ Garancija za ${warranty.product_name} ističe za ${daysUntilExpiry} dana`,
      title: isExpiringToday 
        ? 'Garancija ističe DANAS!'
        : isExpired
        ? 'Garancija je istekla'
        : 'Garancija uskoro ističe',
      message: isExpiringToday
        ? `Vaša garancija za ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} ističe <strong>DANAS</strong> (${warranty.warranty_expires}).`
        : isExpired
        ? `Vaša garancija za ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} je istekla <strong>${warranty.warranty_expires}</strong>.`
        : `Vaša garancija za ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} ističe za <strong>${daysUntilExpiry} dana</strong> (${warranty.warranty_expires}).`,
      action: 'Pogledaj u ROKKO',
    },
    de: {
      subject: isExpiringToday 
        ? `⚠️ Garantie für ${warranty.product_name} läuft HEUTE ab!`
        : isExpired
        ? `❌ Garantie für ${warranty.product_name} ist ABGELAUFEN`
        : `⏰ Garantie für ${warranty.product_name} läuft in ${daysUntilExpiry} Tagen ab`,
      title: isExpiringToday 
        ? 'Garantie läuft HEUTE ab!'
        : isExpired
        ? 'Garantie abgelaufen'
        : 'Garantie läuft bald ab',
      message: isExpiringToday
        ? `Ihre Garantie für ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} läuft <strong>HEUTE</strong> ab (${warranty.warranty_expires}).`
        : isExpired
        ? `Ihre Garantie für ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} ist am <strong>${warranty.warranty_expires}</strong> abgelaufen.`
        : `Ihre Garantie für ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} läuft in <strong>${daysUntilExpiry} Tagen</strong> ab (${warranty.warranty_expires}).`,
      action: 'In ROKKO ansehen',
    },
    si: {
      subject: isExpiringToday 
        ? `⚠️ Garancija za ${warranty.product_name} poteče DANES!`
        : isExpired
        ? `❌ Garancija za ${warranty.product_name} je POTEKLA`
        : `⏰ Garancija za ${warranty.product_name} poteče čez ${daysUntilExpiry} dni`,
      title: isExpiringToday 
        ? 'Garancija poteče DANES!'
        : isExpired
        ? 'Garancija je potekla'
        : 'Garancija kmalu poteče',
      message: isExpiringToday
        ? `Vaša garancija za ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} poteče <strong>DANES</strong> (${warranty.warranty_expires}).`
        : isExpired
        ? `Vaša garancija za ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} je potekla <strong>${warranty.warranty_expires}</strong>.`
        : `Vaša garancija za ${warranty.brand ? warranty.brand + ' ' : ''}${warranty.product_name} poteče čez <strong>${daysUntilExpiry} dni</strong> (${warranty.warranty_expires}).`,
      action: 'Oglej v ROKKO',
    },
  }

  const t = templates[locale] || templates.en
  const appUrl = Deno.env.get('APP_URL') || 'https://rokkonew.com'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #000; color: #fff; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 32px; font-weight: bold; color: #ff3131; letter-spacing: -1px; }
    .content { background: #111; border: 1px solid #333; border-radius: 12px; padding: 30px; }
    .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #fff; }
    .message { font-size: 16px; line-height: 1.6; color: #ccc; margin-bottom: 30px; }
    .button { display: inline-block; background: #ff3131; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; text-transform: uppercase; font-size: 14px; letter-spacing: 0.5px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    .warning { background: #ff3131/10; border-left: 4px solid #ff3131; padding: 15px; margin: 20px 0; border-radius: 0 6px 6px 0; }
    .warning-text { color: #ff3131; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ROKKO</div>
    </div>
    <div class="content">
      <div class="title">${t.title}</div>
      <div class="message">${t.message}</div>
      ${isExpiringToday || isExpired ? `<div class="warning"><div class="warning-text">${isExpired ? 'This warranty has expired. Contact the seller if you need repairs.' : 'Take action today to avoid missing your warranty coverage!'}</div></div>` : ''}
      <a href="${appUrl}/app" class="button">${t.action}</a>
    </div>
    <div class="footer">
      You're receiving this email because you enabled warranty expiration reminders in ROKKO.<br>
      <a href="${appUrl}/app/settings" style="color: #666;">Manage notification settings</a>
    </div>
  </div>
</body>
</html>
  `
}

Deno.serve(async (req) => {
  // Verify authorization
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get all users with enabled reminders and their warranties
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('user_id, reminder_enabled, reminder_days, locale')
      .eq('reminder_enabled', true)

    if (settingsError) throw settingsError
    if (!userSettings || userSettings.length === 0) {
      return new Response(JSON.stringify({ message: 'No users with reminders enabled' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const today = new Date().toISOString().split('T')[0]
    const results = []

    for (const setting of userSettings) {
      const reminderDate = new Date()
      reminderDate.setDate(reminderDate.getDate() + setting.reminder_days)
      const targetDate = reminderDate.toISOString().split('T')[0]

      // Get warranties expiring on the target date
      const { data: warranties, error: warrantiesError } = await supabase
        .from('warranties')
        .select('id, user_id, product_name, brand, warranty_expires')
        .eq('user_id', setting.user_id)
        .lte('warranty_expires', targetDate)
        .gte('warranty_expires', today)

      if (warrantiesError) {
        console.error(`Error fetching warranties for user ${setting.user_id}:`, warrantiesError)
        continue
      }

      if (!warranties || warranties.length === 0) continue

      // Get user's email
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(setting.user_id)
      if (userError || !userData.user?.email) {
        console.error(`Error fetching user ${setting.user_id}:`, userError)
        continue
      }

      for (const warranty of warranties) {
        const expiryDate = new Date(warranty.warranty_expires)
        const todayDate = new Date(today)
        const diffTime = expiryDate.getTime() - todayDate.getTime()
        const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        const html = getEmailTemplate(
          { ...warranty, email: userData.user.email, reminder_days: setting.reminder_days },
          daysUntilExpiry,
          setting.locale
        )

        try {
          await sendEmail(
            userData.user.email,
            getEmailTemplate({ ...warranty, email: '', reminder_days: 0 }, daysUntilExpiry, setting.locale).match(/<title>(.*?)<\/title>/)?.[1] || 'Warranty Reminder',
            html
          )
          results.push({ success: true, warranty: warranty.id, user: setting.user_id })
        } catch (error) {
          console.error(`Failed to send email for warranty ${warranty.id}:`, error)
          results.push({ success: false, warranty: warranty.id, user: setting.user_id, error: error.message })
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: results.length,
      results 
    }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error processing reminders:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
