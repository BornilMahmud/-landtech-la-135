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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-800/60 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30 mb-2">
              <Landmark className="w-3.5 h-3.5 text-indigo-300" />
              <span>{language === 'en' ? 'Judiciary, Central Bank & DC Office Integration' : 'আদালত, বাংলাদেশ ব্যাংক ও জেলা প্রশাসক ইন্টিগ্রেশন'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'en' 
                ? 'Bank, Judiciary & DC Office Statutory Lock Panel' 
                : 'ব্যাংক, আদালত ও ডিসি অফিস সংবিধিবদ্ধ লক প্যানেল'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {language === 'en'
                ? 'Judges can toggle mortgage liens, court injunctions, and DC land acquisitions in real time to see how Sub-Registry automatically blocks fraud.'
                : 'বিচারকমণ্ডলী যেকোনো জমির বন্ধক, নিষেধাজ্ঞা বা ডিসি অধিগ্রহণ অন/অফ করে সাথে সাথে সাব-রেজিস্ট্রির ব্লকিং অ্যালগরিদম পরীক্ষা করতে পারেন।'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-xs text-center shrink-0">
            <span className="block text-[10px] text-indigo-300 uppercase font-bold">{language === 'en' ? 'Live Consensus Status' : 'কনসেনসাস স্থিতি'}</span>
            <span className="text-sm font-black text-white flex items-center justify-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Bi-Directional Lock</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Bank & Court Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Bank Mortgage Lien Controller */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-ambient border border-slate-200/90 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {language === 'en' ? 'Financial Institutions & Bank Mortgage Liens' : 'তফসিলি ব্যাংক ও আর্থিক প্রতিষ্ঠান বন্ধকী লক'}
                </h3>
                <p className="text-[11px] text-slate-500">CIB / Credit Information Bureau sync</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Secured Loans
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'en'
              ? 'When a bank sanctions a loan against land, the mortgage is placed here. Any attempted sale in the Sub-Registry is immediately blocked.'
              : 'জমির বিপরীতে ব্যাংক ঋণ প্রদান করলে এখানে বন্ধক সক্রিয় হয়। সাব-রেজিস্ট্রিতে বিক্রির চেষ্টা হলে তা সাথে সাথে আটকে দেওয়া হয়।'}
          </p>

          <div className="space-y-3">
            {khatians.map(k => (
              <div
                key={k.id}
                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  k.isMortgaged
                    ? 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-sm ring-1 ring-rose-400'
                    : 'bg-slate-50/80 border-slate-200 text-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="font-mono tabular-nums">{k.khatianNo} (Dag #{k.dagNo})</span>
                    <span className="text-[10px] text-slate-500 font-normal">[{k.mouza}]</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Owner: <strong>{k.ownerName}</strong> (<span className="font-mono tabular-nums">{k.totalAreaDecimals.toFixed(1)} Dec</span>)
                  </div>
                  {k.isMortgaged && (
                    <div className="text-[10px] font-mono text-rose-700 font-bold tabular-nums">
                      Lien: {k.mortgageDetails?.bankName} (Acct: {k.mortgageDetails?.loanAccount})
                    </div>
                  )}
                </div>

                <button
                  onClick={() => toggleBankMortgage(k.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm transition-all ${
                    k.isMortgaged
                      ? 'bg-red-600 hover:bg-red-700 text-white ring-1 ring-red-400'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {k.isMortgaged ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Locked (Release)' : 'লককৃত (মুছে ফেলুন)'}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'en' ? 'Place Lien' : 'বন্ধক দিন'}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Judiciary & Civil Court Injunction Controller */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-ambient border border-slate-200/90 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {language === 'en' ? 'Civil Judiciary & Stay Order Injunctions' : 'আদালত নিষেধাজ্ঞা ও দেওয়ানী মামলা প্যানেল'}
                </h3>
                <p className="text-[11px] text-slate-500">Order 39 Rule 1 CPC / Title Suits</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              High Court / Dist. Court
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'en'
              ? 'When a civil court grants an injunction or status-quo order, toggling this immediately triggers the judicial stay block across all portals.'
              : 'আদালত কোনো জমিতে স্থিতাবস্থা বা নিষেধাজ্ঞা জারি করলে এটি সক্রিয় করা হয়, যা দলিল রেজিস্ট্রি শতভাগ বন্ধ রাখে।'}
          </p>

          <div className="space-y-3">
            {khatians.map(k => (
              <div
                key={k.id}
                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  k.hasCourtCase
                    ? 'bg-purple-50/90 border-purple-300 text-purple-950 shadow-sm ring-1 ring-purple-400'
                    : 'bg-slate-50/80 border-slate-200 text-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="font-mono tabular-nums">{k.khatianNo} (Dag #{k.dagNo})</span>
                    <span className="text-[10px] text-slate-500 font-normal">[{k.mouza}]</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Owner: <strong>{k.ownerName}</strong> (<span className="font-mono tabular-nums">{k.totalAreaDecimals.toFixed(1)} Dec</span>)
                  </div>
                  {k.hasCourtCase && (
                    <div className="text-[10px] font-mono text-purple-800 font-bold">
                      Case: {k.courtCaseDetails?.caseNo} ({k.courtCaseDetails?.courtName})
                    </div>
                  )}
                </div>

                <button
                  onClick={() => toggleCourtInjunction(k.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm transition-all ${
                    k.hasCourtCase
                      ? 'bg-purple-800 hover:bg-purple-900 text-white ring-1 ring-purple-400'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {k.hasCourtCase ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Injunction (Lift)' : 'নিষেধাজ্ঞা (প্রত্যাহার)'}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'en' ? 'Issue Stay' : 'স্টে অর্ডার'}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase 2 Upgrade 3: DC Office Land Acquisition & Compensation Calculator (Rulebook Section 4) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Rulebook Section 4 Coverage
              </span>
              <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                {language === 'en' 
                  ? 'Deputy Commissioner (DC Office) Land Acquisition & Compensation Disburser' 
                  : 'জেলা প্রশাসক (ডিসি অফিস) ভূমি অধিগ্রহণ ও ক্ষতিপূরণ বণ্টন ক্যালকুলেটর'}
              </h3>
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono">
            Acquisition Act 2017 Sync
          </span>
        </div>

        <p className="text-xs text-slate-600 max-w-3xl">
          {language === 'en'
            ? 'Before disbursing crores in national mega-project compensation, the DC Revenue Branch verifies the current owner, deducts bank mortgage liabilities into escrow, and ensures zero payment on double-sold or court-disputed parcels.'
            : 'জাতীয় উন্নয়ন প্রকল্পের ক্ষতিপূরণ প্রদানের পূর্বে ডিসি অফিস প্রকৃত বৈধ মালিক, অবমুক্ত শতাংশ ও ব্যাংক দায় নিশ্চিত করে ক্ষতিপূরণ বিতরণ করে।'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'en' ? 'Select Project Parcel (Dag & Khatian):' : 'প্রকল্পের আওতাধীন জমি নির্বাচন:'}
              </label>
              <select
                value={selectedDcPlotId}
                onChange={(e) => {
                  setSelectedDcPlotId(e.target.value);
                  setCompensationDisbursed(false);
                }}
                className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Gazette Rate / Dec (BDT):' : 'গেজেট রেট / শতাংশ (টাকা):'}
                </label>
                <input
                  type="number"
                  step="50000"
                  value={acquisitionRate}
                  onChange={(e) => setAcquisitionRate(parseInt(e.target.value) || 0)}
                  className="w-full font-mono font-bold border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Govt Infrastructure Project:' : 'উন্নয়ন প্রকল্প:'}
                </label>
                <input
                  type="text"
                  readOnly
                  value="Dhaka-Ashulia Expressway (Sec-4)"
                  className="w-full bg-slate-100 font-semibold border border-slate-200 rounded-xl px-3 py-2 text-slate-700 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Toggle Acquisition Notice */}
            <div className="pt-2">
              <button
                onClick={() => toggleDcAcquisition(selectedDcPlot.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedDcPlot.isAcquired
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
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
          <div className="lg:col-span-6 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-800 border-b pb-2">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-700" />
                <span>{language === 'en' ? 'DC Office Statutory Compensation Audit:' : 'ক্ষতিপূরণ হিসাব ও বরাদ্দ বিবরণী:'}</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                Verified Owner: {selectedDcPlot.ownerName}
              </span>
            </div>

            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Total Decimals:</span>
                <span className="font-mono font-bold text-slate-900">{selectedDcPlot.totalAreaDecimals.toFixed(2)} Dec</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Less Pending Mutation Decimals:</span>
                <span className="font-mono font-bold">-{selectedDcPlot.lockedAreaDecimals.toFixed(2)} Dec</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-800 border-t pt-1">
                <span>Net Eligible Decimals for Compensation:</span>
                <span className="font-mono">{availableDecimals.toFixed(2)} Dec</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Gross Statutory Value ({availableDecimals.toFixed(2)} × BDT {acquisitionRate.toLocaleString()}):</span>
                <span className="font-mono font-bold text-slate-900">BDT {grossCompensation.toLocaleString()}</span>
              </div>

              {selectedDcPlot.isMortgaged ? (
                <div className="flex justify-between bg-red-50 text-red-800 p-2 rounded border border-red-200 font-medium">
                  <span>Less Bank Mortgage Lien (Escrow to {selectedDcPlot.mortgageDetails?.bankName}):</span>
                  <span className="font-mono font-bold">-BDT {bankDeduction.toLocaleString()}</span>
                </div>
              ) : null}

              <div className="flex justify-between font-black text-slate-950 text-sm border-t border-slate-300 pt-2">
                <span>Net Payable to Registered Owner:</span>
                <span className="font-mono text-emerald-700">BDT {netPayableToOwner.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCompensationDisbursed(true)}
                disabled={compensationDisbursed || selectedDcPlot.hasCourtCase}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedDcPlot.hasCourtCase
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : compensationDisbursed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm'
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
