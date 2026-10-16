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
  AcquisitionDetails,
  Citizen,
  AuditLogRecord,
  GovSmsLog,
  WarisanEstateCase,
  HeirMember,
  HeirRelationship,
  DigitalLtNotice,
  CoSharer,
  SlaStatus
} from '@/types';
import { INITIAL_KHATIANS, INITIAL_DEEDS, INITIAL_MUTATIONS } from '@/lib/dummyData';
import { 
  INITIAL_CITIZENS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SMS_LOGS, 
  INITIAL_WARISAN_CASES 
} from '@/lib/seed-data';
import { 
  computeSha256, 
  computeChainedHash, 
  toDec, 
  formatDec, 
  fractionToTraditionalShare, 
  toBanglaDigits 
} from '@/lib/crypto-utils';
import confetti from 'canvas-confetti';

interface LandAppContextType {
  citizens: Citizen[];
  khatians: KhatianRecord[];
  deeds: DeedRecord[];
  mutations: MutationCase[];
  auditLogs: AuditLogRecord[];
  smsLogs: GovSmsLog[];
  warisanCases: WarisanEstateCase[];
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedPlotId: string | null;
  setSelectedPlotId: (id: string | null) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  
  // Modals & UI states
  activeDeedReceipt: DeedRecord | null;
  setActiveDeedReceipt: (deed: DeedRecord | null) => void;
  activePorcha: { khatian: KhatianRecord; mutationId?: string } | null;
  setActivePorcha: (data: { khatian: KhatianRecord; mutationId?: string } | null) => void;
  activeLtNotice: DigitalLtNotice | null;
  setActiveLtNotice: (notice: DigitalLtNotice | null) => void;
  lineageModalKhatian: KhatianRecord | null;
  setLineageModalKhatian: (khatian: KhatianRecord | null) => void;
  fraudAlert: { isOpen: boolean; titleEn: string; titleBn: string; reasonEn: string; reasonBn: string } | null;
  setFraudAlert: (alert: { isOpen: boolean; titleEn: string; titleBn: string; reasonEn: string; reasonBn: string } | null) => void;
  isResetModalOpen: boolean;
  setIsResetModalOpen: (open: boolean) => void;
  isAuditLogOpen: boolean;
  setIsAuditLogOpen: (open: boolean) => void;
  isSmsDrawerOpen: boolean;
  setIsSmsDrawerOpen: (open: boolean) => void;
  isWarisanModalOpen: boolean;
  setIsWarisanModalOpen: (open: boolean) => void;
  selectedWarisanCase: WarisanEstateCase | null;
  setSelectedWarisanCase: (c: WarisanEstateCase | null) => void;
  
  // Notification Toast (1s smooth fade-in)
  notification: { id: string; messageEn: string; messageBn?: string; type?: 'success' | 'info' | 'warning' } | null;
  showNotification: (msg: { en: string; bn?: string } | string, type?: 'success' | 'info' | 'warning') => void;
  clearNotification: () => void;
  
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

  // AC Land Workflow & SLA
  verifyTahsilReport: (mutationId: string) => void;
  approveMutation: (mutationId: string) => Promise<KhatianRecord | null>;
  rejectMutation: (mutationId: string, reason: string) => void;
  simulateSlaDelay: (mutationId: string) => void;

  // Locks & Govt Control
  toggleBankMortgage: (plotId: string) => void;
  toggleCourtInjunction: (plotId: string) => void;
  toggleDcAcquisition: (plotId: string) => void;

  // Gov-SMS Gateway
  dispatchGovSms: (phone: string, name: string, msgEn: string, msgBn: string, triggerEvent?: string) => GovSmsLog;

  // Warisan (ওয়ারিশ) Heir Estate
  calculateWarisanDistribution: (
    totalEstateDecimals: number,
    heirInputs: { nameEn: string; nameBn: string; relationship: HeirRelationship; dummyNid: string; phone: string }[]
  ) => HeirMember[];
  createWarisanEstateCase: (
    deceasedKhatianId: string,
    heirs: { nameEn: string; nameBn: string; relationship: HeirRelationship; dummyNid: string; phone: string }[]
  ) => WarisanEstateCase;
  approveWarisanMutation: (estateCaseId: string) => Promise<boolean>;

  // Executive KPI Metrics
  blockedAttemptsCount: number;
  totalPlotsCount: number;
  totalLockedDecimals: number;
  queuedMutationsCount: number;

  // Demo state
  resetDemoData: () => void;
}

const LandAppContext = createContext<LandAppContextType | undefined>(undefined);

const STORAGE_KEY_KHATIANS = 'setuland_khatians_v2';
const STORAGE_KEY_DEEDS = 'setuland_deeds_v2';
const STORAGE_KEY_MUTATIONS = 'setuland_mutations_v2';
const STORAGE_KEY_AUDIT = 'setuland_audit_logs_v2';
const STORAGE_KEY_SMS = 'setuland_sms_logs_v2';
const STORAGE_KEY_WARISAN = 'setuland_warisan_cases_v2';
const STORAGE_KEY_LANG = 'setuland_lang_v1';
const STORAGE_KEY_BLOCKED = 'setuland_blocked_count_v1';
const STORAGE_KEY_THEME = 'setuland_theme_mode';

