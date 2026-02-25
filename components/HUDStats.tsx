'use client'

import { useI18n } from '@/lib/i18n/context'
import LanguageSwitcher from './LanguageSwitcher'

interface HUDStatsProps {
  active: number
  expiring: number
  expired: number
}

export default function HUDStats({ active, expiring, expired }: HUDStatsProps) {
  const { t } = useI18n()

  return (
    <>
      <div className="fixed top-8 left-8 z-20 space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-xs uppercase tracking-widest text-gray-600">{t('dashboard.active')}</span>
          <span className="text-2xl font-bold text-accent">{active}</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-xs uppercase tracking-widest text-gray-600">{t('dashboard.expiring')}</span>
          <span className="text-2xl font-bold text-yellow-500">{expiring}</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-xs uppercase tracking-widest text-gray-600">{t('dashboard.expired')}</span>
          <span className="text-2xl font-bold text-gray-700">{expired}</span>
        </div>
      </div>

      <div className="fixed top-6 right-24 z-20">
        <LanguageSwitcher />
      </div>
    </>
  )
}
