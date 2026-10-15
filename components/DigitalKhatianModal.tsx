'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Landmark, 
  Building2, 
  Layers, 
  Copy, 
  Check 
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { generateSvgQrCode } from '@/lib/crypto';

export const DigitalKhatianModal: React.FC = () => {
  const { activePorcha, setActivePorcha, language } = useLandApp();
  const [copiedHash, setCopiedHash] = useState(false);

  if (!activePorcha) return null;

  const { khatian, mutationId } = activePorcha;
  const qrSvg = generateSvgQrCode(`SETULAND:KHATIAN:${khatian.khatianNo}:${khatian.dagNo}:${khatian.ownerNid}`, 130);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(khatian.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden max-h-[94vh] flex flex-col animate-slide-up">
        {/* Modal Top Control Bar (Hidden on Print) */}
        <div className="no-print bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              {language === 'en' ? 'Newly Issued Digital Khatian (Porcha)' : 'নতুন ডিজিটাল খতিয়ান (পর্চা) সনদ'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Print Official Porcha (PDF)' : 'পর্চা প্রিন্ট / সংরক্ষণ'}</span>
            </button>
            <button
              onClick={() => setActivePorcha(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Khatian Body */}
        <div className="printable-document preview-watermark p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 bg-guilloche">
          {/* Official Govt Emblem Header */}
          <div className="text-center border-b-2 border-emerald-950/40 pb-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-full bg-emerald-950 text-amber-300 flex items-center justify-center font-bold text-base border-2 border-amber-400 shadow-md">
                <Landmark className="w-6 h-6 text-amber-300" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-tight font-serif">
              {language === 'en' ? "Government of the People's Republic of Bangladesh" : 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার'}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              {language === 'en' ? 'Directorate of Land Records & Surveys (DLRS) — AC Land Office' : 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর এবং উপজেলা ভূমি প্রশাসন'}
            </p>
            <div className="inline-block mt-2 bg-emerald-900 text-white text-[11px] font-mono font-bold px-4 py-1 rounded-full tracking-wider uppercase">
              {language === 'en' ? 'Smart e-Mutation Record of Rights (Porcha)' : 'ডিজিটাল নামজারি খতিয়ান (স্বত্বলিপি পর্চা)'}
            </div>
          </div>

          {/* Location & Survey Metadata Header Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-emerald-50/80 p-3.5 rounded-2xl border-2 border-emerald-300">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'District:' : 'জেলা:'}</span>
              <span className="font-extrabold text-slate-900">{khatian.district}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'Upazila:' : 'উপজেলা:'}</span>
              <span className="font-extrabold text-slate-900">{khatian.upazila}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'Mouza & JL:' : 'মৌজা ও জেএল:'}</span>
              <span className="font-extrabold text-slate-900">{khatian.mouza} (JL-42)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'Survey Type:' : 'জরিপ শ্রেণি:'}</span>
              <span className="font-mono font-black text-emerald-800">BS (Bangladesh Survey)</span>
            </div>
          </div>

          {/* Core Numbers Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border-2 border-emerald-600 shadow-sm text-center">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                {language === 'en' ? 'Newly Created Khatian No' : 'নতুন সৃজিত খতিয়ান নম্বর'}
              </span>
              <span className="text-2xl font-black text-emerald-950 font-mono tabular-nums">
                {khatian.khatianNo}
              </span>
              {mutationId && (
                <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                  Case: {mutationId}
                </span>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm text-center">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                {language === 'en' ? 'Dag (Plot) Number' : 'দাগ নম্বর'}
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                #{khatian.dagNo}
              </span>
              <span className="block text-[10px] text-slate-500 mt-0.5">
                {khatian.landClass}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm text-center">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                {language === 'en' ? 'Total Mutated Area' : 'নামজারিকৃত জমির পরিমাণ'}
              </span>
              <span className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
                {khatian.totalAreaDecimals.toFixed(2)}
              </span>
              <span className="block text-[10px] text-slate-500 mt-0.5">
                Decimals ({(khatian.totalAreaDecimals / 100).toFixed(4)} Acre)
              </span>
            </div>
          </div>

          {/* Registered Owner Card */}
          <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm text-xs space-y-2">
            <div className="font-extrabold text-emerald-950 border-b pb-1.5 flex items-center justify-between">
              <span>{language === 'en' ? 'Registered Proprietor (স্বত্বাধিকারী মালিক)' : 'স্বত্বাধিকারী মালিকের বিবরণ'}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                100% Sole Ownership (১৬ আনা)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">{language === 'en' ? 'Owner Name:' : 'মালিকের নাম:'}</span>
                <span className="font-black text-slate-900 text-sm">{khatian.ownerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">{language === 'en' ? 'National ID (NID):' : 'জাতীয় পরিচয়পত্র:'}</span>
                <span className="font-mono font-black text-slate-900 tabular-nums">{khatian.ownerNid}</span>
              </div>
            </div>
          </div>

          {/* Historical Chain of Title */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden text-xs bg-white shadow-sm">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 flex items-center justify-between border-b">
              <span>{language === 'en' ? 'Chain of Title & Historical Lineage' : 'মালিকানার ধারাবাহিক ইতিহাস (সিএস-এসএ-আরএস-বিএস)'}</span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Unbroken
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {khatian.chainOfTitle.map((c, i) => (
                <div key={i} className="px-4 py-2 flex items-center justify-between text-slate-700 hover:bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold bg-emerald-800 text-white text-[10px] px-2 py-0.5 rounded">
                      {c.surveyType}
                    </span>
                    <span className="font-semibold text-slate-900">{c.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums">
                    <span className="text-slate-500">#{c.khatianNo}</span>
                    <span className="text-slate-500">({c.year})</span>
                    <span className="font-bold text-emerald-700">{c.areaDecimals.toFixed(2)} Dec</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code & SHA-256 Signature */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-300">
            <div 
              className="shrink-0"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <div className="space-y-1.5 text-center sm:text-left overflow-hidden flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{language === 'en' ? 'Digital Porcha Cryptographic Integrity Signature' : 'ডিজিটাল পর্চা ক্রিপ্টোগ্রাফিক সনদ'}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-[10px] text-slate-700 break-all bg-white p-2 rounded-lg border border-slate-300 flex-1">
                  {khatian.sha256Hash}
                </p>
                <button
                  onClick={handleCopyHash}
                  className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors shrink-0"
                  title="Copy Hash"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                {language === 'en'
                  ? 'Issued under the State Acquisition and Tenancy Act 1950. Valid for registration, bank loans, and mutation tracking.'
                  : 'রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন ১৯৫০ এর অধীনে জারি করা হলো। ব্যাংক ঋণ ও পরবর্তী হস্তান্তরের জন্য গ্রহণযোগ্য।'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="no-print bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => setActivePorcha(null)}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-colors"
          >
            {language === 'en' ? 'Close Window' : 'উইন্ডো বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
