import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WarrantyDetailClient from '@/components/WarrantyDetailClient'

export default async function WarrantyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: warranty } = await supabase
    .from('warranties')
    .select('*')
    .eq('id', id)
    .single()

  if (!warranty) {
    redirect('/app')
  }

  return <WarrantyDetailClient warranty={warranty} />
}
