'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Building2, 
  User, 
  ShieldCheck, 
  ArrowRight,
  Landmark,
  Copy,
  Check,
  FileCheck2,
  Lock
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { generateSvgQrCode } from '@/lib/crypto';

export const DigitalDeedModal: React.FC = () => {
  const { 
    activeDeedReceipt, 
    setActiveDeedReceipt, 
    language, 
    setActiveRole 
  } = useLandApp();

  const [copiedHash, setCopiedHash] = useState(false);

  if (!activeDeedReceipt) return null;

  const qrSvg = generateSvgQrCode(`SETULAND:DEED:${activeDeedReceipt.deedNo}:${activeDeedReceipt.trackingId}`, 130);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(activeDeedReceipt.sha256Hash);
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
              {language === 'en' ? 'Official Deed Registration Certificate' : 'দলিল রেজিস্ট্রি সনদ ও ই-নামজারি রসিদ'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Print / Export PDF' : 'প্রিন্ট / পিডিএফ'}</span>
            </button>
            <button
              onClick={() => setActiveDeedReceipt(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div className="printable-document preview-watermark p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 bg-guilloche">
          {/* Certificate Double Border Header with Govt Seal Style */}
          <div className="text-center border-b-2 border-emerald-950/40 pb-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-full bg-emerald-950 text-amber-300 flex items-center justify-center font-bold text-sm border-2 border-amber-400 shadow-md">
                <Landmark className="w-6 h-6 text-amber-300" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-tight font-serif">
              {language === 'en' ? "People's Republic of Bangladesh" : 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার'}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              {language === 'en' ? 'Directorate of Registration — Sub-Registry Complex' : 'নিবন্ধন পরিদপ্তর — সাব-রেজিস্ট্রার কার্যালয়'}
            </p>
            <div className="inline-block mt-2 bg-emerald-900 text-white text-[11px] font-mono font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              {activeDeedReceipt.subRegistryOffice} • Smart Deed Receipt
            </div>
          </div>

          {/* Key Identifiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/80 p-4 rounded-2xl border-2 border-emerald-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                {language === 'en' ? 'Registered Deed No (দলিল নং):' : 'দলিল নম্বর:'}
              </span>
              <div className="font-mono text-lg font-black text-slate-900 tabular-nums">
                {activeDeedReceipt.deedNo}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                {language === 'en' ? 'Auto-Triggered e-Mutation ID:' : 'স্বয়ংক্রিয় ই-নামজারি ট্র্যাকিং নং:'}
              </span>
              <div className="font-mono text-lg font-black text-emerald-900 flex items-center gap-2 tabular-nums">
                <span>{activeDeedReceipt.trackingId}</span>
                <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-sans font-bold">
                  Queue Active
                </span>
              </div>
            </div>
          </div>

          {/* Land Parcel & Parties Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 border border-slate-300 p-4 rounded-2xl bg-white shadow-sm">
              <div className="font-extrabold text-slate-900 border-b pb-1.5 flex items-center gap-2 text-emerald-950">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>{language === 'en' ? 'Land Parcel Specifications' : 'জমির বিবরণ'}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">{language === 'en' ? 'Parent Khatian:' : 'মূল খতিয়ান:'}</span>
                <span className="font-mono font-black text-slate-900">{activeDeedReceipt.khatianNo}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">{language === 'en' ? 'Dag (Plot) No:' : 'দাগ নম্বর:'}</span>
                <span className="font-mono font-black text-slate-900">#{activeDeedReceipt.dagNo}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">{language === 'en' ? 'Mouza & Upazila:' : 'মৌজা ও উপজেলা:'}</span>
                <span className="font-bold text-slate-900">{activeDeedReceipt.mouza}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-200 text-emerald-950 font-black text-sm">
                <span>{language === 'en' ? 'Transferred Decimals:' : 'হস্তান্তরিত জমি:'}</span>
                <span className="font-mono text-emerald-700 tabular-nums">
                  {activeDeedReceipt.transferAreaDecimals.toFixed(2)} Decimals
                </span>
              </div>
            </div>

            <div className="space-y-2 border border-slate-300 p-4 rounded-2xl bg-white shadow-sm">
              <div className="font-extrabold text-slate-900 border-b pb-1.5 flex items-center gap-2 text-emerald-950">
                <User className="w-4 h-4 text-emerald-700" />
                <span>{language === 'en' ? 'Seller & Buyer Information' : 'দাতা ও গ্রহীতার তথ্য'}</span>
              </div>
              <div className="py-0.5">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'Seller (বিক্রেতা):' : 'বিক্রেতা:'}</span>
                <span className="font-black text-slate-900 text-sm">{activeDeedReceipt.sellerName}</span>
                <span className="block font-mono text-[10px] text-slate-500 tabular-nums">{activeDeedReceipt.sellerNid}</span>
              </div>
              <div className="py-0.5 border-t border-slate-200 pt-1.5">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'Buyer (ক্রেতা):' : 'ক্রেতা:'}</span>
                <span className="font-black text-slate-900 text-sm">{activeDeedReceipt.buyerName}</span>
                <span className="block font-mono text-[10px] text-slate-500 tabular-nums">{activeDeedReceipt.buyerNid}</span>
              </div>
            </div>
          </div>

          {/* Unified Revenue Receipt Breakdown */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden text-xs shadow-sm bg-white">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 flex items-center justify-between border-b">
              <span>{language === 'en' ? 'Unified Single-Window Government Revenue Statement:' : 'একত্রিত সরকারি ফি ও রাজস্ব রশিদ:'}</span>
              <span className="font-mono font-bold text-emerald-800 tabular-nums">
                Sale: ৳ {activeDeedReceipt.saleValueBDT.toLocaleString()} BDT
              </span>
            </div>
            <div className="p-3.5 space-y-1.5 divide-y divide-slate-100">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Stamp Duty (স্ট্যাম্প শুল্ক - ১.৫%)</span>
                <span className="font-mono font-bold tabular-nums">৳ {activeDeedReceipt.fees.stampDutyBDT.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Registration Fee (রেজিস্ট্রেশন ফি - ১.০%)</span>
                <span className="font-mono font-bold tabular-nums">৳ {activeDeedReceipt.fees.registrationFeeBDT.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Local Government Tax (স্থানীয় কর - ৩.০%)</span>
                <span className="font-mono font-bold tabular-nums">৳ {activeDeedReceipt.fees.localGovtTaxBDT.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Source Tax / AIT (উৎসে কর - ২.০%)</span>
                <span className="font-mono font-bold tabular-nums">৳ {activeDeedReceipt.fees.gainTaxBDT.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 bg-emerald-50 text-emerald-950 font-bold px-2 rounded-lg">
                <span>Bundled e-Mutation Fee (সমন্বিত নামজারি ফি):</span>
                <span className="font-mono font-black tabular-nums">৳ {activeDeedReceipt.fees.mutationFeeBDT.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black text-slate-950 px-1">
                <span>TOTAL REVENUE COLLECTED (সর্বমোট সরকারি জমা):</span>
                <span className="font-mono text-emerald-700 text-base tabular-nums">৳ {activeDeedReceipt.fees.totalFeeBDT.toLocaleString()} BDT</span>
              </div>
            </div>
          </div>

          {/* Cryptographic QR Code & SHA-256 Signature */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-300">
            <div 
              className="shrink-0"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <div className="space-y-1.5 text-center sm:text-left overflow-hidden flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{language === 'en' ? 'Cryptographic SHA-256 Ledger Signature' : 'ক্রিপ্টোগ্রাফিক ডিজিটাল সিল'}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                  Verified Immutable
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-[10px] text-slate-700 break-all bg-white p-2 rounded-lg border border-slate-300 flex-1">
                  {activeDeedReceipt.sha256Hash}
                </p>
                <button
                  onClick={handleCopyHash}
                  className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors shrink-0"
                  title="Copy SHA-256 Hash"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'en'
                  ? 'Cryptographic escrow lock active on parent Khatian. Case auto-routed to AC Land Queue.'
                  : 'মূল খতিয়ানে জমি অবমুক্ত অংশ অবিলম্বে লক করা হয়েছে এবং মামলা এসি ল্যান্ডে স্থানান্তরিত হয়েছে।'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-600 font-medium">
            {language === 'en' ? 'Status: Zero-Touch Push to AC Land Queue' : 'অবস্থা: এসি ল্যান্ডে স্বয়ংক্রিয়ভাবে স্থানান্তরিত'}
          </span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveDeedReceipt(null)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex-1 sm:flex-none"
            >
              {language === 'en' ? 'Close' : 'বন্ধ করুন'}
            </button>
            <button
              onClick={() => {
                setActiveDeedReceipt(null);
                setActiveRole('ac_land');
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-black text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-md transition-colors flex-1 sm:flex-none"
            >
              <span>{language === 'en' ? 'Switch to AC Land Queue' : 'এসি ল্যান্ড কিউতে দেখুন'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
