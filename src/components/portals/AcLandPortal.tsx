'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Printer, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  Scissors, 
  Check, 
  XCircle, 
  ArrowRight, 
  AlertTriangle, 
  SendHorizontal, 
  AlertOctagon, 
  Timer 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { MutationCase } from '@/lib/types';
import { t } from '@/lib/i18n';
import { toDec, formatDec } from '@/lib/crypto-utils';

export const AcLandPortal: React.FC = () => {
  const { 
    mutations, 
    khatians, 
    citizens, 
    verifyTahsilReport, 
    approveMutationAndSplitKhatian, 
    rejectMutation, 
    simulateSlaDelay, 
    setActivePorcha, 
    setActiveLtNotice, 
    language 
  } = useLandRegistry();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(mutations[0]?.id || '');
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isApproving, setIsApproving] = useState<boolean>(false);

  const selectedCase = mutations.find(m => m.id === selectedCaseId) || mutations[0];

  const filteredMutations = mutations.filter(m => {
    const matchesFilter = 
      filterStage === 'ALL' ||
      (filterStage === 'PENDING_TAHSIL' && m.stage === 'STAGE_3_AUTO_SENT_TO_AC_LAND') ||
      (filterStage === 'READY_APPROVAL' && m.stage === 'STAGE_4_TAHSIL_VERIFIED') ||
      (filterStage === 'COMPLETED' && m.stage === 'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED');

    const matchesSearch = 
      m.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.deedNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sourceKhatianNo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const parentKhatian = selectedCase ? khatians.find(k => k.id === selectedCase.sourceKhatianId || k.khatianNo === selectedCase.sourceKhatianNo) : null;
  const seller = selectedCase ? citizens.find(c => c.id === selectedCase.sellerId) : null;
  const buyer = selectedCase ? citizens.find(c => c.id === selectedCase.buyerId) : null;

  const handleApprove = async (mutationId: string) => {
    setIsApproving(true);
    await approveMutationAndSplitKhatian(mutationId);
    setIsApproving(false);
  };

  const handleReject = (mutationId: string) => {
    const reason = prompt(
      language === 'en' 
        ? 'Enter grounds for legal rejection (e.g. Inconsistent field possession report):' 
        : 'খারিজের সুনির্দিষ্ট আইনগত কারণ লিখুন:'
    );
    if (reason) {
      rejectMutation(mutationId, reason);
    }
  };

  const isEscalated = selectedCase?.escalationStatus === 'ESCALATED_TO_ADC_REVENUE';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-800/60 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600/30">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t(language, 'roleAcLand')}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight mt-1">
              {t(language, 'acLandTitle')}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {t(language, 'acLandSubtitle')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-xs text-center shrink-0">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">
              SAT Act 1950 • Section 117 / 143
            </span>
            <span className="text-xs font-mono font-black text-white mt-0.5 block">
              Automated Jomabhag Ledger Splitting
            </span>
          </div>
        </div>
      </div>

      {/* Queue Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setFilterStage('ALL')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              filterStage === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t(language, 'filterAll')} ({mutations.length})
          </button>
          <button
            onClick={() => setFilterStage('PENDING_TAHSIL')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              filterStage === 'PENDING_TAHSIL' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t(language, 'filterPendingTahsil')}
          </button>
          <button
            onClick={() => setFilterStage('READY_APPROVAL')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              filterStage === 'READY_APPROVAL' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t(language, 'filterReadyApproval')}
          </button>
          <button
            onClick={() => setFilterStage('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              filterStage === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t(language, 'filterCompleted')}
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(language, 'searchCasePlaceholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Main Grid: Cases Queue (5 cols) & Active Case Detailed Ledger (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'en' ? 'Incoming Case Queue' : 'অপেক্ষমান নামজারি মামলা তালিকা'}
          </span>

          {filteredMutations.map((m) => {
            const isSelected = m.id === selectedCase?.id;
            const isCompleted = m.stage === 'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED';
            const isTahsilDone = m.stage === 'STAGE_4_TAHSIL_VERIFIED';
            const hasSlaEscalation = m.escalationStatus === 'ESCALATED_TO_ADC_REVENUE';

            return (
              <div
                key={m.id}
                onClick={() => setSelectedCaseId(m.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  hasSlaEscalation
                    ? 'border-rose-400 bg-rose-50/70 shadow-sm ring-1 ring-rose-300'
                    : isSelected 
                      ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20' 
                      : 'bg-white/80 hover:bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-slate-900">
                    {m.trackingId}
                  </span>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                    hasSlaEscalation
                      ? 'bg-rose-600 text-white animate-pulse'
                      : isCompleted 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isTahsilDone 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                  }`}>
                    {hasSlaEscalation ? 'SLA ESCALATED (DAY 8)' : isCompleted ? 'APPROVED & SPLIT' : isTahsilDone ? 'TAHSIL VERIFIED' : 'NEW AUTO-PUSH'}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Deed No:' : 'দলিল:'}</span>
                    <span className="font-mono font-bold text-slate-800">{m.deedNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Transfer Decimals:' : 'হস্তান্তরিত জমি:'}</span>
                    <span className="font-mono font-black text-emerald-800">{formatDec(m.transferAreaDecimals)} Dec</span>
                  </div>
                </div>

                {/* Module 6: SLA Badge */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Timer className="w-3 h-3 text-emerald-600" />
                    <span>SLA: Day {m.daysElapsed} of {m.slaTargetDays} (Max: {m.statutoryMaxDays}d)</span>
                  </span>
                  <span className={`font-bold ${hasSlaEscalation ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {hasSlaEscalation ? 'BREACHED' : 'ON TRACK'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Case Details & Jomabhag Split Engine */}
        <div className="lg:col-span-7 space-y-5">
          {selectedCase && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-ambient space-y-6">
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-base text-slate-900">
                      Case #{selectedCase.trackingId}
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                      Linked: {selectedCase.deedNo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Parent Khatian: {selectedCase.sourceKhatianNo} • Dag #{selectedCase.dagNo} • {parentKhatian?.mouzaEn}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Module 3: View Digital LT Notice */}
                  {selectedCase.ltNotice && (
                    <button
                      onClick={() => setActiveLtNotice(selectedCase.ltNotice || null)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm transition-all"
                    >
                      <SendHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t(language, 'viewLtNoticeBtn')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Module 6: SLA Auto-Escalation Banner (If breached) */}
              {isEscalated && (
                <div className="p-4 bg-rose-950 text-white rounded-2xl border border-rose-800 flex items-start gap-3 shadow-alertGlow animate-shake">
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-xs text-rose-300 uppercase">
                      {t(language, 'slaEscalatedAlert')}
                    </h4>
                    <p className="text-[11px] text-rose-200/90 mt-0.5 leading-relaxed">
                      Anti-Harassment Accountability Triggered: Case auto-forwarded to Deputy Commissioner (DC) grievance monitoring portal. Official explanation required within 48 hours.
                    </p>
                  </div>
                </div>
              )}

              {/* Visual Jomabhag (জমাভাগ) Split Preview (Before vs. After) */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-slate-800 block uppercase tracking-wider font-mono">
                  {t(language, 'khatianSplitPreview')}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Box (Current Parent) */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-sm">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-slate-500 uppercase">{t(language, 'parentKhatian')}</span>
                      <span className="font-mono font-black text-slate-900">{selectedCase.sourceKhatianNo}</span>
                    </div>
                    <div className="text-xs font-black text-slate-800">{seller?.nameEn}</div>
                    <div className="flex justify-between text-[11px] font-mono pt-1 border-t border-slate-100">
                      <span>Total Decimals:</span>
                      <span className="font-bold">{parentKhatian ? formatDec(parentKhatian.totalAreaDecimals) : '0.00'} Dec</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-amber-700">
                      <span>Locked for Split:</span>
                      <span className="font-bold">{formatDec(selectedCase.transferAreaDecimals)} Dec</span>
                    </div>
                  </div>

                  {/* After Box (Resulting Jomabhag Split) */}
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-1.5 shadow-sm">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-emerald-800 uppercase">{t(language, 'buyerNewKhatian')}</span>
                      <span className="font-mono font-black text-emerald-950">
                        {selectedCase.issuedNewKhatianNo || `${selectedCase.sourceKhatianNo}/A`}
                      </span>
                    </div>
                    <div className="text-xs font-black text-emerald-950">{buyer?.nameEn}</div>
                    <div className="flex justify-between text-[11px] font-mono pt-1 border-t border-emerald-200/60 text-emerald-900">
                      <span>Buyer Issued Area:</span>
                      <span className="font-black">{formatDec(selectedCase.transferAreaDecimals)} Dec</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-600">
                      <span>Seller Retains:</span>
                      <span className="font-bold">
                        {parentKhatian ? formatDec(toDec(parentKhatian.totalAreaDecimals - selectedCase.transferAreaDecimals)) : '3.00'} Dec
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700 pt-1 border-t border-emerald-200/40">
                      Holding #{selectedCase.holdingNo || `HOLD-2026-${selectedCase.dagNo}/A`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tahsil Field Ground Report Note */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Union Land Assistant Officer (Tahsil) Inquiry & Dakhila Status:
                </span>
                <p className="text-slate-700 leading-relaxed italic">
                  "{language === 'en' ? selectedCase.tahsilReportNoteEn : selectedCase.tahsilReportNoteBn}"
                </p>
                <div className="text-[11px] font-mono text-emerald-800 font-bold pt-1">
                  Dakhila #{selectedCase.dakhilaReceiptNo} • Land Development Tax 100% Cleared
                </div>
              </div>

              {/* Officer Action Buttons & SLA Delay Simulation */}
              <div className="space-y-3 pt-2">
                {selectedCase.stage === 'STAGE_3_AUTO_SENT_TO_AC_LAND' && (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => verifyTahsilReport(selectedCase.id)}
                      className="flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t(language, 'verifyTahsilBtn')}</span>
                    </button>

                    {/* Module 6: Judge Demo Button for 8-Day SLA Delay */}
                    <button
                      onClick={() => simulateSlaDelay(selectedCase.id)}
                      className="py-3.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-2xl font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
                      title="Simulate delay to test anti-harassment escalation"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t(language, 'simulateDelayBtn')}</span>
                    </button>
                  </div>
                )}

                {selectedCase.stage === 'STAGE_4_TAHSIL_VERIFIED' && (
                  <button
                    onClick={() => handleApprove(selectedCase.id)}
                    disabled={isApproving}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 text-white rounded-2xl font-black text-sm shadow-card hover:shadow-glow transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{t(language, 'approveSplitBtn')}</span>
                  </button>
                )}

                {selectedCase.stage === 'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED' && (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'en' ? 'Jomabhag Finalized & Digital Khatian Issued' : 'জমাভাগ সম্পন্ন ও নতুন খতিয়ান সৃজিত'}</span>
                    </div>
                    <button
                      onClick={() => {
                        const newK = khatians.find(k => k.khatianNo === selectedCase.issuedNewKhatianNo);
                        if (newK) setActivePorcha({ khatian: newK, mutationId: selectedCase.trackingId });
                      }}
                      className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4 text-emerald-400" />
                      <span>{t(language, 'viewPorchaBtn')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
