'use client'

import Link from 'next/link'
import ParticlesBackground from '@/components/ParticlesBackground'
import WarrantyList from '@/components/WarrantyList'
import HUDStats from '@/components/HUDStats'
import AppMenu from '@/components/AppMenu'
import { useI18n } from '@/lib/i18n/context'
import type { Database } from '@/lib/supabase/types'

type Warranty = Database['public']['Tables']['warranties']['Row']

interface DashboardClientProps {
  warranties: Warranty[]
  userEmail: string
  active: number
  expiring: number
  expired: number
}

export default function DashboardClient({ warranties, userEmail, active, expiring, expired }: DashboardClientProps) {
  const { t } = useI18n()

  return (
    <main className="relative min-h-screen">
      <ParticlesBackground />
      
      <HUDStats active={active} expiring={expiring} expired={expired} />
      <AppMenu userEmail={userEmail} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight uppercase mb-2">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-500 uppercase tracking-wider text-xs">
              {warranties.length} {t('dashboard.total')}
            </p>
          </div>

          <Link
            href="/app/new"
            className="px-6 py-3 bg-accent text-white uppercase tracking-wider text-sm font-medium hover:bg-accent/90 transition-all"
          >
            {t('dashboard.addWarranty')}
          </Link>
        </div>

        <WarrantyList warranties={warranties} />
      </div>
    </main>
  )
}
