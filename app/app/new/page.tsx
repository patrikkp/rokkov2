'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'
import EUWarrantyInfo from '@/components/EUWarrantyInfo'

export default function NewWarrantyPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const { t } = useI18n()

  const [formData, setFormData] = useState({
    product_name: '',
    brand: '',
    purchase_date: '',
    warranty_expires: '',
    category: '',
    store: '',
    price: '',
    serial_number: '',
    notes: '',
  })

  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 40 * 1024 * 1024) {
        setError(t('new.fileTooLarge'))
        return
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        setError(t('new.invalidFileType'))
        return
      }
      setReceiptFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let receiptUrl = null

      if (receiptFile) {
        setUploading(true)
        const fileExt = receiptFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, receiptFile)

        if (uploadError) throw uploadError

        receiptUrl = fileName
        setUploading(false)
      }

      const { error: insertError } = await supabase
        .from('warranties')
        .insert({
          user_id: user.id,
          product_name: formData.product_name,
          brand: formData.brand || null,
          purchase_date: formData.purchase_date,
          warranty_expires: formData.warranty_expires,
          category: formData.category || null,
          store: formData.store || null,
          price: formData.price ? parseFloat(formData.price) : null,
          serial_number: formData.serial_number || null,
          notes: formData.notes || null,
          receipt_url: receiptUrl,
        })

      if (insertError) throw insertError

      router.push('/app')
    } catch (err: any) {
      setError(err.message)
      setUploading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/app"
          className="inline-block mb-8 text-sm uppercase tracking-widest text-gray-500 hover:text-accent transition-colors"
        >
          {t('new.backToDashboard')}
        </Link>

        <h1 className="text-5xl font-bold tracking-tight uppercase mb-12">
          {t('new.title')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              {t('new.productName')} *
            </label>
            <input
              type="text"
              required
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
              placeholder="MacBook Pro 16"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                {t('new.brand')}
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
                placeholder="Apple"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                {t('new.category')}
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                {t('new.purchaseDate')} *
              </label>
              <input
                type="date"
                required
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                {t('new.warrantyExpires')} *
              </label>
              <input
                type="date"
                required
                value={formData.warranty_expires}
                onChange={(e) => setFormData({ ...formData, warranty_expires: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                {t('new.store')}
              </label>
              <input
                type="text"
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                {t('new.price')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
                placeholder="2499.99"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              {t('new.serialNumber')}
            </label>
            <input
              type="text"
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white"
              placeholder="SN-XXXX-XXXX"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              {t('new.notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white resize-none"
              placeholder={t('new.additionalInfo')}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              {t('new.receipt')}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-800 focus:border-accent outline-none transition-colors text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-accent file:text-white file:uppercase file:tracking-wider file:text-xs file:cursor-pointer"
            />
            {receiptFile && (
              <p className="mt-2 text-sm text-gray-500">
                {t('new.selected')} {receiptFile.name}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <EUWarrantyInfo variant="form" />

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 px-8 py-4 bg-accent text-white uppercase tracking-wider text-sm font-medium hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? t('new.uploading') : loading ? t('new.saving') : t('new.addWarranty')}
            </button>
            <Link
              href="/app"
              className="px-8 py-4 border border-gray-800 text-gray-300 uppercase tracking-wider text-sm font-medium hover:border-accent hover:text-accent transition-all"
            >
              {t('new.cancel')}
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
