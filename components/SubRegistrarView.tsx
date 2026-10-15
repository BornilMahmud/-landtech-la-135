'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  Calculator, 
  Building2, 
  UserCheck, 
  Sparkles, 
  ArrowRight,
  Lock,
  Scale,
  Landmark,
  Zap,
  History,
  ShieldAlert,
  ArrowRightCircle,
  TrendingDown
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';

export const SubRegistrarView: React.FC = () => {
  const { 
    khatians, 
    selectedPlotId, 
    setSelectedPlotId, 
    calculateFees, 
    runFivePointVerification, 
    registerDeed, 
    isVerifying, 
    lastVerificationResult, 
    language,
    setFraudAlert
  } = useLandApp();

  const selectedPlot = khatians.find(k => k.id === selectedPlotId) || khatians[0];

  const [buyerName, setBuyerName] = useState('Anisur Rahman');
  const [buyerNid, setBuyerNid] = useState('DUMMY-NID-2026-8842');
  const [buyerPhone, setBuyerPhone] = useState('01700-000055');
  const [transferArea, setTransferArea] = useState<number>(5.0);
  const [saleValue, setSaleValue] = useState<number>(2500000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  // When selected plot changes, adjust default transfer area safely
  useEffect(() => {
    if (selectedPlot) {
      const available = Math.max(0, selectedPlot.totalAreaDecimals - selectedPlot.lockedAreaDecimals);
      if (selectedPlot.id === 'plot-2') {
        // Preset double-selling trigger
        setTransferArea(5.0); // Only 3.0 available!
      } else {
        setTransferArea(Math.min(5.0, available || 2.0));
      }
    }
  }, [selectedPlotId]);

  const fees = calculateFees(saleValue);
  const availableArea = selectedPlot ? Math.max(0, selectedPlot.totalAreaDecimals - selectedPlot.lockedAreaDecimals) : 0;

  const handleRunVerification = async () => {
    if (!selectedPlot) return;
    const res = await runFivePointVerification(selectedPlot.id, transferArea, selectedPlot.ownerNid);
    if (!res.passed) {
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 600);
      setFraudAlert({
        isOpen: true,
        titleEn: res.fraudTitleEn || 'Verification Failure',
        titleBn: res.fraudTitleBn || 'যাচাইকরণে অসঙ্গতি',
        reasonEn: res.fraudReasonEn || 'Discrepancy blocked deed registration.',
        reasonBn: res.fraudReasonBn || 'অসঙ্গতি চিহ্নিত হওয়ায় দলিল সম্পাদন স্থগিত রাখা হলো।'
      });
    }
  };

  const handleRegisterDeed = async () => {
    if (!selectedPlot) return;
    setIsSubmitting(true);
    await registerDeed({
      plotId: selectedPlot.id,
      buyerName,
      buyerNid,
      buyerPhone,
      transferAreaDecimals: Number(transferArea),
      saleValueBDT: Number(saleValue),
    });
    setIsSubmitting(false);
  };

  const loadPreset = (plotId: string, testTransferArea: number, bName: string, bNid: string, sVal: number) => {
    setSelectedPlotId(plotId);
    setTransferArea(testTransferArea);
    setBuyerName(bName);
    setBuyerNid(bNid);
    setSaleValue(sVal);
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Judge Demo Scenarios Top Control Strip */}
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              {language === 'en' ? '⚡ 1-Click Judge Demo Scenarios (10-Second Test):' : '⚡ বিচারকদের জন্য ১-ক্লিক টেস্ট সিনারিও:'}
            </span>
            <p className="text-xs text-slate-300">
              {language === 'en'
                ? 'Select a scenario below to auto-populate the form with pre-seeded synthetic data and run verification instantly.'
                : 'নিচের যেকোনো সিনারিওতে ক্লিক করে স্বয়ংক্রিয়ভাবে ফর্ম পূরণ করুন ও ৫-স্তরের যাচাই পরীক্ষা করুন।'}
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => loadPreset('plot-1', 4.0, 'Shahidul Islam', 'DUMMY-NID-2026-9901', 2000000)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap ${
                selectedPlot?.id === 'plot-1'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              <span>✅ Scenario 1: Clean Sale (Plot 1)</span>
            </button>

            <button
              onClick={() => loadPreset('plot-2', 5.0, 'Kamal Hossain', 'DUMMY-NID-2026-9902', 2500000)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap ${
                selectedPlot?.id === 'plot-2'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                  : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              }`}
              title="10 Dec total, 7 already locked. Trying to sell 5 Decimals triggers Double-Selling fraud alert!"
            >
              <span>⚠️ Scenario 2: Double-Selling (Plot 2)</span>
            </button>

            <button
              onClick={() => loadPreset('plot-3', 3.0, 'Faruk Ahmed', 'DUMMY-NID-2026-9903', 1800000)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap ${
                selectedPlot?.id === 'plot-3'
                  ? 'bg-rose-700 text-white ring-2 ring-rose-400'
                  : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
              }`}
              title="Active mortgage lien with Sonali Bank PLC triggers mortgage fraud alert!"
            >
              <span>🏦 Scenario 3: Bank Lien (Plot 3)</span>
            </button>

            <button
              onClick={() => loadPreset('plot-4', 5.0, 'Habib Ullah', 'DUMMY-NID-2026-9904', 3000000)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap ${
                selectedPlot?.id === 'plot-4'
                  ? 'bg-purple-800 text-white ring-2 ring-purple-400'
                  : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
              }`}
              title="Civil court stay order in Case #DUMMY-CIV-404 triggers court dispute block!"
            >
              <span>⚖️ Scenario 4: Court Stay (Plot 4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workflow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Deed Form & Unified Revenue Calculator (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Land Parcel Selection */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-ambient border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-800 border border-emerald-200">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {language === 'en' ? 'Step 1: Select Khatian & Verified Land Parcel' : 'ধাপ ১: খতিয়ান ও দাগ নির্বাচন'}
                  </h3>
                  <p className="text-xs text-slate-500">DLRS Cadastral Map & RoR Index</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                100% Synthetic Dummy
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {language === 'en' ? 'Target Parcel (Khatian & Dag):' : 'হস্তান্তরযোগ্য খতিয়ান ও দাগ:'}
                </label>
                <select
                  value={selectedPlot?.id}
                  onChange={(e) => setSelectedPlotId(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none transition-all shadow-sm"
                >
                  {khatians.map(k => {
                    let statusTag = '✅ Clean Title';
                    if (k.isMortgaged) statusTag = '🏦 Bank Mortgaged';
                    else if (k.hasCourtCase) statusTag = '⚖️ Court Dispute';
                    else if (k.isAcquired) statusTag = '🏗️ DC Acquired';
                    else if (k.lockedAreaDecimals > 0) statusTag = `⚠️ ${k.lockedAreaDecimals.toFixed(1)} Dec Locked in Mutation`;

                    return (
                      <option key={k.id} value={k.id}>
                        {k.khatianNo} | Dag #{k.dagNo} ({k.mouza}) — {k.ownerName} [{statusTag}]
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Auto-filled Seller Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold">{language === 'en' ? 'Registered Seller Name:' : 'নিবন্ধিত মালিকের নাম:'}</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedPlot?.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold">{language === 'en' ? 'Seller Dummy NID (Auto-filled):' : 'বিক্রেতার ডামি এনআইডি:'}</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">{selectedPlot?.ownerNid}</span>
                </div>
              </div>

              {/* Visual Stacked Area Balance Bar (Anti-Double-Selling Visualizer) */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{language === 'en' ? 'Land Parcel Balance Breakdown:' : 'জমির অবমুক্ত ও লককৃত শতাংশ বিভাজন:'}</span>
                  <span className="font-mono text-emerald-800 font-extrabold text-sm tabular-nums">
                    Total: {selectedPlot?.totalAreaDecimals.toFixed(2)} Decimals
                  </span>
                </div>

                {/* Stacked Progress Bar */}
                <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  {/* Available Area */}
                  <div 
                    className="bg-emerald-600 h-full transition-all duration-500 relative group"
                    style={{ width: `${selectedPlot ? (availableArea / selectedPlot.totalAreaDecimals) * 100 : 0}%` }}
                    title={`Available Unlocked: ${availableArea.toFixed(2)} Decimals`}
                  />
                  {/* Locked in Mutation */}
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500 relative group"
                    style={{ width: `${selectedPlot ? (selectedPlot.lockedAreaDecimals / selectedPlot.totalAreaDecimals) * 100 : 0}%` }}
                    title={`Locked in Pending Mutation: ${selectedPlot?.lockedAreaDecimals.toFixed(2)} Decimals`}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Available: <strong className="font-mono tabular-nums">{availableArea.toFixed(2)} Dec</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Locked: <strong className="font-mono tabular-nums">{selectedPlot?.lockedAreaDecimals.toFixed(2)} Dec</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 col-span-2 sm:col-span-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Escrow Active</span>
                  </div>
                </div>
              </div>

              {/* Connected Historical Lineage Nodes (CS -> SA -> RS -> BS) */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'en' ? 'Unbroken Title Lineage Nodes (CS ➔ SA ➔ RS ➔ BS):' : 'ধারাবাহিক পরচা মালিকানা নোড:'}</span>
                </span>
                <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
                  {selectedPlot?.chainOfTitle.map((c, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[70px] shadow-sm">
                        <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-mono font-black text-[10px] flex items-center justify-center">
                          {c.surveyType}
                        </span>
                        <span className="text-[10px] font-bold text-slate-800 mt-1 font-mono truncate max-w-[80px]">
                          #{c.khatianNo}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {c.year}
                        </span>
                      </div>
                      {i < selectedPlot.chainOfTitle.length - 1 && (
                        <div className="h-0.5 w-4 bg-emerald-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Buyer Details & Single-Window Fee Calculator */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-ambient border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-800 border border-emerald-200">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {language === 'en' ? 'Step 2: Buyer Information & Transfer Terms' : 'ধাপ ২: ক্রেতার বিবরণ ও বিক্রয় শর্তাবলী'}
                  </h3>
                  <p className="text-xs text-slate-500">NID & Biometric Verification</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                Single-Window
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Buyer Name (ক্রেতার নাম):' : 'ক্রেতার নাম:'}
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 font-medium focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Buyer Dummy NID:' : 'ক্রেতার ডামি এনআইডি:'}
                </label>
                <input
                  type="text"
                  value={buyerNid}
                  onChange={(e) => setBuyerNid(e.target.value)}
                  className="w-full font-mono font-bold border border-slate-300 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Transfer Area (in Decimals):' : 'হস্তান্তরকৃত জমির পরিমাণ (শতাংশ):'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={transferArea}
                    onChange={(e) => setTransferArea(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-sm font-black border border-slate-300 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none pr-16 tabular-nums"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-semibold">
                    Decimals
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Sale Value (BDT):' : 'বিক্রয় মূল্য (টাকা):'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="50000"
                    min="50000"
                    value={saleValue}
                    onChange={(e) => setSaleValue(parseInt(e.target.value) || 0)}
                    className="w-full font-mono text-sm font-black border border-slate-300 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none pr-12 tabular-nums"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-semibold">
                    BDT
                  </span>
                </div>
              </div>
            </div>

            {/* Unified Revenue & e-Mutation Fee Breakdown */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'en' ? 'Unified Single-Window Fee Breakdown:' : 'সমন্বিত সরকারি রাজস্ব ও ই-নামজারি ফি:'}</span>
                </span>
                <span className="font-mono text-[11px] text-slate-600">
                  Declared: ৳ {saleValue.toLocaleString()} BDT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>Stamp Duty (1.5%): <strong className="text-slate-900 font-mono tabular-nums">৳ {fees.stampDutyBDT.toLocaleString()}</strong></div>
                <div>Registration Fee (1.0%): <strong className="text-slate-900 font-mono tabular-nums">৳ {fees.registrationFeeBDT.toLocaleString()}</strong></div>
                <div>Local Govt Tax (3.0%): <strong className="text-slate-900 font-mono tabular-nums">৳ {fees.localGovtTaxBDT.toLocaleString()}</strong></div>
                <div>Source Tax (AIT 2.0%): <strong className="text-slate-900 font-mono tabular-nums">৳ {fees.gainTaxBDT.toLocaleString()}</strong></div>
              </div>

              <div className="flex items-center justify-between bg-emerald-100/70 text-emerald-900 px-3 py-1.5 rounded-lg font-bold mt-2">
                <span>Bundled e-Mutation Fee (সমন্বিত নামজারি ফি):</span>
                <span className="font-mono tabular-nums">৳ {fees.mutationFeeBDT.toLocaleString()} BDT</span>
              </div>

              <div className="flex items-center justify-between font-black text-slate-950 border-t border-slate-300 pt-2 text-sm">
                <span>{language === 'en' ? 'Total Single-Window Fee Due:' : 'একত্রিত সর্বমোট প্রদেয় ফি:'}</span>
                <span className="text-emerald-700 font-mono text-base tabular-nums">৳ {fees.totalFeeBDT.toLocaleString()} BDT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Point Automated Pre-Registration Radar (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-ambient border border-slate-200/90 space-y-4 transition-all ${
            shakeCard ? 'animate-shake ring-2 ring-rose-500' : ''
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {language === 'en' ? '5-Point Consensus Radar' : '৫-স্তরের কনসেনসাস অডিট'}
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Pre-Deed Audit
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'Parallel cryptographic consensus check querying NID registry, DLRS 4-generation lineage, mortgage escrow, and civil court stay orders.'
                : 'দলিল প্রস্তুতের পূর্বেই সমান্তরালে এনআইডি, ৪ স্তরের পরচা ধারা, ব্যাংক বন্ধক ও দেওয়ানী আদালতের নিষেধাজ্ঞা যাচাই করে।'}
            </p>

            {/* Run Verification Button */}
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm disabled:opacity-75 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'en' ? 'Auditing Registries in Consensus...' : 'কনসেনসাস অডিট চলমান...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{language === 'en' ? 'Run 5-Point Automated Verification' : '৫-স্তরের স্বয়ংক্রিয় যাচাই শুরু করুন'}</span>
                </>
              )}
            </button>

            {/* Diagnostic Pipeline Checks */}
            <div className="space-y-2.5 pt-1">
              {(lastVerificationResult?.checks || [
                { id: '1', labelEn: '1. NID & Ownership Registry Match', labelBn: '১. এনআইডি ও মালিকানা রেজিস্ট্রি', passed: false, messageEn: 'Awaiting audit trigger', messageBn: 'যাচাই অপেক্ষমান' },
                { id: '2', labelEn: '2. Unbroken Chain-of-Title (CS ➔ SA ➔ RS ➔ BS)', labelBn: '২. ধারাবাহিক পরচা ইতিহাস (সিএস-এসএ-আরএস-বিএস)', passed: false, messageEn: 'Awaiting audit trigger', messageBn: 'যাচাই অপেক্ষমান' },
                { id: '3', labelEn: '3. Unlocked Area Balance (Anti-Double-Selling)', labelBn: '৩. অবমুক্ত জমির পরিমাণ ও দ্বৈত-বিক্রয় রোধ', passed: false, messageEn: 'Awaiting audit trigger', messageBn: 'যাচাই অপেক্ষমান' },
                { id: '4', labelEn: '4. Bank Mortgage Lien Free Check', labelBn: '৪. ব্যাংক বন্ধক ও আর্থিক দায়মুক্তি', passed: false, messageEn: 'Awaiting audit trigger', messageBn: 'যাচাই অপেক্ষমান' },
                { id: '5', labelEn: '5. Court Injunction & Dispute Check', labelBn: '৫. আদালত নিষেধাজ্ঞা ও দেওয়ানী মামলা', passed: false, messageEn: 'Awaiting audit trigger', messageBn: 'যাচাই অপেক্ষমান' },
              ]).map((check, idx) => {
                const isChecked = !!lastVerificationResult;
                const isPass = check.passed;

                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      !isChecked 
                        ? 'bg-slate-50/80 border-slate-200 text-slate-500'
                        : isPass 
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm'
                          : 'bg-rose-50 border-rose-300 text-rose-950 shadow-md ring-1 ring-rose-400'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isChecked ? (
                        isPass ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                        )
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        <div className="font-bold">
                          {language === 'en' ? check.labelEn : check.labelBn}
                        </div>
                        {isChecked && (
                          <div className={`text-[11px] leading-relaxed ${isPass ? 'text-emerald-800' : 'text-rose-700 font-medium'}`}>
                            {language === 'en' ? check.messageEn : check.messageBn}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Forensic Block Banner if Verification Failed */}
            {lastVerificationResult && !lastVerificationResult.passed && (
              <div className="bg-rose-600 text-white p-3.5 rounded-xl text-xs space-y-1 shadow-alertGlow animate-fade-in">
                <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px]">
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>🛑 Transaction Blocked by Smart Registry</span>
                </div>
                <p className="text-[11px] opacity-95 leading-snug">
                  {lastVerificationResult.fraudReasonEn}
                </p>
              </div>
            )}

            {/* Register Deed Action Button */}
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={handleRegisterDeed}
                disabled={!lastVerificationResult?.passed || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all ${
                  lastVerificationResult?.passed
                    ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white hover:brightness-110 ring-2 ring-emerald-400 shadow-glow cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'en' ? 'Sealing Deed & Locking Area...' : 'দলিল সীল করা হচ্ছে...'}</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>
                      {language === 'en' 
                        ? 'Register Deed & Auto-Trigger e-Mutation' 
                        : 'দলিল সম্পাদন ও স্বয়ংক্রিয় ই-নামজারি ট্র্রিগার'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center mt-2">
                {language === 'en'
                  ? 'Applies cryptographic escrow lock on parent Khatian instantly.'
                  : 'রেজিস্ট্রি সম্পন্ন হওয়া মাত্র মূল খতিয়ানে অবমুক্ত অংশ অবিলম্বে লক হবে।'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
