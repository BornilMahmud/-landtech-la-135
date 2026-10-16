'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  User, 
  Layers, 
  Sparkles, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  AlertTriangle,
  FileCheck,
  Search,
  Check,
  XCircle,
  Scissors,
  Hourglass,
  QrCode
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { MutationCase, MutationStatus } from '@/types';

export const AcLandView: React.FC = () => {
  const { 
    mutations, 
    verifyTahsilReport, 
    approveMutation, 
    rejectMutation, 
    setActivePorcha, 
    khatians, 
    language,
    simulateSlaDelay,
    setActiveLtNotice,
    setLineageModalKhatian
  } = useLandApp();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    mutations[0]?.id || ''
  );
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const selectedCase = mutations.find(m => m.id === selectedCaseId) || mutations[0];

  const filteredMutations = mutations.filter(m => {
    const matchesFilter = filterStatus === 'ALL' || m.status === filterStatus;
    const matchesSearch = 
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.deedNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = async (caseId: string) => {
    setIsApproving(true);
    await approveMutation(caseId);
    setIsApproving(false);
  };

  const handleReject = (caseId: string) => {
    const reason = prompt(
      language === 'en' 
        ? 'Enter legal grounds for rejection (e.g. Disputed physical possession in Tahsil inquiry):' 
        : 'খারিজের সুনির্দিষ্ট আইনগত কারণ লিখুন:'
    );
    if (reason) {
      rejectMutation(caseId, reason);
    }
  };

  // Find linked newly created Khatian if already approved
  const linkedNewKhatian = selectedCase?.newKhatianNo 
    ? khatians.find(k => k.khatianNo === selectedCase.newKhatianNo)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner / Secretariat Heading */}
      <div className="bg-[#121215] text-[#f4f4f5] rounded-lg p-5 sm:p-6 border border-[#27272a] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#18181b] text-[#16A34A] text-xs font-mono font-semibold px-2.5 py-0.5 rounded-sm border border-[#16A34A]/30 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Ministry of Land — AC Land Secretariat' : 'ভূমি মন্ত্রণালয় — সহকারী কমিশনার (ভূমি) কার্যালয়'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#f4f4f5]">
              {language === 'en' 
                ? 'AC Land Office: Automated e-Mutation Queue & Ledger Engine' 
                : 'এসি ল্যান্ড অফিস: স্বয়ংক্রিয় ই-নামজারি কিউ ও খতিয়ান বণ্টন'}
            </h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Zero-touch citizen processing: Cases automatically arrive from Sub-Registry with pre-locked decimals and SHA-256 deed signatures.'
                : 'জিরো-টাচ নাগরিক সেবা: সাব-রেজিস্ট্রির দলিল নিবন্ধনের সাথে সাথে জমি লক হয়ে স্বয়ংক্রিয়ভাবে এসি ল্যান্ডের কিউতে উপস্থাপিত হয়।'}
            </p>
          </div>

          <div className="bg-[#18181b] rounded-md p-3 border border-[#27272a] text-xs shrink-0 flex items-center gap-3">
            <div className="text-center px-2">
              <span className="block text-[10px] text-[#71717a] uppercase font-mono font-semibold">{language === 'en' ? 'Live Queue' : 'মোট কেস'}</span>
              <span className="text-xl font-bold text-[#f4f4f5] font-mono tabular-nums">{mutations.length}</span>
            </div>
            <div className="h-8 w-px bg-[#27272a]" />
            <div className="text-center px-2">
              <span className="block text-[10px] text-[#D97706] uppercase font-mono font-semibold">{language === 'en' ? 'Pending' : 'অপেক্ষমান'}</span>
              <span className="text-xl font-bold text-[#D97706] font-mono tabular-nums">
                {mutations.filter(m => m.status === 'AUTO_INITIATED').length}
              </span>
            </div>
            <div className="h-8 w-px bg-[#27272a]" />
            <div className="text-center px-2">
              <span className="block text-[10px] text-[#16A34A] uppercase font-mono font-semibold">{language === 'en' ? 'Approved' : 'অনুমোদিত'}</span>
              <span className="text-xl font-bold text-[#16A34A] font-mono tabular-nums">
                {mutations.filter(m => m.status === 'MUTATION_APPROVED').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Incoming Queue List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#121215] rounded-lg p-4 sm:p-5 border border-[#27272a] space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="font-sans font-semibold text-[#f4f4f5] text-sm">
                {language === 'en' ? 'Incoming e-Mutation Feed' : 'আগত ই-নামজারি তালিকা'}
              </h3>
              <span className="text-xs bg-[#18181b] text-[#16A34A] font-mono font-semibold px-2 py-0.5 rounded-sm border border-[#16A34A]/30">
                {filteredMutations.length} {language === 'en' ? 'Cases' : 'টি মামলা'}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-3" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search by Tracking ID, Deed No, Buyer...' : 'ট্র্যাকিং আইডি বা নাম দিয়ে খুঁজুন...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-[#27272a] bg-[#09090b] text-[#f4f4f5] placeholder-[#71717a] rounded-md focus:border-[#d4a657] focus:outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-sans">
              {[
                { id: 'ALL', labelEn: 'All', labelBn: 'সকল' },
                { id: 'AUTO_INITIATED', labelEn: 'Auto-Triggered', labelBn: 'নতুন আগত' },
                { id: 'TAHSIL_VERIFIED', labelEn: 'Tahsil Done', labelBn: 'তহশিল রিপোর্ট' },
                { id: 'MUTATION_APPROVED', labelEn: 'Approved', labelBn: 'অনুমোদিত' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer text-xs focus:outline-none ${
                    filterStatus === f.id
                      ? 'bg-[#d4a657] text-[#09090b] font-semibold'
                      : 'bg-[#18181b] text-[#a1a1aa] hover:bg-[#27272a] hover:text-[#f4f4f5]'
                  }`}
                >
                  {language === 'en' ? f.labelEn : f.labelBn}
                </button>
              ))}
            </div>

            {/* Queue List Cards */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredMutations.length === 0 ? (
                <div className="text-center py-8 text-[#71717a] text-xs">
                  {language === 'en' ? 'No e-Mutation cases found.' : 'কোনো নামজারি মামলা পাওয়া যায়নি।'}
                </div>
              ) : (
                filteredMutations.map(m => {
                  const isSelected = selectedCase?.id === m.id;
                  let statusBadge = (
                    <span className="text-[10px] font-mono font-semibold bg-[#D97706]/10 text-[#D97706] px-2 py-0.5 rounded-sm border border-[#D97706]/30">
                      {language === 'en' ? 'Auto-Initiated' : 'স্বয়ংক্রিয় আগত'}
                    </span>
                  );
                  if (m.status === 'TAHSIL_VERIFIED') {
                    statusBadge = (
                      <span className="text-[10px] font-mono font-semibold bg-[#2563EB]/10 text-[#60A5FA] px-2 py-0.5 rounded-sm border border-[#2563EB]/30">
                        {language === 'en' ? 'Tahsil Verified' : 'তহশিল রিপোর্ট সম্পন্ন'}
                      </span>
                    );
                  } else if (m.status === 'MUTATION_APPROVED') {
                    statusBadge = (
                      <span className="text-[10px] font-mono font-semibold bg-[#16A34A]/10 text-[#16A34A] px-2 py-0.5 rounded-sm flex items-center gap-1 border border-[#16A34A]/30">
                        <Check className="w-3 h-3" />
                        {language === 'en' ? 'Approved & Split' : 'অনুমোদিত ও কর্তনকৃত'}
                      </span>
                    );
                  } else if (m.status === 'REJECTED') {
                    statusBadge = (
                      <span className="text-[10px] font-mono font-semibold bg-[#DC2626]/10 text-[#f87171] px-2 py-0.5 rounded-sm border border-[#DC2626]/30">
                        {language === 'en' ? 'Rejected' : 'বাতিল'}
                      </span>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedCaseId(m.id)}
                      className={`p-3.5 rounded-md border cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-[#d4a657] bg-[#18181b]'
                          : 'border-[#27272a] bg-[#09090b] hover:border-[#3f3f46] hover:bg-[#18181b]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-xs text-[#f4f4f5] tabular-nums">{m.id}</span>
                        {statusBadge}
                      </div>

                      <div className="text-xs text-[#a1a1aa] space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span>{language === 'en' ? 'Deed Ref:' : 'দলিল নং:'} <strong className="text-[#f4f4f5] font-mono tabular-nums">{m.deedNo}</strong></span>
                          <span className="font-bold text-[#16A34A] font-mono tabular-nums">{m.transferAreaDecimals.toFixed(2)} Dec</span>
                        </div>
                        <div className="text-[11px] text-[#a1a1aa] truncate">
                          {m.sellerName} ➔ <strong className="text-[#f4f4f5]">{m.buyerName}</strong>
                        </div>
                        <div className="text-[10px] text-[#71717a] font-mono">
                          {m.mouza} • Dag #{m.dagNo} • Khatian {m.parentKhatianNo}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Case Inspection Card & Automated Khatian Splitting (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCase ? (
            <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-6 shadow-xs">
              {/* Header with Case Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-[#f4f4f5] tabular-nums">{selectedCase.id}</span>
                    <span className="text-[11px] font-mono font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-0.5 rounded-sm border border-[#16A34A]/30">
                      Sub-Registry Linked
                    </span>
                  </div>
                  <p className="text-xs text-[#71717a] mt-0.5 font-mono">
                    {language === 'en' ? 'Initiated on:' : 'আবেদনের সময়:'} {selectedCase.autoInitiatedAt.split('T')[0]} • {selectedCase.mouza} Mouza
                  </p>
                </div>

                {/* Action & Status indicators */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCase.ltNotice && (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCase.ltNotice) setActiveLtNotice(selectedCase.ltNotice);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-md text-xs font-semibold border border-amber-500/30 transition-colors cursor-pointer shadow-xs focus:outline-none"
                      title="Inspect Section 89 Digital LT Notice"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'en' ? 'Section 89 LT Notice' : 'এলটি নোটিশ'}</span>
                    </button>
                  )}

                  {selectedCase.status === 'MUTATION_APPROVED' ? (
                    <button
                      onClick={() => {
                        if (linkedNewKhatian) {
                          setActivePorcha({ khatian: linkedNewKhatian, mutationId: selectedCase.id });
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-xs focus:outline-none"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'View Official Porcha' : 'ডিজিটাল পর্চা দেখুন'}</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#D97706] bg-[#D97706]/10 px-2.5 py-1 rounded-sm border border-[#D97706]/30">
                      <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{language === 'en' ? 'Pending Approval' : 'অনুমোদন প্রক্রিয়াধীন'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 7-Day Fast-Track SLA Telemetry & Delay Simulator */}
              <div className="bg-[#18181b] p-3.5 rounded-md border border-[#27272a] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Hourglass className="w-4 h-4 text-[#d4a657]" />
                    <span className="font-semibold text-[#f4f4f5]">
                      {language === 'en' ? '7-Day Fast-Track SLA Status:' : '৭-দিনের ফাস্ট-ট্র্যাক এসএলএ স্থিতি:'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      selectedCase.slaStatus === 'BREACHED' || selectedCase.slaStatus === 'ESCALATED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : selectedCase.slaStatus === 'AT_RISK'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {selectedCase.slaStatus || 'ON_TRACK'} ({language === 'en' ? `${selectedCase.slaDaysRemaining ?? 5}d Left` : `${selectedCase.slaDaysRemaining ?? 5} দিন বাকি`})
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa]">
                    {selectedCase.slaStatus === 'ESCALATED' 
                      ? (language === 'en' ? '⚠️ Case exceeded 7-day SLA! Auto-escalated to Additional Deputy Commissioner (ADC Revenue).' : '⚠️ ৭ দিনের সময়সীমা অতিক্রান্ত! অতিরিক্ত জেলা প্রশাসক (রাজস্ব) বরাবর স্বয়ংক্রিয় এস্কেলেশন কার্যকর হয়েছে।')
                      : (language === 'en' ? 'Direct citizen grievance escalation if unprocessed within 7 business days.' : '৭ কার্যদিবসের মধ্যে নামজারি সম্পন্ন না হলে স্বয়ংক্রিয়ভাবে জেলা রাজস্ব আদালতে স্থানান্তরিত হয়।')}
                  </p>
                </div>

                {selectedCase.status !== 'MUTATION_APPROVED' && (
                  <button
                    type="button"
                    onClick={() => simulateSlaDelay(selectedCase.id)}
                    className="px-2.5 py-1.5 rounded bg-[#09090b] hover:bg-[#27272a] text-amber-300 border border-amber-500/30 text-xs font-mono shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Simulate delay beyond 7-day SLA to test automatic institutional escalation to ADC Revenue"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'en' ? 'Simulate 8-Day Delay' : '৮-দিনের বিলম্ব অনুকরণ'}</span>
                  </button>
                )}
              </div>

              {/* Transfer Details Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#18181b] rounded-md border border-[#27272a] space-y-2">
                  <span className="font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider text-[10px] block">
                    {language === 'en' ? 'Parent Land Record (দাতা)' : 'মূল খতিয়ান ও রেকর্ড (দাতা)'}
                  </span>
                  <div>
                    <span className="text-[#71717a] block text-[11px]">Seller (দাতা):</span>
                    <span className="font-sans font-semibold text-[#f4f4f5] text-sm">{selectedCase.sellerName}</span>
                    <span className="block font-mono text-[10px] text-[#71717a]">{selectedCase.sellerNid}</span>
                  </div>
                  <div className="pt-1.5 border-t border-[#27272a] text-[11px]">
                    <span className="text-[#71717a]">Parent Khatian:</span> <strong className="font-mono text-[#f4f4f5]">{selectedCase.parentKhatianNo}</strong>
                    <br />
                    <span className="text-[#71717a]">Dag (Plot):</span> <strong className="font-mono text-[#f4f4f5]">#{selectedCase.dagNo}</strong>
                  </div>
                </div>

                <div className="p-4 bg-[#18181b] rounded-md border border-[#16A34A]/30 space-y-2">
                  <span className="font-mono font-semibold text-[#16A34A] uppercase tracking-wider text-[10px] block">
                    {language === 'en' ? 'Buyer & Mutated Parcel (গ্রহীতা)' : 'নামজারি প্রস্তাবিত গ্রহীতা'}
                  </span>
                  <div>
                    <span className="text-[#a1a1aa] block text-[11px]">Buyer (গ্রহীতা):</span>
                    <span className="font-sans font-semibold text-[#f4f4f5] text-sm">{selectedCase.buyerName}</span>
                    <span className="block font-mono text-[10px] text-[#a1a1aa]">{selectedCase.buyerNid}</span>
                  </div>
                  <div className="pt-1.5 border-t border-[#16A34A]/20 text-[11px]">
                    <span className="text-[#a1a1aa]">Mutated Area:</span> <strong className="text-[#16A34A] font-bold font-mono">{selectedCase.transferAreaDecimals.toFixed(2)} Decimals</strong>
                    <br />
                    <span className="text-[#a1a1aa]">Linked Deed:</span> <strong className="font-mono text-[#f4f4f5]">{selectedCase.deedNo}</strong>
                  </div>
                </div>
              </div>

              {/* 5-Stage Visual Workflow Stepper */}
              <div className="space-y-3">
                <h4 className="font-sans font-semibold text-[#f4f4f5] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#d4a657]" />
                  <span>{language === 'en' ? '5-Stage Digital Mutation Progress Tracker:' : '৫-স্তরের ডিজিটাল নামজারি অগ্রগতি:'}</span>
                </h4>

                <div className="space-y-2">
                  {selectedCase.workflowSteps.map(step => (
                    <div
                      key={step.step}
                      className={`p-3 rounded-md border text-xs flex items-start gap-3 transition-colors ${
                        step.completed
                          ? 'bg-[#18181b] border-[#16A34A]/40 text-[#f4f4f5]'
                          : 'bg-[#09090b] border-[#27272a] text-[#71717a]'
                      }`}
                    >
                      <div className="mt-0.5">
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-[#3f3f46]" />
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-sans font-semibold text-[#f4f4f5]">
                            {step.step}. {language === 'en' ? step.nameEn : step.nameBn}
                          </span>
                          {step.timestamp && (
                            <span className="text-[10px] font-mono text-[#71717a]">{step.timestamp}</span>
                          )}
                        </div>
                        {step.note && (
                          <p className="text-[11px] text-[#a1a1aa] leading-snug">{step.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Khatian Splitting Preview Box */}
              <div className="bg-[#18181b] p-4 rounded-md border border-[#27272a] space-y-2">
                <div className="flex items-center gap-2 font-sans font-semibold text-[#f4f4f5] text-xs">
                  <Scissors className="w-4 h-4 text-[#d4a657]" />
                  <span>{language === 'en' ? 'Automated Ledger Ledger Splitting Simulation:' : 'স্বয়ংক্রিয় খতিয়ান কর্তন ও জমার বণ্টন:'}</span>
                </div>
                <div className="text-xs text-[#a1a1aa] space-y-1">
                  <div className="flex justify-between">
                    <span>Seller Remaining Decimals in {selectedCase.parentKhatianNo}:</span>
                    <strong className="text-[#DC2626] font-mono font-bold">
                      Deducted by -{selectedCase.transferAreaDecimals.toFixed(2)} Decimals
                    </strong>
                  </div>
                  <div className="flex justify-between text-[#16A34A] font-semibold">
                    <span>Buyer New Khatian to be Created:</span>
                    <strong className="font-mono font-bold">
                      {selectedCase.newKhatianNo || `${selectedCase.parentKhatianNo}/A`} (+{selectedCase.transferAreaDecimals.toFixed(2)} Dec)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Workflow Actions Controls */}
              <div className="pt-3 border-t border-[#27272a] space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Step 1: Tahsil Report Action */}
                  <button
                    onClick={() => verifyTahsilReport(selectedCase.id)}
                    disabled={selectedCase.status !== 'AUTO_INITIATED'}
                    className={`flex-1 py-2.5 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors border cursor-pointer focus:outline-none ${
                      selectedCase.status === 'AUTO_INITIATED'
                        ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-[#2563EB] shadow-xs'
                        : 'bg-[#18181b] text-[#71717a] border-[#27272a] cursor-not-allowed'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>
                      {selectedCase.status === 'AUTO_INITIATED'
                        ? (language === 'en' ? 'Step 1: Verify Union Land (Tahsil) Report' : 'ধাপ ১: ইউনিয়ন ভূমি সহকারী প্রতিবেদন সত্যায়ন')
                        : (language === 'en' ? '✓ Tahsil Report Verified' : '✓ তহশিল রিপোর্ট সম্পন্ন')}
                    </span>
                  </button>

                  {/* Step 2: Approve & Split Khatian */}
                  <button
                    onClick={() => handleApprove(selectedCase.id)}
                    disabled={selectedCase.status !== 'TAHSIL_VERIFIED' || isApproving}
                    className={`flex-1 py-2.5 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors border focus:outline-none ${
                      selectedCase.status === 'TAHSIL_VERIFIED'
                        ? 'bg-[#16A34A] hover:bg-[#15803D] text-white border-[#16A34A] cursor-pointer shadow-xs'
                        : selectedCase.status === 'MUTATION_APPROVED'
                          ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 cursor-default'
                          : 'bg-[#18181b] text-[#71717a] border-[#27272a] cursor-not-allowed'
                    }`}
                  >
                    {isApproving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{language === 'en' ? 'Generating Digital Porcha...' : 'পরচা তৈরি হচ্ছে...'}</span>
                      </>
                    ) : selectedCase.status === 'MUTATION_APPROVED' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                        <span>{language === 'en' ? '✓ Mutation Approved & Khatian Split' : '✓ নামজারি অনুমোদিত ও খতিয়ান সৃজিত'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#f4f4f5]" />
                        <span>{language === 'en' ? 'Step 2: Approve e-Mutation & Split Khatian' : 'ধাপ ২: নামজারি অনুমোদন ও খতিয়ান কর্তন'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Reject Option */}
                {selectedCase.status !== 'MUTATION_APPROVED' && selectedCase.status !== 'REJECTED' && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleReject(selectedCase.id)}
                      className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-sans font-medium flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Reject Case & Release Escrow Lock' : 'মামলা খারিজ ও জমি অবমুক্ত করুন'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#121215] rounded-lg p-8 text-center text-[#71717a] text-xs border border-[#27272a] shadow-xs">
              {language === 'en' ? 'Select an e-Mutation case to inspect.' : 'যাচাই করার জন্য তালিকা থেকে একটি মামলা নির্বাচন করুন।'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcLandView;
