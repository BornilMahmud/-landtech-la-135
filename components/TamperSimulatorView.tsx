'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  FileText, 
  AlertOctagon, 
  CheckCircle2, 
  Lock, 
  Key, 
  Fingerprint,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { computeSha256 } from '@/lib/crypto';

export const TamperSimulatorView: React.FC = () => {
  const { deeds, khatians, language } = useLandApp();

  const [selectedDeedNo, setSelectedDeedNo] = useState<string>(deeds[0]?.deedNo || '');
  const selectedDeed = deeds.find(d => d.deedNo === selectedDeedNo) || deeds[0];

  // Tamperable preview states
  const [editedOwner, setEditedOwner] = useState<string>('');
  const [editedDecimals, setEditedDecimals] = useState<number>(0);
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [computedHash, setComputedHash] = useState<string>('');

  // Sync with selected deed
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
    // Alter the decimals to 25.00 decimals and forged owner
    const forgedDecimals = Number((selectedDeed.transferAreaDecimals + 15.0).toFixed(2));
    const forgedOwner = `${selectedDeed.buyerName} [FORGED / ALTERED]`;
    setEditedDecimals(forgedDecimals);
    setEditedOwner(forgedOwner);
    setIsTampered(true);

    // Compute new hash of the forged data payload
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
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-rose-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-900/60 text-rose-200 text-xs font-semibold px-3 py-1 rounded-full border border-rose-600/30 mb-2">
              <Fingerprint className="w-3.5 h-3.5 text-rose-300" />
              <span>{language === 'en' ? 'Cryptographic Integrity Lab' : 'ক্রিপ্টোগ্রাফিক সনদ ও নিরাপত্তা ল্যাব'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'en' 
                ? 'Live Cryptographic Tamper Simulator (SHA-256 Proof)' 
                : 'লাইভ ক্রিপ্টোগ্রাফিক জালিয়াতি প্রতিরোধ ও হ্যাশ যাচাই সিমুলেটর'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/80 mt-1 max-w-2xl">
              {language === 'en'
                ? 'Test mathematical forgery detection: Simulate changing a deed’s decimals or owner name and watch SetuLand immediately reject the counterfeit document.'
                : 'গাণিতিক হ্যাশিংয়ের ক্ষমতা পরীক্ষা করুন: দলিলের জমি বা নাম পরিবর্তন করে দেখুন কিভাবে সেতু-ল্যান্ড সাথে সাথে জালিয়াতি শনাক্ত করে নথি বাতিল করে।'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs text-center shrink-0">
            <span className="block text-[10px] text-rose-300 uppercase font-bold">{language === 'en' ? 'Algorithm' : 'অ্যালগরিদম'}</span>
            <span className="text-sm font-mono font-bold text-white">SHA-256 (256-bit Hex)</span>
          </div>
        </div>
      </div>

      {/* Main Tamper Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Deed Selector & Interactive Tampering Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-ambient border border-slate-200/90 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'en' ? 'Select Registered Deed or Porcha to Audit:' : 'যাচাই করার জন্য রেজিস্ট্রিকৃত দলিল নির্বাচন:'}
              </label>
              <select
                value={selectedDeedNo}
                onChange={(e) => setSelectedDeedNo(e.target.value)}
                className="w-full text-xs sm:text-sm font-mono font-bold border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none tabular-nums shadow-sm"
              >
                {deeds.map(d => (
                  <option key={d.deedNo} value={d.deedNo}>
                    {d.deedNo} | {d.buyerName} ({d.transferAreaDecimals.toFixed(1)} Dec)
                  </option>
                ))}
              </select>
            </div>

            {/* Document Data Inputs (Simulate manual editing) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] block">
                {language === 'en' ? 'Simulate Fraudulent Document Alteration:' : 'দলিলের তথ্য বিকৃতি সিমুলেশন:'}
              </span>

              <div>
                <label className="block text-slate-600 mb-1">{language === 'en' ? 'Buyer / Owner on Document:' : 'নথিতে ক্রেতা/মালিকের নাম:'}</label>
                <input
                  type="text"
                  value={editedOwner}
                  onChange={(e) => {
                    setEditedOwner(e.target.value);
                    setIsTampered(true);
                  }}
                  className={`w-full font-bold border rounded-lg px-3 py-2 ${
                    isTampered ? 'border-rose-400 bg-rose-50 text-rose-900 ring-1 ring-rose-400' : 'border-slate-300 bg-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">{language === 'en' ? 'Land Area (Decimals) on Document:' : 'নথিতে জমির পরিমাণ (শতাংশ):'}</label>
                <input
                  type="number"
                  step="0.1"
                  value={editedDecimals}
                  onChange={(e) => {
                    setEditedDecimals(parseFloat(e.target.value) || 0);
                    setIsTampered(true);
                  }}
                  className={`w-full font-bold font-mono border rounded-lg px-3 py-2 ${
                    isTampered ? 'border-red-400 bg-red-50 text-red-900' : 'border-slate-300 bg-white'
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleSimulateTamper}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>{language === 'en' ? '⚡ Simulate Forgery (Tamper Area/Owner)' : '⚡ জালিয়াতি সিমুলেট করুন (জমি/নাম পরিবর্তন)'}</span>
                </button>

                <button
                  onClick={handleRestore}
                  disabled={!isTampered}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Restore Authentic Ledger State' : 'আসল রেকর্ড পুনঃস্থাপন করুন'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Side-by-Side Cryptographic Hash Comparison (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {language === 'en' ? 'Side-by-Side SHA-256 Consensus Verification' : 'দ্বিমুখী ক্রিপ্টোগ্রাফিক হ্যাশ যাচাই ফলাফল'}
              </h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                hashesMatch ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800 animate-pulse'
              }`}>
                {hashesMatch ? '✓ Verified Authentic' : '⚠️ MISMATCH DETECTED'}
              </span>
            </div>

            {/* Dramatic Status Alert Card */}
            {hashesMatch ? (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-950 text-sm">
                    {language === 'en' ? '✓ 100% Cryptographic Match: Authentic Deed' : '✓ শতভাগ ক্রিপ্টোগ্রাফিক সামঞ্জস্য: দলিল নির্ভেজাল ও বৈধ'}
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {language === 'en'
                      ? 'The mathematical hash computed from the physical deed exactly matches the immutable state ledger. Zero tampering detected.'
                      : 'নথির প্রতিটি অক্ষর ও সংখ্যার গাণিতিক হ্যাশ সরকারি স্টেট লেজারের সাথে হুবহু মিলে গেছে। কোনো তথ্য পরিবর্তন করা হয়নি।'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-start gap-3 shadow-md animate-fade-in">
                <AlertOctagon className="w-6 h-6 text-red-600 shrink-0 mt-0.5 animate-bounce" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-red-950 text-sm">
                    {language === 'en' ? '⚠️ FORGERY DETECTED: HASH INTEGRITY BROKEN!' : '⚠️ জালিয়াতি শনাক্ত: ডিজিটাল সিল বিকৃত ও অগ্রহণযোগ্য!'}
                  </h4>
                  <p className="text-xs text-red-800 leading-relaxed">
                    {language === 'en'
                      ? 'ALERT! The document hash does not match the Sub-Registry immutable ledger. Any modification to land decimals, seller NID, or boundaries produces an entirely different 256-bit avalanche signature. Document automatically rejected.'
                      : 'সতর্কতা! জমির পরিমাণ বা নাম সামান্যতম পরিবর্তন করায় SHA-256 হ্যাশের স্বাক্ষর সম্পূর্ণ বদলে গেছে। সেতু-ল্যান্ড কনসেনসাস ইঞ্জিন এই দলিল তাৎক্ষণিক প্রত্যাখ্যান করেছে।'}
                  </p>
                </div>
              </div>
            )}

            {/* Side-by-Side Hash Box Comparison */}
            <div className="space-y-3 text-xs">
              {/* Original Hash */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-emerald-900">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'en' ? 'A. Original Immutable Ledger SHA-256 Hash:' : 'ক. সরকারি রেজিস্ট্রি লেজারে সংরক্ষিত অপরিবর্তনীয় হ্যাশ:'}</span>
                </span>
                <p className="font-mono text-[11px] text-slate-800 break-all bg-white p-2.5 rounded-lg border border-slate-300 font-bold">
                  {originalHash}
                </p>
              </div>

              {/* Computed Document Hash */}
              <div className={`p-3.5 rounded-xl border space-y-1 ${
                hashesMatch ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-300'
              }`}>
                <span className={`font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 ${
                  hashesMatch ? 'text-slate-700' : 'text-red-900'
                }`}>
                  <Key className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'en' ? 'B. Dynamically Computed Document Hash:' : 'খ. উপস্থাপিত নথির গাণিতিক হ্যাশ:'}</span>
                </span>
                <p className={`font-mono text-[11px] break-all p-2.5 rounded-lg border font-bold ${
                  hashesMatch ? 'bg-white border-slate-300 text-slate-800' : 'bg-red-100/70 border-red-300 text-red-950 font-black'
                }`}>
                  {computedHash}
                </p>
              </div>
            </div>

            {/* Technical Explanation */}
            <div className="bg-slate-100/80 p-3.5 rounded-xl text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800 block">
                {language === 'en' ? 'Why Fake Deeds Cannot Be Produced:' : 'জাল দলিল বা পরচা তৈরি কেন অসম্ভব:'}
              </strong>
              <p className="text-[11px] leading-relaxed">
                {language === 'en'
                  ? 'SHA-256 operates with the cryptographic avalanche effect: altering even a single decimal place from 5.00 to 5.01 flips >50% of the bits in the hash, instantly making counterfeit deeds and fake porchas impossible to pass verification.'
                  : 'SHA-256 অ্যালগরিদমের কারণে নথির একটি বিন্দুও পরিবর্তন করলে পুরো হ্যাশ সম্পূর্ণ বদলে যায়। ফলে জাল দলিল বা পরচা দিয়ে কোনোভাবেই নিবন্ধন বা মিউটেশন সম্পন্ন করা সম্ভব নয়।'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
