'use client';

import React from 'react';
import { 
  Building2, 
  Lock, 
  Layers, 
  ShieldAlert
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
      labelEn: 'VERIFIED PLOTS (BS LEDGER)',
      labelBn: 'মোট রেকর্ডভুক্ত দাগ (বিএস লেজার)',
      value: `${totalPlotsCount}`,
      unitEn: 'Plots',
      unitBn: 'টি দাগ',
      subEn: 'DLRS Mouza Cadastral Sync',
      subBn: 'ডিএলআরএস নকশা সিঙ্ক',
      icon: Building2,
      badgeText: 'ONLINE',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      iconStyle: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/25',
    },
    {
      id: 'locked',
      labelEn: 'ESCROW LOCKED AREA',
      labelBn: 'চলমান নামজারিতে লককৃত জমি',
      value: totalLockedDecimals.toFixed(2),
      unitEn: 'Decimals',
      unitBn: 'শতাংশ',
      subEn: 'Cryptographic Anti-Double-Sale',
      subBn: 'দ্বৈত-বিক্রয় রোধ এসক্রো',
      icon: Lock,
      badgeText: 'ACTIVE',
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
      iconStyle: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25',
    },
    {
      id: 'queue',
      labelEn: 'AUTO-TRIGGERED AC QUEUE',
      labelBn: 'এসি ল্যান্ড কিউতে অপেক্ষমান',
      value: `${queuedMutationsCount}`,
      unitEn: 'Dossiers',
      unitBn: 'টি মামলা',
      subEn: 'Zero Citizen Applications Required',
      subBn: 'স্বয়ংক্রিয় অনলাইন কিউ',
      icon: Layers,
      badgeText: 'DISPATCHED',
      badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30',
      iconStyle: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/25',
    },
    {
      id: 'fraud',
      labelEn: 'FRAUD ATTEMPTS BLOCKED',
      labelBn: 'প্রতারণা ও দ্বৈত-বিক্রয় রোধ',
      value: `${blockedAttemptsCount}`,
      unitEn: 'Blocked',
      unitBn: 'বার রোধ',
      subEn: '5-Point Consensus Enforced',
      subBn: 'কনসেনসাস অডিট কার্যকর',
      icon: ShieldAlert,
      badgeText: 'PROTECTED',
      badgeColor: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30',
      iconStyle: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/25',
    },
  ];

  return (
    <section className="no-print max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] rounded-[16px] p-4 sm:p-5 transition-all duration-150 hover:border-zinc-300 dark:hover:border-[#3F3F46] relative flex flex-col justify-between shadow-xs"
            >
              {/* Header: Label + BMS 10px boxy Icon Container */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-600 dark:text-[#A1A1AA] uppercase line-clamp-1">
                  {language === 'en' ? kpi.labelEn : kpi.labelBn}
                </span>
                <div className={`w-8 h-8 rounded-[10px] border ${kpi.iconStyle} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Big Value + Unit with pure B&W text contrast */}
              <div className="my-3 flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-[#FAFAFA] tabular-nums">
                  {kpi.value}
                </span>
                <span className="font-sans text-xs text-zinc-500 dark:text-[#71717A] font-medium">
                  {language === 'en' ? kpi.unitEn : kpi.unitBn}
                </span>
              </div>

              {/* Footer: Subtext + Micro Status Badge */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-[#71717A]">
                <span className="truncate pr-2">
                  {language === 'en' ? kpi.subEn : kpi.subBn}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded-full border ${kpi.badgeColor} shrink-0`}>
                  {kpi.badgeText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExecutiveKpiRibbon;
