'use client'

import Link from 'next/link'
import WarrantyActions from '@/components/WarrantyActions'
import ReceiptImage from '@/components/ReceiptImage'
import ReceiptLink from '@/components/ReceiptLink'
import ShareWarranty from '@/components/ShareWarranty'
import EUWarrantyInfo from '@/components/EUWarrantyInfo'
import { useI18n } from '@/lib/i18n/context'
import type { Database } from '@/lib/supabase/types'

type Warranty = Database['public']['Tables']['warranties']['Row']

interface WarrantyDetailClientProps {
  warranty: Warranty
}

export default function WarrantyDetailClient({ warranty }: WarrantyDetailClientProps) {
  const { t, locale } = useI18n()

  const dateLocaleMap: Record<string, string> = {
    en: 'en-US', hr: 'hr-HR', sr: 'sr-RS', de: 'de-DE', si: 'sl-SI',
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(dateLocaleMap[locale] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const now = new Date().toISOString().split('T')[0]
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const getStatus = () => {
    if (warranty.warranty_expires < now) return { label: t('detail.expired'), color: 'text-gray-700' }
    if (warranty.warranty_expires <= thirtyDaysFromNow) return { label: t('detail.expiringSoon'), color: 'text-yellow-500' }
    return { label: t('detail.active'), color: 'text-accent' }
  }

  const status = getStatus()

  return (
    <main className="relative min-h-screen px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/app"
          className="inline-block mb-8 text-sm uppercase tracking-widest text-gray-500 hover:text-accent transition-colors"
        >
          {t('detail.backToDashboard')}
        </Link>

        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-2">
              {warranty.product_name}
            </h1>
            {warranty.brand && (
              <p className="text-xl text-gray-500 uppercase tracking-wider">
                {warranty.brand}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <ShareWarranty warranty={warranty} />
            <div className={`text-sm uppercase tracking-widest ${status.color}`}>
              {status.label}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                {t('detail.purchaseDate')}
              </p>
              <p className="text-lg">{formatDate(warranty.purchase_date)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                {t('detail.warrantyExpires')}
              </p>
              <p className={`text-lg ${status.color}`}>
                {formatDate(warranty.warranty_expires)}
              </p>
            </div>

            {warranty.category && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                  {t('detail.category')}
                </p>
                <p className="text-lg">{warranty.category}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {warranty.store && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                  {t('detail.store')}
                </p>
                <p className="text-lg">{warranty.store}</p>
              </div>
            )}

            {warranty.price && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                  {t('detail.price')}
                </p>
                <p className="text-lg">{warranty.price.toFixed(2)}</p>
              </div>
            )}

            {warranty.serial_number && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                  {t('detail.serialNumber')}
                </p>
                <p className="text-lg font-mono">{warranty.serial_number}</p>
              </div>
            )}
          </div>
        </div>

        {warranty.notes && (
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">
              {t('detail.notes')}
            </p>
            <p className="text-gray-400 whitespace-pre-wrap">{warranty.notes}</p>
          </div>
        )}

        {warranty.receipt_url && (
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
              {t('detail.receipt')}
            </p>
            {warranty.receipt_url.endsWith('.pdf') ? (
              <ReceiptLink filePath={warranty.receipt_url} />
            ) : (
              <ReceiptImage filePath={warranty.receipt_url} alt="Receipt" />
            )}
          </div>
        )}

        <div className="mb-8">
          <EUWarrantyInfo variant="detail" />
        </div>

        <div className="border-t border-gray-800 pt-8">
          <WarrantyActions warrantyId={warranty.id} />
        </div>
      </div>
    </main>
  )
}
