export type Language = 'en' | 'bn';
export type ActiveRole = 'SUB_REGISTRAR' | 'AC_LAND' | 'CITIZEN' | 'INSTITUTIONAL_LOCKS';

export interface Citizen {
  id: string;
  dummyNid: string;          // MUST follow format: "DUMMY-NID-2026-XXXX"
  nameEn: string;
  nameBn: string;
  fatherNameEn: string;
  fatherNameBn: string;
  phone: string;             // MUST follow format: "01700-00000X"
  verifiedBiometric: boolean;
}

export interface LineageRecord {
  surveyType: 'CS' | 'SA' | 'RS' | 'BS';
  khatianNo: string;
  dagNo: string;
  recordedOwnerEn: string;
  recordedOwnerBn: string;
  areaDecimals: number;
  year: number;
  verifiedMatch: boolean;
}

export interface CoSharer {
  citizenId: string;
  nameEn: string;
  nameBn: string;
  dummyNid: string;
  phone?: string;
  shareFraction: number;     // e.g., 0.25 (25% or 4 আনা)
  shareLabelBn: string;      // e.g., "৪ আনা (২৫.০০%)"
  maxOwnedDecimals: number;  // e.g., 4.00
  lockedDecimals: number;    // e.g., 0.00
}

export interface DigitalLtNotice {
  ltNoticeNo: string;        // e.g., "LT-SEC89-2026-9041"
  statutoryReference: string;// "Section 89, State Acquisition and Tenancy Act 1950"
  deedNo: string;
  khatianNo: string;
  dagNo: string;
  mouzaEn: string;
  mouzaBn: string;
  sellerName: string;
  sellerNid: string;
  buyerName: string;
  buyerNid: string;
  transferDecimals: number;
  dakhilaReceiptNo: string;
  bundledMutationFeeReceiptNo: string;
  sha256PacketSeal: string;
  dispatchedAtTimestamp: string;
  recipientOffice: string;
  status: 'AUTO_TRANSMITTED_TO_AC_LAND';
}

export interface KhatianRecord {
  id: string;
  khatianNo: string;         // e.g., "BS-1001" or split "BS-1001/A"
  parentRsKhatian: string;   // e.g., "RS-440"
  parentBsKhatian?: string;  // e.g., "BS-1001" if created via Jomabhag
  holdingNo?: string;        // e.g., "HOLD-2026-405/A"
  districtEn: string;
  districtBn: string;
  upazilaEn: string;
  upazilaBn: string;
  mouzaEn: string;
  mouzaBn: string;
  jlNo: string;
  dagNo: string;             // e.g., "405"
  landClassEn: string;       // e.g., "Bhom / Residential (ভিটা)" or "Nal / Agricultural (নাল)"
  landClassBn: string;
  ownerId: string;
  totalAreaDecimals: number; // Total owned decimals in this Khatian
  lockedAreaDecimals: number;// Decimals currently locked in an active pending e-Mutation!
  officialRatePerDecimalBdt: number; // Mouza government minimum rate for tax calculation

  // Module 1: Ejmali Joint Property & Co-Sharers (শরিকদের অংশ)
  isEjmaliProperty: boolean;
  coSharers?: CoSharer[];
  preEmptionNoticeSent?: boolean; // Section 96 SAT Act 1950 (অগ্রক্রয় নোটিশ)

  // Module 2: Land Development Tax (খাজনা দাখিলা)
  ldTaxPaidUpToBanglaYear: string; // e.g. "1433 BS (2026)" or "1430 BS (2023 - ARREARS DUE)"
  ldTaxArrearBdt: number;          // e.g. 0 or 1450
  dakhilaReceiptNo: string;        // e.g. "DAKHILA-2026-88412"

