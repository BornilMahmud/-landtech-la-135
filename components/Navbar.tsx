'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileCheck2,
  Building2,
  UserCheck,
  KeyRound,
  Globe2,
  Lock,
  RotateCcw,
  PhoneCall,
  Mail,
  ShieldCheck,
  Menu,
  X,
  Compass,
  ArrowRight,
  Plus,
  Scale,
  Smartphone,
  History,
  Sun,
  Moon
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { ThemeToggle } from './ThemeToggle';
import { RoleType } from '@/types';

interface NavbarProps {
  onSelectRole?: (id: RoleType) => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectRole, onGoHome }) => {
  const {
    activeRole,
    setActiveRole,
    language,
    setLanguage,
    theme,
    toggleTheme,
    mutations,
    blockedAttemptsCount,
    setIsResetModalOpen,
    smsLogs,
    setIsSmsDrawerOpen,
    auditLogs,
    setIsAuditLogOpen,
    setIsWarisanModalOpen
  } = useLandApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleBtnRef = useRef<HTMLButtonElement>(null);

  // Prevent background scrolling while nav menu is open, and close on outside touch/click or on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Lock background scrolling completely on html and body
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !mobileToggleBtnRef.current?.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const pendingMutationCount = mutations.filter(m => m.status === 'AUTO_INITIATED').length;

  const handleRoleClick = (roleId: RoleType) => {
    setActiveRole(roleId);
    setMobileMenuOpen(false);
    if (onSelectRole) {
      onSelectRole(roleId);
    } else {
      document.getElementById(`role-${roleId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleHomeClick = () => {
    setMobileMenuOpen(false);
    if (onGoHome) {
      onGoHome();
    } else if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const navRoles: {
    id: RoleType;
    labelEn: string;
    labelBn: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeStyle?: string;
  }[] = [
    {
      id: 'sub_registrar',
      labelEn: 'Sub-Registrar',
      labelBn: 'সাব-রেজিস্ট্রি',
      icon: FileCheck2
    },
    {
      id: 'ac_land',
      labelEn: 'AC Land',
      labelBn: 'এসি ল্যান্ড',
      icon: Building2,
      badge: pendingMutationCount > 0 ? pendingMutationCount : 1,
      badgeStyle: 'bg-[#EAA023] text-[#09090B] font-bold'
    },
    {
      id: 'citizen',
      labelEn: 'Citizen',
      labelBn: 'নাগরিক',
      icon: UserCheck
    },
    {
      id: 'bank_judiciary',
      labelEn: 'Bank & Court',
      labelBn: 'ব্যাংক ও আদালত',
      icon: Lock,
      badge: blockedAttemptsCount > 0 ? blockedAttemptsCount : 3,
      badgeStyle: 'bg-red-500 text-white font-bold'
    },
    {
      id: 'mouza_map',
      labelEn: 'Bangladesh Map',
      labelBn: 'বাংলাদেশ মানচিত্র',
      icon: Compass,
      badge: 'GIS',
      badgeStyle: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'tamper_test',
      labelEn: 'Tamper Lab',
      labelBn: 'ট্যাম্পার ল্যাব',
      icon: KeyRound
    },
  ];

  return (
    <header className="no-print sticky top-0 z-50 w-full transition-colors">
      {/* ═════════ UTILITY BAR (Single Short Row: 1200px Centered, No Side Slider) ═════════ */}
      <div className="bg-zinc-950/85 backdrop-blur-md text-zinc-300 text-xs border-b border-zinc-800/80 overflow-hidden">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 py-0 gap-2 sm:gap-4 flex-nowrap overflow-hidden">
            {/* Left: Hotline & Email (Pinned firmly to far left) */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300">
                <PhoneCall className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-zinc-400 hidden sm:inline">{language === 'en' ? 'Hotline' : 'হটলাইন'}</span>
                <a href="tel:16122" className="font-bold text-white hover:text-emerald-400 hover:underline transition-colors">16122</a>
                <span className="text-zinc-500 text-[11px] hidden sm:inline">(24/7 Helpline)</span>
              </span>
              <span className="hidden md:inline text-zinc-800">|</span>
              <a
                href="mailto:support@smartbhoomi.gov.bd"
                className="hidden md:inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                <span>support@smartbhoomi.gov.bd</span>
              </a>
            </div>

            {/* Right: Quick Tools (hidden on mobile, visible md+) + Lang (always visible) */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0 flex-nowrap">
              <button
                type="button"
                onClick={() => setIsWarisanModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-xs text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer shrink-0"
                title={language === 'en' ? 'Islamic Inheritance (Farayez) Calculator' : 'ফারায়েজ বণ্টন ক্যালকুলেটর'}
              >
                <Scale className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="font-medium text-[11px]">{language === 'en' ? 'Warisan' : 'ফারায়েজ'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAuditLogOpen(true)}
                className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 transition-colors cursor-pointer shrink-0"
                title={language === 'en' ? 'Cryptographic SHA-256 Audit Trail' : 'ক্রিপ্টোগ্রাফিক অডিট লেজার'}
              >
                <History className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="text-[11px]">{language === 'en' ? 'Audit Chain' : 'অডিট'}</span>
                {auditLogs.length > 0 && (
                  <span className="px-1 text-[9px] font-mono rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {auditLogs.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsSmsDrawerOpen(true)}
                className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-xs text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer relative shrink-0"
                title={language === 'en' ? 'Government SMS Gateway (88096...)' : 'সরকারি এসএমএস গেটওয়ে'}
              >
                <Smartphone className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-[11px]">{language === 'en' ? 'Gov SMS' : 'এসএমএস'}</span>
                {smsLogs.length > 0 && (
                  <span className="px-1 text-[9px] font-mono rounded bg-emerald-500/25 text-emerald-300 font-bold">
                    {smsLogs.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleRoleClick('mouza_map')}
                className="hidden lg:inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0 px-1.5 py-0.5"
              >
                <Compass className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-[11px]">{language === 'en' ? 'DLRS GIS' : 'মৌজা'}</span>
              </button>

              {/* "New Mutation" Primary Action Button in Upper Dark Navbar */}
              <button
                type="button"
                onClick={() => handleRoleClick('sub_registrar')}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-white hover:bg-zinc-200 text-zinc-950 text-[11px] font-bold transition-all shadow-xs cursor-pointer select-none active:scale-95 border border-white shrink-0"
                title={language === 'en' ? 'Start a New Mutation' : 'নতুন নামজারি শুরু করুন'}
              >
                <Plus className="w-3 h-3 stroke-[2.5] shrink-0" />
                <span>{language === 'en' ? 'New Mutation' : 'নতুন নামজারি'}</span>
              </button>

              {/* Single Button to Tap & Switch Language */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] border border-white/25 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs group select-none active:scale-95 shrink-0"
                title={language === 'en' ? 'বাংলায় পরিবর্তন করুন' : 'Switch to English'}
                aria-label={language === 'en' ? 'Switch to Bangla' : 'Switch to English'}
              >
                <Globe2 className="w-3 h-3 text-zinc-300 group-hover:text-white transition-colors shrink-0" />
                <span className="tracking-wide">
                  {language === 'en' ? 'বাংলা' : 'English'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════ MAIN HEADER (BMS 68px Sticky Bar) ═════════ */}
      <div className="bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-[#27272A]/80 transition-colors">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] gap-3 sm:gap-6">

            {/* Left: BMS Geometric Brand Mark with 10px boxy container */}
            <button
              type="button"
              onClick={handleHomeClick}
              className="flex items-center gap-3 shrink-0 cursor-pointer group select-none text-left bg-transparent border-0 p-0"
              title={language === 'en' ? 'SmartBhoomi Home (Scroll to Top)' : 'স্মার্ট ভূমি হোম (শীর্ষে যান)'}
              aria-label="SmartBhoomi homepage top"
            >
              <div className="w-10 h-10 rounded-[10px] overflow-hidden flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-[1.04] bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 p-0.5">
                <img
                  src="/logo.png"
                  alt="SmartBhoomi National Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-lg sm:text-[19px] tracking-tight text-zinc-950 dark:text-[#FAFAFA] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  SmartBhoomi
                </span>
                <span className="text-[11px] font-sans font-medium text-zinc-500 dark:text-[#A1A1AA]">
                  {language === 'en' ? 'Unified Land Registry' : 'স্মার্ট ভূমি পোর্টাল'}
                </span>
              </div>
            </button>

            {/* Center: Navigation Links (.nav) with BMS 8px boxy pills */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 bg-zinc-100/70 dark:bg-[#18181B]/70 backdrop-blur-sm rounded-[10px] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
              aria-label="Main Navigation"
            >
              {navRoles.map((role) => {
                const isActive = activeRole === role.id;
                const Icon = role.icon;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleClick(role.id)}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-[8px] text-[12.5px] xl:text-[13.5px] font-medium transition-all duration-150 whitespace-nowrap cursor-pointer relative shrink-0 ${isActive
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm ring-1 ring-zinc-950 dark:ring-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-opacity ${isActive ? 'opacity-100 text-white dark:text-zinc-950' : 'opacity-70 text-zinc-500 dark:text-zinc-400'}`} />
                    <span className={isActive ? 'font-bold' : ''}>{language === 'en' ? role.labelEn : role.labelBn}</span>

                    {role.badge !== undefined && (
                      <span className={`inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-mono rounded-full ml-0.5 ${isActive
                          ? 'bg-white/25 text-white dark:bg-zinc-900 dark:text-white font-bold'
                          : role.badgeStyle
                        }`}>
                        {role.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Controls (.head-act) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

              {/* Reset Demo Button (BMS icon-btn style) */}
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] border border-zinc-200 dark:border-[#27272A] bg-transparent hover:bg-zinc-100 dark:hover:bg-[#18181B] text-zinc-800 dark:text-[#FAFAFA] transition-colors cursor-pointer shrink-0 hover:border-zinc-300 dark:hover:border-[#3F3F46]"
                title={language === 'en' ? 'Reset Demo Data' : 'ডেমো রিসেট করুন'}
                aria-label="Reset demo state"
              >
                <RotateCcw className="w-4 h-4 text-zinc-700 dark:text-[#FAFAFA] transition-transform hover:-rotate-45" />
              </button>

              {/* Theme Toggle (BMS icon-btn with 10px roundness) */}
              <ThemeToggle />

              {/* Mobile Menu Toggle (BMS burger button) */}
              <button
                ref={mobileToggleBtnRef}
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] border border-zinc-200 dark:border-[#27272A] bg-transparent hover:bg-zinc-100 dark:hover:bg-[#18181B] text-zinc-900 dark:text-[#FAFAFA] transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* ═════════ MOBILE MENU DRAWER & BLURRED BACKDROP ═════════ */}
      {mobileMenuOpen && (
        <>
          {/* Fullscreen Backdrop with Blur: Clicking or touching outside closes the menu */}
          <div
            className="lg:hidden fixed inset-0 top-[100px] z-40 bg-black/60 dark:bg-black/75 backdrop-blur-md transition-all duration-300 animate-in fade-in touch-none overscroll-none"
            onClick={() => setMobileMenuOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
            aria-label="Close navigation menu backdrop"
          />

          {/* Mobile Menu Drawer Panel */}
          <div
            ref={mobileMenuRef}
            className="lg:hidden relative z-50 bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-xl border-b border-zinc-200 dark:border-[#27272A] shadow-2xl p-4 transition-all animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-105px)] overflow-y-auto overscroll-contain"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 py-1">
                {language === 'en' ? 'Roles & Workflows' : 'ভূমিকা ও কার্যধারা'}
              </span>
              {navRoles.map((role) => {
                const isActive = activeRole === role.id;
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleClick(role.id)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-sm transition-all cursor-pointer ${isActive
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm ring-1 ring-zinc-950 dark:ring-white'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#18181B]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-500'}`} />
                      <span className={isActive ? 'font-bold' : ''}>{language === 'en' ? role.labelEn : role.labelBn}</span>
                    </div>
                    {role.badge !== undefined && (
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded-full ${isActive
                          ? 'bg-white/25 text-white dark:bg-zinc-900 dark:text-white font-bold'
                          : role.badgeStyle
                        }`}>
                        {role.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-zinc-100 dark:border-[#27272A] flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2 py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsWarisanModalOpen(true);
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-[8px] border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs gap-1 cursor-pointer"
                  >
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span className="font-medium text-[11px]">{language === 'en' ? 'Warisan' : 'ফারায়েজ'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAuditLogOpen(true);
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-[8px] border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs gap-1 cursor-pointer"
                  >
                    <History className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-[11px]">{language === 'en' ? 'Audit Chain' : 'অডিট'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSmsDrawerOpen(true);
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-[8px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs gap-1 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-[11px]">{language === 'en' ? 'Gov SMS' : 'এসএমএস'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] border border-zinc-200 dark:border-[#27272A] text-xs font-semibold text-zinc-800 dark:text-[#FAFAFA] bg-zinc-50 dark:bg-[#18181B] cursor-pointer"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'বাংলায় পরিবর্তন করুন (বাংলা)' : 'Switch to English'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] border border-zinc-200 dark:border-[#27272A] text-xs font-semibold text-zinc-800 dark:text-[#FAFAFA] bg-zinc-50 dark:bg-[#18181B] cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-zinc-700 dark:text-[#FAFAFA]" />
                  )}
                  <span>
                    {theme === 'dark'
                      ? (language === 'en' ? 'Switch to Light Mode' : 'লাইট মোডে পরিবর্তন করুন')
                      : (language === 'en' ? 'Switch to Dark Mode' : 'ডার্ক মোডে পরিবর্তন করুন')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsResetModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] border border-zinc-200 dark:border-[#27272A] text-xs font-semibold text-zinc-800 dark:text-[#FAFAFA] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Reset Demo State' : 'ডেমো রিসেট করুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleClick('sub_registrar')}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] bg-[#09090B] text-white dark:bg-[#FAFAFA] dark:text-[#09090B] text-xs font-semibold cursor-pointer"
                >
                  <span>{language === 'en' ? 'Start a New Mutation' : 'নতুন নামজারি শুরু করুন'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
