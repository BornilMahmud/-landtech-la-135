'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Language, 
  ActiveRole, 
  Citizen, 
  KhatianRecord, 
  DeedRecord, 
  MutationCase, 
  AuditLogRecord, 
  VerificationCheckResult, 
  RevenueBreakdown,
  DigitalLtNotice,
  CoSharer,
  GovSmsLog,
  WarisanEstateCase,
  HeirMember,
  HeirRelationship
} from '@/lib/types';
import { 
  INITIAL_CITIZENS, 
  INITIAL_KHATIANS, 
  INITIAL_DEEDS, 
  INITIAL_MUTATIONS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_SMS_LOGS,
  INITIAL_WARISAN_CASES
} from '@/lib/seed-data';
import { 
  computeSha256, 
  computeChainedHash, 
  toDec, 
  formatDec, 
  toBanglaDigits, 
  fractionToTraditionalShare 
} from '@/lib/crypto-utils';
import confetti from 'canvas-confetti';

export interface LandRegistryContextType {
    // Theme & Notifications
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  isResetModalOpen: boolean;
  isDistrictExplorerOpen: boolean;
  setIsDistrictExplorerOpen: (open: boolean) => void;
  setIsResetModalOpen: (open: boolean) => void;
  notification: { id: string; messageEn: string; messageBn?: string; type?: "success" | "info" | "warning" | "error" } | null;
  showNotification: (msg: { en: string; bn?: string } | string, type?: "success" | "info" | "warning" | "error") => void;
  clearNotification: () => void;
  dismissNotification: () => void;

  isHydrated: boolean;
  citizens: Citizen[];
  khatians: KhatianRecord[];
  deeds: DeedRecord[];
  mutations: MutationCase[];
  auditLogs: AuditLogRecord[];
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedPlotId: string | null;
  setSelectedPlotId: (id: string | null) => void;
  blockedAttemptsCount: number;

  // Modals & Drawers
  activeDeedReceipt: DeedRecord | null;
  setActiveDeedReceipt: (deed: DeedRecord | null) => void;
  activePorcha: { khatian: KhatianRecord; mutationId?: string } | null;
  setActivePorcha: (porcha: { khatian: KhatianRecord; mutationId?: string } | null) => void;
  activeLtNotice: DigitalLtNotice | null;
  setActiveLtNotice: (notice: DigitalLtNotice | null) => void;
  lineageModalKhatian: KhatianRecord | null;
  setLineageModalKhatian: (khatian: KhatianRecord | null) => void;
  isAuditLogOpen: boolean;
  setIsAuditLogOpen: (open: boolean) => void;
  fraudAlertModal: { isOpen: boolean; titleEn: string; titleBn: string; reasonEn: string; reasonBn: string } | null;
  setFraudAlertModal: (alert: { isOpen: boolean; titleEn: string; titleBn: string; reasonEn: string; reasonBn: string } | null) => void;

  // Diagnostic & Transactional Actions
  isVerifying: boolean;
  lastVerificationResult: VerificationCheckResult | null;
  evaluateFivePointCheck: (
    khatian: KhatianRecord | undefined, 
    seller: Citizen | undefined, 
    buyer: Citizen | undefined, 
    transferAreaDecimals: number
  ) => VerificationCheckResult;
  runFivePointCheck: (
    khatianId: string, 
    sellerId: string, 
    buyerId: string, 
    transferAreaDecimals: number
  ) => Promise<VerificationCheckResult>;
  calculateRevenue: (
    salePriceBdt: number, 
    transferAreaDecimals: number, 
    officialRatePerDecimalBdt: number,
    ldTaxArrearBdt?: number
  ) => RevenueBreakdown;
  registerDeedAndTriggerMutation: (params: {
    khatianId: string;
    sellerId: string;
    buyerId: string;
    transferAreaDecimals: number;
    salePriceBdt: number;
  }) => Promise<{ success: boolean; deed?: DeedRecord; mutation?: MutationCase; error?: string }>;

  // AC Land Engine & SLA
  verifyTahsilReport: (mutationId: string) => void;
  approveMutationAndSplitKhatian: (mutationId: string) => Promise<KhatianRecord | null>;
  rejectMutation: (mutationId: string, reason: string) => void;
  simulateSlaDelay: (mutationId: string) => void;

  // Institutional Locks
  toggleBankMortgage: (khatianId: string) => void;
  toggleCourtInjunction: (khatianId: string) => void;
  toggleDcAcquisition: (khatianId: string) => void;

  // Real-time KPIs
  totalPlotsCount: number;
  totalLockedDecimals: number;
  queuedMutationsCount: number;

  // Gov-SMS Gateway
  smsLogs: GovSmsLog[];
  isSmsDrawerOpen: boolean;
  setIsSmsDrawerOpen: (open: boolean) => void;
  dispatchGovSms: (phone: string, name: string, msgEn: string, msgBn: string, triggerEvent?: string) => GovSmsLog;

  // Warisan (ওয়ারিশ) Heir Estate
  warisanCases: WarisanEstateCase[];
  isWarisanModalOpen: boolean;
  setIsWarisanModalOpen: (open: boolean) => void;
  selectedWarisanCase: WarisanEstateCase | null;
  setSelectedWarisanCase: (c: WarisanEstateCase | null) => void;
  calculateWarisanDistribution: (
    totalEstateDecimals: number,
    heirInputs: { nameEn: string; nameBn: string; relationship: HeirRelationship; dummyNid: string; phone: string }[]
  ) => HeirMember[];
  createWarisanEstateCase: (
    deceasedKhatianId: string,
    heirs: { nameEn: string; nameBn: string; relationship: HeirRelationship; dummyNid: string; phone: string }[]
  ) => WarisanEstateCase;
  approveWarisanMutation: (estateCaseId: string) => Promise<boolean>;

  // Demo state reset
  resetDemoData: () => void;
}

const LandRegistryContext = createContext<LandRegistryContextType | undefined>(undefined);

// ============================================================================
// FIX 1: Versioned LocalStorage Key & Auto-Migration Schema Guard
// ============================================================================
const STORAGE_KEY = 'SETULAND_STATE_V5_WARISAN';

interface StoredAppStateV4 {
  version: 'V5_WARISAN';
  citizens: Citizen[];
  khatians: KhatianRecord[];
  deeds: DeedRecord[];
  mutations: MutationCase[];
  auditLogs: AuditLogRecord[];
  smsLogs?: GovSmsLog[];
  warisanCases?: WarisanEstateCase[];
  language: Language;
  activeRole: ActiveRole;
  blockedAttemptsCount: number;
}

/**
 * Validates stored Khatian record schema defensively.
 */
function isValidKhatianRecord(k: any): boolean {
  if (!k || typeof k !== 'object') return false;
  if (typeof k.id !== 'string' || typeof k.khatianNo !== 'string') return false;
  if (!Array.isArray(k.lineageChain) || k.lineageChain.length === 0) return false;
  if (typeof k.totalAreaDecimals !== 'number' || typeof k.lockedAreaDecimals !== 'number') return false;
  if (typeof k.ldTaxArrearBdt !== 'number') return false;
  if (typeof k.recordHash !== 'string' || k.recordHash.length < 16) return false;
  return true;
}

/**
 * Helper to dynamically sub-divide quadrilateral SVG path for Jomabhag Khatian split
 */
function subDivideQuadPath(svgPath: string, sourceLabelX: number, sourceLabelY: number) {
  try {
    const matches = Array.from(svgPath.matchAll(/([0-9.]+)[,\s]+([0-9.]+)/g)).map(m => [Number(m[1]), Number(m[2])]);
    if (matches.length >= 4) {
      const [p1, p2, p3, p4] = matches;
      const mxTop = Math.round((p1[0] + p2[0]) / 2);
      const myTop = Math.round((p1[1] + p2[1]) / 2);
      const mxBottom = Math.round((p4[0] + p3[0]) / 2);
      const myBottom = Math.round((p4[1] + p3[1]) / 2);

      const parentPath = `M ${p1[0]},${p1[1]} L ${mxTop},${myTop} L ${mxBottom},${myBottom} L ${p4[0]},${p4[1]} Z`;
      const childPath = `M ${mxTop},${myTop} L ${p2[0]},${p2[1]} L ${p3[0]},${p3[1]} L ${mxBottom},${myBottom} Z`;

      return {
        parentPath,
        childPath,
        parentLabelX: Math.round((p1[0] + mxTop) / 2),
        parentLabelY: sourceLabelY,
        childLabelX: Math.round((mxTop + p2[0]) / 2),
        childLabelY: sourceLabelY,
      };
    }
  } catch (_) {}

  return {
    parentPath: svgPath,
    childPath: svgPath,
    parentLabelX: sourceLabelX - 25,
    parentLabelY: sourceLabelY,
    childLabelX: sourceLabelX + 25,
    childLabelY: sourceLabelY,
  };
}

