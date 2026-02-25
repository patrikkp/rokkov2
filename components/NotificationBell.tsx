'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type ExpiringWarranty = {
  id: string
  product_name: string
  warranty_expires: string
  daysLeft: number
}

export default function NotificationBell() {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<ExpiringWarranty[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkNotifications()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

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
        const diff = Math.ceil(
          (expires.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
        )
        return { ...w, daysLeft: Math.max(0, diff) }
      })

      setNotifications(withDays)
    } catch {
      // Silently fail
    } finally {
      setLoaded(true)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full border-2 bg-black transition-all flex items-center justify-center relative ${
          isOpen ? 'border-[#ff3131]' : 'border-gray-800 hover:border-[#ff3131]'
        }`}
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-colors ${
            notifications.length > 0 ? 'text-[#ff3131]' : 'text-gray-500'
          }`}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {loaded && notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff3131] text-white text-[10px] flex items-center justify-center font-bold leading-none">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-14 right-0 w-72 bg-[#0a0a0a] border border-gray-800 shadow-2xl shadow-black/50 z-40 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-gray-500">Notifications</p>
              {notifications.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff3131] animate-pulse" />
                  <span className="text-xs text-[#ff3131]">{notifications.length} expiring</span>
                </div>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700 mx-auto mb-3"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p className="text-xs text-gray-600 uppercase tracking-wider">All warranties are fine</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800/50 max-h-64 overflow-y-auto">
                {notifications.map((w) => (
                  <Link
                    key={w.id}
                    href={`/app/warranty/${w.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          w.daysLeft <= 3
                            ? 'bg-[#ff3131]'
                            : w.daysLeft <= 14
                            ? 'bg-orange-400'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                        {w.product_name}
                      </span>
                    </div>
                    <span
                      className={`text-xs flex-shrink-0 font-medium ml-3 ${
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
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