  // Institutional Locks (Section 4 of Rule Book)
  isMortgaged: boolean;
  mortgageBankEn?: string;
  mortgageBankBn?: string;
  mortgageLoanAmountBdt?: number;
  hasCourtCase: boolean;
  courtCaseNo?: string;
  courtDetailsEn?: string;
  courtDetailsBn?: string;
  isDcAcquisition: boolean;
  dcProjectNameEn?: string;
  dcProjectNameBn?: string;

  // GIS SVG Coordinates for Interactive DLRS Mouza Map
  svgPath: string;
  labelX: number;
  labelY: number;
  isSplitPlot?: boolean;
  subDivisionLabel?: string; // e.g. "BS-1001 & BS-1001/A"

  // Cryptographic & Lineage
  lineageChain: LineageRecord[];
  blockIndex?: number;
  previousHash?: string;
  recordHash: string;        // SHA-256 hash of current state
  lastUpdated: string;
}

export interface VerificationCheckResult {
  passedAll: boolean;
  timestamp: string;
  checks: {
    ownershipMatch: { passed: boolean; messageEn: string; messageBn: string; detail: string };
    lineageContinuity: { passed: boolean; messageEn: string; messageBn: string; detail: string };
    unlockedAreaBalance: { passed: boolean; messageEn: string; messageBn: string; availableDecimals: number; requestedDecimals: number };
    bankMortgageClearance: { passed: boolean; messageEn: string; messageBn: string; detail: string };
    courtAndAcquisitionClearance: { passed: boolean; messageEn: string; messageBn: string; detail: string };
    // Real-world GovTech Checks
    ejmaliCoSharerQuota?: { 
      passed: boolean; 
      messageEn: string; 
      messageBn: string; 
      isEjmali: boolean;
      sellerShareFraction: number; 
      sellerShareLabel: string;
      sellerMaxDecimals: number; 
      availableShareDecimals: number; 
      requestedDecimals: number; 
    };
    khajnaClearance?: { 
      passed: boolean; 
      messageEn: string; 
      messageBn: string; 
      arrearBdt: number; 
      paidUpTo: string;
      dakhilaNo: string; 
      autoBundled: boolean; 
    };
  };
}

export interface RevenueBreakdown {
  declaredValueBdt: number;
  minimumGovtValueBdt: number;
  assessableValueBdt: number;
  stampDutyBdt: number;        // 1.5%
  registrationFeeBdt: number;  // 1.0%
  localGovtTaxBdt: number;     // 3.0%
  sourceTaxGainBdt: number;    // 4.0%
  bundledEMutationFeeBdt: number; // Fixed 1,170 BDT
  ldTaxArrearBdt: number;      // Module 2: Auto-bundled unpaid Khajna arrears
  totalPayableBdt: number;
}

export interface DeedRecord {
  id: string;
  deedNo: string;              // e.g., "DEED-2026-9001"
  khatianId: string;
  khatianNo: string;
  dagNo: string;
  mouzaEn: string;
  mouzaBn: string;
  sellerId: string;
  buyerId: string;
  transferAreaDecimals: number;
  salePriceBdt: number;
  revenue: RevenueBreakdown;
  verificationSnapshot: VerificationCheckResult;
  deedHash: string;            // SHA-256
  blockIndex: number;
  previousHash: string;
  linkedMutationTrackingId: string;
  ltNotice?: DigitalLtNotice;  // Module 3: Statutory Section 89 Digital LT Notice
  preEmptionNoticeSent?: boolean; // Module 1: Section 96 SAT Act
  dakhilaReceiptNo?: string;   // Module 2: Fresh Dakhila
  createdAt: string;
}

export type MutationStage =
  | 'STAGE_1_DEED_REGISTERED'
  | 'STAGE_2_AREA_LOCKED'
  | 'STAGE_3_AUTO_SENT_TO_AC_LAND'
  | 'STAGE_4_TAHSIL_VERIFIED'
  | 'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED'
  | 'REJECTED_DISCREPANCY';

export type SlaStatus = 'ON_TRACK' | 'WARNING_ADC_NOTIFIED' | 'ESCALATED_TO_ADC_REVENUE';

