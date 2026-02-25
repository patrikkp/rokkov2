'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'

interface ReceiptImageProps {
  filePath: string
  alt?: string
}

export default function ReceiptImage({ filePath, alt = 'Receipt' }: ReceiptImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { t } = useI18n()

  useEffect(() => {
    async function getSignedUrl() {
      try {
        const { data, error } = await supabase.storage
          .from('receipts')
          .createSignedUrl(filePath, 3600)

        if (error) throw error
        if (data?.signedUrl) {
          setImageUrl(data.signedUrl)
        }
      } catch (err) {
        console.error('Error loading receipt:', err)
      } finally {
        setLoading(false)
      }
    }

    getSignedUrl()
  }, [filePath])

  if (loading) {
    return (
      <div className="w-full h-64 border border-gray-800 flex items-center justify-center">
        <p className="text-gray-600 uppercase tracking-wider text-xs">{t('receipt.loading')}</p>
      </div>
    )
  }

  if (!imageUrl) {
    return (
      <div className="w-full h-64 border border-gray-800 flex items-center justify-center">
        <p className="text-gray-600 uppercase tracking-wider text-xs">{t('receipt.failed')}</p>
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="max-w-full h-auto border border-gray-800"
    />
  )
}