// ============================================================================
// Pure Synchronous 5-Point Consensus & Quota Diagnostic Function
// ============================================================================
export function evaluateFivePointCheck(
  khatian: KhatianRecord | undefined, 
  seller: Citizen | undefined, 
  buyer: Citizen | undefined, 
  transferAreaDecimals: number
): VerificationCheckResult {
  if (!khatian || !seller || !buyer) {
    return {
      passedAll: false,
      timestamp: '2026-03-31T00:00:00.000Z',
      checks: {
        ownershipMatch: { passed: false, messageEn: 'Target plot or citizen record not found.', messageBn: 'রেকর্ড পাওয়া যায়নি', detail: '' },
        lineageContinuity: { passed: false, messageEn: 'Title lineage unavailable.', messageBn: 'মালিকানা ধারাবাহিকতা অনুপস্থিত', detail: '' },
        unlockedAreaBalance: { passed: false, messageEn: 'Area balance unavailable.', messageBn: 'জমির হিসাব অনুপস্থিত', availableDecimals: 0, requestedDecimals: 0 },
        bankMortgageClearance: { passed: false, messageEn: 'CIB verification unavailable.', messageBn: 'ব্যাংক তথ্য অনুপস্থিত', detail: '' },
        courtAndAcquisitionClearance: { passed: false, messageEn: 'Dispute record unavailable.', messageBn: 'মামলা তথ্য অনুপস্থিত', detail: '' }
      }
    };
  }

  // Check 1: NID & Biometrics
  const isCoSharerMatch = Boolean(khatian.isEjmaliProperty && (khatian.coSharers ?? []).some(cs => cs.citizenId === seller.id));
  const isOwnerMatch = Boolean((khatian.ownerId === seller.id || isCoSharerMatch) && seller.verifiedBiometric === true);
  const check1 = {
    passed: isOwnerMatch,
    messageEn: isOwnerMatch 
      ? `NID & Biometrics Match Verified: ${seller.nameEn} (${seller.dummyNid})`
      : `Ownership Mismatch: Seller is not an authenticated title-holder of Khatian ${khatian.khatianNo}!`,
    messageBn: isOwnerMatch
      ? `এনআইডি ও বায়োমেট্রিক নিশ্চিত: ${seller.nameBn} (${seller.dummyNid})`
      : `মালিকানায় অসঙ্গতি: বিক্রেতা খতিয়ান ${khatian.khatianNo} এর স্বত্বাধিকারী নন!`,
    detail: `Khatian Owner: ${khatian.ownerId} | Submitted: ${seller.id}`
  };

  // Check 2: 4-Stage Title Lineage
  const lineageChain = khatian.lineageChain ?? [];
  const hasBrokenChain = lineageChain.some(node => !node.verifiedMatch);
  const isParentRsMatched = lineageChain.some(
    node => node.surveyType === 'RS' && node.khatianNo === khatian.parentRsKhatian && node.verifiedMatch
  );
  const isLineageValid = !hasBrokenChain && isParentRsMatched;
  const check2 = {
    passed: isLineageValid,
    messageEn: isLineageValid
      ? `Unbroken 4-Generation Title Lineage Verified (CS ➔ SA ➔ RS ➔ BS)`
      : `Lineage Continuity Broken: Historical RS-to-BS ownership succession gap detected!`,
    messageBn: isLineageValid
      ? `৪ স্তরের ধারাবাহিক মালিকানা নিশ্চিত (সিএস ➔ এসএ ➔ আরএস ➔ বিএস)`
      : `মালিকানার ধারাবাহিকতা বিচ্ছিন্ন: আরএস হতে বিএস খতিয়ানে মধ্যবর্তী উত্তরণের রেকর্ড অনুপস্থিত!`,
    detail: `Parent RS: ${khatian.parentRsKhatian}`
  };

  // Check 3: Anti-Double-Selling & Ejmali Co-Sharer Quota
  const availableOverallArea = toDec(Math.max(0, khatian.totalAreaDecimals - khatian.lockedAreaDecimals));
  let isQuotaValid = true;
  let quotaAlertEn = '';
  let quotaAlertBn = '';
  let sellerShareFraction = 1.0;
  let sellerMaxDecimals = availableOverallArea;
  let sellerShareLabel = '১৬ আনা (১০০%)';

  const coSharers = khatian.coSharers ?? [];
  if (khatian.isEjmaliProperty && coSharers.length > 0) {
    const coSharer = coSharers.find(cs => cs.citizenId === seller.id) || coSharers[0];
    sellerShareFraction = coSharer.shareFraction;
    sellerShareLabel = coSharer.shareLabelBn;
    sellerMaxDecimals = toDec((khatian.totalAreaDecimals * coSharer.shareFraction) - (coSharer.lockedDecimals || 0));
    
    if (transferAreaDecimals > sellerMaxDecimals || transferAreaDecimals > availableOverallArea) {
      isQuotaValid = false;
      quotaAlertEn = `EJMALI QUOTA VIOLATION (শরিকের অতিরিক্ত জমি বিক্রয় রোধ): Seller only owns ${formatDec(sellerMaxDecimals)} Decimals (${(coSharer.shareFraction * 100).toFixed(0)}% share / ${coSharer.shareLabelBn}). Cannot sell ${formatDec(transferAreaDecimals)} Decimals!`;
      quotaAlertBn = `ইজমালি শরিকের অতিরিক্ত জমি বিক্রয় রোধ: বিক্রেতা এই খতিয়ানে মাত্র ${formatDec(sellerMaxDecimals)} শতাংশ জমির মালিক (${coSharer.shareLabelBn})। ${formatDec(transferAreaDecimals)} শতাংশ বিক্রির আবেদন অবৈধ!`;
    }
  } else {
    if (transferAreaDecimals <= 0 || transferAreaDecimals > availableOverallArea) {
      isQuotaValid = false;
      quotaAlertEn = `DOUBLE-SELLING FRAUD BLOCKED: Seller owns ${formatDec(khatian.totalAreaDecimals)} Dec, but ${formatDec(khatian.lockedAreaDecimals)} Dec are ALREADY LOCKED in active pending mutation! Only ${formatDec(availableOverallArea)} Dec available.`;
      quotaAlertBn = `দ্বৈত-বিক্রয় জালিয়াতি রোধ: বিক্রেতার মোট জমি ${formatDec(khatian.totalAreaDecimals)} শতাংশ, কিন্তু ${formatDec(khatian.lockedAreaDecimals)} শতাংশ জমি ইতোমধ্যেই চলমান নামজারিতে লককৃত! মাত্র ${formatDec(availableOverallArea)} শতাংশ অবশিষ্ট আছে।`;
    }
  }

  const check3 = {
    passed: isQuotaValid && transferAreaDecimals > 0,
    availableDecimals: toDec(Math.min(availableOverallArea, sellerMaxDecimals)),
    requestedDecimals: toDec(transferAreaDecimals),
    messageEn: isQuotaValid 
      ? `Sufficient Decimals & Valid Legal Quota: Transferring ${formatDec(transferAreaDecimals)} Dec out of ${formatDec(sellerMaxDecimals)} Dec seller share.`
      : quotaAlertEn,
    messageBn: isQuotaValid
      ? `পর্যাপ্ত বিক্রয়যোগ্য জমি ও বৈধ শরিকানা হিস্যা: বিক্রেতার নিজস্ব ${formatDec(sellerMaxDecimals)} শতাংশ জমি হতে ${formatDec(transferAreaDecimals)} শতাংশ হস্তান্তরের আবেদন।`
      : quotaAlertBn,
  };

  // Check 4: Bank Mortgage Lien
  const check4 = {
    passed: !khatian.isMortgaged,
    messageEn: !khatian.isMortgaged
      ? `No Active Bank Liens: Property clear of institutional mortgages (CIB Sync).`
      : `ACTIVE BANK MORTGAGE BLOCKED: Encumbered with ${khatian.mortgageBankEn || 'Scheduled Bank'} (Loan: ৳ ${(khatian.mortgageLoanAmountBdt || 0).toLocaleString()}). Sale blocked!`,
    messageBn: !khatian.isMortgaged
      ? `কোনো ব্যাংক বন্ধকী দায় নেই: জমিটি সকল তফসিলি ব্যাংক বা আর্থিক প্রতিষ্ঠানের দায়মুক্ত (সিআইবি সিঙ্ক)।`
      : `সক্রিয় ব্যাংক বন্ধকী জমি বিক্রির চেষ্টা রোধ: ${khatian.mortgageBankBn || 'তফসিলি ব্যাংক'} এ বন্ধকী দায় বিদ্যমান (ঋণ: ৳ ${(khatian.mortgageLoanAmountBdt || 0).toLocaleString()})। বিক্রয় স্থগিত!`,
    detail: khatian.isMortgaged ? `Bank: ${khatian.mortgageBankEn}` : 'Clear'
  };

  // Check 5: Judicial Injunction & DC Notice
  const hasDispute = Boolean(khatian.hasCourtCase || khatian.isDcAcquisition);
  const check5 = {
    passed: !hasDispute,
    messageEn: !hasDispute
      ? `Clear of Judicial Injunctions & Infrastructure Acquisitions.`
      : khatian.hasCourtCase
        ? `CIVIL COURT INJUNCTION BLOCKED: Active stay order in ${khatian.courtCaseNo || 'Title Suit #142/2025'}. Under Order 39 Rule 1 CPC, property transfer is strictly prohibited!`
        : `DC OFFICE LAND ACQUISITION BLOCKED: Gazetted for ${khatian.dcProjectNameEn || 'National Infrastructure'}. All private transfers are prohibited!`,
    messageBn: !hasDispute
      ? `আদালতের কোনো স্থগিতাদেশ বা সরকারি অধিগ্রহণ নেই।`
      : khatian.hasCourtCase
        ? `আদালতের নিষেধাজ্ঞায় বিক্রয় স্থগিত: দেওয়ানি আদালতের মামলা নং ${khatian.courtCaseNo || '১৪২/২০২৫'} এ স্থিতাবস্থা বহাল (অর্ডার ৩৯, রুল ১)।`
        : `জেলা প্রশাসক কার্যালয় কর্তৃক অধিগ্রহণকৃত: ${khatian.dcProjectNameBn || 'জাতীয় অবকাঠামো'} প্রকল্পের আওতাভুক্ত। ব্যক্তি মালিকানাধীন হস্তান্তর নিষিদ্ধ!`,
    detail: hasDispute ? (khatian.hasCourtCase ? khatian.courtCaseNo || 'Court Stay' : 'DC Project') : 'Clear'
  };

  const ejmaliCheck = {
    passed: isQuotaValid,
    isEjmali: khatian.isEjmaliProperty,
    sellerShareFraction,
    sellerShareLabel,
    sellerMaxDecimals,
    availableShareDecimals: toDec(Math.min(availableOverallArea, sellerMaxDecimals)),
    requestedDecimals: toDec(transferAreaDecimals),
    messageEn: isQuotaValid
      ? `Co-Sharer Quota Compliant: ${seller.nameEn} holds ${sellerShareLabel} (${(sellerShareFraction * 100).toFixed(0)}%). Personal ceiling: ${formatDec(sellerMaxDecimals)} Dec.`
      : quotaAlertEn,
    messageBn: isQuotaValid
      ? `শরিকানা অংশ সঠিক: ${seller.nameBn} এর অংশ ${sellerShareLabel}। ব্যক্তিগত অংশ সিলিং: ${formatDec(sellerMaxDecimals)} শতাংশ।`
      : quotaAlertBn,
  };

  const khajnaCheck = {
    passed: true,
    messageEn: (khatian.ldTaxArrearBdt || 0) > 0 
      ? `Khajna Arrears Detected: ৳ ${(khatian.ldTaxArrearBdt || 0).toLocaleString()} Due (Paid up to ${khatian.ldTaxPaidUpToBanglaYear}). Auto-bundled into unified checkout!`
      : `Khajna 100% Cleared up to ${khatian.ldTaxPaidUpToBanglaYear}. Dakhila #${khatian.dakhilaReceiptNo} active.`,
    messageBn: (khatian.ldTaxArrearBdt || 0) > 0
      ? `বকেয়া খাজনা চিহ্নিত: ৳ ${(khatian.ldTaxArrearBdt || 0).toLocaleString()} বকেয়া (${khatian.ldTaxPaidUpToBanglaYear} পর্যন্ত)। একীভূত ফি-তে স্বয়ংক্রিয় অন্তর্ভুক্ত!`
      : `${khatian.ldTaxPaidUpToBanglaYear} পর্যন্ত খাজনা পরিশোধিত। দাখিলা #${khatian.dakhilaReceiptNo} সঠিক।`,
    arrearBdt: khatian.ldTaxArrearBdt || 0,
    paidUpTo: khatian.ldTaxPaidUpToBanglaYear,
    dakhilaNo: khatian.dakhilaReceiptNo,
    autoBundled: (khatian.ldTaxArrearBdt || 0) > 0,
  };

  const passedAll = Boolean(check1.passed && check2.passed && check3.passed && check4.passed && check5.passed);

  return {
    passedAll,
    timestamp: new Date().toISOString(),
    checks: {
      ownershipMatch: check1,
      lineageContinuity: check2,
      unlockedAreaBalance: check3,
      bankMortgageClearance: check4,
      courtAndAcquisitionClearance: check5,
      ejmaliCoSharerQuota: ejmaliCheck,
      khajnaClearance: khajnaCheck,
    }
  };
}

