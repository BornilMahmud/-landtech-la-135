'use client';

import React, { useState } from 'react';
import {
  DistrictData,
  DivisionData,
} from '@/data/bangladeshMapData';
import { getDistrictLandData } from '@/data/landtechData';
import {
  MapPin,
  Activity,
  Calculator,
  Building2,
  Info,
  ChevronRight,
  Compass,
} from 'lucide-react';

interface HeroMapDossierProps {
  isBn: boolean;
  theme?: "dark" | "light";
  selectedDistrict: DistrictData | null;
  selectedDivision: DivisionData | null;
  onSelectDistrictById: (id: string) => void;
  onOpenDistrictsMap?: () => void;
  onOpenMouzaSheet?: () => void;
}

export const HeroMapDossier: React.FC<HeroMapDossierProps> = ({
  isBn,
  theme = "light",
  selectedDistrict,
  selectedDivision,
  onOpenDistrictsMap,
  onOpenMouzaSheet,
}) => {
  const [calcKatha, setCalcKatha] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'calculator'>('intelligence');
  const isLight = theme === "light";

  if (!selectedDistrict && !selectedDivision) {
    return (
      <div className={`w-full min-h-[380px] rounded-[16px] p-8 flex flex-col items-center justify-center text-center border shadow-xs transition-colors ${
        isLight ? "bg-white border-[#E4E4E7] text-[#09090B]" : "bg-[#121215] border-[#27272A] text-[#FAFAFA]"
      }`}>
        <div className="w-10 h-10 rounded-[10px] bg-zinc-100 dark:bg-[#18181B] border border-zinc-200 dark:border-[#27272A] flex items-center justify-center text-amber-500 mb-3">
          <MapPin className="w-5 h-5" aria-hidden="true" />
        </div>
        <h3 className={`font-display text-lg sm:text-xl font-semibold ${isLight ? "text-[#09090B]" : "text-white"}`}>
          {isBn ? "মানচিত্রে যেকোনো এলাকা নির্বাচন করুন" : "Select Any Area on the Map"}
        </h3>
        <p className={`text-xs max-w-sm mt-1.5 leading-relaxed ${isLight ? "text-[#71717A]" : "text-[#A1A1AA]"}`}>
          {isBn
            ? "৬৪টি জেলা বা ৮টি বিভাগের যেকোনো অংশে ক্লিক করে তাৎক্ষণিক ক্যাডাস্ট্রাল ও জমি মূল্যের বিশ্লেষণ দেখুন।"
            : "Click on any of the 64 districts or 8 divisions to inspect live cadastral, zoning, and valuation intelligence."}
        </p>
      </div>
    );
  }

  // Active district metadata
  const district = selectedDistrict;
  const landMeta = district ? getDistrictLandData(district.id) : null;

  // Valuation calculation
  const unitRateBDT = landMeta ? landMeta.avgPricePerKathaBDT : 2500000;
  const totalValuationBDT = calcKatha * unitRateBDT;
  const formattedValuation =
    totalValuationBDT >= 10000000
      ? `৳${(totalValuationBDT / 10000000).toFixed(2)} ${isBn ? "কোটি" : "Crore"}`
      : `৳${(totalValuationBDT / 100000).toFixed(1)} ${isBn ? "লাখ" : "Lakh"}`;

  return (
    <div className={`w-full rounded-[16px] border shadow-xs p-5 sm:p-6 flex flex-col transition-all ${
      isLight ? "bg-white border-[#E4E4E7] text-[#09090B]" : "bg-[#121215] border-[#27272A] text-[#FAFAFA]"
    }`}>
      <div>
        
        {/* Top Header & Badges */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${isLight ? "border-[#E4E4E7]" : "border-[#27272A]"}`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-mono border ${
                isLight ? "bg-zinc-100 border-[#E4E4E7] text-zinc-700" : "bg-[#18181B] border-[#27272A] text-[#A1A1AA]"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isBn ? "লাইভ ক্যাডাস্ট্রাল প্রোফাইল" : "Live Land Dossier"}
              </span>
              <span className={`text-xs font-mono ${isLight ? "text-zinc-500" : "text-[#71717A]"}`}>
                {district?.divisionName || selectedDivision?.name}
              </span>
            </div>

            <h2 className={`text-xl sm:text-2xl font-display font-bold mt-1.5 tracking-tight ${isLight ? "text-[#09090B]" : "text-[#FAFAFA]"}`}>
              {district
                ? (isBn ? district.bnName : district.name)
                : (isBn ? selectedDivision?.bnName : selectedDivision?.name)}
            </h2>

            <p className={`text-xs mt-0.5 ${isLight ? "text-zinc-500" : "text-[#71717A]"}`}>
              {district
                ? (isBn ? `${district.bnDivisionName} বিভাগীয় প্রশাসনিক অঞ্চল` : `${district.divisionName} Division Administrative Region`)
                : (isBn ? "বিভাগীয় সদর ও আঞ্চলিক তথ্য" : "Administrative Division Overview")}
            </p>
          </div>

          {/* Viability Pill */}
          {landMeta && (
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-[#71717A] block tracking-wider">
                {isBn ? "ভূমি সূচক" : "Viability Index"}
              </span>
              <span className={`inline-block mt-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-[6px] ${
                isLight ? "bg-[#09090B] text-white" : "bg-white text-[#09090B]"
              }`}>
                {landMeta.viabilityScore} / 100
              </span>
            </div>
          )}
        </div>

        {/* Tab switchers: Segmented Control (BMS style) */}
        <div className={`flex items-center gap-1 my-4 p-1 rounded-[10px] border ${
          isLight ? "bg-zinc-100 border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('intelligence')}
            className={`flex-1 py-1.5 rounded-[8px] text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'intelligence'
                ? isLight
                  ? 'bg-white text-[#09090B] shadow-xs border border-zinc-200 font-semibold'
                  : 'bg-[#27272A] text-white shadow-xs border border-zinc-700 font-semibold'
                : isLight ? 'text-zinc-600 hover:text-zinc-950' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
            <span>{isBn ? "আঞ্চলিক উপাত্ত" : "Spatial Metrics"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-1.5 rounded-[8px] text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'calculator'
                ? isLight
                  ? 'bg-white text-[#09090B] shadow-xs border border-zinc-200 font-semibold'
                  : 'bg-[#27272A] text-white shadow-xs border border-zinc-700 font-semibold'
                : isLight ? 'text-zinc-600 hover:text-zinc-950' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>{isBn ? "প্লট মূল্যায়ন" : "Valuation Calc"}</span>
          </button>
        </div>

        {/* TAB 1: INTELLIGENCE METRICS */}
        {activeTab === 'intelligence' && (
          <div className="space-y-3">
            {/* Stats grid — 4 cols on md+ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className={`p-3 rounded-[10px] border ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className={`text-[10px] block font-mono font-medium uppercase tracking-wider ${isLight ? "text-zinc-500" : "text-[#71717A]"}`}>
                  {isBn ? "গড় মূল্য / কাঠা" : "Avg Rate / Katha"}
                </span>
                <span className="text-sm sm:text-base font-bold font-mono text-amber-600 dark:text-amber-400 block mt-0.5">
                  ৳{(unitRateBDT / 100000).toFixed(1)}L
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5 font-medium">
                  ↗ +{landMeta?.growthRateYoY || 12.5}% YoY
                </span>
              </div>

              <div className={`p-3 rounded-[10px] border ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className={`text-[10px] block font-mono font-medium uppercase tracking-wider ${isLight ? "text-zinc-500" : "text-[#71717A]"}`}>
                  {isBn ? "ক্যাডাস্ট্রাল জরিপ" : "Cadastral Survey"}
                </span>
                <span className={`text-xs sm:text-sm font-semibold block mt-0.5 ${isLight ? "text-[#09090B]" : "text-white"}`}>
                  {landMeta?.cadastralSurvey || "City Survey Verified"}
                </span>
                <span className={`text-[10px] font-mono block mt-0.5 text-zinc-500 dark:text-[#71717A]`}>
                  {isBn ? "ই-নামজারি সক্রিয়" : "e-Mutation Enabled"}
                </span>
              </div>

              <div className={`p-3 rounded-[10px] border ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className={`text-[10px] block font-mono font-medium uppercase tracking-wider ${isLight ? "text-zinc-500" : "text-[#71717A]"}`}>
                  {isBn ? "জোনিং শ্রেণিবিভাগ" : "Primary Zoning"}
                </span>
                <span className={`text-xs sm:text-sm font-semibold block mt-0.5 ${isLight ? "text-[#09090B]" : "text-white"}`}>
                  {landMeta?.zoning || "Commercial CBD"}
                </span>
                <span className={`text-[10px] font-mono block mt-0.5 text-zinc-500 dark:text-[#71717A]`}>
                  {isBn ? "মাস্টারপ্ল্যান অনুবর্তী" : "Masterplan Compliant"}
                </span>
              </div>

              <div className={`p-3 rounded-[10px] border ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className={`text-[10px] block font-mono font-medium uppercase tracking-wider ${isLight ? "text-zinc-500" : "text-[#71717A]"}`}>
                  {isBn ? "বন্যা ও পরিবেশ ঝুঁকি" : "Flood Vulnerability"}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {landMeta?.floodRisk || "Minimal (Zone 1)"}
                </span>
                <span className={`text-[10px] font-mono block mt-0.5 text-zinc-500 dark:text-[#71717A]`}>
                  {isBn ? "উঁচু ভূপ্রকৃতি" : "Elevated Plain"}
                </span>
              </div>
            </div>

            {/* Key Infrastructure & Megaprojects */}
            <div className={`p-3.5 rounded-[10px] border text-xs ${
              isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
            }`}>
              <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${
                isLight ? "text-zinc-600" : "text-[#A1A1AA]"
              }`}>
                <Building2 className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                <span>{isBn ? "প্রধান অবকাঠামো ও মেগা সংযোগ" : "Key Infrastructure Corridors"}</span>
              </span>
              <p className={`text-xs font-normal leading-relaxed ${isLight ? "text-[#09090B]" : "text-[#FAFAFA]"}`}>
                {isBn ? landMeta?.bnKeyInfra : landMeta?.keyInfra}
              </p>
            </div>

            {/* Anomaly / Local Characteristic Alert */}
            {district && (
              <div className={`p-3 rounded-[10px] text-xs flex items-start gap-2.5 border ${
                isLight 
                  ? "bg-zinc-50 border-zinc-200 text-zinc-800" 
                  : "bg-[#18181B] border-[#27272A] text-[#FAFAFA]"
              }`}>
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" aria-hidden="true" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-semibold">
                    {isBn ? "আঞ্চলিক বৈশিষ্ট্য: " : "Regional Intelligence: "}
                  </span>
                  <span>{isBn ? district.bnAnomaly : district.anomaly}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PLOT VALUATION CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-3">
            <div className={`p-4 rounded-[10px] border text-xs space-y-3 ${
              isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
            }`}>
              <div>
                <label className={`text-[10px] uppercase font-mono font-medium tracking-wider block mb-1.5 ${isLight ? "text-zinc-500" : "text-[#71717A]"}`}>
                  {isBn ? "জমির পরিমাণ (কাঠা):" : "Plot Size in Katha:"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    step="0.5"
                    value={calcKatha}
                    onChange={(e) => setCalcKatha(Math.max(0.1, Number(e.target.value)))}
                    className={`flex-1 rounded-[8px] px-3 py-1.5 font-mono font-semibold text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-1 border ${
                      isLight ? "bg-white border-[#E4E4E7] text-[#09090B]" : "bg-[#121215] border-[#27272A] text-white"
                    }`}
                  />
                  <span className={`text-xs font-medium ${isLight ? "text-zinc-500" : "text-[#71717A]"}`}>
                    {isBn ? "কাঠা" : "Katha"}
                  </span>
                </div>
              </div>

              {/* Quick Size Presets */}
              <div className="flex items-center gap-1.5">
                {[3, 5, 10, 20].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCalcKatha(k)}
                    className={`px-3 py-1 rounded-[6px] text-xs font-mono font-medium border transition-all cursor-pointer ${
                      calcKatha === k
                        ? "bg-[#09090B] dark:bg-[#FAFAFA] border-transparent text-white dark:text-[#09090B] shadow-xs"
                        : isLight
                        ? "bg-white border-[#E4E4E7] text-zinc-700 hover:bg-zinc-100"
                        : "bg-[#121215] border-[#27272A] text-[#FAFAFA] hover:bg-[#27272A]"
                    }`}
                  >
                    {k} {isBn ? "কাঠা" : "Katha"}
                  </button>
                ))}
              </div>

              {/* Calculated Result Card */}
              <div className={`p-4 rounded-[10px] border ${
                isLight ? "bg-white border-zinc-200" : "bg-[#121215] border-[#27272A]"
              }`}>
                <span className="text-[10px] text-zinc-500 dark:text-[#71717A] uppercase font-mono font-medium tracking-wider block">
                  {isBn ? "আনুমানিক বাজার দর" : "Estimated Market Valuation"}
                </span>
                <span className={`text-2xl font-display font-bold block mt-0.5 ${isLight ? "text-[#09090B]" : "text-[#FAFAFA]"}`}>
                  {formattedValuation}
                </span>
                <span className={`text-[10px] font-mono block mt-0.5 ${isLight ? "text-zinc-500" : "text-[#71717A]"}`}>
                  {isBn
                    ? `প্রতি কাঠা গড় ৳${(unitRateBDT / 100000).toFixed(1)} লাখ হারে গণনাকৃত`
                    : `Based on ৳${(unitRateBDT / 100000).toFixed(1)} Lakh/Katha prevailing index`}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── ACTION BUTTONS (BMS 10px Roundness) ── */}
      <div className={`pt-4 mt-4 border-t flex flex-col sm:flex-row gap-2.5 ${isLight ? "border-[#E4E4E7]" : "border-[#27272A]"}`}>
        <button
          type="button"
          onClick={() => {
            if (onOpenDistrictsMap) onOpenDistrictsMap();
            else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
            isLight
              ? "bg-[#09090B] text-white hover:bg-zinc-800"
              : "bg-white text-[#09090B] hover:bg-zinc-100"
          }`}
        >
          <Activity className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isBn ? "৬৪ জেলা ইনটেলিজেন্স ড্যাশবোর্ড" : "Open 64-District Dashboard"}</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (onOpenMouzaSheet) onOpenMouzaSheet();
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer ${
            isLight
              ? "bg-white border-[#E4E4E7] text-[#09090B] hover:bg-zinc-100"
              : "bg-[#18181B] border-[#27272A] text-[#FAFAFA] hover:bg-[#27272A]"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
          <span>{isBn ? "ক্যাডাস্ট্রাল প্লট ও মৌজা দেখুন" : "Explore Cadastral Plots & Mouza"}</span>
        </button>
      </div>

    </div>
  );
};

export default HeroMapDossier;
