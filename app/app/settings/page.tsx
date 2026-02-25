'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'

export default function SettingsPage() {
  const { t, locale } = useI18n()
  const supabase = createClient()
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderDays, setReminderDays] = useState(7)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('user_settings')
        .select('reminder_enabled, reminder_days')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setReminderEnabled(data.reminder_enabled)
        setReminderDays(data.reminder_days)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          reminder_enabled: reminderEnabled,
          reminder_days: reminderDays,
          locale: locale,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-gray-500">{t('auth.loading')}</div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/app"
          className="inline-block mb-8 text-sm uppercase tracking-widest text-gray-500 hover:text-accent transition-colors"
        >
          {t('settings.back')}
        </Link>

        <h1 className="text-5xl font-bold tracking-tight uppercase mb-12">
          {t('settings.title')}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded">
            {error}
          </div>
        )}

        <div className="space-y-12">
          <div className="bg-gradient-to-br from-[#ff3131]/5 to-transparent border border-[#ff3131]/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff3131] to-[#cc2828] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-2">
                  {t('settings.notifications')}
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Get email reminders before your warranties expire.
                </p>
              </div>
            </div>

            <div className="space-y-6 mt-6">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    reminderEnabled ? 'bg-[#ff3131]' : 'bg-gray-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                      reminderEnabled ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-300 group-hover:text-[#ff3131] transition-colors">
                  {t('settings.enableReminders')}
                </span>
              </label>

              {reminderEnabled && (
                <div className="bg-black/30 rounded-lg p-4">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">
                    {t('settings.reminderDays')}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={reminderDays}
                      onChange={(e) => setReminderDays(parseInt(e.target.value))}
                      className="flex-1 accent-[#ff3131]"
                    />
                    <span className="text-2xl font-bold text-[#ff3131] w-12 text-right">
                      {reminderDays}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    You will receive an email {reminderDays} days before each warranty expires.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <button
              onClick={handleSave}
              disabled={saved}
              className="px-8 py-4 bg-[#ff3131] text-white uppercase tracking-wider text-sm font-medium hover:bg-[#cc2828] transition-all disabled:opacity-50"
            >
              {saved ? `✓ ${t('settings.saved')}` : t('settings.save')}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
