'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ParticlesBackground from '@/components/ParticlesBackground'
import { useI18n } from '@/lib/i18n/context'

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { t } = useI18n()

  const urlError = searchParams.get('error')

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error

        if (data.session) {
          // Email confirmation disabled — direct login
          router.push('/app')
        } else {
          // Email confirmation enabled — show check email screen
          setEmailSent(true)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/app')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
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
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      setLoading(false)
    }
  }

  // ── Email sent screen ──────────────────────────────────────────
  if (emailSent) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6">
        <ParticlesBackground />
        <div className="relative z-10 w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-8 border border-accent flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 uppercase">
            Check your email
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
            We sent a confirmation link to
          </p>
          <p className="text-accent text-sm mb-8 font-medium">{email}</p>
          <p className="text-gray-600 text-xs uppercase tracking-wider leading-relaxed mb-12">
            Click the link in the email to activate your account.<br />
            The link expires in 24 hours.
          </p>
          <button
            onClick={() => {
              setEmailSent(false)
              setIsSignUp(false)
              setEmail('')
              setPassword('')
            }}
            className="text-sm text-gray-500 hover:text-accent transition-colors uppercase tracking-wider"
          >
            ← Back to login
          </button>
        </div>
      </main>
    )
  }

  // ── Main auth form ─────────────────────────────────────────────
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

        {urlError === 'confirmation_failed' && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center uppercase tracking-wide">
            Confirmation link is invalid or expired. Please try again.
          </div>
        )}

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

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <AuthForm />
    </Suspense>
  )
}
