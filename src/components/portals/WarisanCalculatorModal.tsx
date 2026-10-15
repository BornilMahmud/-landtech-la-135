'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Trash2, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  HelpCircle,
  Building2 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { HeirRelationship, HeirMember } from '@/lib/types';
import { toDec, formatDec, toBanglaDigits } from '@/lib/crypto-utils';
import { t } from '@/lib/i18n';

interface HeirInputRow {
  id: string;
  relationship: HeirRelationship;
  nameEn: string;
  nameBn: string;
  dummyNid: string;
  phone: string;
}

export const WarisanCalculatorModal: React.FC = () => {
  const { 
    khatians, 
    citizens, 
    isWarisanModalOpen, 
    setIsWarisanModalOpen, 
    language,
    calculateWarisanDistribution,
    createWarisanEstateCase,
    approveWarisanMutation,
    warisanCases,
    selectedWarisanCase,
    setSelectedWarisanCase,
    setActivePorcha 
  } = useLandRegistry();

  // Selected deceased estate Khatian
  const [selectedKhatianId, setSelectedKhatianId] = useState<string>(khatians[0]?.id || 'plot-1');
  const selectedKhatian = useMemo(() => {
    return khatians.find(k => k.id === selectedKhatianId) || khatians[0];
  }, [khatians, selectedKhatianId]);

  const deceasedCitizen = useMemo(() => {
    return citizens.find(c => c.id === selectedKhatian?.ownerId);
  }, [citizens, selectedKhatian?.ownerId]);

  // Family members list
  const [heirRows, setHeirRows] = useState<HeirInputRow[]>([
    {
      id: 'h-1',
      relationship: 'WIFE',
      nameEn: 'Mst. Rokeya Begum',
      nameBn: 'মোসাঃ রোকেয়া বেগম',
      dummyNid: 'DUMMY-NID-2026-9101',
      phone: '01711-000101',
    },
    {
      id: 'h-2',
      relationship: 'SON',
      nameEn: 'Tariqul Islam',
      nameBn: 'তারিকুল ইসলাম',
      dummyNid: 'DUMMY-NID-2026-9102',
      phone: '01711-000102',
    },
    {
      id: 'h-3',
      relationship: 'DAUGHTER',
      nameEn: 'Nasrin Akter',
      nameBn: 'নাসরিন আক্তার',
      dummyNid: 'DUMMY-NID-2026-9103',
      phone: '01711-000103',
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Live calculation of shares
  const calculatedHeirs: HeirMember[] = useMemo(() => {
    if (!selectedKhatian) return [];
    return calculateWarisanDistribution(selectedKhatian.totalAreaDecimals, heirRows);
  }, [selectedKhatian, heirRows, calculateWarisanDistribution]);

  // Total distributed decimals check
  const distributedTotal = calculatedHeirs.reduce((acc, h) => acc + (h.assignedDecimals || 0), 0);
  const estateTotal = selectedKhatian?.totalAreaDecimals || 0;
  const isExactMatch = Math.abs(toDec(estateTotal - distributedTotal)) < 0.01;

  if (!isWarisanModalOpen) return null;

  const handleAddHeir = () => {
    const nextIdx = heirRows.length + 1;
    const newRow: HeirInputRow = {
      id: `heir-row-${Date.now()}`,
      relationship: 'SON',
      nameEn: `Heir Member ${nextIdx}`,
      nameBn: `ওয়ারিশ সদস্য ${toBanglaDigits(nextIdx)}`,
      dummyNid: `DUMMY-NID-2026-${9100 + nextIdx}`,
      phone: `01711-${String(nextIdx).padStart(6, '0')}`,
    };
    setHeirRows([...heirRows, newRow]);
  };

  const handleRemoveHeir = (id: string) => {
    if (heirRows.length <= 1) return;
    setHeirRows(heirRows.filter(h => h.id !== id));
  };

  const handleUpdateHeir = (id: string, field: keyof HeirInputRow, value: any) => {
    setHeirRows(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  // Preset loaders for quick judge demo
  const loadPreset = (preset: 'STANDARD' | 'TWO_DAUGHTERS' | 'SON_MOTHER') => {
    if (preset === 'STANDARD') {
      setHeirRows([
        { id: 'h-1', relationship: 'WIFE', nameEn: 'Mst. Rokeya Begum', nameBn: 'মোসাঃ রোকেয়া বেগম', dummyNid: 'DUMMY-NID-2026-9101', phone: '01711-000101' },
        { id: 'h-2', relationship: 'SON', nameEn: 'Tariqul Islam', nameBn: 'তারিকুল ইসলাম', dummyNid: 'DUMMY-NID-2026-9102', phone: '01711-000102' },
        { id: 'h-3', relationship: 'DAUGHTER', nameEn: 'Nasrin Akter', nameBn: 'নাসরিন আক্তার', dummyNid: 'DUMMY-NID-2026-9103', phone: '01711-000103' },
      ]);
    } else if (preset === 'TWO_DAUGHTERS') {
      setHeirRows([
        { id: 'h-1', relationship: 'WIFE', nameEn: 'Amena Bibi', nameBn: 'আমেনা বিবি', dummyNid: 'DUMMY-NID-2026-9104', phone: '01711-000104' },
        { id: 'h-2', relationship: 'DAUGHTER', nameEn: 'Fatema Khatun', nameBn: 'ফাতেমা খাতুন', dummyNid: 'DUMMY-NID-2026-9105', phone: '01711-000105' },
        { id: 'h-3', relationship: 'DAUGHTER', nameEn: 'Khadija Akter', nameBn: 'খাদিজা আক্তার', dummyNid: 'DUMMY-NID-2026-9106', phone: '01711-000106' },
      ]);
    } else if (preset === 'SON_MOTHER') {
      setHeirRows([
        { id: 'h-1', relationship: 'MOTHER', nameEn: 'Zohra Khatun', nameBn: 'জোহরা খাতুন', dummyNid: 'DUMMY-NID-2026-9107', phone: '01711-000107' },
        { id: 'h-2', relationship: 'WIFE', nameEn: 'Salma Begum', nameBn: 'সালমা বেগম', dummyNid: 'DUMMY-NID-2026-9108', phone: '01711-000108' },
        { id: 'h-3', relationship: 'SON', nameEn: 'Tanvir Hossain', nameBn: 'তানভীর হোসেন', dummyNid: 'DUMMY-NID-2026-9109', phone: '01711-000109' },
      ]);
    }
  };

  const handleGenerateMutation = async () => {
    setIsProcessing(true);
    setSuccessMessage(null);

    // 1. Create or ensure estate case exists
    const estateCase = createWarisanEstateCase(selectedKhatian.id, heirRows);

    // 2. Approve & execute succession Jomabhag splitting
    await approveWarisanMutation(estateCase.id);

    setIsProcessing(false);
    setSuccessMessage(
      language === 'en'
        ? `Success! Intestate Warisan succession finalized. ${calculatedHeirs.length} individual split Khatians generated & Gov-SMS dispatched to each heir!`
        : `সফল! উত্তরাধিকার নামজারি সম্পন্ন। ${calculatedHeirs.length} জন ওয়ারিশের নামে পৃথক জমাভাগ খতিয়ান সৃজিত ও স্বয়ংক্রিয় এসএমএস প্রেরিত!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 border border-emerald-600/40 flex items-center justify-center text-amber-300 shadow-md">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  {t(language, 'warisanTitle')}
                </h3>
                <span className="bg-emerald-700/60 text-emerald-200 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                  Faraidh Math Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {t(language, 'warisanSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWarisanModalOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Quick Preset Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-mono font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>1-Click Intestate Demo Presets:</span>
            </span>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => loadPreset('STANDARD')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 font-bold border border-slate-200 shadow-sm transition-all text-[11px]"
              >
                1 Wife + 1 Son + 1 Daughter
              </button>
              <button
                onClick={() => loadPreset('TWO_DAUGHTERS')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 font-bold border border-slate-200 shadow-sm transition-all text-[11px]"
              >
                1 Wife + 2 Daughters (No Sons)
              </button>
              <button
                onClick={() => loadPreset('SON_MOTHER')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 font-bold border border-slate-200 shadow-sm transition-all text-[11px]"
              >
                Mother + Wife + 1 Son
              </button>
            </div>
          </div>

          {/* Top Grid: Deceased Parcel Selector & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                {t(language, 'deceasedKhatianSelect')}
              </label>
              <select
                value={selectedKhatianId}
                onChange={(e) => setSelectedKhatianId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              >
                {khatians.map((k) => (
                  <option key={k.id} value={k.id}>
                    Khatian #{k.khatianNo} (Dag #{k.dagNo}) • {citizens.find(c => c.id === k.ownerId)?.nameEn} • {formatDec(k.totalAreaDecimals)} Dec
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                  {t(language, 'totalEstateArea')}
                </span>
                <span className="font-mono text-xl font-black text-emerald-950">
                  {formatDec(estateTotal)} Decimals
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Deceased Landowner:
                </span>
                <span className="font-bold text-slate-900 text-xs">
                  {deceasedCitizen ? `Late ${deceasedCitizen.nameEn}` : `Deceased Owner`}
                </span>
              </div>
            </div>
          </div>

          {/* Heirs Builder Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Recorded Legal Heirs (ওয়ারিশান সদস্যবৃন্দ):</span>
              </h4>

              <button
                onClick={handleAddHeir}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t(language, 'addHeirBtn')}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {heirRows.map((heir, idx) => {
                const calculated = calculatedHeirs[idx];

                return (
                  <div 
                    key={heir.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-sm space-y-2.5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                      {/* Relation Selector (3 cols) */}
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block sm:hidden">
                          Relationship:
                        </label>
                        <select
                          value={heir.relationship}
                          onChange={(e) => handleUpdateHeir(heir.id, 'relationship', e.target.value as HeirRelationship)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-800 font-mono"
                        >
                          <option value="WIFE">Wife (স্ত্রী)</option>
                          <option value="HUSBAND">Husband (স্বামী)</option>
                          <option value="SON">Son (পুত্র)</option>
                          <option value="DAUGHTER">Daughter (কন্যা)</option>
                          <option value="MOTHER">Mother (মাতা)</option>
                          <option value="FATHER">Father (পিতা)</option>
                          <option value="BROTHER">Brother (সহোদর ভাই)</option>
                          <option value="SISTER">Sister (সহোদর বোন)</option>
                        </select>
                      </div>

                      {/* Name En (3 cols) */}
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={heir.nameEn}
                          onChange={(e) => handleUpdateHeir(heir.id, 'nameEn', e.target.value)}
                          placeholder="Full Name (English)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                        />
                      </div>

                      {/* NID (3 cols) */}
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={heir.dummyNid}
                          onChange={(e) => handleUpdateHeir(heir.id, 'dummyNid', e.target.value)}
                          placeholder="DUMMY-NID-2026-XXXX"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
                        />
                      </div>

                      {/* Phone & Delete (3 cols) */}
                      <div className="sm:col-span-3 flex items-center gap-1.5">
                        <input
                          type="text"
                          value={heir.phone}
                          onChange={(e) => handleUpdateHeir(heir.id, 'phone', e.target.value)}
                          placeholder="Phone (017...)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
                        />
                        <button
                          onClick={() => handleRemoveHeir(heir.id)}
                          disabled={heirRows.length <= 1}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30"
                          title="Remove Heir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Calculated Share Pill */}
                    {calculated && (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
                        <span className="text-[11px] font-bold text-purple-900 bg-purple-100/80 px-2 py-0.5 rounded-md">
                          {calculated.shareLabelBn}
                        </span>

                        <span className="text-slate-600 text-[11px]">
                          আনা/গণ্ডা: <strong className="text-slate-900">{calculated.anaShareStr}</strong>
                        </span>

                        <span className="text-slate-600 text-[11px]">
                          অনুপাত: <strong className="text-slate-900">{(calculated.calculatedShareFraction * 100).toFixed(2)}%</strong>
                        </span>

                        <span className="text-emerald-900 font-black text-xs sm:text-sm bg-emerald-100/90 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                          {formatDec(calculated.assignedDecimals)} Dec
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Distribution Validation Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase font-bold">Intestate Estate Conservation:</span>
              <span className={`font-black ${isExactMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                {formatDec(distributedTotal)} / {formatDec(estateTotal)} Decimals ({isExactMatch ? '100% Balanced' : 'Partial'})
              </span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
              {calculatedHeirs.map((h, idx) => (
                <div
                  key={idx}
                  style={{ width: `${h.calculatedShareFraction * 100}%` }}
                  className={`${
                    idx % 3 === 0 ? 'bg-emerald-500' : idx % 3 === 1 ? 'bg-teal-400' : 'bg-cyan-500'
                  } h-full border-r border-slate-900`}
                  title={`${h.nameEn}: ${formatDec(h.assignedDecimals)} Dec`}
                />
              ))}
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-700 flex items-start gap-3 shadow-md animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-black text-xs text-emerald-300 uppercase">
                  Warisan Mutation Finalized
                </h4>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {/* 1-Click Action Button */}
          <button
            onClick={handleGenerateMutation}
            disabled={isProcessing || !isExactMatch}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 disabled:opacity-50 text-white rounded-2xl font-black text-sm shadow-card hover:shadow-glow transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t(language, 'generateWarisanMutationBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
