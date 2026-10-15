'use client';

import React, { useState } from 'react';
import { 
  Map, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  Layers, 
  Info, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  ExternalLink 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { KhatianRecord } from '@/lib/types';
import { t } from '@/lib/i18n';
import { toDec, formatDec } from '@/lib/crypto-utils';

export const MouzaGisMap: React.FC<{ onSelectPlot?: (plot: KhatianRecord) => void }> = ({ onSelectPlot }) => {
  const { 
    khatians, 
    selectedPlotId, 
    setSelectedPlotId, 
    language,
    citizens 
  } = useLandRegistry();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredPlot, setHoveredPlot] = useState<KhatianRecord | null>(null);

  const selectedPlot = khatians.find(k => k.id === selectedPlotId) || khatians[0];

  const getParcelStyle = (plot: KhatianRecord) => {
    const isSelected = plot.id === selectedPlotId;
    if (plot.isMortgaged || plot.hasCourtCase || plot.isDcAcquisition) {
      return {
        fill: isSelected ? 'rgba(225, 29, 72, 0.65)' : 'rgba(225, 29, 72, 0.40)',
        stroke: '#e11d48',
        strokeWidth: isSelected ? 3 : 1.5,
        statusTextEn: 'Crimson Red: Blocked (Mortgage / Court Injunction / DC Acquisition)',
        statusTextBn: 'লাল সংকেত: অবরুদ্ধ (বন্ধক / আদালতের স্থগিতাদেশ / ডিসি অধিগ্রহণ)',
        badgeClass: 'text-rose-700 bg-rose-50 border-rose-200',
      };
    }
    if (plot.lockedAreaDecimals > 0) {
      return {
        fill: isSelected ? 'rgba(245, 158, 11, 0.65)' : 'rgba(245, 158, 11, 0.40)',
        stroke: '#d97706',
        strokeWidth: isSelected ? 3 : 1.5,
        statusTextEn: 'Amber Orange: Partial Decimals Locked in Pending e-Mutation',
        statusTextBn: 'হলুদ সংকেত: চলমান নামজারিতে আংশিক জমি লককৃত',
        badgeClass: 'text-amber-800 bg-amber-50 border-amber-200',
      };
    }
    if (plot.isSplitPlot) {
      return {
        fill: isSelected ? 'rgba(14, 165, 233, 0.65)' : 'rgba(14, 165, 233, 0.40)',
        stroke: '#0284c7',
        strokeWidth: isSelected ? 3 : 2,
        statusTextEn: 'Sky Blue: Jomabhag Split Sub-Plot (DLRS Synchronized)',
        statusTextBn: 'আকাশি সংকেত: জমাভাগ বাটা দাগ বিভাজন (ডিএলআরএস সমন্বিত)',
        badgeClass: 'text-sky-800 bg-sky-50 border-sky-200',
      };
    }
    return {
      fill: isSelected ? 'rgba(5, 150, 105, 0.65)' : 'rgba(5, 150, 105, 0.40)',
      stroke: '#059669',
      strokeWidth: isSelected ? 3 : 1.5,
      statusTextEn: 'Emerald Green: Clean Title (Ready for Sale)',
      statusTextBn: 'সবুজ সংকেত: নির্ভেজাল জমি (ক্রয়-বিক্রয়যোগ্য)',
      badgeClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    };
  };

  const handlePlotClick = (plot: KhatianRecord) => {
    setSelectedPlotId(plot.id);
    if (onSelectPlot) {
      onSelectPlot(plot);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-ambient overflow-hidden flex flex-col">
      {/* Map Header Toolbar */}
      <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Map className="w-4 h-4 text-emerald-400" />
          <span className="font-extrabold text-xs tracking-wide">
            {language === 'en' ? 'DLRS Cadastral Mouza Map (Savar & Ashulia GIS)' : 'ডিএলআরএস ক্যাডাস্ট্রাল মৌজা নকশা (সাভার ও আশুলিয়া জিআইএস)'}
          </span>
        </div>

        {/* Zoom & Pan Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
            className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-1.5 text-slate-400 font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area with GIS Coordinate Grid */}
      <div className="relative h-[340px] sm:h-[420px] bg-slate-950 overflow-hidden flex items-center justify-center bg-cadastral-grid select-none cursor-crosshair">
        {/* Compass Rose */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-center bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-[10px] font-mono text-slate-400 shadow-md">
          <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
          <span className="font-bold text-white mt-0.5">N</span>
        </div>

        {/* Dynamic Scale Indicator */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-2">
          <span>Cadastral Scale 1:1200</span>
          <div className="w-12 h-1 bg-emerald-500 rounded" />
          <span>50 Feet</span>
        </div>

        {/* Interactive SVG Group */}
        <div 
          className="transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg viewBox="0 0 620 500" width="600" height="420" className="drop-shadow-2xl">
            {/* Background CAD Parcel Outlines */}
            <path d="M 60,30 L 560,30 L 560,470 L 60,470 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 280,30 L 280,470" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 60,240 L 560,240" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Clickable Parcel Polygons */}
            {khatians.map((k) => {
              const style = getParcelStyle(k);
              const isSelected = k.id === selectedPlotId;
              const owner = citizens.find(c => c.id === k.ownerId);

              return (
                <g 
                  key={k.id}
                  onClick={() => handlePlotClick(k)}
                  onMouseEnter={() => setHoveredPlot(k)}
                  onMouseLeave={() => setHoveredPlot(null)}
                  className="cursor-pointer transition-all group"
                >
                  <path
                    d={k.svgPath}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    className="transition-all duration-200 group-hover:brightness-125"
                  />

                  {/* Dynamic GIS Split Divider Line and Badge if Jomabhag Split executed */}
                  {k.isSplitPlot && (
                    <g className="pointer-events-none">
                      <line
                        x1={k.labelX - 35}
                        y1={k.labelY - 18}
                        x2={k.labelX + 35}
                        y2={k.labelY + 18}
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                      />
                      <g transform={`translate(${k.labelX - 48}, ${k.labelY + 16})`}>
                        <rect width="96" height="15" rx="4" fill="#0284c7" fillOpacity="0.95" stroke="#7dd3fc" strokeWidth="1" />
                        <text x="48" y="11" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" className="font-mono">
                          {k.subDivisionLabel ? `Split: ${k.subDivisionLabel}` : `বাটা দাগ #${k.dagNo}`}
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Parcel Label */}
                  <text
                    x={k.labelX}
                    y={k.isSplitPlot ? k.labelY - 10 : k.labelY - 6}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono pointer-events-none drop-shadow-md"
                  >
                    Dag #{k.dagNo}
                  </text>
                  <text
                    x={k.labelX}
                    y={k.isSplitPlot ? k.labelY + 3 : k.labelY + 9}
                    fill="#cbd5e1"
                    fontSize="9.5"
                    textAnchor="middle"
                    className="font-mono pointer-events-none drop-shadow-md"
                  >
                    {formatDec(k.totalAreaDecimals)} Dec {k.lockedAreaDecimals > 0 ? `(${formatDec(k.lockedAreaDecimals)} Lock)` : ''}
                  </text>

                  {/* Pulsing center marker if selected */}
                  {isSelected && (
                    <circle cx={k.labelX} cy={k.labelY - 24} r="4" fill="#10b981" className="animate-ping" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover / Active Plot Floating Tooltip */}
        {(hoveredPlot || selectedPlot) && (
          <div className="absolute top-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-xs text-white shadow-2xl max-w-[280px] pointer-events-none space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1">
              <span className="font-mono font-bold text-emerald-400">
                Dag #{hoveredPlot ? hoveredPlot.dagNo : selectedPlot.dagNo} ({hoveredPlot ? hoveredPlot.khatianNo : selectedPlot.khatianNo})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {hoveredPlot ? hoveredPlot.mouzaEn : selectedPlot.mouzaEn} Mouza
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">{language === 'en' ? 'Owner: ' : 'মালিক: '}</span>
              <span className="font-bold text-white">
                {citizens.find(c => c.id === (hoveredPlot ? hoveredPlot.ownerId : selectedPlot.ownerId))?.nameEn}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">{language === 'en' ? 'Available:' : 'বিক্রয়যোগ্য:'}</span>
              <span className="text-emerald-300 font-bold">
                {formatDec(toDec(hoveredPlot ? hoveredPlot.totalAreaDecimals - hoveredPlot.lockedAreaDecimals : selectedPlot.totalAreaDecimals - selectedPlot.lockedAreaDecimals))} Dec
              </span>
            </div>
            <div className="text-[10px] font-mono pt-1 border-t border-slate-800">
              {language === 'en'
                ? getParcelStyle(hoveredPlot || selectedPlot).statusTextEn
                : getParcelStyle(hoveredPlot || selectedPlot).statusTextBn}
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="bg-slate-50 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
            <span className="font-medium text-slate-700">
              {language === 'en' ? 'Clean Title (Ready)' : 'নির্ভেজাল (বিক্রয়যোগ্য)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
            <span className="font-medium text-slate-700">
              {language === 'en' ? 'Partially Locked (e-Mutation)' : 'চলমান নামজারিতে লককৃত'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 shadow-sm" />
            <span className="font-medium text-slate-700">
              {language === 'en' ? 'Jomabhag Split (Sub-Plot)' : 'জমাভাগ বাটা দাগ (বিভাজিত)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
            <span className="font-medium text-slate-700">
              {language === 'en' ? 'Blocked (Mortgage / Court / DC)' : 'অবরুদ্ধ (বন্ধক / মামলা / ডিসি)'}
            </span>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          {language === 'en' ? 'Click parcel to inspect or draft deed' : 'দাগে ক্লিক করে স্বত্ব দেখুন বা দলিল সম্পাদন করুন'}
        </span>
      </div>
    </div>
  );
};
