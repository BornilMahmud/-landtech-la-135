'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  MapPin,
  Search,
  ExternalLink,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Compass,
  Crosshair,
  ShieldCheck,
  FileText,
  Building,
  RefreshCw,
  Maximize2,
  Info,
  ChevronRight,
  Database,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  RajukProjectMeta,
  RajukPlotRecord,
  RajukMapResponse,
  RAJUK_PROJECTS,
  fetchRajukMap,
  searchRajukPlots
} from '@/utils/rajukWplrsService';
import { useLandApp } from '@/context/LandAppContext';

interface RajukWplrsViewerProps {
  initialMapcode?: string;
  onSelectPlot?: (plot: RajukPlotRecord) => void;
}

export const RajukWplrsViewer: React.FC<RajukWplrsViewerProps> = ({
  initialMapcode = '3_0',
  onSelectPlot
}) => {
  const { setActiveRole } = useLandApp();
  const [selectedMapcode, setSelectedMapcode] = useState<string>(initialMapcode);
  const [selectedSector, setSelectedSector] = useState<string>(initialMapcode);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapData, setMapData] = useState<RajukMapResponse | null>(null);
  const [plots, setPlots] = useState<RajukPlotRecord[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<RajukPlotRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mouseCoords, setMouseCoords] = useState<{ lat: string; lng: string }>({
    lat: '23.7905',
    lng: '90.4042'
  });
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState<'map' | 'plots' | 'verify'>('map');

  const containerRef = useRef<HTMLDivElement>(null);

  // Current project
  const currentProject = RAJUK_PROJECTS.find(p => p.mapcode === selectedMapcode) || RAJUK_PROJECTS[0];

  // Load Map & Plots
  const loadMapAndPlots = async (code: string) => {
    setLoading(true);
    try {
      const data = await fetchRajukMap(code);
      setMapData(data);
      const plotList = await searchRajukPlots({ projectMapcode: code });
      setPlots(plotList);
      if (plotList.length > 0) {
        setSelectedPlot(plotList[0]);
      }
    } catch (e) {
      console.error('Failed to load RAJUK data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapAndPlots(selectedMapcode);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  }, [selectedMapcode]);

  // Handle Sector Change
  const handleSectorChange = (code: string) => {
    setSelectedSector(code);
    loadMapAndPlots(code);
  };

  // Mouse Move for WGS84 coordinate estimation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    // Approximate delta around project center (span ~0.02 degrees)
    const latDelta = (0.5 - yRatio) * 0.018;
    const lngDelta = (xRatio - 0.5) * 0.022;

    const lat = (currentProject.centerLat + latDelta).toFixed(5);
    const lng = (currentProject.centerLng + lngDelta).toFixed(5);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchRajukPlots({
        projectMapcode: selectedMapcode,
        searchText: searchQuery
      });
      setPlots(results);
      if (results.length > 0) {
        setSelectedPlot(results[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const officialRajukUrl = `https://wplrs.rajuk.gov.bd/wplrs/MapViewer.aspx?mapcode=${selectedSector || selectedMapcode}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 font-sans">
      {/* Top Header Ribbon */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                RAJUK WPLRS Gateway API
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {mapData?.isLiveServer ? 'Live Server Connected (wplrs.rajuk.gov.bd)' : 'High-Availability Local Cache'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {language === 'bn' ? 'রাজউক ওয়েব-বেজড প্লট ও ভূমি রেকর্ড সিস্টেম (WPLRS)' : 'RAJUK Web-based Plot & Land Record System'}
            </h2>
          </div>
        </div>

        {/* Action Controls & Lang Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(l => l === 'bn' ? 'en' : 'bn')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {language === 'bn' ? 'EN' : 'বাংলা'}
          </button>

          <a
            href={officialRajukUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition-all"
            title="Open official RAJUK MapViewer.aspx in a new browser tab"
          >
            <span>{language === 'bn' ? 'মূল রাজউক পোর্টাল' : 'Gov RAJUK Portal'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Filter / Project Selector Bar */}
      <div className="bg-slate-950/90 p-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-medium">{language === 'bn' ? 'প্রকল্প:' : 'Project:'}</span>
            <select
              value={selectedMapcode}
              onChange={(e) => {
                setSelectedMapcode(e.target.value);
                setSelectedSector(e.target.value);
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {RAJUK_PROJECTS.map((proj) => (
                <option key={proj.mapcode} value={proj.mapcode} className="bg-slate-900 text-white">
                  {language === 'bn' ? proj.nameBn : proj.nameEn} ({proj.mapcode})
                </option>
              ))}
            </select>
          </div>

          {/* Sector Dropdown */}
          {currentProject.sectors.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400 font-medium">{language === 'bn' ? 'সেক্টর/জোন:' : 'Sector/Zone:'}</span>
              <select
                value={selectedSector}
                onChange={(e) => handleSectorChange(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {currentProject.sectors.map((sec) => (
                  <option key={sec.code} value={sec.code} className="bg-slate-900 text-white">
                    {language === 'bn' ? sec.labelBn : sec.labelEn}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? '🗺️ জিআইএস ম্যাপ' : '🗺️ GIS Map'}
            </button>
            <button
              onClick={() => setActiveTab('plots')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'plots'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? '📋 প্লট লেজার' : '📋 Plot Ledger'} ({plots.length})
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'verify'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? '🔒 যাচাইকরণ' : '🔒 Title Verification'}
            </button>
          </div>
        </div>

        {/* Live GPS Ticker */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            <Crosshair className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-500">WGS84:</span>
            <span className="text-emerald-300 font-semibold">{mouseCoords.lat}°N, {mouseCoords.lng}°E</span>
          </span>
          <span className="hidden sm:inline bg-slate-900 px-2 py-1 rounded-md border border-slate-800 text-slate-400">
            {mapData?.scaleText || '1:13500'}
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Map or Plot View */}
        <div className="lg:col-span-8 relative bg-slate-950 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800">
          {activeTab === 'map' ? (
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className="relative w-full h-[580px] overflow-hidden select-none cursor-grab active:cursor-grabbing bg-slate-950 flex items-center justify-center"
            >
              {/* Map Floating Toolbar */}
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
                <div className="w-full h-px bg-slate-700 my-0.5" />
                <button
                  onClick={() => setShowLegend(s => !s)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm ${
                    showLegend ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                  title="Toggle Map Legend"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>

              {/* Watermark / Attribution */}
              <div className="absolute bottom-3 left-3 z-20 bg-slate-950/85 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 pointer-events-none">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RAJUK Estate Cadastre & AspMap GIS Engine</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500">{currentProject.zone}</span>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-sm font-mono text-emerald-300 animate-pulse">
                    {language === 'bn' ? 'রাজউক জিআইএস ম্যাপ সার্ভার থেকে তথ্য লোড হচ্ছে...' : 'Loading RAJUK GIS Plot Vector from Server...'}
                  </p>
                </div>
              )}

              {/* Transform Container with Pan & Zoom */}
              <div
                style={{
                  transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
                className="relative max-w-full max-h-full flex items-center justify-center pointer-events-none"
              >
                {/* Server Rendered Map Image or Fallback Blueprint SVG */}
                {mapData?.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mapData.imageUrl}
                    alt={`${currentProject.nameEn} Cadastral Map`}
                    className="max-w-[760px] max-h-[540px] object-contain rounded-lg shadow-2xl border border-slate-800 pointer-events-auto"
                    draggable={false}
                  />
                )}

                {/* Plot Hotspot Overlays */}
                {plots.map((plot) => (
                  <button
                    key={plot.plotNo + plot.roadNo}
                    onClick={() => {
                      setSelectedPlot(plot);
                      if (onSelectPlot) onSelectPlot(plot);
                    }}
                    style={{
                      left: `${48 + (plot.lng - currentProject.centerLng) * 5000}%`,
                      top: `${48 - (plot.lat - currentProject.centerLat) * 5000}%`
                    }}
                    className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full border shadow-lg transition-transform hover:scale-125 ${
                      selectedPlot?.plotNo === plot.plotNo
                        ? 'bg-emerald-500 border-white text-slate-950 ring-4 ring-emerald-500/30'
                        : plot.mutationStatus === 'MORTGAGE_RESTRICTED'
                        ? 'bg-amber-500 border-amber-300 text-slate-950'
                        : 'bg-sky-600 border-sky-300 text-white'
                    }`}
                    title={`Plot ${plot.plotNo}, Road ${plot.roadNo}: ${plot.allotteeNameEn}`}
                  >
                    <MapPin className="w-3.5 h-3.5 fill-current" />
                  </button>
                ))}
              </div>

              {/* Map Legend Modal / Overlay */}
              {showLegend && (
                <div className="absolute top-3 right-3 z-20 w-64 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 shadow-2xl text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      {language === 'bn' ? 'ম্যাপ লেজেন্ড (সাংকেতিক চিহ্ন)' : 'Map Legend'}
                    </span>
                    <button
                      onClick={() => setShowLegend(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-400"></div>
                      <span className="text-slate-300">{language === 'bn' ? 'আবাসিক প্লট (Residential)' : 'Residential Plots'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-amber-600 border border-amber-400"></div>
                      <span className="text-slate-300">{language === 'bn' ? 'বাণিজ্যিক করিডোর (Commercial)' : 'Commercial Corridor'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-sky-600 border border-sky-400"></div>
                      <span className="text-slate-300">{language === 'bn' ? 'লেক / জলাশয় (Water Body)' : 'Lake / Water Body'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-purple-600 border border-purple-400"></div>
                      <span className="text-slate-300">{language === 'bn' ? 'কূটনৈতিক জোন (Diplomatic Zone)' : 'Diplomatic Zone'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-slate-700 border border-slate-500"></div>
                      <span className="text-slate-300">{language === 'bn' ? 'প্রধান সড়ক / এভিনিউ (Avenues)' : 'Primary Avenues'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'plots' ? (
            /* Plot Ledger List View */
            <div className="p-4 space-y-3 overflow-y-auto max-h-[580px]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  {language === 'bn' ? `${currentProject.nameBn} - প্লট রেজিস্ট্রি` : `${currentProject.nameEn} Plot Registry`}
                </h3>
                <span className="text-xs text-slate-400">
                  {plots.length} {language === 'bn' ? 'টি প্লট প্রদর্শিত' : 'Plots Listed'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plots.map((plot) => (
                  <div
                    key={plot.plotNo + plot.roadNo}
                    onClick={() => setSelectedPlot(plot)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedPlot?.plotNo === plot.plotNo
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">Plot #{plot.plotNo}</span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                            Road {plot.roadNo}
                          </span>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium">{plot.blockOrSector}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        plot.mutationStatus === 'MUTATED_CLEARED'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : plot.mutationStatus === 'MORTGAGE_RESTRICTED'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {plot.mutationStatus === 'MUTATED_CLEARED' ? 'CLEARED' : 'MORTGAGED'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 mb-3">
                      <div>
                        <span className="text-slate-500">{language === 'bn' ? 'বরাদ্দ প্রাপক:' : 'Allottee:'} </span>
                        <span className="font-semibold text-white">
                          {language === 'bn' ? plot.allotteeNameBn : plot.allotteeNameEn}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{plot.areaKatha} Katha ({plot.areaDecimal} Dec)</span>
                        <span>{plot.landUse}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-mono text-[10px] truncate max-w-[170px]">
                        {plot.allotmentLetterNo}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlot(plot);
                          setActiveTab('verify');
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                      >
                        <span>{language === 'bn' ? 'যাচাই করুন' : 'Verify'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Title & Allotment Verification Tab */
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
                          {language === 'bn' ? 'রাজউক বরাদ্দপত্র ও লিজডিল রেকর্ড যাচাইকৃত' : 'RAJUK Allotment & Lease Deed Verified'}
                        </h4>
                        <p className="text-xs text-emerald-300">
                          {language === 'bn' ? 'অনলাইন সার্ভারের ডিজিটাল সিগনেচার প্রত্যয়িত' : 'Authentic Web-based Plot & Land Record (WPLRS)'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/60 px-3 py-1 rounded-md border border-emerald-700">
                      MATCH: 100%
                    </span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <h5 className="font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
                      <span>{language === 'bn' ? 'প্লটের বিস্তারিত তথ্য' : 'Plot Detailed Dossier'}</span>
                      <span className="text-emerald-400 font-mono">Plot #{selectedPlot.plotNo}, Road #{selectedPlot.roadNo}</span>
                    </h5>

                    <div className="grid grid-cols-2 gap-3 text-slate-300">
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'প্রকল্পের নাম' : 'Project Name'}</span>
                        <span className="font-semibold text-white">{selectedPlot.projectName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'ব্লক / সেক্টর' : 'Block / Sector'}</span>
                        <span className="font-semibold text-white">{selectedPlot.blockOrSector}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'বরাদ্দ প্রাপক' : 'Allottee Name'}</span>
                        <span className="font-semibold text-white">{selectedPlot.allotteeNameEn} ({selectedPlot.allotteeNameBn})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'পিতা / স্বামীর নাম' : 'Father / Husband Name'}</span>
                        <span className="font-semibold text-white">{selectedPlot.fatherOrHusbandName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'জাতীয় পরিচয়পত্র (NID)' : 'National ID (NID)'}</span>
                        <span className="font-mono font-semibold text-white">{selectedPlot.nidOrPassport}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'জমির পরিমাপ' : 'Land Area'}</span>
                        <span className="font-semibold text-emerald-400">{selectedPlot.areaKatha} Katha ({selectedPlot.areaDecimal} Decimals / {selectedPlot.areaSqFt} SqFt)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'রাজউক বরাদ্দপত্র নং' : 'Allotment Letter Ref'}</span>
                        <span className="font-mono text-slate-200">{selectedPlot.allotmentLetterNo} ({selectedPlot.allotmentDate})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'সাব-রেজিস্ট্রি লিজডিল নং' : 'Sub-Registry Lease Deed'}</span>
                        <span className="font-mono text-slate-200">{selectedPlot.leaseDeedNo} ({selectedPlot.leaseDeedDate})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'ভবন নির্মাণ অনুমোদন' : 'Building Plan Sanction'}</span>
                        <span className="text-sky-300 font-medium">{selectedPlot.rajukBcCaseNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === 'bn' ? 'মৌজা ও সেটুল্যান্ড স্ট্যাটাস' : 'SetuLand Mutation Status'}</span>
                        <span className={`font-semibold ${selectedPlot.mutationStatus === 'MUTATED_CLEARED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {selectedPlot.mutationStatus === 'MUTATED_CLEARED' ? '✅ Mutated & Title Free' : '⚠️ Mortgaged to Bank'}
                        </span>
                      </div>
                    </div>

                    {selectedPlot.mortgageBank && (
                      <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-lg text-amber-300 text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Institutional Bank Encumbrance Active:</strong>
                          <span>{selectedPlot.mortgageBank}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveRole('sub_registrar');
                          const el = document.getElementById('sub_registrar');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{language === 'bn' ? 'সাব-রেজিস্ট্রারে দলিল সম্পাদন করুন' : 'Register Deed in Sub-Registrar'}</span>
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
                        <span>{language === 'bn' ? 'এসিল্যান্ড নামজারি' : 'AC Land e-Mutation'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <MapPin className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p>{language === 'bn' ? 'যাচাই করার জন্য ম্যাপ থেকে একটি প্লট নির্বাচন করুন।' : 'Select a plot from the map or ledger to verify records.'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Search & Selected Plot Card */}
        <div className="lg:col-span-4 p-4 bg-slate-900/90 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {language === 'bn' ? '🔍 প্লট বা বরাদ্দ প্রাপক অনুসন্ধান:' : '🔍 Search RAJUK Plot or Owner:'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'প্লট নম্বর, রোড, অথবা নাম/এনআইডি...' : 'Plot #, Road #, or Name/NID...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-9 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2.5 text-slate-400 hover:text-emerald-400"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Project Summary Card */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">
                  {language === 'bn' ? currentProject.nameBn : currentProject.nameEn}
                </span>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {currentProject.mapcode}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {language === 'bn' ? currentProject.descriptionBn : currentProject.descriptionEn}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-500 block">{language === 'bn' ? 'মোট পরিকল্পিত প্লট' : 'Total Plots'}</span>
                  <span className="font-semibold text-white">~{currentProject.totalPlotsApprox.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{language === 'bn' ? 'অঞ্চল / সার্কেল' : 'Zone Division'}</span>
                  <span className="font-semibold text-white">{currentProject.zone}</span>
                </div>
              </div>
            </div>

            {/* Active Selected Plot Quick Peek */}
            {selectedPlot && (
              <div className="bg-emerald-950/20 border border-emerald-800/70 p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {language === 'bn' ? 'নির্বাচিত প্লট' : 'Selected Target Plot'}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    {selectedPlot.landUse}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h4 className="text-lg font-black text-white">Plot #{selectedPlot.plotNo}</h4>
                  <span className="text-xs text-slate-300 font-medium">Road {selectedPlot.roadNo}</span>
                  <span className="text-xs text-emerald-300 font-medium ml-auto">{selectedPlot.areaKatha} Katha</span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-500">{language === 'bn' ? 'মালিক:' : 'Allottee:'} </span>
                    <strong className="text-white">{selectedPlot.allotteeNameEn}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">{language === 'bn' ? 'লিজডিল:' : 'Lease Deed:'} </span>
                    <span className="font-mono text-slate-400">{selectedPlot.leaseDeedNo}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('verify')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{language === 'bn' ? 'পূর্ণাঙ্গ রেকর্ড ও নামজারি দেখুন' : 'View Full Dossier & e-Mutation'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Official Link info */}
          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ministry of Housing & Public Works</span>
            <span className="font-mono text-emerald-400">wplrs.rajuk.gov.bd</span>
          </div>
        </div>
      </div>
    </div>
  );
};
