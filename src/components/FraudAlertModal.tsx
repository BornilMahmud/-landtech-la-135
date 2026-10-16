'use client';

import React from 'react';
import { ShieldAlert, AlertOctagon, X, Scale } from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';

export const FraudAlertModal: React.FC = () => {
  const { fraudAlert, setFraudAlert, language, setActiveRole } = useLandApp();

  if (!fraudAlert || !fraudAlert.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121215]/70 animate-fade-in no-print">
      <div className="relative w-full max-w-lg bg-[#09090b] rounded-xl shadow-2xl border border-[#27272a] overflow-hidden">
        {/* Warning Header */}
        <div className="bg-[#121215] text-[#f4f4f5] p-5 sm:p-6 border-b border-[#27272a]">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono font-medium bg-[#231d13] text-[#d4a657] border border-[#4a3a1f]">
                {language === 'en' ? 'CONSENSUS DISCREPANCY DETECTED' : 'কনসেনসাস অডিট অসঙ্গতি'}
              </span>
              <h3 className="text-xl font-display font-normal text-[#f4f4f5]">
                {language === 'en' ? fraudAlert.titleEn : fraudAlert.titleBn}
              </h3>
            </div>
            <button
              onClick={() => setFraudAlert(null)}
              className="text-[#a1a1aa] hover:text-[#f4f4f5] p-1 rounded-md hover:bg-[#1b1b1f] transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="bg-[#231d13] border border-[#4a3a1f] p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-4 h-4 text-[#d4a657] shrink-0 mt-0.5" />
              <div className="text-xs font-sans text-[#d4a657] leading-relaxed">
                {language === 'en' ? fraudAlert.reasonEn : fraudAlert.reasonBn}
              </div>
            </div>
          </div>

          <div className="bg-[#121215] rounded-lg p-4 border border-[#27272a] space-y-2 text-xs font-sans text-[#a1a1aa]">
            <div className="font-mono text-xs uppercase tracking-wider text-[#f4f4f5] flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#f4f4f5]" />
              <span>{language === 'en' ? 'Statutory Governance Directives:' : 'আইনগত কার্যকারিতা:'}</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-xs text-[#a1a1aa] leading-relaxed font-sans">
              <li>
                {language === 'en' 
                  ? 'Registration Act 1908 & Transfer of Property Act 1882 prohibit deeds executing encumbered or defective title.'
                  : 'রেজিস্ট্রেশন আইন ১৯০৮ এবং সম্পত্তি হস্তান্তর আইন ১৮৮২ অনুযায়ী দায়যুক্ত জমির দলিল সম্পাদন নিষিদ্ধ।'}
              </li>
              <li>
                {language === 'en'
                  ? 'SmartBhoomi automated escrow locks prevent double-selling or double-mortgaging in real time.'
                  : 'স্মার্ট ভূমি স্বয়ংক্রিয় এসক্রো লকের মাধ্যমে একই জমির একাধিক দলিল বা বন্ধকী প্রতারণা সাথে সাথে প্রতিরোধ করে।'}
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-[#09090b] px-6 py-4 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
          <button
            onClick={() => {
              setFraudAlert(null);
              setActiveRole('bank_judiciary');
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-[#f4f4f5] bg-[#121215] hover:bg-[#1b1b1f] border border-[#27272a] rounded-md transition-colors focus:outline-none"
          >
            {language === 'en' ? 'Inspect Encumbrances' : 'লক প্যানেলে দেখুন'}
          </button>

          <button
            onClick={() => setFraudAlert(null)}
            className="w-full sm:w-auto px-5 py-2 text-xs font-medium text-[#f4f4f5] bg-[#1b1b1f] hover:bg-[#242429] rounded-md border border-[#27272a] transition-colors shadow-xs focus:outline-none"
          >
            {language === 'en' ? 'Acknowledge & Adjust' : 'বুঝেছি / বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
