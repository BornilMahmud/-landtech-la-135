import { KhatianRecord, DeedRecord, MutationCase } from '@/types';

export const INITIAL_KHATIANS: KhatianRecord[] = [
  {
    id: 'plot-1',
    khatianNo: 'BS-1001',
    dagNo: '405',
    mouza: 'Savar',
    mouzaBn: 'সাভার',
    upazila: 'Savar',
    district: 'Dhaka',
    ownerName: 'Karim Mia',
    ownerNameBn: 'করিম মিয়া',
    ownerNid: 'DUMMY-NID-2026-1001',
    ownerPhone: '01700-000001',
    totalAreaDecimals: 12.0,
    lockedAreaDecimals: 0.0,
    landClass: 'Nal (Agricultural) / নাল',
    isMortgaged: false,
    hasCourtCase: false,
    isAcquired: false,
    chainOfTitle: [
      { surveyType: 'CS', khatianNo: 'CS-88', ownerName: 'Late Kashem Mia (Grandfather)', ownerNid: 'DUMMY-NID-HIST-01', year: 1940, areaDecimals: 12.0, verified: true },
      { surveyType: 'SA', khatianNo: 'SA-142', ownerName: 'Late Rahim Mia (Father)', ownerNid: 'DUMMY-NID-HIST-02', year: 1962, areaDecimals: 12.0, verified: true },
      { surveyType: 'RS', khatianNo: 'RS-310', ownerName: 'Karim Mia (Inherited)', ownerNid: 'DUMMY-NID-2026-1001', year: 1988, areaDecimals: 12.0, verified: true },
      { surveyType: 'BS', khatianNo: 'BS-1001', ownerName: 'Karim Mia (Present)', ownerNid: 'DUMMY-NID-2026-1001', year: 2012, areaDecimals: 12.0, verified: true },
    ],
    sha256Hash: 'a7f9c2d1e4b865301824ab7cd9ef0123456789abcdef0123456789abcdef0123',
    lastUpdated: '2026-03-15T10:00:00Z',
    mapPolygon: {
      points: '120,80 260,70 290,190 140,210',
      center: [200, 140],
      label: 'Dag 405 (12.00 Dec)'
    }
  },
  {
    id: 'plot-2',
    khatianNo: 'BS-1002',
    dagNo: '512',
    mouza: 'Ashulia',
    mouzaBn: 'আশুলিয়া',
    upazila: 'Savar',
    district: 'Dhaka',
    ownerName: 'Abdul Jabbar',
    ownerNameBn: 'আব্দুল জব্বার',
    ownerNid: 'DUMMY-NID-2026-1002',
    ownerPhone: '01700-000002',
    totalAreaDecimals: 10.0,
    lockedAreaDecimals: 7.0, // 7 decimals locked in pending mutation MUT-2026-5001!
    landClass: 'Bari (Homestead) / বাড়ি',
    isMortgaged: false,
    hasCourtCase: false,
    isAcquired: false,
    chainOfTitle: [
      { surveyType: 'CS', khatianNo: 'CS-104', ownerName: 'Mofizuddin Mondol', ownerNid: 'DUMMY-NID-HIST-03', year: 1941, areaDecimals: 10.0, verified: true },
      { surveyType: 'SA', khatianNo: 'SA-219', ownerName: 'Sirajuddin Mondol', ownerNid: 'DUMMY-NID-HIST-04', year: 1963, areaDecimals: 10.0, verified: true },
      { surveyType: 'RS', khatianNo: 'RS-440', ownerName: 'Abdul Jabbar', ownerNid: 'DUMMY-NID-2026-1002', year: 1990, areaDecimals: 10.0, verified: true },
      { surveyType: 'BS', khatianNo: 'BS-1002', ownerName: 'Abdul Jabbar', ownerNid: 'DUMMY-NID-2026-1002', year: 2014, areaDecimals: 10.0, verified: true },
    ],
    sha256Hash: 'b8e1f5439a0c21746b89de3409fc5421ab7890efcd1234567890abcdef123456',
    lastUpdated: '2026-03-20T14:30:00Z',
    mapPolygon: {
      points: '310,75 480,90 450,220 300,200',
      center: [385, 145],
      label: 'Dag 512 (10.00 Dec [7 Locked])'
    }
  },
  {
    id: 'plot-3',
    khatianNo: 'BS-1003',
    dagNo: '209',
    mouza: 'Dhamrai',
    mouzaBn: 'ধামরাই',
    upazila: 'Dhamrai',
    district: 'Dhaka',
    ownerName: 'Rahima Begum',
    ownerNameBn: 'রহিমা বেগম',
    ownerNid: 'DUMMY-NID-2026-1003',
    ownerPhone: '01700-000003',
    totalAreaDecimals: 8.0,
    lockedAreaDecimals: 0.0,
    landClass: 'Commercial / বাণিজ্যিক',
    isMortgaged: true, // ACTIVE MORTGAGE LOCK!
    mortgageDetails: {
      bankName: 'Sonali Bank PLC (Dummy Corp Branch)',
      branch: 'Savar SME Branch',
      loanAccount: 'DUMMY-LN-7729',
      amountBDT: 4500000,
      mortgageDate: '2025-11-12'
    },
    hasCourtCase: false,
    isAcquired: false,
    chainOfTitle: [
      { surveyType: 'CS', khatianNo: 'CS-77', ownerName: 'Afsar Ali', ownerNid: 'DUMMY-NID-HIST-05', year: 1939, areaDecimals: 8.0, verified: true },
      { surveyType: 'SA', khatianNo: 'SA-115', ownerName: 'Joynal Abedin', ownerNid: 'DUMMY-NID-HIST-06', year: 1961, areaDecimals: 8.0, verified: true },
      { surveyType: 'RS', khatianNo: 'RS-199', ownerName: 'Rahima Begum', ownerNid: 'DUMMY-NID-2026-1003', year: 1989, areaDecimals: 8.0, verified: true },
      { surveyType: 'BS', khatianNo: 'BS-1003', ownerName: 'Rahima Begum', ownerNid: 'DUMMY-NID-2026-1003', year: 2013, areaDecimals: 8.0, verified: true },
    ],
    sha256Hash: 'c4d5e6f7a8b90123456789abcdef0123456789abcdef0123456789abcdef0123',
    lastUpdated: '2026-03-25T09:15:00Z',
    mapPolygon: {
      points: '130,240 280,230 270,360 110,350',
      center: [195, 290],
      label: 'Dag 209 (8.00 Dec [MORTGAGED])'
    }
  },
  {
    id: 'plot-4',
    khatianNo: 'BS-1004',
    dagNo: '881',
    mouza: 'Gazipur',
    mouzaBn: 'গাজীপুর',
    upazila: 'Gazipur Sadar',
    district: 'Gazipur',
    ownerName: 'Nurul Islam',
    ownerNameBn: 'নুরুল ইসলাম',
    ownerNid: 'DUMMY-NID-2026-1004',
    ownerPhone: '01700-000004',
    totalAreaDecimals: 15.0,
    lockedAreaDecimals: 0.0,
    landClass: 'Industrial / শিল্প',
    isMortgaged: false,
    hasCourtCase: true, // ACTIVE COURT INJUNCTION!
    courtCaseDetails: {
      caseNo: 'DUMMY-CIV-404/2025',
      courtName: 'Joint District Judge Court 1st Court, Gazipur',
      filedDate: '2025-08-14',
      reason: 'Title Suit & Temporary Injunction (Order 39 Rule 1 CPC) regarding co-sharer claim'
    },
    isAcquired: false,
    chainOfTitle: [
      { surveyType: 'CS', khatianNo: 'CS-302', ownerName: 'Taimur Ali', ownerNid: 'DUMMY-NID-HIST-07', year: 1940, areaDecimals: 15.0, verified: true },
      { surveyType: 'SA', khatianNo: 'SA-412', ownerName: 'Abul Hossain', ownerNid: 'DUMMY-NID-HIST-08', year: 1964, areaDecimals: 15.0, verified: true },
      { surveyType: 'RS', khatianNo: 'RS-590', ownerName: 'Nurul Islam', ownerNid: 'DUMMY-NID-2026-1004', year: 1991, areaDecimals: 15.0, verified: true },
      { surveyType: 'BS', khatianNo: 'BS-1004', ownerName: 'Nurul Islam', ownerNid: 'DUMMY-NID-2026-1004', year: 2015, areaDecimals: 15.0, verified: true },
    ],
    sha256Hash: 'd7e8f901a2b3c4d5e6f7a8b90123456789abcdef0123456789abcdef01234567',
    lastUpdated: '2026-03-28T16:45:00Z',
    mapPolygon: {
      points: '300,230 470,240 490,370 310,370',
      center: [395, 305],
      label: 'Dag 881 (15.00 Dec [COURT INJUNCTION])'
    }
  }
];

