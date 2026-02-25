'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import WarrantyQRCode from './WarrantyQRCode'
import { useI18n } from '@/lib/i18n/context'

interface WarrantyActionsProps {
  warrantyId: string
}

export default function WarrantyActions({ warrantyId }: WarrantyActionsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { t } = useI18n()

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const { error } = await supabase
        .from('warranties')
        .delete()
        .eq('id', warrantyId)

      if (error) throw error

      router.push('/app')
    } catch (err) {
      console.error('Error deleting warranty:', err)
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm uppercase tracking-widest text-gray-600 mb-4">
          {t('actions.transfer')}
        </h3>
        <WarrantyQRCode warrantyId={warrantyId} />
      </div>

      <div className="border-t border-gray-800 pt-6">
        <h3 className="text-sm uppercase tracking-widest text-gray-600 mb-4">
          {t('actions.dangerZone')}
        </h3>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={deleting}
          className="px-6 py-3 border border-red-900 text-red-500 uppercase tracking-wider text-sm font-medium hover:border-red-500 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? t('actions.deleting') : t('actions.deleteWarranty')}
        </button>
      </div>

      {showConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={() => setShowConfirm(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-black border border-gray-800 p-8 z-50">
            <h3 className="text-2xl font-bold uppercase mb-4">{t('actions.confirmDelete')}</h3>
            <p className="text-gray-400 mb-8">
              {t('actions.confirmDeleteMsg')}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-500 text-white uppercase tracking-wider text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? t('actions.deleting') : t('actions.delete')}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 px-6 py-3 border border-gray-800 text-gray-300 uppercase tracking-wider text-sm font-medium hover:border-accent hover:text-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('actions.cancelAction')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
