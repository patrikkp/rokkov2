'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, translations } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('rokko-locale') as Locale
    if (saved && translations[saved]) {
      setLocaleState(saved)
      document.documentElement.lang = saved
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('rokko-locale', newLocale)
    document.documentElement.lang = newLocale
  }

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations['en']?.[key] || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
