'use client';

import React from 'react';
import { 
  FileCheck2, 
  Building2, 
  UserCheck, 
  ShieldAlert, 
  Map, 
  KeyRound, 
  Globe2, 
  Sparkles, 
  Landmark,
  Scale,
  Lock,
  Layers
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { RoleType } from '@/types';

export const Navbar: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    language, 
    setLanguage, 
    mutations,
    blockedAttemptsCount
  } = useLandApp();

  const pendingMutationCount = mutations.filter(m => m.status === 'AUTO_INITIATED').length;

  const primaryRoles: { id: RoleType; labelEn: string; labelBn: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { 
      id: 'sub_registrar', 
      labelEn: 'Sub-Registrar', 
      labelBn: 'সাব-রেজিস্ট্রি', 
      icon: FileCheck2 
    },
    { 
      id: 'ac_land', 
      labelEn: 'AC Land Office', 
      labelBn: 'এসি ল্যান্ড অফিস', 
      icon: Building2,
      badge: pendingMutationCount,
      badgeColor: 'bg-amber-400 text-amber-950'
    },
    { 
      id: 'citizen', 
      labelEn: 'Citizen & Buyer Portal', 
      labelBn: 'নাগরিক পোর্টাল', 
      icon: UserCheck 
    },
    { 
      id: 'bank_judiciary', 
      labelEn: 'Bank & Court Locks', 
      labelBn: 'ব্যাংক ও আদালত লক', 
      icon: Lock,
      badge: blockedAttemptsCount > 0 ? blockedAttemptsCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
  ];

  const secondaryRoles: { id: RoleType; labelEn: string; labelBn: string; icon: React.ElementType }[] = [
    { 
      id: 'mouza_map', 
      labelEn: 'DLRS Mouza Map', 
      labelBn: 'মৌজা নকশা (GIS)', 
      icon: Map 
    },
    { 
      id: 'tamper_test', 
      labelEn: 'SHA-256 Tamper Lab', 
      labelBn: 'নিরাপত্তা যাচাই', 
      icon: KeyRound 
    },
  ];

  return (
    <header className="no-print bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-ambient">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & National E-Governance Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white shadow-lg shadow-emerald-950/20 border-2 border-emerald-600/40">
              <span className="font-extrabold text-xl text-emerald-300 font-serif">সে</span>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 rounded-full border-2 border-white shadow-sm animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-2xl text-slate-950 tracking-tight">
                  SetuLand <span className="text-emerald-700 font-bold text-base sm:text-xl">সেতু-ল্যান্ড</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-sm">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  LandTech 2026 P4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {language === 'en' 
                  ? 'Smart e-Mutation & Unified Land Registry Consensus Engine' 
                  : 'সাব-রেজিস্ট্রি ও স্বয়ংক্রিয় ই-নামজারি সমন্বিত প্ল্যাটফর্ম'}
              </p>
            </div>
          </div>

          {/* Right Action Controls: Language Toggle & Live Sync Badge */}
          <div className="flex items-center gap-3">
            {/* Live Inter-Agency Sync Pill */}
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-[11px] font-semibold text-slate-800">
                Sub-Registry ⇄ AC Land ⇄ Banks ⇄ DLRS
              </span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-sm hover:border-emerald-500"
              title="Toggle English / বাংলা"
            >
              <Globe2 className="w-4 h-4 text-emerald-700" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Apple / Linear-style Floating Glass Role Switcher */}
      <div className="bg-slate-900 px-2 sm:px-6 py-2 border-t border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          {/* 4 Core Stakeholder Perspectives */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-lg w-full md:w-auto overflow-x-auto scrollbar-none">
            {primaryRoles.map((role) => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap relative ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-950/50 ring-1 ring-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{language === 'en' ? role.labelEn : role.labelBn}</span>

                  {role.badge !== undefined && role.badge > 0 && (
                    <span className={`inline-flex items-center justify-center min-w-4 h-4 px-1.5 text-[10px] font-black rounded-full ${role.badgeColor || 'bg-amber-400 text-amber-950'} ml-0.5 animate-bounce`}>
                      {role.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary GIS & Security Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/50 rounded-xl border border-slate-800/80 w-full md:w-auto justify-end">
            {secondaryRoles.map((role) => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 ring-1 ring-emerald-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{language === 'en' ? role.labelEn : role.labelBn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
