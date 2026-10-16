'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { RoleType as RoleKey } from '@/types';
import { ExecutiveKpiRibbon } from '@/components/ExecutiveKpiRibbon';
import { SubRegistrarView } from '@/components/SubRegistrarView';
import { AcLandView } from '@/components/AcLandView';
import { CitizenPortalView } from '@/components/CitizenPortalView';
import { BankCourtGovView } from '@/components/BankCourtGovView';
import { DlrsMouzaMapView } from '@/components/DlrsMouzaMapView';
import { TamperSimulatorView } from '@/components/TamperSimulatorView';
import { DigitalDeedModal } from '@/components/DigitalDeedModal';
import { DigitalKhatianModal } from '@/components/DigitalKhatianModal';
import { DigitalLtNoticeModal } from '@/components/DigitalLtNoticeModal';
import { WarisanCalculatorModal } from '@/components/WarisanCalculatorModal';
import { BlockchainAuditLogModal } from '@/components/BlockchainAuditLogModal';
import { GovSmsDrawer } from '@/components/GovSmsDrawer';
import { LineageTreeModal } from '@/components/LineageTreeModal';
import { FraudAlertModal } from '@/components/FraudAlertModal';
import { ResetConfirmModal } from '@/components/ResetConfirmModal';
import { NotificationToast } from '@/components/NotificationToast';
import { Footer } from '@/components/Footer';
import { useLandApp } from '@/context/LandAppContext';
import { ArrowRight } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Section registry: one entry per view. Order = reading order.       */
/* ------------------------------------------------------------------ */

type Section = {
  id: RoleKey;
  group: 'Mutation process' | 'Record access' | 'Proof';
  title: string;
  bn: string;
  blurb: string;
  View: React.ComponentType;
  lazy?: boolean;
  minHeight?: number;
};

const SECTIONS: Section[] = [
  {
    id: 'sub_registrar',
    group: 'Mutation process',
    title: 'Sub-Registrar',
    bn: 'সাব-রেজিস্ট্রার',
    blurb: 'Register a deed and open the mutation case.',
    View: SubRegistrarView,
  },
  {
    id: 'ac_land',
    group: 'Mutation process',
    title: 'AC Land',
    bn: 'সহকারী কমিশনার (ভূমি)',
    blurb: 'Review the case and approve the mutation.',
    View: AcLandView,
  },
  {
    id: 'citizen',
    group: 'Record access',
    title: 'Citizen portal',
    bn: 'নাগরিক পোর্টাল',
    blurb: 'See your property, deed and digital khatian.',
    View: CitizenPortalView,
  },
  {
    id: 'bank_judiciary',
    group: 'Record access',
    title: 'Banks, courts and government',
    bn: 'ব্যাংক, আদালত ও সরকার',
    blurb: 'Check ownership and encumbrances directly.',
    View: BankCourtGovView,
  },
  {
    id: 'mouza_map',
    group: 'Record access',
    title: 'Bangladesh GIS & Mouza',
    bn: 'বাংলাদেশ জিআইএস ও মৌজা',
    blurb: 'Interactive 64-district vector GIS, live land dossier and cadastral mouza maps.',
    View: DlrsMouzaMapView,
    lazy: true,
    minHeight: 560,
  },
  {
    id: 'tamper_test',
    group: 'Proof',
    title: 'Tamper test',
    bn: 'জালিয়াতি পরীক্ষা',
    blurb: 'Change a record and watch the ledger catch it.',
    View: TamperSimulatorView,
  },
];

/* The four stages of one mutation, in the order they actually happen. */
const FLOW: { id: RoleKey; who: string; what: string }[] = [
  { id: 'sub_registrar', who: 'Sub-Registrar', what: 'Registers the deed and opens the mutation case.' },
  { id: 'ac_land', who: 'AC Land', what: 'Reviews the case and approves it.' },
  { id: 'citizen', who: 'Citizen', what: 'Receives the updated digital khatian.' },
  { id: 'bank_judiciary', who: 'Banks and courts', what: 'Check the record directly. No paper copies.' },
];

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

