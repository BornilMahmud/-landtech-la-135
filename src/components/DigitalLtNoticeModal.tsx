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
import { useLandApp } from '@/context/LandAppContext';
import { generateSvgQrCode, formatDec } from '@/lib/crypto-utils';
import { SetuLandLogo } from './SetuLandLogo';

export const DigitalLtNoticeModal: React.FC = () => {
  const { activeLtNotice, setActiveLtNotice, language } = useLandApp();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#09090b]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#09090b] rounded-xl shadow-2xl border border-[#27272a] overflow-hidden max-h-[94vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="no-print bg-[#121215] text-[#f4f4f5] px-6 py-3.5 flex items-center justify-between border-b border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <SendHorizontal className="w-4 h-4 text-[#d4a657]" />
            <span className="text-xs font-mono font-medium tracking-wider text-[#d4a657] uppercase">
              {language === 'en' ? 'Section 89 Statutory LT Notice Packet' : 'ধারা ৮৯ সংবিধিবদ্ধ এলটি নোটিশ প্যাকেট'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewJson(!viewJson)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1f] hover:bg-[#242429] text-[#f4f4f5] rounded-md text-xs font-mono border border-[#27272a] transition-colors focus:outline-none"
            >
              <Code className="w-3.5 h-3.5 text-[#a1a1aa]" />
              <span>{viewJson ? (language === 'en' ? 'View Certificate' : 'সনদ দেখুন') : (language === 'en' ? 'Inspect JSON Packet' : 'জেসন প্যাকেট')}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1f] hover:bg-[#242429] text-[#f4f4f5] rounded-md text-xs font-mono border border-[#27272a] transition-colors focus:outline-none"
            >
              <Printer className="w-3.5 h-3.5 text-[#a1a1aa]" />
              <span>{language === 'en' ? 'Print' : 'প্রিন্ট'}</span>
            </button>
            <button
              onClick={() => setActiveLtNotice(null)}
              className="text-[#a1a1aa] hover:text-[#f4f4f5] p-1.5 rounded-md hover:bg-[#1b1b1f] transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#f4f4f5] bg-[#121215]">
          {viewJson ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#a1a1aa] font-medium uppercase text-[11px]">
                  {language === 'en' ? 'Raw Cryptographic LT Notice Packet (JSON):' : 'ক্রিপ্টোগ্রাফিক এলটি নোটিশ প্যাকেট (জেসন):'}
                </span>
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 text-[#d4a657] hover:underline font-mono text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (language === 'en' ? 'Copied' : 'কপি হয়েছে') : (language === 'en' ? 'Copy JSON' : 'কপি করুন')}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#09090b] text-[#d4a657] rounded-lg border border-[#27272a] overflow-x-auto text-[11px] leading-relaxed">
                {JSON.stringify(activeLtNotice, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="printable-document p-6 sm:p-8 border border-[#27272a] rounded-xl bg-[#09090b] space-y-5">
              {/* Header */}
              <div className="text-center border-b border-[#27272a] pb-5">
                <div className="flex justify-center mb-2">
                  <SetuLandLogo size="md" showText={false} />
                </div>
                <h2 className="text-lg sm:text-xl font-display font-light text-[#f4f4f5] uppercase tracking-tight">
                  {language === 'en' ? "Government of the People's Republic of Bangladesh" : 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার'}
                </h2>
                <p className="text-xs text-[#a1a1aa] mt-0.5">
                  {language === 'en' 
                    ? 'Directorate of Registration ➔ Directorate of Land Records & Surveys' 
                    : 'নিবন্ধন পরিদপ্তর হতে উপজেলা ভূমি প্রশাসন (এসি ল্যান্ড) বরাবর প্রেরিত'}
                </p>
                <div className="inline-block mt-2 bg-[#231d13] text-[#d4a657] border border-[#4a3a1f] text-[11px] font-mono px-3 py-0.5 rounded-sm uppercase tracking-wider">
                  Section 89 Statutory Land Transfer (LT) Notice Packet
                </div>
              </div>

              {/* Identifiers Grid */}
              <div className="grid grid-cols-2 gap-3 bg-[#121215] p-3.5 rounded-lg border border-[#27272a] text-xs font-mono">
                <div>
                  <span className="text-[#a1a1aa] block text-[10px] uppercase">
                    {language === 'en' ? 'Notice Tracking No:' : 'নোটিশ ট্র্যাকিং নম্বর:'}
                  </span>
                  <span className="font-mono text-sm text-[#f4f4f5] font-medium">{activeLtNotice.ltNoticeNo}</span>
                </div>
                <div>
                  <span className="text-[#a1a1aa] block text-[10px] uppercase">
                    {language === 'en' ? 'Linked Registered Deed:' : 'সংশ্লিষ্ট রেজিস্ট্রিকৃত দলিল:'}
                  </span>
                  <span className="font-mono text-sm text-[#d4a657] font-medium">{activeLtNotice.deedNo}</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-2 text-xs border border-[#27272a] rounded-lg p-4 bg-[#121215]">
                <div className="flex justify-between py-1.5 border-b border-[#27272a]/60">
                  <span className="text-[#a1a1aa]">{language === 'en' ? 'Statutory Mandate:' : 'আইনগত নির্দেশনা:'}</span>
                  <span className="font-mono text-right text-[#f4f4f5]">{activeLtNotice.statutoryReference}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272a]/60">
                  <span className="text-[#a1a1aa]">{language === 'en' ? 'Target Khatian & Dag:' : 'খতিয়ান ও দাগ নম্বর:'}</span>
                  <span className="font-mono font-medium text-[#f4f4f5]">Khatian #{activeLtNotice.khatianNo} • Dag #{activeLtNotice.dagNo}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272a]/60">
                  <span className="text-[#a1a1aa]">{language === 'en' ? 'Mouza & Jurisdiction:' : 'মৌজা ও অধিক্ষেত্র:'}</span>
                  <span className="text-right text-[#f4f4f5]">{language === 'en' ? activeLtNotice.mouzaEn : activeLtNotice.mouzaBn}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272a]/60">
                  <span className="text-[#a1a1aa]">{language === 'en' ? 'Transferor (Seller):' : 'হস্তান্তরকারী (বিক্রেতা):'}</span>
                  <span className="font-medium text-[#f4f4f5]">{activeLtNotice.sellerName} ({activeLtNotice.sellerNid})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272a]/60">
                  <span className="text-[#a1a1aa]">{language === 'en' ? 'Transferee (Buyer):' : 'গ্রহীতা (ক্রেতা):'}</span>
                  <span className="font-medium text-[#f4f4f5]">{activeLtNotice.buyerName} ({activeLtNotice.buyerNid})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272a]/60">
                  <span className="text-[#a1a1aa]">{language === 'en' ? 'Transferred Area:' : 'হস্তান্তরিত জমির পরিমাণ:'}</span>
                  <span className="font-mono text-[#d4a657] font-medium">{formatDec(activeLtNotice.transferDecimals)} Decimals (শতাংশ)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272a]/60">
                  <span className="text-[#a1a1aa]">{language === 'en' ? 'Land Development Tax Dakhila:' : 'ভূমি উন্নয়ন কর দাখিলা:'}</span>
                  <span className="font-mono text-[#22c55e]">#{activeLtNotice.dakhilaReceiptNo} (100% Cleared)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272a]/60">
                  <span className="text-[#a1a1aa]">{language === 'en' ? 'Bundled Mutation Fee Receipt:' : 'একীভূত নামজারি ফি রসিদ:'}</span>
                  <span className="font-mono text-[#22c55e]">{activeLtNotice.bundledMutationFeeReceiptNo}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#a1a1aa]">{language === 'en' ? 'Dispatched To:' : 'প্রেরিত অফিস:'}</span>
                  <span className="font-medium text-[#f4f4f5]">{activeLtNotice.recipientOffice}</span>
                </div>
              </div>

              {/* QR Code and Cryptographic Seal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#121215] rounded-lg border border-[#27272a]">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#22c55e]">
                    <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                    <span>{language === 'en' ? 'Cryptographic Integrity Packet Seal' : 'ক্রিপ্টোগ্রাফিক ডিজিটাল সিলমোহর'}</span>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] max-w-sm">
                    {language === 'en' 
                      ? 'Digitally signed and auto-transmitted from Sub-Registry to AC Land e-Mutation queue under Section 89 SAT Act 1950.'
                      : 'ধারা ৮৯ মোতাবেক সাব-রেজিস্ট্রি হতে স্বয়ংক্রিয়ভাবে ডিজিটাল স্বাক্ষরে এসি ল্যান্ডে প্রেরিত।'}
                  </p>
                  <div className="font-mono text-[10px] text-[#71717a] truncate max-w-xs sm:max-w-sm">
                    SHA256: {activeLtNotice.sha256PacketSeal}
                  </div>
                </div>

                <div 
                  className="bg-white p-2 rounded-md shadow-sm border border-[#27272a] shrink-0"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="no-print bg-[#121215] px-6 py-3.5 border-t border-[#27272a] flex items-center justify-between text-xs">
          <span className="text-[#71717a] font-mono text-[11px]">
            {language === 'en' ? 'Status: Transmitted & Locked' : 'স্ট্যাটাস: প্রেরিত ও লককৃত'}
          </span>
          <button
            onClick={() => setActiveLtNotice(null)}
            className="px-4 py-1.5 bg-[#1b1b1f] hover:bg-[#27272a] text-[#f4f4f5] rounded-md text-xs font-mono border border-[#27272a] transition-colors"
          >
            {language === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
