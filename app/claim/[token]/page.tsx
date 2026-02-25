import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClaimWarrantyClient from '@/components/ClaimWarrantyClient'
import ClaimErrorPage from '@/components/ClaimErrorPage'

export default async function ClaimWarrantyPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth?redirect=/claim/${token}`)
  }

  const { data: transferToken } = await supabase
    .from('warranty_transfer_tokens')
    .select('*, warranties(*)')
    .eq('token', token)
    .single()

  if (!transferToken) {
    return <ClaimErrorPage type="invalid" />
  }

  if (transferToken.claimed_by) {
    return <ClaimErrorPage type="claimed" />
  }

  const expiresAt = new Date(transferToken.expires_at)
  if (expiresAt < new Date()) {
    return <ClaimErrorPage type="expired" />
  }

  return (
    <ClaimWarrantyClient
      token={token}
      warranty={transferToken.warranties as any}
      userId={user.id}
    />
  )
}
