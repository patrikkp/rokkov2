'use client'

import { useI18n } from '@/lib/i18n/context'

interface ClaimErrorPageProps {
  type: 'invalid' | 'claimed' | 'expired'
}

export default function ClaimErrorPage({ type }: ClaimErrorPageProps) {
  const { t } = useI18n()

  const titles: Record<string, string> = {
    invalid: t('claim.invalidToken'),
    claimed: t('claim.alreadyClaimed'),
    expired: t('claim.tokenExpired'),
  }

  const messages: Record<string, string> = {
    invalid: t('claim.invalidTokenMsg'),
    claimed: t('claim.alreadyClaimedMsg'),
    expired: t('claim.tokenExpiredMsg'),
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold uppercase mb-4">{titles[type]}</h1>
        <p className="text-gray-500 mb-8">{messages[type]}</p>
        <a
          href="/app"
          className="inline-block px-6 py-3 bg-accent text-white uppercase tracking-wider text-sm font-medium hover:bg-accent/90 transition-all"
        >
          {t('claim.backToDashboard')}
        </a>
      </div>
    </main>
  )
}
