'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Calculator, 
  Building2, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Landmark, 
  GitBranch, 
  AlertOctagon, 
  Fingerprint, 
  Scale, 
  Coins, 
  Users, 
  SendHorizontal, 
  Receipt, 
  FileText 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { toDec, formatDec, formatBdt } from '@/lib/crypto-utils';
import { t } from '@/lib/i18n';

export const SubRegistrarPortal: React.FC = () => {
  const { 
    citizens, 
    khatians, 
    selectedPlotId, 
    setSelectedPlotId, 
    calculateRevenue, 
    evaluateFivePointCheck,
    runFivePointCheck, 
    registerDeedAndTriggerMutation, 
    isVerifying, 
    lastVerificationResult, 
    setLineageModalKhatian, 
    setActiveLtNotice, 
    deeds, 
    language 
  } = useLandRegistry();

  // FIX 4: Reactive Single-Source-of-Truth derivation (never stale)
  const selectedPlot = useMemo(() => {
    return khatians.find(k => k.id === selectedPlotId) || khatians[0];
  }, [khatians, selectedPlotId]);

  const seller = useMemo(() => {
    return citizens.find(c => c.id === selectedPlot?.ownerId) || citizens[0];
  }, [citizens, selectedPlot?.ownerId]);

  const buyerOptions = useMemo(() => {
    return citizens.filter(c => c.id !== seller?.id);
  }, [citizens, seller?.id]);

  const [selectedBuyerId, setSelectedBuyerId] = useState<string>(buyerOptions[0]?.id || 'citizen-6');
  const [transferArea, setTransferArea] = useState<number>(5.0);
  const [salePrice, setSalePrice] = useState<number>(3000000);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shakeRadar, setShakeRadar] = useState<boolean>(false);

  const buyer = useMemo(() => {
    return citizens.find(c => c.id === selectedBuyerId) || buyerOptions[0] || citizens[0];
  }, [citizens, selectedBuyerId, buyerOptions]);

  // FIX 4: Reactive live verification radar (updates synchronously when locks toggle in Role 4)
  const liveVerificationResult = useMemo(() => {
    return evaluateFivePointCheck(selectedPlot, seller, buyer, Number(transferArea) || 0);
  }, [selectedPlot, seller, buyer, transferArea, evaluateFivePointCheck]);

  const activeVerification = liveVerificationResult || lastVerificationResult;

  // Handle Preset Scenarios
  const loadScenario = (plotId: string, testTransferArea: number, buyerId: string, testSalePrice: number) => {
    setSelectedPlotId(plotId);
    setTransferArea(toDec(testTransferArea));
    setSelectedBuyerId(buyerId);
    setSalePrice(testSalePrice);
  };

  const revenue = calculateRevenue(
    salePrice, 
    transferArea, 
    selectedPlot?.officialRatePerDecimalBdt || 800000,
    selectedPlot?.ldTaxArrearBdt || 0
  );

  const availableArea = selectedPlot ? toDec(Math.max(0, selectedPlot.totalAreaDecimals - selectedPlot.lockedAreaDecimals)) : 0;
  const lockedArea = toDec(selectedPlot?.lockedAreaDecimals || 0);
  const totalArea = toDec(selectedPlot?.totalAreaDecimals || 1);

  // Ejmali Co-Sharer Quota
  const isEjmali = selectedPlot?.isEjmaliProperty ?? false;
  const sellerCoSharer = isEjmali ? (selectedPlot?.coSharers ?? []).find(cs => cs.citizenId === seller.id) : null;
  const sellerQuotaDecimals = sellerCoSharer 
    ? toDec((selectedPlot.totalAreaDecimals * sellerCoSharer.shareFraction) - (sellerCoSharer.lockedDecimals || 0))
    : availableArea;

  const handleRegister = async () => {
    if (!selectedPlot || !seller || !selectedBuyerId) return;
    setIsSubmitting(true);
    const res = await registerDeedAndTriggerMutation({
      khatianId: selectedPlot.id,
      sellerId: seller.id,
      buyerId: selectedBuyerId,
      transferAreaDecimals: toDec(Number(transferArea)),
      salePriceBdt: Number(salePrice),
    });
    setIsSubmitting(false);

    if (!res.success) {
      setShakeRadar(true);
      setTimeout(() => setShakeRadar(false), 600);
    }
  };

  const passedAll = activeVerification?.passedAll ?? false;
  const latestDeed = deeds.find(d => d.khatianId === selectedPlot?.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1-Click Judge Demo Scenarios Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-800/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-800/60 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600/30">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t(language, 'roleSubRegistrar')}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight mt-1">
              {language === 'en' 
                ? 'Sub-Registry Office: Smart Deed Execution & Pre-Registration Radar' 
                : 'সাব-রেজিস্ট্রি অফিস: স্মার্ট দলিল সম্পাদন ও ৫-পয়েন্ট ডায়াগনস্টিক'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-300/80 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
              Registration Act 1908 • Section 49B
            </span>
          </div>
        </div>

        {/* 1-Click Scenario Buttons (Matching 5 Real-World Modules) */}
        <div className="pt-2 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-300 block mb-2 font-mono">
            {t(language, 'scenariosHeader')}
          </span>
          <div className="flex flex-wrap gap-2">
            {/* Scenario 1: Clean Title + Khajna Arrear Bundling + LT Notice */}
            <button
              onClick={() => loadScenario('plot-1', 5.0, 'citizen-7', 3500000)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedPlotId === 'plot-1'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-glow'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {t(language, 'scenario1')}
            </button>

            {/* Scenario 2: Double-Selling Fraud Block */}
            <button
              onClick={() => loadScenario('plot-2', 6.0, 'citizen-7', 4200000)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedPlotId === 'plot-2'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-glow'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {t(language, 'scenario2')}
            </button>

            {/* Scenario 3: Ejmali Co-Sharer Quota Over-Selling Block */}
            <button
              onClick={() => loadScenario('plot-6', 6.0, 'citizen-7', 4000000)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedPlotId === 'plot-6'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-glow'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {t(language, 'scenario3')}
            </button>

            {/* Scenario 4: Bank Mortgage Lien Block */}
            <button
              onClick={() => loadScenario('plot-3', 4.0, 'citizen-6', 2800000)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedPlotId === 'plot-3'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-glow'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {t(language, 'scenario4')}
            </button>

            {/* Scenario 5: Civil Court Injunction & DC Notice Block */}
            <button
              onClick={() => loadScenario('plot-4', 5.0, 'citizen-6', 3000000)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedPlotId === 'plot-4'
                  ? 'bg-rose-600 text-white border-rose-400 shadow-glow'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {t(language, 'scenario5')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Form (7 cols) + Right 5-Point Radar (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Deed Drafting Form & Financial Revenue Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Deed Draft Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-ambient space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-800" />
                <h2 className="font-black text-slate-900 text-base">
                  {t(language, 'deedDrafting')}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {latestDeed?.ltNotice && (
                  <button
                    onClick={() => setActiveLtNotice(latestDeed.ltNotice || null)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300 shadow-sm transition-all"
                  >
                    <SendHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t(language, 'viewLtNoticeBtn')}</span>
                  </button>
                )}
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Savar Sub-Registry
                </span>
              </div>
            </div>

            {/* Plot / Khatian Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                {t(language, 'selectKhatian')}
              </label>
              <select
                value={selectedPlotId || ''}
                onChange={(e) => setSelectedPlotId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              >
                {khatians.map((k) => (
                  <option key={k.id} value={k.id}>
                    Khatian #{k.khatianNo} • Dag #{k.dagNo} • {k.mouzaEn} ({formatDec(k.totalAreaDecimals)} Dec {k.isEjmaliProperty ? '[ইজমালি যৌথ শরিক]' : ''})
                  </option>
                ))}
              </select>
            </div>

            {/* Module 1: Ejmali Co-Sharer Quota Status Card (If joint property) */}
            {isEjmali && selectedPlot?.coSharers && (
              <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-950 font-black text-xs">
                    <Users className="w-4 h-4 text-purple-700" />
                    <span>{t(language, 'ejmaliQuotaHeader')}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                    Section 96 SAT Act 1950
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-600">Total Plot Area:</span>
                    <span className="font-bold text-slate-900">{formatDec(selectedPlot.totalAreaDecimals)} Decimals</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-purple-900 font-bold">Seller's Legal Share:</span>
                    <span className="font-black text-purple-950">{sellerCoSharer?.shareLabelBn} ({formatDec(sellerQuotaDecimals)} Decimals)</span>
                  </div>
                  <div className="flex justify-between font-mono text-emerald-800 font-bold border-t border-purple-200/80 pt-1">
                    <span>Seller's Max Sellable Ceiling:</span>
                    <span>{formatDec(sellerQuotaDecimals)} Decimals</span>
                  </div>
                </div>

                {/* Pre-emption SMS notice badge */}
                <div className="flex items-center gap-1.5 text-[10px] text-purple-800 font-bold bg-white p-2 rounded-xl border border-purple-200">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{t(language, 'preEmptionNoticeBadge')}</span>
                </div>
              </div>
            )}

            {/* Module 2: Land Development Tax (Khajna) Status Card */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              (selectedPlot?.ldTaxArrearBdt || 0) > 0
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  <span>{t(language, 'khajnaCardTitle')}</span>
                </div>
                <span className="font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                  Dakhila #{selectedPlot?.dakhilaReceiptNo}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                <span className="text-slate-700">
                  {(selectedPlot?.ldTaxArrearBdt || 0) > 0
                    ? t(language, 'khajnaArrearAlert')
                    : t(language, 'khajnaClean')}
                </span>
                {(selectedPlot?.ldTaxArrearBdt || 0) > 0 && (
                  <span className="font-mono font-black text-amber-900 text-xs shrink-0 bg-amber-200 px-2.5 py-0.5 rounded-full">
                    Arrear Due: ৳ {selectedPlot?.ldTaxArrearBdt.toLocaleString()} BDT
                  </span>
                )}
              </div>
            </div>

            {/* Seller Info Card (Auto-filled) */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                {t(language, 'sellerInfo')}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{seller?.nameEn}</h4>
                  <p className="text-[11px] font-mono text-slate-500">{seller?.dummyNid}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t(language, 'biometricVerified')}</span>
                </div>
              </div>
            </div>

            {/* Buyer Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                {t(language, 'buyerInfo')}
              </label>
              <select
                value={selectedBuyerId}
                onChange={(e) => setSelectedBuyerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {buyerOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameEn} ({b.nameBn}) • NID: {b.dummyNid} • Phone: {b.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* Transfer Area Slider & Number Input */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                <span className="uppercase tracking-wider">{t(language, 'transferArea')}</span>
                <span className="font-mono text-emerald-800 text-sm font-black">
                  {formatDec(Number(transferArea))} Decimals
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max={Math.max(16, totalArea)}
                step="0.5"
                value={transferArea}
                onChange={(e) => setTransferArea(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />
            </div>

            {/* Visual Area Allocation Stacked Bar */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 block">
                {t(language, 'areaAllocationBar')}
              </span>
              <div className="w-full h-5 bg-slate-200 rounded-xl overflow-hidden flex shadow-inner">
                <div 
                  style={{ width: `${Math.min(100, (lockedArea / totalArea) * 100)}%` }} 
                  className="bg-amber-500 h-full transition-all"
                  title={`Locked Area: ${formatDec(lockedArea)} Dec`}
                />
                <div 
                  style={{ width: `${Math.min(100 - (lockedArea / totalArea) * 100, (transferArea / totalArea) * 100)}%` }} 
                  className={`${transferArea <= (isEjmali ? sellerQuotaDecimals : availableArea) ? 'bg-emerald-600' : 'bg-rose-600'} h-full transition-all`}
                  title={`Requested Area: ${formatDec(transferArea)} Dec`}
                />
                <div 
                  style={{ width: `${Math.max(0, 100 - ((lockedArea + transferArea) / totalArea) * 100)}%` }} 
                  className="bg-slate-300 h-full transition-all"
                  title="Remaining Available"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-500">
                <span>{t(language, 'totalDecimals')} {formatDec(totalArea)} Dec</span>
                <span className="text-amber-800 font-bold">{t(language, 'lockedDecimals')} {formatDec(lockedArea)} Dec</span>
                <span className="text-emerald-800 font-bold">{t(language, 'availableDecimals')} {formatDec(isEjmali ? sellerQuotaDecimals : availableArea)} Dec</span>
              </div>
            </div>

            {/* Declared Sale Price Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                {t(language, 'salePrice')}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-black text-slate-400 font-mono">৳</span>
                <input
                  type="number"
                  step="50000"
                  value={salePrice}
                  onChange={(e) => setSalePrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-xs font-mono font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Unified Revenue & Tax Breakdown Card (With Khajna Auto-Bundling) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-ambient space-y-3 font-sans">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Calculator className="w-4 h-4 text-emerald-800" />
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                {t(language, 'revenueBreakdown')}
              </h3>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">{t(language, 'stampDuty')}</span>
                <span className="font-mono font-bold text-slate-900">৳ {revenue.stampDutyBdt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">{t(language, 'regFee')}</span>
                <span className="font-mono font-bold text-slate-900">৳ {revenue.registrationFeeBdt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">{t(language, 'localTax')}</span>
                <span className="font-mono font-bold text-slate-900">৳ {revenue.localGovtTaxBdt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">{t(language, 'sourceTax')}</span>
                <span className="font-mono font-bold text-slate-900">৳ {revenue.sourceTaxGainBdt.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-emerald-900 bg-emerald-50/70 -mx-2 px-2 rounded-lg font-bold">
                <div>
                  <span>{t(language, 'eMutationFee')}</span>
                  <span className="block text-[10px] text-emerald-700 font-normal mt-0.5">
                    {t(language, 'eMutationNote')}
                  </span>
                </div>
                <span className="font-mono font-black text-sm">৳ {revenue.bundledEMutationFeeBdt.toLocaleString()}</span>
              </div>

              {/* Module 2: Auto-bundled Khajna arrears item */}
              {revenue.ldTaxArrearBdt > 0 && (
                <div className="flex items-center justify-between py-2 text-amber-900 bg-amber-50/80 -mx-2 px-2 rounded-lg font-bold">
                  <div>
                    <span>{t(language, 'bundledKhajnaFee')}</span>
                    <span className="block text-[10px] text-amber-700 font-normal mt-0.5">
                      3-Year Arrear Auto-Cleared upon registration
                    </span>
                  </div>
                  <span className="font-mono font-black text-sm text-amber-900">
                    ৳ {revenue.ldTaxArrearBdt.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="font-black text-slate-900 text-xs uppercase tracking-wide">
                {t(language, 'totalPayable')}
              </span>
              <span className="font-mono font-black text-lg text-emerald-900 tabular-nums">
                ৳ {revenue.totalPayableBdt.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Point Diagnostic Radar */}
        <div className={`lg:col-span-5 space-y-4 ${shakeRadar ? 'animate-shake' : ''}`}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-ambient space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    {t(language, 'radarTitle')}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Cross-Ministry Cryptographic Pre-Check
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLineageModalKhatian(selectedPlot)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Lineage Tree' : 'ধারাবাহিকতা'}</span>
              </button>
            </div>

            {/* 5 Diagnostic Cards */}
            <div className="space-y-3">
              {/* Check 1 */}
              <div className={`p-3.5 rounded-2xl border text-xs transition-all ${
                activeVerification?.checks.ownershipMatch.passed 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>{t(language, 'check1Title')}</span>
                  {activeVerification?.checks.ownershipMatch.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </div>
                <p className="text-[11px] mt-1 text-slate-700">
                  {language === 'en'
                    ? activeVerification?.checks.ownershipMatch.messageEn
                    : activeVerification?.checks.ownershipMatch.messageBn}
                </p>
              </div>

              {/* Check 2 */}
              <div className={`p-3.5 rounded-2xl border text-xs transition-all ${
                activeVerification?.checks.lineageContinuity.passed 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>{t(language, 'check2Title')}</span>
                  {activeVerification?.checks.lineageContinuity.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </div>
                <p className="text-[11px] mt-1 text-slate-700">
                  {language === 'en'
                    ? activeVerification?.checks.lineageContinuity.messageEn
                    : activeVerification?.checks.lineageContinuity.messageBn}
                </p>
              </div>

              {/* Check 3: Anti-Double-Selling & Ejmali Quota */}
              <div className={`p-3.5 rounded-2xl border text-xs transition-all ${
                activeVerification?.checks.unlockedAreaBalance.passed 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>{t(language, 'check3Title')}</span>
                  {activeVerification?.checks.unlockedAreaBalance.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </div>
                <p className="text-[11px] mt-1 text-slate-700">
                  {language === 'en'
                    ? activeVerification?.checks.unlockedAreaBalance.messageEn
                    : activeVerification?.checks.unlockedAreaBalance.messageBn}
                </p>
              </div>

              {/* Check 4 */}
              <div className={`p-3.5 rounded-2xl border text-xs transition-all ${
                activeVerification?.checks.bankMortgageClearance.passed 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>{t(language, 'check4Title')}</span>
                  {activeVerification?.checks.bankMortgageClearance.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </div>
                <p className="text-[11px] mt-1 text-slate-700">
                  {language === 'en'
                    ? activeVerification?.checks.bankMortgageClearance.messageEn
                    : activeVerification?.checks.bankMortgageClearance.messageBn}
                </p>
              </div>

              {/* Check 5 */}
              <div className={`p-3.5 rounded-2xl border text-xs transition-all ${
                activeVerification?.checks.courtAndAcquisitionClearance.passed 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>{t(language, 'check5Title')}</span>
                  {activeVerification?.checks.courtAndAcquisitionClearance.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </div>
                <p className="text-[11px] mt-1 text-slate-700">
                  {language === 'en'
                    ? activeVerification?.checks.courtAndAcquisitionClearance.messageEn
                    : activeVerification?.checks.courtAndAcquisitionClearance.messageBn}
                </p>
              </div>
            </div>

            {/* Action Button or High-Contrast Forensic Alert */}
            <div className="pt-2">
              {passedAll ? (
                <button
                  onClick={handleRegister}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 text-white rounded-2xl font-black text-sm shadow-card hover:shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t(language, 'registerBtn')}</span>
                </button>
              ) : (
                <div className="p-4 bg-rose-950 text-white rounded-2xl border border-rose-800 space-y-2 shadow-alertGlow">
                  <div className="flex items-center gap-2 text-rose-400 font-black text-xs">
                    <AlertOctagon className="w-4 h-4" />
                    <span>{t(language, 'blockedAlertTitle')}</span>
                  </div>
                  <p className="text-[11px] text-rose-200/90 leading-relaxed">
                    {t(language, 'blockedAlertSubtitle')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
