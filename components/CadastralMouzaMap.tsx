'use client';

import React, { useState, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Crosshair,
  Lock,
  Layers,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  X,
  FileText,
  Activity,
  Maximize2
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { KhatianRecord } from '@/types';

interface CadastralMouzaMapProps {
  className?: string;
  onPlotSelect?: (plotId: string) => void;
  showSubtitle?: boolean;
}

type MapMode = 'blueprint' | 'satellite' | 'hybrid';

export const CadastralMouzaMap: React.FC<CadastralMouzaMapProps> = ({
  className = '',
  onPlotSelect,
  showSubtitle = true,
}) => {
  const {
    khatians,
    selectedPlotId,
    setSelectedPlotId,
    language,
  } = useLandApp();

  // View Mode: Blueprint (Cadastral SVG) | Google Satellite | Hybrid View
  const [mapMode, setMapMode] = useState<MapMode>('blueprint');

  // Layer Visibility
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Zoom Controls
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredPlot, setHoveredPlot] = useState<KhatianRecord | null>(null);

  // Gemini AI Intelligence state
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  const selectedPlot = useMemo(() => {
    return khatians.find((k) => k.id === selectedPlotId) || khatians[0];
  }, [khatians, selectedPlotId]);

  const handlePlotClick = (plotId: string) => {
    setSelectedPlotId(plotId);
    if (onPlotSelect) {
      onPlotSelect(plotId);
    }
  };

  // Google Maps Satellite URL for active plot
  const googleSatelliteUrl = useMemo(() => {
    const lat = selectedPlot?.lat || 23.8465;
    const lng = selectedPlot?.lng || 90.2585;
    return `https://www.google.com/maps?q=${lat},${lng}&t=k&z=17&output=embed`;
  }, [selectedPlot]);

  // Google Maps direct external link
  const googleMapsExternalUrl = useMemo(() => {
    const lat = selectedPlot?.lat || 23.8465;
    const lng = selectedPlot?.lng || 90.2585;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }, [selectedPlot]);

  // Trigger Google Gemini Land Due Diligence
  const runGeminiDueDiligence = async () => {
    if (!selectedPlot) return;
    setIsAiLoading(true);
    setShowAiModal(true);
    setAiReport(null);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plot: selectedPlot,
          language
        })
      });

      const data = await res.json();
      if (data.success && data.report) {
        setAiReport(data.report);
      } else {
        setAiReport('Failed to generate Google Gemini report. Please try again.');
      }
    } catch (err: any) {
      console.error('Gemini call error:', err);
      setAiReport('Network error contacting Google Gemini API. Fallback intelligence is active.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const getParcelStyle = (plot: KhatianRecord) => {
    const isSelected = selectedPlot?.id === plot.id;
    const isHovered = hoveredPlot?.id === plot.id;

    if (plot.isMortgaged || plot.hasCourtCase || plot.isAcquired) {
      return {
        fill: mapMode === 'hybrid' ? 'rgba(89, 28, 28, 0.45)' : '#591c1c',
        fillOpacity: mapMode === 'hybrid' ? 0.6 : 0.85,
        stroke: isSelected ? '#d4a657' : '#f87171',
        strokeWidth: isSelected ? 3.5 : isHovered ? 2.5 : 1.8,
        strokeDasharray: isSelected ? '6,3' : 'none',
        textColor: '#f4f4f5',
        subTextColor: '#a1a1aa',
        lockedColor: '#f87171',
      };
    }

    if (plot.lockedAreaDecimals > 0) {
      return {
        fill: mapMode === 'hybrid' ? 'rgba(120, 53, 15, 0.45)' : '#78350f',
        fillOpacity: mapMode === 'hybrid' ? 0.6 : 0.85,
        stroke: isSelected ? '#d4a657' : '#fbbf24',
        strokeWidth: isSelected ? 3.5 : isHovered ? 2.5 : 1.8,
        strokeDasharray: isSelected ? '6,3' : 'none',
        textColor: '#f4f4f5',
        subTextColor: '#a1a1aa',
        lockedColor: '#fbbf24',
      };
    }

    // Clean parcel (green)
    return {
      fill: mapMode === 'hybrid' ? 'rgba(27, 67, 50, 0.40)' : '#1b4332',
      fillOpacity: mapMode === 'hybrid' ? 0.55 : 0.85,
      stroke: isSelected ? '#d4a657' : '#4ade80',
      strokeWidth: isSelected ? 3.5 : isHovered ? 2.8 : 2.2,
      strokeDasharray: isSelected ? '6,3' : '4,3',
      textColor: '#f4f4f5',
      subTextColor: '#a1a1aa',
      lockedColor: '#4ade80',
    };
  };

  return (
    <div
      className={`bg-[#121215] rounded-md p-4 sm:p-5 border border-[#27272a] shadow-xs flex flex-col relative overflow-hidden font-sans ${className}`}
    >
      {/* ── Top Canvas Bar: Mouza Tag + View Mode Toggle + Layer Checkboxes + Zoom Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#27272a] text-xs text-[#a1a1aa]">
        {/* Left: Mouza Badge with Live Pulsing Green Dot */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
          </span>
          <span className="font-mono text-[#f4f4f5] font-semibold text-xs tracking-tight">
            JL-42 &amp; JL-18 • Savar &amp; Ashulia Mouza
          </span>
        </div>

        {/* View Mode Switcher: Blueprint | Google Satellite | Hybrid View */}
        <div className="flex items-center bg-[#18181b] p-0.5 rounded-md border border-[#27272a]">
          <button
            type="button"
            onClick={() => setMapMode('blueprint')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-all cursor-pointer ${
              mapMode === 'blueprint'
                ? 'bg-[#27272a] text-[#f4f4f5] font-semibold shadow-xs'
                : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
            }`}
          >
            Blueprint
          </button>
          <button
            type="button"
            onClick={() => setMapMode('satellite')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              mapMode === 'satellite'
                ? 'bg-[#27272a] text-[#4ade80] font-semibold shadow-xs'
                : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
            Google Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapMode('hybrid')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-all cursor-pointer ${
              mapMode === 'hybrid'
                ? 'bg-[#27272a] text-[#d4a657] font-semibold shadow-xs'
                : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
            }`}
          >
            Hybrid View
          </button>
        </div>

        {/* Layer Visibility Toggles (active in Blueprint and Hybrid) */}
        {mapMode !== 'satellite' && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#f4f4f5] hover:text-[#d4a657] transition-colors">
              <input
                type="checkbox"
                checked={showRoads}
                onChange={(e) => setShowRoads(e.target.checked)}
                className="rounded-sm border-[#27272a] bg-[#18181b] text-[#d4a657] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              Roads
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#f4f4f5] hover:text-[#d4a657] transition-colors">
              <input
                type="checkbox"
                checked={showRivers}
                onChange={(e) => setShowRivers(e.target.checked)}
                className="rounded-sm border-[#27272a] bg-[#18181b] text-[#d4a657] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              River
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#f4f4f5] hover:text-[#d4a657] transition-colors">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="rounded-sm border-[#27272a] bg-[#18181b] text-[#d4a657] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              Labels
            </label>
          </div>
        )}

        {/* Right: Zoom In, Percentage, Zoom Out, Reset */}
        <div className="flex items-center gap-1 bg-[#18181b] px-1.5 py-1 rounded-md border border-[#27272a]">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.15, 1.8))}
            className="p-1 hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#f4f4f5] rounded-sm transition-colors cursor-pointer focus:outline-none"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-[#a1a1aa] px-1.5 tabular-nums">
            {(zoomLevel * 100).toFixed(0)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.15, 0.75))}
            className="p-1 hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#f4f4f5] rounded-sm transition-colors cursor-pointer focus:outline-none"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-1 hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#f4f4f5] rounded-sm transition-colors cursor-pointer focus:outline-none"
            title="Reset Zoom"
            aria-label="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Real Geodetic & Environmental Telemetry Strip ── */}
      <div className="mt-2.5 p-2 bg-[#18181b]/80 border border-[#27272a] rounded-md flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#d4a657]">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[#f4f4f5] font-semibold">Dag #{selectedPlot.dagNo}</span>
            <span className="text-[#a1a1aa]">({selectedPlot.mouza})</span>
          </div>

          <div className="flex items-center gap-1 text-[#a1a1aa]">
            <Crosshair className="w-3 h-3 text-[#38bdf8]" />
            <span>
              {selectedPlot.lat?.toFixed(4) || '23.8465'}°N, {selectedPlot.lng?.toFixed(4) || '90.2585'}°E
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[#a1a1aa]">
            <span className="text-[#71717a]">Elev:</span>
            <span className="text-[#f4f4f5] font-semibold">{selectedPlot.elevationMeters || 7.8}m</span>
            <span className="text-[#4ade80]">({selectedPlot.floodRisk || 'Low'} Flood Risk)</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[#a1a1aa]">
            <span className="text-[#71717a]">Soil:</span>
            <span className="text-[#f4f4f5]">{selectedPlot.soilType || 'Red Clay (Madhupur Tract)'}</span>
          </div>
        </div>

        {/* Action Buttons: Open in Google Maps & Gemini AI Due Diligence */}
        <div className="flex items-center gap-2">
          <a
            href={googleMapsExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#27272a] hover:bg-[#3f3f46] text-[#f4f4f5] text-[10px] transition-colors"
            title="Open real coordinates on Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 text-[#d4a657]" />
          </a>

          <button
            type="button"
            onClick={runGeminiDueDiligence}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#d4a657] hover:bg-[#c39545] text-[#121215] font-semibold text-[10px] transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3 h-3" />
            <span>Google Gemini AI</span>
          </button>
        </div>
      </div>

      {/* ── Map Canvas Container ── */}
      <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] rounded-md overflow-hidden mt-2.5 border border-[#27272a] flex items-center justify-center bg-[#09090b]">
        {/* Top-Right Compass Rose Pill */}
        <div className="absolute top-3 right-3 z-20 flex flex-col items-center bg-[#18181b]/95 backdrop-blur-md px-2.5 py-1.5 rounded-md border border-[#27272a] text-[#a1a1aa] pointer-events-none select-none">
          <Compass className="w-4 h-4 text-[#d4a657]" />
          <span className="text-[9px] font-mono font-bold text-[#f4f4f5] mt-0.5">
            N (উত্তর)
          </span>
        </div>

        {/* Bottom-Left Geodetic Coordinates Readout */}
        <div className="absolute bottom-3 left-3 z-20 font-mono text-[10px] text-[#a1a1aa] bg-[#18181b]/95 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#27272a] select-none flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-[#d4a657]" />
          <span>
            {selectedPlot.lat?.toFixed(4) || '23.8465'}°N, {selectedPlot.lng?.toFixed(4) || '90.2585'}°E • WGS84
          </span>
          <span className="text-[#3f3f46]">|</span>
          <span className="text-[#71717a]">RF 1:3960</span>
          {mapMode !== 'blueprint' && (
            <>
              <span className="text-[#3f3f46]">|</span>
              <span className="text-[#4ade80] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                Google Earth Live
              </span>
            </>
          )}
        </div>

        {/* 1. SATELLITE IFRAME (Active in 'satellite' and 'hybrid' modes) */}
        {(mapMode === 'satellite' || mapMode === 'hybrid') && (
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <iframe
              key={`google-sat-${selectedPlot?.id}`}
              src={googleSatelliteUrl}
              title={`Google Maps Satellite View for Dag #${selectedPlot?.dagNo}`}
              className="w-full h-full border-0 filter brightness-95 contrast-105"
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}

        {/* 2. SVG VECTOR CADASTRAL CANVAS (Active in 'blueprint' and 'hybrid' modes) */}
        {mapMode !== 'satellite' && (
          <div
            className={`w-full h-full transition-transform duration-200 flex items-center justify-center z-10 ${
              mapMode === 'hybrid' ? 'pointer-events-auto' : ''
            }`}
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              viewBox="0 0 600 450"
              className="w-full h-full select-none cursor-crosshair"
            >
              <defs>
                {/* Cadastral Blueprint Dot/Dash Grid */}
                <pattern
                  id="cadastralBlueprintGridCompact"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="0.6"
                    strokeDasharray="2,2"
                  />
                </pattern>
              </defs>

              {/* Base Surface Grid (only in Blueprint mode) */}
              {mapMode === 'blueprint' && (
                <rect
                  width="600"
                  height="450"
                  fill="url(#cadastralBlueprintGridCompact)"
                />
              )}

              {/* River & Waterbody Buffer (Bangshi River Tributary) */}
              {showRivers && (
                <g className="transition-opacity duration-200">
                  <path
                    d="M 10 40 Q 150 70 240 30 T 450 60 T 590 30 L 590 0 L 0 0 Z"
                    fill={mapMode === 'hybrid' ? 'rgba(3, 105, 161, 0.45)' : '#0369a1'}
                    fillOpacity={mapMode === 'hybrid' ? 0.6 : 0.85}
                  />
                  <text
                    x="310"
                    y="22"
                    fill="#38bdf8"
                    fontSize="10"
                    fontFamily="monospace, sans-serif"
                    fontWeight="bold"
                    opacity="0.95"
                  >
                    ~ Bangshi River Tributary ~
                  </text>
                </g>
              )}

              {/* Road / Regional Highway Line (Dhaka-Ashulia Regional Highway N5) */}
              {showRoads && (
                <g className="transition-opacity duration-200">
                  <path
                    d="M 50 420 Q 250 390 400 410 T 580 430"
                    fill="none"
                    stroke={mapMode === 'hybrid' ? '#fbbf24' : '#3f3f46'}
                    strokeWidth="6"
                    strokeDasharray="10,5"
                    strokeOpacity={mapMode === 'hybrid' ? 0.8 : 1}
                  />
                  <text
                    x="180"
                    y="425"
                    fill={mapMode === 'hybrid' ? '#f4f4f5' : '#a1a1aa'}
                    fontSize="9.5"
                    fontFamily="monospace, sans-serif"
                    fontWeight="bold"
                  >
                    Dhaka-Ashulia Regional Highway (N5)
                  </text>
                </g>
              )}

              {/* Interactive Cadastral Parcels (4 Plots) */}
              {khatians.map((plot) => {
                if (!plot.mapPolygon) return null;
                const style = getParcelStyle(plot);
                const isSelected = selectedPlot?.id === plot.id;
                const isHovered = hoveredPlot?.id === plot.id;

                return (
                  <g
                    key={plot.id}
                    onClick={() => handlePlotClick(plot.id)}
                    onMouseEnter={() => setHoveredPlot(plot)}
                    onMouseLeave={() => setHoveredPlot(null)}
                    className="cursor-pointer transition-all duration-150"
                  >
                    <polygon
                      points={plot.mapPolygon.points}
                      fill={style.fill}
                      fillOpacity={style.fillOpacity}
                      stroke={style.stroke}
                      strokeWidth={style.strokeWidth}
                      strokeDasharray={style.strokeDasharray}
                      className="transition-all hover:filter hover:brightness-125"
                    />

                    {/* Plot Labels */}
                    {showLabels && (
                      <>
                        <text
                          x={plot.mapPolygon.center[0]}
                          y={plot.mapPolygon.center[1] - 8}
                          fill={style.textColor}
                          fontSize="11.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="pointer-events-none drop-shadow-md font-mono"
                        >
                          Dag #{plot.dagNo}
                        </text>
                        <text
                          x={plot.mapPolygon.center[0]}
                          y={plot.mapPolygon.center[1] + 8}
                          fill={style.subTextColor}
                          fontSize="9.5"
                          textAnchor="middle"
                          className="pointer-events-none drop-shadow font-mono"
                        >
                          {plot.totalAreaDecimals.toFixed(1)} Dec
                        </text>
                      </>
                    )}

                    {/* Escrow Lock Indicator Tag */}
                    {showLabels && plot.lockedAreaDecimals > 0 && (
                      <text
                        x={plot.mapPolygon.center[0]}
                        y={plot.mapPolygon.center[1] + 22}
                        fill={style.lockedColor}
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
        )}

        {/* Hover Tooltip Overlay */}
        {hoveredPlot && (
          <div className="absolute top-3 left-3 bg-[#121215]/95 text-[#f4f4f5] p-3 rounded-md border border-[#27272a] shadow-elevated text-xs space-y-1 backdrop-blur-md pointer-events-none animate-fade-in max-w-xs z-30 font-sans">
            <div className="font-bold text-[#d4a657] flex items-center justify-between">
              <span>
                Dag #{hoveredPlot.dagNo} ({hoveredPlot.mouza})
              </span>
              <span className="font-mono text-[10px] text-[#a1a1aa]">
                {hoveredPlot.khatianNo}
              </span>
            </div>
            <div className="text-[11px] text-[#a1a1aa]">
              Owner: <strong className="text-[#f4f4f5]">{hoveredPlot.ownerName}</strong>
            </div>
            <div className="text-[11px] text-[#a1a1aa] font-mono">
              Area: {hoveredPlot.totalAreaDecimals.toFixed(2)} Dec (Available:{' '}
              {(hoveredPlot.totalAreaDecimals - hoveredPlot.lockedAreaDecimals).toFixed(2)} Dec)
            </div>
            <div className="text-[10px] text-[#38bdf8] font-mono">
              GPS: {hoveredPlot.lat || '23.8465'}°N, {hoveredPlot.lng || '90.2585'}°E
            </div>
            <div className="text-[10px] text-[#4ade80] font-semibold pt-0.5">
              Click parcel to resolve in Sub-Registry form!
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Cadastral Status Ribbon ── */}
      <div className="mt-3 pt-3 border-t border-[#27272a] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#a1a1aa]">
        <span>
          Real-Time Sync: Deed sealing automatically locks decimals on the cadastral canvas.
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[#4ade80]">
            Google Maps Satellite: Online
          </span>
          <span className="text-[#fbbf24] font-medium">
            {khatians.length} of {khatians.length} Plots Visible
          </span>
        </div>
      </div>

      {/* ── Google Gemini Land Due Diligence Modal ── */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121215] border border-[#27272a] rounded-md max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#27272a] flex items-center justify-between bg-[#18181b]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-sm bg-[#d4a657]/10 border border-[#d4a657]/30 flex items-center justify-center text-[#d4a657]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f4f4f5] flex items-center gap-2">
                    Google Gemini Land Due Diligence Report
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20 rounded-sm">
                      Live Telemetry
                    </span>
                  </h3>
                  <p className="text-xs text-[#a1a1aa] font-mono">
                    Dag #{selectedPlot.dagNo} • {selectedPlot.mouza} Mouza • {selectedPlot.lat}°N, {selectedPlot.lng}°E
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="p-1 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#27272a] rounded-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-[#f4f4f5] leading-relaxed">
              {isAiLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="w-7 h-7 text-[#d4a657] animate-spin" />
                  <div className="font-mono text-sm text-[#f4f4f5]">
                    Querying Google Gemini (gemini-3.5-flash-lite)...
                  </div>
                  <div className="text-xs text-[#a1a1aa] max-w-sm">
                    Synthesizing cadastral survey records (CS/SA/RS/BS), WGS84 GPS coords, soil strength, and flood elevation.
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert prose-xs max-w-none space-y-3">
                  <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-md grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div>
                      <div className="text-[#71717a]">WGS84 GPS:</div>
                      <div className="text-[#f4f4f5] font-semibold">{selectedPlot.lat}°N, {selectedPlot.lng}°E</div>
                    </div>
                    <div>
                      <div className="text-[#71717a]">Elevation:</div>
                      <div className="text-[#f4f4f5] font-semibold">{selectedPlot.elevationMeters || 7.8}m AMSL</div>
                    </div>
                    <div>
                      <div className="text-[#71717a]">Soil Type:</div>
                      <div className="text-[#f4f4f5] font-semibold">{selectedPlot.soilType || 'Red Clay'}</div>
                    </div>
                    <div>
                      <div className="text-[#71717a]">Registry Status:</div>
                      <div className={selectedPlot.isMortgaged || selectedPlot.hasCourtCase ? 'text-[#f87171] font-semibold' : 'text-[#4ade80] font-semibold'}>
                        {selectedPlot.isMortgaged ? 'MORTGAGED' : selectedPlot.hasCourtCase ? 'INJUNCTION' : 'VERIFIED CLEAN'}
                      </div>
                    </div>
                  </div>

                  <div className="whitespace-pre-line text-[#d4d4d8] font-sans leading-relaxed bg-[#151518] p-4 rounded-md border border-[#27272a]">
                    {aiReport}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#27272a] bg-[#18181b] flex items-center justify-between text-xs font-mono">
              <span className="text-[#71717a] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#d4a657]" />
                Powered by Google Gemini 3.5 Flash-Lite &amp; LandTech-LA-135
              </span>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-3 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-[#f4f4f5] rounded-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
