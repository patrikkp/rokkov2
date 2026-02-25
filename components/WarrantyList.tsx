'use client'

import Link from 'next/link'
import type { Database } from '@/lib/supabase/types'
import { useI18n } from '@/lib/i18n/context'

type Warranty = Database['public']['Tables']['warranties']['Row']

interface WarrantyListProps {
  warranties: Warranty[]
}

export default function WarrantyList({ warranties }: WarrantyListProps) {
  const { t, locale } = useI18n()

  const dateLocaleMap: Record<string, string> = {
    en: 'en-US', hr: 'hr-HR', sr: 'sr-RS', de: 'de-DE', si: 'sl-SI',
  }

  if (warranties.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-600 uppercase tracking-wider text-sm">
          {t('list.noWarranties')}
        </p>
        <Link
          href="/app/new"
          className="inline-block mt-6 text-accent hover:text-accent/80 uppercase tracking-wider text-xs"
        >
          {t('list.addFirst')}
        </Link>
      </div>
    )
  }

  const now = new Date().toISOString().split('T')[0]
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const getStatus = (expiryDate: string) => {
    if (expiryDate < now) return 'expired'
    if (expiryDate <= thirtyDaysFromNow) return 'expiring'
    return 'active'
  }

  const getStatusColor = (status: string) => {
    if (status === 'expired') return 'text-gray-700'
    if (status === 'expiring') return 'text-yellow-500'
    return 'text-accent'
  }

  const getStatusLabel = (status: string) => {
    if (status === 'expired') return t('list.expired')
    if (status === 'expiring') return t('list.expiring')
    return t('list.active')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(dateLocaleMap[locale] || 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {warranties.map((warranty) => {
        const status = getStatus(warranty.warranty_expires)
        const statusColor = getStatusColor(status)

        return (
          <Link
            key={warranty.id}
            href={`/app/warranty/${warranty.id}`}
            className="block border border-gray-800 hover:border-accent transition-all p-6 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-1 group-hover:text-accent transition-colors">
                  {warranty.product_name}
                </h3>
                {warranty.brand && (
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">
                    {warranty.brand}
                  </p>
                )}
                <div className="flex gap-6 text-xs uppercase tracking-widest text-gray-600">
                  <div>
                    <span className="text-gray-700">{t('list.purchased')}</span>{' '}
                    {formatDate(warranty.purchase_date)}
                  </div>
                  <div>
                    <span className="text-gray-700">{t('list.expires')}</span>{' '}
                    <span className={statusColor}>
                      {formatDate(warranty.warranty_expires)}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`text-xs uppercase tracking-widest ${statusColor}`}>
                {getStatusLabel(status)}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
