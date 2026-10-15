'use client';

import React from 'react';
import { ComplianceBanner } from '@/components/ComplianceBanner';
import { Navbar } from '@/components/Navbar';
import { ExecutiveKpiRibbon } from '@/components/ExecutiveKpiRibbon';
import { SubRegistrarView } from '@/components/SubRegistrarView';
import { AcLandView } from '@/components/AcLandView';
import { CitizenPortalView } from '@/components/CitizenPortalView';
import { BankCourtGovView } from '@/components/BankCourtGovView';
import { DlrsMouzaMapView } from '@/components/DlrsMouzaMapView';
import { TamperSimulatorView } from '@/components/TamperSimulatorView';
import { DigitalDeedModal } from '@/components/DigitalDeedModal';
import { DigitalKhatianModal } from '@/components/DigitalKhatianModal';
import { FraudAlertModal } from '@/components/FraudAlertModal';
import { useLandApp } from '@/context/LandAppContext';
import { ShieldCheck, Database, Landmark } from 'lucide-react';

export default function Home() {
  const { activeRole, language } = useLandApp();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-100/70 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* 1. Top High-Contrast Dark Slate Compliance Ribbon */}
      <ComplianceBanner />

      {/* 2. Top Header Navigation with Segmented Glass Role Switcher */}
      <Navbar />

      {/* 3. Executive KPI Ribbon (4 Real-Time Metric Cards) */}
      <ExecutiveKpiRibbon />

      {/* 4. Main Role Perspective Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeRole === 'sub_registrar' && <SubRegistrarView />}
        {activeRole === 'ac_land' && <AcLandView />}
        {activeRole === 'citizen' && <CitizenPortalView />}
        {activeRole === 'bank_judiciary' && <BankCourtGovView />}
        {activeRole === 'mouza_map' && <DlrsMouzaMapView />}
        {activeRole === 'tamper_test' && <TamperSimulatorView />}
      </main>

      {/* 5. Global Interactive Certificate & Forensic Modals */}
      <DigitalDeedModal />
      <DigitalKhatianModal />
      <FraudAlertModal />

      {/* 6. Flagship National GovTech Footer */}
      <footer className="no-print bg-white/95 border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900">SetuLand (সেতু-ল্যান্ড)</span>
            <span>•</span>
            <span>LandTech 2026 Innovation Hackathon</span>
            <span className="hidden md:inline bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
              Track P4: Smart e-Mutation & Unified Registry
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Touch Escrow Consensus</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Database className="w-3.5 h-3.5 text-cyan-600" />
              <span>100% Synthetic Dummy Data</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
