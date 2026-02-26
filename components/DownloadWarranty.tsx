'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'
import type { Database } from '@/lib/supabase/types'

type Warranty = Database['public']['Tables']['warranties']['Row']

interface DownloadWarrantyProps {
  warranty: Warranty
}

export default function DownloadWarranty({ warranty }: DownloadWarrantyProps) {
  const [showModal, setShowModal] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const { t, locale } = useI18n()

  const dateLocaleMap: Record<string, string> = {
    en: 'en-US', hr: 'hr-HR', sr: 'sr-RS', de: 'de-DE', si: 'sl-SI',
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(dateLocaleMap[locale] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const downloadAsPDF = async () => {
    setDownloading(true)
    try {
      // Dynamic import jsPDF
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      doc.setFontSize(18)
      doc.text(warranty.product_name, 20, 20)

      if (warranty.brand) {
        doc.setFontSize(12)
        doc.text(warranty.brand, 20, 30)
      }

      doc.setFontSize(10)
      let y = 45
      doc.text(`${t('detail.purchaseDate')}: ${formatDate(warranty.purchase_date)}`, 20, y)
      y += 10
      doc.text(`${t('detail.warrantyExpires')}: ${formatDate(warranty.warranty_expires)}`, 20, y)

      if (warranty.category) {
        y += 10
        doc.text(`${t('detail.category')}: ${warranty.category}`, 20, y)
      }
      if (warranty.store) {
        y += 10
        doc.text(`${t('detail.store')}: ${warranty.store}`, 20, y)
      }
      if (warranty.price) {
        y += 10
        doc.text(`${t('detail.price')}: ${warranty.price.toFixed(2)}`, 20, y)
      }
      if (warranty.serial_number) {
        y += 10
        doc.text(`${t('detail.serialNumber')}: ${warranty.serial_number}`, 20, y)
      }
      if (warranty.notes) {
        y += 10
        doc.text(`${t('detail.notes')}: ${warranty.notes}`, 20, y)
      }

      doc.save(`${warranty.product_name}_warranty.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setDownloading(false)
      setShowModal(false)
    }
  }

  const downloadAsImage = async () => {
    setDownloading(true)
    try {
      // Dynamic import html2canvas
      const { default: html2canvas } = await import('html2canvas')

      const canvas = document.createElement('canvas')
      canvas.width = 600
      canvas.height = 400
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      // Background
      ctx.fillStyle = '#1f2121'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Title
      ctx.fillStyle = '#f5f5f5'
      ctx.font = 'bold 24px sans-serif'
      ctx.fillText(warranty.product_name, 30, 50)

      // Brand
      if (warranty.brand) {
        ctx.font = '16px sans-serif'
        ctx.fillStyle = '#a7a9a9'
        ctx.fillText(warranty.brand, 30, 75)
      }

      // Details
      ctx.fillStyle = '#f5f5f5'
      ctx.font = '14px sans-serif'
      let y = 110
      ctx.fillText(`${t('detail.purchaseDate')}: ${formatDate(warranty.purchase_date)}`, 30, y)
      y += 25
      ctx.fillText(`${t('detail.warrantyExpires')}: ${formatDate(warranty.warranty_expires)}`, 30, y)

      if (warranty.category) {
        y += 25
        ctx.fillText(`${t('detail.category')}: ${warranty.category}`, 30, y)
      }
      if (warranty.store) {
        y += 25
        ctx.fillText(`${t('detail.store')}: ${warranty.store}`, 30, y)
      }
      if (warranty.price) {
        y += 25
        ctx.fillText(`${t('detail.price')}: ${warranty.price.toFixed(2)}`, 30, y)
      }
      if (warranty.serial_number) {
        y += 25
        ctx.fillText(`${t('detail.serialNumber')}: ${warranty.serial_number}`, 30, y)
      }

      const link = document.createElement('a')
      link.download = `${warranty.product_name}_warranty.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (err) {
      console.error('Image generation error:', err)
    } finally {
      setDownloading(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 border border-gray-800 text-gray-400 uppercase tracking-wider text-xs font-medium hover:border-accent hover:text-accent transition-all"
      >
        {t('download.downloadBtn')}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-gray-800 rounded p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">{t('download.chooseFormat')}</h3>

            <div className="space-y-4">
              <button
                onClick={downloadAsPDF}
                disabled={downloading}
                className="w-full px-4 py-3 bg-accent text-background uppercase tracking-wider text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {downloading ? t('download.downloading') : t('download.downloadPDF')}
              </button>

              <button
                onClick={downloadAsImage}
                disabled={downloading}
                className="w-full px-4 py-3 border border-gray-800 text-gray-400 uppercase tracking-wider text-sm font-medium hover:border-accent hover:text-accent transition-all disabled:opacity-50"
              >
                {downloading ? t('download.downloading') : t('download.downloadImage')}
              </button>

              <button
                onClick={() => setShowModal(false)}
                disabled={downloading}
                className="w-full px-4 py-3 text-gray-500 uppercase tracking-wider text-xs font-medium hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                {t('download.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
