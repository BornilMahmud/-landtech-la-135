'use client';

import React, { useState, useMemo } from 'react';
import { 
  Landmark, 
  Scale, 
  Building2, 
  Lock, 
  Unlock, 
  Coins, 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { t } from '@/lib/i18n';
import { toDec, formatDec, formatBdt } from '@/lib/crypto-utils';

export const InstitutionalLocksPortal: React.FC = () => {
  const { 
    khatians, 
    citizens, 
    toggleBankMortgage, 
    toggleCourtInjunction, 
    toggleDcAcquisition, 
    language 
  } = useLandRegistry();

  const [selectedDcPlotId, setSelectedDcPlotId] = useState<string>(khatians[0]?.id || 'plot-1');
  const [compensationDisbursed, setCompensationDisbursed] = useState<boolean>(false);

  // FIX 4: Single source of truth reactive plot derivation
  const selectedDcPlot = useMemo(() => {
    return khatians.find(k => k.id === selectedDcPlotId) || khatians[0];
  }, [khatians, selectedDcPlotId]);

  const dcOwner = useMemo(() => {
    return citizens.find(c => c.id === selectedDcPlot?.ownerId);
  }, [citizens, selectedDcPlot?.ownerId]);

  // Compensation Formula: Statutory 200% premium for public infrastructure acquisition (ARIPA 2017)
  const baseRate = selectedDcPlot?.officialRatePerDecimalBdt || 800000;
  const availableArea = selectedDcPlot ? Math.max(0, toDec(selectedDcPlot.totalAreaDecimals - selectedDcPlot.lockedAreaDecimals)) : 0;
  const marketValue = toDec(availableArea * baseRate);
  const statutoryPremium = toDec(marketValue * 2.0); // 200% premium
  const grossCompensation = toDec(marketValue + statutoryPremium);
  const bankLienDeduction = selectedDcPlot?.isMortgaged ? (selectedDcPlot.mortgageLoanAmountBdt || 0) : 0;
  const netPayableOwner = Math.max(0, toDec(grossCompensation - bankLienDeduction));

  const handleDisburse = () => {
    setCompensationDisbursed(true);
    setTimeout(() => setCompensationDisbursed(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-800/60 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
              <Landmark className="w-3.5 h-3.5 text-indigo-300" />
              <span>{t(language, 'roleLocks')}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight mt-1">
              {t(language, 'locksTitle')}
            </h1>
            <p className="text-xs text-indigo-100/80 mt-1 max-w-2xl leading-relaxed">
              {t(language, 'locksSubtitle')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-xs text-center shrink-0">
            <span className="text-[10px] text-indigo-300 uppercase font-bold block">
              Rule Book Section 4 Compliance
            </span>
            <span className="text-xs font-mono font-black text-white mt-0.5 block">
              Direct API Interoperability Matrix
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Bank Mortgage Controller & Civil Court Injunction Controller */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Bank Mortgage Lien Controller */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-ambient space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                {t(language, 'bankMortgageSection')}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              CIB Gateway
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'en'
              ? 'When a bank sanctions a loan against land, the mortgage is registered here in real time. Any attempted sale in the Sub-Registry is immediately blocked.'
              : 'জমির বিপরীতে ব্যাংক ঋণ প্রদান করলে এখানে বন্ধক সক্রিয় হয়। সাব-রেজিস্ট্রিতে বিক্রির চেষ্টা হলে তা সাথে সাথে আটকে দেওয়া হয়।'}
          </p>

          <div className="space-y-2.5">
            {khatians.map((k) => (
              <div 
                key={k.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-900">
                    {k.khatianNo} (Dag #{k.dagNo})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {citizens.find(c => c.id === k.ownerId)?.nameEn} • {k.mouzaEn}
                  </p>
                </div>

                <button
                  onClick={() => toggleBankMortgage(k.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    k.isMortgaged
                      ? 'bg-rose-600 text-white shadow-sm hover:bg-rose-700'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {k.isMortgaged ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{k.isMortgaged ? 'Mortgage Locked' : 'Clear (No Lien)'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Civil Court Injunction Controller */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-ambient space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                {t(language, 'courtInjunctionSection')}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Order 39 CPC
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'en'
              ? 'Judicial stay orders placed by civil courts instantly freeze land transfer rights to prevent illegal alienation during ongoing litigation.'
              : 'আদালত স্থিতাবস্থা জারি করলে সাব-রেজিস্ট্রির ডাটাবেজে তাৎক্ষণিক ফ্রিজ আরোপ হয়, যাতে বিচার চলাকালে গোপনে জমি বিক্রি রোধ করা যায়।'}
          </p>

          <div className="space-y-2.5">
            {khatians.map((k) => (
              <div 
                key={k.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-900">
                    {k.khatianNo} (Dag #{k.dagNo})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {citizens.find(c => c.id === k.ownerId)?.nameEn} • {k.mouzaEn}
                  </p>
                </div>

                <button
                  onClick={() => toggleCourtInjunction(k.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    k.hasCourtCase
                      ? 'bg-rose-600 text-white shadow-sm hover:bg-rose-700'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {k.hasCourtCase ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{k.hasCourtCase ? 'Stay Injunction Active' : 'No Stay Order'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: DC Office Land Acquisition & Statutory Compensation Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-ambient space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-800" />
            <div>
              <h3 className="font-black text-slate-900 text-base">
                {t(language, 'dcAcquisitionSection')}
              </h3>
              <p className="text-xs text-slate-500">
                Acquisition and Requisition of Immovable Property Act 2017 (200% Statutory Premium)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            EFT Direct to Owner
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plot Selector & Notice Status */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Acquired Parcel:
              </label>
              <select
                value={selectedDcPlotId}
                onChange={(e) => setSelectedDcPlotId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              >
                {khatians.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.khatianNo} • Dag #{k.dagNo} • {k.mouzaEn} ({formatDec(k.totalAreaDecimals)} Dec)
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Owner Name:</span>
                <span className="font-bold text-slate-900">{dcOwner?.nameEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Acquisition Gazette Status:</span>
                <button
                  onClick={() => toggleDcAcquisition(selectedDcPlot.id)}
                  className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                    selectedDcPlot?.isDcAcquisition ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {selectedDcPlot?.isDcAcquisition ? 'GAZETTED / ACTIVE NOTICE' : 'NOT ACQUIRED'}
                </button>
              </div>
            </div>
          </div>

          {/* Calculator Breakdown Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Base Market Value ({formatBdt(baseRate)}/dec):</span>
              <span className="font-bold text-slate-900">{formatBdt(marketValue)}</span>
            </div>
            <div className="flex justify-between py-1 text-emerald-800 font-bold">
              <span>Statutory 200% Premium (ARIPA 2017):</span>
              <span>+ {formatBdt(statutoryPremium)}</span>
            </div>
            <div className="flex justify-between py-1 border-t border-slate-200 font-black text-slate-900">
              <span>Gross Compensation:</span>
              <span>{formatBdt(grossCompensation)}</span>
            </div>
            <div className="flex justify-between py-1 text-rose-700">
              <span>Bank Mortgage Auto-Deduction:</span>
              <span>- {formatBdt(bankLienDeduction)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-slate-300 text-sm font-black text-emerald-950 bg-white -mx-2 px-2 rounded-lg">
              <span>Net Payable to Genuine Owner:</span>
              <span>{formatBdt(netPayableOwner)}</span>
            </div>

            <button
              onClick={handleDisburse}
              className="w-full mt-3 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {compensationDisbursed ? <Check className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
              <span>{compensationDisbursed ? 'Compensation Transferred via BEFTN!' : t(language, 'calcCompBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
