'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

interface EUWarrantyInfoProps {
  variant?: 'form' | 'detail'
}

export default function EUWarrantyInfo({ variant = 'form' }: EUWarrantyInfoProps) {
  const { t } = useI18n()
  const [showModal, setShowModal] = useState(false)

  const isForm = variant === 'form'

  return (
    <>
      <div className={`${isForm ? 'bg-gradient-to-br from-[#ff3131]/10 to-transparent border border-[#ff3131]/20 rounded-xl p-6' : 'bg-gradient-to-br from-[#ff3131]/5 to-transparent border border-[#ff3131]/10 rounded-xl p-6'}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff3131] to-[#cc2828] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              {t('euWarranty.title')}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {t('euWarranty.description')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#ff3131]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-300">{t('euWarranty.legal2Years')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#ff3131]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-300">{t('euWarranty.sellerObligation')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#ff3131]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-300">{t('euWarranty.repairOrReplace')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#ff3131]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-300">{t('euWarranty.reverseBurden')}</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 text-sm text-[#ff3131] hover:text-white transition-colors group"
            >
              <span>{t('euWarranty.viewMore')}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-[#0a0a0a] border border-[#ff3131]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#ff3131] to-[#cc2828] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{t('euWarranty.modalTitle')}</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* EU Legal Warranty Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#ff3131] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ff3131] rounded-full"></span>
                    {t('euWarranty.legalTitle')}
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {t('euWarranty.legalDesc1')}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {t('euWarranty.legalDesc2')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-[#ff3131] font-bold text-lg mb-1">2 {t('euWarranty.years')}</div>
                        <div className="text-xs text-gray-400">{t('euWarranty.minimumDuration')}</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-[#ff3131] font-bold text-lg mb-1">6 {t('euWarranty.months')}</div>
                        <div className="text-xs text-gray-400">{t('euWarranty.reverseBurdenProof')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Effective Protection Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    {t('euWarranty.protectionTitle')}
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {t('euWarranty.protectionDesc1')}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {t('euWarranty.protectionDesc2')}
                    </p>
                    <ul className="space-y-2 mt-3">
                      <li className="flex items-start gap-2 text-sm text-gray-300">
                        <svg className="w-5 h-5 text-[#ff3131] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                        </svg>
                        <span>{t('euWarranty.point1')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-300">
                        <svg className="w-5 h-5 text-[#ff3131] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                        </svg>
                        <span>{t('euWarranty.point2')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-300">
                        <svg className="w-5 h-5 text-[#ff3131] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                        </svg>
                        <span>{t('euWarranty.point3')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* How It Works */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    {t('euWarranty.howItWorks')}
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <ol className="space-y-3">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#ff3131] rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>
                        <div>
                          <p className="text-sm font-medium text-white">{t('euWarranty.step1Title')}</p>
                          <p className="text-xs text-gray-400">{t('euWarranty.step1Desc')}</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#ff3131] rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>
                        <div>
                          <p className="text-sm font-medium text-white">{t('euWarranty.step2Title')}</p>
                          <p className="text-xs text-gray-400">{t('euWarranty.step2Desc')}</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#ff3131] rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
                        <div>
                          <p className="text-sm font-medium text-white">{t('euWarranty.step3Title')}</p>
                          <p className="text-xs text-gray-400">{t('euWarranty.step3Desc')}</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 italic">
                    {t('euWarranty.disclaimer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
