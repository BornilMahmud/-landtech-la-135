'use client';

import React from 'react';
import { ShieldCheck, RotateCcw, AlertTriangle, Sparkles, Terminal } from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';

export const ComplianceBanner: React.FC = () => {
  const { language, resetDemoData } = useLandApp();

  return (
    <div className="no-print bg-slate-950 text-emerald-400 py-2 px-4 shadow-md border-b border-emerald-950/60 text-[11px] sm:text-xs font-mono uppercase tracking-wider relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Compliance statement with live pulsing dot */}
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-slate-300">
            <strong className="text-amber-400 font-extrabold mr-1">⚠️ LandTech 2026 Compliance Mode:</strong>
            {language === 'en' 
              ? '100% Synthetic Dummy Data Used. No Real Land Records or NIDs.' 
              : 'শতভাগ ডামি/কৃত্রিম ডেটা ব্যবহৃত। কোনো বাস্তব ব্যক্তি বা জমির রেকর্ড নয়।'}
          </span>
        </div>

        {/* Right side controls: Live consensus pill & Quick Reset Demo State */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-emerald-800/40 text-[11px] text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            SHA-256 Consensus Engine Active
          </span>

          <button
            onClick={() => {
              if (confirm(language === 'en' ? 'Reset demo state to pristine LandTech 2026 dataset?' : 'ডেমো ডেটাসেট প্রারম্ভিক অবস্থায় রিসেট করবেন?')) {
                resetDemoData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white transition-all text-[11px] font-bold shadow-sm"
            title="Reset demo data"
          >
            <RotateCcw className="w-3 h-3 text-rose-400" />
            <span>{language === 'en' ? 'Reset Demo State' : 'রিসেট ডেটা'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
