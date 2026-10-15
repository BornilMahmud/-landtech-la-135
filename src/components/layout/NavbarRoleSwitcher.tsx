'use client';

import React from 'react';
import { 
  FileCheck2, 
  Layers, 
  UserCheck, 
  Landmark, 
  Globe2, 
  Building2, 
  Sparkles,
  ShieldCheck,
  Bell,
  Users
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { ActiveRole } from '@/lib/types';
import { t } from '@/lib/i18n';

export const NavbarRoleSwitcher: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    language, 
    setLanguage, 
    queuedMutationsCount,
    khatians,
    smsLogs,
    setIsSmsDrawerOpen,
    setIsWarisanModalOpen
  } = useLandRegistry();

  const lockedPlotsCount = khatians.filter(k => k.isMortgaged || k.hasCourtCase || k.isDcAcquisition).length;

  const roles: { id: ActiveRole; labelEn: string; labelBn: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    {
      id: 'SUB_REGISTRAR',
      labelEn: 'Sub-Registry Office',
      labelBn: 'সাব-রেজিস্ট্রি অফিস',
      icon: FileCheck2,
    },
    {
      id: 'AC_LAND',
      labelEn: 'AC Land Office',
      labelBn: 'এসি ল্যান্ড অফিস',
      icon: Layers,
      badge: queuedMutationsCount,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'CITIZEN',
      labelEn: 'Citizen & Buyer Portal',
      labelBn: 'নাগরিক সেবা পোর্টাল',
      icon: UserCheck,
    },
    {
      id: 'INSTITUTIONAL_LOCKS',
      labelEn: 'Institutional Locks Panel',
      labelBn: 'সংবিধিবদ্ধ লক প্যানেল',
      icon: Landmark,
      badge: lockedPlotsCount,
      badgeColor: 'bg-rose-600 text-white',
    },
  ];

  return (
    <header className="no-print bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-[37px] z-40 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Logo & National System Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-700 text-white flex items-center justify-center shadow-md border border-emerald-600/30">
                <Building2 className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight font-sans">
                    {language === 'en' ? 'SetuLand' : 'সেতু-ল্যান্ড'}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                    Smart Engine
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t(language, 'appSubtitle')}
                </p>
              </div>
            </div>

            {/* Language Switcher for Mobile */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                onClick={() => setIsWarisanModalOpen(true)}
                className="p-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold"
                title={language === 'en' ? 'Warisan Calculator' : 'ওয়ারিশান ক্যালকুলেটর'}
              >
                <Users className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSmsDrawerOpen(true)}
                className="relative p-1.5 rounded-xl border border-slate-200 bg-white text-emerald-700"
                title="Gov-SMS"
              >
                <Bell className="w-4 h-4" />
                {smsLogs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full font-mono">
                    {smsLogs.length}
                  </span>
                )}
              </button>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2.5 py-1 rounded-lg transition-all font-bangla ${
                    language === 'bn' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>
          </div>

          {/* Segmented Glass 4-Role Switcher Bar + Quick Actions */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
            <div className="bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-inner flex flex-wrap sm:flex-nowrap gap-1 w-full lg:w-auto">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = activeRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-950 text-white shadow-md scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="whitespace-nowrap">
                      {language === 'en' ? role.labelEn : role.labelBn}
                    </span>

                    {/* Notification badge */}
                    {role.badge !== undefined && role.badge > 0 && (
                      <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${role.badgeColor || 'bg-slate-700 text-white'}`}>
                        {role.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Action: Warisan Calculator Launcher */}
            <button
              onClick={() => setIsWarisanModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 text-xs font-black transition-all shadow-xs"
              title={language === 'en' ? 'Open Warisan Heir Calculator' : 'উত্তরাধিকার ও ওয়ারিশান ক্যালকুলেটর'}
            >
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span className="whitespace-nowrap">
                {language === 'en' ? 'Warisan Calc' : 'ওয়ারিশ ক্যালকুলেটর'}
              </span>
            </button>

            {/* Quick Action: Gov-SMS Gateway Drawer Bell */}
            <button
              onClick={() => setIsSmsDrawerOpen(true)}
              className="relative hidden sm:flex items-center justify-center p-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all shadow-xs"
              title={language === 'en' ? 'Gov-SMS Dispatch Gateway' : 'সরকারি এসএমএস গেটওয়ে লগ'}
            >
              <Bell className="w-4 h-4 text-emerald-700" />
              {smsLogs.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono shadow-xs animate-pulse">
                  {smsLogs.length}
                </span>
              )}
            </button>

            {/* Desktop Language Switcher */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
              <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 rounded-lg transition-all font-bangla ${
                  language === 'bn' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
