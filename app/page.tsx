'use client'

import Link from 'next/link'
import ParticlesBackground from '@/components/ParticlesBackground'
import { useI18n } from '@/lib/i18n/context'

export default function LandingPage() {
  const { t } = useI18n()

  return (
    <>
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <ParticlesBackground />
        
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="text-center mb-24">
            <h1 className="text-7xl md:text-9xl font-bold tracking-tight mb-8 uppercase">
              ROKKO
            </h1>
            
            <p className="text-2xl md:text-3xl font-light text-gray-300 max-w-3xl mx-auto">
              {t('landing.tagline1')} <span className="text-[#ff3131]">{t('landing.tagline2')}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
              <Link
                href="/auth"
                className="group relative px-8 py-4 bg-accent text-white uppercase tracking-wider text-sm font-medium transition-all duration-300 hover:bg-accent/90"
              >
                <span className="relative z-10">{t('landing.getStarted')}</span>
                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>
              
              <Link
                href="/auth"
                className="px-8 py-4 border border-gray-700 text-gray-300 uppercase tracking-wider text-sm font-medium hover:border-accent hover:text-accent transition-all duration-300"
              >
                {t('landing.signIn')}
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 mt-8 text-xs text-gray-500">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>{t('landing.sslEncrypted')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-24" style={{ perspective: '1000px' }}>
          <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-[#ff3131]/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ff3131]/20" style={{ transformStyle: 'preserve-3d' }}>
            <div className="rounded-2xl bg-[#ff3131]/10 w-14 h-14 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <svg className="w-7 h-7 text-[#ff3131]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#ff3131] transition-colors duration-300 tracking-tight">{t('landing.feature1Title')}</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">{t('landing.feature1Desc')}</p>
          </div>

          <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-400/20" style={{ transformStyle: 'preserve-3d' }}>
            <div className="rounded-2xl bg-blue-400/10 w-14 h-14 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 tracking-tight">{t('landing.feature2Title')}</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">{t('landing.feature2Desc')}</p>
          </div>

          <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-400/20" style={{ transformStyle: 'preserve-3d' }}>
            <div className="rounded-2xl bg-emerald-400/10 w-14 h-14 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 tracking-tight">{t('landing.feature3Title')}</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">{t('landing.feature3Desc')}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mt-16 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>{t('landing.gdprCompliant')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">⚡</span>
            <span>{t('landing.poweredBy')}</span>
          </div>
        </div>
      </div>
    </main>

    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff3131]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff3131]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-[#ff3131]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-300 font-medium">Sigurnost na prvom mjestu</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('landing.trustTitle')}
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">{t('landing.trustSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-[#ff3131]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3131]/20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff3131]/0 to-[#ff3131]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff3131] to-[#cc2828] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#ff3131] transition-colors">{t('landing.secureStorage')}</h3>
              <p className="text-gray-400 leading-relaxed">{t('landing.secureStorageDesc')}</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-gray-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/20">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400/0 to-gray-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-300 transition-colors">{t('landing.gdprTitle')}</h3>
              <p className="text-gray-400 leading-relaxed">{t('landing.gdprDesc')}</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-[#ff3131]/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3131]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff3131]/0 to-[#ff3131]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-300 transition-colors">{t('landing.deleteAnytime')}</h3>
              <p className="text-gray-400 leading-relaxed">{t('landing.deleteAnytimeDesc')}</p>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-r from-[#ff3131]/10 via-gray-900/50 to-[#ff3131]/10 backdrop-blur-xl border border-[#ff3131]/20 rounded-3xl p-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff3131]/5 via-transparent to-[#ff3131]/5"></div>
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ff3131] to-[#cc2828] rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">{t('landing.privacyPromise')}</h3>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">{t('landing.privacyPromiseDesc')}</p>
          </div>
        </div>
      </div>
    </section>

    <section className="relative py-32 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff3131]/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('landing.socialProofTitle')}
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">{t('landing.socialProofSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-[#ff3131]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3131]/20">
            <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg className="w-12 h-12 text-[#ff3131]/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff3131] to-[#cc2828] flex items-center justify-center text-white font-bold text-xl ring-4 ring-[#ff3131]/20">
                M
              </div>
              <div>
                <div className="font-bold text-white text-lg">Marko P.</div>
                <div className="text-sm text-gray-400">Zagreb, HR</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">"{t('landing.testimonial1')}"</p>
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-gray-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/20">
            <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg className="w-12 h-12 text-gray-500/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold text-xl ring-4 ring-gray-600/20">
                A
              </div>
              <div>
                <div className="font-bold text-white text-lg">Ana K.</div>
                <div className="text-sm text-gray-400">Beograd, RS</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">"{t('landing.testimonial2')}"</p>
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-[#ff3131]/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3131]/10">
            <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg className="w-12 h-12 text-gray-600/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-bold text-xl ring-4 ring-gray-700/20">
                L
              </div>
              <div>
                <div className="font-bold text-white text-lg">Luka M.</div>
                <div className="text-sm text-gray-400">Ljubljana, SI</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">"{t('landing.testimonial3')}"</p>
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full px-8 py-4 hover:border-[#ff3131]/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#ff3131] to-[#cc2828] rounded-full">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">{t('landing.userCount')}</span>
          </div>
        </div>
      </div>
    </section>

    <footer className="relative py-20 bg-black border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ff3131]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff3131]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="text-6xl font-bold text-white mb-4 tracking-tight">ROKKO</div>
          <p className="text-gray-400 text-lg max-w-md">
            Tvoj digitalni trezor za garanciju
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
          <Link 
            href="/privacy" 
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5 text-gray-500 group-hover:text-[#ff3131] transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="font-medium">{t('landing.privacyPolicy')}</span>
          </Link>
          
          <div className="hidden md:block w-px h-6 bg-white/10"></div>
          
          <Link 
            href="/terms" 
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="font-medium">{t('landing.termsOfService')}</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10">
          <div className="text-gray-500 text-sm">
            © 2026 ROKKO. {t('landing.allRightsReserved')}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 text-[#ff3131]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Powered by Supabase</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
