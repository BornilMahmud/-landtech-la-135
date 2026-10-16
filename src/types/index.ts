export type Language = 'en' | 'bn';

export type RoleType = 
  | 'sub_registrar' 
  | 'ac_land' 
  | 'citizen' 
  | 'bank_judiciary' 
  | 'mouza_map' 
  | 'tamper_test';

export interface Citizen {
  id: string;
  dummyNid: string;          // format: "DUMMY-NID-2026-XXXX"
  nameEn: string;
  nameBn: string;
  fatherNameEn: string;
  fatherNameBn: string;
  phone: string;             // format: "01700-00000X"
  verifiedBiometric: boolean;
}

export interface ChainLink {
  surveyType: 'CS' | 'SA' | 'RS' | 'BS';
  khatianNo: string;
  ownerName: string;
  ownerNid: string;
  year: number;
  areaDecimals: number;
  verified: boolean;
}

export interface MortgageDetails {
  bankName: string;
  branch: string;
  loanAccount: string;
  amountBDT: number;
  mortgageDate: string;
}

export interface CourtCaseDetails {
  caseNo: string;
  courtName: string;
  filedDate: string;
  reason: string;
}

export interface AcquisitionDetails {
  projectName: string;
  gazetteNo: string;
  ratePerDecimal: number;
  compensationStatus: 'PENDING' | 'DISBURSED';
}

export interface KhatianRecord {
  id: string;
  khatianNo: string;
  dagNo: string;
  mouza: string;
  mouzaEn?: string;
  mouzaBn: string;
  upazila: string;
  district: string;
  districtEn?: string;
  districtBn?: string;
  ownerName: string;
  ownerNameBn: string;
  ownerNid: string;
  ownerPhone: string;
  totalAreaDecimals: number;
  lockedAreaDecimals: number;
  landClass: string;
  isMortgaged: boolean;
  mortgageDetails?: MortgageDetails;
  hasCourtCase: boolean;
  courtCaseDetails?: CourtCaseDetails;
  isAcquired: boolean;
  acquisitionDetails?: AcquisitionDetails;
  chainOfTitle: ChainLink[];
  sha256Hash: string;
  lastUpdated: string;
  mapPolygon?: {
    points: string;
    center: [number, number];
    label: string;
  };
  // Real-world geodetic & environmental attributes from LandTech-LA-135
  lat?: number;
  lng?: number;
  elevationMeters?: number;
  soilType?: string;
  floodRisk?: 'Low' | 'Moderate' | 'High';
  roadWidthFt?: number;
  zoning?: string;
  estimatedValueBDT?: number;
  utilities?: {
    electricity?: boolean;
    water?: boolean;
    gas?: boolean;
    fiberInternet?: boolean;
  };
  nearbyFacilities?: {
    highwayDistKm?: number;
    marketDistKm?: number;
    hospitalDistKm?: number;
    riverDistKm?: number;
  };
  googleMapsUrl?: string;
  // Module 1: Ejmali Joint Property & Co-Sharers (শরিকদের অংশ)
  isEjmaliProperty?: boolean;
  coSharers?: CoSharer[];
  preEmptionNoticeSent?: boolean; // Section 96 SAT Act (অগ্রক্রয় নোটিশ)

  // Module 2: Land Development Tax (খাজনা দাখিলা)
  ldTaxPaidUpToBanglaYear?: string;
  ldTaxArrearBdt?: number;
  khajnaArrearsBDT?: number;
  dakhilaReceiptNo?: string;

  // Blockchain Hash Chain & Lineage
  blockIndex?: number;
  previousHash?: string;
  recordHash?: string;
  parentRsKhatian?: string;
  holdingNo?: string;
  upazilaEn?: string;
  upazilaBn?: string;
  ownerId?: string;
  landClassEn?: string;
  landClassBn?: string;
  officialRatePerDecimalBdt?: number;
  jlNo?: string;
  svgPath?: string;
  labelX?: number;
  labelY?: number;
  isDcAcquisition?: boolean;
  lineageChain?: any[];
}

export interface CoSharer {
  citizenId: string;
  id?: string;
  name?: string;
  nameEn: string;
  nameBn: string;
  dummyNid: string;
  phone?: string;
  shareFraction: number;     // e.g. 0.25 (25% or 4 আনা)
  shareTraditional?: string; // e.g. "৪ আনা ০ গণ্ডা"
  shareLabelBn: string;      // e.g. "৪ আনা (২৫.০০%)"
  maxOwnedDecimals: number;  // e.g. 4.00
  holdingAreaDecimals?: number; // e.g. 4.00
  lockedDecimals: number;    // e.g. 0.00
}