export const INITIAL_DEEDS: DeedRecord[] = [
  {
    deedNo: 'DEED-2026-0311',
    plotId: 'plot-2',
    khatianNo: 'BS-1002',
    dagNo: '512',
    mouza: 'Ashulia',
    sellerName: 'Abdul Jabbar',
    sellerNid: 'DUMMY-NID-2026-1002',
    buyerName: 'Selim Reza',
    buyerNid: 'DUMMY-NID-2026-9011',
    buyerPhone: '01700-000009',
    transferAreaDecimals: 7.0,
    saleValueBDT: 3500000,
    fees: {
      saleValueBDT: 3500000,
      stampDutyBDT: 52500,     // 1.5%
      registrationFeeBDT: 35000, // 1%
      localGovtTaxBDT: 105000,  // 3%
      gainTaxBDT: 70000,        // 2%
      mutationFeeBDT: 1170,     // 1,170 BDT
      totalFeeBDT: 263670
    },
    registrationDate: '2026-03-20T14:30:00Z',
    sha256Hash: 'fa2093847bcd4892305718293840294820394820938402938402938402938402',
    status: 'MUTATION_PENDING',
    subRegistryOffice: 'Savar Sub-Registry Office',
    trackingId: 'MUT-2026-5001'
  }
];

export const INITIAL_MUTATIONS: MutationCase[] = [
  {
    id: 'MUT-2026-5001',
    deedNo: 'DEED-2026-0311',
    parentKhatianNo: 'BS-1002',
    dagNo: '512',
    mouza: 'Ashulia',
    sellerName: 'Abdul Jabbar',
    sellerNid: 'DUMMY-NID-2026-1002',
    buyerName: 'Selim Reza',
    buyerNid: 'DUMMY-NID-2026-9011',
    buyerPhone: '01700-000009',
    transferAreaDecimals: 7.0,
    status: 'AUTO_INITIATED',
    autoInitiatedAt: '2026-03-20T14:30:05Z',
    qrData: 'SETULAND-VERIFIED:MUT-2026-5001:DEED-2026-0311:AREA-7.00',
    workflowSteps: [
      { step: 1, nameEn: 'Deed Verified & Registered', nameBn: 'দলিল যাচাই ও রেজিস্ট্রি সম্পন্ন', completed: true, timestamp: '2026-03-20 14:30' },
      { step: 2, nameEn: 'Land Area Locked (7.00 Decimals)', nameBn: 'জমি লক করা হয়েছে (৭.০০ শতাংশ)', completed: true, timestamp: '2026-03-20 14:30' },
      { step: 3, nameEn: 'Auto-Forwarded to AC Land Queue', nameBn: 'স্বয়ংক্রিয়ভাবে এসি ল্যান্ডে প্রেরিত', completed: true, timestamp: '2026-03-20 14:31' },
      { step: 4, nameEn: 'Union Land (Tahsil) Verification', nameBn: 'তহশিলদার/ইউনিয়ন ভূমি সহকারী প্রতিবেদন', completed: false },
      { step: 5, nameEn: 'AC Land Final Approval & Khatian Split', nameBn: 'এসি ল্যান্ড অনুমোদন ও খতিয়ান কর্তন', completed: false }
    ]
  }
];
