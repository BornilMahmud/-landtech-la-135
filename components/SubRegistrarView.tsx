'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileCheck2, 
  History, 
  UserCheck, 
  Calculator, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight,
  Lock,
  Zap,
  Info,
  MapPin,
  ExternalLink,
  Sparkles,
  Layers,
  FileText,
  Users,
  Coins
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { DeedRecord } from '@/types';

export const SubRegistrarView: React.FC = () => {
  const { 
    khatians, 
    selectedPlotId, 
    setSelectedPlotId, 
    runFivePointVerification, 
    registerDeed, 
    lastVerificationResult, 
    isVerifying,
    setFraudAlert,
    language,
    setActiveLtNotice,
    setLineageModalKhatian,
    deeds
  } = useLandApp();

  const selectedPlot = khatians.find(k => k.id === selectedPlotId) || khatians[0];

  const [buyerName, setBuyerName] = useState('Shahidul Islam');
  const [buyerNid, setBuyerNid] = useState('DUMMY-NID-2026-9901');
  const [buyerPhone, setBuyerPhone] = useState('01800-111222');
  const [transferArea, setTransferArea] = useState<number>(4.0);
  const [saleValue, setSaleValue] = useState<number>(2000000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);
  const [lastRegisteredDeed, setLastRegisteredDeed] = useState<DeedRecord | null>(null);

  // Initialize selected plot defaults
  useEffect(() => {
    if (selectedPlot) {
      if (selectedPlot.id === 'plot-1') {
        setTransferArea(4.0);
        setSaleValue(2000000);
      } else if (selectedPlot.id === 'plot-2') {
        setTransferArea(5.0);
        setSaleValue(2500000);
      } else if (selectedPlot.id === 'plot-3') {
        setTransferArea(3.0);
        setSaleValue(1800000);
      } else if (selectedPlot.id === 'plot-4') {
        setTransferArea(5.0);
        setSaleValue(3000000);
      } else if (selectedPlot.id === 'plot-5') {
        setTransferArea(2.0);
        setSaleValue(1500000);
      } else if (selectedPlot.id === 'plot-6') {
        setTransferArea(6.0); // Exceeds legal ejmali fraction of 3.0 Dec
        setSaleValue(3600000);
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
      setTimeout(() => setShakeCard(false), 500);
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
    const res = await registerDeed({
      plotId: selectedPlot.id,
      buyerName,
      buyerNid,
      buyerPhone,
      transferAreaDecimals: Number(transferArea),
      saleValueBDT: Number(saleValue),
    });
    if (res?.deed) {
      setLastRegisteredDeed(res.deed);
    }
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
      {/* 1-Click Evaluation Scenarios — BMS Header Card */}
      <div className="bg-[#121215] rounded-lg p-4 sm:p-5 border border-[#27272a] text-[#f4f4f5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-[#a1a1aa] tracking-widest uppercase flex items-center gap-1.5 font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#d4a657]" />
              {language === 'en' ? 'System Test Protocol' : 'টেস্ট সিনারিও প্রটোকল'}
            </span>
            <span className="text-xs font-sans text-[#71717a] hidden md:inline">
              {language === 'en'
                ? '— Synthetic institutional scenarios for consensus validation'
                : '— ৫-স্তরের কনসেনসাস অডিটের জন্য নির্ধারিত টেস্ট সিনারিও'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono font-semibold bg-[#18181b] text-[#d4a657] border border-[#27272a] self-start sm:self-auto">
            {language === 'en' ? '10-SEC EVALUATION' : '১০-সেকেন্ড টেস্ট'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => loadPreset('plot-1', 4.0, 'Shahidul Islam', 'DUMMY-NID-2026-9901', 2000000)}
            className={`px-2.5 py-2 rounded-md text-xs font-sans font-medium transition-colors border text-left flex items-center justify-between cursor-pointer focus:outline-none ${
              selectedPlot?.id === 'plot-1'
                ? 'bg-[#d4a657] text-[#09090b] font-semibold border-[#d4a657]'
                : 'bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] border-[#27272a]'
            }`}
            title="Clean title with unbroken CS->SA->RS->BS lineage. Ready for instant zero-touch registration."
          >
            <span className="truncate">
              <strong>{language === 'en' ? '1. Clean' : '১. বৈধ'}</strong>
            </span>
            <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">P-1</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('plot-2', 5.0, 'Kamal Hossain', 'DUMMY-NID-2026-9902', 2500000)}
            className={`px-2.5 py-2 rounded-md text-xs font-sans font-medium transition-colors border text-left flex items-center justify-between cursor-pointer focus:outline-none ${
              selectedPlot?.id === 'plot-2'
                ? 'bg-[#d4a657] text-[#09090b] font-semibold border-[#d4a657]'
                : 'bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] border-[#27272a]'
            }`}
            title="10 Dec total, 7 already locked. Trying to sell 5 Decimals triggers Double-Selling fraud alert!"
          >
            <span className="truncate">
              <strong>{language === 'en' ? '2. Double' : '২. দ্বৈত'}</strong>
            </span>
            <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">P-2</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('plot-3', 3.0, 'Faruk Ahmed', 'DUMMY-NID-2026-9903', 1800000)}
            className={`px-2.5 py-2 rounded-md text-xs font-sans font-medium transition-colors border text-left flex items-center justify-between cursor-pointer focus:outline-none ${
              selectedPlot?.id === 'plot-3'
                ? 'bg-[#d4a657] text-[#09090b] font-semibold border-[#d4a657]'
                : 'bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] border-[#27272a]'
            }`}
            title="Active mortgage lien with Sonali Bank PLC triggers mortgage fraud alert!"
          >
            <span className="truncate">
              <strong>{language === 'en' ? '3. Lien' : '৩. ব্যাংক'}</strong>
            </span>
            <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">P-3</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('plot-4', 5.0, 'Habib Ullah', 'DUMMY-NID-2026-9904', 3000000)}
            className={`px-2.5 py-2 rounded-md text-xs font-sans font-medium transition-colors border text-left flex items-center justify-between cursor-pointer focus:outline-none ${
              selectedPlot?.id === 'plot-4'
                ? 'bg-[#d4a657] text-[#09090b] font-semibold border-[#d4a657]'
                : 'bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] border-[#27272a]'
            }`}
            title="Civil court stay order in Case #DUMMY-CIV-404 triggers court dispute block!"
          >
            <span className="truncate">
              <strong>{language === 'en' ? '4. Court' : '৪. আদালত'}</strong>
            </span>
            <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">P-4</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('plot-5', 2.0, 'Nurul Islam', 'DUMMY-NID-2026-9905', 1500000)}
            className={`px-2.5 py-2 rounded-md text-xs font-sans font-medium transition-colors border text-left flex items-center justify-between cursor-pointer focus:outline-none ${
              selectedPlot?.id === 'plot-5'
                ? 'bg-[#d4a657] text-[#09090b] font-semibold border-[#d4a657]'
                : 'bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] border-[#27272a]'
            }`}
            title="Acquired under Section 4(1) of Land Acquisition Act 2017 for Metro Rail depot. State acquisition blocks transfer."
          >
            <span className="truncate">
              <strong>{language === 'en' ? '5. Acquired' : '৫. অধিগ্রহণ'}</strong>
            </span>
            <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">P-5</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('plot-6', 6.0, 'Jasim Uddin', 'DUMMY-NID-2026-9906', 3600000)}
            className={`px-2.5 py-2 rounded-md text-xs font-sans font-medium transition-colors border text-left flex items-center justify-between cursor-pointer focus:outline-none ${
              selectedPlot?.id === 'plot-6'
                ? 'bg-[#d4a657] text-[#09090b] font-semibold border-[#d4a657]'
                : 'bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] border-[#27272a]'
            }`}
            title="Ejmali joint property: Seller owns 4 anna = 3.0 Dec, but attempts to sell 6.0 Dec. Exceeds legal co-sharer fraction!"
          >
            <span className="truncate">
              <strong>{language === 'en' ? '6. Ejmali' : '৬. এজমালি'}</strong>
            </span>
            <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">P-6</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Deed Form & Single-Window Fee Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Land Parcel Selection */}
          <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <div className="font-mono text-xs uppercase tracking-wider text-[#a1a1aa]">Stage 01 • Parcel Resolution</div>
                <h3 className="font-sans text-xl font-semibold text-[#f4f4f5] mt-0.5">
                  {language === 'en' ? 'Khatian & Cadastral Selection' : 'খতিয়ান ও দাগ নির্বাচন'}
                </h3>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-mono font-medium bg-[#231d13] text-[#d4a657] border border-[#4a3a1f]">
                DLRS INDEX
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#a1a1aa] mb-1.5">
                  {language === 'en' ? 'Target Parcel (Khatian & Dag):' : 'হস্তান্তরযোগ্য খতিয়ান ও দাগ:'}
                </label>
                <select
                  value={selectedPlot?.id}
                  onChange={(e) => setSelectedPlotId(e.target.value)}
                  className="w-full text-sm font-medium border border-[#27272a] rounded-md px-3.5 py-2.5 bg-[#09090b] text-[#f4f4f5] focus:border-[#d4a657] focus:outline-none transition-colors"
                >
                  {khatians.map(k => {
                    let statusTag = 'Clean Title';
                    if (k.isMortgaged) statusTag = 'Bank Mortgaged';
                    else if (k.hasCourtCase) statusTag = 'Court Dispute';
                    else if (k.isAcquired) statusTag = 'DC Acquired';
                    else if (k.lockedAreaDecimals > 0) statusTag = `${k.lockedAreaDecimals.toFixed(1)} Dec Locked`;

                    return (
                      <option key={k.id} value={k.id}>
                        {k.khatianNo} | Dag #{k.dagNo} ({k.mouza}) — {k.ownerName} [{statusTag}]
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Quick Parcel Selector Cards */}
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4a657]" />
                    {language === 'en' ? 'Select Parcel for Deed Registration:' : 'রেজিস্ট্রেশনের জন্য দাগ নির্বাচন করুন:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => document.getElementById('role-mouza_map')?.scrollIntoView({ behavior: 'smooth' })}
                    className="font-mono text-[11px] text-[#d4a657] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'en' ? 'View on Mouza Map' : 'মৌজা মানচিত্রে দেখুন'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {khatians.map((k) => {
                    const isSelected = selectedPlot?.id === k.id;
                    const available = Math.max(0, k.totalAreaDecimals - k.lockedAreaDecimals);
                    let statusLabel = 'Clean Title';
                    let statusColor = 'text-[#4ade80]';
                    if (k.isMortgaged) {
                      statusLabel = 'Mortgaged';
                      statusColor = 'text-[#f87171]';
                    } else if (k.hasCourtCase) {
                      statusLabel = 'Court Dispute';
                      statusColor = 'text-[#f87171]';
                    } else if (k.lockedAreaDecimals > 0) {
                      statusLabel = `${k.lockedAreaDecimals.toFixed(1)} Dec Locked`;
                      statusColor = 'text-[#fbbf24]';
                    }

                    return (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setSelectedPlotId(k.id)}
                        className={`p-2.5 rounded-md border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1e1c14] border-[#d4a657] shadow-xs'
                            : 'bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className={`font-semibold ${isSelected ? 'text-[#f4f4f5]' : 'text-[#a1a1aa]'}`}>
                            Dag #{k.dagNo}
                          </span>
                          <span className={`text-[10px] ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </div>
                        <div className="text-xs font-sans text-[#f4f4f5] mt-0.5 truncate font-medium">
                          {k.mouza} Mouza
                        </div>
                        <div className="text-[10px] text-[#71717a] font-mono mt-0.5">
                          {available.toFixed(1)} / {k.totalAreaDecimals.toFixed(1)} Dec • {k.khatianNo}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auto-filled Seller Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#09090b] rounded-md border border-[#27272a] text-xs">
                <div>
                  <span className="font-mono text-[11px] text-[#a1a1aa] uppercase block">{language === 'en' ? 'Registered Seller:' : 'নিবন্ধিত মালিক:'}</span>
                  <span className="font-sans text-sm font-semibold text-[#f4f4f5]">{selectedPlot?.ownerName}</span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#a1a1aa] uppercase block">{language === 'en' ? 'Seller NID:' : 'বিক্রেতার এনআইডি:'}</span>
                  <span className="font-mono text-xs text-[#f4f4f5]">{selectedPlot?.ownerNid}</span>
                </div>
              </div>

              {/* Minimalist Area Balance Indicator */}
              <div className="bg-[#09090b] rounded-md p-4 border border-[#27272a] text-xs space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase tracking-wider text-[#a1a1aa]">{language === 'en' ? 'Area Allocation Balance:' : 'জমির অবমুক্ত ও লক বিভাজন:'}</span>
                  <span className="font-mono text-[#f4f4f5] font-medium tabular-nums">
                    Total: {selectedPlot?.totalAreaDecimals.toFixed(2)} Dec
                  </span>
                </div>

                {/* Flat Segmented Progress Bar */}
                <div className="w-full h-2.5 bg-[#27272a] rounded-sm overflow-hidden flex">
                  <div 
                    className="bg-[#16A34A] h-full transition-all duration-300"
                    style={{ width: `${selectedPlot ? (availableArea / selectedPlot.totalAreaDecimals) * 100 : 0}%` }}
                    title={`Available: ${availableArea.toFixed(2)} Decimals`}
                  />
                  <div 
                    className="bg-[#d4a657] h-full transition-all duration-300"
                    style={{ width: `${selectedPlot ? (selectedPlot.lockedAreaDecimals / selectedPlot.totalAreaDecimals) * 100 : 0}%` }}
                    title={`Escrow Locked: ${selectedPlot?.lockedAreaDecimals.toFixed(2)} Decimals`}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-[#a1a1aa]">
                  <div className="flex items-center gap-1.5 text-[#f4f4f5]">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    <span>Available: <strong className="tabular-nums">{availableArea.toFixed(2)} Dec</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#d4a657]">
                    <span className="w-2 h-2 rounded-full bg-[#d4a657]" />
                    <span>Locked: <strong className="tabular-nums">{selectedPlot?.lockedAreaDecimals.toFixed(2)} Dec</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-[#a1a1aa] col-span-2 sm:col-span-1">
                    <Lock className="w-3 h-3 text-[#a1a1aa]" />
                    <span>Escrow Guard</span>
                  </div>
                </div>
              </div>

              {/* Ejmali Joint Property Co-Sharer Quota Card */}
              {selectedPlot?.coSharers && selectedPlot.coSharers.length > 0 && (
                <div className="bg-[#09090b] rounded-md p-3.5 border border-amber-500/30 text-xs space-y-2">
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
                        className={`p-2 rounded-sm border ${
                          cs.name === selectedPlot.ownerName 
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                            : 'bg-[#121215] border-[#27272a] text-[#a1a1aa]'
                        }`}
                      >
                        <div className="font-semibold text-xs text-[#f4f4f5] truncate">{cs.name || cs.nameEn}</div>
                        <div className="text-[10px] text-[#d4a657]">{cs.shareTraditional || cs.shareLabelBn} ({Math.round(cs.shareFraction * 16)} আনা)</div>
                        <div className="text-[10px] text-[#71717a]">{(cs.holdingAreaDecimals ?? cs.maxOwnedDecimals ?? 0).toFixed(2)} Dec Quota</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Land Development Tax (Khajna) Arrear Notice */}
              {selectedPlot?.khajnaArrearsBDT && selectedPlot.khajnaArrearsBDT > 0 ? (
                <div className="bg-[#09090b] rounded-md p-3 border border-amber-500/30 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-amber-300 font-medium">
                        {language === 'en' ? 'Land Development Tax (Khajna) Arrear' : 'ভূমি উন্নয়ন কর (খাজনা) বকেয়া'}
                      </span>
                      <span className="text-[11px] text-[#a1a1aa] block">
                        {language === 'en' 
                          ? 'Statutorily bundled into single-window deed registration checkout.' 
                          : 'দলিল রেজিস্ট্রেশন ফি-এর সাথে এককালীন সমন্বয়যোগ্য।'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                    ৳ {selectedPlot.khajnaArrearsBDT.toLocaleString()} BDT
                  </span>
                </div>
              ) : null}

              {/* Spatial & Environmental Telemetry Card (LandTech-LA-135 Google Data) */}
              <div className="bg-[#09090b] rounded-md p-3.5 border border-[#27272a] text-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4a657]" />
                    <span>{language === 'en' ? 'Spatial & Environmental Telemetry:' : 'ভৌগোলিক ও পরিবেশগত উপাত্ত:'}</span>
                  </span>
                  <a
                    href={selectedPlot?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${selectedPlot?.lat || 23.8465},${selectedPlot?.lng || 90.2585}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-[#38bdf8] hover:underline"
                  >
                    <span>Google Maps GPS</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 rounded-sm bg-[#121215] border border-[#27272a]">
                    <span className="text-[#71717a] block text-[10px]">WGS84 Coordinates</span>
                    <span className="text-[#f4f4f5] font-semibold">{selectedPlot?.lat?.toFixed(4) || '23.8465'}°N, {selectedPlot?.lng?.toFixed(4) || '90.2585'}°E</span>
                  </div>
                  <div className="p-2 rounded-sm bg-[#121215] border border-[#27272a]">
                    <span className="text-[#71717a] block text-[10px]">Elevation / Flood Risk</span>
                    <span className="text-[#f4f4f5] font-semibold">{selectedPlot?.elevationMeters || 7.8}m AMSL ({selectedPlot?.floodRisk || 'Low'})</span>
                  </div>
                  <div className="p-2 rounded-sm bg-[#121215] border border-[#27272a]">
                    <span className="text-[#71717a] block text-[10px]">Geotechnical Soil</span>
                    <span className="text-[#f4f4f5] font-semibold">{selectedPlot?.soilType || 'Red Clay'}</span>
                  </div>
                  <div className="p-2 rounded-sm bg-[#121215] border border-[#27272a]">
                    <span className="text-[#71717a] block text-[10px]">Estimated Valuation</span>
                    <span className="text-[#d4a657] font-semibold">BDT {selectedPlot?.estimatedValueBDT?.toLocaleString() || '5,400,000'}</span>
                  </div>
                </div>
              </div>

              {/* Title Lineage Nodes (CS -> SA -> RS -> BS) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#a1a1aa]" />
                    <span>{language === 'en' ? 'Unbroken Title Lineage (CS ➔ SA ➔ RS ➔ BS):' : 'ধারাবাহিক পরচা মালিকানা নোড:'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setLineageModalKhatian(selectedPlot)}
                    className="font-mono text-[11px] text-[#d4a657] hover:underline flex items-center gap-1 cursor-pointer"
                    title="Open full interactive 4-generation chain of title tree"
                  >
                    <Layers className="w-3 h-3 text-[#d4a657]" />
                    <span>{language === 'en' ? 'Diagnostic Tree' : 'পরচা ডায়াগনস্টিক'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {selectedPlot?.chainOfTitle.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-md bg-[#09090b] border border-[#27272a] text-center">
                      <span className="inline-block px-1.5 py-0.2 rounded-sm bg-[#18181b] text-[#f4f4f5] font-mono text-[10px] border border-[#27272a]">
                        {c.surveyType}
                      </span>
                      <div className="text-xs font-sans font-semibold text-[#f4f4f5] mt-1 truncate">
                        #{c.khatianNo}
                      </div>
                      <div className="text-[10px] text-[#71717a] font-mono">
                        {c.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Buyer Details & Single-Window Fee Calculator */}
          <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <div className="font-mono text-xs uppercase tracking-wider text-[#a1a1aa]">Stage 02 • Terms & Assessment</div>
                <h3 className="font-sans text-xl font-semibold text-[#f4f4f5] mt-0.5">
                  {language === 'en' ? 'Transferee Terms & Revenue' : 'ক্রেতার বিবরণ ও রাজস্ব হিসাব'}
                </h3>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-mono font-medium bg-[#231d13] text-[#d4a657] border border-[#4a3a1f]">
                STATUTORY DUE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#a1a1aa] mb-1">
                  {language === 'en' ? 'Buyer Legal Name:' : 'ক্রেতার নাম:'}
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full border border-[#27272a] rounded-md px-3 py-2 bg-[#09090b] text-sm text-[#f4f4f5] focus:border-[#d4a657] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#a1a1aa] mb-1">
                  {language === 'en' ? 'Buyer NID (Synthetic):' : 'ক্রেতার ডামি এনআইডি:'}
                </label>
                <input
                  type="text"
                  value={buyerNid}
                  onChange={(e) => setBuyerNid(e.target.value)}
                  className="w-full font-mono text-xs border border-[#27272a] rounded-md px-3 py-2 bg-[#09090b] text-[#f4f4f5] focus:border-[#d4a657] focus:outline-none transition-colors tabular-nums"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#a1a1aa] mb-1">
                  {language === 'en' ? 'Transfer Area (Decimals):' : 'হস্তান্তরকৃত শতাংশ:'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={transferArea}
                  onChange={(e) => setTransferArea(parseFloat(e.target.value) || 0)}
                  className="w-full font-mono text-sm border border-[#27272a] rounded-md px-3 py-2 bg-[#09090b] text-[#f4f4f5] focus:border-[#d4a657] focus:outline-none transition-colors tabular-nums"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#a1a1aa] mb-1">
                  {language === 'en' ? 'Declared Sale Value (BDT):' : 'বিক্রয় মূল্য (টাকা):'}
                </label>
                <input
                  type="number"
                  step="50000"
                  min="50000"
                  value={saleValue}
                  onChange={(e) => setSaleValue(parseInt(e.target.value) || 0)}
                  className="w-full font-mono text-sm border border-[#27272a] rounded-md px-3 py-2 bg-[#09090b] text-[#f4f4f5] focus:border-[#d4a657] focus:outline-none transition-colors tabular-nums"
                />
              </div>
            </div>

            {/* Fee Breakdown Table */}
            <div className="bg-[#09090b] rounded-md p-4 border border-[#27272a] text-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#a1a1aa] font-mono border-b border-[#27272a] pb-2">
                <span>STATUTORY REVENUE SCHEDULE</span>
                <span>Base: ৳ {saleValue.toLocaleString()} BDT</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#a1a1aa] font-mono pt-1">
                <div>Stamp Duty (1.5%): <span className="text-[#f4f4f5]">৳ {fees.stampDutyBDT.toLocaleString()}</span></div>
                <div>Registration Fee (1.0%): <span className="text-[#f4f4f5]">৳ {fees.registrationFeeBDT.toLocaleString()}</span></div>
                <div>Local Govt Tax (3.0%): <span className="text-[#f4f4f5]">৳ {fees.localGovtTaxBDT.toLocaleString()}</span></div>
                <div>Source Tax (2.0%): <span className="text-[#f4f4f5]">৳ {fees.gainTaxBDT.toLocaleString()}</span></div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#27272a] font-mono">
                <span className="text-[#a1a1aa]">Bundled e-Mutation Fee:</span>
                <span className="text-[#f4f4f5]">৳ {fees.mutationFeeBDT.toLocaleString()} BDT</span>
              </div>

              {selectedPlot?.khajnaArrearsBDT && selectedPlot.khajnaArrearsBDT > 0 ? (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#27272a] font-mono text-amber-400">
                  <span>Bundled Khajna Arrears:</span>
                  <span>৳ {selectedPlot.khajnaArrearsBDT.toLocaleString()} BDT</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-2 border-t border-[#27272a] text-sm">
                <span className="font-sans font-semibold text-[#f4f4f5]">Total Statutory Assessment:</span>
                <span className="font-mono text-base font-bold text-[#d4a657] tabular-nums">
                  ৳ {(fees.totalFeeBDT + (selectedPlot?.khajnaArrearsBDT || 0)).toLocaleString()} BDT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Point Consensus Radar (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-5 transition-all shadow-xs ${
            shakeCard ? 'animate-shake border-[#DC2626]' : ''
          }`}>
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <div className="font-mono text-xs uppercase tracking-wider text-[#a1a1aa]">Consensus Engine</div>
                <h3 className="font-sans text-xl font-semibold text-[#f4f4f5] mt-0.5">
                  {language === 'en' ? '5-Point Verification' : '৫-স্তরের অডিট'}
                </h3>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-mono font-medium bg-[#231d13] text-[#d4a657] border border-[#4a3a1f]">
                PRE-DEED
              </span>
            </div>

            <p className="font-sans text-xs text-[#a1a1aa] leading-relaxed">
              {language === 'en'
                ? 'Parallel consensus check verifying identity integrity, 4-tier title chain, unencumbered area balance, mortgage lien records, and court injunctions.'
                : 'দলিল প্রস্তুতের পূর্বেই সমান্তরালে এনআইডি, ৪ স্তরের পরচা ধারা, ব্যাংক বন্ধক ও দেওয়ানী আদালতের নিষেধাজ্ঞা যাচাই করে।'}
            </p>

            {/* Run Verification Button — Signature BMS Button */}
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f4f4f5] hover:bg-white text-[#09090b] font-sans text-sm font-semibold rounded-md border border-[#f4f4f5] transition-colors duration-150 disabled:opacity-50 cursor-pointer shadow-xs focus:outline-none"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#09090b] border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'en' ? 'Executing Verification...' : 'কনসেনসাস অডিট চলমান...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#09090b]" />
                  <span>{language === 'en' ? 'Execute 5-Point Consensus Audit' : '৫-স্তরের স্বয়ংক্রিয় যাচাই শুরু করুন'}</span>
                </>
              )}
            </button>

            {/* Diagnostic Verification Checklist */}
            <div className="space-y-2 pt-1">
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
                    className={`p-3 rounded-md border text-xs transition-colors ${
                      !isChecked 
                        ? 'bg-[#09090b] border-[#27272a] text-[#a1a1aa]'
                        : isPass 
                          ? 'bg-[#121215] border-[#16A34A]/40 text-[#f4f4f5]'
                          : 'bg-[#FEF2F2]/10 border-[#DC2626]/40 text-[#f87171]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isChecked ? (
                        isPass ? (
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                        )
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-[#27272a] shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        <div className="font-sans font-medium">
                          {language === 'en' ? check.labelEn : check.labelBn}
                        </div>
                        {isChecked && (
                          <div className={`text-[11px] font-sans ${isPass ? 'text-[#a1a1aa]' : 'text-[#DC2626]'}`}>
                            {language === 'en' ? check.messageEn : check.messageBn}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Integrity Rejection Callout */}
            {lastVerificationResult && !lastVerificationResult.passed && (
              <div className="bg-[#FEF2F2]/10 text-[#f87171] p-3.5 rounded-md text-xs border border-[#DC2626]/40 space-y-1">
                <div className="font-mono text-xs uppercase tracking-wider font-semibold">
                  Integrity Discrepancy Blocked
                </div>
                <p className="font-sans text-xs leading-relaxed">
                  {lastVerificationResult.fraudReasonEn}
                </p>
              </div>
            )}

            {/* Register Deed Action Button */}
            <div className="pt-2 border-t border-[#27272a]">
              <button
                onClick={handleRegisterDeed}
                disabled={!lastVerificationResult?.passed || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 font-sans text-sm font-semibold rounded-md border transition-colors focus:outline-none ${
                  lastVerificationResult?.passed
                    ? 'bg-[#d4a657] hover:bg-[#be8a3a] text-[#09090b] border-[#d4a657] shadow-gold cursor-pointer'
                    : 'bg-[#18181b] text-[#71717a] border-[#27272a] cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#09090b] border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'en' ? 'Sealing Cryptographic Deed...' : 'দলিল সীল করা হচ্ছে...'}</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>
                      {language === 'en' 
                        ? 'Register Deed & Trigger e-Mutation' 
                        : 'দলিল সম্পাদন ও ই-নামজারি ট্র্রিগার'}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-80" />
                  </>
                )}
              </button>

              <p className="font-mono text-[11px] text-[#71717a] text-center mt-2.5">
                {language === 'en'
                  ? 'Applies cryptographic escrow lock on parent Khatian instantly.'
                  : 'রেজিস্ট্রি সম্পন্ন হওয়া মাত্র মূল খতিয়ানে অবমুক্ত অংশ অবিলম্বে লক হবে।'}
              </p>
            </div>

            {/* Registered Deed & Section 89 LT Notice Inspection Banner */}
            {(lastRegisteredDeed || deeds.find(d => d.plotId === selectedPlot?.id)) && (
              <div className="bg-[#09090b] border border-[#d4a657]/40 p-3.5 rounded-md space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5 uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Deed Registered' : 'দলিল প্রস্তুত'}</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#d4a657]">
                    Deed #{(lastRegisteredDeed || deeds.find(d => d.plotId === selectedPlot?.id))?.deedNo}
                  </span>
                </div>
                
                <p className="font-sans text-xs text-[#a1a1aa] leading-relaxed">
                  {language === 'en'
                    ? 'Section 89 Digital LT Notice with QR verification and Merkle block hash generated for AC Land.'
                    : 'রাষ্ট্রীয় অধিগ্রহণ আইন ধারা ৮৯ দখল হস্তান্তর নোটিশ কিউআর কোডসহ প্রস্তুত হয়েছে।'}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    const d = lastRegisteredDeed || deeds.find(item => item.plotId === selectedPlot?.id);
                    if (d?.ltNotice) {
                      setActiveLtNotice(d.ltNotice);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#d4a657]/15 hover:bg-[#d4a657]/25 text-[#d4a657] font-sans text-xs font-semibold rounded border border-[#d4a657]/40 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Inspect Section 89 LT Notice' : 'ধারা ৮৯ এলটি নোটিশ দেখুন'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateFees(saleValueBDT: number) {
  const stampDutyBDT = Math.round(saleValueBDT * 0.015);
  const registrationFeeBDT = Math.round(saleValueBDT * 0.010);
  const localGovtTaxBDT = Math.round(saleValueBDT * 0.030);
  const gainTaxBDT = Math.round(saleValueBDT * 0.020);
  const mutationFeeBDT = 1170;
  const totalFeeBDT = stampDutyBDT + registrationFeeBDT + localGovtTaxBDT + gainTaxBDT + mutationFeeBDT;

  return {
    saleValueBDT,
    stampDutyBDT,
    registrationFeeBDT,
    localGovtTaxBDT,
    gainTaxBDT,
    mutationFeeBDT,
    totalFeeBDT,
  };
}

export default SubRegistrarView;