export interface DigitalLtNotice {
  ltNoticeNo: string;        // e.g. "LT-SEC89-2026-9041"
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

export type SlaStatus = 'ON_TRACK' | 'WARNING_ADC_NOTIFIED' | 'ESCALATED_TO_ADC_REVENUE';

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

export type HeirRelationship = 'WIFE' | 'HUSBAND' | 'SON' | 'DAUGHTER' | 'FATHER' | 'MOTHER' | 'BROTHER' | 'SISTER';

export interface HeirMember {
  id: string;
  nameEn: string;
  nameBn: string;
  relationship: HeirRelationship;
  dummyNid: string;
  phone: string;
  calculatedShareFraction: number; // e.g. 0.1250 (1/8th)
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

export interface GovSmsLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  messageEn: string;
  messageBn: string;
  gatewayRef: string; // e.g. "GOV-SMS-88096-9921"
  timestamp: string;
  status: 'DELIVERED' | 'QUEUED';
  triggerEvent: string;
}


export interface FeeBreakdown {
  saleValueBDT: number;
  stampDutyBDT: number;       // 1.5%
  registrationFeeBDT: number; // 1.0%
  localGovtTaxBDT: number;    // 3.0%
  gainTaxBDT: number;         // 2.0%
  mutationFeeBDT: number;     // 1,170 BDT
  totalFeeBDT: number;
}

export interface DeedRecord {
  id?: string;
  deedNo: string;
  plotId: string;
  khatianId?: string;
  khatianNo: string;
  dagNo: string;
  mouza: string;
  mouzaEn?: string;
  mouzaBn?: string;
  sellerId?: string;
  sellerName: string;
  sellerNid: string;
  buyerId?: string;
  buyerName: string;
  buyerNid: string;
  buyerPhone: string;
  transferAreaDecimals: number;
  saleValueBDT: number;
  salePriceBdt?: number;
  fees: FeeBreakdown;
  registrationDate: string;
  sha256Hash: string;
  deedHash?: string;
  status: 'REGISTERED' | 'MUTATION_PENDING' | 'MUTATED';
  subRegistryOffice: string;
  trackingId: string;
  // Module 3: Digital LT Notice
  ltNotice?: DigitalLtNotice;
  blockIndex?: number;
  previousHash?: string;
  dakhilaReceiptNo?: string;
  preEmptionNoticeSent?: boolean;
}

export type MutationStatus = 
  | 'AUTO_INITIATED' 
  | 'TAHSIL_VERIFIED' 
  | 'MUTATION_APPROVED' 
  | 'REJECTED';

export interface WorkflowStep {
  step: number;
  nameEn: string;
  nameBn: string;
  completed: boolean;
  timestamp?: string;
  note?: string;
}

export interface MutationCase {
  id: string;
  caseNo?: string;
  deedId?: string;
  trackingId?: string;
  sourceKhatianId?: string;
  sourceKhatianNo?: string;
  sellerId?: string;
  buyerId?: string;
  stage?: string;
  deedNo: string;
  parentKhatianNo: string;
  newKhatianNo?: string;
  dagNo: string;
  mouza: string;
  sellerName: string;
  sellerNid: string;
  buyerName: string;
  buyerNid: string;
  buyerPhone: string;
  transferAreaDecimals: number;
  status: MutationStatus;
  autoInitiatedAt: string;
  tahsilVerifiedAt?: string;
  tahsilOfficer?: string;
  approvedAt?: string;
  approvedBy?: string;
  digitalPorchaHash?: string;
  qrData: string;
  workflowSteps: WorkflowStep[];

  // Module 6: Statutory SLA & Anti-Harassment Escalation
  slaTargetDays?: number;       // default 7
  statutoryMaxDays?: number;   // default 28
  daysElapsed?: number;
  slaDaysRemaining?: number;
  slaStatus?: string;
  fastTrackEligible?: boolean;
  escalationStatus?: SlaStatus;
  ltNotice?: DigitalLtNotice;
  dakhilaReceiptNo?: string;
  holdingNo?: string;
  parentBsKhatian?: string;
}

export interface VerificationCheck {
  id: string;
  labelEn: string;
  labelBn: string;
  passed: boolean;
  messageEn: string;
  messageBn: string;
}

export interface VerificationResult {
  passed: boolean;
  checks: VerificationCheck[];
  fraudTitleEn?: string;
  fraudTitleBn?: string;
  fraudReasonEn?: string;
  fraudReasonBn?: string;
}

export type SoilType = 'Alluvial' | 'Red Clay' | 'Sandy Loam' | 'Marshy' | 'Gravel Bed';
export type FloodRisk = 'Low' | 'Moderate' | 'High';
export type ZoningCategory = 'Residential' | 'Commercial' | 'Agricultural' | 'Eco-Tourism' | 'Industrial';

export interface UtilitiesInfo {
  electricity: boolean;
  water: boolean;
  gas: boolean;
  fiberInternet: boolean;
}

export interface NearbyFacilities {
  highwayDistKm: number;
  marketDistKm: number;
  schoolDistKm: number;
  hospitalDistKm: number;
  policeStationDistKm: number;
}

export interface LandParcel {
  id: string;
  titleEn: string;
  titleBn: string;
  district: string;
  division: string;
  upazila: string;
  mouza: string;
  lat: number;
  lng: number;
  areaKatha: number;
  areaDecimal: number;
  areaSqFt: number;
  priceBdt: number;
  pricePerKatha: number;
  roadWidthFt: number;
  soilType: SoilType;
  floodRisk: FloodRisk;
  elevationMeters: number;
  zoning: ZoningCategory;
  utilities: UtilitiesInfo;
  nearbyFacilities: NearbyFacilities;
  legalStatus: string;
  khatianType: string;
  csRsReference: string;
  demoLabel: string;
  descriptionEn: string;
  descriptionBn: string;
  imageUrl: string;
  tags: string[];
  missingAttributes: string[];
}

