'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'

const REMINDER_PRESETS = [7, 14, 30, 60, 90]

export default function SettingsPage() {
  const { t, locale } = useI18n()
  const supabase = createClient()
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [inAppEnabled, setInAppEnabled] = useState(false)
  const [reminderDays, setReminderDays] = useState(30)
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
        .select('reminder_enabled, reminder_days, in_app_enabled')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setEmailEnabled(data.reminder_enabled ?? false)
        setInAppEnabled(data.in_app_enabled ?? false)
        setReminderDays(REMINDER_PRESETS.includes(data.reminder_days) ? data.reminder_days : 30)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading settings'
      setError(msg)
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
          reminder_enabled: emailEnabled,
          reminder_days: reminderDays,
          in_app_enabled: inAppEnabled,
          locale,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving settings'
      setError(msg)
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

        <div className="space-y-8">

          {/* Notification Channels */}
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Notification Channels</h2>
            <div className="border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">

              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-sm font-medium text-white">Email Notifications</p>
                  <p className="text-xs text-gray-500 mt-0.5">Receive notifications about warranty expirations via email</p>
                </div>
                <div
                  onClick={() => setEmailEnabled(!emailEnabled)}
                  className={`w-12 h-6 rounded-full transition-all relative cursor-pointer flex-shrink-0 ml-4 ${
                    emailEnabled ? 'bg-[#ff3131]' : 'bg-gray-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                    emailEnabled ? 'left-6' : 'left-0.5'
                  }`} />
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-sm font-medium text-white">In-App Notifications</p>
                  <p className="text-xs text-gray-500 mt-0.5">Receive notifications within the application</p>
                </div>
                <div
                  onClick={() => setInAppEnabled(!inAppEnabled)}
                  className={`w-12 h-6 rounded-full transition-all relative cursor-pointer flex-shrink-0 ml-4 ${
                    inAppEnabled ? 'bg-[#ff3131]' : 'bg-gray-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                    inAppEnabled ? 'left-6' : 'left-0.5'
                  }`} />
                </div>
              </div>

            </div>
          </section>

          {/* Notification Timing */}
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Notification Timing</h2>
            <div className="border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">

              <div className="px-6 py-5">
                <p className="text-sm font-medium text-white mb-1">Warranty Expiration Notice</p>
                <p className="text-xs text-gray-500 mb-4">When should we notify you before a warranty expires?</p>
                <div className="flex flex-wrap gap-2">
                  {REMINDER_PRESETS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setReminderDays(days)}
                      className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all ${
                        reminderDays === days
                          ? 'border-[#ff3131] text-[#ff3131] bg-[#ff3131]/10'
                          : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                      }`}
                    >
                      {days} days before
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

          <div className="pt-2">
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
