import type { Metadata } from 'next'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'
import NoiseOverlay from '@/components/NoiseOverlay'
import { I18nProvider } from '@/lib/i18n/context'

export const metadata: Metadata = {
  title: 'ROKKO — Warranty Tracker',
  description: 'Track your warranties with precision',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <CustomCursor />
          <NoiseOverlay />
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
