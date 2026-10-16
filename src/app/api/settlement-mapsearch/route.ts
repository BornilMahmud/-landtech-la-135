import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import querystring from 'querystring';
import { FALLBACK_DIVISIONS, FALLBACK_SURVEYS } from '@/utils/settlementMapService';

const SETTLEMENT_BASE = 'https://settlement.gov.bd';

// Allow self-signed or institutional certs common in government portals
const agent = new https.Agent({
  rejectUnauthorized: false
});

// 5-minute in-memory cache
const apiCache = new Map<string, { data: any; expiry: number }>();

/**
 * Helper to post form-encoded payload to settlement.gov.bd
 */
async function postToSettlement(endpoint: string, params: Record<string, string>): Promise<any> {
  const cacheKey = `${endpoint}?${querystring.stringify(params)}`;
  const cached = apiCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const postData = querystring.stringify(params);

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(null);
    }, 10000); // 10s timeout

    const req = https.request(
      `${SETTLEMENT_BASE}${endpoint}`,
      {
        method: 'POST',
        agent,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Content-Length': Buffer.byteLength(postData),
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': `${SETTLEMENT_BASE}/map/mapsearch`
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          clearTimeout(timer);
          try {
            const parsed = JSON.parse(raw);
            apiCache.set(cacheKey, { data: parsed, expiry: Date.now() + 5 * 60 * 1000 });
            resolve(parsed);
          } catch (err) {
            resolve(null);
          }
        });
      }
    );

    req.on('error', () => {
      clearTimeout(timer);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'divisions';

    // 1. Division List: /Map/GetDivisionList
    if (action === 'divisions') {
      const data = await postToSettlement('/Map/GetDivisionList', {});
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data);
      }
      return NextResponse.json(FALLBACK_DIVISIONS);
    }

    // 2. District List: /Khatian/getdistrictlistdivisionwise
    if (action === 'districts') {
      const divid = searchParams.get('divid') || '010000000';
      const data = await postToSettlement('/Khatian/getdistrictlistdivisionwise', { divid });
      if (data) {
        return NextResponse.json(data);
      }
      return NextResponse.json([]);
    }

    // 3. Survey (Jorip) List: /Khatian/GetSurveyListDistrictWise
    if (action === 'surveys') {
      const districtId = searchParams.get('districtId') || '010500000';
      const comcod = searchParams.get('comcod') || '4105';
      const data = await postToSettlement('/Khatian/GetSurveyListDistrictWise', { districtId, comcod });
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data);
      }
      return NextResponse.json(FALLBACK_SURVEYS);
    }

    // 4. Thana / Upazila List: /Khatian/GetThanaListBySurveyMap
    if (action === 'thanas') {
      const comcod = searchParams.get('comcod') || '';
      const rsno1 = searchParams.get('rsno1') || '';
      const districtId = searchParams.get('districtId') || '';
      const data = await postToSettlement('/Khatian/GetThanaListBySurveyMap', { comcod, rsno1, districtId });
      return NextResponse.json(data || []);
    }

    // 5. Mouza List: /Khatian/GetMouzaListBySurveyMap
    if (action === 'mouzas') {
      const comcod = searchParams.get('comcod') || '';
      const rsnum = searchParams.get('rsnum') || '';
      const unitcod = searchParams.get('unitcod') || '';
      const data = await postToSettlement('/Khatian/GetMouzaListBySurveyMap', { comcod, rsnum, unitcod });
      return NextResponse.json(data || []);
    }

    // 6. Sheet List: /Khatian/GetMouzaListBySurveyMapForshet
    if (action === 'sheets') {
      const comcod = searchParams.get('comcod') || '';
      const rsnum = searchParams.get('rsnum') || '';
      const unitcod = searchParams.get('unitcod') || '';
      const data = await postToSettlement('/Khatian/GetMouzaListBySurveyMapForshet', { comcod, rsnum, unitcod });
      return NextResponse.json(data || [{ shetnum: '1', sheetdesc: 'শিট ০১' }]);
    }

    // 7. Administrative Boundary GeoJSON: /Map/GetallBoundaryJson
    if (action === 'boundary') {
      const unitcode = searchParams.get('unitcode') || '010000000';
      const data = await postToSettlement('/Map/GetallBoundaryJson', { unitcode });
      if (data && data.success) {
        return NextResponse.json(data);
      }
      return NextResponse.json({ success: false, message: 'Boundary unavailable' });
    }

    // 8. Sheet Vector / Parcel GeoJSON: /Khatian/GetSheetJsonBySurvey
    if (action === 'sheetjson') {
      const rsnum = searchParams.get('rsnum') || '';
      const comcod = searchParams.get('comcod') || '';
      const unitcod = searchParams.get('unitcod') || '';
      const sheetno = searchParams.get('sheetno') || '1';
      const data = await postToSettlement('/Khatian/GetSheetJsonBySurvey', { rsnum, comcod, unitcod, sheetno });
      return NextResponse.json(data || { success: false, message: 'Sheet GeoJSON not found' });
    }

    return NextResponse.json({ error: 'Invalid action requested' }, { status: 400 });
  } catch (error: any) {
    console.error('DLRS Settlement Gateway error:', error);
    return NextResponse.json({ error: error.message || 'DLRS Gateway Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'khatian', ...params } = body;

    // Search Khatian / Plot in Settlement
    if (action === 'khatian') {
      const data = await postToSettlement('/Khatian/GetKhatianDataList_MapSearch', {
        comcod: params.comcod || '',
        rsnum: params.rsnum || '',
        unitcod: params.unitcod || '',
        shetnum: params.shetnum || '1',
        dagnum: params.dagnum || ''
      });
      return NextResponse.json({ success: true, data: data || [] });
    }

    return NextResponse.json({ error: 'Unknown POST action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
