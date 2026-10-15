'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  KhatianRecord, 
  DeedRecord, 
  MutationCase, 
  RoleType, 
  Language, 
  VerificationResult, 
  VerificationCheck,
  FeeBreakdown,
  MortgageDetails,
  CourtCaseDetails,
  AcquisitionDetails
} from '@/types';
import { INITIAL_KHATIANS, INITIAL_DEEDS, INITIAL_MUTATIONS } from '@/lib/dummyData';
import { computeSha256 } from '@/lib/crypto';
import confetti from 'canvas-confetti';

interface LandAppContextType {
  khatians: KhatianRecord[];
  deeds: DeedRecord[];
  mutations: MutationCase[];
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedPlotId: string | null;
  setSelectedPlotId: (id: string | null) => void;
  
  // Modals & UI states
  activeDeedReceipt: DeedRecord | null;
  setActiveDeedReceipt: (deed: DeedRecord | null) => void;
  activePorcha: { khatian: KhatianRecord; mutationId?: string } | null;
  setActivePorcha: (data: { khatian: KhatianRecord; mutationId?: string } | null) => void;
  fraudAlert: { isOpen: boolean; titleEn: string; titleBn: string; reasonEn: string; reasonBn: string } | null;
  setFraudAlert: (alert: { isOpen: boolean; titleEn: string; titleBn: string; reasonEn: string; reasonBn: string } | null) => void;
  
  // Verification & Registration Actions
  isVerifying: boolean;
  lastVerificationResult: VerificationResult | null;
  runFivePointVerification: (plotId: string, transferArea: number, sellerNid: string) => Promise<VerificationResult>;
  calculateFees: (saleValue: number) => FeeBreakdown;
  registerDeed: (params: {
    plotId: string;
    buyerName: string;
    buyerNid: string;
    buyerPhone: string;
    transferAreaDecimals: number;
    saleValueBDT: number;
  }) => Promise<{ success: boolean; deed?: DeedRecord; mutation?: MutationCase; error?: string }>;

  // AC Land Workflow
  verifyTahsilReport: (mutationId: string) => void;
  approveMutation: (mutationId: string) => Promise<KhatianRecord | null>;
  rejectMutation: (mutationId: string, reason: string) => void;

  // Locks & Govt Control
  toggleBankMortgage: (plotId: string) => void;
  toggleCourtInjunction: (plotId: string) => void;
  toggleDcAcquisition: (plotId: string) => void;

  // Executive KPI Metrics
  blockedAttemptsCount: number;
  totalPlotsCount: number;
  totalLockedDecimals: number;
  queuedMutationsCount: number;

  // Demo state
  resetDemoData: () => void;
}

const LandAppContext = createContext<LandAppContextType | undefined>(undefined);

const STORAGE_KEY_KHATIANS = 'setuland_khatians_v1';
const STORAGE_KEY_DEEDS = 'setuland_deeds_v1';
const STORAGE_KEY_MUTATIONS = 'setuland_mutations_v1';
const STORAGE_KEY_LANG = 'setuland_lang_v1';
const STORAGE_KEY_BLOCKED = 'setuland_blocked_count_v1';

