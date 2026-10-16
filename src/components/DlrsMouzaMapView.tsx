'use client';

import React, { useState, useMemo } from 'react';
import { 
  Map, 
  Layers, 
  ShieldCheck, 
  Building2, 
  Lock, 
  Scale, 
  ArrowRight,
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  Crosshair, 
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  Sparkles,
  MapPin,
  Globe2,
  Sliders,
  DollarSign,
  Activity,
  FileCheck2,
  ChevronRight,
  Table,
  Eye,
  TrendingUp,
  Building,
  Navigation
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { KhatianRecord } from '@/types';
import districtsGeoData from '@/data/bangladeshDistrictsGeo.json';
import { 
  BANGLADESH_DIVISIONS, 
  ALL_BANGLADESH_DISTRICTS, 
  DistrictData, 
  DivisionData 
} from '@/data/bangladeshMapData';
import { getDistrictLandData, DISTRICT_LAND_DATA } from '@/data/landtechData';
import { CadastralMouzaMap } from './CadastralMouzaMap';
import dynamic from 'next/dynamic';

const BangladeshInteractiveMap = dynamic(
  () => import('./BangladeshInteractiveMap').then((m) => m.BangladeshInteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-500 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-800">
        Loading Bangladesh Interactive Map & GIS...
      </div>
    ),
  }
);
import { HeroMapDossier } from './HeroMapDossier';
import { RajukWplrsViewer } from './RajukWplrsViewer';
import { SettlementMapSearchViewer } from './SettlementMapSearchViewer';

// Map View Mode (Mouza Sheet vs 64-District National GIS vs DLRS Settlement vs RAJUK WPLRS vs Parcel Ledger)
type MapViewMode = 'mouza_sheet' | 'national_gis' | 'settlement_map' | 'rajuk_wplrs' | 'parcel_ledger';

// Basemap Display Styles ported from LandTech-LA-135
type BasemapStyle = 'blueprint' | 'satellite' | 'zoning';

// Multiple Mouza Zones with authentic Bangladesh Cadastral Metadata
interface MouzaZone {
  id: string;
  nameEn: string;
  nameBn: string;
  districtEn: string;
  districtBn: string;
  jlNo: string;
  avgRatePerDecBDT: number;
  riverName: string;
  riverNameBn: string;
  highwayName: string;
  highwayNameBn: string;
  coordinates: string;
}

const MOUZA_ZONES: MouzaZone[] = [
  {
    id: 'savar_ashulia',
    nameEn: 'Savar & Ashulia Mouza',
    nameBn: 'সাভার ও আশুলিয়া মৌজা',
    districtEn: 'Dhaka',
    districtBn: 'ঢাকা',
    jlNo: 'JL-42 & JL-18',
    avgRatePerDecBDT: 450000,
    riverName: 'Bangshi River Tributary',
    riverNameBn: 'বংশী নদী শাখা',
    highwayName: 'Dhaka-Aricha Regional Highway (N5)',
    highwayNameBn: 'ঢাকা-আরিচা আঞ্চলিক মহাসড়ক (এন৫)',
    coordinates: '23°50\'42"N, 90°15\'28"E • WGS84'
  },
  {
    id: 'purbachal_rupganj',
    nameEn: 'Purbachal Sector 17 & Rupganj',
    nameBn: 'পূর্বাচল সেক্টর ১৭ ও রূপগঞ্জ',
    districtEn: 'Dhaka / Narayanganj',
    districtBn: 'ঢাকা / নারায়ণগঞ্জ',
    jlNo: 'JL-09 & JL-14',
    avgRatePerDecBDT: 1200000,
    riverName: 'Balu River & Shitalakshya Canal',
    riverNameBn: 'বালু নদী ও শীতলক্ষ্যা ক্যানেল',
    highwayName: '300ft Purbachal Expressway (N105)',
    highwayNameBn: '৩০০ ফুট পূর্বাচল এক্সপ্রেসওয়ে (এন১০৫)',
    coordinates: '23°50\'02"N, 90°31\'42"E • WGS84'
  },
  {
    id: 'agrabad_ctg',
    nameEn: 'Agrabad Commercial Area',
    nameBn: 'আগ্রাবাদ বাণিজ্যিক এলাকা',
    districtEn: 'Chittagong',
    districtBn: 'চট্টগ্রাম',
    jlNo: 'JL-15 (Double Mooring)',
    avgRatePerDecBDT: 2500000,
    riverName: 'Karnaphuli River Maritime Channel',
    riverNameBn: 'কর্ণফুলী নদী চ্যানেল',
    highwayName: 'Sheikh Mujib Road & Strand Avenue',
    highwayNameBn: 'শেখ মুজিব রোড ও স্ট্র্যান্ড এভিনিউ',
    coordinates: '22°19\'34"N, 91°48\'52"E • WGS84'
  },
  {
    id: 'shahjalal_sylhet',
    nameEn: 'Shahjalal Upashahar Mouza',
    nameBn: 'শাহজালাল উপশহর মৌজা',
    districtEn: 'Sylhet',
    districtBn: 'সিলেট',
    jlNo: 'JL-08 (Sylhet Sadar)',
    avgRatePerDecBDT: 850000,
    riverName: 'Surma River Meander',
    riverNameBn: 'সুরমা নদী উপত্যকা',
    highwayName: 'Airport Bypass & Osmani Avenue',
    highwayNameBn: 'এয়ারপোর্ট বাইপাস ও ওসমানী এভিনিউ',
    coordinates: '24°53\'56"N, 91°52\'18"E • WGS84'
  }
];

