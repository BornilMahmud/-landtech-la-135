'use client';

import React from 'react';
import { ShieldAlert, AlertOctagon, X, Scale, FileText, Ban, ArrowRight } from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';

export const FraudAlertModal: React.FC = () => {
  const { fraudAlert, setFraudAlert, language, setActiveRole } = useLandApp();

  if (!fraudAlert || !fraudAlert.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in no-print">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-alertGlow border-2 border-rose-600 overflow-hidden animate-slide-up">
        {/* Red Warning Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-slate-950 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-rose-950/60 rounded-2xl border border-rose-400/40 text-rose-200 shadow-inner">
                <ShieldAlert className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div>
                <span className="inline-block text-[10px] font-mono font-bold tracking-widest uppercase bg-rose-950/80 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/40 mb-1">
                  {language === 'en' ? 'Consensus Audit Failure' : 'কনসেনসাস অডিট অসঙ্গতি'}
                </span>
                <h3 className="text-lg font-black text-white leading-tight">
                  {language === 'en' ? fraudAlert.titleEn : fraudAlert.titleBn}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setFraudAlert(null)}
              className="text-rose-300 hover:text-white p-1 rounded-xl hover:bg-rose-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-2xl">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-950 leading-relaxed font-semibold">
                {language === 'en' ? fraudAlert.reasonEn : fraudAlert.reasonBn}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs text-slate-700">
            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-800" />
              <span>{language === 'en' ? 'Statutory Governance Enforced:' : 'আইনগত কার্যকারিতা:'}</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 leading-normal">
              <li>
                {language === 'en' 
                  ? 'The Registration Act 1908 & Transfer of Property Act 1882 prohibit deeds violating unencumbered title.'
                  : 'রেজিস্ট্রেশন আইন ১৯০৮ এবং সম্পত্তি হস্তান্তর আইন ১৮৮২ অনুযায়ী দায়যুক্ত জমির দলিল সম্পাদন নিষিদ্ধ।'}
              </li>
              <li>
                {language === 'en'
                  ? 'SetuLand automated escrow lock prevents fraudulent double-mortgaging or double-selling in real time.'
                  : 'সেতু-ল্যান্ড স্বয়ংক্রিয় এসক্রো লকের মাধ্যমে একই জমির একাধিক দলিল বা বন্ধকী প্রতারণা সাথে সাথে প্রতিরোধ করে।'}
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              setFraudAlert(null);
              setActiveRole('bank_judiciary');
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-sm"
          >
            <Ban className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'en' ? 'Inspect in Bank/Court Panel' : 'লক প্যানেলে দেখুন'}</span>
          </button>

          <button
            onClick={() => setFraudAlert(null)}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors"
          >
            {language === 'en' ? 'Acknowledge & Adjust Area' : 'বুঝেছি / বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
