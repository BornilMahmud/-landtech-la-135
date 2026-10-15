export type Language = 'en' | 'bn';

export type RoleType = 
  | 'sub_registrar' 
  | 'ac_land' 
  | 'citizen' 
  | 'bank_judiciary' 
  | 'mouza_map' 
  | 'tamper_test';

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
  mouzaBn: string;
  upazila: string;
  district: string;
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
  deedNo: string;
  plotId: string;
  khatianNo: string;
  dagNo: string;
  mouza: string;
  sellerName: string;
  sellerNid: string;
  buyerName: string;
  buyerNid: string;
  buyerPhone: string;
  transferAreaDecimals: number;
  saleValueBDT: number;
  fees: FeeBreakdown;
  registrationDate: string;
  sha256Hash: string;
  status: 'REGISTERED' | 'MUTATION_PENDING' | 'MUTATED';
  subRegistryOffice: string;
  trackingId: string;
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
