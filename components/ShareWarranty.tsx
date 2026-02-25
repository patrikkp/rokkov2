'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'
import type { Database } from '@/lib/supabase/types'

type Warranty = Database['public']['Tables']['warranties']['Row']

interface ShareWarrantyProps {
  warranty: Warranty
}

export default function ShareWarranty({ warranty }: ShareWarrantyProps) {
  const [copied, setCopied] = useState(false)
  const { t } = useI18n()

  const handleShare = async () => {
    const text = `${t('share.shareText')}:
${warranty.product_name}${warranty.brand ? ` (${warranty.brand})` : ''}
${t('detail.purchaseDate')}: ${warranty.purchase_date}
${t('detail.warrantyExpires')}: ${warranty.warranty_expires}${warranty.serial_number ? `\n${t('detail.serialNumber')}: ${warranty.serial_number}` : ''}${warranty.store ? `\n${t('detail.store')}: ${warranty.store}` : ''}`

    if (navigator.share) {
      try {
        await navigator.share({ title: warranty.product_name, text })
        return
      } catch {}
    }

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 border border-gray-800 text-gray-400 uppercase tracking-wider text-xs font-medium hover:border-accent hover:text-accent transition-all"
    >
      {copied ? '✓' : t('share.shareBtn')}
    </button>
  )
}
