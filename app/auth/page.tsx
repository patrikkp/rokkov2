'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ParticlesBackground from '@/components/ParticlesBackground'
import { useI18n } from '@/lib/i18n/context'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { t } = useI18n()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
          },
        })
        if (error) throw error
        alert(t('auth.checkEmail'))
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/app')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <ParticlesBackground />

      <Link
        href="/"
        className="absolute top-8 left-8 text-sm uppercase tracking-widest text-gray-500 hover:text-accent transition-colors"
      >
        {t('auth.back')}
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <h1 className="text-5xl font-bold tracking-tight mb-2 uppercase text-center">
          {isSignUp ? t('auth.signUp') : t('auth.signIn')}
        </h1>
        <p className="text-gray-500 text-center mb-12 uppercase tracking-wider text-xs">
          {isSignUp ? t('auth.createAccount') : t('auth.welcomeBack')}
        </p>

        <form onSubmit={handleEmailAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-accent text-white uppercase tracking-wider text-sm font-medium hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('auth.loading') : isSignUp ? t('auth.create') : t('auth.signIn')}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="px-4 bg-[#0a0a0a] text-gray-600">{t('auth.or')}</span>
          </div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full px-8 py-4 border border-gray-800 text-gray-300 uppercase tracking-wider text-sm font-medium hover:border-accent hover:text-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('auth.continueGoogle')}
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-sm text-gray-500 hover:text-accent transition-colors uppercase tracking-wider"
          >
            {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}
          </button>
        </div>
      </div>
    </main>
  )
}
