'use client';

import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Building2, 
  Lock, 
  Scale, 
  Landmark, 
  Printer, 
  ShieldCheck, 
  ArrowRight,
  Layers,
  History,
  QrCode,
  AlertTriangle,
  Scissors,
  Check,
  TrendingDown,
  Sparkles,
  ArrowRightCircle
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';

export const CitizenPortalView: React.FC = () => {
  const { 
    mutations, 
    khatians, 
    setActivePorcha, 
    language,
    selectedPlotId,
    setSelectedPlotId 
  } = useLandApp();

  const [activeTab, setActiveTab] = useState<'tracker' | 'inspector'>('tracker');
  const [trackingSearch, setTrackingSearch] = useState(mutations[0]?.id || '');
  const [searchedCase, setSearchedCase] = useState(mutations[0]);

  const selectedPlot = khatians.find(k => k.id === selectedPlotId) || khatians[0];

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    const found = mutations.find(
      m => m.id.toLowerCase() === trackingSearch.trim().toLowerCase() ||
           m.deedNo.toLowerCase() === trackingSearch.trim().toLowerCase()
    );
    if (found) {
      setSearchedCase(found);
    } else {
      alert(language === 'en' ? 'Tracking ID or Deed Number not found.' : 'প্রদত্ত ট্র্যাকিং আইডি বা দলিল নম্বর পাওয়া যায়নি।');
    }
  };

  const linkedNewKhatian = searchedCase?.newKhatianNo
    ? khatians.find(k => k.khatianNo === searchedCase.newKhatianNo)
    : null;

  const parentKhatianRecord = searchedCase
    ? khatians.find(k => k.khatianNo === searchedCase.parentKhatianNo)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-lg border border-teal-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-800/60 text-teal-200 text-xs font-semibold px-3 py-1 rounded-full border border-teal-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>{language === 'en' ? 'Public Citizen Transparency & Self-Service' : 'নাগরিক সেবা ও স্বচ্ছতা পোর্টাল'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'en' 
                ? 'Citizen Portal: Live e-Mutation "Pizza-Tracker" & "Check Before You Buy"' 
                : 'নাগরিক পোর্টাল: লাইভ নামজারি পিৎজা-ট্র্যাকার ও জমি ক্রয়ের পূর্বে যাচাই'}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-2xl">
              {language === 'en'
                ? 'Track your automated e-mutation journey across 5 government stages in real time or inspect any land parcel for active mortgages, court stays, and title lineage.'
                : 'দলিল রেজিস্ট্রির পর ৫ স্তরের স্বয়ংক্রিয় অগ্রগতি পর্যবেক্ষণ করুন অথবা যেকোনো জমি কেনার আগে বন্ধক, মামলা ও মালিকানার ধারাবাহিকতা যাচাই করুন।'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shrink-0 text-xs font-bold shadow-lg">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'tracker'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'en' ? '📍 Live Mutation Tracker' : '📍 লাইভ নামজারি ট্র্যাকার'}
            </button>
            <button
              onClick={() => setActiveTab('inspector')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'inspector'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'en' ? '🔍 "Check Before You Buy"' : '🔍 জমি কেনার আগে যাচাই'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab A: Live e-Mutation Status Tracker */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Search Bar & Quick Preset Selector */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-ambient border border-slate-200/90 space-y-4">
            <form onSubmit={handleSearchTracking} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Enter e-Mutation Tracking ID (e.g. MUT-2026-5001) or Deed Number...' : 'ট্র্যাকিং আইডি (যেমন: MUT-2026-5001) বা দলিল নম্বর লিখুন...'}
                  value={trackingSearch}
                  onChange={(e) => setTrackingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none tabular-nums"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors"
              >
                {language === 'en' ? 'Track Status' : 'অবস্থা খুঁজুন'}
              </button>
            </form>

            {/* Quick Click Demo Cases */}
            <div className="flex items-center gap-2 text-xs overflow-x-auto pt-1 text-slate-600 scrollbar-none">
              <span className="font-bold text-slate-500 shrink-0">
                {language === 'en' ? 'Quick Test Cases:' : 'ক্লিক করে টেস্ট করুন:'}
              </span>
              {mutations.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setTrackingSearch(m.id);
                    setSearchedCase(m);
                  }}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors whitespace-nowrap ${
                    searchedCase?.id === m.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-1 ring-emerald-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {m.id} ({m.status === 'MUTATION_APPROVED' ? 'Approved' : 'Pending'})
                </button>
              ))}
            </div>
          </div>

          {/* Searched Case Progress Card */}
          {searchedCase ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-ambient border border-slate-200/90 space-y-6">
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-slate-900 tabular-nums">{searchedCase.id}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      searchedCase.status === 'MUTATION_APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {searchedCase.status === 'MUTATION_APPROVED'
                        ? (language === 'en' ? '✓ Completed & New Porcha Issued' : '✓ নামজারি সম্পন্ন ও পর্চা প্রস্তুত')
                        : (language === 'en' ? 'Processing in Government Pipeline' : 'সরকারি পাইপলাইনে প্রক্রিয়াধীন')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'en' ? 'Deed Reference:' : 'দলিল নম্বর:'} <strong className="font-mono text-slate-800">{searchedCase.deedNo}</strong> • {searchedCase.mouza} Mouza • {searchedCase.transferAreaDecimals.toFixed(2)} Decimals
                  </p>
                </div>

                {searchedCase.status === 'MUTATION_APPROVED' && (
                  <button
                    onClick={() => {
                      if (linkedNewKhatian) {
                        setActivePorcha({ khatian: linkedNewKhatian, mutationId: searchedCase.id });
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors animate-pulse"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{language === 'en' ? 'Print / Save Digital Porcha' : 'ডিজিটাল পর্চা প্রিন্ট / সংরক্ষণ'}</span>
                  </button>
                )}
              </div>

              {/* Glowing Horizontal 5-Stage "Pizza-Tracker" Stepper */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'en' ? 'Live 5-Stage Automated Mutation Progress Pipeline:' : '৫-স্তরের স্বয়ংক্রিয় নামজারি প্রগ্রেস পাইপলাইন:'}</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Step {searchedCase.workflowSteps.filter(s => s.completed).length} of 5 Completed
                  </span>
                </div>

                {/* Horizontal Step Tracker Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                  {searchedCase.workflowSteps.map((step, idx) => {
                    const isCompleted = step.completed;
                    const isCurrent = !isCompleted && (idx === 0 || searchedCase.workflowSteps[idx - 1]?.completed);

                    let officeBadge = '🏛️ Sub-Registry';
                    if (step.step === 2) officeBadge = '🔒 Escrow Engine';
                    if (step.step === 3) officeBadge = '⚡ AC Land Queue';
                    if (step.step === 4) officeBadge = '📋 Union Land (Tahsil)';
                    if (step.step === 5) officeBadge = '📜 DLRS RoR Ledger';

                    return (
                      <div
                        key={step.step}
                        className={`p-3.5 rounded-2xl border text-xs space-y-2 transition-all relative ${
                          isCompleted
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm'
                            : isCurrent
                              ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-md ring-2 ring-amber-400'
                              : 'bg-slate-50/70 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/70 border border-slate-200">
                            {officeBadge}
                          </span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isCurrent ? (
                            <Clock className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                          ) : (
                            <span className="font-mono text-[10px] text-slate-400">#{step.step}</span>
                          )}
                        </div>

                        <div>
                          <span className="font-extrabold text-[11px] block leading-snug">
                            {language === 'en' ? step.nameEn : step.nameBn}
                          </span>
                          {step.timestamp && (
                            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                              {step.timestamp}
                            </span>
                          )}
                        </div>

                        {step.note && (
                          <p className="text-[10px] text-slate-600 leading-tight border-t border-slate-200/60 pt-1">
                            {step.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Before vs. After Khatian Split Comparison Card (The Aha! Moment) */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      {language === 'en' ? 'Before vs. After Automated Khatian Splitting Ledger:' : 'স্বয়ংক্রিয় খতিয়ান কর্তন ও জমার বিভাজন:'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Ledger State Sync
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Seller's Parent Khatian */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      1. Seller Parent Khatian (মূল খতিয়ান)
                    </span>
                    <div className="font-mono font-black text-slate-900 text-sm">
                      {searchedCase.parentKhatianNo} (Dag #{searchedCase.dagNo})
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Owner: <strong>{searchedCase.sellerName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-rose-700 font-bold pt-1 border-t">
                      <span>Deducted for Buyer:</span>
                      <span className="font-mono tabular-nums">-{searchedCase.transferAreaDecimals.toFixed(2)} Dec</span>
                    </div>
                  </div>

                  {/* Right: Buyer's New Child Khatian */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-300 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      2. Buyer New Mutated Khatian (নতুন সৃজিত খতিয়ান)
                    </span>
                    <div className="font-mono font-black text-emerald-950 text-sm flex items-center justify-between">
                      <span>{searchedCase.newKhatianNo || `${searchedCase.parentKhatianNo}/A`}</span>
                      <span className="text-[10px] bg-emerald-600 text-white font-sans px-2 py-0.5 rounded-full font-bold">
                        {searchedCase.status === 'MUTATION_APPROVED' ? 'Issued' : 'Pending Approval'}
                      </span>
                    </div>
                    <div className="text-slate-700 text-[11px]">
                      New Owner: <strong>{searchedCase.buyerName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-emerald-800 font-black pt-1 border-t border-emerald-200">
                      <span>Mutated Area:</span>
                      <span className="font-mono tabular-nums">+{searchedCase.transferAreaDecimals.toFixed(2)} Dec</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Tab B: "Check Before You Buy" Plot Inspector */}
      {activeTab === 'inspector' && (
        <div className="space-y-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-ambient border border-slate-200/90 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'en' ? 'Select Land Parcel to Inspect:' : 'যাচাই করার জন্য জমি/দাগ নির্বাচন করুন:'}
              </label>
              <select
                value={selectedPlot?.id}
                onChange={(e) => setSelectedPlotId(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none shadow-sm"
              >
                {khatians.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.khatianNo} | Dag #{k.dagNo} ({k.mouza}) — {k.ownerName} ({k.totalAreaDecimals.toFixed(1)} Dec)
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {/* Total & Locked Balance */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{language === 'en' ? 'Total Area' : 'মোট জমি'}</span>
                <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                  {selectedPlot?.totalAreaDecimals.toFixed(2)} Dec
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  {selectedPlot?.lockedAreaDecimals.toFixed(2)} Dec in Escrow Lock
                </span>
              </div>

              {/* Net Available Area */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-800 block text-[10px] uppercase font-bold">{language === 'en' ? 'Net Unlocked for Sale' : 'অবমুক্ত বিক্রয়যোগ্য'}</span>
                <span className="text-lg font-black text-emerald-700 font-mono tabular-nums">
                  {Math.max(0, (selectedPlot?.totalAreaDecimals || 0) - (selectedPlot?.lockedAreaDecimals || 0)).toFixed(2)} Dec
                </span>
                <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
                  Safe to Purchase
                </span>
              </div>

              {/* Bank Mortgage Status */}
              <div className={`p-4 rounded-xl border ${
                selectedPlot?.isMortgaged 
                  ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <span className="block text-[10px] uppercase font-bold">
                  {language === 'en' ? 'Bank Mortgage Lien' : 'ব্যাংক বন্ধক'}
                </span>
                <span className="text-sm font-black flex items-center gap-1 mt-1">
                  {selectedPlot?.isMortgaged ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-rose-600" />
                      <span>ACTIVE LIEN ⚠️</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Free & Clear</span>
                    </>
                  )}
                </span>
                {selectedPlot?.isMortgaged && (
                  <span className="block text-[10px] text-rose-700 truncate mt-1">
                    {selectedPlot.mortgageDetails?.bankName}
                  </span>
                )}
              </div>

              {/* Court Dispute Status */}
              <div className={`p-4 rounded-xl border ${
                selectedPlot?.hasCourtCase 
                  ? 'bg-purple-50 border-purple-300 text-purple-950 shadow-sm'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <span className="block text-[10px] uppercase font-bold">
                  {language === 'en' ? 'Court Injunction' : 'আদালতের মামলা'}
                </span>
                <span className="text-sm font-black flex items-center gap-1 mt-1">
                  {selectedPlot?.hasCourtCase ? (
                    <>
                      <Scale className="w-3.5 h-3.5 text-purple-700" />
                      <span>DISPUTED ⚖️</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>No Injunctions</span>
                    </>
                  )}
                </span>
                {selectedPlot?.hasCourtCase && (
                  <span className="block text-[10px] text-purple-800 truncate mt-1">
                    {selectedPlot.courtCaseDetails?.caseNo}
                  </span>
                )}
              </div>
            </div>

            {/* Unbroken Chain of Title (CS -> SA -> RS -> BS) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <History className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'en' ? 'Full Chain-of-Title Lineage (CS ➔ SA ➔ RS ➔ BS):' : 'মালিকানার ধারাবাহিক ধারা (সিএস ➔ এসএ ➔ আরএস ➔ বিএস):'}</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  4-Generation Verified
                </span>
              </div>

              <div className="divide-y divide-slate-100 bg-white">
                {selectedPlot?.chainOfTitle.map((c, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-mono font-bold flex items-center justify-center text-xs">
                        {c.surveyType}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{c.ownerName}</span>
                        <span className="text-[10px] font-mono text-slate-500">NID: {c.ownerNid}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs tabular-nums">
                      <span className="font-bold text-emerald-800">{c.areaDecimals.toFixed(2)} Dec</span>
                      <span className="block text-[10px] text-slate-500">Year: {c.year} • #{c.khatianNo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
