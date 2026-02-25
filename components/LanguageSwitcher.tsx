'use client'

import { useState, useRef, useEffect } from 'react'
import { useI18n } from '@/lib/i18n/context'
import { Locale, localeNames } from '@/lib/i18n/translations'

const flagEmojis: Record<Locale, string> = {
  en: '🇬🇧',
  hr: '🇭🇷',
  sr: '🇷🇸',
  de: '🇩🇪',
  si: '🇸🇮',
}

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  const locales: Locale[] = ['en', 'hr', 'sr', 'de', 'si']

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full border-2 border-gray-800 bg-black hover:border-accent transition-all flex items-center justify-center text-2xl"
        aria-label="Change language"
      >
        {flagEmojis[locale]}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-14 right-0 w-48 bg-black border border-gray-800 shadow-xl z-40">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all ${
                  locale === loc
                    ? 'bg-accent/10 text-accent border-l-2 border-accent'
                    : 'text-gray-300 hover:bg-gray-900 hover:text-accent'
                }`}
              >
                <span className="text-2xl">{flagEmojis[loc]}</span>
                <span className="text-sm uppercase tracking-wider">{localeNames[loc]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
