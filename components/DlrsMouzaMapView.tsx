'use client';

import React, { useState } from 'react';
import { 
  Map, 
  Layers, 
  Info, 
  ShieldCheck, 
  Building2, 
  User, 
  Lock, 
  Scale, 
  ArrowRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Crosshair,
  ExternalLink
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { KhatianRecord } from '@/types';

export const DlrsMouzaMapView: React.FC = () => {
  const { 
    khatians, 
    selectedPlotId, 
    setSelectedPlotId, 
    setActiveRole, 
    language 
  } = useLandApp();

  const [hoveredPlot, setHoveredPlot] = useState<KhatianRecord | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedPlot = khatians.find(k => k.id === selectedPlotId) || khatians[0];

  const getParcelColor = (plot: KhatianRecord) => {
    if (plot.isMortgaged || plot.hasCourtCase || plot.isAcquired) {
      return {
        fill: 'rgba(225, 29, 72, 0.45)',
        stroke: '#e11d48',
        statusText: 'Crimson Red: Blocked (Mortgage / Court Stay / DC Notice)',
        statusClass: 'text-rose-700 bg-rose-50 border-rose-200'
      };
    }
    if (plot.lockedAreaDecimals > 0) {
      return {
        fill: 'rgba(245, 158, 11, 0.50)',
        stroke: '#d97706',
        statusText: 'Amber Orange: Partial Decimals Locked in Pending e-Mutation',
        statusClass: 'text-amber-800 bg-amber-50 border-amber-200'
      };
    }
    return {
      fill: 'rgba(5, 150, 105, 0.45)',
      stroke: '#059669',
      statusText: 'Emerald Green: Clean Title (Ready for Sale)',
      statusClass: 'text-emerald-800 bg-emerald-50 border-emerald-200'
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-800/60 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-600/30 mb-2">
              <Map className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'Cadastral GIS Engine (DLRS)' : 'ডিএলআরএস ক্যাডাস্ট্রাল জিআইএস ইঞ্জিন'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'en' 
                ? 'Savar & Ashulia Digital Mouza Map (DLRS Cadastral GIS Viewer)' 
                : 'সাভার ও আশুলিয়া ডিজিটাল ক্যাডাস্ট্রাল মৌজা নকশা (ডিএলআরএস)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {language === 'en'
                ? 'Interactive CAD/GIS cadastral parcels dynamically color-coded by real-time title status. Click any plot to inspect or register sales.'
                : 'লাইভ অবস্থার ভিত্তিতে রঙের পরিবর্তনশীল ক্যাডাস্ট্রাল প্লট। দাগে ক্লিক করে তৎক্ষণাৎ স্বত্ব দেখুন বা সাব-রেজিস্ট্রিতে বিক্রয় প্রক্রিয়া শুরু করুন।'}
            </p>
          </div>

          {/* Color Legend */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs space-y-1.5 shrink-0">
            <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wider block">
              {language === 'en' ? 'Live Cadastral Legend:' : 'ম্যাপ সংকেত:'}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400 shadow-sm" />
              <span className="text-[11px] text-emerald-200">{language === 'en' ? 'Clean Title (Ready for Sale)' : 'নির্ভেজাল (বিক্রয়যোগ্য)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400 shadow-sm" />
              <span className="text-[11px] text-amber-200">{language === 'en' ? 'Partial Decimals Locked in Mutation' : 'মিউটেশনে জমি লককৃত'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-400 shadow-sm" />
              <span className="text-[11px] text-rose-200">{language === 'en' ? 'Blocked (Bank / Court Stay)' : 'স্থগিত (ব্যাংক/আদালত)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive SVG Map (8 Cols) & Parcel Inspector (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Cadastral Map Canvas */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-5 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col">
          {/* Top GIS Toolbar */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-emerald-400 font-bold">
                Cadastral Sheet: Savar & Ashulia (JL-42 & JL-18)
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] text-slate-400 px-1.5">
                {(zoomLevel * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[4/3] bg-slate-950/90 rounded-2xl overflow-hidden mt-3 border border-slate-800/80 flex items-center justify-center">
            {/* Compass Rose */}
            <div className="absolute top-4 right-4 z-20 flex flex-col items-center bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-slate-400 pointer-events-none">
              <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
              <span className="text-[9px] font-mono font-bold text-slate-300 mt-0.5">N (উত্তর)</span>
            </div>

            {/* Coordinates Crosshair Indicator */}
            <div className="absolute bottom-3 left-4 z-20 font-mono text-[10px] text-slate-500 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
              23°50&apos;42&quot;N, 90°15&apos;28&quot;E • WGS84
            </div>

            {/* Scalable SVG Canvas */}
            <div 
              className="w-full h-full transition-transform duration-300 flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <svg
                viewBox="0 0 600 450"
                className="w-full h-full select-none cursor-crosshair"
              >
                <defs>
                  <pattern id="cadastralGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="2,2" />
                  </pattern>
                  {/* Subtle river / waterbody */}
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Grid Background */}
                <rect width="600" height="450" fill="url(#cadastralGrid)" />

                {/* Bangshi River Tributary */}
                <path
                  d="M 10 40 Q 150 70 240 30 T 450 60 T 590 30 L 590 0 L 0 0 Z"
                  fill="url(#riverGrad)"
                />
                <text x="320" y="25" fill="#38bdf8" fontSize="10" fontFamily="sans-serif" fontWeight="bold" opacity="0.8">
                  ~ Bangshi River Tributary (বংশী নদী শাখা) ~
                </text>

                {/* Road / Highway Line */}
                <path
                  d="M 50 420 Q 250 390 400 410 T 580 430"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="5"
                  strokeDasharray="8,4"
                />
                <text x="210" y="425" fill="#cbd5e1" fontSize="9.5" fontFamily="sans-serif" fontWeight="bold">
                  Dhaka-Aricha Regional Highway (ঢাকা-আরিচা মহাসড়ক)
                </text>

                {/* Clickable Land Parcel Polygons */}
                {khatians.map(plot => {
                  if (!plot.mapPolygon) return null;
                  const colors = getParcelColor(plot);
                  const isSelected = selectedPlot?.id === plot.id;
                  const isHovered = hoveredPlot?.id === plot.id;

                  return (
                    <g
                      key={plot.id}
                      onClick={() => setSelectedPlotId(plot.id)}
                      onMouseEnter={() => setHoveredPlot(plot)}
                      onMouseLeave={() => setHoveredPlot(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      <polygon
                        points={plot.mapPolygon.points}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth={isSelected ? 4 : isHovered ? 3 : 2}
                        strokeDasharray={isSelected ? '6,3' : 'none'}
                        className="transition-all hover:filter hover:brightness-125"
                      />
                      
                      {/* Centered Plot Label */}
                      <text
                        x={plot.mapPolygon.center[0]}
                        y={plot.mapPolygon.center[1] - 8}
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow-md font-mono"
                      >
                        Dag #{plot.dagNo}
                      </text>
                      <text
                        x={plot.mapPolygon.center[0]}
                        y={plot.mapPolygon.center[1] + 8}
                        fill="#cbd5e1"
                        fontSize="9.5"
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow font-mono"
                      >
                        {plot.totalAreaDecimals.toFixed(1)} Dec
                      </text>
                      {plot.lockedAreaDecimals > 0 && (
                        <text
                          x={plot.mapPolygon.center[0]}
                          y={plot.mapPolygon.center[1] + 20}
                          fill="#fbbf24"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="pointer-events-none font-mono"
                        >
                          [{plot.lockedAreaDecimals.toFixed(1)} Locked]
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover Tooltip Overlay */}
            {hoveredPlot && (
              <div className="absolute top-4 left-4 bg-slate-900/95 text-white p-3.5 rounded-2xl border border-slate-700 shadow-2xl text-xs space-y-1.5 backdrop-blur-md pointer-events-none animate-fade-in max-w-xs z-30">
                <div className="font-extrabold text-emerald-400 flex items-center justify-between">
                  <span>Dag #{hoveredPlot.dagNo} ({hoveredPlot.mouza})</span>
                  <span className="font-mono text-[10px] text-slate-400">{hoveredPlot.khatianNo}</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Owner: <strong>{hoveredPlot.ownerName}</strong>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Total: {hoveredPlot.totalAreaDecimals.toFixed(2)} Dec (Available: {(hoveredPlot.totalAreaDecimals - hoveredPlot.lockedAreaDecimals).toFixed(2)} Dec)
                </div>
                <div className="text-[10px] text-amber-300 font-semibold pt-0.5">
                  Click polygon to select for Sub-Registry or Citizen check!
                </div>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            {language === 'en'
              ? 'Real-Time Cadastral Sync: Whenever a deed is registered, the parcel immediately reflects yellow/orange escrow locks.'
              : 'লাইভ ক্যাডাস্ট্রাল সমন্বয়: সাব-রেজিস্ট্রিতে জমি বিক্রি হওয়া মাত্রই ম্যাপের দাগে সাথে সাথে হলুদ/কমলা রঙের লক প্রদর্শিত হয়।'}
          </p>
        </div>

        {/* Selected Parcel Inspector Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-ambient border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {language === 'en' ? 'Selected Cadastral Parcel' : 'নির্বাচিত দাগের তথ্য কার্ড'}
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Dag #{selectedPlot.dagNo}
              </span>
            </div>

            {/* Status Pill */}
            {(() => {
              const colors = getParcelColor(selectedPlot);
              return (
                <div className={`p-3 rounded-xl border text-xs font-bold ${colors.statusClass}`}>
                  {colors.statusText}
                </div>
              );
            })()}

            {/* Parcel Details */}
            <div className="space-y-2 text-xs text-slate-700 divide-y divide-slate-100">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{language === 'en' ? 'Khatian Number:' : 'খতিয়ান নম্বর:'}</span>
                <span className="font-mono font-black text-slate-900">{selectedPlot.khatianNo}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{language === 'en' ? 'Recorded Owner:' : 'মালিকের নাম:'}</span>
                <span className="font-bold text-slate-900">{selectedPlot.ownerName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{language === 'en' ? 'Owner Dummy NID:' : 'মালিকের এনআইডি:'}</span>
                <span className="font-mono text-slate-800 text-[11px] tabular-nums">{selectedPlot.ownerNid}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{language === 'en' ? 'Total Cadastral Area:' : 'মোট জমির পরিমাণ:'}</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">{selectedPlot.totalAreaDecimals.toFixed(2)} Decimals</span>
              </div>
              <div className="flex justify-between py-1 text-amber-800 font-bold">
                <span>{language === 'en' ? 'Locked in e-Mutation:' : 'মিউটেশনে লককৃত জমি:'}</span>
                <span className="font-mono tabular-nums">{selectedPlot.lockedAreaDecimals.toFixed(2)} Decimals</span>
              </div>
              <div className="flex justify-between py-1.5 text-emerald-800 font-black text-sm">
                <span>{language === 'en' ? 'Available Unlocked:' : 'অবমুক্ত বিক্রয়যোগ্য:'}</span>
                <span className="font-mono tabular-nums">
                  {Math.max(0, selectedPlot.totalAreaDecimals - selectedPlot.lockedAreaDecimals).toFixed(2)} Decimals
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <button
                onClick={() => setActiveRole('sub_registrar')}
                className="w-full flex items-center justify-center gap-2 py-3 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-colors"
              >
                <span>{language === 'en' ? 'Proceed to Register Deed for this Plot' : 'এই দাগের জন্য দলিল সম্পাদন করুন'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveRole('citizen')}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                {language === 'en' ? 'Inspect Title Chain in Citizen Portal' : 'নাগরিক পোর্টালে পরচার ইতিহাস দেখুন'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
