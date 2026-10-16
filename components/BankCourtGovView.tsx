'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Scale, 
  Building2, 
  Landmark, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Calculator,
  Coins,
  FileText
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';

export const BankCourtGovView: React.FC = () => {
  const { 
    khatians, 
    toggleBankMortgage, 
    toggleCourtInjunction, 
    toggleDcAcquisition, 
    setActiveRole, 
    language 
  } = useLandApp();

  const [selectedDcPlotId, setSelectedDcPlotId] = useState<string>(khatians[0]?.id || 'plot-1');
  const [acquisitionRate, setAcquisitionRate] = useState<number>(850000); // 8.5 Lakh per decimal
  const [compensationDisbursed, setCompensationDisbursed] = useState<boolean>(false);

  const selectedDcPlot = khatians.find(k => k.id === selectedDcPlotId) || khatians[0];
  const availableDecimals = selectedDcPlot ? Math.max(0, selectedDcPlot.totalAreaDecimals - selectedDcPlot.lockedAreaDecimals) : 0;
  const grossCompensation = availableDecimals * acquisitionRate;
  const bankDeduction = selectedDcPlot?.isMortgaged ? (selectedDcPlot.mortgageDetails?.amountBDT || 0) : 0;
  const netPayableToOwner = Math.max(0, grossCompensation - bankDeduction);

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="bg-[#121215] text-[#f4f4f5] rounded-lg p-5 sm:p-6 border border-[#27272a] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#18181b] text-[#818CF8] text-xs font-mono font-semibold px-2.5 py-0.5 rounded-sm border border-[#818CF8]/30 mb-2">
              <Landmark className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Judiciary, Central Bank & DC Office Integration' : 'আদালত, বাংলাদেশ ব্যাংক ও জেলা প্রশাসক ইন্টিগ্রেশন'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#f4f4f5]">
              {language === 'en' 
                ? 'Bank, Judiciary & DC Office Statutory Lock Panel' 
                : 'ব্যাংক, আদালত ও ডিসি অফিস সংবিধিবদ্ধ লক প্যানেল'}
            </h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Judges, banks, and DC revenue officers toggle mortgage liens, court injunctions, and DC acquisitions in real time to verify that Sub-Registry automatically blocks fraud.'
                : 'বিচারকমণ্ডলী যেকোনো জমির বন্ধক, নিষেধাজ্ঞা বা ডিসি অধিগ্রহণ অন/অফ করে সাথে সাথে সাব-রেজিস্ট্রির ব্লকিং অ্যালগরিদম পরীক্ষা করতে পারেন।'}
            </p>
          </div>

          <div className="bg-[#18181b] rounded-lg p-3 border border-[#27272a] text-xs text-center shrink-0 shadow-xs">
            <span className="block text-[10px] text-[#a1a1aa] uppercase font-mono font-semibold">{language === 'en' ? 'Live Consensus Status' : 'কনসেনসাস স্থিতি'}</span>
            <span className="text-xs font-mono font-bold text-[#f4f4f5] flex items-center justify-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              <span>Real-Time Bi-Directional Lock</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Bank & Court Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Bank Mortgage Lien Controller (Red / Crimson Theme) */}
        <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md border border-[#DC2626]/40 bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-[#f4f4f5] text-sm">
                  {language === 'en' ? 'Commercial Bank Mortgage Liens' : 'তফসিলি ব্যাংক ও আর্থিক প্রতিষ্ঠান বন্ধকী লক'}
                </h3>
                <p className="text-[11px] text-[#71717a] font-mono">CIB / Credit Information Bureau sync</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#DC2626] bg-[#DC2626]/10 px-2.5 py-0.5 rounded-sm border border-[#DC2626]/30">
              Secured Loans
            </span>
          </div>

          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            {language === 'en'
              ? 'When a bank sanctions a loan against land, the mortgage is placed here. Any attempted sale in the Sub-Registry is immediately blocked.'
              : 'জমির বিপরীতে ব্যাংক ঋণ প্রদান করলে এখানে বন্ধক সক্রিয় হয়। সাব-রেজিস্ট্রিতে বিক্রির চেষ্টা হলে তা সাথে সাথে আটকে দেওয়া হয়।'}
          </p>

          <div className="space-y-2.5">
            {khatians.map(k => (
              <div
                key={k.id}
                className={`p-3.5 rounded-md border text-xs flex items-center justify-between transition-colors ${
                  k.isMortgaged
                    ? 'bg-[#18181b] border-[#DC2626]/50 text-[#f4f4f5]'
                    : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa]'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-sans font-semibold text-[#f4f4f5]">
                    <span className="font-mono tabular-nums">{k.khatianNo} (Dag #{k.dagNo})</span>
                    <span className="text-[10px] text-[#71717a] font-mono">[{k.mouza}]</span>
                  </div>
                  <div className="text-[11px] text-[#a1a1aa]">
                    Owner: <strong className="text-[#f4f4f5] font-sans">{k.ownerName}</strong> (<span className="font-mono tabular-nums">{k.totalAreaDecimals.toFixed(1)} Dec</span>)
                  </div>
                  {k.isMortgaged && (
                    <div className="text-[10px] font-mono text-[#DC2626] font-semibold tabular-nums">
                      Lien: {k.mortgageDetails?.bankName} (Acct: {k.mortgageDetails?.loanAccount})
                    </div>
                  )}
                </div>

                <button
                  onClick={() => toggleBankMortgage(k.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-sans font-semibold text-xs transition-colors cursor-pointer border focus:outline-none shadow-xs ${
                    k.isMortgaged
                      ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white border-[#DC2626]'
                      : 'bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] border-[#27272a]'
                  }`}
                >
                  {k.isMortgaged ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Locked (Release)' : 'লককৃত (মুছে ফেলুন)'}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-[#71717a]" />
                      <span>{language === 'en' ? 'Place Lien' : 'বন্ধক দিন'}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Judiciary & Civil Court Injunction Controller (Amber Theme) */}
        <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md border border-[#D97706]/40 bg-[#D97706]/10 text-[#D97706] flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-[#f4f4f5] text-sm">
                  {language === 'en' ? 'Civil Judiciary & Stay Order Injunctions' : 'আদালত নিষেধাজ্ঞা ও দেওয়ানী মামলা প্যানেল'}
                </h3>
                <p className="text-[11px] text-[#71717a] font-mono">Order 39 Rule 1 CPC / Title Suits</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#D97706] bg-[#D97706]/10 px-2.5 py-0.5 rounded-sm border border-[#D97706]/30">
              Judicial Stay
            </span>
          </div>

          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            {language === 'en'
              ? 'When a civil court grants an injunction or status-quo order, toggling this immediately triggers the judicial stay block across all portals.'
              : 'আদালত কোনো জমিতে স্থিতাবস্থা বা নিষেধাজ্ঞা জারি করলে এটি সক্রিয় করা হয়, যা দলিল রেজিস্ট্রি শতভাগ বন্ধ রাখে।'}
          </p>

          <div className="space-y-2.5">
            {khatians.map(k => (
              <div
                key={k.id}
                className={`p-3.5 rounded-md border text-xs flex items-center justify-between transition-colors ${
                  k.hasCourtCase
                    ? 'bg-[#18181b] border-[#D97706]/50 text-[#f4f4f5]'
                    : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa]'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-sans font-semibold text-[#f4f4f5]">
                    <span className="font-mono tabular-nums">{k.khatianNo} (Dag #{k.dagNo})</span>
                    <span className="text-[10px] text-[#71717a] font-mono">[{k.mouza}]</span>
                  </div>
                  <div className="text-[11px] text-[#a1a1aa]">
                    Owner: <strong className="text-[#f4f4f5] font-sans">{k.ownerName}</strong> (<span className="font-mono tabular-nums">{k.totalAreaDecimals.toFixed(1)} Dec</span>)
                  </div>
                  {k.hasCourtCase && (
                    <div className="text-[10px] font-mono text-[#D97706] font-semibold">
                      Case: {k.courtCaseDetails?.caseNo} ({k.courtCaseDetails?.courtName})
                    </div>
                  )}
                </div>

                <button
                  onClick={() => toggleCourtInjunction(k.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-sans font-semibold text-xs transition-colors cursor-pointer border focus:outline-none shadow-xs ${
                    k.hasCourtCase
                      ? 'bg-[#D97706] hover:bg-[#B45309] text-white border-[#D97706]'
                      : 'bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] border-[#27272a]'
                  }`}
                >
                  {k.hasCourtCase ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Injunction (Lift)' : 'নিষেধাজ্ঞা (প্রত্যাহার)'}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-[#71717a]" />
                      <span>{language === 'en' ? 'Issue Stay' : 'স্টে অর্ডার'}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Government (DC Office) Land Acquisition & Compensation Calculator (Indigo / Slate Theme) */}
      <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-5 text-[#f4f4f5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md border border-[#4F46E5]/40 bg-[#4F46E5]/10 text-[#818CF8] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#818CF8] bg-[#4F46E5]/10 border border-[#4F46E5]/30 px-2.5 py-0.5 rounded-sm">
                Rulebook Section 4 Coverage
              </span>
              <h3 className="font-sans font-semibold text-[#f4f4f5] text-base mt-1">
                {language === 'en' 
                  ? 'Deputy Commissioner (DC Office) Land Acquisition & Compensation Disburser' 
                  : 'জেলা প্রশাসক (ডিসি অফিস) ভূমি অধিগ্রহণ ও ক্ষতিপূরণ বণ্টন ক্যালকুলেটর'}
              </h3>
            </div>
          </div>
          <span className="text-xs bg-[#18181b] text-[#a1a1aa] border border-[#27272a] px-2.5 py-1 rounded-md font-mono">
            Acquisition Act 2017 Sync
          </span>
        </div>

        <p className="text-xs text-[#a1a1aa] max-w-3xl leading-relaxed">
          {language === 'en'
            ? 'Before disbursing crores in national mega-project compensation, the DC Revenue Branch verifies the current owner, deducts bank mortgage liabilities into escrow, and ensures zero payment on double-sold or court-disputed parcels.'
            : 'জাতীয় উন্নয়ন প্রকল্পের ক্ষতিপূরণ প্রদানের পূর্বে ডিসি অফিস প্রকৃত বৈধ মালিক, অবমুক্ত শতাংশ ও ব্যাংক দায় নিশ্চিত করে ক্ষতিপূরণ বিতরণ করে।'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4 text-xs">
            <div>
              <label className="block font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1">
                {language === 'en' ? 'Select Project Parcel (Dag & Khatian):' : 'প্রকল্পের আওতাধীন জমি নির্বাচন:'}
              </label>
              <select
                value={selectedDcPlotId}
                onChange={(e) => {
                  setSelectedDcPlotId(e.target.value);
                  setCompensationDisbursed(false);
                }}
                className="w-full text-xs font-semibold border border-[#27272a] rounded-md px-3 py-2 bg-[#09090b] text-[#f4f4f5] focus:border-[#4F46E5] focus:outline-none"
              >
                {khatians.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.khatianNo} | Dag #{k.dagNo} ({k.mouza}) - {k.ownerName} [{k.totalAreaDecimals.toFixed(1)} Dec]
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Gazette Rate / Dec (BDT):' : 'গেজেট রেট / শতাংশ (টাকা):'}
                </label>
                <input
                  type="number"
                  step="50000"
                  value={acquisitionRate}
                  onChange={(e) => setAcquisitionRate(parseInt(e.target.value) || 0)}
                  className="w-full font-mono font-bold border border-[#27272a] rounded-md px-3 py-2 bg-[#09090b] text-[#f4f4f5] focus:border-[#4F46E5] focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Govt Infrastructure Project:' : 'উন্নয়ন প্রকল্প:'}
                </label>
                <input
                  type="text"
                  readOnly
                  value="Dhaka-Ashulia Expressway (Sec-4)"
                  className="w-full bg-[#18181b] font-sans font-medium border border-[#27272a] rounded-md px-3 py-2 text-[#71717a] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Toggle Acquisition Notice */}
            <div className="pt-2">
              <button
                onClick={() => toggleDcAcquisition(selectedDcPlot.id)}
                className={`w-full py-2.5 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border focus:outline-none shadow-xs ${
                  selectedDcPlot.isAcquired
                    ? 'bg-[#D97706] hover:bg-[#B45309] text-white border-[#D97706]'
                    : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white border-[#4F46E5]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>
                  {selectedDcPlot.isAcquired
                    ? (language === 'en' ? 'Lift DC Acquisition Notice (অধিগ্রহণ প্রত্যাহার)' : 'অধিগ্রহণ নোটিশ প্রত্যাহার')
                    : (language === 'en' ? 'Publish Gazette & Lock Parcel (অধিগ্রহণ গেজেট প্রকাশ)' : 'অধিগ্রহণ নোটিশ জারি করুন')}
                </span>
              </button>
            </div>
          </div>

          {/* Real-Time Compensation Audit & Disbursement Preview */}
          <div className="lg:col-span-6 bg-[#09090b] rounded-lg p-4 border border-[#27272a] text-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between font-sans font-semibold text-[#f4f4f5] border-b border-[#27272a] pb-2">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#d4a657]" />
                <span>{language === 'en' ? 'DC Office Statutory Compensation Audit:' : 'ক্ষতিপূরণ হিসাব ও বরাদ্দ বিবরণী:'}</span>
              </span>
              <span className="text-[10px] bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 px-2.5 py-0.5 rounded-sm font-mono">
                Verified: {selectedDcPlot.ownerName}
              </span>
            </div>

            <div className="space-y-1.5 text-[#a1a1aa]">
              <div className="flex justify-between">
                <span>Total Decimals:</span>
                <span className="font-mono font-bold text-[#f4f4f5]">{selectedDcPlot.totalAreaDecimals.toFixed(2)} Dec</span>
              </div>
              <div className="flex justify-between text-[#D97706]">
                <span>Less Pending Mutation Decimals:</span>
                <span className="font-mono font-bold">-{selectedDcPlot.lockedAreaDecimals.toFixed(2)} Dec</span>
              </div>
              <div className="flex justify-between font-semibold text-[#16A34A] border-t border-[#27272a] pt-1">
                <span>Net Eligible Decimals for Compensation:</span>
                <span className="font-mono">{availableDecimals.toFixed(2)} Dec</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Gross Statutory Value ({availableDecimals.toFixed(2)} × BDT {acquisitionRate.toLocaleString()}):</span>
                <span className="font-mono font-bold text-[#f4f4f5]">BDT {grossCompensation.toLocaleString()}</span>
              </div>

              {selectedDcPlot.isMortgaged ? (
                <div className="flex justify-between bg-[#DC2626]/10 text-[#f87171] p-2.5 rounded-md border border-[#DC2626]/30 font-medium">
                  <span>Less Bank Mortgage Lien (Escrow to {selectedDcPlot.mortgageDetails?.bankName}):</span>
                  <span className="font-mono font-bold">-BDT {bankDeduction.toLocaleString()}</span>
                </div>
              ) : null}

              <div className="flex justify-between font-bold text-[#f4f4f5] text-sm border-t border-[#27272a] pt-2">
                <span>Net Payable to Registered Owner:</span>
                <span className="font-mono text-[#16A34A]">BDT {netPayableToOwner.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCompensationDisbursed(true)}
                disabled={compensationDisbursed || selectedDcPlot.hasCourtCase}
                className={`w-full py-2.5 px-3 rounded-md text-xs font-semibold transition-colors border focus:outline-none shadow-xs ${
                  selectedDcPlot.hasCourtCase
                    ? 'bg-[#18181b] text-[#D97706] border-[#D97706]/40 cursor-not-allowed'
                    : compensationDisbursed
                      ? 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30 cursor-default'
                      : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white border-[#4F46E5] cursor-pointer'
                }`}
              >
                {selectedDcPlot.hasCourtCase ? (
                  <span>❌ DISBURSEMENT BLOCKED BY CIVIL COURT INJUNCTION</span>
                ) : compensationDisbursed ? (
                  <span>✓ Statutory Compensation Disbursed via Bangladesh Bank EFT</span>
                ) : (
                  <span>Disburse Compensation via Electronic Fund Transfer (EFT)</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankCourtGovView;
