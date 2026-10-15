'use client';

import React from 'react';
import { ShieldCheck, RotateCcw, Database, Activity, History } from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { t } from '@/lib/i18n';

export const ComplianceBanner: React.FC = () => {
  const { language, resetDemoData, isAuditLogOpen, setIsAuditLogOpen } = useLandRegistry();

  return (
    <div className="no-print bg-slate-950 text-emerald-400 py-2 px-4 shadow-md border-b border-emerald-950/60 text-[11px] sm:text-xs font-mono uppercase tracking-wider sticky top-0 z-50 backdrop-blur-md bg-slate-950/95">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Compliance statement with pulsing beacon */}
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-slate-300">
            <strong className="text-amber-400 font-extrabold mr-1">⚠️ LandTech 2026:</strong>
            {t(language, 'complianceRibbon')}
          </span>
        </div>

        {/* Right side controls: Live consensus pill, Audit Ledger Toggle & Reset Demo State */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="hidden lg:inline-flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-emerald-800/40 text-[11px] text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t(language, 'shaConsensusActive')}
          </span>

          {/* Live Audit Log Drawer Trigger Button */}
          <button
            onClick={() => setIsAuditLogOpen(!isAuditLogOpen)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 hover:text-white transition-all text-[11px] font-bold shadow-sm"
            title="Toggle Live Blockchain Audit Ledger"
          >
            <History className="w-3 h-3 text-emerald-400" />
            <span>{t(language, 'liveLedger')}</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm(language === 'en' ? 'Reset demo state to pristine LandTech 2026 dataset?' : 'সকল ডেটা প্রারম্ভিক অবস্থায় রিসেট করবেন?')) {
                resetDemoData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white transition-all text-[11px] font-bold shadow-sm"
            title="Reset demo data"
          >
            <RotateCcw className="w-3 h-3 text-rose-400" />
            <span>{t(language, 'resetDemo')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
