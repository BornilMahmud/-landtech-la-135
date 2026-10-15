'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  Landmark, 
  ShieldCheck, 
  Copy, 
  Check, 
  Code, 
  SendHorizontal 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { generateSvgQrCode, formatDec } from '@/lib/crypto-utils';
import { t } from '@/lib/i18n';

export const DigitalLtNoticeModal: React.FC = () => {
  const { activeLtNotice, setActiveLtNotice, language } = useLandRegistry();
  const [viewJson, setViewJson] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!activeLtNotice) return null;

  const qrSvg = generateSvgQrCode(`SETULAND:LT-NOTICE:${activeLtNotice.ltNoticeNo}:${activeLtNotice.sha256PacketSeal}`, 110);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeLtNotice, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden max-h-[94vh] flex flex-col animate-slide-up">
        {/* Top Control Bar */}
        <div className="no-print bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <SendHorizontal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              {t(language, 'ltNoticeModalTitle')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewJson(!viewJson)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{viewJson ? 'View Certificate' : 'Inspect JSON Packet'}</span>
            </button>
            <button
              onClick={() => setActiveLtNotice(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800">
          {viewJson ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold uppercase text-[11px]">
                  Raw Cryptographic LT Notice Packet (JSON):
                </span>
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-300 rounded-2xl border border-slate-800 overflow-x-auto text-[11px] leading-relaxed">
                {JSON.stringify(activeLtNotice, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="printable-document p-6 sm:p-8 border-2 border-emerald-950/40 rounded-2xl bg-guilloche space-y-5">
              {/* Header */}
              <div className="text-center border-b-2 border-emerald-950/30 pb-4">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-950 text-amber-300 flex items-center justify-center font-bold text-sm border border-amber-400 shadow-md">
                    <Landmark className="w-5 h-5 text-amber-300" />
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-emerald-950 uppercase font-serif tracking-tight">
                  {language === 'en' ? "Government of the People's Republic of Bangladesh" : 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার'}
                </h2>
                <p className="text-xs font-bold text-slate-800">
                  {language === 'en' 
                    ? 'Directorate of Registration ➔ Directorate of Land Records & Surveys' 
                    : 'নিবন্ধন পরিদপ্তর হতে উপজেলা ভূমি প্রশাসন (এসি ল্যান্ড) বরাবর প্রেরিত'}
                </p>
                <div className="inline-block mt-2 bg-emerald-900 text-white text-[10px] font-mono font-bold px-3.5 py-0.5 rounded-full uppercase tracking-wider">
                  Section 89 Statutory Land Transfer (LT) Notice Packet
                </div>
              </div>

              {/* Identifiers Grid */}
              <div className="grid grid-cols-2 gap-3 bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Notice Tracking No:</span>
                  <span className="font-black text-slate-900 text-sm">{activeLtNotice.ltNoticeNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Linked Registered Deed:</span>
                  <span className="font-black text-emerald-900 text-sm">{activeLtNotice.deedNo}</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-2 text-xs border border-slate-200 rounded-xl p-4 bg-white">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Statutory Mandate:</span>
                  <span className="font-bold text-slate-900">{activeLtNotice.statutoryReference}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Parent Khatian & Dag No:</span>
                  <span className="font-mono font-bold text-slate-900">Khatian #{activeLtNotice.khatianNo} (Dag #{activeLtNotice.dagNo})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Mouza & Upazila:</span>
                  <span className="font-bold text-slate-900">{activeLtNotice.mouzaEn}, Savar</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Seller NID & Name:</span>
                  <span className="font-mono font-bold text-slate-900">{activeLtNotice.sellerName} ({activeLtNotice.sellerNid})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Buyer NID & Name:</span>
                  <span className="font-mono font-bold text-emerald-900">{activeLtNotice.buyerName} ({activeLtNotice.buyerNid})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transferred Area:</span>
                  <span className="font-mono font-black text-emerald-800 text-sm">{formatDec(activeLtNotice.transferDecimals)} Decimals</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Land Development Tax (Khajna):</span>
                  <span className="font-mono font-bold text-emerald-700">Cleared (Dakhila #{activeLtNotice.dakhilaReceiptNo})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Bundled e-Mutation Fee:</span>
                  <span className="font-mono font-bold text-emerald-700">Paid at Sub-Registry (৳ 1,170 BDT)</span>
                </div>
              </div>

              {/* Seal Footer */}
              <div className="flex items-center justify-between gap-3 bg-slate-900 text-white p-3 rounded-xl border border-slate-800">
                <div className="space-y-0.5 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cross-Ministry Cryptographic Packet Seal</span>
                  </div>
                  <p className="text-[10px] text-slate-400 break-all">
                    {activeLtNotice.sha256PacketSeal}
                  </p>
                </div>
                <div 
                  className="shrink-0 p-1 bg-white rounded-lg border border-emerald-500"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
