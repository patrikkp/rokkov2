'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ParticlesBackground from './ParticlesBackground'
import { useI18n } from '@/lib/i18n/context'

interface ClaimWarrantyClientProps {
  token: string
  warranty: any
  userId: string
}

export default function ClaimWarrantyClient({ token, warranty, userId }: ClaimWarrantyClientProps) {
  const [claiming, setClaiming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { t, locale } = useI18n()

  const dateLocaleMap: Record<string, string> = {
    en: 'en-US', hr: 'hr-HR', sr: 'sr-RS', de: 'de-DE', si: 'sl-SI',
  }

  const handleClaim = async () => {
    setClaiming(true)
    setError(null)

    try {
      const { error: updateTokenError } = await supabase
        .from('warranty_transfer_tokens')
        .update({
          claimed_by: userId,
          claimed_at: new Date().toISOString(),
        })
        .eq('token', token)

      if (updateTokenError) throw updateTokenError

      const { error: updateWarrantyError } = await supabase
        .from('warranties')
        .update({ user_id: userId })
        .eq('id', warranty.id)

      if (updateWarrantyError) throw updateWarrantyError

      router.push('/app')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setClaiming(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(dateLocaleMap[locale] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <ParticlesBackground />

      <div className="relative z-10 max-w-2xl w-full">
        <h1 className="text-5xl font-bold uppercase mb-8 text-center">
          {t('claim.title')}
        </h1>

        <div className="border border-gray-800 p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">{warranty.product_name}</h2>
          
          {warranty.brand && (
            <p className="text-xl text-gray-500 uppercase tracking-wider mb-6">
              {warranty.brand}
            </p>
          )}

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                {t('claim.purchaseDate')}
              </p>
              <p className="text-lg">{formatDate(warranty.purchase_date)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                {t('claim.warrantyExpires')}
              </p>
              <p className="text-lg text-accent">{formatDate(warranty.warranty_expires)}</p>
            </div>
          </div>

          {warranty.category && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                {t('claim.category')}
              </p>
              <p className="text-lg">{warranty.category}</p>
            </div>
          )}

          {warranty.notes && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">
                {t('claim.notes')}
              </p>
              <p className="text-gray-400">{warranty.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="flex-1 px-8 py-4 bg-accent text-white uppercase tracking-wider text-sm font-medium hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {claiming ? t('claim.claiming') : t('claim.claimBtn')}
          </button>

          <a
            href="/app"
            className="px-8 py-4 border border-gray-800 text-gray-300 uppercase tracking-wider text-sm font-medium hover:border-accent hover:text-accent transition-all text-center"
          >
            {t('claim.cancel')}
          </a>
        </div>

        {error && (
          <div className="mt-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </main>
  )
}
