import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: warranties } = await supabase
    .from('warranties')
    .select('*')
    .order('warranty_expires', { ascending: true })

  const now = new Date().toISOString().split('T')[0]
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const active = warranties?.filter((w) => w.warranty_expires >= now).length || 0
  const expiring = warranties?.filter(
    (w) => w.warranty_expires >= now && w.warranty_expires <= thirtyDaysFromNow
  ).length || 0
  const expired = warranties?.filter((w) => w.warranty_expires < now).length || 0

  return (
    <DashboardClient
      warranties={warranties || []}
      userEmail={user?.email || ''}
      active={active}
      expiring={expiring}
      expired={expired}
    />
  )
}