export const LandAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [khatians, setKhatians] = useState<KhatianRecord[]>(INITIAL_KHATIANS);
  const [deeds, setDeeds] = useState<DeedRecord[]>(INITIAL_DEEDS);
  const [mutations, setMutations] = useState<MutationCase[]>(INITIAL_MUTATIONS);
  const [activeRole, setActiveRole] = useState<RoleType>('sub_registrar');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>('plot-1');
  const [blockedAttemptsCount, setBlockedAttemptsCount] = useState<number>(3);

  const [activeDeedReceipt, setActiveDeedReceipt] = useState<DeedRecord | null>(null);
  const [activePorcha, setActivePorcha] = useState<{ khatian: KhatianRecord; mutationId?: string } | null>(null);
  const [fraudAlert, setFraudAlert] = useState<{ isOpen: boolean; titleEn: string; titleBn: string; reasonEn: string; reasonBn: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerificationResult, setLastVerificationResult] = useState<VerificationResult | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedKhatians = localStorage.getItem(STORAGE_KEY_KHATIANS);
      const storedDeeds = localStorage.getItem(STORAGE_KEY_DEEDS);
      const storedMutations = localStorage.getItem(STORAGE_KEY_MUTATIONS);
      const storedLang = localStorage.getItem(STORAGE_KEY_LANG);
      const storedBlocked = localStorage.getItem(STORAGE_KEY_BLOCKED);

      if (storedKhatians) setKhatians(JSON.parse(storedKhatians));
      if (storedDeeds) setDeeds(JSON.parse(storedDeeds));
      if (storedMutations) setMutations(JSON.parse(storedMutations));
      if (storedLang === 'en' || storedLang === 'bn') setLanguage(storedLang);
      if (storedBlocked) setBlockedAttemptsCount(parseInt(storedBlocked) || 3);
    } catch (e) {
      console.warn('Could not read from localStorage, using initial dataset:', e);
    }
  }, []);

  // Save to localStorage when state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_KHATIANS, JSON.stringify(khatians));
    } catch (e) {
      console.warn('Could not write khatians to localStorage', e);
    }
  }, [khatians]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DEEDS, JSON.stringify(deeds));
    } catch (e) {
      console.warn('Could not write deeds to localStorage', e);
    }
  }, [deeds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MUTATIONS, JSON.stringify(mutations));
    } catch (e) {
      console.warn('Could not write mutations to localStorage', e);
    }
  }, [mutations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, language);
    } catch (e) {
      console.warn('Could not write lang to localStorage', e);
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BLOCKED, blockedAttemptsCount.toString());
    } catch (e) {
      console.warn('Could not write blocked count to localStorage', e);
    }
  }, [blockedAttemptsCount]);

  const resetDemoData = () => {
    setKhatians(INITIAL_KHATIANS);
    setDeeds(INITIAL_DEEDS);
    setMutations(INITIAL_MUTATIONS);
    setSelectedPlotId('plot-1');
    setBlockedAttemptsCount(3);
    setLastVerificationResult(null);
    setFraudAlert(null);
    setActiveDeedReceipt(null);
    setActivePorcha(null);
    try {
      localStorage.removeItem(STORAGE_KEY_KHATIANS);
      localStorage.removeItem(STORAGE_KEY_DEEDS);
      localStorage.removeItem(STORAGE_KEY_MUTATIONS);
      localStorage.removeItem(STORAGE_KEY_BLOCKED);
    } catch (e) {
      console.warn('Error clearing localStorage', e);
    }
  };

  const calculateFees = (saleValue: number): FeeBreakdown => {
    const safeValue = Math.max(0, saleValue || 0);
    const stampDuty = Math.round(safeValue * 0.015);       // 1.5% Stamp Duty
    const registrationFee = Math.round(safeValue * 0.01);   // 1.0% Registration Fee
    const localGovtTax = Math.round(safeValue * 0.03);      // 3.0% Local Govt Tax
    const gainTax = Math.round(safeValue * 0.02);           // 2.0% Gain Tax / AIT
    const mutationFee = 1170;                               // Standard Bangladesh e-Mutation Fee (1,170 BDT)
    const totalFee = stampDuty + registrationFee + localGovtTax + gainTax + mutationFee;

    return {
      saleValueBDT: safeValue,
      stampDutyBDT: stampDuty,
      registrationFeeBDT: registrationFee,
      localGovtTaxBDT: localGovtTax,
      gainTaxBDT: gainTax,
      mutationFeeBDT: mutationFee,
      totalFeeBDT: totalFee,
    };
  };

  const runFivePointVerification = async (
    plotId: string, 
    transferArea: number, 
    sellerNid: string
  ): Promise<VerificationResult> => {
    setIsVerifying(true);
    // Simulate real-time cryptographic audit delay for visual polish (400ms)
    await new Promise(r => setTimeout(r, 450));

    const plot = khatians.find(k => k.id === plotId);
    if (!plot) {
      setIsVerifying(false);
      const res: VerificationResult = {
        passed: false,
        checks: [],
        fraudTitleEn: 'Plot Record Not Found',
        fraudTitleBn: 'জমির রেকর্ড পাওয়া যায়নি',
        fraudReasonEn: 'The specified Khatian or Dag was not found in the DLRS cadastral index.',
        fraudReasonBn: 'অনুরোধকৃত খতিয়ান বা দাগ ডিএলআরএস ক্যাডাস্ট্রাল ইনডেক্সে বিদ্যমান নেই।'
      };
      setLastVerificationResult(res);
      return res;
    }

    const availableArea = Math.max(0, plot.totalAreaDecimals - plot.lockedAreaDecimals);

    // 1. Ownership Match
    const ownershipPassed = (plot.ownerNid.trim().toUpperCase() === sellerNid.trim().toUpperCase());
    
    // 2. Chain-of-Title Lineage (CS -> SA -> RS -> BS)
    const lineagePassed = plot.chainOfTitle.length >= 3 && plot.chainOfTitle.every(c => c.verified);

    // 3. Unlocked Area Balance (Anti-Double-Selling)
    const balancePassed = transferArea > 0 && transferArea <= availableArea;

    // 4. Bank Mortgage Free Check
    const mortgageFree = !plot.isMortgaged;

    // 5. Court Injunction Free Check
    const courtFree = !plot.hasCourtCase;

    // 6. DC Land Acquisition Free Check
    const acqFree = !plot.isAcquired;

    const checks: VerificationCheck[] = [
      {
        id: 'owner',
        labelEn: '1. National ID & Ownership Registry Match',
        labelBn: '১. জাতীয় পরিচয়পত্র ও মালিকানা যাচাই',
        passed: ownershipPassed,
        messageEn: ownershipPassed 
          ? `Owner NID verified: ${plot.ownerName} (${plot.ownerNid})`
          : `Mismatch! Plot registered to ${plot.ownerName} (${plot.ownerNid}), provided NID does not match.`,
        messageBn: ownershipPassed
          ? `মালিকের এনআইডি সত্যায়িত: ${plot.ownerNameBn} (${plot.ownerNid})`
          : `অমিল! জমিটি ${plot.ownerNameBn} এর নামে নিবন্ধিত, প্রদত্ত এনআইডি মিলছে না।`
      },
      {
        id: 'lineage',
        labelEn: '2. Unbroken Chain-of-Title Lineage (CS ➔ SA ➔ RS ➔ BS)',
        labelBn: '২. নির্বিঘ্ন ধারাবাহিক মালিকানা পরচা যাচাই (সিএস ➔ এসএ ➔ আরএস ➔ বিএস)',
        passed: lineagePassed,
        messageEn: lineagePassed
          ? `Verified 4-generation unbroken lineage through ${plot.chainOfTitle.map(c => c.surveyType).join(' ➔ ')}.`
          : `Lineage broken or disputed historical mutation detected in archival record.`,
        messageBn: lineagePassed
          ? `পরপর ৪ স্তরের সুনির্দিষ্ট মালিকানা ধারা যাচাই সম্পন্ন (${plot.chainOfTitle.map(c => c.surveyType).join(' ➔ ')}).`
          : `ধারাবাহিক রেকর্ডে ত্রুটি বা অননুমোদিত হস্তান্তরের চিহ্ন পাওয়া গেছে।`
      },
      {
        id: 'balance',
        labelEn: '3. Unlocked Decimals Balance Check (Anti-Double-Selling)',
        labelBn: '৩. অবমুক্ত জমির পরিমাণ ও দ্বৈত-বিক্রয় রোধ যাচাই',
        passed: balancePassed,
        messageEn: balancePassed
          ? `Transfer requested: ${transferArea.toFixed(2)} Decimals. Available unlocked: ${availableArea.toFixed(2)} Dec (Total: ${plot.totalAreaDecimals.toFixed(2)}, Locked: ${plot.lockedAreaDecimals.toFixed(2)}).`
          : `DOUBLE-SELLING BLOCKED: Attempting to sell ${transferArea.toFixed(2)} Decimals, but only ${availableArea.toFixed(2)} Decimals unlocked (${plot.lockedAreaDecimals.toFixed(2)} Decimals locked in pending e-Mutation).`,
        messageBn: balancePassed
          ? `হস্তান্তর প্রস্তাবিত: ${transferArea.toFixed(2)} শতাংশ। অবমুক্ত অবশিষ্ট: ${availableArea.toFixed(2)} শতাংশ (মোট: ${plot.totalAreaDecimals.toFixed(2)}, লককৃত: ${plot.lockedAreaDecimals.toFixed(2)})।`
          : `দ্বৈত বিক্রয় রোধ: ${transferArea.toFixed(2)} শতাংশ বিক্রির চেষ্টা, কিন্তু অবমুক্ত আছে মাত্র ${availableArea.toFixed(2)} শতাংশ (${plot.lockedAreaDecimals.toFixed(2)} শতাংশ পূর্ববর্তী মিউটেশনে লককৃত)।`
      },
      {
        id: 'mortgage',
        labelEn: '4. Financial Registry & Bank Mortgage Lien Check',
        labelBn: '৪. আর্থিক প্রতিষ্ঠান ও ব্যাংক দায়মুক্তি যাচাই',
        passed: mortgageFree,
        messageEn: mortgageFree
          ? 'Clear. No registered mortgages or liens with scheduled banks or financial institutions.'
          : `MORTGAGE FRAUD BLOCKED: Active bank lien registered by ${plot.mortgageDetails?.bankName || 'Scheduled Bank'} (Loan Acct: ${plot.mortgageDetails?.loanAccount}, BDT ${plot.mortgageDetails?.amountBDT.toLocaleString()}).`,
        messageBn: mortgageFree
          ? 'দায়মুক্ত। কোনো তফসিলি ব্যাংক বা আর্থিক প্রতিষ্ঠানে বন্ধকী দায় নেই।'
          : `বন্ধকী জালিয়াতি রোধ: ${plot.mortgageDetails?.bankName || 'ব্যাংক'} কর্তৃক সক্রিয় লিয়েন বা বন্ধক রয়েছে (ঋণ হিসাব: ${plot.mortgageDetails?.loanAccount}, পরিমাণ: ৳${plot.mortgageDetails?.amountBDT.toLocaleString()})।`
      },
      {
        id: 'court',
        labelEn: '5. Judiciary Case & Injunction Registry Check',
        labelBn: '৫. আদালত নিষেধাজ্ঞা ও দেওয়ানী মামলা যাচাই',
        passed: courtFree,
        messageEn: courtFree
          ? 'Clean title. No court stays, civil suits, or status-quo orders found.'
          : `COURT INJUNCTION BLOCKED: Active judicial stay order in ${plot.courtCaseDetails?.caseNo} (${plot.courtCaseDetails?.courtName}). Subject to Title Suit!`,
        messageBn: courtFree
          ? 'মামলামুক্ত। কোনো দেওয়ানী মামলা বা আদালতের স্থিতাবস্থা নিষেধাজ্ঞা নেই।'
          : `আদালত নিষেধাজ্ঞা বলবৎ: ${plot.courtCaseDetails?.caseNo} মামলায় আদালতের স্থগিতাদেশ বলবৎ রয়েছে (${plot.courtCaseDetails?.courtName})।`
      },
      {
        id: 'acquisition',
        labelEn: '6. DC Office Land Acquisition Status',
        labelBn: '৬. জেলা প্রশাসক (ডিসি অফিস) ভূমি অধিগ্রহণ স্থিতি',
        passed: acqFree,
        messageEn: acqFree
          ? 'Free. Not under any active government gazette for public infrastructure acquisition.'
          : `ACQUIRED LAND BLOCKED: Land acquired by DC Office for "${plot.acquisitionDetails?.projectName}" (Gazette #${plot.acquisitionDetails?.gazetteNo}). Private transfer illegal.`,
        messageBn: acqFree
          ? 'অধিগ্রহণমুক্ত। কোনো সরকারি উন্নয়ন প্রকল্পের জন্য গেজেটভুক্ত নয়।'
          : `ভূমি অধিগ্রহণ বলবৎ: ডিসি অফিস কর্তৃক "${plot.acquisitionDetails?.projectName}" প্রকল্পের জন্য অধিগ্রহণকৃত (গেজেট #${plot.acquisitionDetails?.gazetteNo})।`
      }
    ];

    const allPassed = checks.every(c => c.passed);

    let fraudTitleEn = '';
    let fraudTitleBn = '';
    let fraudReasonEn = '';
    let fraudReasonBn = '';

    if (!allPassed) {
      if (!balancePassed) {
        fraudTitleEn = 'Anti-Double-Selling Fraud Prevention Triggered';
        fraudTitleBn = 'দ্বৈত-বিক্রয় জালিয়াতি রোধ সিস্টেম সক্রিয়';
        fraudReasonEn = `Seller attempted to transfer ${transferArea.toFixed(2)} Decimals, exceeding the remaining unlocked balance of ${availableArea.toFixed(2)} Decimals. ${plot.lockedAreaDecimals.toFixed(2)} Decimals are currently escrow-locked in a pending e-Mutation.`;
        fraudReasonBn = `বিক্রেতা ${transferArea.toFixed(2)} শতাংশ জমি বিক্রির চেষ্টা করেছেন, অথচ অবমুক্ত অবশিষ্ট রয়েছে মাত্র ${availableArea.toFixed(2)} শতাংশ। বাকি ${plot.lockedAreaDecimals.toFixed(2)} শতাংশ ইতিমধ্যে অন্য মিউটেশনের জন্য ডিজিটালভাবে লক করা।`;
      } else if (!mortgageFree) {
        fraudTitleEn = 'Active Bank Mortgage Lien Detected';
        fraudTitleBn = 'সক্রিয় ব্যাংক বন্ধক ও দায় চিহ্নিত';
        fraudReasonEn = `This plot has a registered legal mortgage with ${plot.mortgageDetails?.bankName} (Acct: ${plot.mortgageDetails?.loanAccount}) for BDT ${plot.mortgageDetails?.amountBDT.toLocaleString()}. The Registration Act 1908 prohibits deed registration without an official NOC/Release letter from the bank.`;
        fraudReasonBn = `এই জমিটিতে ${plot.mortgageDetails?.bankName} (হিসাব: ${plot.mortgageDetails?.loanAccount}) এর নিকট ৳${plot.mortgageDetails?.amountBDT.toLocaleString()} টাকার সক্রিয় বন্ধক রয়েছে। ব্যাংকের অনাপত্তিপত্র (NOC) ব্যতীত জমি হস্তান্তর আইনত দণ্ডনীয়।`;
      } else if (!courtFree) {
        fraudTitleEn = 'Civil Court Injunction & Disputed Title Detected';
        fraudTitleBn = 'আদালতের নিষেধাজ্ঞা ও দেওয়ানী মামলা চিহ্নিত';
        fraudReasonEn = `An active judicial injunction (Order 39 Rule 1 CPC) has been issued by ${plot.courtCaseDetails?.courtName} under Case #${plot.courtCaseDetails?.caseNo}. Transferring this parcel constitutes contempt of court.`;
        fraudReasonBn = `${plot.courtCaseDetails?.courtName} কর্তৃক ${plot.courtCaseDetails?.caseNo} মামলায় জমিটির ওপর স্থিতাবস্থা (Injunction) জারি করা হয়েছে। হস্তান্তর প্রক্রিয়া তাৎক্ষণিক স্থগিত করা হলো।`;
      } else if (!acqFree) {
        fraudTitleEn = 'Government Infrastructure Acquisition Notice';
        fraudTitleBn = 'সরকারি অবকাঠামো ভূমি অধিগ্রহণ নোটিশ';
        fraudReasonEn = `This parcel has been gazetted for public acquisition by the DC Office for "${plot.acquisitionDetails?.projectName}". Private deed registration is strictly barred by law.`;
        fraudReasonBn = `জমিটি ডিসি অফিস কর্তৃক "${plot.acquisitionDetails?.projectName}" প্রকল্পের জন্য অধিগ্রহণভুক্ত। ব্যক্তিপর্যায়ে হস্তান্তর নিষিদ্ধ।`;
      } else if (!ownershipPassed) {
        fraudTitleEn = 'National Identity / Impersonation Blocked';
        fraudTitleBn = 'পরিচয় জালিয়াতি ও ভুল এনআইডি রোধ';
        fraudReasonEn = `The Dummy NID provided (${sellerNid}) does not match the registered Khatian owner NID (${plot.ownerNid}). Biometric & NID consensus failed.`;
        fraudReasonBn = `প্রদত্ত ডামি এনআইডি (${sellerNid}) সংশ্লিষ্ট খতিয়ানের বৈধ মালিকের এনআইডি (${plot.ownerNid}) এর সাথে মেলেনি।`;
      }
    }

    if (!allPassed) {
      setBlockedAttemptsCount(prev => prev + 1);
    }

    const result: VerificationResult = {
      passed: allPassed,
      checks,
      fraudTitleEn,
      fraudTitleBn,
      fraudReasonEn,
      fraudReasonBn,
    };

    setIsVerifying(false);
    setLastVerificationResult(result);
    return result;
  };

  const registerDeed = async (params: {
    plotId: string;
    buyerName: string;
    buyerNid: string;
    buyerPhone: string;
    transferAreaDecimals: number;
    saleValueBDT: number;
  }) => {
    const plot = khatians.find(k => k.id === params.plotId);
    if (!plot) return { success: false, error: 'Plot not found' };

    // Verify first
    const verification = await runFivePointVerification(
      params.plotId, 
      params.transferAreaDecimals, 
      plot.ownerNid
    );

    if (!verification.passed) {
      setFraudAlert({
        isOpen: true,
        titleEn: verification.fraudTitleEn || 'Verification Failed',
        titleBn: verification.fraudTitleBn || 'যাচাইকরণ ব্যর্থ হয়েছে',
        reasonEn: verification.fraudReasonEn || 'Land record checks failed.',
        reasonBn: verification.fraudReasonBn || 'জমির রেকর্ড যাচাইয়ে অসঙ্গতি দেখা গেছে।'
      });
      return { success: false, error: verification.fraudReasonEn };
    }

    // Auto-generate IDs
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `MUT-2026-${randomSuffix}`;
    const deedNo = `DEED-2026-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    const fees = calculateFees(params.saleValueBDT);

    // Cryptographic SHA-256 Hash of deed record
    const deedPayload = `${deedNo}|${plot.khatianNo}|${plot.dagNo}|${plot.ownerNid}|${params.buyerNid}|${params.transferAreaDecimals}|${params.saleValueBDT}|${nowIso}`;
    const sha256Hash = await computeSha256(deedPayload);

    const newDeed: DeedRecord = {
      deedNo,
      plotId: plot.id,
      khatianNo: plot.khatianNo,
      dagNo: plot.dagNo,
      mouza: plot.mouza,
      sellerName: plot.ownerName,
      sellerNid: plot.ownerNid,
      buyerName: params.buyerName,
      buyerNid: params.buyerNid,
      buyerPhone: params.buyerPhone,
      transferAreaDecimals: params.transferAreaDecimals,
      saleValueBDT: params.saleValueBDT,
      fees,
      registrationDate: nowIso,
      sha256Hash,
      status: 'MUTATION_PENDING',
      subRegistryOffice: `${plot.upazila} Sub-Registry Office`,
      trackingId,
    };

    // Auto-create e-Mutation case for AC Land queue
    const newMutation: MutationCase = {
      id: trackingId,
      deedNo,
      parentKhatianNo: plot.khatianNo,
      dagNo: plot.dagNo,
      mouza: plot.mouza,
      sellerName: plot.ownerName,
      sellerNid: plot.ownerNid,
      buyerName: params.buyerName,
      buyerNid: params.buyerNid,
      buyerPhone: params.buyerPhone,
      transferAreaDecimals: params.transferAreaDecimals,
      status: 'AUTO_INITIATED',
      autoInitiatedAt: nowIso,
      qrData: `SETULAND-VERIFIED:${trackingId}:${deedNo}:AREA-${params.transferAreaDecimals.toFixed(2)}`,
      workflowSteps: [
        { 
          step: 1, 
          nameEn: 'Deed Verified & Registered at Sub-Registry', 
          nameBn: 'সাব-রেজিস্ট্রি অফিসে দলিল যাচাই ও নিবন্ধিত', 
          completed: true, 
          timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Deed #${deedNo} registered. Fees paid: BDT ${fees.totalFeeBDT.toLocaleString()}`
        },
        { 
          step: 2, 
          nameEn: `Land Area Escrow Locked (${params.transferAreaDecimals.toFixed(2)} Decimals)`, 
          nameBn: `জমি ডিজিটালভাবে লক করা হয়েছে (${params.transferAreaDecimals.toFixed(2)} শতাংশ)`, 
          completed: true, 
          timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Anti-double-selling cryptographic lock applied to parent Khatian.'
        },
        { 
          step: 3, 
          nameEn: 'Zero-Touch Push to AC Land e-Mutation Queue', 
          nameBn: 'স্বয়ংক্রিয়ভাবে এসি ল্যান্ড ই-নামজারি কিউতে প্রেরিত', 
          completed: true, 
          timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Citizen does not need to submit separate application or pay separate mutation fee.'
        },
        { 
          step: 4, 
          nameEn: 'Union Land (Tahsil) Verification Report', 
          nameBn: 'তহশিলদার/ইউনিয়ন ভূমি সহকারী প্রতিবেদন', 
          completed: false,
          note: 'Awaiting digital confirmation of field possession.'
        },
        { 
          step: 5, 
          nameEn: 'AC Land Final Approval & Digital Khatian Splitting', 
          nameBn: 'এসি ল্যান্ড অনুমোদন ও ডিজিটাল পরচা তৈরি', 
          completed: false,
          note: 'Awaiting digital signature & automated ledger update.'
        }
      ]
    };

    // Update state:
    // 1. Lock the decimals on the plot immediately!
    setKhatians(prev => prev.map(k => {
      if (k.id === plot.id) {
        return {
          ...k,
          lockedAreaDecimals: Number((k.lockedAreaDecimals + params.transferAreaDecimals).toFixed(2)),
          lastUpdated: nowIso,
        };
      }
      return k;
    }));

    setDeeds(prev => [newDeed, ...prev]);
    setMutations(prev => [newMutation, ...prev]);

    // Open receipt modal
    setActiveDeedReceipt(newDeed);

    return { success: true, deed: newDeed, mutation: newMutation };
  };

  const verifyTahsilReport = (mutationId: string) => {
    setMutations(prev => prev.map(m => {
      if (m.id === mutationId) {
        const timeStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedSteps = m.workflowSteps.map(s => {
          if (s.step === 4) {
            return {
              ...s,
              completed: true,
              timestamp: timeStr,
              note: 'Tahsil field report approved: Physical possession, boundaries & boundary pillars verified.'
            };
          }
          return s;
        });

        return {
          ...m,
          status: 'TAHSIL_VERIFIED',
          tahsilVerifiedAt: new Date().toISOString(),
          tahsilOfficer: 'Md. Shafiqul Alam (Union Land Assistant Officer - Tahsildar)',
          workflowSteps: updatedSteps
        };
      }
      return m;
    }));
  };

  const approveMutation = async (mutationId: string): Promise<KhatianRecord | null> => {
    const mutation = mutations.find(m => m.id === mutationId);
    if (!mutation) return null;

    const parentPlot = khatians.find(k => k.khatianNo === mutation.parentKhatianNo && k.dagNo === mutation.dagNo);
    if (!parentPlot) return null;

    const nowIso = new Date().toISOString();
    const timeStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Determine new child Khatian number: e.g. BS-1001/A
    const suffixLetter = 'A';
    const newKhatianNo = `${parentPlot.khatianNo}/${suffixLetter}`;

    // Cryptographic hash for new Porcha
    const porchaPayload = `${newKhatianNo}|${parentPlot.dagNo}|${mutation.buyerNid}|${mutation.transferAreaDecimals}|${nowIso}`;
    const newPorchaHash = await computeSha256(porchaPayload);

    // 1. Create brand-new Khatian for Buyer
    const newBuyerKhatian: KhatianRecord = {
      id: `plot-${Date.now()}`,
      khatianNo: newKhatianNo,
      dagNo: parentPlot.dagNo,
      mouza: parentPlot.mouza,
      mouzaBn: parentPlot.mouzaBn,
      upazila: parentPlot.upazila,
      district: parentPlot.district,
      ownerName: mutation.buyerName,
      ownerNameBn: mutation.buyerName, // or localized
      ownerNid: mutation.buyerNid,
      ownerPhone: mutation.buyerPhone,
      totalAreaDecimals: mutation.transferAreaDecimals,
      lockedAreaDecimals: 0,
      landClass: parentPlot.landClass,
      isMortgaged: false,
      hasCourtCase: false,
      isAcquired: false,
      chainOfTitle: [
        ...parentPlot.chainOfTitle,
        {
          surveyType: 'BS',
          khatianNo: newKhatianNo,
          ownerName: `${mutation.buyerName} (Via e-Mutation ${mutation.id})`,
          ownerNid: mutation.buyerNid,
          year: 2026,
          areaDecimals: mutation.transferAreaDecimals,
          verified: true
        }
      ],
      sha256Hash: newPorchaHash,
      lastUpdated: nowIso,
      mapPolygon: {
        points: '220,130 280,130 285,185 225,185',
        center: [250, 155],
        label: `${newKhatianNo} (${mutation.transferAreaDecimals.toFixed(2)} Dec)`
      }
    };

    // 2. Deduct from Seller's parent Khatian
    // totalAreaDecimals is reduced, lockedAreaDecimals is cleared of this amount
    setKhatians(prev => {
      const updatedList = prev.map(k => {
        if (k.id === parentPlot.id) {
          const newTotal = Number(Math.max(0, k.totalAreaDecimals - mutation.transferAreaDecimals).toFixed(2));
          const newLocked = Number(Math.max(0, k.lockedAreaDecimals - mutation.transferAreaDecimals).toFixed(2));
          return {
            ...k,
            totalAreaDecimals: newTotal,
            lockedAreaDecimals: newLocked,
            lastUpdated: nowIso,
          };
        }
        return k;
      });
      return [newBuyerKhatian, ...updatedList];
    });

    // 3. Update Mutation record
    setMutations(prev => prev.map(m => {
      if (m.id === mutationId) {
        const updatedSteps = m.workflowSteps.map(s => {
          if (s.step === 4) return { ...s, completed: true, timestamp: s.timestamp || timeStr };
          if (s.step === 5) {
            return {
              ...s,
              completed: true,
              timestamp: timeStr,
              note: `Mutation Order Signed by AC Land. New Digital Porcha #${newKhatianNo} issued with SHA-256 integrity seal.`
            };
          }
          return s;
        });

        return {
          ...m,
          status: 'MUTATION_APPROVED',
          approvedAt: nowIso,
          approvedBy: 'Farhana Yasmin, BCS (Admin), AC Land Savar Upazila',
          newKhatianNo,
          digitalPorchaHash: newPorchaHash,
          workflowSteps: updatedSteps
        };
      }
      return m;
    }));

    // 4. Update Deed status to MUTATED
    setDeeds(prev => prev.map(d => {
      if (d.deedNo === mutation.deedNo) {
        return { ...d, status: 'MUTATED' };
      }
      return d;
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Open Digital Porcha modal
    setActivePorcha({ khatian: newBuyerKhatian, mutationId });

    return newBuyerKhatian;
  };

  const rejectMutation = (mutationId: string, reason: string) => {
    const mutation = mutations.find(m => m.id === mutationId);
    if (!mutation) return;

    // Unlock the locked area back to the seller!
    const parentPlot = khatians.find(k => k.khatianNo === mutation.parentKhatianNo && k.dagNo === mutation.dagNo);
    if (parentPlot) {
      setKhatians(prev => prev.map(k => {
        if (k.id === parentPlot.id) {
          return {
            ...k,
            lockedAreaDecimals: Number(Math.max(0, k.lockedAreaDecimals - mutation.transferAreaDecimals).toFixed(2))
          };
        }
        return k;
      }));
    }

    setMutations(prev => prev.map(m => {
      if (m.id === mutationId) {
        return {
          ...m,
          status: 'REJECTED',
          workflowSteps: m.workflowSteps.map(s => {
            if (s.step === 5) {
              return {
                ...s,
                completed: false,
                note: `REJECTED: ${reason}`
              };
            }
            return s;
          })
        };
      }
      return m;
    }));
  };

  const toggleBankMortgage = (plotId: string) => {
    setKhatians(prev => prev.map(k => {
      if (k.id === plotId) {
        const nextState = !k.isMortgaged;
        return {
          ...k,
          isMortgaged: nextState,
          mortgageDetails: nextState ? {
            bankName: 'Sonali Bank PLC (Dummy Corp Branch)',
            branch: 'Savar SME Branch',
            loanAccount: 'DUMMY-LN-7729',
            amountBDT: 4500000,
            mortgageDate: new Date().toISOString().split('T')[0]
          } : undefined
        };
      }
      return k;
    }));
  };

  const toggleCourtInjunction = (plotId: string) => {
    setKhatians(prev => prev.map(k => {
      if (k.id === plotId) {
        const nextState = !k.hasCourtCase;
        return {
          ...k,
          hasCourtCase: nextState,
          courtCaseDetails: nextState ? {
            caseNo: 'DUMMY-CIV-404/2026',
            courtName: 'Joint District Judge Court 1st Court, Gazipur',
            filedDate: new Date().toISOString().split('T')[0],
            reason: 'Title Suit & Temporary Injunction (Order 39 Rule 1 CPC) regarding co-sharer claim'
          } : undefined
        };
      }
      return k;
    }));
  };

  const toggleDcAcquisition = (plotId: string) => {
    setKhatians(prev => prev.map(k => {
      if (k.id === plotId) {
        const nextState = !k.isAcquired;
        return {
          ...k,
          isAcquired: nextState,
          acquisitionDetails: nextState ? {
            projectName: 'Dhaka-Ashulia Elevated Expressway Expansion Project (Dummy)',
            gazetteNo: 'EXTRA-GAZ-2026-88',
            ratePerDecimal: 850000,
            compensationStatus: 'PENDING'
          } : undefined
        };
      }
      return k;
    }));
  };

  const totalPlotsCount = khatians.length;
  const totalLockedDecimals = Number(khatians.reduce((acc, k) => acc + k.lockedAreaDecimals, 0).toFixed(2));
  const queuedMutationsCount = mutations.filter(m => m.status === 'AUTO_INITIATED' || m.status === 'TAHSIL_VERIFIED').length;

  return (
    <LandAppContext.Provider
      value={{
        khatians,
        deeds,
        mutations,
        activeRole,
        setActiveRole,
        language,
        setLanguage,
        selectedPlotId,
        setSelectedPlotId,
        activeDeedReceipt,
        setActiveDeedReceipt,
        activePorcha,
        setActivePorcha,
        fraudAlert,
        setFraudAlert,
        isVerifying,
        lastVerificationResult,
        runFivePointVerification,
        calculateFees,
        registerDeed,
        verifyTahsilReport,
        approveMutation,
        rejectMutation,
        toggleBankMortgage,
        toggleCourtInjunction,
        toggleDcAcquisition,
        resetDemoData,
        blockedAttemptsCount,
        totalPlotsCount,
        totalLockedDecimals,
        queuedMutationsCount,
      }}
    >
      {children}
    </LandAppContext.Provider>
  );
};

export const useLandApp = () => {
  const context = useContext(LandAppContext);
  if (!context) {
    throw new Error('useLandApp must be used within a LandAppProvider');
  }
  return context;
};
