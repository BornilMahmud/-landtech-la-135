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
import { useLandRegistry } from '@/context/LandRegistryContext';
import { KhatianRecord } from '@/lib/types';
import { formatDec } from '@/lib/crypto-utils';

export const LineageTreeModal: React.FC = () => {
  const { lineageModalKhatian, setLineageModalKhatian, language } = useLandRegistry();

  if (!lineageModalKhatian) return null;

  const hasBrokenNode = (lineageModalKhatian.lineageChain ?? []).some(node => !node.verifiedMatch);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-black tracking-wide uppercase">
                {language === 'en' ? '4-Stage Chain-of-Title Lineage Diagnostic' : '৪-স্তরের মালিকানা ধারাবাহিকতা বৃক্ষ (সিএস ➔ এসএ ➔ আরএস ➔ বিএস)'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {lineageModalKhatian.khatianNo} • Dag #{lineageModalKhatian.dagNo} • {lineageModalKhatian.mouzaEn}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLineageModalKhatian(null)}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Status Alert Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            hasBrokenNode 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            {hasBrokenNode ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-black text-sm">
                {hasBrokenNode
                  ? (language === 'en' ? 'Lineage Discrepancy Detected!' : 'মালিকানার ধারাবাহিকতায় ঘাটতি চিহ্নিত!')
                  : (language === 'en' ? 'Unbroken Title Lineage Authenticated' : 'নিখুঁত ও নিরবচ্ছিন্ন মালিকানার ধারাবাহিকতা')}
              </h4>
              <p className="text-xs mt-1 leading-relaxed text-slate-700">
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
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[21px] sm:before:left-[29px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {(lineageModalKhatian.lineageChain ?? []).map((node, idx) => {
              const isMatch = node.verifiedMatch;
              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Circle Icon Indicator */}
                  <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white shadow-sm z-10 ${
                    isMatch ? 'border-emerald-500 text-emerald-600' : 'border-rose-500 text-rose-600'
                  }`}>
                    {isMatch ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  </div>

                  {/* Card Content */}
                  <div className={`flex-1 rounded-2xl p-4 border transition-all ${
                    isMatch 
                      ? 'bg-white border-slate-200 shadow-sm' 
                      : 'bg-rose-50/50 border-rose-300 shadow-md ring-1 ring-rose-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                          {node.surveyType} Survey
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          Khatian #{node.khatianNo} (Dag #{node.dagNo})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Year: {node.year}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          {language === 'en' ? 'Recorded Owner:' : 'রেকর্ডভুক্ত মালিক:'}
                        </span>
                        <span className="font-extrabold text-slate-900">
                          {language === 'en' ? node.recordedOwnerEn : node.recordedOwnerBn}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          {language === 'en' ? 'Recorded Area:' : 'রেকর্ডভুক্ত জমির পরিমাণ:'}
                        </span>
                        <span className="font-mono font-black text-emerald-800">
                          {formatDec(node.areaDecimals)} Decimals
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-500">
                        {isMatch 
                          ? (language === 'en' ? 'Inheritance / Deed Authenticated' : 'ওয়ারিশান ও হস্তান্তর যাচাইকৃত')
                          : (language === 'en' ? '⚠️ Succession Gap: Unverified Title Node' : '⚠️ খতিয়ান বিচ্যুতি: অসঙ্গতিপূর্ণ রেকর্ড')}
                      </span>
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isMatch ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isMatch ? '100% Match' : 'Mismatch'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <div className="text-xs text-slate-500 font-mono">
            {language === 'en' ? 'SHA-256 Record Hash: ' : 'রেকর্ড হ্যাশ: '}
            <span className="font-bold text-slate-700">{lineageModalKhatian.recordHash.slice(0, 16)}...</span>
          </div>
          <button
            onClick={() => setLineageModalKhatian(null)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {language === 'en' ? 'Close Inspector' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
