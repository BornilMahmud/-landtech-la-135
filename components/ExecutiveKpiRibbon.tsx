'use client';

import React from 'react';
import { 
  Building2, 
  Lock, 
  Layers, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  Activity,
  Sparkles
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';

export const ExecutiveKpiRibbon: React.FC = () => {
  const { 
    totalPlotsCount, 
    totalLockedDecimals, 
    queuedMutationsCount, 
    blockedAttemptsCount, 
    language 
  } = useLandApp();

  const kpis = [
    {
      id: 'plots',
      labelEn: 'Total Verified Plots (BS Ledger)',
      labelBn: 'মোট রেকর্ডভুক্ত দাগ (বিএস লেজার)',
      value: `${totalPlotsCount} Plots`,
      valueBn: `${totalPlotsCount} টি দাগ`,
      subEn: 'DLRS Cadastral Map Sync',
      subBn: 'ডিএলআরএস নকশা সিঙ্ক',
      icon: Building2,
      accent: 'emerald',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-200/80',
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'locked',
      labelEn: 'Area Locked in e-Mutation',
      labelBn: 'চলমান নামজারিতে লককৃত জমি',
      value: `${totalLockedDecimals.toFixed(2)} Dec`,
      valueBn: `${totalLockedDecimals.toFixed(2)} শতাংশ`,
      subEn: 'Escrow Anti-Double-Selling',
      subBn: 'দ্বৈত-বিক্রয় রোধ এসক্রো',
      icon: Lock,
      accent: 'amber',
      bgGlow: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-200/80',
      iconColor: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      id: 'queue',
      labelEn: 'Auto-Triggered in AC Queue',
      labelBn: 'এসি ল্যান্ড কিউতে অপেক্ষমান',
      value: `${queuedMutationsCount} Cases`,
      valueBn: `${queuedMutationsCount} টি মামলা`,
      subEn: 'Zero Citizen Applications',
      subBn: 'স্বয়ংক্রিয় অনলাইন কিউ',
      icon: Layers,
      accent: 'blue',
      bgGlow: 'from-blue-500/10 to-transparent',
      borderColor: 'border-blue-200/80',
      iconColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      id: 'fraud',
      labelEn: 'Fraud & Injunctions Blocked',
      labelBn: 'প্রতারণা ও দ্বৈত-বিক্রয় রোধ',
      value: `${blockedAttemptsCount} Blocked`,
      valueBn: `${blockedAttemptsCount} বার রোধ`,
      subEn: '5-Point Consensus Enforced',
      subBn: 'কনসেনসাস অডিট কার্যকর',
      icon: ShieldAlert,
      accent: 'rose',
      bgGlow: 'from-rose-500/10 to-transparent',
      borderColor: 'border-rose-200/80',
      iconColor: 'text-rose-700 bg-rose-50 border-rose-200',
      isPulsing: true,
    },
  ];

  return (
    <section className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className={`relative overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border ${kpi.borderColor} shadow-ambient hover:shadow-card transition-all duration-300 group`}
            >
              {/* Subtle top corner gradient glow */}
              <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${kpi.bgGlow} rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-60`} />

              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {language === 'en' ? kpi.labelEn : kpi.labelBn}
                  </span>
                  <div className="font-mono text-lg sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums flex items-baseline gap-1.5">
                    <span>{language === 'en' ? kpi.value : kpi.valueBn}</span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${kpi.iconColor} shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${kpi.isPulsing ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 relative z-10">
                <span className="font-medium truncate">
                  {language === 'en' ? kpi.subEn : kpi.subBn}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                  <Activity className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
