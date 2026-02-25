'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type ExpiringWarranty = {
  id: string
  product_name: string
  warranty_expires: string
  daysLeft: number
}

export default function NotificationBanner() {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<ExpiringWarranty[]>([])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    checkNotifications()
  }, [])

  const checkNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: settings } = await supabase
        .from('user_settings')
        .select('in_app_enabled, reminder_days')
        .eq('user_id', user.id)
        .single()

      if (!settings?.in_app_enabled) return

      const reminderDays = settings.reminder_days || 30
      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + reminderDays)

      const todayStr = today.toISOString().split('T')[0]
      const futureDateStr = futureDate.toISOString().split('T')[0]

      const { data: warranties } = await supabase
        .from('warranties')
        .select('id, product_name, warranty_expires')
        .eq('user_id', user.id)
        .gte('warranty_expires', todayStr)
        .lte('warranty_expires', futureDateStr)
        .order('warranty_expires', { ascending: true })

      if (!warranties || warranties.length === 0) return

      const withDays = warranties.map((w) => {
        const expires = new Date(w.warranty_expires)
        const diff = Math.ceil((expires.getTime() - today.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))
        return { ...w, daysLeft: Math.max(0, diff) }
      })

      setNotifications(withDays)
    } catch {
      // Silently fail — non-critical feature
    }
  }

  if (dismissed || notifications.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full">
      <div className="bg-[#111] border border-[#ff3131]/30 rounded-xl p-4 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff3131] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#ff3131] font-medium">
              {notifications.length} Expiring Soon
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-600 hover:text-gray-400 transition-colors leading-none"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1">
          {notifications.slice(0, 3).map((w) => (
            <Link
              key={w.id}
              href={`/app/warranty/${w.id}`}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors group"
            >
              <span className="text-sm text-white truncate group-hover:text-[#ff3131] transition-colors">
                {w.product_name}
              </span>
              <span
                className={`text-xs ml-3 flex-shrink-0 font-medium ${
                  w.daysLeft <= 3
                    ? 'text-[#ff3131]'
                    : w.daysLeft <= 14
                    ? 'text-orange-400'
                    : 'text-gray-400'
                }`}
              >
                {w.daysLeft === 0 ? 'Today!' : `${w.daysLeft}d`}
              </span>
            </Link>
          ))}

          {notifications.length > 3 && (
            <Link
              href="/app"
              className="block text-xs text-gray-500 hover:text-[#ff3131] transition-colors pt-2 text-center"
            >
              +{notifications.length - 3} more warranties
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
