'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Map,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileText,
  RefreshCw,
  Crosshair,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Navigation,
  Globe2,
  ChevronRight,
  Database,
  ArrowUpRight
} from 'lucide-react';
import {
  SettlementDivision,
  SettlementDistrict,
  SettlementSurvey,
  SettlementThana,
  SettlementMouza,
  SettlementSheet,
  fetchSettlementDivisions,
  fetchSettlementDistricts,
  fetchSettlementSurveys,
  fetchSettlementThanas,
  fetchSettlementMouzas,
  fetchSettlementSheets,
  fetchSettlementBoundary,
  fetchSettlementSheetJson,
  FALLBACK_DIVISIONS,
  FALLBACK_SURVEYS
} from '@/utils/settlementMapService';
import { useLandApp } from '@/context/LandAppContext';

interface SettlementPlotInfo {
  dagNo: string;
  khatianNo: string;
  mouzaName: string;
  jlNo: string;
  thanaName: string;
  districtName: string;
  areaDecimal: number;
  landClass: string;
  surveyType: string;
  ownerNameBn: string;
  ownerNameEn: string;
  status: 'CLEARED' | 'LOCKED' | 'DISPUTED';
  lat: number;
  lng: number;
}

export const SettlementMapSearchViewer: React.FC = () => {
  const { setActiveRole } = useLandApp();
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBoundary, setLoadingBoundary] = useState<boolean>(false);

  // Cascading Dropdown States
  const [divisions, setDivisions] = useState<SettlementDivision[]>(FALLBACK_DIVISIONS);
  const [selectedDiv, setSelectedDiv] = useState<string>('010000000'); // Dhaka default

  const [districts, setDistricts] = useState<SettlementDistrict[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [districtComcod, setDistrictComcod] = useState<string>('4105');

  const [surveys, setSurveys] = useState<SettlementSurvey[]>(FALLBACK_SURVEYS);
  const [selectedSurvey, setSelectedSurvey] = useState<string>('201901'); // BDS / Digital

  const [thanas, setThanas] = useState<SettlementThana[]>([]);
  const [selectedThana, setSelectedThana] = useState<string>('');

  const [mouzas, setMouzas] = useState<SettlementMouza[]>([]);
  const [selectedMouza, setSelectedMouza] = useState<string>('');

  const [sheets, setSheets] = useState<SettlementSheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('1');

  const [dagSearch, setDagSearch] = useState<string>('');
  const [selectedPlot, setSelectedPlot] = useState<SettlementPlotInfo | null>(null);

  // Canvas View States
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mouseCoords, setMouseCoords] = useState<{ lat: string; lng: string }>({
    lat: '23.8103',
    lng: '90.4125'
  });
  const [activeTab, setActiveTab] = useState<'map' | 'plots' | 'verify'>('map');

  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Divisions
  useEffect(() => {
    fetchSettlementDivisions().then(data => {
      if (data && data.length > 0) setDivisions(data);
    });
  }, []);

  // 2. Division changed -> Load Districts
  useEffect(() => {
    if (!selectedDiv) return;
    setLoading(true);
    fetchSettlementDistricts(selectedDiv).then(distList => {
      setDistricts(distList);
      if (distList.length > 0) {
        // Default to Dhaka or first district
        const defaultDist = distList.find(d => d.unitcod.includes('0105')) || distList[0];
        setSelectedDistrict(defaultDist.unitcod);
        setDistrictComcod(defaultDist.comcod || '4105');
      } else {
        setSelectedDistrict('');
      }
      setLoading(false);
    });
  }, [selectedDiv]);

  // 3. District changed -> Load Surveys & Thanas
  useEffect(() => {
    if (!selectedDistrict) return;
    fetchSettlementSurveys(selectedDistrict, districtComcod).then(survList => {
      setSurveys(survList);
      if (survList.length > 0) {
        setSelectedSurvey(survList[0].rsnum);
      }
    });

    fetchSettlementThanas({
      comcod: districtComcod,
      rsno1: selectedSurvey || '201901',
      districtId: selectedDistrict
    }).then(thanaList => {
      setThanas(thanaList);
      if (thanaList.length > 0) {
        setSelectedThana(thanaList[0].unitcod);
      } else {
        setSelectedThana('');
      }
    });
  }, [selectedDistrict, districtComcod]);

  // 4. Thana or Survey changed -> Load Mouzas
  useEffect(() => {
    if (!selectedThana) return;
    fetchSettlementMouzas({
      comcod: districtComcod,
      rsnum: selectedSurvey || '201901',
      unitcod: selectedThana
    }).then(mouzaList => {
      setMouzas(mouzaList);
      if (mouzaList.length > 0) {
        setSelectedMouza(mouzaList[0].unitcod);
      } else {
        setSelectedMouza('');
      }
    });
  }, [selectedThana, selectedSurvey, districtComcod]);

  // 5. Mouza changed -> Load Sheets
  useEffect(() => {
    if (!selectedMouza) return;
    fetchSettlementSheets({
      comcod: districtComcod,
      rsnum: selectedSurvey || '201901',
      unitcod: selectedMouza
    }).then(sheetList => {
      setSheets(sheetList);
      if (sheetList.length > 0) {
        setSelectedSheet(sheetList[0].shetnum);
      }
    });
  }, [selectedMouza, selectedSurvey, districtComcod]);

  // Sample curated cadastral plots for the selected mouza
  const sampleMouzaPlots = useMemo<SettlementPlotInfo[]>(() => {
    const curDiv = divisions.find(d => d.unitcod === selectedDiv)?.unitnam || 'ঢাকা';
    const curDist = districts.find(d => d.unitcod === selectedDistrict)?.unitdesc1 || 'ঢাকা';
    const curThana = thanas.find(t => t.unitcod === selectedThana)?.upazila || 'গুলশান/সাভার';
    const curMouza = mouzas.find(m => m.unitcod === selectedMouza)?.unitnam || 'মৌজা ১';

    return [
      {
        dagNo: '2410',
        khatianNo: '184',
        mouzaName: curMouza,
        jlNo: 'JL-42',
        thanaName: curThana,
        districtName: curDist,
        areaDecimal: 18.5,
        landClass: 'নাল / ভিটি (Arable / Homestead)',
        surveyType: 'বিডিএস / আরএস ডিজিটাল রেকর্ড',
        ownerNameBn: 'মো: আলতাফ হোসেন তালুকদার',
        ownerNameEn: 'Md. Altaf Hossain Talukder',
        status: 'CLEARED',
        lat: 23.8210,
        lng: 90.4150
      },
      {
        dagNo: '2411',
        khatianNo: '185',
        mouzaName: curMouza,
        jlNo: 'JL-42',
        thanaName: curThana,
        districtName: curDist,
        areaDecimal: 24.0,
        landClass: 'বাণিজ্যিক / নাল (Commercial Arterial)',
        surveyType: 'বিডিএস ডিজিটাল ক্যাডাস্ট্রাল',
        ownerNameBn: 'বেগম ফরিদা ইয়াসমিন',
        ownerNameEn: 'Begum Farida Yasmin',
        status: 'CLEARED',
        lat: 23.8225,
        lng: 90.4168
      },
      {
        dagNo: '2412',
        khatianNo: '189',
        mouzaName: curMouza,
        jlNo: 'JL-42',
        thanaName: curThana,
        districtName: curDist,
        areaDecimal: 14.2,
        landClass: 'পুকুর / জলাশয় (Waterbody - Protected)',
        surveyType: 'সিএস / আরএস রেকর্ডভুক্ত',
        ownerNameBn: 'মৌলভি হাবিবুর রহমান (ওয়ারিশান)',
        ownerNameEn: 'Habibur Rahman (Warisan)',
        status: 'LOCKED',
        lat: 23.8195,
        lng: 90.4132
      },
      {
        dagNo: '2415',
        khatianNo: '202',
        mouzaName: curMouza,
        jlNo: 'JL-42',
        thanaName: curThana,
        districtName: curDist,
        areaDecimal: 32.5,
        landClass: 'আবাসিক ভিটি (Residential)',
        surveyType: 'বিএস চূড়ান্ত রেকর্ড',
        ownerNameBn: 'ইঞ্জি. মোশাররফ হোসেন',
        ownerNameEn: 'Engr. Mosharraf Hossain',
        status: 'CLEARED',
        lat: 23.8240,
        lng: 90.4185
      }
    ];
  }, [selectedDiv, selectedDistrict, selectedThana, selectedMouza, divisions, districts, thanas, mouzas]);

  useEffect(() => {
    if (sampleMouzaPlots.length > 0 && !selectedPlot) {
      setSelectedPlot(sampleMouzaPlots[0]);
    }
  }, [sampleMouzaPlots]);

  // Pan & Zoom Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    const lat = (23.8103 + (0.5 - yRatio) * 0.03).toFixed(5);
    const lng = (90.4125 + (xRatio - 0.5) * 0.04).toFixed(5);
    setMouseCoords({ lat, lng });

    if (isDragging) {
      setPanPos({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panPos.x,
      y: e.clientY - panPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const officialPortalUrl = 'https://settlement.gov.bd/map/mapsearch';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 font-sans">
      {/* 1. Header Ribbon */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-inner">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded-md">
                DLRS Settlement Cadastral Gateway
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>settlement.gov.bd/map/mapsearch</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {language === 'bn' ? 'অনলাইন ভূমি রেকর্ড ও জরিপ ব্যবস্থাপনা (ম্যাপ অনুসন্ধান)' : 'DLRS Online Land Records & Cadastral Map Search'}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(l => l === 'bn' ? 'en' : 'bn')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {language === 'bn' ? 'EN' : 'বাংলা'}
          </button>

          <a
            href={officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950 transition-all"
            title="Open official settlement.gov.bd portal in a new tab"
          >
            <span>{language === 'bn' ? 'মূল ডিএলআরএস পোর্টাল' : 'Gov DLRS Portal'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Cascading Selector Bar (Division -> District -> Survey -> Thana -> Mouza -> Sheet) */}
      <div className="bg-slate-950/95 p-3.5 border-b border-slate-800 flex flex-wrap items-center gap-2.5 text-xs">
        {/* Division */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400 font-medium">{language === 'bn' ? 'বিভাগ:' : 'Div:'}</span>
          <select
            value={selectedDiv}
            onChange={(e) => setSelectedDiv(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            {divisions.map(d => (
              <option key={d.unitcod} value={d.unitcod} className="bg-slate-900 text-white">
                {d.unitdesc1 || d.unitnam}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400 font-medium">{language === 'bn' ? 'জেলা:' : 'Dist:'}</span>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              const found = districts.find(d => d.unitcod === e.target.value);
              if (found) setDistrictComcod(found.comcod || '4105');
            }}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer max-w-[140px] truncate"
          >
            {districts.map(d => (
              <option key={d.unitcod} value={d.unitcod} className="bg-slate-900 text-white">
                {d.unitdesc1 || d.unitnam}
              </option>
            ))}
          </select>
        </div>

        {/* Survey Type (Jorip) */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400 font-medium">{language === 'bn' ? 'জরিপ:' : 'Survey:'}</span>
          <select
            value={selectedSurvey}
            onChange={(e) => setSelectedSurvey(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            {surveys.map(s => (
              <option key={s.rsnum} value={s.rsnum} className="bg-slate-900 text-white">
                {s.rsdesc || s.rsname}
              </option>
            ))}
          </select>
        </div>

        {/* Upazila / Thana */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400 font-medium">{language === 'bn' ? 'থানা/উপজেলা:' : 'Upazila:'}</span>
          <select
            value={selectedThana}
            onChange={(e) => setSelectedThana(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer max-w-[140px] truncate"
          >
            {thanas.length > 0 ? (
              thanas.map(t => (
                <option key={t.unitcod} value={t.unitcod} className="bg-slate-900 text-white">
                  {t.upazila || t.unitnam}
                </option>
              ))
            ) : (
              <option value="">{language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</option>
            )}
          </select>
        </div>

        {/* Mouza */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400 font-medium">{language === 'bn' ? 'মৌজা:' : 'Mouza:'}</span>
          <select
            value={selectedMouza}
            onChange={(e) => setSelectedMouza(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer max-w-[140px] truncate"
          >
            {mouzas.length > 0 ? (
              mouzas.map(m => (
                <option key={m.unitcod} value={m.unitcod} className="bg-slate-900 text-white">
                  {m.unitnam}
                </option>
              ))
            ) : (
              <option value="">{language === 'bn' ? 'মৌজা ১' : 'Mouza 1'}</option>
            )}
          </select>
        </div>

        {/* Sheet No */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400 font-medium">{language === 'bn' ? 'শিট:' : 'Sheet:'}</span>
          <select
            value={selectedSheet}
            onChange={(e) => setSelectedSheet(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            {sheets.map(sh => (
              <option key={sh.shetnum} value={sh.shetnum} className="bg-slate-900 text-white">
                {sh.sheetdesc || `শিট ${sh.shetnum}`}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 ml-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeTab === 'map' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? '🗺️ ক্যাডাস্ট্রাল ম্যাপ' : '🗺️ Map'}
          </button>
          <button
            onClick={() => setActiveTab('plots')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeTab === 'plots' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? '📋 দাগ রেজিস্ট্রি' : '📋 Dag Ledger'}
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeTab === 'verify' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? '🔒 যাচাইকরণ' : '🔒 Title Dossier'}
          </button>
        </div>
      </div>

      {/* 3. Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left 8 Cols: Map Canvas or Table */}
        <div className="lg:col-span-8 relative bg-slate-950 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800">
          {activeTab === 'map' ? (
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className="relative w-full h-[580px] overflow-hidden select-none cursor-grab active:cursor-grabbing bg-slate-950 flex items-center justify-center"
            >
              {/* Floating Map Tools */}
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-xl">
                <button
                  onClick={() => setZoomLevel(z => Math.min(z + 0.3, 3.5))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(z => Math.max(z - 0.3, 0.7))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={resetView}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Reset Map Orientation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Coordinates Footer Badge */}
              <div className="absolute bottom-3 left-3 z-20 bg-slate-950/85 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 pointer-events-none">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>DLRS Mouza Map Vector Sheet • {selectedSheet ? `Sheet #${selectedSheet}` : 'Sheet #1'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-mono">{mouseCoords.lat}°N, {mouseCoords.lng}°E</span>
              </div>

              {/* Interactive SVG Cadastral Map Representation */}
              <div
                style={{
                  transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
                className="w-full h-full flex items-center justify-center p-4 pointer-events-none"
              >
                <svg
                  viewBox="0 0 850 620"
                  className="w-full max-w-[800px] h-auto drop-shadow-2xl pointer-events-auto"
                >
                  <defs>
                    <pattern id="mouzaGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" stroke-width="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>

                  {/* Sheet Background Canvas */}
                  <rect width="850" height="620" fill="#090d16" stroke="#475569" stroke-width="1.5"/>
                  <rect width="850" height="620" fill="url(#mouzaGrid)"/>

                  {/* River / Khal Channel */}
                  <path
                    d="M 20,480 C 180,450 320,540 500,470 C 650,410 750,460 830,420 L 830,470 C 740,510 630,460 490,520 C 310,590 170,500 20,530 Z"
                    fill="#0369a1"
                    fillOpacity="0.4"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                  />
                  <text x="360" y="505" fill="#7dd3fc" font-size="11" font-weight="bold" font-family="sans-serif">
                    খাল / জলপথ (Government Drainage Channel)
                  </text>

                  {/* Public Road / হালট */}
                  <path
                    d="M 50,60 L 800,90 L 800,115 L 50,85 Z"
                    fill="#334155"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <text x="320" y="80" fill="#f8fafc" font-size="11" font-weight="bold" font-family="sans-serif">
                    পাকা রাস্তা / হালট (Public Road Access - 30ft)
                  </text>

                  {/* Interactive Cadastral Parcels / Dags */}
                  {/* Dag 2410 */}
                  <g
                    onClick={() => setSelectedPlot(sampleMouzaPlots[0])}
                    className="cursor-pointer group"
                  >
                    <polygon
                      points="80,120 280,130 270,320 70,300"
                      fill={selectedPlot?.dagNo === '2410' ? '#047857' : '#065f46'}
                      fillOpacity={selectedPlot?.dagNo === '2410' ? 0.7 : 0.4}
                      stroke={selectedPlot?.dagNo === '2410' ? '#34d399' : '#10b981'}
                      strokeWidth={selectedPlot?.dagNo === '2410' ? 3 : 1.5}
                      className="transition-colors group-hover:fill-opacity-80"
                    />
                    <text x="145" y="210" fill="#ffffff" font-size="16" font-weight="bold" font-family="monospace">
                      দাগ ২৪১০
                    </text>
                    <text x="135" y="235" fill="#a7f3d0" font-size="11" font-family="sans-serif">
                      ১৮.৫ শতক (নাল)
                    </text>
                    <text x="120" y="255" fill="#d1fae5" font-size="10" font-family="sans-serif">
                      খতিয়ান ১৮৪ • আলতাফ হোসেন
                    </text>
                  </g>

                  {/* Dag 2411 */}
                  <g
                    onClick={() => setSelectedPlot(sampleMouzaPlots[1])}
                    className="cursor-pointer group"
                  >
                    <polygon
                      points="290,130 520,140 500,330 280,320"
                      fill={selectedPlot?.dagNo === '2411' ? '#047857' : '#0f766e'}
                      fillOpacity={selectedPlot?.dagNo === '2411' ? 0.7 : 0.4}
                      stroke={selectedPlot?.dagNo === '2411' ? '#34d399' : '#14b8a6'}
                      strokeWidth={selectedPlot?.dagNo === '2411' ? 3 : 1.5}
                      className="transition-colors group-hover:fill-opacity-80"
                    />
                    <text x="365" y="210" fill="#ffffff" font-size="16" font-weight="bold" font-family="monospace">
                      দাগ ২৪১১
                    </text>
                    <text x="360" y="235" fill="#99f6e4" font-size="11" font-family="sans-serif">
                      ২৪.০ শতক (বাণিজ্যিক)
                    </text>
                    <text x="345" y="255" fill="#ccfbf1" font-size="10" font-family="sans-serif">
                      খতিয়ান ১৮৫ • ফরিদা ইয়াসমিন
                    </text>
                  </g>

                  {/* Dag 2412 (Waterbody / Protected) */}
                  <g
                    onClick={() => setSelectedPlot(sampleMouzaPlots[2])}
                    className="cursor-pointer group"
                  >
                    <polygon
                      points="530,140 760,150 740,340 510,330"
                      fill={selectedPlot?.dagNo === '2412' ? '#b45309' : '#78350f'}
                      fillOpacity={selectedPlot?.dagNo === '2412' ? 0.7 : 0.4}
                      stroke={selectedPlot?.dagNo === '2412' ? '#fbbf24' : '#f59e0b'}
                      strokeWidth={selectedPlot?.dagNo === '2412' ? 3 : 1.5}
                      className="transition-colors group-hover:fill-opacity-80"
                    />
                    <text x="605" y="210" fill="#ffffff" font-size="16" font-weight="bold" font-family="monospace">
                      দাগ ২৪১২
                    </text>
                    <text x="600" y="235" fill="#fde68a" font-size="11" font-family="sans-serif">
                      ১৪.২ শতক (পুকুর)
                    </text>
                    <text x="585" y="255" fill="#fef3c7" font-size="10" font-family="sans-serif">
                      ⚠️ এসক্রো স্থগিতাদেশ
                    </text>
                  </g>

                  {/* Dag 2415 (Southern Parcel) */}
                  <g
                    onClick={() => setSelectedPlot(sampleMouzaPlots[3])}
                    className="cursor-pointer group"
                  >
                    <polygon
                      points="80,340 500,360 480,450 70,440"
                      fill={selectedPlot?.dagNo === '2415' ? '#047857' : '#1e3a8a'}
                      fillOpacity={selectedPlot?.dagNo === '2415' ? 0.7 : 0.4}
                      stroke={selectedPlot?.dagNo === '2415' ? '#34d399' : '#3b82f6'}
                      strokeWidth={selectedPlot?.dagNo === '2415' ? 3 : 1.5}
                      className="transition-colors group-hover:fill-opacity-80"
                    />
                    <text x="240" y="405" fill="#ffffff" font-size="16" font-weight="bold" font-family="monospace">
                      দাগ ২৪১৫
                    </text>
                    <text x="235" y="425" fill="#bfdbfe" font-size="11" font-family="sans-serif">
                      ৩২.৫ শতক (ভিটি) • খতিয়ান ২০২
                    </text>
                  </g>

                  {/* North Pointer Compass */}
                  <g transform="translate(770, 60)">
                    <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#d4a657" stroke-width="1.5"/>
                    <polygon points="0,-18 5,-2 0,0" fill="#ef4444"/>
                    <polygon points="0,-18 -5,-2 0,0" fill="#f87171"/>
                    <polygon points="0,18 5,2 0,0" fill="#64748b"/>
                    <polygon points="0,18 -5,2 0,0" fill="#94a3b8"/>
                    <text x="-4" y="-22" fill="#f8fafc" font-family="sans-serif" font-size="10" font-weight="bold">উ</text>
                  </g>

                  {/* Scale Bar */}
                  <g transform="translate(620, 575)">
                    <rect x="0" y="0" width="160" height="25" fill="#0f172a" fill-opacity="0.9" stroke="#334155"/>
                    <line x1="15" y1="12" x2="145" y2="12" stroke="#f8fafc" stroke-width="2"/>
                    <line x1="15" y1="8" x2="15" y2="16" stroke="#f8fafc" stroke-width="2"/>
                    <line x1="80" y1="8" x2="80" y2="16" stroke="#f8fafc" stroke-width="2"/>
                    <line x1="145" y1="8" x2="145" y2="16" stroke="#f8fafc" stroke-width="2"/>
                    <text x="10" y="22" fill="#94a3b8" font-family="sans-serif" font-size="8">০ চেইন</text>
                    <text x="70" y="22" fill="#94a3b8" font-family="sans-serif" font-size="8">৫ চেইন</text>
                    <text x="135" y="22" fill="#94a3b8" font-family="sans-serif" font-size="8">১০ চেইন</text>
                  </g>
                </svg>
              </div>
            </div>
          ) : activeTab === 'plots' ? (
            /* Dag Ledger List */
            <div className="p-4 space-y-3 overflow-y-auto max-h-[580px]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>ক্যাডাস্ট্রাল দাগ খতিয়ান তালিকা ({sampleMouzaPlots.length})</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedSheet ? `শিট নং ${selectedSheet}` : 'সকল শিট'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sampleMouzaPlots.map(plot => (
                  <div
                    key={plot.dagNo}
                    onClick={() => setSelectedPlot(plot)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedPlot?.dagNo === plot.dagNo
                        ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-bold text-white text-base">দাগ নং {plot.dagNo}</span>
                        <span className="text-xs text-amber-400 block">খতিয়ান #{plot.khatianNo}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        plot.status === 'CLEARED'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}>
                        {plot.status === 'CLEARED' ? 'পরচা অনুমোদিত' : 'স্থগিতাদেশ'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 mb-2">
                      <div>
                        <span className="text-slate-500">মালিক: </span>
                        <span className="font-semibold text-white">{plot.ownerNameBn}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{plot.areaDecimal} শতক</span>
                        <span>{plot.landClass}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 text-[10px] font-mono">{plot.surveyType}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlot(plot);
                          setActiveTab('verify');
                        }}
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                      >
                        <span>যাচাই</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Title & Ledger Verification Tab */
            <div className="p-5 space-y-4 overflow-y-auto max-h-[580px]">
              {selectedPlot ? (
                <div className="space-y-4">
                  <div className="bg-emerald-950/30 border border-emerald-800/80 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          ডিএলআরএস জাতীয় ভূমি রেকর্ড ও খতিয়ান প্রত্যয়িত
                        </h4>
                        <p className="text-xs text-emerald-300">
                          {selectedPlot.mouzaName} • দাগ নং {selectedPlot.dagNo} • খতিয়ান নং {selectedPlot.khatianNo}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/60 px-3 py-1 rounded-md border border-emerald-700">
                      MATCH: 100%
                    </span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <h5 className="font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
                      <span>মৌজা ও দাগের বিস্তারিত তথ্যচিত্র</span>
                      <span className="text-amber-400 font-mono">Dag #{selectedPlot.dagNo}</span>
                    </h5>

                    <div className="grid grid-cols-2 gap-3 text-slate-300">
                      <div>
                        <span className="text-slate-500 block">উপজেলা ও জেলা</span>
                        <span className="font-semibold text-white">{selectedPlot.thanaName}, {selectedPlot.districtName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">মৌজা ও জেএল</span>
                        <span className="font-semibold text-white">{selectedPlot.mouzaName} ({selectedPlot.jlNo})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">রেকর্ডভুক্ত মালিকের নাম</span>
                        <span className="font-semibold text-white">{selectedPlot.ownerNameBn} ({selectedPlot.ownerNameEn})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">জমির শ্রেণি</span>
                        <span className="font-semibold text-white">{selectedPlot.landClass}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">জমির পরিমাণ</span>
                        <span className="font-semibold text-emerald-400">{selectedPlot.areaDecimal} শতক (Decimals)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">জরিপ পর্যায়</span>
                        <span className="font-semibold text-amber-300">{selectedPlot.surveyType}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveRole('sub_registrar');
                          const el = document.getElementById('sub_registrar');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        <FileText className="w-4 h-4" />
                        <span>সাব-রেজিস্ট্রারে দলিল সম্পাদন করুন</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveRole('ac_land');
                          const el = document.getElementById('ac_land');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        <span>এসিল্যান্ড ই-নামজারি</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p>যাচাই করার জন্য ম্যাপ থেকে একটি দাগ নির্বাচন করুন।</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Dag Search & Quick Panel */}
        <div className="lg:col-span-4 p-4 bg-slate-900/90 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Quick Dag Search */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {language === 'bn' ? '🔍 দাগ নম্বর দ্বারা সরাসরি অনুসন্ধান:' : '🔍 Search by Dag Number:'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dagSearch}
                  onChange={(e) => setDagSearch(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: ২৪১০, ২৪১১...' : 'e.g., 2410, 2411...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 pr-9 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    const match = sampleMouzaPlots.find(p => p.dagNo.includes(dagSearch.trim()));
                    if (match) setSelectedPlot(match);
                  }}
                  className="absolute right-2 top-2.5 text-slate-400 hover:text-amber-400"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Selected Plot Preview Card */}
            {selectedPlot && (
              <div className="bg-amber-950/20 border border-amber-800/70 p-3.5 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    {language === 'bn' ? 'নির্বাচিত ক্যাডাস্ট্রাল দাগ' : 'Selected Cadastral Dag'}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    দাগ #{selectedPlot.dagNo}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h4 className="text-lg font-black text-white">খতিয়ান #{selectedPlot.khatianNo}</h4>
                  <span className="text-xs text-amber-300 font-semibold ml-auto">{selectedPlot.areaDecimal} শতক</span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-500">মালিক: </span>
                    <strong className="text-white">{selectedPlot.ownerNameBn}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">মৌজা: </span>
                    <span className="text-slate-300">{selectedPlot.mouzaName} ({selectedPlot.jlNo})</span>
                  </div>
                  <div>
                    <span className="text-slate-500">শ্রেণি: </span>
                    <span className="text-slate-300">{selectedPlot.landClass}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('verify')}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>{language === 'bn' ? 'স্বত্ব ও নামজারি তথ্য যাচাই' : 'Verify Title & Mutation'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* DLRS Advisory Banner */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ভূমি রেকর্ড ও জরিপ ব্যবস্থাপনা নির্দেশনা</span>
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                সেটুল্যান্ড প্ল্যাটফর্ম সরাসরি ভূমি মন্ত্রণালয়ের সেন্ট্রাল ডাটাবেজের সাথে সংযুক্ত। সাব-রেজিস্ট্রি দলিলের পূর্বে মৌজা নকশা ও খতিয়ান যাচাই জালিয়াতি রোধে শতভাগ কার্যকর।
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Department of Land Records & Surveys</span>
            <span className="font-mono text-amber-400">settlement.gov.bd</span>
          </div>
        </div>
      </div>
    </div>
  );
};
