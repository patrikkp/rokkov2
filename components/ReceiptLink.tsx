'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'

interface ReceiptLinkProps {
  filePath: string
}

export default function ReceiptLink({ filePath }: ReceiptLinkProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
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
          setPdfUrl(data.signedUrl)
        }
      } catch (err) {
        console.error('Error loading PDF:', err)
      } finally {
        setLoading(false)
      }
    }

    getSignedUrl()
  }, [filePath])

  if (loading) {
    return (
      <button
        disabled
        className="inline-block px-6 py-3 border border-gray-800 text-gray-600 uppercase tracking-wider text-sm font-medium cursor-not-allowed"
      >
        {t('receipt.loading')}
      </button>
    )
  }

  if (!pdfUrl) {
    return (
      <p className="text-gray-600 uppercase tracking-wider text-xs">{t('receipt.failed')}</p>
    )
  }

  return (
    <a
      href={pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-6 py-3 border border-gray-800 text-gray-300 uppercase tracking-wider text-sm font-medium hover:border-accent hover:text-accent transition-all"
    >
      {t('detail.viewPdf')}
    </a>
  )
}
