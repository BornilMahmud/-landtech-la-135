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
  FileCheck,
  Search,
  Check,
  XCircle,
  Scissors
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
    language 
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
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-6 shadow-lg border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-800/60 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-600/30 mb-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'Ministry of Land — AC Land Secretariat' : 'ভূমি মন্ত্রণালয় — সহকারী কমিশনার (ভূমি) কার্যালয়'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'en' 
                ? 'AC Land Office: Automated e-Mutation Queue & Ledger Engine' 
                : 'এসি ল্যান্ড অফিস: স্বয়ংক্রিয় ই-নামজারি কিউ ও খতিয়ান বণ্টন'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {language === 'en'
                ? 'Zero-touch citizen processing: Cases automatically arrive from Sub-Registry with pre-locked decimals and SHA-256 deed signatures.'
                : 'জিরো-টাচ নাগরিক সেবা: সাব-রেজিস্ট্রির দলিল নিবন্ধনের সাথে সাথে জমি লক হয়ে স্বয়ংক্রিয়ভাবে এসি ল্যান্ডের কিউতে উপস্থাপিত হয়।'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs shrink-0 flex items-center gap-3">
            <div className="text-center px-2">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">{language === 'en' ? 'Live Queue' : 'মোট কেস'}</span>
              <span className="text-xl font-black text-white">{mutations.length}</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="block text-[10px] text-amber-300 uppercase font-bold">{language === 'en' ? 'Pending' : 'অপেক্ষমান'}</span>
              <span className="text-xl font-black text-amber-300">
                {mutations.filter(m => m.status === 'AUTO_INITIATED').length}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="block text-[10px] text-emerald-400 uppercase font-bold">{language === 'en' ? 'Approved' : 'অনুমোদিত'}</span>
              <span className="text-xl font-black text-emerald-400">
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
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-ambient border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {language === 'en' ? 'Incoming e-Mutation Feed' : 'আগত ই-নামজারি তালিকা'}
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {filteredMutations.length} {language === 'en' ? 'Cases' : 'টি মামলা'}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search by Tracking ID, Deed No, Buyer...' : 'ট্র্যাকিং আইডি বা নাম দিয়ে খুঁজুন...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none font-bold">
              {[
                { id: 'ALL', labelEn: 'All', labelBn: 'সকল' },
                { id: 'AUTO_INITIATED', labelEn: 'Auto-Triggered', labelBn: 'নতুন আগত' },
                { id: 'TAHSIL_VERIFIED', labelEn: 'Tahsil Done', labelBn: 'তহশিল রিপোর্ট' },
                { id: 'MUTATION_APPROVED', labelEn: 'Approved', labelBn: 'অনুমোদিত' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    filterStatus === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {language === 'en' ? f.labelEn : f.labelBn}
                </button>
              ))}
            </div>

            {/* Queue List Cards */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredMutations.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  {language === 'en' ? 'No e-Mutation cases found.' : 'কোনো নামজারি মামলা পাওয়া যায়নি।'}
                </div>
              ) : (
                filteredMutations.map(m => {
                  const isSelected = selectedCase?.id === m.id;
                  let statusBadge = (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                      {language === 'en' ? 'Auto-Initiated' : 'স্বয়ংক্রিয় আগত'}
                    </span>
                  );
                  if (m.status === 'TAHSIL_VERIFIED') {
                    statusBadge = (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                        {language === 'en' ? 'Tahsil Verified' : 'তহশিল রিপোর্ট সম্পন্ন'}
                      </span>
                    );
                  } else if (m.status === 'MUTATION_APPROVED') {
                    statusBadge = (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {language === 'en' ? 'Approved & Split' : 'অনুমোদিত ও কর্তনকৃত'}
                      </span>
                    );
                  } else if (m.status === 'REJECTED') {
                    statusBadge = (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                        {language === 'en' ? 'Rejected' : 'বাতিল'}
                      </span>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedCaseId(m.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-xs text-slate-900 tabular-nums">{m.id}</span>
                        {statusBadge}
                      </div>

                      <div className="text-xs text-slate-600 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span>{language === 'en' ? 'Deed Ref:' : 'দলিল নং:'} <strong className="text-slate-800 font-mono tabular-nums">{m.deedNo}</strong></span>
                          <span className="font-bold text-emerald-700 font-mono tabular-nums">{m.transferAreaDecimals.toFixed(2)} Dec</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {m.sellerName} ➔ <strong className="text-slate-800">{m.buyerName}</strong>
                        </div>
                        <div className="text-[10px] text-slate-400">
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
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-ambient border border-slate-200/90 space-y-6">
              {/* Header with Case Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-slate-900 tabular-nums">{selectedCase.id}</span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Sub-Registry Linked
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en' ? 'Initiated on:' : 'আবেদনের সময়:'} {selectedCase.autoInitiatedAt.split('T')[0]} • {selectedCase.mouza} Mouza
                  </p>
                </div>

                {/* Status indicator */}
                <div>
                  {selectedCase.status === 'MUTATION_APPROVED' ? (
                    <button
                      onClick={() => {
                        if (linkedNewKhatian) {
                          setActivePorcha({ khatian: linkedNewKhatian, mutationId: selectedCase.id });
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'View Official Porcha' : 'ডিজিটাল পর্চা দেখুন'}</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'en' ? 'Pending Approval' : 'অনুমোদন প্রক্রিয়াধীন'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Transfer Details Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                    {language === 'en' ? 'Parent Land Record (দাতা)' : 'মূল খতিয়ান ও রেকর্ড (দাতা)'}
                  </span>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Seller (দাতা):</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedCase.sellerName}</span>
                    <span className="block font-mono text-[10px] text-slate-500">{selectedCase.sellerNid}</span>
                  </div>
                  <div className="pt-1 border-t text-[11px]">
                    <span className="text-slate-500">Parent Khatian:</span> <strong className="font-mono">{selectedCase.parentKhatianNo}</strong>
                    <br />
                    <span className="text-slate-500">Dag (Plot):</span> <strong className="font-mono">#{selectedCase.dagNo}</strong>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] block">
                    {language === 'en' ? 'Buyer & Mutated Parcel (গ্রহীতা)' : 'নামজারি প্রস্তাবিত গ্রহীতা'}
                  </span>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Buyer (গ্রহীতা):</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedCase.buyerName}</span>
                    <span className="block font-mono text-[10px] text-slate-500">{selectedCase.buyerNid}</span>
                  </div>
                  <div className="pt-1 border-t text-[11px]">
                    <span className="text-slate-500">Mutated Area:</span> <strong className="text-emerald-700 font-bold">{selectedCase.transferAreaDecimals.toFixed(2)} Decimals</strong>
                    <br />
                    <span className="text-slate-500">Linked Deed:</span> <strong className="font-mono text-slate-800">{selectedCase.deedNo}</strong>
                  </div>
                </div>
              </div>

              {/* 5-Stage Visual Workflow Stepper */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'en' ? '5-Stage Digital Mutation Progress Tracker:' : '৫-স্তরের ডিজিটাল নামজারি অগ্রগতি:'}</span>
                </h4>

                <div className="space-y-2">
                  {selectedCase.workflowSteps.map(step => (
                    <div
                      key={step.step}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                        step.completed
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="mt-0.5">
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">
                            {step.step}. {language === 'en' ? step.nameEn : step.nameBn}
                          </span>
                          {step.timestamp && (
                            <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
                          )}
                        </div>
                        {step.note && (
                          <p className="text-[11px] text-slate-600 leading-snug">{step.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Khatian Splitting Preview Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                  <Scissors className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'en' ? 'Automated Ledger Ledger Splitting Simulation:' : 'স্বয়ংক্রিয় খতিয়ান কর্তন ও জমার বণ্টন:'}</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Seller Remaining Decimals in {selectedCase.parentKhatianNo}:</span>
                    <strong className="text-slate-900 font-mono">
                      Deducted by -{selectedCase.transferAreaDecimals.toFixed(2)} Decimals
                    </strong>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Buyer New Khatian to be Created:</span>
                    <strong className="font-mono">
                      {selectedCase.newKhatianNo || `${selectedCase.parentKhatianNo}/A`} (+{selectedCase.transferAreaDecimals.toFixed(2)} Dec)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Workflow Actions Controls */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Step 1: Tahsil Report Action */}
                  <button
                    onClick={() => verifyTahsilReport(selectedCase.id)}
                    disabled={selectedCase.status !== 'AUTO_INITIATED'}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedCase.status === 'AUTO_INITIATED'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm ring-1 ring-blue-400'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
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
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all ${
                      selectedCase.status === 'TAHSIL_VERIFIED'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white ring-2 ring-emerald-400 animate-pulse-fast cursor-pointer'
                        : selectedCase.status === 'MUTATION_APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isApproving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{language === 'en' ? 'Generating Digital Porcha...' : 'পরচা তৈরি হচ্ছে...'}</span>
                      </>
                    ) : selectedCase.status === 'MUTATION_APPROVED' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'en' ? '✓ Mutation Approved & Khatian Split' : '✓ নামজারি অনুমোদিত ও খতিয়ান সৃজিত'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-200" />
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
                      className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Reject Case & Release Escrow Lock' : 'মামলা খারিজ ও জমি অবমুক্ত করুন'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs border border-slate-200">
              {language === 'en' ? 'Select an e-Mutation case to inspect.' : 'যাচাই করার জন্য তালিকা থেকে একটি মামলা নির্বাচন করুন।'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
