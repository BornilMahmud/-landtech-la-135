import { Language } from '@/types';

export const DICTIONARY = {
  en: {
    appName: 'SetuLand',
    appSubtitle: 'National Smart Registry & Automated e-Mutation Engine',
    hackathonTrack: 'LandTech 2026 — Track P4: Digital Land Records & Unified Registry',
    complianceRibbon: '⚠️ LandTech 2026 Compliance Mode: 100% Synthetic Dummy Data. Zero Real Personal or Land Records.',
    resetDemo: 'Reset Demo State',
    liveLedger: 'Live Hash-Chain',
    shaConsensusActive: 'SHA-256 Merkle Consensus Active',

    // Roles
    roleSubRegistrar: 'Sub-Registry Office',
    roleSubRegistrarDesc: 'Deed Execution & 5-Point Diagnostic',
    roleAcLand: 'AC Land Office',
    roleAcLandDesc: 'Auto-Mutation Queue & Jomabhag Splitting',
    roleCitizen: 'Citizen & Buyer Portal',
    roleCitizenDesc: '5-Stage Tracker, Mouza GIS & Tamper Lab',
    roleLocks: 'Institutional Locks Panel',
    roleLocksDesc: 'Bank Liens, Court Stays & DC Acquisitions',

    // KPIs
    kpiTotalPlots: 'Total Verified Plots (BS Ledger)',
    kpiTotalPlotsSub: 'Cadastral GIS Synced',
    kpiLockedArea: 'Area Locked in e-Mutation',
    kpiLockedAreaSub: 'Escrow Anti-Double-Selling',
    kpiAutoQueue: 'Auto-Dispatched to AC Land',
    kpiAutoQueueSub: 'Sec 89 Digital LT Notice',
    kpiFraudBlocked: 'Fraud & Injunctions Blocked',
    kpiFraudBlockedSub: 'Consensus Diagnostic Enforced',

    // Sub-Registrar 5 Scenarios
    scenariosHeader: '⚡ 1-Click Judge Demo Scenarios (Click to Test Real-World Modules):',
    scenario1: '✅ Scenario 1: Clean Sale + Auto Khajna + Digital LT Notice (BS-1001)',
    scenario2: '🛑 Scenario 2: Double-Selling / Locked Area Fraud Block (BS-1002)',
    scenario3: '👨‍👩‍👧‍👦 Scenario 3: Ejmali Co-Sharer Over-Selling Quota Block (BS-1006)',
    scenario4: '🏦 Scenario 4: Active Bank Mortgage Lien Block (BS-1003)',
    scenario5: '⚖️ Scenario 5: Civil Court Injunction & DC Acquisition Block (BS-1004)',

    deedDrafting: 'Smart Deed Registration Form',
    selectKhatian: 'Select Master Khatian / Plot:',
    sellerInfo: 'Seller Information (From Master Record):',
    buyerInfo: 'Select Buyer (Citizen Registry):',
    transferArea: 'Transfer Area (Decimals):',
    salePrice: 'Declared Sale Price (BDT):',
    biometricVerified: 'Biometric & EC NID Verified',

    // Module 1: Ejmali
    ejmaliQuotaHeader: '👨‍👩‍👧‍👦 Ejmali Joint Property & Co-Sharer Quota Status:',
    ejmaliQuotaAlert: '🛑 EJMALI QUOTA VIOLATION (শরিকের অতিরিক্ত জমি বিক্রয় রোধ): Seller only owns legal share in this Khatian.',
    preEmptionNoticeBadge: '📲 Section 96 Pre-Emption Digital Notice (অগ্রক্রয় নোটিশ) Auto-Dispatched to Co-Sharers via SMS',
    coSharerSharesList: 'Recorded Co-Sharers & Shares (আনা/হিস্যা):',

    // Module 2: Khajna
    khajnaCardTitle: 'Land Development Tax (খাজনা দাখিলা) Status:',
    khajnaClean: '✅ Khajna Cleared up to 1433 BS (2026). Dakhila Verified.',
    khajnaArrearAlert: '⚠️ Khajna Arrears Detected: Due Amount Auto-Bundled into Unified Sub-Registry Checkout!',
    bundledKhajnaFee: 'Bundled Land Development Tax (Khajna Arrear):',

    // Module 3: LT Notice
    viewLtNoticeBtn: '📄 View Statutory Digital LT Notice (Section 89 SAT Act)',
    ltNoticeModalTitle: 'Statutory Land Transfer (LT) Notice Packet — Section 89 SAT Act 1950',

    areaAllocationBar: 'Real-Time Khatian Decimals Allocation:',
    totalDecimals: 'Total Area:',
    lockedDecimals: 'Locked in Mutation:',
    requestedDecimals: 'Requested Transfer:',
    availableDecimals: 'Net Available:',

    revenueBreakdown: 'Unified GovTech Revenue & Tax Calculation',
    stampDuty: 'Stamp Duty (1.5%):',
    regFee: 'Registration Fee (1.0%):',
    localTax: 'Local Govt Tax (3.0%):',
    sourceTax: 'Capital Gains Tax (4.0%):',
    eMutationFee: 'Bundled e-Mutation Fee (Fixed):',
    eMutationNote: 'Collected once at Sub-Registry — Zero separate payment or visits to AC Land!',
    totalPayable: 'Total Payable Amount:',

    radarTitle: 'Automated 5-Point Consensus Diagnostic Radar',
    radarSubtitle: 'Real-time pre-registration consensus audit across all institutional silos',
    check1Title: 'Check 1: Biometric & NID Ownership',
    check2Title: 'Check 2: 4-Stage Title Lineage (CS ➔ SA ➔ RS ➔ BS)',
    check3Title: 'Check 3: Anti-Double-Selling & Ejmali Quota Balance',
    check4Title: 'Check 4: Commercial Bank Mortgage Lien',
    check5Title: 'Check 5: Judicial Injunction & DC Acquisition',
    viewLineageTree: 'View Lineage Node Tree',

    registerBtn: '✍️ Register Deed, Lock Area & Auto-Trigger e-Mutation',
    blockedAlertTitle: '🛑 REGISTRATION BLOCKED BY SETULAND CONSENSUS ENGINE',
    blockedAlertSubtitle: 'Discrepancy detected during pre-registration diagnostic. Deed execution prevented.',

    // AC Land
    acLandTitle: 'AC Land Office: Automated e-Mutation Queue & Jomabhag Ledger',
    acLandSubtitle: 'Zero manual paperwork: Deeds registered at Sub-Registry arrive here automatically with locked decimals, Khajna clearance, and Digital LT Notice.',
    filterAll: 'All Cases',
    filterPendingTahsil: 'Pending Tahsil',
    filterReadyApproval: 'Ready for AC Land Approval',
    filterCompleted: 'Approved & Split',
    searchCasePlaceholder: 'Search by Tracking ID, Deed No, or Buyer Name...',

    khatianSplitPreview: 'Visual Jomabhag (জমাভাগ) Split Preview (Before vs. After Approval):',
    parentKhatian: 'Original Parent Khatian:',
    resultingKhatians: 'Resulting Ledger Entries After Jomabhag Split:',
    sellerRetains: 'Seller Retains Remaining:',
    buyerNewKhatian: 'Brand-New Khatian Issued to Buyer:',

    verifyTahsilBtn: '📋 Step 1: Verify Union Land (Tahsil) Field Report',
    tahsilVerifiedBadge: 'Tahsil Field Inquiry Verified',
    approveSplitBtn: '✅ Step 2: Approve e-Mutation & Execute Jomabhag Split (BS-XXXX/A)',
    viewPorchaBtn: '🖨️ View Official Digital Khatian (Porcha)',

    // Module 6: SLA
    simulateDelayBtn: '⏳ Simulate 8-Day Office Delay (Test Auto-Escalation)',
    slaEscalatedAlert: '🚨 AUTO-ESCALATED TO ADC (REVENUE) & UNO FOR DELAY AUDIT — 7-Day Fast-Track SLA Breached!',

    // Citizen
    citizenTitle: 'Citizen & Buyer Public Transparency Portal',
    citizenSubtitle: 'Track your automated e-mutation journey across 5 government stages in real time or inspect any land parcel for active mortgages, court stays, and title lineage.',
    tabTracker: '📍 Live 5-Stage Mutation Tracker',
    tabInspector: '🔍 "Check Before You Buy" Inspector & Mouza GIS',
    tabTamper: '🛡️ Merkle Hash-Chain & Tamper Lab',

    trackingSearchPlaceholder: 'Enter Mutation Tracking ID (e.g. MUT-2026-5001) or Deed No...',
    trackBtn: 'Track Case',
    smsSimulationTitle: 'Automated Citizen SMS & Notification Dispatch:',
    
    // Stages
    stage1: '1. Deed Executed',
    stage1Desc: 'Deed registered & SHA-256 generated at Sub-Registry.',
    stage2: '2. Escrow Locked',
    stage2Desc: 'Decimals digitally locked against double-selling.',
    stage3: '3. Dispatched to AC Land',
    stage3Desc: 'Digital LT Notice auto-dispatched to AC Land queue.',
    stage4: '4. Tahsil Verified',
    stage4Desc: 'Union Land Assistant Officer filed affirmative ground inquiry.',
    stage5: '5. Mutation Approved',
    stage5Desc: 'Jomabhag split executed and new buyer Porcha issued.',

    // Inspector
    verdictSafe: '🟢 SAFE TO BUY (Clean Title — Unencumbered)',
    verdictCaution: '🟡 CAUTION: PARTIAL AREA LOCKED IN PENDING MUTATION',
    verdictDanger: '🔴 DO NOT BUY: MORTGAGED / COURT DISPUTED / ACQUIRED',
    selectPlotToInspect: 'Select Parcel to Inspect on Cadastral Map:',

    // Tamper Simulator
    tamperTitle: 'Live Cryptographic Merkle Hash-Chain & Tamper Lab',
    tamperSubtitle: 'Simulate insider SQL database tampering or forged deed decimals, witnessing immediate Merkle chain invalidation across all subsequent blocks.',
    authenticPayload: 'Authentic Registered Deed Payload (JSON):',
    originalHash: 'Original Ledger SHA-256 Hash:',
    tamperBtn: '⚡ Simulate Insider Database Tampering / Fake Deed (+10.00 Decimals)',
    restoreBtn: '🔄 Restore Authentic State',
    tamperAlert: '⚠️ MERKLE CHAIN BROKEN: HASH MISMATCH! State transition invalidated.',
    integrityValid: '✅ CRYPTOGRAPHIC HASH-CHAIN 100% VERIFIED: All block transitions authentic.',

    // Institutional Locks
    locksTitle: 'Bank, Judiciary & DC Office Statutory Lock Panel',
    locksSubtitle: 'Inspect and toggle institutional encumbrances in real time to witness instant cross-registry fraud prevention at the Sub-Registry.',
    bankMortgageSection: '🏦 Commercial Bank Mortgage Liens (CIB Sync)',
    courtInjunctionSection: '⚖️ Civil Court Stay Orders (Order 39 Rule 1 CPC)',
    dcAcquisitionSection: '🏗️ DC Office Land Acquisition & Statutory Compensation Calculator',
    calcCompBtn: 'Disburse Compensation into Escrow',

    // Modals
    printBtn: 'Print / Save Official PDF',
    closeBtn: 'Close',

    // Module 8: Warisan
    warisanTitle: 'Warisan (ওয়ারিশ) Heir Estate Succession Calculator',
    warisanSubtitle: 'Automated Faraidh & statutory inheritance share calculation with 1-click mutation split generation for all legal heirs.',
    deceasedKhatianSelect: 'Select Deceased Owner Khatian:',
    totalEstateArea: 'Total Estate Decimals to Distribute:',
    addHeirBtn: '+ Add Heir Member',
    calculateSharesBtn: 'Calculate Statutory Shares',
    generateWarisanMutationBtn: '⚡ Generate e-Mutation Cases & Split Khatians for Heirs',
    heirRelationship: 'Relationship to Deceased',
    heirName: 'Heir Full Name',
    heirNid: 'Citizen NID',
    heirPhone: 'Mobile Phone',
    heirShareFraction: 'Share Fraction',
    heirAssignedDecimals: 'Assigned Decimals',
    heirTraditionalShare: 'Traditional Measure (আনা/গণ্ডা)',

    // Module 9: Gov-SMS
    smsDrawerTitle: 'Gov-SMS Gateway & Notification Dispatch Log',
    smsDrawerSubtitle: 'Real-time broadcast logs dispatched to citizens via shortcode 88096...',
    unreadSmsCount: 'Dispatched Logs',
    resendSmsBtn: 'Resend SMS',
    resendSuccess: 'Gov-SMS re-dispatched via Shortcode 88096 successfully!',
  },
  bn: {
    appName: 'সেতু-ল্যান্ড',
    appSubtitle: 'স্মার্ট সাব-রেজিস্ট্রি ও স্বয়ংক্রিয় ই-নামজারি সমন্বয় ইঞ্জিন',
    hackathonTrack: 'ল্যান্ডটেক ২০২৬ — ট্র্যাক পি৪: ডিজিটাল ভূমি রেকর্ড ও রেজিস্ট্রি রূপান্তর',
    complianceRibbon: '⚠️ ল্যান্ডটেক ২০২৬ কমপ্লায়েন্স মোড: শতভাগ কৃত্রিম/ডামি ডেটা ব্যবহৃত। কোনো বাস্তব ব্যক্তি বা জমির রেকর্ড নয়।',
    resetDemo: 'রিসেট ডেমো ডেটা',
    liveLedger: 'লাইভ হ্যাশ-চেইন',
    shaConsensusActive: 'এসএইচএ-২৫৬ মারকেল কনসেনসাস সক্রিয়',

    // Roles
    roleSubRegistrar: 'সাব-রেজিস্ট্রি অফিস',
    roleSubRegistrarDesc: 'দলিল সম্পাদন ও ৫-পয়েন্ট ডায়াগনস্টিক',
    roleAcLand: 'এসি ল্যান্ড অফিস',
    roleAcLandDesc: 'স্বয়ংক্রিয় নামজারি কিউ ও জমাভাগ বিভাজন',
    roleCitizen: 'নাগরিক ও ক্রেতা পোর্টাল',
    roleCitizenDesc: '৫-স্তরের পিৎজা ট্র্যাকার ও নকশা যাচাই',
    roleLocks: 'সংবিধিবদ্ধ লক প্যানেল',
    roleLocksDesc: 'ব্যাংক বন্ধক, আদালত নিষেধাজ্ঞা ও ডিসি অধিগ্রহণ',

    // KPIs
    kpiTotalPlots: 'মোট রেকর্ডভুক্ত দাগ (বিএস লেজার)',
    kpiTotalPlotsSub: 'ডিএলআরএস নকশা সিঙ্ক',
    kpiLockedArea: 'চলমান নামজারিতে লককৃত জমি',
    kpiLockedAreaSub: 'দ্বৈত-বিক্রয় রোধ এসক্রো',
    kpiAutoQueue: 'এসি ল্যান্ডে স্বয়ংক্রিয় প্রেরিত',
    kpiAutoQueueSub: 'ধারা ৮৯ ডিজিটাল এলটি নোটিশ',
    kpiFraudBlocked: 'প্রতারণা ও দ্বৈত-বিক্রয় রোধ',
    kpiFraudBlockedSub: 'কনসেনসাস অডিট কার্যকর',

    // Sub-Registrar 5 Scenarios
    scenariosHeader: '⚡ ১-ক্লিকে বিচারকদের ডেমো সিনারিও (বাস্তব সমস্যা ও সমাধান পরীক্ষা করুন):',
    scenario1: '✅ সিনারিও ১: নির্ভেজাল বিক্রয় + খাজনা সমন্বয় + ডিজিটাল এলটি নোটিশ (BS-1001)',
    scenario2: '🛑 সিনারিও ২: দ্বৈত-বিক্রয় / লককৃত জমি জালিয়াতি রোধ (BS-1002)',
    scenario3: '👨‍👩‍👧‍👦 সিনারিও ৩: ইজমালি শরিকদের অতিরিক্ত অংশ বিক্রির চেষ্টা রোধ (BS-1006)',
    scenario4: '🏦 সিনারিও ৪: ব্যাংক বন্ধকী জমি বিক্রির চেষ্টা রোধ (BS-1003)',
    scenario5: '⚖️ সিনারিও ৫: আদালত মামলাধীন জমি বিক্রির চেষ্টা রোধ (BS-1004)',

    deedDrafting: 'স্মার্ট সাব-কবলা দলিল সম্পাদন ফরম',
    selectKhatian: 'মূল বিএস খতিয়ান ও দাগ নির্বাচন:',
    sellerInfo: 'বিক্রেতার বিবরণ (খতিয়ান অনুযায়ী স্বয়ংক্রিয়):',
    buyerInfo: 'ক্রেতা নির্বাচন (নাগরিক ডাটাবেজ):',
    transferArea: 'হস্তান্তরিত জমি (শতাংশ):',
    salePrice: 'ঘোষিত বিক্রয় মূল্য (টাকা):',
    biometricVerified: 'বায়োমেট্রিক ও ইসি এনআইডি যাচাইকৃত',

    // Module 1: Ejmali
    ejmaliQuotaHeader: '👨‍👩‍👧‍👦 ইজমালি যৌথ সম্পত্তি ও শরিকদের হিস্যা/অংশ স্থিতি:',
    ejmaliQuotaAlert: '🛑 EJMALI QUOTA VIOLATION (শরিকের অতিরিক্ত জমি বিক্রয় রোধ): বিক্রেতা এই খতিয়ানে তার বৈধ অংশের অতিরিক্ত জমি বিক্রয় করতে পারবেন না।',
    preEmptionNoticeBadge: '📲 ধারা ৯৬ মোতাবেক সহ-শরিকদের মোবাইলে স্বয়ংক্রিয় ডিজিটাল অগ্রক্রয় নোটিশ (SMS) প্রেরিত',
    coSharerSharesList: 'রেকর্ডভুক্ত সহ-শরিক ও তাদের অংশ (আনা/হিস্যা):',

    // Module 2: Khajna
    khajnaCardTitle: 'ভূমি উন্নয়ন কর (খাজনা দাখিলা) স্থিতি:',
    khajnaClean: '✅ ১৪৩৩ বঙ্গাব্দ (২০২৬) পর্যন্ত ভূমি উন্নয়ন কর পরিশোধিত। দাখিলা সঠিক।',
    khajnaArrearAlert: '⚠️ বকেয়া খাজনা চিহ্নিত: সাব-রেজিস্ট্রির একীভূত চেকআউটে স্বয়ংক্রিয়ভাবে সংযুক্ত করা হয়েছে!',
    bundledKhajnaFee: 'একীভূত বকেয়া ভূমি উন্নয়ন কর (খাজনা):',

    // Module 3: LT Notice
    viewLtNoticeBtn: '📄 সংবিধিবদ্ধ ডিজিটাল এলটি নোটিশ দেখুন (ধারা ৮৯)',
    ltNoticeModalTitle: 'ভূমি হস্তান্তর (এলটি) নোটিশ প্যাকেট — ধারা ৮৯, রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন ১৯৫০',

    areaAllocationBar: 'খতিয়ানের মোট জমির রিয়েল-টাইম বণ্টন অনুপাত:',
    totalDecimals: 'মোট জমি:',
    lockedDecimals: 'লককৃত জমি:',
    requestedDecimals: 'হস্তান্তরের আবেদন:',
    availableDecimals: 'অবশিষ্ট বিক্রয়যোগ্য:',

    revenueBreakdown: 'একীভূত সরকারি ফি ও রাজস্ব হিসাব',
    stampDuty: 'স্ট্যাম্প ডিউটি (১.৫%):',
    regFee: 'রেজিস্ট্রেশন ফি (১.০%):',
    localTax: 'স্থানীয় সরকার কর (৩.০%):',
    sourceTax: 'উৎসে আয়কর / গেইন ট্যাক্স (৪.০%):',
    eMutationFee: 'একীভূত ই-নামজারি ফি (স্থির):',
    eMutationNote: 'সাব-রেজিস্ট্রি কাউন্টারে একবারই আদায়কৃত — এসি ল্যান্ডে পৃথক কোনো ফি লাগবে না!',
    totalPayable: 'মোট প্রদেয় সরকারি রাজস্ব:',

    radarTitle: 'স্বয়ংক্রিয় ৫-পয়েন্ট কনসেনসাস প্রি-রেজিস্ট্রেশন রাডার',
    radarSubtitle: 'দলিল নিবন্ধনের পূর্বে সকল সরকারি দপ্তরের ডাটাবেজের সাথে রিয়েল-টাইম ঐক্যমত্য যাচাই',
    check1Title: 'চেক ১: বিক্রেতার মালিকানা ও বায়োমেট্রিক এনআইডি',
    check2Title: 'চেক ২: ৪-স্তরের মালিকানা ধারাবাহিকতা (CS ➔ SA ➔ RS ➔ BS)',
    check3Title: 'চেক ৩: দ্বৈত-বিক্রয় রোধ ও ইজমালি শরিকদের হিস্যা যাচাই',
    check4Title: 'চেক ৪: তফসিলি ব্যাংক বন্ধকী দায়মুক্ততা',
    check5Title: 'চেক ৫: দেওয়ানি আদালতের স্থিতাবস্থা ও ডিসি অধিগ্রহণ মুক্ততা',
    viewLineageTree: 'মালিকানা ধারাবাহিকতা বৃক্ষ দেখুন',

    registerBtn: '✍️ দলিল সম্পাদন, জমি লক ও স্বয়ংক্রিয় নামজারি প্রেরণ',
    blockedAlertTitle: '🛑 সেতু-ল্যান্ড কনসেনসাস ইঞ্জিনে দলিল নিবন্ধন স্থগিত',
    blockedAlertSubtitle: '৫-পয়েন্ট যাচাইয়ে অসঙ্গতি ধরা পড়ায় প্রতারণামূলক দলিল সম্পাদন আটকে দেওয়া হয়েছে।',

    // AC Land
    acLandTitle: 'এসি ল্যান্ড অফিস: স্বয়ংক্রিয় ই-নামজারি কিউ ও জমাভাগ লেজার ইঞ্জিন',
    acLandSubtitle: 'জিরো-টাচ সেবা: সাব-রেজিস্ট্রির দলিল নিবন্ধনের সাথে সাথে জমি লক হয়ে ডিজিটাল এলটি নোটিশসহ এসি ল্যান্ডের কিউতে উপস্থাপিত হয়।',
    filterAll: 'সকল মামলা',
    filterPendingTahsil: 'তহশিল তদন্তাধীন',
    filterReadyApproval: 'নামজারি অনুমোদনের অপেক্ষায়',
    filterCompleted: 'অনুমোদিত ও খতিয়ান সৃজনকৃত',
    searchCasePlaceholder: 'ট্র্যাকিং আইডি, দলিল নম্বর বা ক্রেতার নাম দিয়ে খুঁজুন...',

    khatianSplitPreview: 'অনুমোদনের পূর্বে ও পরে জমাভাগ (খতিয়ান বিভাজন) এর চিত্র:',
    parentKhatian: 'বিক্রেতার মূল খতিয়ান:',
    resultingKhatians: 'জমাভাগের পর সৃজিত দুটি খতিয়ান:',
    sellerRetains: 'বিক্রেতার অবশিষ্ট জমি:',
    buyerNewKhatian: 'ক্রেতার বরাবরে নতুন সৃজিত খতিয়ান:',

    verifyTahsilBtn: '📋 ধাপ ১: ইউনিয়ন ভূমি (তহশিল) সহকারী কর্মকর্তার তদন্ত প্রতিবেদন দাখিল',
    tahsilVerifiedBadge: 'তহশিলদারের সরেজমিন তদন্ত সম্পন্ন',
    approveSplitBtn: '✅ ধাপ ২: নামজারি অনুমোদন ও জমাভাগ বিভাজন (BS-XXXX/A)',
    viewPorchaBtn: '🖨️ অনুমোদিত নতুন ডিজিটাল খতিয়ান (পর্চা) দেখুন',

    // Module 6: SLA
    simulateDelayBtn: '⏳ ৮ দিনের বিলম্ব সিমুলেট করুন (স্বয়ংক্রিয় এস্কেলেশন টেস্ট)',
    slaEscalatedAlert: '🚨 এডিসি (রাজস্ব) ও ইউএনও এর বরাবরে স্বয়ংক্রিয় এস্কেলেটকৃত — ৭ দিনের ফাস্ট-ট্র্যাক এসএলএ লঙ্ঘিত!',

    // Citizen
    citizenTitle: 'নাগরিক, ক্রেতা ও ডেভেলপার সেবা পোর্টাল',
    citizenSubtitle: 'দলিল রেজিস্ট্রির পর ৫ স্তরের স্বয়ংক্রিয় অগ্রগতি পর্যবেক্ষণ করুন অথবা যেকোনো জমি কেনার আগে বন্ধক, মামলা ও মালিকানার ধারাবাহিকতা যাচাই করুন।',
    tabTracker: '📍 লাইভ ৫-স্তরের নামজারি ট্র্যাকার',
    tabInspector: '🔍 "কেনার আগে যাচাই" ও ডিএলআরএস মৌজা ম্যাপ',
    tabTamper: '🛡️ মারকেল হ্যাশ-চেইন ও জালিয়াতি প্রতিরোধ ল্যাব',

    trackingSearchPlaceholder: 'নামজারি ট্র্যাকিং আইডি (যেমন: MUT-2026-5001) বা দলিল নম্বর দিন...',
    trackBtn: 'অনুসন্ধান',
    smsSimulationTitle: 'নাগরিকের মোবাইলে স্বয়ংক্রিয় প্রেরিত এসএমএস বার্তা:',

    // Stages
    stage1: '১. দলিল রেজিস্ট্রি সম্পন্ন',
    stage1Desc: 'সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধিত ও এসএইচএ-২৫৬ হ্যাশ সিলযুক্ত।',
    stage2: '২. এসক্রো লক কার্যকর',
    stage2Desc: 'দ্বৈত-বিক্রয় রোধে বিক্রিত শতাংশ মূল খতিয়ানে লক করা হয়েছে।',
    stage3: '৩. ডিজিটাল এলটি নোটিশ প্রেরণ',
    stage3Desc: 'ধারা ৮৯ অনুযায়ী ডিজিটাল এলটি নোটিশ এসি ল্যান্ডের কিউতে স্বয়ংক্রিয় প্রেরিত।',
    stage4: '৪. তহশিল তদন্ত সম্পন্ন',
    stage4Desc: 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা কর্তৃক সরেজমিন তদন্ত প্রতিবেদন দাখিল।',
    stage5: '৫. নামজারি ও জমাভাগ খতিয়ান সৃজন',
    stage5Desc: 'এসি ল্যান্ড কর্তৃক নামজারি অনুমোদন এবং নতুন খতিয়ান ও পর্চা হস্তান্তর।',

    // Inspector
    verdictSafe: '🟢 নিরাপদ জমি (ক্রয়যোগ্য — কোনো দায় নেই)',
    verdictCaution: '🟡 সতর্কতা: চলমান নামজারিতে আংশিক জমি লককৃত',
    verdictDanger: '🔴 ক্রয় নিষিদ্ধ: ব্যাংক বন্ধকী / মামলাধীন / সরকার কর্তৃক অধিগ্রহণকৃত',
    selectPlotToInspect: 'মৌজা নকশায় দাগ নির্বাচন করুন:',

    // Tamper Simulator
    tamperTitle: 'লাইভ ক্রিপ্টোগ্রাফিক মারকেল হ্যাশ-চেইন ও জাল দলিল প্রতিরোধ ল্যাব',
    tamperSubtitle: 'ডেটাবেজে জমি বা নাম পরিবর্তন করে দেখুন কিভাবে মারকেল হ্যাশ-চেইন ভেঙে গিয়ে প্রতিটি পরবর্তী ব্লক অবৈধ ঘোষিত হয়।',
    authenticPayload: 'আসল রেজিস্ট্রিকৃত দলিলের ডেটা পেলোড (JSON):',
    originalHash: 'লেজারের মূল এসএইচএ-২৫৬ হ্যাশ:',
    tamperBtn: '⚡ ডেটাবেজে কৃত্রিম পরিবর্তন আনুন (জমি +১০ শতাংশ বৃদ্ধি ও নাম পরিবর্তন)',
    restoreBtn: '🔄 মূল ও সঠিক ডেটা পুনরুদ্ধার',
    tamperAlert: '⚠️ মারকেল চেইন ভঙ্গ শনাক্ত: হ্যাশ মেলেনি! অবৈধ ডেটা তাৎক্ষণিক বাতিল।',
    integrityValid: '✅ মারকেল হ্যাশ-চেইন শতভাগ যাচাইকৃত: পূর্বাপর সকল ট্রানজ্যাকশন ব্লক অবিকৃত ও আসল।',

    // Institutional Locks
    locksTitle: 'ব্যাংক, আদালত ও ডিসি অফিস সংবিধিবদ্ধ লক প্যানেল',
    locksSubtitle: 'বিচারকমণ্ডলী যেকোনো জমির বন্ধক, নিষেধাজ্ঞা বা ডিসি অধিগ্রহণ অন/অফ করে সাথে সাথে সাব-রেজিস্ট্রির ব্লকিং অ্যালগরিদম পরীক্ষা করতে পারেন।',
    bankMortgageSection: '🏦 তফসিলি ব্যাংক ও আর্থিক প্রতিষ্ঠান বন্ধকী লক (সিআইবি সিঙ্ক)',
    courtInjunctionSection: '⚖️ দেওয়ানি আদালতের নিষেধাজ্ঞা লক (Order 39 Rule 1 CPC)',
    dcAcquisitionSection: '🏗️ জেলা প্রশাসক (ডিসি) কার্যালয় ভূমি অধিগ্রহণ ও সংবিধিবদ্ধ ক্ষতিপূরণ ক্যালকুলেটর',
    calcCompBtn: 'ক্ষতিপূরণের টাকা এসক্রোতে প্রদান করুন',

    // Modals
    printBtn: 'প্রিন্ট / পিডিএফ হিসেবে সংরক্ষণ',
    closeBtn: 'বন্ধ করুন',

    // Module 8: Warisan
    warisanTitle: 'উত্তরাধিকার ও ওয়ারিশান ফারায়েজ বণ্টন ক্যালকুলেটর',
    warisanSubtitle: 'স্বয়ংক্রিয় ফারায়েজ বণ্টন ও শতভাগ নির্ভুল হিস্যা নির্ধারণপূর্বক ১-ক্লিকে ওয়ারিশদের নামে জমাভাগ নামজারি সৃজন।',
    deceasedKhatianSelect: 'মরহুমের মূল খতিয়ান নির্বাচন:',
    totalEstateArea: 'বণ্টনযোগ্য মোট জমির পরিমাণ:',
    addHeirBtn: '+ নতুন ওয়ারিশ যুক্ত করুন',
    calculateSharesBtn: 'আইনগত হিস্যা গণনা করুন',
    generateWarisanMutationBtn: '⚡ ওয়ারিশদের নামে স্বয়ংক্রিয় নামজারি ও জমাভাগ খতিয়ান সৃজন',
    heirRelationship: 'মরহুমের সাথে সম্পর্ক',
    heirName: 'ওয়ারিশের নাম',
    heirNid: 'এনআইডি নম্বর',
    heirPhone: 'মোবাইল নম্বর',
    heirShareFraction: 'হিস্যা বা অংশ',
    heirAssignedDecimals: 'বণ্টনকৃত জমি (শতাংশ)',
    heirTraditionalShare: 'প্রচলিত হিসাব (আনা/গণ্ডা/কড়া)',

    // Module 9: Gov-SMS
    smsDrawerTitle: 'সরকারি এসএমএস গেটওয়ে ও নোটিফিকেশন ডিসপ্যাচ লগ',
    smsDrawerSubtitle: 'শর্টকোড 88096... এর মাধ্যমে নাগরিকদের মোবাইলে রিয়েল-টাইম প্রেরিত বার্তা বিবরণী',
    unreadSmsCount: 'প্রেরিত বার্তা',
    resendSmsBtn: 'পুনরায় প্রেরণ',
    resendSuccess: 'শর্টকোড 88096 দিয়ে সফলভাবে এসএমএস পুনরায় প্রেরণ করা হয়েছে!',
  },
};

export function t(lang: Language, key: keyof typeof DICTIONARY['en']): string {
  return DICTIONARY[lang][key] || DICTIONARY['en'][key] || key;
}
