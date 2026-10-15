'use client';

import React from 'react';
import { ComplianceBanner } from '@/components/layout/ComplianceBanner';
import { NavbarRoleSwitcher } from '@/components/layout/NavbarRoleSwitcher';
import { ExecutiveKpiRibbon } from '@/components/layout/ExecutiveKpiRibbon';
import { SubRegistrarPortal } from '@/components/portals/SubRegistrarPortal';
import { AcLandPortal } from '@/components/portals/AcLandPortal';
import { CitizenPortal } from '@/components/portals/CitizenPortal';
import { InstitutionalLocksPortal } from '@/components/portals/InstitutionalLocksPortal';
import { LineageTreeModal } from '@/components/shared/LineageTreeModal';
import { OfficialCertificateModal } from '@/components/shared/OfficialCertificateModal';
import { DigitalLtNoticeModal } from '@/components/shared/DigitalLtNoticeModal';
import { BlockchainAuditLog } from '@/components/shared/BlockchainAuditLog';
import { WarisanCalculatorModal } from '@/components/portals/WarisanCalculatorModal';
import { GovSmsDrawer } from '@/components/shared/GovSmsDrawer';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { ShieldCheck, Database, Landmark, Heart } from 'lucide-react';

export default function Home() {
  const { activeRole, language } = useLandRegistry();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-100/70 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* 1. Top High-Contrast Compliance Ribbon */}
      <ComplianceBanner />

      {/* 2. Top Segmented Glass Navbar Role Switcher */}
      <NavbarRoleSwitcher />

      {/* 3. Executive KPI Ribbon (4 Real-Time Animated Metrics) */}
      <ExecutiveKpiRibbon />

      {/* 4. Active Portal View Shell */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeRole === 'SUB_REGISTRAR' && <SubRegistrarPortal />}
        {activeRole === 'AC_LAND' && <AcLandPortal />}
        {activeRole === 'CITIZEN' && <CitizenPortal />}
        {activeRole === 'INSTITUTIONAL_LOCKS' && <InstitutionalLocksPortal />}
      </main>

      {/* 5. Shared Modals & Drawers */}
      <LineageTreeModal />
      <OfficialCertificateModal />
      <DigitalLtNoticeModal />
      <BlockchainAuditLog />
      <WarisanCalculatorModal />
      <GovSmsDrawer />

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