export const LandAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [citizens, setCitizens] = useState<Citizen[]>(INITIAL_CITIZENS);
  const [khatians, setKhatians] = useState<KhatianRecord[]>(INITIAL_KHATIANS);
  const [deeds, setDeeds] = useState<DeedRecord[]>(INITIAL_DEEDS);
  const [mutations, setMutations] = useState<MutationCase[]>(INITIAL_MUTATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);
  const [smsLogs, setSmsLogs] = useState<GovSmsLog[]>(INITIAL_SMS_LOGS);
  const [warisanCases, setWarisanCases] = useState<WarisanEstateCase[]>(INITIAL_WARISAN_CASES);
  const [selectedWarisanCase, setSelectedWarisanCase] = useState<WarisanEstateCase | null>(INITIAL_WARISAN_CASES[0] || null);
  
  const [activeRole, setActiveRole] = useState<RoleType>('sub_registrar');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setThemeState] = useState<'dark' | 'light'>('light');
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>('plot-1');
  const [blockedAttemptsCount, setBlockedAttemptsCount] = useState<number>(3);
  
  // Modals & UI States
  const [activeDeedReceipt, setActiveDeedReceipt] = useState<DeedRecord | null>(null);
  const [activePorcha, setActivePorcha] = useState<{ khatian: KhatianRecord; mutationId?: string } | null>(null);
  const [activeLtNotice, setActiveLtNotice] = useState<DigitalLtNotice | null>(null);
  const [lineageModalKhatian, setLineageModalKhatian] = useState<KhatianRecord | null>(null);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState<boolean>(false);
  const [isSmsDrawerOpen, setIsSmsDrawerOpen] = useState<boolean>(false);
  const [isWarisanModalOpen, setIsWarisanModalOpen] = useState<boolean>(false);
  const [fraudAlert, setFraudAlert] = useState<{ isOpen: boolean; titleEn: string; titleBn: string; reasonEn: string; reasonBn: string } | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerificationResult, setLastVerificationResult] = useState<VerificationResult | null>(null);

  const [notification, setNotification] = useState<{
    id: string;
    messageEn: string;
    messageBn?: string;
    type?: 'success' | 'info' | 'warning';
  } | null>(null);

  const showNotification = (
    msg: { en: string; bn?: string } | string,
    type: 'success' | 'info' | 'warning' = 'success'
  ) => {
    const messageEn = typeof msg === 'string' ? msg : msg.en;
    const messageBn = typeof msg === 'string' ? undefined : msg.bn;
    setNotification({
      id: `${Date.now()}-${Math.random()}`,
      messageEn,
      messageBn,
      type
    });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_THEME, t);
        localStorage.setItem('theme-mode', t);
      } catch (err) {
        console.warn('Could not save theme to localStorage', err);
      }
    }
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (t === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (storedTheme === 'dark') {
        setTheme('dark');
      } else {
        setTheme('light');
      }

      const storedKhatians = localStorage.getItem(STORAGE_KEY_KHATIANS);
      const storedDeeds = localStorage.getItem(STORAGE_KEY_DEEDS);
      const storedMutations = localStorage.getItem(STORAGE_KEY_MUTATIONS);
      const storedAudit = localStorage.getItem(STORAGE_KEY_AUDIT);
      const storedSms = localStorage.getItem(STORAGE_KEY_SMS);
      const storedWarisan = localStorage.getItem(STORAGE_KEY_WARISAN);
      const storedLang = localStorage.getItem(STORAGE_KEY_LANG);
      const storedBlocked = localStorage.getItem(STORAGE_KEY_BLOCKED);

      if (storedKhatians) setKhatians(JSON.parse(storedKhatians));
      if (storedDeeds) setDeeds(JSON.parse(storedDeeds));
      if (storedMutations) setMutations(JSON.parse(storedMutations));
      if (storedAudit) setAuditLogs(JSON.parse(storedAudit));
      if (storedSms) setSmsLogs(JSON.parse(storedSms));
      if (storedWarisan) {
        const parsedW = JSON.parse(storedWarisan);
        setWarisanCases(parsedW);
        if (parsedW.length > 0) setSelectedWarisanCase(parsedW[0]);
      }
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
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Could not write auditLogs to localStorage', e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SMS, JSON.stringify(smsLogs));
    } catch (e) {
      console.warn('Could not write smsLogs to localStorage', e);
    }
  }, [smsLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WARISAN, JSON.stringify(warisanCases));
    } catch (e) {
      console.warn('Could not write warisanCases to localStorage', e);
    }
  }, [warisanCases]);

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {
      console.warn('Could not write theme to localStorage', e);
    }
  }, [theme]);

  // Gov-SMS Gateway Dispatch Engine (88096...)
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

  const resetDemoData = () => {
    setCitizens(INITIAL_CITIZENS);
    setKhatians(INITIAL_KHATIANS);
    setDeeds(INITIAL_DEEDS);
    setMutations(INITIAL_MUTATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSmsLogs(INITIAL_SMS_LOGS);
    setWarisanCases(INITIAL_WARISAN_CASES);
    setSelectedWarisanCase(INITIAL_WARISAN_CASES[0] || null);
    setSelectedPlotId('plot-1');
    setBlockedAttemptsCount(3);
    setLastVerificationResult(null);
    setFraudAlert(null);
    setActiveDeedReceipt(null);
    setActivePorcha(null);
    setActiveLtNotice(null);
    setLineageModalKhatian(null);
    try {
      localStorage.removeItem(STORAGE_KEY_KHATIANS);
      localStorage.removeItem(STORAGE_KEY_DEEDS);
      localStorage.removeItem(STORAGE_KEY_MUTATIONS);
      localStorage.removeItem(STORAGE_KEY_AUDIT);
      localStorage.removeItem(STORAGE_KEY_SMS);
      localStorage.removeItem(STORAGE_KEY_WARISAN);
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
    await new Promise(r => setTimeout(r, 450));

    const plot = khatians.find(k => k.id === plotId);
    if (!plot) {
      setIsVerifying(false);
      const res: VerificationResult = {
        passed: false,
        checks: [],
        fraudTitleEn: 'Plot Record Not Found',
        fraudTitleBn: 'জমির রেকর্ড পাওয়া যায়নি',
        fraudReasonEn: 'The specified Khatian or Dag was not found in the cadastral index.',
        fraudReasonBn: 'অনুরোধকৃত খতিয়ান বা দাগ ক্যাডাস্ট্রাল ইনডেক্সে বিদ্যমান নেই।'
      };
      setLastVerificationResult(res);
      return res;
    }

    const availableArea = toDec(Math.max(0, plot.totalAreaDecimals - plot.lockedAreaDecimals));

    // 1. Ownership & Biometrics Match (Checks owner or Ejmali co-sharer)
    const isCoSharerMatch = Boolean(plot.isEjmaliProperty && (plot.coSharers ?? []).some(cs => cs.dummyNid.trim().toUpperCase() === sellerNid.trim().toUpperCase()));
    const ownershipPassed = (plot.ownerNid.trim().toUpperCase() === sellerNid.trim().toUpperCase()) || isCoSharerMatch;
    
    // 2. Chain-of-Title Lineage (CS -> SA -> RS -> BS)
    const lineagePassed = plot.chainOfTitle.length >= 3 && plot.chainOfTitle.every(c => c.verified);

    // 3. Unlocked Area Balance & Ejmali Co-Sharer Quota
    let balancePassed = transferArea > 0 && transferArea <= availableArea;
    let ejmaliQuotaAlertEn = '';
    let ejmaliQuotaAlertBn = '';
    let sellerMaxOwned = availableArea;

    if (plot.isEjmaliProperty && plot.coSharers && plot.coSharers.length > 0) {
      const coSharer = plot.coSharers.find(cs => cs.dummyNid.trim().toUpperCase() === sellerNid.trim().toUpperCase()) || plot.coSharers[0];
      sellerMaxOwned = toDec((plot.totalAreaDecimals * coSharer.shareFraction) - (coSharer.lockedDecimals || 0));
      if (transferArea > sellerMaxOwned || transferArea > availableArea) {
        balancePassed = false;
        ejmaliQuotaAlertEn = `EJMALI QUOTA VIOLATION: Seller only legally owns ${formatDec(sellerMaxOwned)} Decimals (${coSharer.shareLabelBn}). Attempt to transfer ${formatDec(transferArea)} Decimals blocked under SAT Act Section 96!`;
        ejmaliQuotaAlertBn = `ইজমালি শরিকের অতিরিক্ত জমি বিক্রয় রোধ: বিক্রেতা এই খতিয়ানে মাত্র ${formatDec(sellerMaxOwned)} শতাংশ জমির স্বত্বাধিকারী (${coSharer.shareLabelBn})। ${formatDec(transferArea)} শতাংশ বিক্রির আবেদন অবৈধ!`;
      }
    }

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
          ? `Transfer requested: ${formatDec(transferArea)} Decimals. Available unlocked: ${formatDec(availableArea)} Dec (Total: ${formatDec(plot.totalAreaDecimals)}, Locked: ${formatDec(plot.lockedAreaDecimals)}).`
          : (ejmaliQuotaAlertEn || `DOUBLE-SELLING BLOCKED: Attempting to sell ${formatDec(transferArea)} Decimals, but only ${formatDec(availableArea)} Decimals unlocked (${formatDec(plot.lockedAreaDecimals)} Decimals locked in pending e-Mutation).`),
        messageBn: balancePassed
          ? `হস্তান্তর প্রস্তাবিত: ${formatDec(transferArea)} শতাংশ। অবমুক্ত অবশিষ্ট: ${formatDec(availableArea)} শতাংশ (মোট: ${formatDec(plot.totalAreaDecimals)}, লককৃত: ${formatDec(plot.lockedAreaDecimals)})।`
          : (ejmaliQuotaAlertBn || `দ্বৈত বিক্রয় রোধ: ${formatDec(transferArea)} শতাংশ বিক্রির চেষ্টা, কিন্তু অবমুক্ত আছে মাত্র ${formatDec(availableArea)} শতাংশ (${formatDec(plot.lockedAreaDecimals)} শতাংশ পূর্ববর্তী মিউটেশনে লককৃত)।`)
      },
      {
        id: 'mortgage',
        labelEn: '4. Financial Registry & Bank Mortgage Lien Check',
        labelBn: '৪. আর্থিক প্রতিষ্ঠান ও ব্যাংক দায়মুক্তি যাচাই',
        passed: mortgageFree,
        messageEn: mortgageFree
          ? 'Clear. No registered mortgages or liens with scheduled banks or financial institutions.'
          : `MORTGAGE FRAUD BLOCKED: Active bank lien registered by ${plot.mortgageDetails?.bankName || 'Scheduled Bank'} (Loan Acct: ${plot.mortgageDetails?.loanAccount}, BDT ${(plot.mortgageDetails?.amountBDT || 0).toLocaleString()}).`,
        messageBn: mortgageFree
          ? 'দায়মুক্ত। কোনো তফসিলি ব্যাংক বা আর্থিক প্রতিষ্ঠানে বন্ধকী দায় নেই।'
          : `বন্ধকী জালিয়াতি রোধ: ${plot.mortgageDetails?.bankName || 'ব্যাংক'} কর্তৃক সক্রিয় লিয়েন বা বন্ধক রয়েছে (ঋণ হিসাব: ${plot.mortgageDetails?.loanAccount}, পরিমাণ: ৳${(plot.mortgageDetails?.amountBDT || 0).toLocaleString()})।`
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
      },
      {
        id: 'khajna',
        labelEn: '7. Land Development Tax (খাজনা দাখিলা) Status',
        labelBn: '৭. ভূমি উন্নয়ন কর (খাজনা) ও দাখিলা স্থিতি',
        passed: true,
        messageEn: (plot.ldTaxArrearBdt || 0) > 0
          ? `Khajna Arrears Detected: ৳${(plot.ldTaxArrearBdt || 0).toLocaleString()} Due (Paid up to ${plot.ldTaxPaidUpToBanglaYear}). Auto-bundled into unified checkout!`
          : `Khajna 100% Cleared up to ${plot.ldTaxPaidUpToBanglaYear || '1433 BS'}. Dakhila #${plot.dakhilaReceiptNo || 'DAKHILA-2026-88412'} active.`,
        messageBn: (plot.ldTaxArrearBdt || 0) > 0
          ? `বকেয়া খাজনা চিহ্নিত: ৳${(plot.ldTaxArrearBdt || 0).toLocaleString()} বকেয়া (${plot.ldTaxPaidUpToBanglaYear} পর্যন্ত)। একীভূত ফি-তে স্বয়ংক্রিয় অন্তর্ভুক্ত!`
          : `${plot.ldTaxPaidUpToBanglaYear || '১৪৩৩ বঙ্গাব্দ'} পর্যন্ত খাজনা পরিশোধিত। দাখিলা #${plot.dakhilaReceiptNo || 'DAKHILA-2026-88412'} সঠিক।`
      }
    ];

    const allPassed = checks.every(c => c.passed);

    let fraudTitleEn = '';
    let fraudTitleBn = '';
    let fraudReasonEn = '';
    let fraudReasonBn = '';

    if (!allPassed) {
      if (!balancePassed) {
        if (ejmaliQuotaAlertEn) {
          fraudTitleEn = 'Ejmali Co-Sharer Quota Exceeded';
          fraudTitleBn = 'ইজমালি শরিকের অতিরিক্ত জমি বিক্রয় রোধ';
          fraudReasonEn = ejmaliQuotaAlertEn;
          fraudReasonBn = ejmaliQuotaAlertBn;
        } else {
          fraudTitleEn = 'Anti-Double-Selling Fraud Prevention Triggered';
          fraudTitleBn = 'দ্বৈত-বিক্রয় জালিয়াতি রোধ সিস্টেম সক্রিয়';
          fraudReasonEn = `Seller attempted to transfer ${formatDec(transferArea)} Decimals, exceeding remaining unlocked balance of ${formatDec(availableArea)} Decimals. ${formatDec(plot.lockedAreaDecimals)} Decimals are escrow-locked in a pending e-Mutation.`;
          fraudReasonBn = `বিক্রেতা ${formatDec(transferArea)} শতাংশ জমি বিক্রির চেষ্টা করেছেন, অথচ অবমুক্ত অবশিষ্ট রয়েছে মাত্র ${formatDec(availableArea)} শতাংশ। বাকি ${formatDec(plot.lockedAreaDecimals)} শতাংশ ইতিমধ্যে অন্য মিউটেশনের জন্য ডিজিটালভাবে লক করা।`;
        }
      } else if (!mortgageFree) {
        fraudTitleEn = 'Active Bank Mortgage Lien Detected';
        fraudTitleBn = 'সক্রিয় ব্যাংক বন্ধক ও দায় চিহ্নিত';
        fraudReasonEn = `This plot has a registered legal mortgage with ${plot.mortgageDetails?.bankName} (Acct: ${plot.mortgageDetails?.loanAccount}) for BDT ${(plot.mortgageDetails?.amountBDT || 0).toLocaleString()}. Transfer without bank release is prohibited.`;
        fraudReasonBn = `এই জমিটিতে ${plot.mortgageDetails?.bankName} এর নিকট ৳${(plot.mortgageDetails?.amountBDT || 0).toLocaleString()} টাকার সক্রিয় বন্ধক রয়েছে। ব্যাংকের অনাপত্তিপত্র (NOC) ব্যতীত হস্তান্তর নিষিদ্ধ।`;
      } else if (!courtFree) {
        fraudTitleEn = 'Civil Court Injunction & Disputed Title Detected';
        fraudTitleBn = 'আদালতের নিষেধাজ্ঞা ও দেওয়ানী মামলা চিহ্নিত';
        fraudReasonEn = `An active judicial injunction (Order 39 Rule 1 CPC) has been issued by ${plot.courtCaseDetails?.courtName} under Case #${plot.courtCaseDetails?.caseNo}.`;
        fraudReasonBn = `${plot.courtCaseDetails?.courtName} কর্তৃক ${plot.courtCaseDetails?.caseNo} মামলায় জমিটির ওপর স্থিতাবস্থা (Injunction) জারি করা হয়েছে।`;
      } else if (!acqFree) {
        fraudTitleEn = 'Government Infrastructure Acquisition Notice';
        fraudTitleBn = 'সরকারি অবকাঠামো ভূমি অধিগ্রহণ নোটিশ';
        fraudReasonEn = `This parcel has been gazetted for public acquisition by the DC Office for "${plot.acquisitionDetails?.projectName}".`;
        fraudReasonBn = `জমিটি ডিসি অফিস কর্তৃক "${plot.acquisitionDetails?.projectName}" প্রকল্পের জন্য অধিগ্রহণভুক্ত। ব্যক্তিপর্যায়ে হস্তান্তর নিষিদ্ধ।`;
      } else if (!ownershipPassed) {
        fraudTitleEn = 'National Identity / Impersonation Blocked';
        fraudTitleBn = 'পরিচয় জালিয়াতি ও ভুল এনআইডি রোধ';
        fraudReasonEn = `The NID provided (${sellerNid}) does not match the registered Khatian owner NID (${plot.ownerNid}). Biometric & NID consensus failed.`;
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
  }): Promise<{ success: boolean; deed?: DeedRecord; mutation?: MutationCase; error?: string }> => {
    const plot = khatians.find(k => k.id === params.plotId);
    if (!plot) {
      return { success: false, error: 'Target plot not found in cadastral index.' };
    }

    const availableArea = toDec(Math.max(0, plot.totalAreaDecimals - plot.lockedAreaDecimals));
    if (params.transferAreaDecimals <= 0 || params.transferAreaDecimals > availableArea) {
      return { 
        success: false, 
        error: `Insufficient unlocked land balance. Requested: ${formatDec(params.transferAreaDecimals)} Dec, Available: ${formatDec(availableArea)} Dec.` 
      };
    }

    const nowIso = new Date().toISOString();
    const deedNo = `DEED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingId = `MUT-2026-${Math.floor(5000 + Math.random() * 4999)}`;
    const ltNoticeNo = `LT-SEC89-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const freshDakhilaNo = `DAKHILA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const holdingNo = `HOLD-2026-${plot.dagNo}`;

    // Compute Cryptographic Deed Hash
    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '0000000000000000000000000000000000000000000000000000000000000000';
    const nextBlockIndex = (lastAudit?.blockIndex || 0) + 1;

    const deedPayload = `${prevHash}|${deedNo}|${plot.khatianNo}|${plot.dagNo}|${plot.ownerNid}|${params.buyerNid}|${params.transferAreaDecimals}|${params.saleValueBDT}|${nowIso}`;
    const sha256Hash = await computeSha256(deedPayload);

    const fees = calculateFees(params.saleValueBDT);

    // Module 3: Generate Statutory Digital LT Notice Packet (Section 89 SAT Act 1950)
    const ltNotice: DigitalLtNotice = {
      ltNoticeNo,
      statutoryReference: 'Section 89, State Acquisition and Tenancy Act 1950',
      deedNo,
      khatianNo: plot.khatianNo,
      dagNo: plot.dagNo,
      mouzaEn: plot.mouza,
      mouzaBn: plot.mouzaBn,
      sellerName: plot.ownerName,
      sellerNid: plot.ownerNid,
      buyerName: params.buyerName,
      buyerNid: params.buyerNid,
      transferDecimals: toDec(params.transferAreaDecimals),
      dakhilaReceiptNo: freshDakhilaNo,
      bundledMutationFeeReceiptNo: 'E-MUT-FEE-1170-BDT',
      sha256PacketSeal: sha256Hash,
      dispatchedAtTimestamp: nowIso,
      recipientOffice: `Assistant Commissioner (Land), ${plot.upazila} Upazila`,
      status: 'AUTO_TRANSMITTED_TO_AC_LAND',
    };

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
      transferAreaDecimals: toDec(params.transferAreaDecimals),
      saleValueBDT: params.saleValueBDT,
      fees,
      registrationDate: nowIso,
      sha256Hash,
      status: 'MUTATION_PENDING',
      subRegistryOffice: `${plot.upazila} Sub-Registry Office`,
      trackingId,
      ltNotice,
      blockIndex: nextBlockIndex,
      previousHash: prevHash,
      dakhilaReceiptNo: freshDakhilaNo,
      preEmptionNoticeSent: plot.isEjmaliProperty,
    };

    // Auto-create e-Mutation case for AC Land queue with SLA countdown
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
      transferAreaDecimals: toDec(params.transferAreaDecimals),
      status: 'AUTO_INITIATED',
      autoInitiatedAt: nowIso,
      qrData: `SETULAND-VERIFIED:${trackingId}:${deedNo}:AREA-${params.transferAreaDecimals.toFixed(2)}`,
      slaTargetDays: 7,
      statutoryMaxDays: 28,
      daysElapsed: 1,
      escalationStatus: 'ON_TRACK',
      ltNotice,
      dakhilaReceiptNo: freshDakhilaNo,
      holdingNo,
      parentBsKhatian: plot.khatianNo,
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
          nameEn: 'Section 89 Digital LT Notice Dispatched to AC Land', 
          nameBn: 'ধারা ৮৯ ডিজিটাল এলটি নোটিশ এসি ল্যান্ডে প্রেরিত', 
          completed: true, 
          timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Statutory LT Notice #${ltNoticeNo} with bundled mutation fee receipt auto-pushed.`
        },
        { 
          step: 4, 
          nameEn: 'Union Land (Tahsil) Verification Report', 
          nameBn: 'তহশিলদার/ইউনিয়ন ভূমি সহকারী প্রতিবেদন', 
          completed: false,
          note: 'Awaiting digital confirmation of field possession & tax dakhila.'
        },
        { 
          step: 5, 
          nameEn: 'AC Land Final Approval & Digital Khatian Splitting', 
          nameBn: 'এসি ল্যান্ড অনুমোদন ও ডিজিটাল পরচা তৈরি', 
          completed: false,
          note: 'Awaiting digital signature & automated Jomabhag ledger update.'
        }
      ]
    };

    // Update state: Lock decimals on plot, update co-sharers if Ejmali, clear Khajna arrears
    setKhatians(prev => prev.map(k => {
      if (k.id === plot.id) {
        let updatedCoSharers = k.coSharers;
        if (k.isEjmaliProperty && k.coSharers) {
          updatedCoSharers = k.coSharers.map(cs => {
            if (cs.dummyNid.trim().toUpperCase() === plot.ownerNid.trim().toUpperCase() || cs.citizenId === 'citizen-1') {
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
          lockedAreaDecimals: toDec(k.lockedAreaDecimals + params.transferAreaDecimals),
          ldTaxArrearBdt: 0,
          dakhilaReceiptNo: freshDakhilaNo,
          ldTaxPaidUpToBanglaYear: '1433 BS (2026 - PAID)',
          preEmptionNoticeSent: k.isEjmaliProperty,
          coSharers: updatedCoSharers,
          lastUpdated: nowIso,
        };
      }
      return k;
    }));

    // Append Chained Merkle Hash Audit Log
    const auditPayload = `DEED_REGISTERED|${deedNo}|${plot.khatianNo}|${ltNoticeNo}|${nowIso}`;
    const auditHash = await computeChainedHash(prevHash, auditPayload);
    const newAuditLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: nextBlockIndex,
      timestamp: nowIso,
      eventType: 'DEED_REGISTERED',
      entityId: deedNo,
      detailsEn: `Deed #${deedNo} registered. ${formatDec(params.transferAreaDecimals)} Dec locked on ${plot.khatianNo}. Section 89 Digital LT Notice #${ltNoticeNo} auto-dispatched to AC Land with 100% Khajna clearance.`,
      detailsBn: `দলিল নং ${deedNo} নিবন্ধিত। খতিয়ান ${plot.khatianNo} এ ${formatDec(params.transferAreaDecimals)} শতাংশ জমি লককৃত। ধারা ৮৯ এর ডিজিটাল এলটি নোটিশ #${ltNoticeNo} ও দাখিলা সহ এসি ল্যান্ডে প্রেরিত।`,
      actorRole: 'Sub-Registrar Office',
      actorName: 'Sub-Registrar, Savar',
      prevHash,
      previousHash: prevHash,
      currentHash: auditHash,
    };

    setAuditLogs(prev => [...prev, newAuditLog]);
    setDeeds(prev => [newDeed, ...prev]);
    setMutations(prev => [newMutation, ...prev]);
    setActiveDeedReceipt(newDeed);

    // Module 9: Dispatch Gov-SMS alerts to Seller and Buyer
    dispatchGovSms(
      plot.ownerPhone || '01700-000001',
      plot.ownerName,
      `[GOV-LAND] Sub-Kabala Deed #${deedNo} registered. ${formatDec(params.transferAreaDecimals)} Dec locked on Khatian ${plot.khatianNo}. e-Mutation Tracking ID: ${trackingId}.`,
      `[GOV-LAND] ভূমি সেবা: সাব-কবলা দলিল নং ${deedNo} নিবন্ধিত। খতিয়ান ${plot.khatianNo} থেকে ${formatDec(params.transferAreaDecimals)} শতক জমি লক করা হয়েছে। ই-নামজারি ট্র্যাকিং: ${trackingId}।`,
      'DEED_REGISTERED'
    );

    dispatchGovSms(
      params.buyerPhone,
      params.buyerName,
      `[GOV-LAND] Deed #${deedNo} registered in your favor. e-Mutation auto-dispatched to AC Land with 100% Khajna clearance. Tracking: ${trackingId}.`,
      `[GOV-LAND] ভূমি সেবা: আপনার বরাবরে দলিল নং ${deedNo} নিবন্ধিত হয়েছে। শতভাগ খাজনা পরিশোধসহ স্বয়ংক্রিয় ই-নামজারি এসি ল্যান্ডে প্রেরণ করা হয়েছে। ট্র্যাকিং: ${trackingId}।`,
      'DEED_REGISTERED'
    );

    // If Ejmali property, dispatch Section 96 Statutory Pre-Emption Notice SMS to co-sharers
    if (plot.isEjmaliProperty && plot.coSharers) {
      plot.coSharers.forEach(cs => {
        if (cs.dummyNid !== plot.ownerNid) {
          dispatchGovSms(
            cs.phone || '01700-000011',
            cs.nameEn,
            `[GOV-LAND] Statutory Sec 96 Notice: Co-sharer ${plot.ownerName} initiated transfer on Khatian ${plot.khatianNo}. Pre-emption window open for 60 days.`,
            `[GOV-LAND] ভূমি সেবা: ধারা ৯৬ নোটিশ: খতিয়ান ${plot.khatianNo} এর সহ-শরিক ${plot.ownerNameBn} কর্তৃক জমি হস্তান্তরের আবেদন। ৬০ দিনের মধ্যে অগ্রক্রয় অধিকার প্রয়োগ করতে পারবেন।`,
            'PRE_EMPTION_NOTICE'
          );
        }
      });
    }

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}

    return { success: true, deed: newDeed, mutation: newMutation };
  };

  const verifyTahsilReport = (mutationId: string) => {
    const nowIso = new Date().toISOString();
    const timeStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMutations(prev => prev.map(m => {
      if (m.id === mutationId) {
        const updatedSteps = m.workflowSteps.map(s => {
          if (s.step === 4) {
            return {
              ...s,
              completed: true,
              timestamp: timeStr,
              note: 'Tahsil field report approved: Physical possession, boundaries & Dakhila tax clearance validated.'
            };
          }
          return s;
        });

        return {
          ...m,
          status: 'TAHSIL_VERIFIED',
          tahsilVerifiedAt: nowIso,
          tahsilOfficer: 'Md. Shafiqul Alam (Union Land Assistant Officer - Tahsildar)',
          workflowSteps: updatedSteps
        };
      }
      return m;
    }));

    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const newAuditLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: nowIso,
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

    showNotification({
      en: `Union Land Tahsil report verified for Mutation #${mutationId}`,
      bn: `নামজারি #${mutationId} এর তহশিল প্রতিবেদন অনুমোদিত হয়েছে`
    }, 'info');
  };

  const simulateSlaDelay = (mutationId: string) => {
    const now = new Date().toISOString();
    setMutations(prev => prev.map(m => {
      if (m.id === mutationId) {
        return {
          ...m,
          daysElapsed: 8,
          escalationStatus: 'ESCALATED_TO_ADC_REVENUE',
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
      detailsEn: `7-Day Fast-Track SLA Breached (Day 8). Automatically escalated to Additional Deputy Commissioner (ADC Revenue) for delay audit.`,
      detailsBn: `৭ দিনের ফাস্ট-ট্র্যাক এসএলএ অতিক্রম (৮ম দিন)। বিলম্বের কারণ দর্শাতে অতিরিক্ত জেলা প্রশাসক (রাজস্ব) বরাবর স্বয়ংক্রিয় এস্কেলেটকৃত।`,
      actorRole: 'Anti-Harassment SLA Engine',
      actorName: 'SetuLand Automated Accountability Gate',
      prevHash,
      previousHash: prevHash,
      currentHash: `sla_${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, newAuditLog]);

    showNotification({
      en: 'SLA Alert: 7-Day Fast-Track exceeded. Case escalated to ADC (Revenue)!',
      bn: 'এসএলএ অতিক্রম সতর্কতা: মামলাটি এডিসি (রাজস্ব) বরাবর স্বয়ংক্রিয় এস্কেলেটকৃত!'
    }, 'warning');
  };

  const approveMutation = async (mutationId: string): Promise<KhatianRecord | null> => {
    const mutation = mutations.find(m => m.id === mutationId);
    if (!mutation) return null;

    const parentPlot = khatians.find(k => k.khatianNo === mutation.parentKhatianNo);
    if (!parentPlot) return null;

    const nowIso = new Date().toISOString();
    const timeStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Determine new child Khatian number: e.g. BS-1001/A
    const suffixLetter = 'A';
    const newKhatianNo = `${parentPlot.khatianNo}/${suffixLetter}`;
    const newHoldingNo = `HOLD-2026-${parentPlot.dagNo}/${suffixLetter}`;

    // Cryptographic hash for new Porcha
    const porchaPayload = `${newKhatianNo}|${parentPlot.dagNo}|${mutation.buyerNid}|${mutation.transferAreaDecimals}|${nowIso}`;
    const newPorchaHash = await computeSha256(porchaPayload);

    // 1. Create brand-new Khatian for Buyer (Jomabhag Split)
    const newBuyerKhatian: KhatianRecord = {
      id: `plot-${Date.now()}`,
      khatianNo: newKhatianNo,
      dagNo: `${parentPlot.dagNo}/1`,
      mouza: parentPlot.mouza,
      mouzaBn: parentPlot.mouzaBn,
      upazila: parentPlot.upazila,
      district: parentPlot.district,
      ownerName: mutation.buyerName,
      ownerNameBn: mutation.buyerName,
      ownerNid: mutation.buyerNid,
      ownerPhone: mutation.buyerPhone,
      totalAreaDecimals: toDec(mutation.transferAreaDecimals),
      lockedAreaDecimals: 0,
      landClass: parentPlot.landClass,
      isMortgaged: false,
      hasCourtCase: false,
      isAcquired: false,
      isEjmaliProperty: false,
      ldTaxPaidUpToBanglaYear: '1433 BS (2026)',
      ldTaxArrearBdt: 0,
      dakhilaReceiptNo: mutation.dakhilaReceiptNo || `DAKHILA-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      chainOfTitle: [
        ...parentPlot.chainOfTitle,
        {
          surveyType: 'BS',
          khatianNo: newKhatianNo,
          ownerName: `${mutation.buyerName} (Via Jomabhag e-Mutation #${mutation.id})`,
          ownerNid: mutation.buyerNid,
          year: 2026,
          areaDecimals: toDec(mutation.transferAreaDecimals),
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
    const remainingTotal = toDec(Math.max(0, parentPlot.totalAreaDecimals - mutation.transferAreaDecimals));
    const remainingLocked = toDec(Math.max(0, parentPlot.lockedAreaDecimals - mutation.transferAreaDecimals));

    setKhatians(prev => {
      const updatedList = prev.map(k => {
        if (k.id === parentPlot.id) {
          return {
            ...k,
            totalAreaDecimals: remainingTotal,
            lockedAreaDecimals: remainingLocked,
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
          holdingNo: newHoldingNo,
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

    // 5. Append Chained Audit Log
    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const auditPayload = `KHATIAN_SPLIT|${newKhatianNo}|${mutation.transferAreaDecimals}|${nowIso}`;
    const auditHash = await computeChainedHash(prevHash, auditPayload);
    const splitAuditLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: nowIso,
      eventType: 'KHATIAN_SPLIT',
      entityId: newKhatianNo,
      detailsEn: `AC Land executed Jomabhag Split for e-Mutation #${mutation.id}. Parent ${parentPlot.khatianNo} deducted to ${formatDec(remainingTotal)} Dec. New Khatian ${newKhatianNo} (Holding #${newHoldingNo}) issued to ${mutation.buyerName}.`,
      detailsBn: `এসি ল্যান্ড কর্তৃক নামজারি #${mutation.id} এর জমাভাগ খতিয়ান বিভাজন সম্পন্ন। মূল খতিয়ান ${parentPlot.khatianNo} এ অবশিষ্ট ${formatDec(remainingTotal)} শতাংশ। ক্রেতা ${mutation.buyerName} এর বরাবরে নতুন খতিয়ান ${newKhatianNo} সৃজিত।`,
      actorRole: 'AC Land Office',
      actorName: 'Assistant Commissioner (Land), Savar',
      prevHash,
      previousHash: prevHash,
      currentHash: auditHash,
    };
    setAuditLogs(prev => [...prev, splitAuditLog]);

    // Module 9: Dispatch Gov-SMS to Buyer
    dispatchGovSms(
      mutation.buyerPhone,
      mutation.buyerName,
      `[GOV-LAND] e-Mutation #${mutation.id} Approved! Brand-new Khatian #${newKhatianNo} and Holding #${newHoldingNo} issued. Decimals: ${formatDec(mutation.transferAreaDecimals)}.`,
      `[GOV-LAND] ভূমি সেবা: আপনার ই-নামজারি মামলা #${mutation.id} অনুমোদিত! নতুন জমাভাগ খতিয়ান #${newKhatianNo} এবং হোল্ডিং #${newHoldingNo} সৃজন সম্পন্ন। জমির পরিমাণ: ${formatDec(mutation.transferAreaDecimals)} শতক।`,
      'MUTATION_APPROVED'
    );

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    // Open Digital Porcha modal
    setActivePorcha({ khatian: newBuyerKhatian, mutationId });

    return newBuyerKhatian;
  };

  const rejectMutation = (mutationId: string, reason: string) => {
    const mutation = mutations.find(m => m.id === mutationId);
    if (!mutation) return;

    // Unlock the locked area back to the seller!
    const parentPlot = khatians.find(k => k.khatianNo === mutation.parentKhatianNo);
    if (parentPlot) {
      setKhatians(prev => prev.map(k => {
        if (k.id === parentPlot.id) {
          return {
            ...k,
            lockedAreaDecimals: toDec(Math.max(0, k.lockedAreaDecimals - mutation.transferAreaDecimals))
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
    const nowIso = new Date().toISOString();
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
            mortgageDate: nowIso.split('T')[0]
          } : undefined
        };
      }
      return k;
    }));

    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const newLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: nowIso,
      eventType: 'BANK_MORTGAGE_TOGGLED',
      entityId: plotId,
      detailsEn: `Bank Mortgage Lien status modified on Plot #${plotId}.`,
      detailsBn: `প্লট #${plotId} এ ব্যাংক বন্ধকী স্ট্যাটাস হালনাগাদ করা হয়েছে।`,
      actorRole: 'Commercial Bank API',
      actorName: 'Sonali Bank CIB Gateway',
      prevHash,
      previousHash: prevHash,
      currentHash: `mortgage_${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const toggleCourtInjunction = (plotId: string) => {
    const nowIso = new Date().toISOString();
    setKhatians(prev => prev.map(k => {
      if (k.id === plotId) {
        const nextState = !k.hasCourtCase;
        return {
          ...k,
          hasCourtCase: nextState,
          courtCaseDetails: nextState ? {
            caseNo: 'DUMMY-CIV-404/2026',
            courtName: 'Joint District Judge Court 1st Court, Gazipur',
            filedDate: nowIso.split('T')[0],
            reason: 'Title Suit & Temporary Injunction (Order 39 Rule 1 CPC) regarding co-sharer claim'
          } : undefined
        };
      }
      return k;
    }));

    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const newLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: nowIso,
      eventType: 'COURT_INJUNCTION_TOGGLED',
      entityId: plotId,
      detailsEn: `Judicial Stay Order status updated on Plot #${plotId}.`,
      detailsBn: `প্লট #${plotId} এ দেওয়ানি আদালতের নিষেধাজ্ঞা হালনাগাদ করা হয়েছে।`,
      actorRole: 'Civil Judiciary Gateway',
      actorName: 'Joint District Judge Court 1',
      prevHash,
      previousHash: prevHash,
      currentHash: `court_${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const toggleDcAcquisition = (plotId: string) => {
    const nowIso = new Date().toISOString();
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

    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';
    const newLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: nowIso,
      eventType: 'DC_ACQUISITION_TOGGLED',
      entityId: plotId,
      detailsEn: `DC Office Land Acquisition gazette notice toggled on Plot #${plotId}.`,
      detailsBn: `প্লট #${plotId} এ ডিসি অফিস ভূমি অধিগ্রহণ সংক্রান্ত তথ্য হালনাগাদ করা হয়েছে।`,
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

    let fixedFractionTotal = 0;
    const fractionMap = new Map<string, { fraction: number; labelBn: string }>();

    // 1. Wife share (1/8 if children, 1/4 if no children; shared equally among wives)
    if (wives.length > 0) {
      const wifePoolFraction = hasChildren ? 0.125 : 0.25;
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

    // 5. Remaining residue (আসাবা)
    const residue = Math.max(0, 1 - fixedFractionTotal);

    if (hasChildren) {
      if (sons.length > 0) {
        const totalUnits = (sons.length * 2) + daughters.length;
        const unitFraction = residue / totalUnits;
        sons.forEach(s => {
          fractionMap.set(s.dummyNid, {
            fraction: unitFraction * 2,
            labelBn: 'অবশিষ্টের ২ অংশ (পুত্র)',
          });
        });
        daughters.forEach(d => {
          fractionMap.set(d.dummyNid, {
            fraction: unitFraction * 1,
            labelBn: 'অবশিষ্টের ১ অংশ (কন্যা)',
          });
        });
      } else {
        if (daughters.length === 1) {
          const dFrac = Math.min(residue, 0.5);
          daughters.forEach(d => {
            fractionMap.set(d.dummyNid, { fraction: dFrac, labelBn: '১/২ অংশ (একমাত্র কন্যা)' });
          });
        } else {
          const poolFrac = Math.min(residue, 2 / 3);
          const perDaughter = poolFrac / daughters.length;
          daughters.forEach(d => {
            fractionMap.set(d.dummyNid, { fraction: perDaughter, labelBn: '২/৩ অংশ (কন্যাদের সমবণ্টন)' });
          });
        }
      }
    } else if (fathers.length > 0 && !fractionMap.has(fathers[0].dummyNid)) {
      fractionMap.set(fathers[0].dummyNid, {
        fraction: residue,
        labelBn: 'সম্পূর্ণ অবশিষ্ট অংশ (পিতা)',
      });
    } else if (brothers.length > 0 || sisters.length > 0) {
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
    const parentPlot = khatians.find(k => k.id === deceasedKhatianId) || khatians[0];
    const calculatedHeirs = calculateWarisanDistribution(parentPlot.totalAreaDecimals, heirsInput);

    const newCase: WarisanEstateCase = {
      id: `warisan-${Date.now()}`,
      deceasedKhatianId: parentPlot.id,
      deceasedKhatianNo: parentPlot.khatianNo,
      deceasedOwnerNameEn: `Late ${parentPlot.ownerName}`,
      deceasedOwnerNameBn: `মরহুম ${parentPlot.ownerNameBn}`,
      totalEstateDecimals: parentPlot.totalAreaDecimals,
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

    const parentPlot = khatians.find(k => k.id === estateCase.deceasedKhatianId || k.khatianNo === estateCase.deceasedKhatianNo);
    if (!parentPlot) return false;

    const nowIso = new Date().toISOString();
    const lastAudit = auditLogs[auditLogs.length - 1];
    const prevHash = lastAudit?.currentHash || '';

    // Create split Khatians for each heir
    const newKhatians: KhatianRecord[] = [];

    estateCase.heirs.forEach((heir, idx) => {
      const splitKhatianNo = `${parentPlot.khatianNo}/W${idx + 1}`;
      const splitDagNo = `${parentPlot.dagNo}/${toBanglaDigits(idx + 1)}`;
      const splitHolding = `HOLD-WARISAN-2026-${parentPlot.dagNo}/W${idx + 1}`;

      const splitKhatian: KhatianRecord = {
        id: `khatian-warisan-${Date.now()}-${idx}`,
        khatianNo: splitKhatianNo,
        dagNo: splitDagNo,
        mouza: parentPlot.mouza,
        mouzaBn: parentPlot.mouzaBn,
        upazila: parentPlot.upazila,
        district: parentPlot.district,
        ownerName: heir.nameEn,
        ownerNameBn: heir.nameBn,
        ownerNid: heir.dummyNid,
        ownerPhone: heir.phone,
        totalAreaDecimals: heir.assignedDecimals,
        lockedAreaDecimals: 0,
        landClass: parentPlot.landClass,
        isMortgaged: false,
        hasCourtCase: false,
        isAcquired: false,
        isEjmaliProperty: false,
        ldTaxPaidUpToBanglaYear: '1433 BS (2026)',
        ldTaxArrearBdt: 0,
        dakhilaReceiptNo: `DAKHILA-WARISAN-2026-${1000 + idx}`,
        chainOfTitle: [
          ...parentPlot.chainOfTitle,
          {
            surveyType: 'BS',
            khatianNo: splitKhatianNo,
            ownerName: `${heir.nameEn} (Warisan Inheritance / ${heir.shareLabelBn})`,
            ownerNid: heir.dummyNid,
            year: 2026,
            areaDecimals: heir.assignedDecimals,
            verified: true,
          }
        ],
        sha256Hash: `warisan_hash_${Date.now()}_${idx}`,
        lastUpdated: nowIso,
        mapPolygon: {
          points: parentPlot.mapPolygon?.points || '200,200 250,200 250,250 200,250',
          center: parentPlot.mapPolygon?.center || [225, 225],
          label: `${splitKhatianNo} (${heir.assignedDecimals} Dec)`
        }
      };

      newKhatians.push(splitKhatian);

      // Dispatch Gov-SMS to each heir
      dispatchGovSms(
        heir.phone,
        heir.nameEn,
        `[GOV-LAND] Warisan Succession Approved! Split Khatian #${splitKhatianNo} issued in your favor for ${formatDec(heir.assignedDecimals)} Dec (${heir.anaShareStr || 'Inherited Share'}). Holding: ${splitHolding}.`,
        `[GOV-LAND] ভূমি সেবা: ওয়ারিশান বণ্টন নামজারি অনুমোদিত! আপনার বরাবরে খতিয়ান #${splitKhatianNo} সৃজিত হয়েছে (${formatDec(heir.assignedDecimals)} শতক / ${heir.shareLabelBn})। হোল্ডিং: ${splitHolding}।`,
        'WARISAN_ESTATE_DISTRIBUTED'
      );
    });

    // Replace parent khatian with newly split heir khatians
    setKhatians(prev => {
      const filtered = prev.filter(k => k.id !== parentPlot.id);
      return [...newKhatians, ...filtered];
    });

    // Mark case as approved
    setWarisanCases(prev => prev.map(c => {
      if (c.id === estateCaseId) {
        return { ...c, status: 'APPROVED_MUTATION_GENERATED' };
      }
      return c;
    }));

    // Append Audit Log
    const auditPayload = `WARISAN_ESTATE_DISTRIBUTED|${parentPlot.khatianNo}|${estateCase.heirs.length}|${nowIso}`;
    const auditHash = await computeChainedHash(prevHash, auditPayload);
    const warisanAuditLog: AuditLogRecord = {
      id: `log-${Date.now()}`,
      blockIndex: (lastAudit?.blockIndex || 0) + 1,
      timestamp: nowIso,
      eventType: 'WARISAN_ESTATE_DISTRIBUTED',
      entityId: parentPlot.khatianNo,
      detailsEn: `Farayez Islamic inheritance division executed for deceased estate (${parentPlot.khatianNo}). ${estateCase.heirs.length} individual split Khatians generated with zero-touch automation.`,
      detailsBn: `মরহুমের সম্পত্তি (${parentPlot.khatianNo}) এর ফারায়েজ বণ্টন সম্পন্ন। ${estateCase.heirs.length} জন ওয়ারিশের অনুকূলে পৃথক জমাভাগ খতিয়ান সৃজিত।`,
      actorRole: 'AC Land Warisan Succession Bench',
      actorName: 'AC Land, Savar',
      prevHash,
      previousHash: prevHash,
      currentHash: auditHash,
    };
    setAuditLogs(prev => [...prev, warisanAuditLog]);

    showNotification({
      en: `Warisan estate division complete! ${estateCase.heirs.length} new Khatians issued.`,
      bn: `ওয়ারিশান সম্পত্তি বিভাজন সম্পন্ন! ${estateCase.heirs.length}টি নতুন খতিয়ান সৃজিত হয়েছে।`
    }, 'success');

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    } catch {}

    return true;
  };

  const totalPlotsCount = khatians.length;
  const totalLockedDecimals = Number(khatians.reduce((acc, k) => acc + k.lockedAreaDecimals, 0).toFixed(2));
  const queuedMutationsCount = mutations.filter(m => m.status === 'AUTO_INITIATED' || m.status === 'TAHSIL_VERIFIED').length;

  return (
    <LandAppContext.Provider
      value={{
        citizens,
        khatians,
        deeds,
        mutations,
        auditLogs,
        smsLogs,
        warisanCases,
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
        activeLtNotice,
        setActiveLtNotice,
        lineageModalKhatian,
        setLineageModalKhatian,
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
        simulateSlaDelay,
        toggleBankMortgage,
        toggleCourtInjunction,
        toggleDcAcquisition,
        dispatchGovSms,
        calculateWarisanDistribution,
        createWarisanEstateCase,
        approveWarisanMutation,
        resetDemoData,
        isResetModalOpen,
        setIsResetModalOpen,
        isAuditLogOpen,
        setIsAuditLogOpen,
        isSmsDrawerOpen,
        setIsSmsDrawerOpen,
        isWarisanModalOpen,
        setIsWarisanModalOpen,
        selectedWarisanCase,
        setSelectedWarisanCase,
        blockedAttemptsCount,
        totalPlotsCount,
        totalLockedDecimals,
        queuedMutationsCount,
        theme,
        setTheme,
        toggleTheme,
        notification,
        showNotification,
        clearNotification,
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