function LazyMount({ children, minHeight = 480 }: { children: React.ReactNode; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <div ref={ref} style={{ minHeight: shown ? undefined : minHeight }}>
      {shown ? children : null}
    </div>
  );
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { activeRole, setActiveRole, language } = useLandApp() as {
    activeRole: RoleKey;
    setActiveRole: (role: RoleKey) => void;
    language: string;
  };

  // Tracks the role that scrolling last set, so we don't scroll back to it.
  const spied = useRef<RoleKey>(activeRole);
  const isClickScrolling = useRef(false);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((id: RoleKey) => {
    isClickScrolling.current = true;
    spied.current = id;
    setActiveRole(id);

    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 900);

    document.getElementById(`role-${id}`)?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [setActiveRole]);

  const goToTop = useCallback(() => {
    isClickScrolling.current = true;
    spied.current = 'sub_registrar';
    setActiveRole('sub_registrar');
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 900);
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [setActiveRole]);

  // Scroll position -> active role
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(`role-${s.id}`)).filter(
      (el): el is HTMLElement => !!el
    );
    const io = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id.replace('role-', '') as RoleKey;
          if (spied.current !== id) {
            spied.current = id;
            setActiveRole(id);
          }
        });
      },
      { rootMargin: '-106px 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
    };
  }, [setActiveRole]);

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      {/* Main Content Workspace (Full Width, 1200px Centered) */}
      <div className="flex-1 min-h-screen flex flex-col transition-all duration-200">
        <Navbar onSelectRole={goTo} onGoHome={goToTop} />

        {/* ---------------------------- Hero Section (Pure White in Light Mode, Dark in Dark Mode) ---------------------------- */}
        <header className="relative bg-white dark:bg-[#09090B] text-zinc-950 dark:text-white overflow-hidden transition-colors">
          {/* Theme-Adaptive Panoramic Cadastral Landscape Background */}
          <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
            {/* Light Mode Aerial Cadastral Artwork */}
            <div 
              className="dark:hidden absolute inset-0 bg-cover bg-center bg-no-repeat opacity-95 transition-opacity duration-300"
              style={{ backgroundImage: `url('/images/hero-bg-light.png')` }}
            />
            {/* Dark Mode Aerial Cadastral Artwork */}
            <div 
              className="hidden dark:block absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 transition-opacity duration-300"
              style={{ backgroundImage: `url('/images/hero-bg-dark.png')` }}
            />
            
            {/* Subtle Gradient Fog Overlays to Blend Softly into the Page */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white dark:from-[#09090B]/50 dark:via-transparent dark:to-[#09090B]" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white dark:from-[#09090B] to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20 flex flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-1 sm:mb-2">
              <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-[6px] bg-zinc-100/90 dark:bg-[#18181B]/90 backdrop-blur-xs text-zinc-800 dark:text-[#FAFAFA] border border-zinc-200 dark:border-[#27272A]">
                LandTech 2026 • Track P4
              </span>
              <span className="text-xs sm:text-sm font-sans font-medium text-zinc-700 dark:text-[#A1A1AA]">
                SmartBhoomi <span lang="bn">(স্মার্ট ভূমি)</span> National Unified Engine
              </span>
            </div>

            <h1 className="mt-4 max-w-4xl font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-zinc-950 dark:text-white mx-auto">
              {language === 'bn' 
                ? 'একক ডিজিটাল খতিয়ান ও স্বয়ংক্রিয় ই-নামজারি ইঞ্জিন'
                : 'Land ownership changes, recorded once and checked by everyone.'}
            </h1>

            <p className="mt-4 max-w-2xl sm:max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-[#A1A1AA] mx-auto">
              {language === 'bn'
                ? 'সাব-রেজিস্ট্রি দলিল থেকে এসি ল্যান্ড খতিয়ান—কাগজের ফাইল ছাড়াই তাৎক্ষণিক ডিজিটাল সংযোগ। দ্বৈত-বিক্রয় রোধে ক্রিপ্টোগ্রাফিক জমি লক।'
                : 'A mutation moves from deed registration to an updated khatian without paper passing between offices. Banks, courts and citizens read the same record. Everything on this page runs on a synthetic ledger.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => goTo('sub_registrar')}
                className="px-6 py-3 rounded-[10px] bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer border border-transparent"
              >
                {language === 'bn' ? 'দলিল রেজিস্ট্রেশন শুরু করুন' : 'Start a mutation'}
              </button>
              <button
                type="button"
                onClick={() => goTo('tamper_test')}
                className="px-6 py-3 rounded-[10px] border border-zinc-200/90 dark:border-[#27272A] bg-zinc-100/90 hover:bg-zinc-200/90 dark:bg-[#18181B]/90 dark:hover:bg-[#27272A] backdrop-blur-xs text-zinc-900 dark:text-white text-xs sm:text-sm font-medium hover:border-zinc-300 dark:hover:border-[#3F3F46] transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'জালিয়াতি পরীক্ষা ল্যাব' : 'Try a tamper test'}
              </button>
              <button
                type="button"
                onClick={() => goTo('mouza_map')}
                className="px-6 py-3 rounded-[10px] border border-zinc-200/90 dark:border-[#27272A] bg-zinc-100/90 hover:bg-zinc-200/90 dark:bg-[#18181B]/90 dark:hover:bg-[#27272A] backdrop-blur-xs text-zinc-900 dark:text-white text-xs sm:text-sm font-medium hover:border-zinc-300 dark:hover:border-[#3F3F46] transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'মৌজা নকশা দেখুন' : 'Open the mouza map'}
              </button>
            </div>

            {/* The 4-step workflow (BMS boxy 16px cards without green dots, with connecting arrows) */}
            <ol className="mt-12 sm:mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full relative text-left">
              {FLOW.map((step, i) => (
                <li key={step.id} className="relative bg-white/85 dark:bg-[#121215]/85 backdrop-blur-md border border-zinc-200/90 dark:border-[#27272A] rounded-[16px] p-4 sm:p-5 transition-all duration-200 hover:border-zinc-400 dark:hover:border-[#3F3F46] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-[#A1A1AA]">
                      Stage 0{i + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo(step.id)}
                    className="text-left group cursor-pointer w-full"
                  >
                    <span className="block font-display font-semibold text-base text-zinc-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {step.who}
                    </span>
                    <span className="block mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-[#A1A1AA]">
                      {step.what}
                    </span>
                  </button>

                  {/* Right side connecting arrow between boxes */}
                  {i < FLOW.length - 1 && (
                    <div 
                      className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white dark:bg-[#18181B] border border-zinc-300 dark:border-zinc-700 shadow-xs items-center justify-center text-zinc-400 dark:text-zinc-500 pointer-events-none"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </header>

        {/* ------------------------- KPI ledger (1200px Centered) ------------------------- */}
        <div className="bg-white dark:bg-[#09090B] transition-colors">
          <ExecutiveKpiRibbon />
        </div>

        {/* ---------------------- All 6 Workflow Views (1200px Centered) ---------------------- */}
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-canvas">
          {SECTIONS.map(({ id, title, bn, blurb, View, lazy, minHeight }) => (
            <section 
              key={id} 
              id={`role-${id}`} 
              aria-labelledby={`h-${id}`} 
              className="scroll-mt-28 lg:scroll-mt-32 relative"
            >
              {/* Anchor alias for hyphenated hash links e.g. #sub-registrar, #mouza-map */}
              <span id={id.replace(/_/g, '-')} className="relative -top-32 pointer-events-none invisible block" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-zinc-200 dark:border-[#27272A] pb-3 mb-4">
                <h2 id={`h-${id}`} className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-[#FAFAFA] tracking-tight">
                  {title}
                </h2>
                <span lang="bn" className="font-sans text-sm font-semibold text-zinc-600 dark:text-[#A1A1AA]">
                  {bn}
                </span>
              </div>
              <p className="mb-6 text-sm text-zinc-600 dark:text-[#A1A1AA] max-w-2xl">{blurb}</p>

              {lazy ? (
                <LazyMount minHeight={minHeight}>
                  <View />
                </LazyMount>
              ) : (
                <View />
              )}
            </section>
          ))}
        </main>

        {/* ---------------------------- Modals --------------------------- */}
        <DigitalDeedModal />
        <DigitalKhatianModal />
        <DigitalLtNoticeModal />
        <WarisanCalculatorModal />
        <BlockchainAuditLogModal />
        <GovSmsDrawer />
        <LineageTreeModal />
        <FraudAlertModal />
        <ResetConfirmModal />
        <NotificationToast />

        {/* ---------------------------- Professional National Land Portal Footer --------------------------- */}
        <Footer onSelectRole={goTo} onGoHome={goToTop} />
      </div>
    </div>
  );
}