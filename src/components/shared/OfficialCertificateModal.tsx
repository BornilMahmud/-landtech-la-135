'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Landmark, 
  Building2, 
  User, 
  Copy, 
  Check, 
  CheckCircle2, 
  FileCheck2 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { generateSvgQrCode, formatHashDisplay, formatDec } from '@/lib/crypto-utils';

export const OfficialCertificateModal: React.FC = () => {
  const { 
    activeDeedReceipt, 
    setActiveDeedReceipt, 
    activePorcha, 
    setActivePorcha, 
    language,
    citizens 
  } = useLandRegistry();

  const [copiedHash, setCopiedHash] = useState(false);

  // If neither modal is active, return null
  if (!activeDeedReceipt && !activePorcha) return null;

  const isDeed = !!activeDeedReceipt;
  const isPorcha = !!activePorcha;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleClose = () => {
    setActiveDeedReceipt(null);
    setActivePorcha(null);
  };

  // Build QR Code SVG
  const qrPayload = isDeed 
    ? `SETULAND:DEED:${activeDeedReceipt!.deedNo}:${activeDeedReceipt!.linkedMutationTrackingId}:${activeDeedReceipt!.deedHash}`
    : `SETULAND:KHATIAN:${activePorcha!.khatian.khatianNo}:${activePorcha!.khatian.dagNo}:${activePorcha!.khatian.recordHash}`;

  const qrSvg = generateSvgQrCode(qrPayload, 120);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden max-h-[94vh] flex flex-col animate-slide-up">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              {isDeed
                ? (language === 'en' ? 'Official Deed & Auto-Mutation Receipt' : 'দলিল রেজিস্ট্রি সনদ ও ই-নামজারি রসিদ')
                : (language === 'en' ? 'Newly Issued Digital Khatian (Porcha)' : 'নতুন ডিজিটাল খতিয়ান (পর্চা) সনদ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Print / Save PDF' : 'প্রিন্ট / পিডিএফ'}</span>
            </button>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div id="printable-certificate" className="printable-document p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 bg-guilloche">
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
              {isDeed
                ? (language === 'en' ? 'Ministry of Law, Justice & Parliamentary Affairs — Directorate of Registration' : 'আইন, বিচার ও সংসদ বিষয়ক মন্ত্রণালয় — নিবন্ধন পরিদপ্তর')
                : (language === 'en' ? 'Ministry of Land — Directorate of Land Records & Surveys (DLRS)' : 'ভূমি মন্ত্রণালয় — ভূমি রেকর্ড ও জরিপ অধিদপ্তর এবং এসি ল্যান্ড কার্যালয়')}
            </p>
            <div className="inline-block mt-2 bg-emerald-900 text-white text-[11px] font-mono font-bold px-4 py-1 rounded-full tracking-wider uppercase">
              {isDeed ? 'Smart Sub-Kabala Deed Receipt' : 'Record of Rights (Porcha / খতিয়ান স্বত্বলিপি)'}
            </div>
          </div>

          {/* Key Identifiers Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/80 p-4 rounded-2xl border-2 border-emerald-300">
            {isDeed && activeDeedReceipt && (
              <>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                    {language === 'en' ? 'Registered Deed No:' : 'দলিল নম্বর:'}
                  </span>
                  <div className="font-mono text-lg font-black text-slate-900 tabular-nums">
                    {activeDeedReceipt.deedNo}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                    {language === 'en' ? 'Auto-Triggered e-Mutation ID:' : 'স্বয়ংক্রিয় নামজারি ট্র্যাকিং নং:'}
                  </span>
                  <div className="font-mono text-lg font-black text-emerald-900 flex items-center gap-2 tabular-nums">
                    <span>{activeDeedReceipt.linkedMutationTrackingId}</span>
                    <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-sans font-bold">
                      Queue Active
                    </span>
                  </div>
                </div>
              </>
            )}

            {isPorcha && activePorcha && (
              <>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                    {language === 'en' ? 'Newly Issued Khatian No:' : 'নতুন সৃজিত খতিয়ান নম্বর:'}
                  </span>
                  <div className="font-mono text-2xl font-black text-emerald-950 tabular-nums">
                    {activePorcha.khatian.khatianNo}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                    {language === 'en' ? 'Mutation Case Reference:' : 'নামজারি মামলার সূত্র:'}
                  </span>
                  <div className="font-mono text-lg font-black text-emerald-900 flex items-center gap-2 tabular-nums">
                    <span>{activePorcha.mutationId || 'APPROVED'}</span>
                    <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-sans font-bold">
                      Split Finalized
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Parcel Details */}
            <div className="space-y-2 border border-slate-300 p-4 rounded-2xl bg-white shadow-sm">
              <div className="font-extrabold text-slate-900 border-b pb-1.5 flex items-center gap-2 text-emerald-950">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>{language === 'en' ? 'Land Parcel Specifications' : 'জমির তফসিল ও বিবরণ'}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">{language === 'en' ? 'District & Upazila:' : 'জেলা ও উপজেলা:'}</span>
                <span className="font-bold text-slate-900">
                  {isDeed ? 'Dhaka, Savar' : `${activePorcha!.khatian.districtEn}, ${activePorcha!.khatian.upazilaEn}`}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">{language === 'en' ? 'Mouza & JL No:' : 'মৌজা ও জেএল:'}</span>
                <span className="font-bold text-slate-900">
                  {isDeed ? `${activeDeedReceipt!.mouzaEn} (JL-42)` : `${activePorcha!.khatian.mouzaEn} (${activePorcha!.khatian.jlNo})`}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">{language === 'en' ? 'Dag (Plot) No:' : 'দাগ নম্বর:'}</span>
                <span className="font-mono font-black text-slate-900">
                  #{isDeed ? activeDeedReceipt!.dagNo : activePorcha!.khatian.dagNo}
                </span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-200 text-emerald-950 font-black text-sm">
                <span>{isDeed ? (language === 'en' ? 'Transferred Decimals:' : 'হস্তান্তরিত জমি:') : (language === 'en' ? 'Recorded Decimals:' : 'রেকর্ডভুক্ত জমি:')}</span>
                <span className="font-mono text-emerald-700 tabular-nums">
                  {isDeed 
                    ? `${formatDec(activeDeedReceipt!.transferAreaDecimals)} Decimals` 
                    : `${formatDec(activePorcha!.khatian.totalAreaDecimals)} Decimals`}
                </span>
              </div>
            </div>

            {/* Ownership / Parties Info */}
            <div className="space-y-2 border border-slate-300 p-4 rounded-2xl bg-white shadow-sm">
              <div className="font-extrabold text-slate-900 border-b pb-1.5 flex items-center gap-2 text-emerald-950">
                <User className="w-4 h-4 text-emerald-700" />
                <span>{language === 'en' ? 'Authenticated Legal Ownership' : 'স্বত্বাধিকারীর তথ্য'}</span>
              </div>

              {isDeed && activeDeedReceipt && (
                <>
                  <div className="py-0.5">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'Seller:' : 'বিক্রেতা:'}</span>
                    <span className="font-black text-slate-900 text-sm">
                      {citizens.find(c => c.id === activeDeedReceipt.sellerId)?.nameEn}
                    </span>
                    <span className="block font-mono text-[10px] text-slate-500">
                      {citizens.find(c => c.id === activeDeedReceipt.sellerId)?.dummyNid}
                    </span>
                  </div>
                  <div className="py-0.5 border-t border-slate-200 pt-1.5">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'Buyer:' : 'ক্রেতা:'}</span>
                    <span className="font-black text-emerald-900 text-sm">
                      {citizens.find(c => c.id === activeDeedReceipt.buyerId)?.nameEn}
                    </span>
                    <span className="block font-mono text-[10px] text-emerald-700">
                      {citizens.find(c => c.id === activeDeedReceipt.buyerId)?.dummyNid}
                    </span>
                  </div>
                </>
              )}

              {isPorcha && activePorcha && (
                <div className="py-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'Sole Registered Owner:' : 'একচ্ছত্র রেকর্ডভুক্ত মালিক:'}</span>
                  <span className="font-black text-slate-900 text-base">
                    {citizens.find(c => c.id === activePorcha.khatian.ownerId)?.nameEn}
                  </span>
                  <span className="block font-mono text-xs text-slate-600 mt-0.5">
                    NID: {citizens.find(c => c.id === activePorcha.khatian.ownerId)?.dummyNid}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-1">
                    Father: {citizens.find(c => c.id === activePorcha.khatian.ownerId)?.fatherNameEn}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cryptographic SHA-256 Seal & SVG QR Code */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 font-bold text-xs uppercase font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SHA-256 Cryptographic Seal (Web Crypto)</span>
              </div>
              <p className="font-mono text-[11px] text-slate-300 break-all select-all bg-slate-950 p-2 rounded-xl border border-slate-800">
                {isDeed ? activeDeedReceipt!.deedHash : activePorcha!.khatian.recordHash}
              </p>
              <button
                onClick={() => handleCopy(isDeed ? activeDeedReceipt!.deedHash : activePorcha!.khatian.recordHash)}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHash ? 'Hash Copied to Clipboard!' : 'Copy Full 64-char Hash'}</span>
              </button>
            </div>

            {/* Embedded SVG QR */}
            <div 
              className="shrink-0 p-1 bg-white rounded-xl shadow-md border-2 border-emerald-500"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
