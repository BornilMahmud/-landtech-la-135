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
  ArrowRightCircle,
  Smartphone,
  Users,
  Coins
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';

export const CitizenPortalView: React.FC = () => {
  const { 
    mutations, 
    khatians, 
    setActivePorcha, 
    language,
    selectedPlotId,
    setSelectedPlotId,
    showNotification,
    setIsWarisanModalOpen,
    setIsSmsDrawerOpen,
    setIsAuditLogOpen,
    setActiveLtNotice,
    setLineageModalKhatian
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
      if (showNotification) {
        showNotification({
          en: 'Tracking ID or Deed Number not found in unified ledger.',
          bn: 'প্রদত্ত ট্র্যাকিং আইডি বা দলিল নম্বর পাওয়া যায়নি।'
        }, 'warning');
      } else {
        alert(language === 'en' ? 'Tracking ID or Deed Number not found.' : 'প্রদত্ত ট্র্যাকিং আইডি বা দলিল নম্বর পাওয়া যায়নি।');
      }
    }
  };

  const linkedNewKhatian = searchedCase?.newKhatianNo
    ? khatians.find(k => k.khatianNo === searchedCase.newKhatianNo)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="bg-[#121215] text-[#f4f4f5] rounded-lg p-5 sm:p-6 border border-[#27272a] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#18181b] text-[#16A34A] text-xs font-mono font-semibold px-2.5 py-0.5 rounded-sm border border-[#16A34A]/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Public Citizen Transparency & Self-Service' : 'নাগরিক সেবা ও স্বচ্ছতা পোর্টাল'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#f4f4f5]">
              {language === 'en' 
                ? 'Citizen Portal: Live e-Mutation Tracker & Property Verification' 
                : 'নাগরিক পোর্টাল: লাইভ নামজারি ট্র্যাকার ও জমি ক্রয়ের পূর্বে যাচাই'}
            </h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Track your automated e-mutation journey across 5 government stages in real time or inspect any land parcel for active mortgages, court stays, and title lineage.'
                : 'দলিল রেজিস্ট্রির পর ৫ স্তরের স্বয়ংক্রিয় অগ্রগতি পর্যবেক্ষণ করুন অথবা যেকোনো জমি কেনার আগে বন্ধক, মামলা ও মালিকানার ধারাবাহিকতা যাচাই করুন।'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-[#18181b] p-1 rounded-lg border border-[#27272a] shrink-0 text-xs font-sans">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer focus:outline-none ${
                activeTab === 'tracker'
                  ? 'bg-[#d4a657] text-[#09090b] font-semibold shadow-xs'
                  : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#27272a]'
              }`}
            >
              {language === 'en' ? 'Mutation Tracker' : 'নামজারি ট্র্যাকার'}
            </button>
            <button
              onClick={() => setActiveTab('inspector')}
              className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer focus:outline-none ${
                activeTab === 'inspector'
                  ? 'bg-[#d4a657] text-[#09090b] font-semibold shadow-xs'
                  : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#27272a]'
              }`}
            >
              {language === 'en' ? 'Check Before You Buy' : 'জমি কেনার আগে যাচাই'}
            </button>
          </div>
        </div>
      </div>

      {/* Citizen Self-Service Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setIsWarisanModalOpen(true)}
          className="p-3.5 rounded-lg bg-[#121215] border border-amber-500/30 hover:border-amber-500/60 transition-all text-left group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-amber-500/15 text-amber-300 border border-amber-500/30">
              QURANIC SHARES
            </span>
          </div>
          <h4 className="font-sans font-semibold text-sm text-[#f4f4f5] group-hover:text-amber-300 transition-colors">
            {language === 'en' ? 'Farayez Inheritance Calculator' : 'ফারায়েজ বণ্টন ক্যালকুলেটর'}
          </h4>
          <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
            {language === 'en' 
              ? 'Calculate Islamic legal shares, Anna-Ganda conversions, and trigger succession Khatian split.' 
              : 'কোরআনিক নিয়মে ওয়ারিশান অংশ, আনা-গণ্ডা হিসাব ও স্বয়ংক্রিয় নামজারি কর্তন করুন।'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setIsSmsDrawerOpen(true)}
          className="p-3.5 rounded-lg bg-[#121215] border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-left group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <Smartphone className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              88096...
            </span>
          </div>
          <h4 className="font-sans font-semibold text-sm text-[#f4f4f5] group-hover:text-emerald-300 transition-colors">
            {language === 'en' ? 'Government SMS Gateway' : 'সরকারি এসএমএস গেটওয়ে'}
          </h4>
          <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
            {language === 'en' 
              ? 'Live push feed of mutation status, deed sealing, and 48h SLA escalation alerts.' 
              : 'দলিল সম্পাদন, নামজারি ট্র্যাকিং ও ৪৮ ঘণ্টার এসএলএ সতর্কবার্তার লাইভ হিস্ট্রি।'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setIsAuditLogOpen(true)}
          className="p-3.5 rounded-lg bg-[#121215] border border-blue-500/30 hover:border-blue-500/60 transition-all text-left group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
              <History className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-blue-500/15 text-blue-300 border border-blue-500/30">
              MERKLE CHAIN
            </span>
          </div>
          <h4 className="font-sans font-semibold text-sm text-[#f4f4f5] group-hover:text-blue-300 transition-colors">
            {language === 'en' ? 'Cryptographic Audit Trail' : 'ক্রিপ্টোগ্রাফিক অডিট লেজার'}
          </h4>
          <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
            {language === 'en' 
              ? 'Immutable SHA-256 block ledger recording every deed, lock, and Khatian partition.' 
              : 'প্রতিটি দলিল, জমি লক ও নামজারি বিভাজনের অপরিবর্তনযোগ্য ব্লকচেইন রেকর্ড।'}
          </p>
        </button>
      </div>

      {/* Tab A: Live e-Mutation Status Tracker */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Search Bar & Quick Preset Selector */}
          <div className="bg-[#121215] rounded-lg p-4 sm:p-5 border border-[#27272a] space-y-3.5 shadow-xs">
            <form onSubmit={handleSearchTracking} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Enter e-Mutation Tracking ID (e.g. MUT-2026-5001) or Deed Number...' : 'ট্র্যাকিং আইডি (যেমন: MUT-2026-5001) বা দলিল নম্বর লিখুন...'}
                  value={trackingSearch}
                  onChange={(e) => setTrackingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm font-mono border border-[#27272a] bg-[#09090b] text-[#f4f4f5] placeholder-[#71717a] rounded-md focus:border-[#d4a657] focus:outline-none tabular-nums"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-[#d4a657] hover:bg-[#be8a3a] text-[#09090b] text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer border border-[#d4a657] shadow-xs focus:outline-none"
              >
                {language === 'en' ? 'Track Status' : 'অবস্থা খুঁজুন'}
              </button>
            </form>

            {/* Quick Click Demo Cases */}
            <div className="flex items-center gap-2 text-xs overflow-x-auto pt-1 text-[#a1a1aa] scrollbar-none font-sans">
              <span className="font-semibold text-[#71717a] shrink-0 text-[11px] uppercase tracking-wider font-mono">
                {language === 'en' ? 'Quick Test Cases:' : 'ক্লিক করে টেস্ট করুন:'}
              </span>
              {mutations.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setTrackingSearch(m.id);
                    setSearchedCase(m);
                  }}
                  className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-colors whitespace-nowrap cursor-pointer focus:outline-none ${
                    searchedCase?.id === m.id
                      ? 'bg-[#18181b] border-[#d4a657] text-[#d4a657] font-semibold'
                      : 'bg-[#09090b] border-[#27272a] hover:bg-[#18181b] text-[#a1a1aa]'
                  }`}
                >
                  {m.id} ({m.status === 'MUTATION_APPROVED' ? 'Approved' : 'Pending'})
                </button>
              ))}
            </div>
          </div>

          {/* Searched Case Progress Card */}
          {searchedCase ? (
            <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-6 text-[#f4f4f5] shadow-xs">
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-[#f4f4f5] tabular-nums">{searchedCase.id}</span>
                    <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-sm border ${
                      searchedCase.status === 'MUTATION_APPROVED'
                        ? 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30'
                        : 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30'
                    }`}>
                      {searchedCase.status === 'MUTATION_APPROVED'
                        ? (language === 'en' ? '✓ Completed & New Porcha Issued' : '✓ নামজারি সম্পন্ন ও পর্চা প্রস্তুত')
                        : (language === 'en' ? 'Processing in Government Pipeline' : 'সরকারি পাইপলাইনে প্রক্রিয়াধীন')}
                    </span>
                  </div>
                  <p className="text-xs text-[#71717a] mt-1 font-mono">
                    {language === 'en' ? 'Deed Reference:' : 'দলিল নম্বর:'} <strong className="text-[#f4f4f5]">{searchedCase.deedNo}</strong> • {searchedCase.mouza} Mouza • {searchedCase.transferAreaDecimals.toFixed(2)} Decimals
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {searchedCase.ltNotice && (
                    <button
                      type="button"
                      onClick={() => {
                        if (searchedCase.ltNotice) setActiveLtNotice(searchedCase.ltNotice);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-md text-xs font-semibold border border-amber-500/30 transition-colors cursor-pointer shadow-xs focus:outline-none"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'en' ? 'View Section 89 LT Notice' : 'দখল হস্তান্তর নোটিশ'}</span>
                    </button>
                  )}
                  {searchedCase.status === 'MUTATION_APPROVED' && (
                    <button
                      onClick={() => {
                        if (linkedNewKhatian) {
                          setActivePorcha({ khatian: linkedNewKhatian, mutationId: searchedCase.id });
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-xs focus:outline-none"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Print / Save Digital Porcha' : 'ডিজিটাল পর্চা প্রিন্ট / সংরক্ষণ'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Horizontal 5-Stage Stepper */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans font-semibold text-[#f4f4f5] text-xs uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#d4a657]" />
                    <span>{language === 'en' ? '5-Stage Automated Mutation Progress Pipeline:' : '৫-স্তরের স্বয়ংক্রিয় নামজারি প্রগ্রেস পাইপলাইন:'}</span>
                  </h3>
                  <span className="text-[11px] font-mono text-[#71717a]">
                    Step {searchedCase.workflowSteps.filter(s => s.completed).length} of 5 Completed
                  </span>
                </div>

                {/* Horizontal Step Tracker Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                  {searchedCase.workflowSteps.map((step, idx) => {
                    const isCompleted = step.completed;
                    const isCurrent = !isCompleted && (idx === 0 || searchedCase.workflowSteps[idx - 1]?.completed);

                    let officeBadge = 'Sub-Registry';
                    if (step.step === 2) officeBadge = 'Escrow Engine';
                    if (step.step === 3) officeBadge = 'AC Land Queue';
                    if (step.step === 4) officeBadge = 'Tahsil Office';
                    if (step.step === 5) officeBadge = 'DLRS RoR Ledger';

                    return (
                      <div
                        key={step.step}
                        className={`p-3.5 rounded-md border text-xs space-y-2 transition-colors relative ${
                          isCompleted
                            ? 'bg-[#18181b] border-[#16A34A]/40 text-[#f4f4f5]'
                            : isCurrent
                              ? 'bg-[#18181b] border-[#D97706] text-[#f4f4f5]'
                              : 'bg-[#09090b] border-[#27272a] text-[#71717a]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-[#121215] border border-[#27272a] text-[#a1a1aa]">
                            {officeBadge}
                          </span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                          ) : isCurrent ? (
                            <Clock className="w-4 h-4 text-[#D97706] shrink-0" />
                          ) : (
                            <span className="font-mono text-[10px] text-[#71717a]">#{step.step}</span>
                          )}
                        </div>

                        <div>
                          <span className="font-sans font-semibold text-[11px] block leading-snug text-[#f4f4f5]">
                            {step.step}. {language === 'en' ? step.nameEn : step.nameBn}
                          </span>
                          {step.timestamp && (
                            <span className="text-[10px] font-mono text-[#71717a] block mt-0.5">
                              {step.timestamp}
                            </span>
                          )}
                        </div>

                        {step.note && (
                          <p className="text-[10px] text-[#a1a1aa] leading-tight border-t border-[#27272a] pt-1">
                            {step.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Before vs. After Khatian Split Comparison Card */}
              <div className="bg-[#18181b] rounded-lg p-5 border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-[#d4a657]" />
                    <h4 className="font-sans font-semibold text-[#f4f4f5] text-xs uppercase tracking-wider">
                      {language === 'en' ? 'Before vs. After Automated Khatian Splitting Ledger:' : 'স্বয়ংক্রিয় খতিয়ান কর্তন ও জমার বিভাজন:'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-sm border border-[#16A34A]/30">
                    Ledger State Sync
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Seller's Parent Khatian */}
                  <div className="p-3.5 rounded-md bg-[#121215] border border-[#27272a] space-y-1.5">
                    <span className="text-[10px] font-mono font-semibold text-[#71717a] uppercase tracking-wider block">
                      1. Seller Parent Khatian (মূল খতিয়ান)
                    </span>
                    <div className="font-mono font-bold text-[#f4f4f5] text-sm">
                      {searchedCase.parentKhatianNo} (Dag #{searchedCase.dagNo})
                    </div>
                    <div className="text-[#a1a1aa] text-[11px]">
                      Owner: <strong className="text-[#f4f4f5] font-sans">{searchedCase.sellerName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#DC2626] font-semibold pt-1 border-t border-[#27272a]">
                      <span>Deducted for Buyer:</span>
                      <span className="font-mono tabular-nums">-{searchedCase.transferAreaDecimals.toFixed(2)} Dec</span>
                    </div>
                  </div>

                  {/* Right: Buyer's New Child Khatian */}
                  <div className="p-3.5 rounded-md bg-[#121215] border border-[#16A34A]/30 space-y-1.5">
                    <span className="text-[10px] font-mono font-semibold text-[#16A34A] uppercase tracking-wider block">
                      2. Buyer New Mutated Khatian (নতুন সৃজিত খতিয়ান)
                    </span>
                    <div className="font-mono font-bold text-[#16A34A] text-sm flex items-center justify-between">
                      <span>{searchedCase.newKhatianNo || `${searchedCase.parentKhatianNo}/A`}</span>
                      <span className="text-[10px] bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/40 font-mono px-2 py-0.5 rounded-sm font-semibold">
                        {searchedCase.status === 'MUTATION_APPROVED' ? 'Issued' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-[#a1a1aa] text-[11px]">
                      New Owner: <strong className="text-[#f4f4f5] font-sans">{searchedCase.buyerName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#16A34A] font-bold pt-1 border-t border-[#16A34A]/20">
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
          <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-5 text-[#f4f4f5] shadow-xs">
            <div>
              <label className="block text-xs font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                {language === 'en' ? 'Select Land Parcel to Inspect:' : 'যাচাই করার জন্য জমি/দাগ নির্বাচন করুন:'}
              </label>
              <select
                value={selectedPlot?.id}
                onChange={(e) => setSelectedPlotId(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium border border-[#27272a] rounded-md px-3.5 py-2.5 bg-[#09090b] text-[#f4f4f5] focus:border-[#d4a657] focus:outline-none"
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
              <div className="p-4 bg-[#18181b] rounded-lg border border-[#27272a] shadow-xs">
                <span className="text-[#71717a] block text-[10px] uppercase font-mono font-semibold">{language === 'en' ? 'Total Area' : 'মোট জমি'}</span>
                <span className="text-xl font-bold text-[#f4f4f5] font-mono tabular-nums">
                  {selectedPlot?.totalAreaDecimals.toFixed(2)} Dec
                </span>
                <span className="block text-[11px] text-[#71717a] mt-1 font-mono">
                  {selectedPlot?.lockedAreaDecimals.toFixed(2)} Dec in Escrow
                </span>
              </div>

              {/* Net Available Area */}
              <div className="p-4 bg-[#18181b] rounded-lg border border-[#16A34A]/30 shadow-xs">
                <span className="text-[#16A34A] block text-[10px] uppercase font-mono font-semibold">{language === 'en' ? 'Net Unlocked for Sale' : 'অবমুক্ত বিক্রয়যোগ্য'}</span>
                <span className="text-xl font-bold text-[#16A34A] font-mono tabular-nums">
                  {Math.max(0, (selectedPlot?.totalAreaDecimals || 0) - (selectedPlot?.lockedAreaDecimals || 0)).toFixed(2)} Dec
                </span>
                <span className="block text-[11px] text-[#16A34A] font-medium mt-1">
                  Safe to Purchase
                </span>
              </div>

              {/* Bank Mortgage Status */}
              <div className={`p-4 rounded-lg border shadow-xs ${
                selectedPlot?.isMortgaged 
                  ? 'bg-[#18181b] border-[#DC2626]/40 text-[#f87171]'
                  : 'bg-[#18181b] border-[#16A34A]/30 text-[#f4f4f5]'
              }`}>
                <span className="block text-[10px] uppercase font-mono font-semibold text-[#a1a1aa]">
                  {language === 'en' ? 'Bank Mortgage Lien' : 'ব্যাংক বন্ধক'}
                </span>
                <span className="text-sm font-semibold flex items-center gap-1.5 mt-1">
                  {selectedPlot?.isMortgaged ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span className="text-[#DC2626] font-mono">ACTIVE LIEN</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span className="text-[#16A34A]">Free &amp; Clear</span>
                    </>
                  )}
                </span>
                {selectedPlot?.isMortgaged && (
                  <span className="block text-[10px] text-[#DC2626] truncate mt-1 font-mono">
                    {selectedPlot.mortgageDetails?.bankName}
                  </span>
                )}
              </div>

              {/* Court Dispute Status */}
              <div className={`p-4 rounded-lg border shadow-xs ${
                selectedPlot?.hasCourtCase 
                  ? 'bg-[#18181b] border-[#D97706]/40 text-[#fbbf24]'
                  : 'bg-[#18181b] border-[#16A34A]/30 text-[#f4f4f5]'
              }`}>
                <span className="block text-[10px] uppercase font-mono font-semibold text-[#a1a1aa]">
                  {language === 'en' ? 'Court Injunction' : 'আদালতের মামলা'}
                </span>
                <span className="text-sm font-semibold flex items-center gap-1.5 mt-1">
                  {selectedPlot?.hasCourtCase ? (
                    <>
                      <Scale className="w-3.5 h-3.5 text-[#D97706]" />
                      <span className="text-[#D97706] font-mono">DISPUTED</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span className="text-[#16A34A]">No Injunctions</span>
                    </>
                  )}
                </span>
                {selectedPlot?.hasCourtCase && (
                  <span className="block text-[10px] text-[#D97706] truncate mt-1 font-mono">
                    {selectedPlot.courtCaseDetails?.caseNo}
                  </span>
                )}
              </div>
            </div>

            {/* Unbroken Chain of Title (CS -> SA -> RS -> BS) */}
            <div className="border border-[#27272a] rounded-lg overflow-hidden text-xs shadow-xs">
              <div className="bg-[#18181b] px-4 py-2.5 font-sans font-semibold text-[#f4f4f5] flex items-center justify-between border-b border-[#27272a]">
                <span className="flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#d4a657]" />
                  <span>{language === 'en' ? 'Full Chain-of-Title Lineage (CS ➔ SA ➔ RS ➔ BS):' : 'মালিকানার ধারাবাহিক ধারা (সিএস ➔ এসএ ➔ আরএস ➔ বিএস):'}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLineageModalKhatian(selectedPlot)}
                    className="text-[11px] font-mono text-[#d4a657] hover:underline flex items-center gap-1 cursor-pointer"
                    title="Open full interactive 4-generation diagnostic tree"
                  >
                    <Layers className="w-3 h-3 text-[#d4a657]" />
                    <span>{language === 'en' ? 'Lineage Tree' : 'পরচা ডায়াগনস্টিক'}</span>
                  </button>
                  <span className="text-[10px] bg-[#16A34A]/10 text-[#16A34A] font-mono font-semibold px-2 py-0.5 rounded-sm border border-[#16A34A]/30">
                    4-Gen Verified
                  </span>
                </div>
              </div>

              <div className="divide-y divide-[#27272a] bg-[#121215]">
                {selectedPlot?.chainOfTitle.map((c, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between hover:bg-[#18181b] transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-md bg-[#18181b] border border-[#27272a] text-[#16A34A] font-mono font-bold flex items-center justify-center text-xs">
                        {c.surveyType}
                      </span>
                      <div>
                        <span className="font-sans font-semibold text-[#f4f4f5] block">{c.ownerName}</span>
                        <span className="text-[10px] font-mono text-[#71717a]">NID: {c.ownerNid}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs tabular-nums">
                      <span className="font-bold text-[#16A34A]">{c.areaDecimals.toFixed(2)} Dec</span>
                      <span className="block text-[10px] text-[#71717a]">Year: {c.year} • #{c.khatianNo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ejmali Joint Property Co-Sharer Quota Card */}
            {selectedPlot?.coSharers && selectedPlot.coSharers.length > 0 && (
              <div className="bg-[#18181b] rounded-lg p-4 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Ejmali Co-Sharer Legal Quota (আনা-গণ্ডা বিভাজন):' : 'এজমালি খতিয়ান শরিকানা কোটা:'}</span>
                  </span>
                  <span className="text-[10px] text-[#a1a1aa] font-mono">16 Anna Complete</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  {selectedPlot.coSharers.map((cs) => (
                    <div 
                      key={cs.id} 
                      className={`p-2.5 rounded-md border ${
                        cs.name === selectedPlot.ownerName 
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                          : 'bg-[#121215] border-[#27272a] text-[#a1a1aa]'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#f4f4f5] truncate">{cs.name || cs.nameEn}</div>
                      <div className="text-[10px] text-[#d4a657]">{cs.shareTraditional || cs.shareLabelBn} ({Math.round(cs.shareFraction * 16)} আনা)</div>
                      <div className="text-[10px] text-[#71717a]">{(cs.holdingAreaDecimals ?? cs.maxOwnedDecimals ?? 0).toFixed(2)} Dec Legal Quota</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Khajna Arrear Notice */}
            {selectedPlot?.khajnaArrearsBDT && selectedPlot.khajnaArrearsBDT > 0 ? (
              <div className="bg-[#18181b] rounded-lg p-3.5 border border-amber-500/30 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-amber-300 font-medium">
                      {language === 'en' ? 'Land Development Tax (Khajna) Arrear' : 'ভূমি উন্নয়ন কর (খাজনা) বকেয়া'}
                    </span>
                    <span className="text-[11px] text-[#a1a1aa] block">
                      {language === 'en' 
                        ? 'Requires clearance during registration checkout before mutation issuance.' 
                        : 'নামজারি অনুমোদনের পূর্বে বকেয়া খাজনা পরিশোধ বাধ্যতামূলক।'}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                  ৳ {selectedPlot.khajnaArrearsBDT.toLocaleString()} BDT
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenPortalView;
