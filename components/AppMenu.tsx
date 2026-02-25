'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'

interface AppMenuProps {
  userEmail: string
}

export default function AppMenu({ userEmail }: AppMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { t } = useI18n()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-8 right-8 z-30 text-xs uppercase tracking-widest text-gray-500 hover:text-accent transition-colors"
      >
        {t('menu.menu')}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 w-full max-w-md h-full bg-black/90 backdrop-blur-xl z-50 p-12 border-l border-gray-800">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-xs uppercase tracking-widest text-gray-500 hover:text-accent transition-colors"
            >
              {t('menu.close')}
            </button>

            <div className="mt-16 space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">
                  {t('menu.signedInAs')}
                </p>
                <p className="text-sm text-gray-400">{userEmail}</p>
              </div>

              <div className="h-px bg-gray-800" />

              <nav className="space-y-4">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/app')
                  }}
                  className="block w-full text-left text-lg uppercase tracking-wider text-gray-300 hover:text-accent transition-colors"
                >
                  {t('menu.dashboard')}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/app/new')
                  }}
                  className="block w-full text-left text-lg uppercase tracking-wider text-gray-300 hover:text-accent transition-colors"
                >
                  {t('menu.addWarranty')}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/app/settings')
                  }}
                  className="block w-full text-left text-lg uppercase tracking-wider text-gray-300 hover:text-accent transition-colors"
                >
                  {t('menu.settings')}
                </button>
              </nav>

              <div className="h-px bg-gray-800" />

              <button
                onClick={handleSignOut}
                className="block w-full text-left text-lg uppercase tracking-wider text-gray-500 hover:text-accent transition-colors"
              >
                {t('menu.signOut')}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
