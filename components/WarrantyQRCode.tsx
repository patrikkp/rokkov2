'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import QRCode from 'qrcode'
import { useI18n } from '@/lib/i18n/context'

interface WarrantyQRCodeProps {
  warrantyId: string
}

export default function WarrantyQRCode({ warrantyId }: WarrantyQRCodeProps) {
  const { t } = useI18n()
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [transferToken, setTransferToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const supabase = createClient()

  const generateTransferToken = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const token = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const { error: insertError } = await supabase
        .from('warranty_transfer_tokens')
        .insert({
          warranty_id: warrantyId,
          token,
          created_by: user.id,
          expires_at: expiresAt.toISOString(),
        })

      if (insertError) throw insertError

      const transferUrl = `${window.location.origin}/claim/${token}`
      
      const qrDataUrl = await QRCode.toDataURL(transferUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#ff3131',
          light: '#0a0a0a',
        },
      })

      setQrCodeUrl(qrDataUrl)
      setTransferToken(token)
      setShowQR(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (transferToken) {
      const transferUrl = `${window.location.origin}/claim/${transferToken}`
      navigator.clipboard.writeText(transferUrl)
      alert(t('qr.linkCopied'))
    }
  }

  return (
    <div>
      {!showQR ? (
        <button
          onClick={generateTransferToken}
          disabled={loading}
          className="px-6 py-3 bg-accent text-white uppercase tracking-wider text-sm font-medium hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('qr.generating') : t('qr.generate')}
        </button>
      ) : (
        <div className="border border-gray-800 p-6">
          <h3 className="text-xl font-bold uppercase mb-4">{t('qr.transferTitle')}</h3>
          
          {qrCodeUrl && (
            <div className="mb-6">
              <img src={qrCodeUrl} alt="QR Code" className="mx-auto border-4 border-accent" />
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              {t('qr.scanMessage')}
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="flex-1 px-4 py-2 border border-gray-800 text-gray-300 uppercase tracking-wider text-xs font-medium hover:border-accent hover:text-accent transition-all"
              >
                {t('qr.copyLink')}
              </button>
              
              <button
                onClick={() => setShowQR(false)}
                className="flex-1 px-4 py-2 border border-gray-800 text-gray-300 uppercase tracking-wider text-xs font-medium hover:border-accent hover:text-accent transition-all"
              >
                {t('qr.close')}
              </button>
            </div>

            <p className="text-xs text-gray-600 uppercase tracking-wider">
              {t('qr.validFor')}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
