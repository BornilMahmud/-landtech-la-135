'use client';

import React from 'react';
import { 
  X, 
  GitBranch, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  FileText, 
  Layers, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { formatDec } from '@/lib/crypto-utils';

export const LineageTreeModal: React.FC = () => {
  const { lineageModalKhatian, setLineageModalKhatian, language } = useLandApp();

  if (!lineageModalKhatian) return null;

  const hasBrokenNode = (lineageModalKhatian.chainOfTitle ?? []).some(node => !node.verified);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#09090b]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#09090b] rounded-xl shadow-2xl border border-[#27272a] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#121215] text-[#f4f4f5] px-6 py-4 flex items-center justify-between border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#231d13] text-[#d4a657] rounded-lg border border-[#4a3a1f]">
              <GitBranch className="w-4 h-4 text-[#d4a657]" />
            </div>
            <div>
              <h3 className="text-sm font-display font-medium tracking-tight text-[#f4f4f5]">
                {language === 'en' 
                  ? '4-Stage Chain-of-Title Lineage Diagnostic' 
                  : '৪-স্তরের মালিকানা ধারাবাহিকতা বৃক্ষ (সিএস ➔ এসএ ➔ আরএস ➔ বিএস)'}
              </h3>
              <p className="text-[11px] text-[#a1a1aa] font-mono">
                {lineageModalKhatian.khatianNo} • Dag #{lineageModalKhatian.dagNo} • {language === 'en' ? lineageModalKhatian.mouza : lineageModalKhatian.mouzaBn}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLineageModalKhatian(null)}
            className="text-[#a1a1aa] hover:text-[#f4f4f5] p-1.5 rounded-md hover:bg-[#1b1b1f] transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-[#121215] text-[#f4f4f5]">
          {/* Status Alert Banner */}
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            hasBrokenNode 
              ? 'bg-[#291415] border-[#5c1d1f] text-[#f87171]' 
              : 'bg-[#142318] border-[#1e4a27] text-[#22c55e]'
          }`}>
            {hasBrokenNode ? (
              <AlertTriangle className="w-5 h-5 text-[#f87171] shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-medium text-sm">
                {hasBrokenNode
                  ? (language === 'en' ? 'Lineage Discrepancy Detected!' : 'মালিকানার ধারাবাহিকতায় ঘাটতি চিহ্নিত!')
                  : (language === 'en' ? 'Unbroken Title Lineage Authenticated' : 'নিখুঁত ও নিরবচ্ছিন্ন মালিকানার ধারাবাহিকতা')}
              </h4>
              <p className="text-xs mt-1 leading-relaxed text-[#a1a1aa]">
                {hasBrokenNode
                  ? (language === 'en'
                    ? 'A break in title succession was detected. The parent RS record does not cleanly transition to the BS ledger without missing transfer deeds or probate clearance.'
                    : 'আরএস হতে বিএস খতিয়ানে উত্তরণে মধ্যবর্তী উত্তরাধিকার বা হস্তান্তরের আইনগত দলিল অনুপস্থিত।')
                  : (language === 'en'
                    ? 'All historical surveys (Cadastral Survey 1940 ➔ State Acquisition 1962 ➔ Revisional Survey 1988 ➔ Bangladesh Survey 2012) form an unbroken legal chain.'
                    : 'সিএস (১৯৪০) ➔ এসএ (১৯৬২) ➔ আরএস (১৯৮৮) ➔ বিএস (২০১২) পর্যন্ত প্রতিটি খতিয়ান ও ওয়ারিশান সূত্র আইনগতভাবে সুসংগত।')}
              </p>
            </div>
          </div>

          {/* Connected Lineage Node Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-[19px] sm:before:left-[27px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[#27272a]">
            {(lineageModalKhatian.chainOfTitle ?? []).map((node, idx) => {
              const isMatch = node.verified;
              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Circle Icon Indicator */}
                  <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border bg-[#09090b] shadow-sm z-10 ${
                    isMatch ? 'border-[#22c55e] text-[#22c55e]' : 'border-[#ef4444] text-[#ef4444]'
                  }`}>
                    {isMatch ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  </div>

                  {/* Card Content */}
                  <div className={`flex-1 rounded-xl p-4 border transition-all ${
                    isMatch 
                      ? 'bg-[#09090b] border-[#27272a]' 
                      : 'bg-[#291415]/40 border-[#5c1d1f]'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a]/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#1b1b1f] text-[#d4a657] border border-[#27272a]">
                          {node.surveyType} Survey
                        </span>
                        <span className="font-mono text-xs font-medium text-[#f4f4f5]">
                          Khatian #{node.khatianNo}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#a1a1aa]">
                        <Calendar className="w-3.5 h-3.5 text-[#71717a]" />
                        <span>Year: {node.year}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#71717a] block text-[10px] uppercase font-mono">
                          {language === 'en' ? 'Recorded Owner:' : 'রেকর্ডভুক্ত মালিক:'}
                        </span>
                        <span className="font-medium text-[#f4f4f5]">
                          {node.ownerName}
                        </span>
                        <div className="text-[10px] text-[#71717a] font-mono mt-0.5">{node.ownerNid}</div>
                      </div>
                      <div>
                        <span className="text-[#71717a] block text-[10px] uppercase font-mono">
                          {language === 'en' ? 'Recorded Area:' : 'রেকর্ডভুক্ত জমির পরিমাণ:'}
                        </span>
                        <span className="font-mono font-medium text-[#d4a657]">
                          {formatDec(node.areaDecimals)} Decimals
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#27272a]/40 flex items-center justify-between text-[11px] font-mono">
                      <span className={isMatch ? 'text-[#22c55e]' : 'text-[#f87171]'}>
                        {isMatch 
                          ? (language === 'en' ? '✓ Authenticated Cadastral Node' : '✓ যাচাইকৃত ক্যাডাস্ট্রাল পরচা')
                          : (language === 'en' ? '⚠️ Succession Gap: Unverified Title Node' : '⚠️ খতিয়ান বিচ্যুতি: অসঙ্গতিপূর্ণ রেকর্ড')}
                      </span>
                      <span className="text-[#71717a]">
                        DLRS Record Index #{node.khatianNo}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#27272a] bg-[#121215] flex items-center justify-between text-xs font-mono text-[#a1a1aa]">
          <span>DLRS Archive Cadastral Verification API 2026</span>
          <button
            onClick={() => setLineageModalKhatian(null)}
            className="px-4 py-1.5 bg-[#1b1b1f] hover:bg-[#27272a] text-[#f4f4f5] rounded-md text-xs font-mono border border-[#27272a] transition-colors"
          >
            {language === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
