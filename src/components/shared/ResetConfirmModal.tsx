'use client';

import React, { useEffect, useState } from 'react';
import { RotateCcw, X, AlertTriangle, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { useLandApp } from '@/context/LandRegistryContext';

export const ResetConfirmModal: React.FC = () => {
  const { isResetModalOpen, setIsResetModalOpen, resetDemoData, language, showNotification } = useLandApp();
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isResetModalOpen) {
        setIsResetModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResetModalOpen, setIsResetModalOpen]);

  const handleDismissToast = () => {
    setToastVisible(false);
    setTimeout(() => {
      setShowToast(false);
    }, 1000); // 1s fade-out duration
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setIsResetModalOpen(false);

    if (showNotification) {
      showNotification({
        en: 'Simulation ledger successfully reset to LandTech 2026 baseline.',
        bn: 'সিমুলেশন লেজার সফলভাবে প্রারম্ভিক অবস্থায় রিসেট করা হয়েছে।',
      }, 'success');
    } else {
      // Fallback local toast with exact 1s fade-in
      setShowToast(true);
      setToastVisible(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setToastVisible(true);
        });
      });

      setTimeout(() => {
        handleDismissToast();
      }, 4500);
    }
  };

  return (
    <>
      {/* ── Success Feedback Toast (Fades in over 1s) ── */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-16 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#121215]/95 backdrop-blur-md text-[#f4f4f5] border border-[#d4a657] shadow-gold rounded-lg font-mono text-xs select-none max-w-md transition-all duration-1000 ease-in-out ${
            toastVisible
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
          style={{
            transitionDuration: '1000ms',
            transitionProperty: 'opacity, transform',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />
          <span className="leading-snug text-left">
            {language === 'en'
              ? 'Simulation ledger successfully reset to LandTech 2026 baseline.'
              : 'সিমুলেশন লেজার সফলভাবে প্রারম্ভিক অবস্থায় রিসেট করা হয়েছে।'}
          </span>
          <button
            type="button"
            onClick={handleDismissToast}
            className="ml-2 text-[#a1a1aa] hover:text-[#f4f4f5] p-1 rounded-md hover:bg-[#1b1b1f] cursor-pointer focus:outline-none transition-colors shrink-0"
            title={language === 'en' ? 'Dismiss' : 'বন্ধ করুন'}
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Reset Confirmation Dialog ── */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
          <div className="relative w-full max-w-lg bg-[#09090b] rounded-xl shadow-2xl border border-[#27272a] overflow-hidden font-sans">
            
            {/* Modal Header */}
            <div className="bg-[#121215] text-[#f4f4f5] p-5 sm:p-6 border-b border-[#27272a]">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono font-medium bg-[#231d13] text-[#d4a657] border border-[#4a3a1f]">
                    <RotateCcw className="w-3 h-3 text-[#d4a657]" />
                    {language === 'en' ? 'SYSTEM RESET PROTOCOL' : 'সিস্টেম রিসেট প্রটোকল'}
                  </span>
                  <h3 className="text-xl font-display font-semibold text-[#f4f4f5] tracking-tight">
                    {language === 'en' ? 'Restore Demo State to Baseline?' : 'প্রারম্ভিক মূল্যায়নে রিসেট করবেন?'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="text-[#a1a1aa] hover:text-[#f4f4f5] p-1.5 rounded-md hover:bg-[#1b1b1f] border border-transparent hover:border-[#27272a] transition-colors cursor-pointer focus:outline-none"
                  title="Close (Esc)"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 text-xs">
              {/* Alert Callout */}
              <div className="bg-[#141413] border border-[#4a3a1f] p-4 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#d4a657] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-mono text-xs text-[#d4a657] font-semibold uppercase tracking-wider">
                    {language === 'en' ? 'State Synchronization Reset' : 'সিস্টেম স্টেট রিসেট'}
                  </div>
                  <p className="text-[#f4f4f5] leading-relaxed">
                    {language === 'en'
                      ? 'This will clear all pending simulated transactions and restore the unified registry to pristine LandTech 2026 hackathon benchmark data.'
                      : 'এটি সকল পেন্ডিং সিমুলেটেড লেনদেন মুছে ফেলবে এবং ইউনিফাইড রেজিস্ট্রি রেকর্ডকে প্রারম্ভিক হ্যাকাথন টেস্ট বেঞ্চমার্কে ফিরিয়ে আনবে।'}
                  </p>
                </div>
              </div>

              {/* What will be reset list */}
              <div className="bg-[#121215] border border-[#27272a] p-4 rounded-lg space-y-2.5">
                <span className="font-mono text-[11px] text-[#a1a1aa] uppercase tracking-wider block">
                  {language === 'en' ? 'Ledger Entities Affected:' : 'যেসব রেকর্ড রিসেট হবে:'}
                </span>

                <ul className="space-y-2 text-[#a1a1aa]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4a657] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#f4f4f5]">
                        {language === 'en' ? '4 Cadastral Parcels:' : '৪টি ক্যাডাস্ট্রাল দাগ:'}
                      </strong>{' '}
                      {language === 'en'
                        ? 'Dag #405, #512, #209, and #881 area balances & escrow locks reset.'
                        : 'দাগ নং ৪০৫, ৫১২, ২০৯ ও ৮৮১ এর জমির পরিমাপ ও লক প্রারম্ভিক অবস্থায় ফিরবে।'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4a657] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#f4f4f5]">
                        {language === 'en' ? 'e-Mutation Queue:' : 'ই-নামজারি কিউ:'}
                      </strong>{' '}
                      {language === 'en'
                        ? 'All pending Sub-Registrar sealed deeds & AC Land cases wiped.'
                        : 'সাব-রেজিস্ট্রি কর্তৃক রেজিস্ট্রিকৃত নতুন দলিল ও এসি ল্যান্ডের কেস ফাইল মুছে যাবে।'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4a657] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#f4f4f5]">
                        {language === 'en' ? '5-Point Consensus Audit:' : '৫-স্তরের কনসেনসাস অডিট:'}
                      </strong>{' '}
                      {language === 'en'
                        ? 'Diagnostic verification checklist cleared to pre-audit state.'
                        : 'যাচাই চেকলিস্ট ও ব্লকড ট্রানজেকশন কাউন্টার প্রারম্ভিক সংখ্যায় ফিরবে।'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Preferences Kept Note */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#71717a] pt-1">
                <Database className="w-3.5 h-3.5 text-[#71717a]" />
                <span>
                  {language === 'en'
                    ? 'Theme and language preferences remain preserved.'
                    : 'থিম ও ভাষার পছন্দসমূহ অপরিবর্তিত থাকবে।'}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-[#121215] px-5 sm:px-6 py-4 border-t border-[#27272a] flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-[#1b1b1f] hover:bg-[#242429] text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#27272a] transition-colors cursor-pointer focus:outline-none"
              >
                {language === 'en' ? 'Cancel' : 'বাতিল'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#d4a657] hover:bg-[#be8a3a] text-[#09090b] font-semibold border border-[#d4a657] shadow-gold transition-colors cursor-pointer focus:outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Confirm & Reset Ledger' : 'নিশ্চিত করে রিসেট করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetConfirmModal;