export const LandRegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isDistrictExplorerOpen, setIsDistrictExplorerOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    id: string;
    messageEn: string;
    messageBn?: string;
    type?: "success" | "info" | "warning" | "error";
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("setuland_theme_mode") || localStorage.getItem("theme-mode");
      if (saved === "dark" || saved === "light") {
        setTheme(saved as "dark" | "light");
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", saved === "dark");
        }
      }
    } catch {}
  }, []);

  const showNotification = useCallback((
    msg: { en: string; bn?: string } | string,
    type: "success" | "info" | "warning" | "error" = "info"
  ) => {
    if (typeof msg === "string") {
      setNotification({ id: Date.now().toString(), messageEn: msg, messageBn: msg, type });
    } else {
      setNotification({ id: Date.now().toString(), messageEn: msg.en, messageBn: msg.bn, type });
    }
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const dismissNotification = clearNotification;
  const [citizens, setCitizens] = useState<Citizen[]>(INITIAL_CITIZENS);
  const [khatians, setKhatians] = useState<KhatianRecord[]>(INITIAL_KHATIANS);
  const [deeds, setDeeds] = useState<DeedRecord[]>(INITIAL_DEEDS);
  const [mutations, setMutations] = useState<MutationCase[]>(INITIAL_MUTATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);
  const [activeRole, setActiveRole] = useState<ActiveRole>('SUB_REGISTRAR');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>('plot-1');
  const [blockedAttemptsCount, setBlockedAttemptsCount] = useState<number>(3);

  // Modals & UI Drawers
  const [activeDeedReceipt, setActiveDeedReceipt] = useState<DeedRecord | null>(null);
  const [activePorcha, setActivePorcha] = useState<{ khatian: KhatianRecord; mutationId?: string } | null>(null);
  const [activeLtNotice, setActiveLtNotice] = useState<DigitalLtNotice | null>(null);
  const [lineageModalKhatian, setLineageModalKhatian] = useState<KhatianRecord | null>(null);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState<boolean>(false);
  const [fraudAlertModal, setFraudAlertModal] = useState<{ isOpen: boolean; titleEn: string; titleBn: string; reasonEn: string; reasonBn: string } | null>(null);

  // Module 8 & 9: Gov-SMS Gateway and Warisan Heir State
  const [smsLogs, setSmsLogs] = useState<GovSmsLog[]>(INITIAL_SMS_LOGS);
  const [isSmsDrawerOpen, setIsSmsDrawerOpen] = useState<boolean>(false);
  const [warisanCases, setWarisanCases] = useState<WarisanEstateCase[]>(INITIAL_WARISAN_CASES);
  const [isWarisanModalOpen, setIsWarisanModalOpen] = useState<boolean>(false);
  const [selectedWarisanCase, setSelectedWarisanCase] = useState<WarisanEstateCase | null>(INITIAL_WARISAN_CASES[0] || null);

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [lastVerificationResult, setLastVerificationResult] = useState<VerificationCheckResult | null>(null);

  // FIX 1 & 2: Versioned LocalStorage Load & Defensive Migration Guard
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          (parsed.version === 'V5_WARISAN' || parsed.version === 'V4_FINAL') &&
          Array.isArray(parsed.khatians) &&
          parsed.khatians.length >= 5 &&
          Array.isArray(parsed.citizens) &&
          Array.isArray(parsed.deeds) &&
          Array.isArray(parsed.mutations) &&
          Array.isArray(parsed.auditLogs)
        ) {
          const allKhatiansValid = parsed.khatians.every(isValidKhatianRecord);
          if (allKhatiansValid) {
            setCitizens(parsed.citizens);
            setKhatians(parsed.khatians);
            setDeeds(parsed.deeds);
            setMutations(parsed.mutations);
            setAuditLogs(parsed.auditLogs);
            if (Array.isArray(parsed.smsLogs)) setSmsLogs(parsed.smsLogs);
            if (Array.isArray(parsed.warisanCases)) {
              setWarisanCases(parsed.warisanCases);
              if (parsed.warisanCases.length > 0) setSelectedWarisanCase(parsed.warisanCases[0]);
            }
            if (parsed.language === 'en' || parsed.language === 'bn') setLanguage(parsed.language);
            if (parsed.activeRole) setActiveRole(parsed.activeRole);
            if (typeof parsed.blockedAttemptsCount === 'number') setBlockedAttemptsCount(parsed.blockedAttemptsCount);
            setIsHydrated(true);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage migration validation failed, resetting to seed defaults:', e);
    }

    // Default seed fallback
    setCitizens(INITIAL_CITIZENS);
    setKhatians(INITIAL_KHATIANS);
    setDeeds(INITIAL_DEEDS);
    setMutations(INITIAL_MUTATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSmsLogs(INITIAL_SMS_LOGS);
    setWarisanCases(INITIAL_WARISAN_CASES);
    setSelectedWarisanCase(INITIAL_WARISAN_CASES[0] || null);
    setIsHydrated(true);
  }, []);

  // Save to localStorage when state changes (after client hydration only)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToStore: StoredAppStateV4 = {
        version: 'V5_WARISAN',
        citizens,
        khatians,
        deeds,
        mutations,
        auditLogs,
        smsLogs,
        warisanCases,
        language,
        activeRole,
        blockedAttemptsCount,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch (e) {
      console.warn('Could not persist state to localStorage:', e);
    }
  }, [isHydrated, citizens, khatians, deeds, mutations, auditLogs, smsLogs, warisanCases, language, activeRole, blockedAttemptsCount]);

  // Module 9: Simulated Gov-SMS Gateway Dispatch Engine (88096...)
  const dispatchGovSms = (
    phone: string, 
    name: string, 
    msgEn: string, 
    msgBn: string, 
    triggerEvent = 'NOTIFICATION'
  ): GovSmsLog => {
    const newLog: GovSmsLog = {
      id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientPhone: phone,
      recipientName: name,
      messageEn: msgEn,
      messageBn: msgBn,
      gatewayRef: `GOV-SMS-88096-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      status: 'DELIVERED',
      triggerEvent,
    };
    setSmsLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // FIX 3: Unified Revenue Calculator with Strict 2-Decimal Fixed-Point Math
  const calculateRevenue = (
    salePriceBdt: number, 
    transferAreaDecimals: number, 
    officialRatePerDecimalBdt: number,
    ldTaxArrearBdt = 0
  ): RevenueBreakdown => {
    const minimumGovtValueBdt = toDec(transferAreaDecimals * officialRatePerDecimalBdt);
    const assessableValueBdt = toDec(Math.max(salePriceBdt, minimumGovtValueBdt));

    const stampDutyBdt = toDec(Math.round(assessableValueBdt * 0.015)); // 1.5%
    const registrationFeeBdt = toDec(Math.round(assessableValueBdt * 0.010)); // 1.0%
    const localGovtTaxBdt = toDec(Math.round(assessableValueBdt * 0.030)); // 3.0%
    const sourceTaxGainBdt = toDec(Math.round(assessableValueBdt * 0.040)); // 4.0%
    const bundledEMutationFeeBdt = 1170; // Fixed e-Mutation fee

    const totalPayableBdt = toDec(
      stampDutyBdt + registrationFeeBdt + localGovtTaxBdt + sourceTaxGainBdt + bundledEMutationFeeBdt + ldTaxArrearBdt
    );

    return {
      declaredValueBdt: toDec(salePriceBdt),
      minimumGovtValueBdt,
      assessableValueBdt,
      stampDutyBdt,
      registrationFeeBdt,
      localGovtTaxBdt,
      sourceTaxGainBdt,
      bundledEMutationFeeBdt,
      ldTaxArrearBdt: toDec(ldTaxArrearBdt),
      totalPayableBdt,
    };
  };

  // 5-Point Pre-Registration Consensus Diagnostic Action
  const runFivePointCheck = async (
    khatianId: string, 
    sellerId: string, 
    buyerId: string, 
    transferAreaDecimals: number
  ): Promise<VerificationCheckResult> => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 200));

    const khatian = khatians.find(k => k.id === khatianId);
    const seller = citizens.find(c => c.id === sellerId);
    const buyer = citizens.find(c => c.id === buyerId);

    const result = evaluateFivePointCheck(khatian, seller, buyer, transferAreaDecimals);
    if (!result.passedAll) {
      setBlockedAttemptsCount(prev => prev + 1);
    }

    setLastVerificationResult(result);
    setIsVerifying(false);
    return result;
  };

  // Register Deed and Auto-Trigger e-Mutation
  const registerDeedAndTriggerMutation = async (params: {
    khatianId: string;
    sellerId: string;
    buyerId: string;
    transferAreaDecimals: number;
    salePriceBdt: number;
  }): Promise<{ success: boolean; deed?: DeedRecord; mutation?: MutationCase; error?: string }> => {
    const khatian = khatians.find(k => k.id === params.khatianId);
    const seller = citizens.find(c => c.id === params.sellerId);
    const buyer = citizens.find(c => c.id === params.buyerId);

    if (!khatian || !seller || !buyer) {
      return { success: false, error: 'Records not found' };
    }

    const checkRes = evaluateFivePointCheck(khatian, seller, buyer, params.transferAreaDecimals);
    if (!checkRes.passedAll) {
      setLastVerificationResult(checkRes);
      return { success: false, error: '5-Point Verification Failed. Cannot register deed.' };
    }

    const now = new Date().toISOString();
    const deedNo = `DEED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingId = `MUT-2026-${Math.floor(5000 + Math.random() * 4999)}`;
    const caseNo = `MISC-CASE-2026-${Math.floor(100 + Math.random() * 900)}`;
    const ltNoticeNo = `LT-SEC89-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const freshDakhilaNo = `DAKHILA-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const revenue = calculateRevenue(
      params.salePriceBdt, 
      params.transferAreaDecimals, 
      khatian.officialRatePerDecimalBdt,
      khatian.ldTaxArrearBdt
    );

    // Block Hash Chain calculation
    const lastAuditLog = auditLogs[auditLogs.length - 1];
    const previousHash = lastAuditLog?.currentHash || '0000000000000000000000000000000000000000000000000000000000000000';
    const nextBlockIndex = (lastAuditLog?.blockIndex || 0) + 1;

    const deedPayload = `${previousHash}|${deedNo}|${khatian.khatianNo}|${khatian.dagNo}|${seller.dummyNid}|${buyer.dummyNid}|${params.transferAreaDecimals}|${params.salePriceBdt}|${now}`;
    const deedHash = await computeSha256(deedPayload);

    // Generate Statutory Digital LT Notice Packet (Section 89 SAT Act 1950)
    const ltNotice: DigitalLtNotice = {
      ltNoticeNo,
      statutoryReference: 'Section 89, State Acquisition and Tenancy Act 1950',
      deedNo,
      khatianNo: khatian.khatianNo,
      dagNo: khatian.dagNo,
      mouzaEn: khatian.mouzaEn,
      mouzaBn: khatian.mouzaBn,
      sellerName: seller.nameEn,
      sellerNid: seller.dummyNid,
      buyerName: buyer.nameEn,
      buyerNid: buyer.dummyNid,
      transferDecimals: toDec(params.transferAreaDecimals),
      dakhilaReceiptNo: freshDakhilaNo,
      bundledMutationFeeReceiptNo: 'E-MUT-FEE-1170-BDT',
      sha256PacketSeal: deedHash,
      dispatchedAtTimestamp: now,
      recipientOffice: `Assistant Commissioner (Land), ${khatian.upazilaEn} Upazila`,
      status: 'AUTO_TRANSMITTED_TO_AC_LAND',
    };

    const newDeed: DeedRecord = {
      id: `deed-${Date.now()}`,
      deedNo,
      khatianId: khatian.id,
      khatianNo: khatian.khatianNo,
      dagNo: khatian.dagNo,
      mouzaEn: khatian.mouzaEn,
      mouzaBn: khatian.mouzaBn,
      sellerId: seller.id,
      buyerId: buyer.id,
      transferAreaDecimals: toDec(params.transferAreaDecimals),
      salePriceBdt: toDec(params.salePriceBdt),
      revenue,
      verificationSnapshot: checkRes,
      deedHash,
      blockIndex: nextBlockIndex,
      previousHash,
      linkedMutationTrackingId: trackingId,
      ltNotice,
      preEmptionNoticeSent: khatian.isEjmaliProperty,
      dakhilaReceiptNo: freshDakhilaNo,
      createdAt: now,
    };

    const newMutation: MutationCase = {
      id: `mut-${Date.now()}`,
      trackingId,
      caseNo,
      deedId: newDeed.id,
      deedNo,
      sourceKhatianId: khatian.id,
      sourceKhatianNo: khatian.khatianNo,
      dagNo: khatian.dagNo,
      sellerId: seller.id,
      buyerId: buyer.id,
      transferAreaDecimals: toDec(params.transferAreaDecimals),
      stage: 'STAGE_3_AUTO_SENT_TO_AC_LAND',
      slaTargetDays: 7,
      statutoryMaxDays: 28,
      daysElapsed: 1,
      escalationStatus: 'ON_TRACK',
      ltNotice,
      dakhilaReceiptNo: freshDakhilaNo,
      tahsilReportNoteEn: 'Auto-dispatched from Sub-Registry with Section 89 Digital LT Notice. Awaiting Tahsil ground inquiry.',
      tahsilReportNoteBn: 'সাব-রেজিস্ট্রি হতে ধারা ৮৯ এর ডিজিটাল এলটি নোটিশসহ স্বয়ংক্রিয় প্রেরিত। সরেজমিন তদন্তের অপেক্ষায়।',
      mutationHash: await computeSha256(`${trackingId}|${khatian.khatianNo}|${params.transferAreaDecimals}|${now}`),
      createdAt: now,
      updatedAt: now,
    };

    // Update Master Khatian: Increment locked decimals and clear Khajna arrears
    const newLocked = toDec(khatian.lockedAreaDecimals + params.transferAreaDecimals);
    const updatedKhatians = khatians.map(k => {
      if (k.id === khatian.id) {
        let updatedCoSharers = k.coSharers;
        if (k.isEjmaliProperty && k.coSharers) {
          updatedCoSharers = k.coSharers.map(cs => {
            if (cs.citizenId === seller.id) {
              return {
                ...cs,
                lockedDecimals: toDec(cs.lockedDecimals + params.transferAreaDecimals),
              };
            }
            return cs;
          });
        }

        return {
          ...k,
          lockedAreaDecimals: newLocked,
          ldTaxArrearBdt: 0,
          dakhilaReceiptNo: freshDakhilaNo,
          ldTaxPaidUpToBanglaYear: '1433 BS (2026 - PAID)',
          preEmptionNoticeSent: k.isEjmaliProperty,
          coSharers: updatedCoSharers,
          lastUpdated: now,
        };
      }
      return k;
    });

    const auditPayload = `DEED_REGISTERED|${deedNo}|${khatian.khatianNo}|${ltNoticeNo}|${now}`;
    const auditHash = await computeChainedHash(previousHash, auditPayload);

    const newAuditLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: nextBlockIndex,
      timestamp: now,
      eventType: 'DEED_REGISTERED',
      entityId: deedNo,
      detailsEn: `Deed #${deedNo} registered. ${formatDec(params.transferAreaDecimals)} Dec locked on ${khatian.khatianNo}. Digital LT Notice #${ltNoticeNo} auto-dispatched to AC Land with 100% Khajna clearance.`,
      detailsBn: `দলিল নং ${deedNo} নিবন্ধিত। খতিয়ান ${khatian.khatianNo} এ ${formatDec(params.transferAreaDecimals)} শতাংশ জমি এসক্রো লককৃত। ধারা ৮৯ এর ডিজিটাল এলটি নোটিশ #${ltNoticeNo} এবং খাজনা দাখিলা সহ এসি ল্যান্ডে প্রেরিত।`,
      actorRole: 'Sub-Registrar Office',
      actorName: 'Sub-Registrar, Savar',
      prevHash: previousHash,
      currentHash: auditHash,
    };

    setKhatians(updatedKhatians);
    setDeeds(prev => [newDeed, ...prev]);
    setMutations(prev => [newMutation, ...prev]);
    setAuditLogs(prev => [...prev, newAuditLog]);
    setActiveDeedReceipt(newDeed);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}

    // Module 9: Dispatch Gov-SMS alerts to Seller and Buyer
    dispatchGovSms(
      seller.phone,
      seller.nameEn,
      `[GOV-LAND] Sub-Kabala Deed #${deedNo} registered. ${formatDec(params.transferAreaDecimals)} Dec locked on Khatian ${khatian.khatianNo}. e-Mutation Tracking ID: ${trackingId}.`,
      `[GOV-LAND] ভূমি সেবা: সাব-কবলা দলিল নং ${deedNo} নিবন্ধিত। খতিয়ান ${khatian.khatianNo} থেকে ${formatDec(params.transferAreaDecimals)} শতক জমি লক করা হয়েছে। ই-নামজারি ট্র্যাকিং: ${trackingId}।`,
      'DEED_REGISTERED'
    );

    dispatchGovSms(
      buyer.phone,
      buyer.nameEn,
      `[GOV-LAND] Deed #${deedNo} registered in your favor. e-Mutation auto-dispatched to AC Land with 100% Khajna clearance. Tracking: ${trackingId}.`,
      `[GOV-LAND] ভূমি সেবা: আপনার বরাবরে দলিল নং ${deedNo} নিবন্ধিত হয়েছে। শতভাগ খাজনা পরিশোধসহ স্বয়ংক্রিয় ই-নামজারি এসি ল্যান্ডে প্রেরণ করা হয়েছে। ট্র্যাকিং: ${trackingId}।`,
      'DEED_REGISTERED'
    );

    if (khatian.isEjmaliProperty && khatian.coSharers) {
      khatian.coSharers.forEach(cs => {
        if (cs.citizenId !== seller.id) {
          const csCitizen = citizens.find(c => c.id === cs.citizenId || c.dummyNid === cs.dummyNid);
          const csPhone = csCitizen?.phone || '01712-334455';
          dispatchGovSms(
            csPhone,
            cs.nameEn,
            `[GOV-LAND] Statutory Sec 96 Notice: Co-sharer ${seller.nameEn} initiated transfer on Khatian ${khatian.khatianNo}. Pre-emption window open for 60 days.`,
            `[GOV-LAND] ভূমি সেবা: ধারা ৯৬ নোটিশ: খতিয়ান ${khatian.khatianNo} এর সহ-শরিক ${seller.nameBn} কর্তৃক জমি হস্তান্তরের আবেদন। ৬০ দিনের মধ্যে অগ্রক্রয় অধিকার প্রয়োগ করতে পারবেন।`,
            'PRE_EMPTION_NOTICE'
          );
        }
      });
    }

    return { success: true, deed: newDeed, mutation: newMutation };
  };

  // AC Land Step 1: Tahsil Ground Report Verification
  const verifyTahsilReport = (mutationId: string) => {
    const now = new Date().toISOString();
    setMutations(prev => prev.map(m => {
      if (m.id === mutationId) {
        return {
          ...m,
          stage: 'STAGE_4_TAHSIL_VERIFIED',
          tahsilReportNoteEn: 'Union Land Assistant Officer (Tahsil) verified boundaries, peaceful physical possession, and Dakhila tax clearance.',
          tahsilReportNoteBn: 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা সরেজমিন তদন্ত সম্পন্ন করেছেন। সীমানা, দখল ও দাখিলা রশিদ সঠিক।',
          tahsilVerifiedAt: now,
          updatedAt: now,
        };
      }
      return m;
    }));

    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const newAuditLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: now,
      eventType: 'TAHSIL_VERIFIED',
      entityId: mutationId,
      detailsEn: `Union Land (Tahsil) field inquiry verified for Mutation #${mutationId}. Dakhila clearance validated.`,
      detailsBn: `নামজারি মামলা #${mutationId} এর ইউনিয়ন ভূমি তদন্ত প্রতিবেদন ও দাখিলা অনুমোদিত।`,
      actorRole: 'Union Land Office',
      actorName: 'Tahsildar, Union Land Office',
      prevHash,
      previousHash: prevHash,
      currentHash: `tahsil_${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, newAuditLog]);
  };

  // Module 6: Simulate 8-day SLA delay for anti-harassment escalation demo
  const simulateSlaDelay = (mutationId: string) => {
    const now = new Date().toISOString();
    setMutations(prev => prev.map(m => {
      if (m.id === mutationId) {
        return {
          ...m,
          daysElapsed: 8,
          escalationStatus: 'ESCALATED_TO_ADC_REVENUE',
          updatedAt: now,
        };
      }
      return m;
    }));

    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const newAuditLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: now,
      eventType: 'SLA_ESCALATED',
      entityId: mutationId,
      detailsEn: `7-Day Fast-Track SLA Breached (Day 8). Automatically escalated to Additional Deputy Commissioner (ADC Revenue) & UNO for delay audit.`,
      detailsBn: `৭ দিনের ফাস্ট-ট্র্যাক এসএলএ অতিক্রম (৮ম দিন)। বিলম্বের কারণ দর্শাতে অতিরিক্ত জেলা প্রশাসক (রাজস্ব) ও ইউএনও বরাবর স্বয়ংক্রিয় এস্কেলেটকৃত।`,
      actorRole: 'Anti-Harassment SLA Engine',
      actorName: 'SetuLand Automated Accountability Gate',
      prevHash,
      previousHash: prevHash,
      currentHash: `sla_${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, newAuditLog]);
  };

  // FIX 7: AC Land Step 2: Approve e-Mutation & Execute Automated Jomabhag Khatian Splitting with Dynamic GIS Geometry
  const approveMutationAndSplitKhatian = async (mutationId: string): Promise<KhatianRecord | null> => {
    const mutation = mutations.find(m => m.id === mutationId);
    if (!mutation) return null;

    const sourceKhatian = khatians.find(k => k.id === mutation.sourceKhatianId || k.khatianNo === mutation.sourceKhatianNo);
    const buyer = citizens.find(c => c.id === mutation.buyerId);

    if (!sourceKhatian || !buyer) return null;

    const now = new Date().toISOString();
    const nextLetter = String.fromCharCode(65 + (khatians.filter(k => k.khatianNo.startsWith(sourceKhatian.khatianNo)).length));
    const newKhatianNo = `${sourceKhatian.khatianNo}/${nextLetter}`;
    const newHoldingNo = `HOLD-2026-${sourceKhatian.dagNo}/${nextLetter}`;

    // 1. Deduct area from Seller's parent Khatian (Jomabhag deduction)
    const remainingTotal = toDec(sourceKhatian.totalAreaDecimals - mutation.transferAreaDecimals);
    const remainingLocked = toDec(Math.max(0, sourceKhatian.lockedAreaDecimals - mutation.transferAreaDecimals));

    const updatedSourceHash = await computeSha256(`${sourceKhatian.khatianNo}|${remainingTotal}|${sourceKhatian.ownerId}|${now}`);

    // Dynamic GIS Mouza Sub-Division Polygon Calculation
    const splitGeometry = subDivideQuadPath(sourceKhatian.svgPath, sourceKhatian.labelX, sourceKhatian.labelY);

    const updatedSourceKhatian: KhatianRecord = {
      ...sourceKhatian,
      totalAreaDecimals: remainingTotal,
      lockedAreaDecimals: remainingLocked,
      isSplitPlot: true,
      svgPath: splitGeometry.parentPath,
      labelX: splitGeometry.parentLabelX,
      labelY: splitGeometry.parentLabelY,
      subDivisionLabel: `${sourceKhatian.khatianNo} (Retained)`,
      recordHash: updatedSourceHash,
      lastUpdated: now,
    };

    // 2. Generate Brand-New Buyer Khatian (Porcha)
    const newKhatianPayload = `${newKhatianNo}|${sourceKhatian.dagNo}/1|${buyer.id}|${mutation.transferAreaDecimals}|${now}`;
    const newKhatianHash = await computeSha256(newKhatianPayload);

    const buyerLineage = [
      ...(sourceKhatian.lineageChain ?? []),
      {
        surveyType: 'BS' as const,
        khatianNo: newKhatianNo,
        dagNo: `${sourceKhatian.dagNo}/1`,
        recordedOwnerEn: `${buyer.nameEn} (Jomabhag e-Mutation #${mutation.trackingId})`,
        recordedOwnerBn: `${buyer.nameBn} (জমাভাগ ই-নামজারি #${mutation.trackingId})`,
        areaDecimals: toDec(mutation.transferAreaDecimals),
        year: 2026,
        verifiedMatch: true,
      }
    ];

    const newBuyerKhatian: KhatianRecord = {
      id: `plot-${Date.now()}`,
      khatianNo: newKhatianNo,
      parentRsKhatian: sourceKhatian.parentRsKhatian,
      parentBsKhatian: sourceKhatian.khatianNo,
      holdingNo: newHoldingNo,
      districtEn: sourceKhatian.districtEn,
      districtBn: sourceKhatian.districtBn,
      upazilaEn: sourceKhatian.upazilaEn,
      upazilaBn: sourceKhatian.upazilaBn,
      mouzaEn: sourceKhatian.mouzaEn,
      mouzaBn: sourceKhatian.mouzaBn,
      jlNo: sourceKhatian.jlNo,
      dagNo: `${sourceKhatian.dagNo}/1`,
      landClassEn: sourceKhatian.landClassEn,
      landClassBn: sourceKhatian.landClassBn,
      ownerId: buyer.id,
      totalAreaDecimals: toDec(mutation.transferAreaDecimals),
      lockedAreaDecimals: 0.00,
      officialRatePerDecimalBdt: sourceKhatian.officialRatePerDecimalBdt,
      isEjmaliProperty: false,
      coSharers: [],
      ldTaxPaidUpToBanglaYear: '1433 BS (2026)',
      ldTaxArrearBdt: 0,
      dakhilaReceiptNo: mutation.dakhilaReceiptNo || `DAKHILA-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      isMortgaged: false,
      hasCourtCase: false,
      isDcAcquisition: false,
      svgPath: splitGeometry.childPath,
      labelX: splitGeometry.childLabelX,
      labelY: splitGeometry.childLabelY,
      isSplitPlot: true,
      subDivisionLabel: `✂️ JOMABHAG SPLIT: ${newKhatianNo}`,
      lineageChain: buyerLineage,
      blockIndex: (sourceKhatian.blockIndex || 1) + 1,
      previousHash: sourceKhatian.recordHash,
      recordHash: newKhatianHash,
      lastUpdated: now,
    };

    // 3. Update Mutation Case
    setMutations(prev => prev.map(m => {
      if (m.id === mutationId) {
        return {
          ...m,
          stage: 'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED',
          acLandApprovedAt: now,
          issuedNewKhatianNo: newKhatianNo,
          issuedNewKhatianId: newBuyerKhatian.id,
          sellerRemainingDecimalsAfterSplit: remainingTotal,
          holdingNo: newHoldingNo,
          updatedAt: now,
        };
      }
      return m;
    }));

    // 4. Update Khatians
    setKhatians(prev => {
      const filtered = prev.filter(k => k.id !== sourceKhatian.id);
      return [updatedSourceKhatian, newBuyerKhatian, ...filtered];
    });

    // 5. Append Audit Logs
    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const auditPayload = `KHATIAN_SPLIT|${newKhatianNo}|${mutation.transferAreaDecimals}|${now}`;
    const auditHash = await computeChainedHash(prevHash, auditPayload);

    const splitAuditLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: now,
      eventType: 'KHATIAN_SPLIT',
      entityId: newKhatianNo,
      detailsEn: `AC Land executed Jomabhag Split for e-Mutation #${mutation.trackingId}. Parent ${sourceKhatian.khatianNo} deducted to ${formatDec(remainingTotal)} Dec. New Khatian ${newKhatianNo} (Holding #${newHoldingNo}) issued to ${buyer.nameEn} for ${formatDec(mutation.transferAreaDecimals)} Dec.`,
      detailsBn: `এসি ল্যান্ড কর্তৃক নামজারি #${mutation.trackingId} এর জমাভাগ খতিয়ান বিভাজন সম্পন্ন। মূল খতিয়ান ${sourceKhatian.khatianNo} এ অবশিষ্ট ${formatDec(remainingTotal)} শতাংশ। ক্রেতা ${buyer.nameBn} এর বরাবরে নতুন খতিয়ান ${newKhatianNo} (হোল্ডিং #${newHoldingNo}) সৃজিত।`,
      actorRole: 'AC Land Office',
      actorName: 'Assistant Commissioner (Land), Savar',
      prevHash,
      previousHash: prevHash,
      currentHash: auditHash,
    };

    setAuditLogs(prev => [...prev, splitAuditLog]);
    setActivePorcha({ khatian: newBuyerKhatian, mutationId: mutation.trackingId });

    // Module 9: Dispatch Gov-SMS to Buyer for final Porcha issuance
    dispatchGovSms(
      buyer.phone,
      buyer.nameEn,
      `[GOV-LAND] e-Mutation #${mutation.trackingId} Approved! Brand-new Khatian #${newKhatianNo} and Holding #${newHoldingNo} issued. Decimals: ${formatDec(mutation.transferAreaDecimals)}.`,
      `[GOV-LAND] ভূমি সেবা: আপনার ই-নামজারি মামলা #${mutation.trackingId} অনুমোদিত! নতুন জমাভাগ খতিয়ান #${newKhatianNo} এবং হোল্ডিং #${newHoldingNo} সৃজন সম্পন্ন। জমির পরিমাণ: ${formatDec(mutation.transferAreaDecimals)} শতক।`,
      'MUTATION_APPROVED'
    );

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    } catch (_) {}

    return newBuyerKhatian;
  };

  const rejectMutation = (mutationId: string, reason: string) => {
    const now = new Date().toISOString();
    setMutations(prev => prev.map(m => {
      if (m.id === mutationId) {
        return {
          ...m,
          stage: 'REJECTED_DISCREPANCY',
          tahsilReportNoteEn: `Rejected: ${reason}`,
          tahsilReportNoteBn: `বাতিল: ${reason}`,
          updatedAt: now,
        };
      }
      return m;
    }));

    const mutation = mutations.find(m => m.id === mutationId);
    if (mutation) {
      setKhatians(prev => prev.map(k => {
        if (k.id === mutation.sourceKhatianId || k.khatianNo === mutation.sourceKhatianNo) {
          return {
            ...k,
            lockedAreaDecimals: toDec(Math.max(0, k.lockedAreaDecimals - mutation.transferAreaDecimals)),
            lastUpdated: now,
          };
        }
        return k;
      }));
    }
  };

  const toggleBankMortgage = (khatianId: string) => {
    const now = new Date().toISOString();
    setKhatians(prev => prev.map(k => {
      if (k.id === khatianId) {
        const nextState = !k.isMortgaged;
        return {
          ...k,
          isMortgaged: nextState,
          mortgageBankEn: nextState ? 'Sonali Bank PLC (Dummy Corporate Branch)' : undefined,
          mortgageBankBn: nextState ? 'সোনালী ব্যাংক পিএলসি (কর্পোরেট শাখা)' : undefined,
          mortgageLoanAmountBdt: nextState ? 3500000 : undefined,
          lastUpdated: now,
        };
      }
      return k;
    }));

    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const newLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: now,
      eventType: 'BANK_MORTGAGE_TOGGLED',
      entityId: khatianId,
      detailsEn: `Bank Mortgage Lien status modified on Plot #${khatianId}.`,
      detailsBn: `প্লট #${khatianId} এ ব্যাংক বন্ধকী স্ট্যাটাস হালনাগাদ করা হয়েছে।`,
      actorRole: 'Commercial Bank API',
      actorName: 'Sonali Bank CIB Gateway',
      prevHash,
      previousHash: prevHash,
      currentHash: `mortgage_${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const toggleCourtInjunction = (khatianId: string) => {
    const now = new Date().toISOString();
    setKhatians(prev => prev.map(k => {
      if (k.id === khatianId) {
        const nextState = !k.hasCourtCase;
        return {
          ...k,
          hasCourtCase: nextState,
          courtCaseNo: nextState ? 'Title Suit No. DUMMY-CIV-404/2026' : undefined,
          courtDetailsEn: nextState ? '2nd Joint District Judge Court — Status Quo Injunction' : undefined,
          courtDetailsBn: nextState ? '২য় যুগ্ম জেলা জজ আদালত — স্থিতাবস্থা নিষেধাজ্ঞা' : undefined,
          lastUpdated: now,
        };
      }
      return k;
    }));

    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const newLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: now,
      eventType: 'COURT_INJUNCTION_TOGGLED',
      entityId: khatianId,
      detailsEn: `Judicial Stay Order status updated on Plot #${khatianId}.`,
      detailsBn: `প্লট #${khatianId} এ দেওয়ানি আদালতের নিষেধাজ্ঞা হালনাগাদ করা হয়েছে।`,
      actorRole: 'Civil Judiciary Gateway',
      actorName: 'Joint District Judge Court 2',
      prevHash,
      previousHash: prevHash,
      currentHash: `court_${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const toggleDcAcquisition = (khatianId: string) => {
    const now = new Date().toISOString();
    setKhatians(prev => prev.map(k => {
      if (k.id === khatianId) {
        const nextState = !k.isDcAcquisition;
        return {
          ...k,
          isDcAcquisition: nextState,
          dcProjectNameEn: nextState ? 'Dhaka-Ashulia Elevated Expressway Corridor - LA Case #DUMMY-09/2026' : undefined,
          dcProjectNameBn: nextState ? 'ঢাকা-আশুলিয়া এলিভেটেড এক্সপ্রেসওয়ে করিডোর — ভূমি অধিগ্রহণ কেস নং ৯/২০২৬' : undefined,
          lastUpdated: now,
        };
      }
      return k;
    }));

    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const newLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: now,
      eventType: 'DC_ACQUISITION_TOGGLED',
      entityId: khatianId,
      detailsEn: `DC Office Land Acquisition gazette notice toggled on Plot #${khatianId}.`,
      detailsBn: `প্লট #${khatianId} এ ডিসি অফিস ভূমি অধিগ্রহণ সংক্রান্ত তথ্য হালনাগাদ করা হয়েছে।`,
      actorRole: 'DC Revenue Office',
      actorName: 'Deputy Commissioner Land Acquisition Branch',
      prevHash,
      previousHash: prevHash,
      currentHash: `dc_${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  // ============================================================================
  // MODULE 8: WARISAN (ওয়ারিশ) HEIR INHERITANCE ENGINE & SUCCESSION JOMABHAG SPLIT
  // ============================================================================

  const calculateWarisanDistribution = (
    totalEstateDecimals: number,
    heirInputs: { nameEn: string; nameBn: string; relationship: HeirRelationship; dummyNid: string; phone: string }[]
  ): HeirMember[] => {
    if (heirInputs.length === 0 || totalEstateDecimals <= 0) return [];

    const wives = heirInputs.filter(h => h.relationship === 'WIFE');
    const husbands = heirInputs.filter(h => h.relationship === 'HUSBAND');
    const sons = heirInputs.filter(h => h.relationship === 'SON');
    const daughters = heirInputs.filter(h => h.relationship === 'DAUGHTER');
    const fathers = heirInputs.filter(h => h.relationship === 'FATHER');
    const mothers = heirInputs.filter(h => h.relationship === 'MOTHER');
    const brothers = heirInputs.filter(h => h.relationship === 'BROTHER');
    const sisters = heirInputs.filter(h => h.relationship === 'SISTER');

    const hasChildren = (sons.length + daughters.length) > 0;
    const hasMultipleSiblings = (brothers.length + sisters.length) >= 2;

    // Fixed shares allocation
    let fixedFractionTotal = 0;
    const fractionMap = new Map<string, { fraction: number; labelBn: string }>();

    // 1. Wife share (1/8 if children, 1/4 if no children; shared equally among wives)
    if (wives.length > 0) {
      const wifePoolFraction = hasChildren ? 0.125 : 0.25; // 1/8 or 1/4
      fixedFractionTotal += wifePoolFraction;
      const perWifeFraction = wifePoolFraction / wives.length;
      wives.forEach(w => {
        fractionMap.set(w.dummyNid, {
          fraction: perWifeFraction,
          labelBn: hasChildren ? `১/৮ অংশ (${wives.length > 1 ? 'স্ত্রীদের মধ্যে সমবণ্টন' : 'স্ত্রী'})` : '১/৪ অংশ (স্ত্রী)',
        });
      });
    }

    // 2. Husband share (1/4 if children, 1/2 if no children)
    if (husbands.length > 0) {
      const husbandFraction = hasChildren ? 0.25 : 0.50;
      fixedFractionTotal += husbandFraction;
      husbands.forEach(h => {
        fractionMap.set(h.dummyNid, {
          fraction: husbandFraction,
          labelBn: hasChildren ? '১/৪ অংশ (স্বামী)' : '১/২ অংশ (স্বামী)',
        });
      });
    }

    // 3. Mother share (1/6 if children or 2+ siblings, else 1/3)
    if (mothers.length > 0) {
      const motherFraction = (hasChildren || hasMultipleSiblings) ? (1 / 6) : (1 / 3);
      fixedFractionTotal += motherFraction;
      mothers.forEach(m => {
        fractionMap.set(m.dummyNid, {
          fraction: motherFraction,
          labelBn: (hasChildren || hasMultipleSiblings) ? '১/৬ অংশ (মাতা)' : '১/৩ অংশ (মাতা)',
        });
      });
    }

    // 4. Father share (1/6 if children exist)
    if (fathers.length > 0) {
      if (hasChildren) {
        const fatherFraction = 1 / 6;
        fixedFractionTotal += fatherFraction;
        fathers.forEach(f => {
          fractionMap.set(f.dummyNid, {
            fraction: fatherFraction,
            labelBn: '১/৬ অংশ (পিতা)',
          });
        });
      }
    }

    // 5. Remaining residue (আসাবা) to children or siblings/father
    const residue = Math.max(0, 1 - fixedFractionTotal);

    if (hasChildren) {
      if (sons.length > 0) {
        // Sons get 2 parts, Daughters get 1 part
        const totalUnits = (sons.length * 2) + daughters.length;
        const unitFraction = residue / totalUnits;

        sons.forEach(s => {
          const sFrac = unitFraction * 2;
          fractionMap.set(s.dummyNid, {
            fraction: sFrac,
            labelBn: 'অবশিষ্টের ২ অংশ (পুত্র)',
          });
        });

        daughters.forEach(d => {
          const dFrac = unitFraction * 1;
          fractionMap.set(d.dummyNid, {
            fraction: dFrac,
            labelBn: 'অবশিষ্টের ১ অংশ (কন্যা)',
          });
        });
      } else {
        // Only daughters
        if (daughters.length === 1) {
          const dFrac = Math.min(residue, 0.5); // 1/2
          daughters.forEach(d => {
            fractionMap.set(d.dummyNid, { fraction: dFrac, labelBn: '১/২ অংশ (একমাত্র কন্যা)' });
          });
        } else {
          const poolFrac = Math.min(residue, 2 / 3); // 2/3
          const perDaughter = poolFrac / daughters.length;
          daughters.forEach(d => {
            fractionMap.set(d.dummyNid, { fraction: perDaughter, labelBn: '২/৩ অংশ (কন্যাদের সমবণ্টন)' });
          });
        }
      }
    } else if (fathers.length > 0 && !fractionMap.has(fathers[0].dummyNid)) {
      // Father takes entire residue if no children
      fractionMap.set(fathers[0].dummyNid, {
        fraction: residue,
        labelBn: 'সম্পূর্ণ অবশিষ্ট অংশ (পিতা)',
      });
    } else if (brothers.length > 0 || sisters.length > 0) {
      // Siblings receive residue: brother gets 2x sister
      const totalSiblingUnits = (brothers.length * 2) + sisters.length;
      if (totalSiblingUnits > 0) {
        const unitFraction = residue / totalSiblingUnits;
        brothers.forEach(b => {
          fractionMap.set(b.dummyNid, {
            fraction: unitFraction * 2,
            labelBn: 'অবশিষ্টের ২ অংশ (সহোদর ভাই)',
          });
        });
        sisters.forEach(s => {
          fractionMap.set(s.dummyNid, {
            fraction: unitFraction * 1,
            labelBn: 'অবশিষ্টের ১ অংশ (সহোদর বোন)',
          });
        });
      }
    }

    // Build HeirMember array with strict decimal math and traditional Ana/Gonda labels
    let assignedSum = 0;
    const heirs: HeirMember[] = heirInputs.map((input, idx) => {
      const shareInfo = fractionMap.get(input.dummyNid) || {
        fraction: 1 / heirInputs.length,
        labelBn: 'সমবণ্টন',
      };
      const rawDecimals = toDec(totalEstateDecimals * shareInfo.fraction);
      assignedSum = toDec(assignedSum + rawDecimals);

      const traditional = fractionToTraditionalShare(shareInfo.fraction);

      return {
        id: `heir-${idx + 1}-${Date.now()}`,
        nameEn: input.nameEn,
        nameBn: input.nameBn,
        relationship: input.relationship,
        dummyNid: input.dummyNid,
        phone: input.phone,
        calculatedShareFraction: shareInfo.fraction,
        assignedDecimals: rawDecimals,
        shareLabelBn: shareInfo.labelBn,
        anaShareStr: traditional.labelBn,
      };
    });

    // Precision balance check: if assignedSum slightly differs from totalEstateDecimals due to rounding, adjust last heir
    if (heirs.length > 0) {
      const diff = toDec(totalEstateDecimals - assignedSum);
      if (diff !== 0) {
        heirs[heirs.length - 1].assignedDecimals = toDec(heirs[heirs.length - 1].assignedDecimals + diff);
      }
    }

    return heirs;
  };

  const createWarisanEstateCase = (
    deceasedKhatianId: string,
    heirsInput: { nameEn: string; nameBn: string; relationship: HeirRelationship; dummyNid: string; phone: string }[]
  ): WarisanEstateCase => {
    const parentKhatian = khatians.find(k => k.id === deceasedKhatianId) || khatians[0];
    const deceasedCitizen = citizens.find(c => c.id === parentKhatian.ownerId);

    const calculatedHeirs = calculateWarisanDistribution(parentKhatian.totalAreaDecimals, heirsInput);

    const newCase: WarisanEstateCase = {
      id: `warisan-${Date.now()}`,
      deceasedKhatianId: parentKhatian.id,
      deceasedKhatianNo: parentKhatian.khatianNo,
      deceasedOwnerNameEn: deceasedCitizen ? `Late ${deceasedCitizen.nameEn}` : `Late Owner of ${parentKhatian.khatianNo}`,
      deceasedOwnerNameBn: deceasedCitizen ? `মরহুম ${deceasedCitizen.nameBn}` : `মরহুম মালিক (${parentKhatian.khatianNo})`,
      totalEstateDecimals: parentKhatian.totalAreaDecimals,
      heirs: calculatedHeirs,
      status: 'PENDING_VERIFICATION',
      createdAt: new Date().toISOString(),
    };

    setWarisanCases(prev => [newCase, ...prev]);
    setSelectedWarisanCase(newCase);
    return newCase;
  };

  const approveWarisanMutation = async (estateCaseId: string): Promise<boolean> => {
    const estateCase = warisanCases.find(c => c.id === estateCaseId);
    if (!estateCase || estateCase.status === 'APPROVED_MUTATION_GENERATED') return false;

    const parentKhatian = khatians.find(k => k.id === estateCase.deceasedKhatianId || k.khatianNo === estateCase.deceasedKhatianNo);
    if (!parentKhatian) return false;

    const now = new Date().toISOString();
    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';

    // Create split Khatians for each heir
    const newKhatians: KhatianRecord[] = [];
    const newCitizens: Citizen[] = [];

    estateCase.heirs.forEach((heir, idx) => {
      const splitKhatianNo = `${parentKhatian.khatianNo}/W${idx + 1}`;
      const splitDagNo = `${parentKhatian.dagNo}/${toBanglaDigits(idx + 1)}`;
      const splitHolding = `HOLD-WARISAN-2026-${parentKhatian.dagNo}/W${idx + 1}`;

      // Check if citizen exists, else create dummy citizen record
      let heirCitizen = citizens.find(c => c.dummyNid === heir.dummyNid);
      if (!heirCitizen) {
        heirCitizen = {
          id: `citizen-warisan-${Date.now()}-${idx}`,
          dummyNid: heir.dummyNid,
          nameEn: heir.nameEn,
          nameBn: heir.nameBn,
          fatherNameEn: estateCase.deceasedOwnerNameEn,
          fatherNameBn: estateCase.deceasedOwnerNameBn,
          phone: heir.phone,
          verifiedBiometric: true,
        };
        newCitizens.push(heirCitizen);
      }

      // Generate staggered offset coordinate so they don't overlap
      const offsetX = (idx % 2 === 0 ? -1 : 1) * (20 + idx * 10);
      const offsetY = (idx < 2 ? -1 : 1) * (15 + idx * 8);

      const splitKhatian: KhatianRecord = {
        id: `khatian-warisan-${Date.now()}-${idx}`,
        khatianNo: splitKhatianNo,
        parentRsKhatian: parentKhatian.parentRsKhatian,
        parentBsKhatian: parentKhatian.khatianNo,
        holdingNo: splitHolding,
        districtEn: parentKhatian.districtEn,
        districtBn: parentKhatian.districtBn,
        upazilaEn: parentKhatian.upazilaEn,
        upazilaBn: parentKhatian.upazilaBn,
        mouzaEn: parentKhatian.mouzaEn,
        mouzaBn: parentKhatian.mouzaBn,
        jlNo: parentKhatian.jlNo,
        dagNo: splitDagNo,
        landClassEn: parentKhatian.landClassEn,
        landClassBn: parentKhatian.landClassBn,
        ownerId: heirCitizen.id,
        totalAreaDecimals: heir.assignedDecimals,
        lockedAreaDecimals: 0,
        officialRatePerDecimalBdt: parentKhatian.officialRatePerDecimalBdt,
        isEjmaliProperty: false,
        ldTaxPaidUpToBanglaYear: '1433 BS (2026)',
        ldTaxArrearBdt: 0,
        dakhilaReceiptNo: `DAKHILA-WARISAN-2026-${1000 + idx}`,
        isMortgaged: false,
        hasCourtCase: false,
        isDcAcquisition: false,
        svgPath: parentKhatian.svgPath,
        labelX: Math.max(80, Math.min(540, parentKhatian.labelX + offsetX)),
        labelY: Math.max(60, Math.min(440, parentKhatian.labelY + offsetY)),
        isSplitPlot: true,
        subDivisionLabel: `${splitKhatianNo} (${heir.assignedDecimals} Dec)`,
        lineageChain: [
          ...parentKhatian.lineageChain,
          {
            surveyType: 'BS',
            khatianNo: splitKhatianNo,
            dagNo: splitDagNo,
            recordedOwnerEn: `${heir.nameEn} (Warisan Succession)`,
            recordedOwnerBn: `${heir.nameBn} (উত্তরাধিকার সূত্রে ওয়ারিশান)`,
            areaDecimals: heir.assignedDecimals,
            year: 2026,
            verifiedMatch: true,
          },
        ],
        blockIndex: (parentKhatian.blockIndex || 1) + idx + 1,
        previousHash: parentKhatian.recordHash,
        recordHash: `warisan_hash_${splitKhatianNo}_${heir.assignedDecimals}`,
        lastUpdated: now,
      };

      newKhatians.push(splitKhatian);

      // Dispatch Gov-SMS to each heir
      dispatchGovSms(
        heir.phone,
        heir.nameEn,
        `[GOV-LAND] Warisan Mutation Approved: Inheritance share of ${formatDec(heir.assignedDecimals)} Decimals from ${estateCase.deceasedOwnerNameEn} (Khatian ${estateCase.deceasedKhatianNo}) finalized. New Digital Khatian #${splitKhatianNo} issued.`,
        `[GOV-LAND] ভূমি সেবা: ওয়ারিশান নামজারি অনুমোদিত! ${estateCase.deceasedOwnerNameBn} এর খতিয়ান ${estateCase.deceasedKhatianNo} হতে আপনার হিস্যা মোতাবেক ${formatDec(heir.assignedDecimals)} শতক জমির নতুন ডিজিটাল খতিয়ান #${splitKhatianNo} ও হোল্ডিং #${splitHolding} সফলভাবে সৃজন করা হয়েছে।`,
        'WARISAN_ESTATE_DISTRIBUTED'
      );
    });

    // Update parent Khatian to mark estate distributed
    const updatedKhatians = khatians.map(k => {
      if (k.id === parentKhatian.id) {
        return {
          ...k,
          totalAreaDecimals: 0,
          lockedAreaDecimals: 0,
          isSplitPlot: true,
          subDivisionLabel: `ESTATE DISTRIBUTED (${estateCase.heirs.length} HEIRS)`,
          lastUpdated: now,
        };
      }
      return k;
    });

    // Update warisanCases
    setWarisanCases(prev => prev.map(c => c.id === estateCaseId ? { ...c, status: 'APPROVED_MUTATION_GENERATED' } : c));
    if (newCitizens.length > 0) setCitizens(prev => [...prev, ...newCitizens]);
    setKhatians([...updatedKhatians, ...newKhatians]);

    // Audit log
    const auditLog: AuditLogRecord = {
      id: `log-warisan-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: now,
      eventType: 'WARISAN_ESTATE_DISTRIBUTED',
      entityId: estateCase.id,
      detailsEn: `Warisan estate of ${estateCase.deceasedOwnerNameEn} (${parentKhatian.khatianNo}) divided among ${estateCase.heirs.length} heirs. ${newKhatians.length} new Khatians issued with SMS dispatch.`,
      detailsBn: `${estateCase.deceasedOwnerNameBn} (${parentKhatian.khatianNo}) এর সম্পত্তি ${estateCase.heirs.length} জন ওয়ারিশের মাঝে বণ্টনপূর্বক ${newKhatians.length} টি নতুন খতিয়ান সৃজিত ও এসএমএস প্রেরিত।`,
      actorRole: 'AC Land Warisan Succession Bench',
      actorName: 'AC Land, Savar',
      prevHash,
      previousHash: prevHash,
      currentHash: `warisan_audit_${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, auditLog]);

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    } catch (_) {}

    return true;
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.clear();
    } catch (_) {}

    setCitizens(INITIAL_CITIZENS);
    setKhatians(INITIAL_KHATIANS);
    setDeeds(INITIAL_DEEDS);
    setMutations(INITIAL_MUTATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSmsLogs(INITIAL_SMS_LOGS);
    setWarisanCases(INITIAL_WARISAN_CASES);
    setSelectedWarisanCase(INITIAL_WARISAN_CASES[0] || null);
    setIsWarisanModalOpen(false);
    setIsSmsDrawerOpen(false);
    setLanguage('en');
    setActiveRole('SUB_REGISTRAR');
    setSelectedPlotId('plot-1');
    setBlockedAttemptsCount(3);
    setLastVerificationResult(null);
    setActiveDeedReceipt(null);
    setActivePorcha(null);
    setActiveLtNotice(null);
  };

  const totalPlotsCount = khatians.length;
  const totalLockedDecimals = toDec(khatians.reduce((acc, k) => acc + (k.lockedAreaDecimals || 0), 0));
  const queuedMutationsCount = mutations.filter(
    m => m.stage !== 'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED' && m.stage !== 'REJECTED_DISCREPANCY'
  ).length;

  return (
    <LandRegistryContext.Provider
      value={{
        isHydrated,
        citizens,
        khatians,
        deeds,
        mutations,
        auditLogs,
        activeRole,
        setActiveRole,
        language,
        setLanguage,
        selectedPlotId,
        setSelectedPlotId,
        blockedAttemptsCount,

        activeDeedReceipt,
        setActiveDeedReceipt,
        activePorcha,
        setActivePorcha,
        activeLtNotice,
        setActiveLtNotice,
        lineageModalKhatian,
        setLineageModalKhatian,
        isAuditLogOpen,
        setIsAuditLogOpen,
        fraudAlertModal,
        setFraudAlertModal,

        isVerifying,
        lastVerificationResult,
        evaluateFivePointCheck,
        runFivePointCheck,
        calculateRevenue,
        registerDeedAndTriggerMutation,

        verifyTahsilReport,
        approveMutationAndSplitKhatian,
        rejectMutation,
        simulateSlaDelay,

        toggleBankMortgage,
        toggleCourtInjunction,
        toggleDcAcquisition,

        // Gov-SMS Gateway
        smsLogs,
        isSmsDrawerOpen,
        setIsSmsDrawerOpen,
        dispatchGovSms,

        // Warisan (ওয়ারিশ) Heir Estate
        warisanCases,
        isWarisanModalOpen,
        setIsWarisanModalOpen,
        selectedWarisanCase,
        setSelectedWarisanCase,
        calculateWarisanDistribution,
        createWarisanEstateCase,
        approveWarisanMutation,

        totalPlotsCount,
        totalLockedDecimals,
        queuedMutationsCount,

        resetDemoData,
        theme,
        setTheme,
        isResetModalOpen,
        setIsResetModalOpen,
        isDistrictExplorerOpen,
        setIsDistrictExplorerOpen,
        notification,
        showNotification,
        clearNotification,
        dismissNotification,
      }}
    >
      {children}
    </LandRegistryContext.Provider>
  );
};

export const useLandRegistry = () => {
  const context = useContext(LandRegistryContext);
  if (!context) {
    throw new Error('useLandRegistry must be used within a LandRegistryProvider');
  }
  return context;
};

export const useLandApp = useLandRegistry;
