/**
 * SetuLand (সেতু-ল্যান্ড) — DLRS Settlement MapSearch Gateway Service
 * Connects with Department of Land Records and Surveys (ভূমি রেকর্ড ও জরিপ অধিদপ্তর)
 * Portal: https://settlement.gov.bd/map/mapsearch
 */

export interface SettlementDivision {
  unitcod: string;
  unitnam: string;
  unitdesc1: string;
  comcod: string;
}

export interface SettlementDistrict {
  unitcod: string;
  unitnam?: string;
  unitdesc1: string;
  unitrefs?: string;
  comcod: string;
}

export interface SettlementSurvey {
  rsnum: string;
  rsnumb?: string;
  rsname: string;
  rsdesc: string;
  rsstatus?: string;
}

export interface SettlementThana {
  unitcod: string;
  unitnam?: string;
  upzcod: string;
  upazila: string;
  comcod: string;
}

export interface SettlementMouza {
  unitcod: string;
  unitnam: string;
  jlno?: string;
  comcod: string;
}

export interface SettlementSheet {
  shetnum: string;
  sheetdesc?: string;
}

export interface SettlementBoundaryResponse {
  success: boolean;
  geoJson?: string;
  unitcode?: string;
  message?: string;
}

export interface SettlementDagFeature {
  type: string;
  properties: {
    dag_no?: string;
    dagno?: string;
    dag?: string;
    khatian_no?: string;
    area_decimal?: number;
    land_class?: string;
    owner_name?: string;
    [key: string]: any;
  };
  geometry: any;
}

// Pre-configured fallback divisions for instant responsiveness
export const FALLBACK_DIVISIONS: SettlementDivision[] = [
  { unitcod: '010000000', unitnam: 'ঢাকা', unitdesc1: '০১ - ঢাকা', comcod: '4105' },
  { unitcod: '020000000', unitnam: 'খুলনা', unitdesc1: '০২ - খুলনা', comcod: '4147' },
  { unitcod: '030000000', unitnam: 'চট্টগ্রাম', unitdesc1: '০৩ - চট্টগ্রাম', comcod: '4115' },
  { unitcod: '040000000', unitnam: 'রাজশাহী', unitdesc1: '০৪ - রাজশাহী', comcod: '4181' },
  { unitcod: '050000000', unitnam: 'বরিশাল', unitdesc1: '০৫ - বরিশাল', comcod: '4106' },
  { unitcod: '060000000', unitnam: 'সিলেট', unitdesc1: '০৬ - সিলেট', comcod: '4191' },
  { unitcod: '070000000', unitnam: 'রংপুর', unitdesc1: '০৭ - রংপুর', comcod: '4185' },
  { unitcod: '080000000', unitnam: 'ময়মনসিংহ', unitdesc1: '০৮ - ময়মনসিংহ', comcod: '4161' }
];

export const FALLBACK_SURVEYS: SettlementSurvey[] = [
  { rsnum: '201901', rsname: 'বি ডি এস', rsdesc: 'ডিজিটাল জরিপ (Bangladesh Digital Survey - BDS)', rsstatus: 'চলমান' },
  { rsnum: '1004', rsname: 'বি এস / সিটি', rsdesc: 'বিএস জরিপ / সিটি জরিপ (BS / City Survey)', rsstatus: 'চূড়ান্ত' },
  { rsnum: '1003', rsname: 'আর এস', rsdesc: 'আরএস জরিপ (Revisional Survey - RS)', rsstatus: 'রেকর্ডকৃত' },
  { rsnum: '1002', rsname: 'এস এ', rsdesc: 'এসএ জরিপ (State Acquisition Survey - SA)', rsstatus: 'রেকর্ডকৃত' },
  { rsnum: '1001', rsname: 'সি এস', rsdesc: 'সিএস জরিপ (Cadastral Survey - CS)', rsstatus: 'ঐতিহাসিক মূল' }
];

export async function fetchSettlementDivisions(): Promise<SettlementDivision[]> {
  try {
    const res = await fetch('/api/settlement-mapsearch?action=divisions');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Using fallback divisions:', e);
  }
  return FALLBACK_DIVISIONS;
}

export async function fetchSettlementDistricts(divid: string): Promise<SettlementDistrict[]> {
  try {
    const res = await fetch(`/api/settlement-mapsearch?action=districts&divid=${encodeURIComponent(divid)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('District fetch failed:', e);
  }
  return [];
}

export async function fetchSettlementSurveys(districtId: string, comcod: string = ''): Promise<SettlementSurvey[]> {
  try {
    const res = await fetch(`/api/settlement-mapsearch?action=surveys&districtId=${encodeURIComponent(districtId)}&comcod=${encodeURIComponent(comcod)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Survey fetch failed:', e);
  }
  return FALLBACK_SURVEYS;
}

export async function fetchSettlementThanas(params: {
  comcod: string;
  rsno1: string;
  districtId: string;
}): Promise<SettlementThana[]> {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`/api/settlement-mapsearch?action=thanas&${q}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.warn('Thana fetch failed:', e);
  }
  return [];
}

export async function fetchSettlementMouzas(params: {
  comcod: string;
  rsnum: string;
  unitcod: string;
}): Promise<SettlementMouza[]> {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`/api/settlement-mapsearch?action=mouzas&${q}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.warn('Mouza fetch failed:', e);
  }
  return [];
}

export async function fetchSettlementSheets(params: {
  comcod: string;
  rsnum: string;
  unitcod: string;
}): Promise<SettlementSheet[]> {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`/api/settlement-mapsearch?action=sheets&${q}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.warn('Sheets fetch failed:', e);
  }
  return [{ shetnum: '1', sheetdesc: 'শিট ০১' }];
}

export async function fetchSettlementBoundary(unitcode: string): Promise<SettlementBoundaryResponse> {
  try {
    const res = await fetch(`/api/settlement-mapsearch?action=boundary&unitcode=${encodeURIComponent(unitcode)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Boundary fetch failed:', e);
  }
  return { success: false, message: 'Boundary could not be fetched' };
}

export async function fetchSettlementSheetJson(params: {
  rsnum: string;
  comcod: string;
  unitcod: string;
  sheetno: string;
}): Promise<any> {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`/api/settlement-mapsearch?action=sheetjson&${q}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Sheet GeoJSON fetch failed:', e);
  }
  return null;
}
