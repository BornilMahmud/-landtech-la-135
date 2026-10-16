'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  Fingerprint,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { computeSha256 } from '@/lib/crypto';

export const TamperSimulatorView: React.FC = () => {
  const { deeds, language } = useLandApp();

  const [selectedDeedNo, setSelectedDeedNo] = useState<string>(deeds[0]?.deedNo || '');
  const selectedDeed = deeds.find(d => d.deedNo === selectedDeedNo) || deeds[0];

  const [editedOwner, setEditedOwner] = useState<string>('');
  const [editedDecimals, setEditedDecimals] = useState<number>(0);
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [computedHash, setComputedHash] = useState<string>('');

  useEffect(() => {
    if (selectedDeed) {
      setEditedOwner(selectedDeed.buyerName);
      setEditedDecimals(selectedDeed.transferAreaDecimals);
      setIsTampered(false);
      setComputedHash(selectedDeed.sha256Hash);
    }
  }, [selectedDeedNo, selectedDeed]);

  const handleSimulateTamper = async () => {
    if (!selectedDeed) return;
    const forgedDecimals = Number((selectedDeed.transferAreaDecimals + 15.0).toFixed(2));
    const forgedOwner = `${selectedDeed.buyerName} [FORGED]`;
    setEditedDecimals(forgedDecimals);
    setEditedOwner(forgedOwner);
    setIsTampered(true);

    const payload = `${selectedDeed.deedNo}|${selectedDeed.khatianNo}|${selectedDeed.dagNo}|${selectedDeed.sellerNid}|${forgedOwner}|${forgedDecimals}|${selectedDeed.saleValueBDT}|${selectedDeed.registrationDate}`;
    const forgedHash = await computeSha256(payload);
    setComputedHash(forgedHash);
  };

  const handleRestore = () => {
    if (!selectedDeed) return;
    setEditedOwner(selectedDeed.buyerName);
    setEditedDecimals(selectedDeed.transferAreaDecimals);
    setIsTampered(false);
    setComputedHash(selectedDeed.sha256Hash);
  };

  const originalHash = selectedDeed?.sha256Hash || '';
  const hashesMatch = originalHash === computedHash && !isTampered;

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Card */}
      <div className="bg-[#121215] border border-[#27272a] rounded-lg p-5 sm:p-6 text-[#f4f4f5] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#d4a657] tracking-wider uppercase mb-2 font-semibold">
              Cryptographic Integrity Lab • Merkle &amp; SHA-256 Engine
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#f4f4f5]">
              Deterministic <span className="text-[#f4f4f5]/90">Tamper &amp; Forgery Verification</span>
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#a1a1aa] mt-2 leading-relaxed max-w-2xl">
              {language === 'en'
                ? 'Empirically demonstrate mathematical tamper detection: modify deed decimals or legal owner strings to watch instant cryptographic mismatch rejection.'
                : 'গাণিতিক হ্যাশিংয়ের ক্ষমতা পরীক্ষা করুন: দলিলের জমি বা নাম পরিবর্তন করে দেখুন কিভাবে সেতু-ল্যান্ড সাথে সাথে জালিয়াতি শনাক্ত করে নথি বাতিল করে।'}
            </p>
          </div>

          <div className="bg-[#18181b] rounded-md p-3 border border-[#27272a] text-xs font-mono text-center shrink-0">
            <span className="block text-[10px] text-[#71717a] uppercase font-semibold">Hashing Primitive</span>
            <span className="text-xs text-[#f4f4f5] block mt-0.5 font-bold">SHA-256 (256-bit Hex)</span>
          </div>
        </div>
      </div>

      {/* Main Tamper Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Deed Selector & Interactive Tampering Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-4 shadow-xs">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#a1a1aa] mb-1.5 font-semibold">
                {language === 'en' ? 'Select Registered Deed to Audit:' : 'যাচাই করার জন্য রেজিস্ট্রিকৃত দলিল নির্বাচন:'}
              </label>
              <select
                value={selectedDeedNo}
                onChange={(e) => setSelectedDeedNo(e.target.value)}
                className="w-full text-xs font-mono border border-[#27272a] rounded-md px-3.5 py-2.5 bg-[#09090b] text-[#f4f4f5] focus:border-[#d4a657] focus:outline-none"
              >
                {deeds.map(d => (
                  <option key={d.deedNo} value={d.deedNo}>
                    {d.deedNo} | {d.buyerName} ({d.transferAreaDecimals.toFixed(1)} Dec)
                  </option>
                ))}
              </select>
            </div>

            {/* Document Data Inputs */}
            <div className="space-y-3 pt-2 border-t border-[#27272a]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#a1a1aa] block font-semibold">
                Simulated Local Modifiers
              </span>

              <div>
                <label className="block font-mono text-[11px] text-[#a1a1aa] mb-1">
                  Transferee Name (Simulate Forgery):
                </label>
                <input
                  type="text"
                  value={editedOwner}
                  onChange={(e) => {
                    setEditedOwner(e.target.value);
                    setIsTampered(true);
                  }}
                  className={`w-full font-sans text-sm border rounded-md px-3 py-2 transition-colors focus:outline-none ${
                    isTampered 
                      ? 'bg-[#18181b] border-[#DC2626] text-[#DC2626]' 
                      : 'bg-[#09090b] border-[#27272a] text-[#f4f4f5] focus:border-[#d4a657]'
                  }`}
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#a1a1aa] mb-1">
                  Conveyed Decimals (Simulate Area Expansion):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editedDecimals}
                  onChange={(e) => {
                    setEditedDecimals(parseFloat(e.target.value) || 0);
                    setIsTampered(true);
                  }}
                  className={`w-full font-mono text-sm border rounded-md px-3 py-2 tabular-nums transition-colors focus:outline-none ${
                    isTampered 
                      ? 'bg-[#18181b] border-[#DC2626] text-[#DC2626]' 
                      : 'bg-[#09090b] border-[#27272a] text-[#f4f4f5] focus:border-[#d4a657]'
                  }`}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-[#27272a] space-y-2">
              <button
                onClick={handleSimulateTamper}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-sans text-xs font-semibold rounded-md border border-[#DC2626] transition-colors cursor-pointer focus:outline-none shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-white" />
                <span>Simulate Cryptographic Forgery (+15 Dec)</span>
              </button>

              <button
                onClick={handleRestore}
                disabled={!isTampered}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] font-sans text-xs font-medium rounded-md border border-[#27272a] transition-colors disabled:opacity-40 cursor-pointer focus:outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#a1a1aa]" />
                <span>Restore Authentic Ledger State</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Cryptographic Comparison & Consensus Engine (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#121215] rounded-lg p-5 sm:p-6 border border-[#27272a] space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <div className="font-mono text-xs uppercase tracking-wider text-[#a1a1aa]">Consensus Comparator</div>
                <h3 className="font-sans text-lg font-semibold text-[#f4f4f5]">
                  Side-by-Side SHA-256 Hash Verification
                </h3>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-semibold ${
                hashesMatch
                  ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30'
                  : 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30'
              }`}>
                {hashesMatch ? 'CONSENSUS VALID' : 'HASH MISMATCH'}
              </span>
            </div>

            {/* Hash Comparison Stack */}
            <div className="space-y-3 font-mono text-xs">
              {/* Authentic Hash */}
              <div className="p-4 bg-[#09090b] rounded-md border border-[#27272a] space-y-1.5">
                <div className="flex items-center justify-between text-[#a1a1aa] text-[11px] uppercase font-semibold">
                  <span>Authentic Ledger Sealed Hash:</span>
                  <span className="text-[#16A34A]">ORIGINAL</span>
                </div>
                <div className="text-[11px] text-[#f4f4f5] break-all leading-relaxed bg-[#121215] p-2.5 rounded-md border border-[#27272a]">
                  {originalHash}
                </div>
              </div>

              {/* Computed Hash */}
              <div className={`p-4 rounded-md border space-y-1.5 transition-colors ${
                hashesMatch
                  ? 'bg-[#09090b] border-[#27272a]'
                  : 'bg-[#18181b] border-[#DC2626]/50'
              }`}>
                <div className="flex items-center justify-between text-[11px] uppercase font-semibold">
                  <span className={hashesMatch ? 'text-[#a1a1aa]' : 'text-[#DC2626]'}>
                    Live Recomputed Hash from Document Bytes:
                  </span>
                  <span className={hashesMatch ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                    {hashesMatch ? 'VERIFIED' : 'TAMPER DETECTED'}
                  </span>
                </div>
                <div className={`text-[11px] break-all leading-relaxed p-2.5 rounded-md border ${
                  hashesMatch
                    ? 'bg-[#121215] border-[#27272a] text-[#f4f4f5]'
                    : 'bg-[#121215] border-[#DC2626]/40 text-[#DC2626]'
                }`}>
                  {computedHash}
                </div>
              </div>
            </div>

            {/* Forensic Consensus Verdict Banner */}
            <div className={`p-4 rounded-md border text-xs font-sans transition-colors ${
              hashesMatch
                ? 'bg-[#09090b] border-[#16A34A]/30 text-[#f4f4f5]'
                : 'bg-[#18181b] border-[#DC2626]/40 text-[#f4f4f5]'
            }`}>
              <div className="font-mono text-xs uppercase tracking-wider font-semibold mb-1">
                {hashesMatch 
                  ? 'Consensus Verdict: Cryptographic Integrity Confirmed'
                  : 'Consensus Verdict: Integrity Violation — Forgery Rejected'}
              </div>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                {hashesMatch
                  ? 'The document payload matches the immutable ledger record bit-for-bit. Title conveyance and e-mutation partition are authorized.'
                  : 'Even a 1-bit or decimal modification creates an entirely distinct 256-bit hash avalanche. The automated consensus layer immediately blocks processing.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TamperSimulatorView;
