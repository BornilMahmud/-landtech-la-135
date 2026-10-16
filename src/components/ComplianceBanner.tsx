'use client';

import React from 'react';
import { ShieldCheck, RotateCcw } from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';

export const ComplianceBanner: React.FC = () => {
  const { language, setIsResetModalOpen } = useLandApp();

  return (
    <div className="no-print bg-canvas text-secondary py-2 px-4 border-b border-subtle text-[11px] font-mono tracking-wider relative z-50">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Compliance statement with warm gold dot */}
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          <span>
            <strong className="text-primary font-medium mr-1.5 uppercase tracking-wider">System Protocol:</strong>
            {language === 'en' 
              ? '100% Synthetic Dummy Data Used. No Real Land Records or NIDs.' 
              : 'শতভাগ ডামি/কৃত্রিম ডেটা ব্যবহৃত। কোনো বাস্তব ব্যক্তি বা জমির রেকর্ড নয়।'}
          </span>
        </div>

        {/* Right side controls: Live consensus pill & Quick Reset Demo State */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 bg-surface px-2.5 py-0.5 rounded-sm border border-subtle text-[11px] text-secondary">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>SHA-256 Consensus Ledger Active</span>
          </span>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface hover:bg-muted border border-subtle hover:border-gold-400 text-primary transition-colors text-[11px] font-mono shadow-subtle cursor-pointer focus:outline-none"
            title="Reset demo data"
          >
            <RotateCcw className="w-3 h-3 text-gold-400" />
            <span>{language === 'en' ? 'Reset State' : 'রিসেট ডেটা'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceBanner;
