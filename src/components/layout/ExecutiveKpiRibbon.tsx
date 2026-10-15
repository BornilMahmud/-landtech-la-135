'use client';

import React from 'react';
import { 
  Building2, 
  Lock, 
  Layers, 
  ShieldAlert, 
  Activity 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { t } from '@/lib/i18n';
import { formatDec } from '@/lib/crypto-utils';

export const ExecutiveKpiRibbon: React.FC = () => {
  const { 
    totalPlotsCount, 
    totalLockedDecimals, 
    queuedMutationsCount, 
    blockedAttemptsCount, 
    language 
  } = useLandRegistry();

  const kpis = [
    {
      id: 'plots',
      label: t(language, 'kpiTotalPlots'),
      sub: t(language, 'kpiTotalPlotsSub'),
      valueEn: `${totalPlotsCount} Plots`,
      valueBn: `${totalPlotsCount} টি দাগ`,
      icon: Building2,
      borderColor: 'border-emerald-200/80',
      iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      bgGlow: 'from-emerald-500/10 to-transparent',
    },
    {
      id: 'locked',
      label: t(language, 'kpiLockedArea'),
      sub: t(language, 'kpiLockedAreaSub'),
      valueEn: `${formatDec(totalLockedDecimals)} Dec`,
      valueBn: `${formatDec(totalLockedDecimals)} শতাংশ`,
      icon: Lock,
      borderColor: 'border-amber-200/80',
      iconStyle: 'text-amber-800 bg-amber-50 border-amber-200',
      bgGlow: 'from-amber-500/10 to-transparent',
    },
    {
      id: 'queue',
      label: t(language, 'kpiAutoQueue'),
      sub: t(language, 'kpiAutoQueueSub'),
      valueEn: `${queuedMutationsCount} Cases`,
      valueBn: `${queuedMutationsCount} টি মামলা`,
      icon: Layers,
      borderColor: 'border-blue-200/80',
      iconStyle: 'text-blue-700 bg-blue-50 border-blue-200',
      bgGlow: 'from-blue-500/10 to-transparent',
    },
    {
      id: 'fraud',
      label: t(language, 'kpiFraudBlocked'),
      sub: t(language, 'kpiFraudBlockedSub'),
      valueEn: `${blockedAttemptsCount} Blocked`,
      valueBn: `${blockedAttemptsCount} বার রোধ`,
      icon: ShieldAlert,
      borderColor: 'border-rose-200/80',
      iconStyle: 'text-rose-700 bg-rose-50 border-rose-200',
      bgGlow: 'from-rose-500/10 to-transparent',
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
              <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${kpi.bgGlow} rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-60`} />

              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {kpi.label}
                  </span>
                  <div className="font-mono text-lg sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums flex items-baseline gap-1.5">
                    <span>{language === 'en' ? kpi.valueEn : kpi.valueBn}</span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${kpi.iconStyle} shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${kpi.isPulsing ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 relative z-10">
                <span className="font-medium truncate">
                  {kpi.sub}
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
