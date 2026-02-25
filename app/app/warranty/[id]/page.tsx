import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WarrantyDetailClient from '@/components/WarrantyDetailClient'

export default async function WarrantyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Validate UUID format to prevent injection
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    redirect('/app')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // SECURITY: explicit user_id check prevents IDOR even if RLS fails
  const { data: warranty } = await supabase
    .from('warranties')
    .select('id, user_id, product_name, brand, serial_number, purchase_date, warranty_expires, category, store, price, notes, receipt_url, created_at, updated_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!warranty) {
    redirect('/app')
  }

  return <WarrantyDetailClient warranty={warranty} />
}