export interface MutationCase {
  id: string;
  trackingId: string;          // e.g., "MUT-2026-5001"
  caseNo: string;              // e.g., "MISC-CASE-2026-114"
  deedId: string;
  deedNo: string;
  sourceKhatianId: string;
  sourceKhatianNo: string;
  dagNo: string;
  sellerId: string;
  buyerId: string;
  transferAreaDecimals: number;
  stage: MutationStage;
  
  // Module 6: Statutory SLA Countdown & Anti-Harassment Escalation
  slaTargetDays: number;       // default 7 (Fast-Track Digital LT Notice SLA)
  statutoryMaxDays: number;   // default 28 (Manual statutory limit)
  daysElapsed: number;         // simulated days elapsed
  escalationStatus: SlaStatus;
  
  // Module 3 & 5: LT Notice and Jomabhag
  ltNotice?: DigitalLtNotice;
  dakhilaReceiptNo?: string;
  holdingNo?: string;
  parentBsKhatian?: string;

  tahsilReportNoteEn?: string;
  tahsilReportNoteBn?: string;
  tahsilVerifiedAt?: string;
  acLandApprovedAt?: string;
  issuedNewKhatianNo?: string; // e.g., "BS-1001/A"
  issuedNewKhatianId?: string;
  sellerRemainingDecimalsAfterSplit?: number;
  mutationHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  blockIndex: number;
  timestamp: string;
  eventType: 
    | 'DEED_REGISTERED' 
    | 'ESCROW_LOCKED' 
    | 'TAHSIL_VERIFIED' 
    | 'MUTATION_APPROVED' 
    | 'KHATIAN_SPLIT' 
    | 'BANK_MORTGAGE_TOGGLED' 
    | 'COURT_INJUNCTION_TOGGLED' 
    | 'DC_ACQUISITION_TOGGLED' 
    | 'FRAUD_PREVENTED'
    | 'LT_NOTICE_DISPATCHED'
    | 'SLA_ESCALATED'
    | 'KHANA_CLEARED'
    | 'WARISAN_ESTATE_DISTRIBUTED'
    | 'SMS_DISPATCHED';
  entityId: string;
  detailsEn: string;
  detailsBn: string;
  actorRole: string;
  actorName: string;
  prevHash: string;
  previousHash?: string;
  currentHash: string;
}

// Module 8: Warisan (ওয়ারিশ) Heir Inheritance Tree Engine
export type HeirRelationship = 'WIFE' | 'HUSBAND' | 'SON' | 'DAUGHTER' | 'FATHER' | 'MOTHER' | 'BROTHER' | 'SISTER';

export interface HeirMember {
  id: string;
  nameEn: string;
  nameBn: string;
  relationship: HeirRelationship;
  dummyNid: string;
  phone: string;
  calculatedShareFraction: number; // e.g., 0.1250 (1/8th) or 0.2500 (1/4th)
  assignedDecimals: number;        // Calculated from deceased's total decimals
  shareLabelBn?: string;           // e.g. "১/৮ অংশ (২ আনা)"
  anaShareStr?: string;            // Traditional land measure: 2 আনা 0 গণ্ডা
}

export interface WarisanEstateCase {
  id: string;
  deceasedKhatianId: string;
  deceasedKhatianNo: string;
  deceasedOwnerNameEn: string;
  deceasedOwnerNameBn: string;
  totalEstateDecimals: number;
  heirs: HeirMember[];
  status: 'PENDING_VERIFICATION' | 'APPROVED_MUTATION_GENERATED';
  createdAt: string;
}

// Module 9: Gov-SMS Gateway & Notification Dispatch Log
export interface GovSmsLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  messageEn: string;
  messageBn: string;
  gatewayRef: string; // e.g., "GOV-SMS-88096-9921"
  timestamp: string;
  status: 'DELIVERED' | 'QUEUED';
  triggerEvent: string;
}

