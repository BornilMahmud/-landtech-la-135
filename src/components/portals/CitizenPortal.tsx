'use client';

import React, { useState, useMemo } from 'react';
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
  QrCode, 
  AlertTriangle, 
  Scissors, 
  Sparkles, 
  MessageSquare, 
  ShieldAlert, 
  RotateCcw, 
  Key, 
  Fingerprint, 
  Zap,
  Link2 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { MouzaGisMap } from '@/components/shared/MouzaGisMap';
import { computeSha256, verifyHashChain, toDec, formatDec } from '@/lib/crypto-utils';
import { t } from '@/lib/i18n';

export const CitizenPortal: React.FC = () => {
  const { 
    mutations, 
    khatians, 
    deeds, 
    citizens, 
    auditLogs,
    selectedPlotId, 
    setSelectedPlotId, 
    language,
    setActivePorcha,
    setIsWarisanModalOpen 
  } = useLandRegistry();

  const [activeSubTab, setActiveSubTab] = useState<'TRACKER' | 'INSPECTOR' | 'TAMPER'>('TRACKER');
  const [trackingQuery, setTrackingQuery] = useState<string>(mutations[0]?.trackingId || '');
  const [searchedMutation, setSearchedMutation] = useState(mutations[0]);

  // FIX 4: Reactive single-source-of-truth derivation
  const selectedPlot = useMemo(() => {
    return khatians.find(k => k.id === selectedPlotId) || khatians[0];
  }, [khatians, selectedPlotId]);

  const plotOwner = useMemo(() => {
    return citizens.find(c => c.id === selectedPlot?.ownerId);
  }, [citizens, selectedPlot?.ownerId]);

  // Tamper Simulator State
  const [selectedDeedId, setSelectedDeedId] = useState<string>(deeds[0]?.id || '');
  const selectedDeed = useMemo(() => {
    return deeds.find(d => d.id === selectedDeedId) || deeds[0];
  }, [deeds, selectedDeedId]);

  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [tamperedArea, setTamperedArea] = useState<number>(selectedDeed?.transferAreaDecimals || 5.0);
  const [tamperedBuyerName, setTamperedBuyerName] = useState<string>('Rafiqul Islam');
  const [currentComputedHash, setCurrentComputedHash] = useState<string>(selectedDeed?.deedHash || '');

  // FIX 6: Cryptographic Merkle Hash-Chain Integrity Verification
  const chainVerification = useMemo(() => {
    return verifyHashChain(khatians, deeds, auditLogs);
  }, [khatians, deeds, auditLogs]);

  const isChainValid = !isTampered && chainVerification.isValid;

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    const found = mutations.find(
      m => m.trackingId.toLowerCase() === trackingQuery.trim().toLowerCase() ||
           m.deedNo.toLowerCase() === trackingQuery.trim().toLowerCase()
    );
    if (found) {
      setSearchedMutation(found);
    } else {
      alert(language === 'en' ? 'Tracking ID or Deed Number not found.' : 'প্রদত্ত ট্র্যাকিং আইডি বা দলিল নম্বর পাওয়া যায়নি।');
    }
  };

  // Tamper Simulation: Alter single number (totalAreaDecimals from 10.00 to 20.00)
  const handleSimulateForgery = async () => {
    if (!selectedDeed) return;
    const forgedArea = 20.00; // Altered area
    const forgedBuyer = `${citizens.find(c => c.id === selectedDeed.buyerId)?.nameEn || 'Buyer'} [INSIDER SQL TAMPERING]`;

    setTamperedArea(forgedArea);
    setTamperedBuyerName(forgedBuyer);
    setIsTampered(true);

    const forgedPayload = `TAMPERED|${selectedDeed.deedNo}|${selectedDeed.khatianNo}|${forgedArea}|2026-SQL-FORGERY`;
    const forgedHash = await computeSha256(forgedPayload);
    setCurrentComputedHash(forgedHash);
  };

  const handleRestoreAuthentic = () => {
    if (!selectedDeed) return;
    setIsTampered(false);
    setTamperedArea(selectedDeed.transferAreaDecimals);
    setTamperedBuyerName(citizens.find(c => c.id === selectedDeed.buyerId)?.nameEn || '');
    setCurrentComputedHash(selectedDeed.deedHash);
  };

  // Determine Plot Safety Verdict
  const getSafetyVerdict = () => {
    if (!selectedPlot) return null;
    if (selectedPlot.isMortgaged || selectedPlot.hasCourtCase || selectedPlot.isDcAcquisition) {
      return {
        verdict: t(language, 'verdictDanger'),
        badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
        detailEn: selectedPlot.isMortgaged 
          ? `Active Bank Mortgage with ${selectedPlot.mortgageBankEn}`
          : selectedPlot.hasCourtCase
            ? `Civil Court Stay Order: ${selectedPlot.courtCaseNo}`
            : `Gazetted for ${selectedPlot.dcProjectNameEn}`,
        detailBn: selectedPlot.isMortgaged
          ? `${selectedPlot.mortgageBankBn} এ সক্রিয় বন্ধকী দায় বিদ্যমান`
          : selectedPlot.hasCourtCase
            ? `আদালতের স্থগিতাদেশ: ${selectedPlot.courtCaseNo}`
            : `${selectedPlot.dcProjectNameBn} প্রকল্পে অধিগ্রহণকৃত`,
      };
    }
    if (selectedPlot.lockedAreaDecimals > 0) {
      return {
        verdict: t(language, 'verdictCaution'),
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        detailEn: `${formatDec(selectedPlot.lockedAreaDecimals)} Decimals locked in pending e-Mutation. Only ${formatDec(toDec(selectedPlot.totalAreaDecimals - selectedPlot.lockedAreaDecimals))} Decimals clean.`,
        detailBn: `${formatDec(selectedPlot.lockedAreaDecimals)} শতাংশ জমি চলমান নামজারিতে লককৃত। অবশিষ্ট ${formatDec(toDec(selectedPlot.totalAreaDecimals - selectedPlot.lockedAreaDecimals))} শতাংশ ক্রয়যোগ্য।`,
      };
    }
    return {
      verdict: t(language, 'verdictSafe'),
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      detailEn: 'Zero encumbrances. CS-SA-RS-BS title lineage 100% verified. Clean for immediate purchase.',
      detailBn: 'সম্পূর্ণ নিষ্কণ্টক ও নির্ভেজাল। ৪ স্তরের মালিকানা ধারাবাহিকতা সঠিক। অবিকল বিক্রয়যোগ্য।',
    };
  };

  const verdict = getSafetyVerdict();

  // Progress Stepper Mapping
  const getStepStatus = (stepIndex: number) => {
    if (!searchedMutation) return 'PENDING';
    const stages = [
      'STAGE_1_DEED_REGISTERED',
      'STAGE_2_AREA_LOCKED',
      'STAGE_3_AUTO_SENT_TO_AC_LAND',
      'STAGE_4_TAHSIL_VERIFIED',
      'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED',
    ];
    const currentIndex = stages.indexOf(searchedMutation.stage);
    if (currentIndex >= stepIndex) return 'COMPLETED';
    if (currentIndex === stepIndex - 1) return 'CURRENT';
    return 'UPCOMING';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-teal-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-800/60 text-teal-200 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>{t(language, 'roleCitizen')}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight mt-1">
              {t(language, 'citizenTitle')}
            </h1>
            <p className="text-xs text-teal-100/80 mt-1 max-w-2xl leading-relaxed">
              {t(language, 'citizenSubtitle')}
            </p>
          </div>

          {/* Sub-Tab Selector & Warisan Engine Launcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shrink-0 text-xs font-bold shadow-lg">
            <button
              onClick={() => setActiveSubTab('TRACKER')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeSubTab === 'TRACKER' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(language, 'tabTracker')}
            </button>
            <button
              onClick={() => setActiveSubTab('INSPECTOR')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeSubTab === 'INSPECTOR' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(language, 'tabInspector')}
            </button>
            <button
              onClick={() => setActiveSubTab('TAMPER')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeSubTab === 'TAMPER' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(language, 'tabTamper')}
            </button>
            <button
              onClick={() => setIsWarisanModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-md transition-all ml-1"
              title={language === 'en' ? 'Warisan Heir Calculator & Faraidh Split' : 'উত্তরাধিকার ও ওয়ারিশ ফারায়েজ ক্যালকুলেটর'}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{language === 'en' ? '👥 Warisan Engine' : '👥 ওয়ারিশ ক্যালকুলেটর'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Cryptographic Hash-Chain Integrity Bar */}
      <div className={`p-4 rounded-3xl border text-xs font-mono transition-all shadow-sm ${
        !isChainValid 
          ? 'bg-rose-950 text-rose-200 border-rose-700 animate-pulse' 
          : 'bg-slate-900 text-emerald-300 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link2 className={`w-4 h-4 shrink-0 ${!isChainValid ? 'text-rose-400' : 'text-emerald-400'}`} />
            <span className="font-bold text-xs">
              {!isChainValid
                ? (language === 'en'
                    ? '🚨 HASH-CHAIN INTEGRITY COMPROMISED: Block #3 Hash Mismatch! Blocks #4, #5 Invalidated!'
                    : '🚨 ক্রিপ্টোগ্রাফিক হ্যাশ-চেইন ব্যাহত: ব্লক #৩ এর হ্যাশ অমিল! পরবর্তী ব্লক #৪ ও #৫ অকার্যকর!')
                : (language === 'en'
                    ? '🔗 Cryptographic Hash-Chain: 100% Verified (Genesis -> CS -> SA -> RS -> BS)'
                    : '🔗 ক্রিপ্টোগ্রাফিক হ্যাশ-চেইন: ১০০% নির্ভুলভাবে শৃঙ্খলিত (আদি -> সিএস -> এসএ -> আরএস -> বিএস)')
              }
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            {[
              { idx: 0, label: 'Genesis' },
              { idx: 1, label: 'CS-1910' },
              { idx: 2, label: 'SA-1956' },
              { idx: 3, label: 'RS-1980' },
              { idx: 4, label: 'BS-2026' },
              { idx: 5, label: 'Deed-2026' },
            ].map(b => (
              <span
                key={b.idx}
                className={`px-2 py-0.5 rounded font-bold border ${
                  !isChainValid && b.idx >= 4
                    ? 'bg-rose-900/90 text-rose-300 border-rose-600 line-through'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                }`}
              >
                #{b.idx}: {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Tab 3A: Live 5-Stage Mutation Tracker */}
      {activeSubTab === 'TRACKER' && (
        <div className="space-y-6">
          {/* Warisan Callout Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50/50 border border-amber-200/80 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-700 flex items-center justify-center font-bold text-lg shrink-0">
                👥
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-950">
                  {language === 'en' ? 'Warisan (উত্তরাধিকার) Heir Calculator & Instant Estate Splitting' : 'উত্তরাধিকার ও ওয়ারিশান ফারায়েজ বণ্টন ক্যালকুলেটর'}
                </h4>
                <p className="text-[11px] text-amber-800/80 mt-0.5">
                  {language === 'en' 
                    ? 'Statutory Islamic Faraidh proportion engine with 1-click mutation generation for all heirs.' 
                    : 'মৃত ব্যক্তির জমি ফারায়েজ অনুযায়ী স্ত্রী, সন্তান ও পিতা-মাতার মাঝে স্বয়ংক্রিয় বণ্টন করে জমাভাগ নামজারি করুন।'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWarisanModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all whitespace-nowrap self-start sm:self-auto"
            >
              {language === 'en' ? 'Launch Warisan Engine ➔' : 'ওয়ারিশ ক্যালকুলেটর খুলুন ➔'}
            </button>
          </div>

          {/* Tracking Search Bar */}
          <form onSubmit={handleSearchTracking} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                placeholder={t(language, 'trackingSearchPlaceholder')}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-colors shadow-sm"
            >
              {t(language, 'trackBtn')}
            </button>
          </form>

          {searchedMutation && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-ambient space-y-8">
              {/* Case Summary Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-xl font-black text-slate-900">
                      {searchedMutation.trackingId}
                    </h3>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-0.5 rounded-full border border-emerald-200">
                      Live Journey
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Deed No: {searchedMutation.deedNo} • Parent Khatian: {searchedMutation.sourceKhatianNo} • Transfer: {formatDec(searchedMutation.transferAreaDecimals)} Dec
                  </p>
                </div>

                {searchedMutation.stage === 'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED' && (
                  <button
                    onClick={() => {
                      const newK = khatians.find(k => k.khatianNo === searchedMutation.issuedNewKhatianNo);
                      if (newK) setActivePorcha({ khatian: newK, mutationId: searchedMutation.trackingId });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Download Digital Porcha (PDF)' : 'ডিজিটাল পর্চা ডাউনলোড'}</span>
                  </button>
                )}
              </div>

              {/* 5-Step Glowing Horizontal Stepper */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { title: t(language, 'stage1'), desc: t(language, 'stage1Desc') },
                  { title: t(language, 'stage2'), desc: t(language, 'stage2Desc') },
                  { title: t(language, 'stage3'), desc: t(language, 'stage3Desc') },
                  { title: t(language, 'stage4'), desc: t(language, 'stage4Desc') },
                  { title: t(language, 'stage5'), desc: t(language, 'stage5Desc') },
                ].map((step, idx) => {
                  const status = getStepStatus(idx);
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        status === 'COMPLETED'
                          ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                          : status === 'CURRENT'
                            ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-500/20'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-black text-slate-700">
                          Step 0{idx + 1}
                        </span>
                        {status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {status === 'CURRENT' && <Clock className="w-4 h-4 text-blue-600 animate-spin-slow" />}
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Simulated Automated Citizen SMS Drawer */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono font-bold text-xs uppercase tracking-wider text-emerald-300">
                    {t(language, 'smsSimulationTitle')}
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2 text-emerald-300">
                  <p>
                    [GOV-LAND] সম্মানিত নাগরিক, সাব-কবলা দলিল নং {searchedMutation.deedNo} এর বিপরীতে আপনার ই-নামজারি মামলা নং {searchedMutation.trackingId} সফলভাবে গৃহীত হয়েছে।
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    স্বয়ংক্রিয় ট্র্যাকিং লিংক: https://setuland.gov.bd/track/{searchedMutation.trackingId}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3B: "Check Before You Buy" Inspector & Mouza GIS */}
      {activeSubTab === 'INSPECTOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Mouza GIS Map (7 cols) */}
          <div className="lg:col-span-7">
            <MouzaGisMap />
          </div>

          {/* Right: Detailed Legal Dossier & Buyer Safety Verdict (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {selectedPlot && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-ambient space-y-5">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'en' ? 'Cadastral Parcel Dossier' : 'দাগ ও খতিয়ান বিবরণী'}
                  </span>
                  <h3 className="font-mono text-2xl font-black text-slate-900 mt-0.5">
                    Dag #{selectedPlot.dagNo} ({selectedPlot.khatianNo})
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedPlot.mouzaEn} Mouza • {selectedPlot.landClassEn}
                  </p>
                </div>

                {/* Buyer Safety Verdict Badge */}
                {verdict && (
                  <div className={`p-4 rounded-2xl border ${verdict.badgeClass} space-y-1`}>
                    <div className="font-black text-xs sm:text-sm">
                      {verdict.verdict}
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      {language === 'en' ? verdict.detailEn : verdict.detailBn}
                    </p>
                  </div>
                )}

                {/* Area Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">{t(language, 'totalDecimals')}</span>
                    <span className="font-black text-slate-900 text-sm">{formatDec(selectedPlot.totalAreaDecimals)} Dec</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">{t(language, 'lockedDecimals')}</span>
                    <span className="font-black text-amber-800 text-sm">{formatDec(selectedPlot.lockedAreaDecimals)} Dec</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between items-center text-emerald-950 font-black">
                    <span>{t(language, 'availableDecimals')}</span>
                    <span className="text-base">{formatDec(toDec(selectedPlot.totalAreaDecimals - selectedPlot.lockedAreaDecimals))} Dec</span>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="text-xs space-y-1 border-t border-slate-100 pt-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Authenticated Owner:</span>
                  <div className="font-black text-slate-900 text-sm">{plotOwner?.nameEn}</div>
                  <div className="font-mono text-[11px] text-slate-500">{plotOwner?.dummyNid}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 3C: Cryptographic Forgery & Tamper Simulator */}
      {activeSubTab === 'TAMPER' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-ambient space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-800" />
                <h3 className="font-black text-slate-900 text-base">
                  {t(language, 'tamperTitle')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {t(language, 'tamperSubtitle')}
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1.5 rounded-xl shrink-0">
              SHA-256 Hex Hash Proof
            </span>
          </div>

          {/* Tamper Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Authentic Record State */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
              <span className="font-bold text-slate-700 block uppercase">
                {t(language, 'authenticPayload')}
              </span>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div>Deed No: <span className="font-bold text-slate-900">{selectedDeed?.deedNo}</span></div>
                <div>Parent Khatian: <span className="font-bold text-slate-900">{selectedDeed?.khatianNo}</span></div>
                <div>Authentic Area: <span className="font-bold text-emerald-800">{selectedDeed ? formatDec(selectedDeed.transferAreaDecimals) : '0.00'} Decimals</span></div>
                <div>Buyer Name: <span className="font-bold text-slate-900">{citizens.find(c => c.id === selectedDeed?.buyerId)?.nameEn}</span></div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{t(language, 'originalHash')}</span>
                <p className="font-mono text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 break-all select-all font-black">
                  {selectedDeed?.deedHash}
                </p>
              </div>
            </div>

            {/* Right: Live Simulated State */}
            <div className={`p-5 rounded-2xl border space-y-3 font-mono text-xs transition-all ${
              isTampered ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50/60 border-emerald-200'
            }`}>
              <span className="font-bold text-slate-700 block uppercase">
                {isTampered ? 'Tampered / Counterfeit Document State:' : 'Verified Ledger State:'}
              </span>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div>Deed No: <span className="font-bold text-slate-900">{selectedDeed?.deedNo}</span></div>
                <div>Simulated Area: <span className={`font-bold ${isTampered ? 'text-rose-700 font-black' : 'text-slate-900'}`}>{formatDec(tamperedArea)} Decimals</span></div>
                <div>Simulated Buyer: <span className={`font-bold ${isTampered ? 'text-rose-700 font-black' : 'text-slate-900'}`}>{tamperedBuyerName}</span></div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Live Computed SHA-256 Hash:</span>
                <p className={`font-mono text-[11px] p-2.5 rounded-xl border break-all select-all font-black ${
                  isTampered 
                    ? 'bg-rose-950 text-rose-300 border-rose-800' 
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {currentComputedHash}
                </p>
              </div>
            </div>
          </div>

          {/* Action Simulator Buttons & Verdict Alert */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSimulateForgery}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-black shadow-md transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{t(language, 'tamperBtn')}</span>
              </button>

              <button
                onClick={handleRestoreAuthentic}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>{t(language, 'restoreBtn')}</span>
              </button>
            </div>

            {isTampered ? (
              <div className="space-y-4">
                <div className="p-4 bg-rose-950 text-white rounded-2xl border-2 border-rose-600 flex items-center gap-3 shadow-lg">
                  <ShieldAlert className="w-7 h-7 text-rose-400 shrink-0" />
                  <div>
                    <h4 className="font-black text-xs text-rose-300 uppercase tracking-wide">
                      {t(language, 'tamperAlert')}
                    </h4>
                    <p className="text-[11px] text-rose-200/90 mt-0.5">
                      Hash Avalanche & Merkle Break: Altering single number (totalAreaDecimals from 10.00 to 20.00) produces completely mismatched SHA-256 seal. Cascading invalidation halts entire registry.
                    </p>
                  </div>
                </div>

                {/* High-Contrast Crimson Diff Viewer */}
                <div className="bg-slate-950 rounded-2xl p-5 border-2 border-rose-600 shadow-2xl space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-rose-900/60 pb-3">
                    <div className="flex items-center gap-2 text-rose-400 font-black uppercase text-xs sm:text-sm">
                      <ShieldAlert className="w-5 h-5" />
                      <span>Cryptographic Merkle Hash-Chain Breakage & SQL Diff</span>
                    </div>
                    <span className="bg-rose-900 text-rose-200 px-3 py-1 rounded-full text-[10px] font-bold">
                      Cascading Chain Severed
                    </span>
                  </div>

                  {/* 3-Column Cascading Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Block 3: Altered Record */}
                    <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-700 space-y-2">
                      <div className="text-[11px] font-bold text-rose-300 flex items-center justify-between">
                        <span>Block #3: Khatian (BS-1001)</span>
                        <span className="text-[10px] bg-rose-900 text-rose-200 px-1.5 py-0.5 rounded font-bold">FORGED</span>
                      </div>
                      <div className="bg-black/70 p-2.5 rounded text-[11px] space-y-1">
                        <div className="text-emerald-400 line-through">- totalAreaDecimals: 12.00</div>
                        <div className="text-rose-400 font-bold bg-rose-900/50 p-1 rounded">+ totalAreaDecimals: 20.00 (SQL TAMPER)</div>
                        <div className="text-slate-400 text-[10px] pt-1">
                          Expected Hash: <span className="text-emerald-400">0a4f89d38c2014...</span>
                        </div>
                        <div className="text-rose-400 text-[10px] font-bold">
                          Computed Hash: {currentComputedHash.substring(0, 18)}...
                        </div>
                      </div>
                    </div>

                    {/* Block 4: Previous Hash Mismatch */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-800/80 space-y-2">
                      <div className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                        <span>Block #4: Registered Deed</span>
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-bold">SEVERED</span>
                      </div>
                      <div className="bg-black/70 p-2.5 rounded text-[11px] space-y-1.5">
                        <div className="text-slate-400 text-[10px]">
                          Stored previousHash: <span className="text-emerald-400">0a4f89d38c2014...</span>
                        </div>
                        <div className="text-rose-400 text-[10px] font-bold">
                          Actual Block #3 Hash: {currentComputedHash.substring(0, 18)}...
                        </div>
                        <div className="bg-rose-950/90 text-rose-300 p-1.5 rounded text-[10px] border border-rose-800 font-bold">
                          ❌ PREV_HASH MISMATCH! Chain linkage severed.
                        </div>
                      </div>
                    </div>

                    {/* Block 5: Downstream Mutation Rejection */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-800/80 space-y-2">
                      <div className="text-[11px] font-bold text-rose-300 flex items-center justify-between">
                        <span>Block #5: AC Land e-Mutation</span>
                        <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-bold">ORPHANED</span>
                      </div>
                      <div className="bg-black/70 p-2.5 rounded text-[11px] space-y-1.5">
                        <div className="text-slate-400 text-[10px]">
                          Zero-Trust Gate: Automatic rejection across Sub-Registry, AC Land & Commercial Banks.
                        </div>
                        <div className="bg-rose-950/90 text-rose-300 p-1.5 rounded text-[10px] border border-rose-800 font-bold">
                          🛑 REJECTED: Title certificate issuance blocked.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-800 flex items-center gap-3 shadow-md">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-black text-xs text-emerald-300 uppercase tracking-wide">
                    {t(language, 'integrityValid')}
                  </h4>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">
                    100% Cryptographic Hash-Chain Verified. All blocks from Genesis through Deed and Mutation preserve tamper-evident Merkle linkage.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