export const DlrsMouzaMapView: React.FC = () => {
  const { 
    khatians, 
    selectedPlotId, 
    setSelectedPlotId, 
    setActiveRole, 
    language,
    calculateFees,
    theme,
    setTheme
  } = useLandApp();

  // Primary Map View Mode (Default to Bangladesh Interactive GIS Map)
  const [viewMode, setViewMode] = useState<MapViewMode>('national_gis');

  // Active Mouza Zone & Basemap Style
  const [activeMouzaId, setActiveMouzaId] = useState<string>('savar_ashulia');
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('blueprint');
  
  // Layer Overlay Toggles
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showLocks, setShowLocks] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'clean' | 'locked' | 'blocked'>('all');

  // Interactive Zoom
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredPlot, setHoveredPlot] = useState<KhatianRecord | null>(null);

  // 64-District GIS Mode States
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dhaka');
  const [hoveredDistrict, setHoveredDistrict] = useState<any | null>(null);
  const [colorByViability, setColorByViability] = useState<boolean>(true);
  const [districtZoom, setDistrictZoom] = useState<number>(1);
  const [calcKatha, setCalcKatha] = useState<number>(5);

  const activeMouza = useMemo(() => {
    return MOUZA_ZONES.find(m => m.id === activeMouzaId) || MOUZA_ZONES[0];
  }, [activeMouzaId]);

  const selectedPlot = useMemo(() => {
    return khatians.find(k => k.id === selectedPlotId) || khatians[0];
  }, [khatians, selectedPlotId]);

  // Parcel status helper
  const getParcelColor = (plot: KhatianRecord) => {
    if (plot.isMortgaged || plot.hasCourtCase || plot.isAcquired) {
      return {
        fill: basemapStyle === 'satellite' ? 'rgba(239, 68, 68, 0.55)' : 'rgba(248, 113, 113, 0.40)',
        stroke: '#f87171',
        statusType: 'blocked',
        statusText: language === 'en' ? 'Blocked: Bank Mortgage / Court Injunction' : 'স্থগিত: ব্যাংক বন্ধক / আদালতের নিষেধাজ্ঞা',
        statusClass: 'text-[#f87171] bg-[#f87171]/10 border-[#f87171]/30'
      };
    }
    if (plot.lockedAreaDecimals > 0) {
      return {
        fill: basemapStyle === 'satellite' ? 'rgba(245, 158, 11, 0.60)' : 'rgba(251, 191, 36, 0.45)',
        stroke: '#fbbf24',
        statusType: 'locked',
        statusText: language === 'en' ? `Partial Escrow Lock: ${plot.lockedAreaDecimals.toFixed(1)} Dec in Mutation` : `আংশিক এসক্রো লক: ${plot.lockedAreaDecimals.toFixed(1)} শতক নামজারিতে`,
        statusClass: 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/30'
      };
    }
    return {
      fill: basemapStyle === 'satellite' ? 'rgba(16, 185, 129, 0.50)' : 'rgba(74, 222, 128, 0.40)',
      stroke: '#4ade80',
      statusType: 'clean',
      statusText: language === 'en' ? 'Clean Title: 100% Ready for Registration' : 'নির্ভেজাল স্বত্ব: তাৎক্ষণিক রেজিস্ট্রেশনযোগ্য',
      statusClass: 'text-[#4ade80] bg-[#4ade80]/10 border-[#4ade80]/30'
    };
  };

  // Filtered parcels based on search and status
  const filteredKhatians = useMemo(() => {
    return khatians.filter(plot => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        plot.dagNo.toLowerCase().includes(q) || 
        plot.khatianNo.toLowerCase().includes(q) || 
        plot.ownerName.toLowerCase().includes(q) ||
        plot.ownerNameBn.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const colors = getParcelColor(plot);
      if (statusFilter === 'clean') return colors.statusType === 'clean';
      if (statusFilter === 'locked') return colors.statusType === 'locked';
      if (statusFilter === 'blocked') return colors.statusType === 'blocked';
      return true;
    });
  }, [khatians, searchQuery, statusFilter, language, basemapStyle]);

  // Land Valuation calculation
  const estimatedMarketValueBDT = Math.round(selectedPlot.totalAreaDecimals * activeMouza.avgRatePerDecBDT);
  const feeBreakdown = calculateFees(estimatedMarketValueBDT);

  const formatBDT = (amount: number) => {
    if (amount >= 10000000) {
      return `৳${(amount / 10000000).toFixed(2)} ${language === 'en' ? 'Crore' : 'কোটি'}`;
    }
    return `৳${(amount / 100000).toFixed(2)} ${language === 'en' ? 'Lakh' : 'লাখ'}`;
  };

  // Selected District Land Meta in 64-District mode
  const activeDistrictLand = useMemo(() => {
    return getDistrictLandData(selectedDistrictId);
  }, [selectedDistrictId]);

  const activeDistrictInfo = useMemo(() => {
    return ALL_BANGLADESH_DISTRICTS.find(d => d.id === selectedDistrictId) || ALL_BANGLADESH_DISTRICTS[0];
  }, [selectedDistrictId]);

  const activeDivisionInfo = useMemo(() => {
    if (selectedDivisionFilter === 'all') return null;
    return BANGLADESH_DIVISIONS.find(div => div.id.toLowerCase().includes(selectedDivisionFilter.toLowerCase())) || null;
  }, [selectedDivisionFilter]);

  // Filtered districts for National GIS
  const visibleDistricts = useMemo(() => {
    return districtsGeoData.districts.filter(dist => {
      if (selectedDivisionFilter === 'all') return true;
      return dist.division.toLowerCase() === selectedDivisionFilter.toLowerCase();
    });
  }, [selectedDivisionFilter]);

  return (
    <div className="space-y-6">
      
      {/* ── 1. UNIFIED CADASTRAL HEADER & MULTI-MODE SWITCHER ── */}
      <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272a] rounded-lg p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-[#1b1b1f] border border-zinc-200 dark:border-[#27272a] text-xs font-mono text-[#d4a657]">
              <Map className="w-3.5 h-3.5 text-[#d4a657]" />
              <span>{language === 'en' ? 'DLRS Cadastral GIS & Land Intelligence' : 'ডিএলআরএস ক্যাডাস্ট্রাল জিআইএস ও ভূমি তথ্যচিত্র'}</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-[#f4f4f5] tracking-tight flex items-center gap-2.5 flex-wrap">
              <span>
                {viewMode === 'mouza_sheet' 
                  ? (language === 'en' ? activeMouza.nameEn : activeMouza.nameBn)
                  : viewMode === 'national_gis'
                  ? (language === 'en' ? 'Bangladesh Interactive GIS Map (64 Districts & Vector Atlas)' : 'বাংলাদেশ ইন্টারঅ্যাক্টিভ জিআইএস মানচিত্র (৬৪ জেলা ও ভেক্টর অ্যাটলাস)')
                  : viewMode === 'settlement_map'
                  ? (language === 'en' ? 'DLRS National Cadastral Map Search (settlement.gov.bd)' : 'ডিএলআরএস জাতীয় মৌজা ও ক্যাডাস্ট্রাল ম্যাপ অনুসন্ধান')
                  : viewMode === 'rajuk_wplrs'
                  ? (language === 'en' ? 'RAJUK WPLRS Model Town GIS & Land Record System' : 'রাজউক ডব্লিউপিএলআরএস মডেল টাউন জিআইএস ও ভূমি রেকর্ড সিস্টেম')
                  : (language === 'en' ? 'Cadastral Parcel Registry Ledger' : 'ক্যাডাস্ট্রাল পার্সেল রেজিস্ট্রি খতিয়ান')}
              </span>
              {viewMode === 'mouza_sheet' && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-50 dark:bg-[#231d13] text-[#d4a657] border border-amber-200 dark:border-[#4a3a1f]">
                  {activeMouza.jlNo}
                </span>
              )}
              {viewMode === 'settlement_map' && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-950 text-amber-400 border border-amber-800">
                  settlement.gov.bd
                </span>
              )}
              {viewMode === 'rajuk_wplrs' && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                  wplrs.rajuk.gov.bd
                </span>
              )}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#a1a1aa] max-w-2xl leading-relaxed">
              {viewMode === 'mouza_sheet'
                ? (language === 'en'
                    ? 'High-precision interactive cadastral map showing real boundaries, live escrow locks, and instant title chain due-diligence.'
                    : 'লাইভ অবস্থার ভিত্তিতে রঙের পরিবর্তনশীল ক্যাডাস্ট্রাল প্লট। দাগে ক্লিক করে স্বত্ব, মূল্যায়ন ও দলিল সম্পাদনের খরচ যাচাই করুন।')
                : viewMode === 'national_gis'
                ? (language === 'en'
                    ? 'Explore Bangladesh with 4 view modes: MapLibre vector GIS, 64-district interactive SVG with OSRM route navigation, 8 administrative divisions, and satellite basemaps.'
                    : '৪টি ভিউ মোডে বাংলাদেশ অন্বেষণ করুন: ম্যাপলিব্রে ভেক্টর জিআইএস, ওএসআরএম রুট নেভিগেশন সহ ৬৪ জেলার মানচিত্র, ৮ বিভাগীয় অ্যাটলাস ও স্যাটেলাইট লেয়ার।')
                : viewMode === 'settlement_map'
                ? (language === 'en'
                    ? 'Official Ministry of Land / DLRS digital cadastral map search engine with cascading Division, District, Survey (CS/SA/RS/BS/BDS), Thana, Mouza, and Dag querying.'
                    : 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর (DLRS)-এর অফিশিয়াল ডিজিটাল মৌজা নকশা অনুসন্ধান। বিভাগ, জেলা, জরিপ (CS/SA/RS/BS/BDS), থানা, মৌজা ও দাগ অনুযায়ী অনুসন্ধান।')
                : viewMode === 'rajuk_wplrs'
                ? (language === 'en'
                    ? 'Official Rajdhani Unnayan Kartripakkha (RAJUK) Web-based Plot & Land Record System (WPLRS) with Banani, Gulshan, Baridhara, Uttara, and Purbachal model town masterplans.'
                    : 'রাজউক-এর অফিশিয়াল ওয়েব-বেজড প্লট ও ভূমি রেকর্ড সিস্টেম (WPLRS)। বনানী, গুলশান, বারিধারা, উত্তরা ও পূর্বাচল মাস্টারপ্ল্যানের ক্যাডাস্ট্রাল নকশা ও বরাদ্দ রেকর্ড।')
                : (language === 'en'
                    ? 'Synchronized tabular registry of all mouza parcels with automated title reconciliation, boundary verification, and deed status.'
                    : 'ডিজিটাল খতিয়ান ও দাগ রেজিস্ট্রি তালিকা। এক ক্লিকে দলিল সম্পাদন ও নাগরিক পরচা যাচাই করুন।')}
            </p>
          </div>

          {/* View Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-[#1b1b1f] rounded-lg border border-zinc-200 dark:border-[#27272a] shrink-0 self-start lg:self-center shadow-xs flex-wrap">
            <button
              type="button"
              onClick={() => setViewMode('mouza_sheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer focus:outline-none ${
                viewMode === 'mouza_sheet'
                  ? 'bg-zinc-900 text-white dark:bg-[#FAF9F5] dark:text-[#191817] font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#f4f4f5] hover:bg-zinc-200/60 dark:hover:bg-[#242429]'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Mouza Sheet' : 'মৌজা নকশা'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('national_gis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer focus:outline-none ${
                viewMode === 'national_gis'
                  ? 'bg-zinc-900 text-white dark:bg-[#FAF9F5] dark:text-[#191817] font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#f4f4f5] hover:bg-zinc-200/60 dark:hover:bg-[#242429]'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Bangladesh Map & GIS' : 'বাংলাদেশ মানচিত্র ও জিআইএস'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('settlement_map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer focus:outline-none ${
                viewMode === 'settlement_map'
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#f4f4f5] hover:bg-zinc-200/60 dark:hover:bg-[#242429]'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'DLRS Settlement' : 'ডিএলআরএস ম্যাপ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('rajuk_wplrs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer focus:outline-none ${
                viewMode === 'rajuk_wplrs'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#f4f4f5] hover:bg-zinc-200/60 dark:hover:bg-[#242429]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'RAJUK WPLRS' : 'রাজউক WPLRS'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('parcel_ledger')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer focus:outline-none ${
                viewMode === 'parcel_ledger'
                  ? 'bg-zinc-900 text-white dark:bg-[#FAF9F5] dark:text-[#191817] font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#f4f4f5] hover:bg-zinc-200/60 dark:hover:bg-[#242429]'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Parcel Ledger' : 'পার্সেল লেজার'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── MODE 1: CADASTRAL MOUZA SHEET (PARCEL CANVAS & INSPECTOR) ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'mouza_sheet' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Controls Bar: Mouza Zone, Search, Status Filter, Basemap Styles */}
          <div className="bg-[#121215] border border-[#27272a] rounded-lg p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs shadow-xs">
            {/* Left: Mouza Zone Dropdown & Search */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <select
                value={activeMouzaId}
                onChange={(e) => setActiveMouzaId(e.target.value)}
                className="bg-[#1b1b1f] hover:bg-[#242429] text-[#f4f4f5] border border-[#27272a] text-xs font-sans rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#d4a657] transition-all cursor-pointer shrink-0"
              >
                {MOUZA_ZONES.map((mouza) => (
                  <option key={mouza.id} value={mouza.id} className="bg-[#1b1b1f] text-[#f4f4f5]">
                    {language === 'en' ? `${mouza.nameEn}` : `${mouza.nameBn}`}
                  </option>
                ))}
              </select>

              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'en' ? 'Dag No, Khatian, Owner...' : 'দাগ নম্বর, খতিয়ান বা মালিক...'}
                  className="w-full bg-[#1b1b1f] text-[#f4f4f5] placeholder-[#71717a] border border-[#27272a] rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#d4a657] transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#f4f4f5]"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Center: Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-sm text-[11px] font-sans font-medium transition-all cursor-pointer focus:outline-none ${
                  statusFilter === 'all'
                    ? 'bg-[#d4a657] text-[#09090b] font-semibold shadow-xs'
                    : 'bg-[#1b1b1f] text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#27272a]'
                }`}
              >
                {language === 'en' ? 'All' : 'সকল'}
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('clean')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-sans font-medium transition-all cursor-pointer focus:outline-none ${
                  statusFilter === 'clean'
                    ? 'bg-[#4ade80] text-[#09090b] font-semibold shadow-xs'
                    : 'bg-[#1b1b1f] text-[#4ade80] hover:bg-[#4ade80]/10 border border-[#27272a]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                {language === 'en' ? 'Clean' : 'নির্ভেজাল'}
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('locked')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-sans font-medium transition-all cursor-pointer focus:outline-none ${
                  statusFilter === 'locked'
                    ? 'bg-[#fbbf24] text-[#09090b] font-semibold shadow-xs'
                    : 'bg-[#1b1b1f] text-[#fbbf24] hover:bg-[#fbbf24]/10 border border-[#27272a]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                {language === 'en' ? 'Locked' : 'লককৃত'}
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('blocked')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-sans font-medium transition-all cursor-pointer focus:outline-none ${
                  statusFilter === 'blocked'
                    ? 'bg-[#f87171] text-[#09090b] font-semibold shadow-xs'
                    : 'bg-[#1b1b1f] text-[#f87171] hover:bg-[#f87171]/10 border border-[#27272a]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                {language === 'en' ? 'Blocked' : 'স্থগিত'}
              </button>
            </div>

            {/* Right: Basemap Styles */}
            <div className="flex items-center gap-1 p-0.5 bg-[#1b1b1f] rounded-lg border border-[#27272a] shrink-0 shadow-xs">
              <button
                type="button"
                onClick={() => setBasemapStyle('blueprint')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition-all cursor-pointer focus:outline-none ${
                  basemapStyle === 'blueprint' 
                    ? 'bg-[#242429] text-[#f4f4f5] font-semibold border border-[#d4a657]' 
                    : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
                }`}
              >
                {language === 'en' ? 'Blueprint' : 'ব্লুপ্রিন্ট'}
              </button>
              <button
                type="button"
                onClick={() => setBasemapStyle('satellite')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition-all cursor-pointer focus:outline-none ${
                  basemapStyle === 'satellite' 
                    ? 'bg-[#242429] text-[#f4f4f5] font-semibold border border-[#d4a657]' 
                    : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
                }`}
              >
                {language === 'en' ? 'Satellite' : 'স্যাটেলাইট'}
              </button>
              <button
                type="button"
                onClick={() => setBasemapStyle('zoning')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition-all cursor-pointer focus:outline-none ${
                  basemapStyle === 'zoning' 
                    ? 'bg-[#242429] text-[#f4f4f5] font-semibold border border-[#d4a657]' 
                    : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
                }`}
              >
                {language === 'en' ? 'Zoning' : 'জোনিং'}
              </button>
            </div>
          </div>

          {/* Main Workspace: Map Canvas (8 cols) + Parcel Inspector (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ── LEFT: INTERACTIVE CADASTRAL MOUZA MAP WITH GOOGLE SATELLITE & GEMINI AI (8 COLS) ── */}
            <div className="lg:col-span-8">
              <CadastralMouzaMap />
            </div>

            {/* ── RIGHT: CADASTRAL PARCEL DOSSIER & VALUATION INSPECTOR (4 COLS) ── */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#121215] border border-[#27272a] rounded-lg p-5 shadow-xs space-y-4 font-sans text-xs">
                
                {/* Header: Dag Number & Mouza */}
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
                      {language === 'en' ? 'Cadastral Parcel Dossier' : 'দাগ ও খতিয়ান বিবরণী'}
                    </span>
                    <h3 className="font-display font-bold text-base text-[#f4f4f5]">
                      Dag #{selectedPlot.dagNo}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#d4a657] bg-[#231d13] px-2.5 py-1 rounded-md border border-[#4a3a1f]">
                    {selectedPlot.khatianNo}
                  </span>
                </div>

                {/* Live Title Status Pill */}
                {(() => {
                  const colors = getParcelColor(selectedPlot);
                  return (
                    <div className={`p-2.5 rounded-md border text-xs font-medium flex items-center gap-2 ${colors.statusClass}`}>
                      {colors.statusType === 'clean' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#4ade80]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{colors.statusText}</span>
                    </div>
                  );
                })()}

                {/* Core Specs Grid */}
                <div className="space-y-2 text-xs divide-y divide-[#1e1e24]">
                  <div className="flex justify-between py-1">
                    <span className="text-[#a1a1aa]">{language === 'en' ? 'Recorded Owner:' : 'মালিকের নাম:'}</span>
                    <span className="font-medium text-[#f4f4f5]">{selectedPlot.ownerName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#a1a1aa]">{language === 'en' ? 'Owner NID:' : 'মালিকের এনআইডি:'}</span>
                    <span className="font-mono text-[#a1a1aa] text-[11px]">{selectedPlot.ownerNid}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#a1a1aa]">{language === 'en' ? 'Total Area:' : 'মোট জমির পরিমাণ:'}</span>
                    <span className="font-mono font-bold text-[#f4f4f5]">
                      {selectedPlot.totalAreaDecimals.toFixed(2)} Dec ({(selectedPlot.totalAreaDecimals / 1.65).toFixed(2)} Katha)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-[#fbbf24]">
                    <span>{language === 'en' ? 'Locked in e-Mutation:' : 'নামজারিতে লককৃত:'}</span>
                    <span className="font-mono font-bold">{selectedPlot.lockedAreaDecimals.toFixed(2)} Dec</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-[#4ade80] font-bold text-sm">
                    <span>{language === 'en' ? 'Available to Transfer:' : 'অবমুক্ত বিক্রয়যোগ্য:'}</span>
                    <span className="font-mono tabular-nums">
                      {Math.max(0, selectedPlot.totalAreaDecimals - selectedPlot.lockedAreaDecimals).toFixed(2)} Dec
                    </span>
                  </div>
                </div>

                {/* Land Valuation & Fee Calculator */}
                <div className="bg-[#1b1b1f] border border-[#27272a] rounded-lg p-3 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#d4a657]">
                    <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                      <DollarSign className="w-3.5 h-3.5" />
                      {language === 'en' ? 'Valuation & Fee Calculator' : 'জমি মূল্য ও সরকারি ফি হিসাব'}
                    </span>
                    <span className="text-[10px] text-[#71717a]">Govt Mouza Rate</span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#a1a1aa]">{language === 'en' ? 'Estimated Market Value:' : 'আনুমানিক বাজারমূল্য:'}</span>
                    <span className="font-mono font-bold text-sm sm:text-base text-[#f4f4f5]">
                      {formatBDT(estimatedMarketValueBDT)}
                    </span>
                  </div>

                  {/* Fee Breakdown Pills */}
                  <div className="pt-2 border-t border-[#27272a] grid grid-cols-2 gap-1.5 text-[10px] font-mono text-[#a1a1aa]">
                    <div>Stamp Duty (1.5%): <span className="text-[#f4f4f5]">৳{feeBreakdown.stampDutyBDT.toLocaleString()}</span></div>
                    <div>Reg Fee (1.0%): <span className="text-[#f4f4f5]">৳{feeBreakdown.registrationFeeBDT.toLocaleString()}</span></div>
                    <div>Local Govt (3%): <span className="text-[#f4f4f5]">৳{feeBreakdown.localGovtTaxBDT.toLocaleString()}</span></div>
                    <div>Mutation Fee: <span className="text-[#4ade80]">৳1,170 (Fixed)</span></div>
                  </div>
                </div>

                {/* 5-Point Statutory Pre-Audit Checklist */}
                <div className="bg-[#1b1b1f] border border-[#27272a] rounded-lg p-3 space-y-1.5 text-[11px] shadow-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] font-semibold block">
                    {language === 'en' ? '5-Point Statutory Verification Audit' : '৫-দফা বিধিবদ্ধ যাচাইকরণ অডিট'}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-[#4ade80]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>CS → SA → RS → BS Title Chain Match</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#4ade80]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Biometric NID Linked: {selectedPlot.ownerNid.slice(0, 16)}...</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${selectedPlot.isMortgaged ? 'text-[#f87171]' : 'text-[#4ade80]'}`}>
                    {selectedPlot.isMortgaged ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    <span>{selectedPlot.isMortgaged ? 'Bank Mortgage Lien Active' : 'Zero Bank Mortgage Liens'}</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${selectedPlot.hasCourtCase ? 'text-[#f87171]' : 'text-[#4ade80]'}`}>
                    {selectedPlot.hasCourtCase ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    <span>{selectedPlot.hasCourtCase ? 'Court Order 39 Injunction Stay' : 'No Civil Injunctions Filed'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlotId(selectedPlot.id);
                      setActiveRole('sub_registrar');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#d4a657] hover:bg-[#be8a3a] text-[#09090b] rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer focus:outline-none"
                  >
                    <span>{language === 'en' ? 'Proceed to Register Deed for this Plot' : 'এই দাগের জন্য দলিল সম্পাদন করুন'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlotId(selectedPlot.id);
                      setActiveRole('citizen');
                    }}
                    className="w-full py-2 px-3 bg-[#1b1b1f] hover:bg-[#242429] text-[#f4f4f5] border border-[#27272a] hover:border-[#d4a657] rounded-md text-xs font-medium transition-colors cursor-pointer focus:outline-none shadow-xs"
                  >
                    {language === 'en' ? 'Inspect Title Chain in Citizen Portal' : 'নাগরিক পোর্টালে পরচার ইতিহাস দেখুন'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── MODE 2: BANGLADESH INTERACTIVE GIS & 64-DISTRICT MAP ────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'national_gis' && (
        <div className="space-y-6 animate-fade-in">
          {/* Interactive Map — full width with all options from LandTech-LA-135 */}
          <BangladeshInteractiveMap
            isBn={language === 'bn'}
            theme={theme}
            setTheme={setTheme}
            selectedDistrict={activeDistrictInfo}
            onSelectDistrict={(district) => setSelectedDistrictId(district.id)}
            selectedDivision={activeDivisionInfo}
            onSelectDivision={(division) => {
              const divKey = division.id.replace('division', '').trim();
              setSelectedDivisionFilter(divKey);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Live Land Dossier & Spatial Metrics row below map as in LandTech-LA-135 */}
          <HeroMapDossier
            isBn={language === 'bn'}
            theme={theme}
            selectedDistrict={activeDistrictInfo}
            selectedDivision={activeDivisionInfo}
            onSelectDistrictById={(id) => setSelectedDistrictId(id)}
            onOpenMouzaSheet={() => setViewMode('mouza_sheet')}
          />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── MODE 3: CADASTRAL PARCEL REGISTRY LEDGER (TABLE EXPLORER) ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'parcel_ledger' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Table Search & Filter Bar */}
          <div className="bg-[#121215] border border-[#27272a] rounded-lg p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search Dag #, Khatian #, Owner...' : 'দাগ নম্বর, খতিয়ান, মালিক খুঁজুন...'}
                className="w-full bg-[#1b1b1f] text-[#f4f4f5] placeholder-[#71717a] border border-[#27272a] rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#d4a657] transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-sm text-xs font-sans transition-all cursor-pointer focus:outline-none ${
                  statusFilter === 'all'
                    ? 'bg-[#d4a657] text-[#09090b] font-semibold shadow-xs'
                    : 'bg-[#1b1b1f] text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#27272a]'
                }`}
              >
                {language === 'en' ? 'All Plots' : 'সকল দাগ'}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('clean')}
                className={`px-3 py-1.5 rounded-sm text-xs font-sans transition-all cursor-pointer focus:outline-none ${
                  statusFilter === 'clean'
                    ? 'bg-[#4ade80] text-[#09090b] font-semibold shadow-xs'
                    : 'bg-[#1b1b1f] text-[#4ade80] hover:bg-[#4ade80]/10 border border-[#27272a]'
                }`}
              >
                {language === 'en' ? 'Verified Clean' : 'যাচাইকৃত নির্ভেজাল'}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('locked')}
                className={`px-3 py-1.5 rounded-sm text-xs font-sans transition-all cursor-pointer focus:outline-none ${
                  statusFilter === 'locked'
                    ? 'bg-[#fbbf24] text-[#09090b] font-semibold shadow-xs'
                    : 'bg-[#1b1b1f] text-[#fbbf24] hover:bg-[#fbbf24]/10 border border-[#27272a]'
                }`}
              >
                {language === 'en' ? 'Under Mutation' : 'নামজারিধীন'}
              </button>
            </div>
          </div>

          {/* Full Cadastral Parcel Table */}
          <div className="bg-[#121215] border border-[#27272a] rounded-lg overflow-hidden shadow-xs font-sans">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1b1b1f] text-[#a1a1aa] border-b border-[#27272a] uppercase text-[10px] tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">{language === 'en' ? 'Dag #' : 'দাগ নং'}</th>
                    <th className="py-3 px-4">{language === 'en' ? 'Khatian #' : 'খতিয়ান নং'}</th>
                    <th className="py-3 px-4">{language === 'en' ? 'Mouza & Upazila' : 'মৌজা ও উপজেলা'}</th>
                    <th className="py-3 px-4">{language === 'en' ? 'Recorded Owner' : 'রেকর্ডীয় মালিক'}</th>
                    <th className="py-3 px-4">{language === 'en' ? 'Classification' : 'জমির শ্রেণি'}</th>
                    <th className="py-3 px-4 font-mono">{language === 'en' ? 'Total Area' : 'জমির পরিমাণ'}</th>
                    <th className="py-3 px-4">{language === 'en' ? 'Title Status' : 'স্বত্ব স্থিতি'}</th>
                    <th className="py-3 px-4 text-right font-mono">{language === 'en' ? 'Valuation (BDT)' : 'বাজারমূল্য'}</th>
                    <th className="py-3 px-4 text-center">{language === 'en' ? 'Action' : 'অ্যাকশন'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24]">
                  {filteredKhatians.map(plot => {
                    const colors = getParcelColor(plot);
                    const isSelected = selectedPlotId === plot.id;
                    const plotValuation = Math.round(plot.totalAreaDecimals * activeMouza.avgRatePerDecBDT);

                    return (
                      <tr 
                        key={plot.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-[#231d13]/60' : 'hover:bg-[#1b1b1f]/60'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#f4f4f5]">
                          Dag #{plot.dagNo}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#d4a657] font-semibold">
                          {plot.khatianNo}
                        </td>
                        <td className="py-3.5 px-4 text-[#a1a1aa]">
                          {plot.mouza}, {plot.upazila}
                        </td>
                        <td className="py-3.5 px-4 text-[#f4f4f5] font-medium">
                          {language === 'en' ? plot.ownerName : plot.ownerNameBn}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#1b1b1f] text-[#a1a1aa] border border-[#27272a]">
                            {plot.landClass.split('/')[0].trim()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#4ade80]">
                          {plot.totalAreaDecimals.toFixed(1)} Dec ({(plot.totalAreaDecimals / 1.65).toFixed(1)} Katha)
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-semibold border ${colors.statusClass}`}>
                            {colors.statusType === 'clean' ? 'Verified Clean' : colors.statusType === 'locked' ? 'Escrow Locked' : 'Blocked / Stay'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#d4a657]">
                          {formatBDT(plotValuation)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPlotId(plot.id);
                                setViewMode('mouza_sheet');
                              }}
                              className="px-2 py-1 rounded bg-[#1b1b1f] hover:bg-[#242429] text-[#d4a657] border border-[#27272a] text-[11px] font-medium transition-all cursor-pointer"
                              title="Inspect on Cadastral Map"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPlotId(plot.id);
                                setActiveRole('sub_registrar');
                              }}
                              className="px-2 py-1 rounded bg-[#d4a657] hover:bg-[#be8a3a] text-[#09090b] text-[11px] font-semibold transition-all cursor-pointer"
                              title="Register Deed"
                            >
                              Register
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── MODE 3: DLRS SETTLEMENT DIGITAL MOUZA MAP SEARCH ───────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'settlement_map' && (
        <div className="space-y-6 animate-fade-in">
          <SettlementMapSearchViewer />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── MODE 4: RAJUK WPLRS MODEL TOWN GIS & LAND RECORDS ─────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'rajuk_wplrs' && (
        <div className="space-y-6 animate-fade-in">
          <RajukWplrsViewer />
        </div>
      )}

    </div>
  );
};

export default DlrsMouzaMapView;
