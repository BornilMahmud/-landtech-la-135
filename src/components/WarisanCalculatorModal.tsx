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
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Building2 
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { HeirRelationship, HeirMember } from '@/types';
import { toDec, formatDec, toBanglaDigits } from '@/lib/crypto-utils';

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
    isWarisanModalOpen, 
    setIsWarisanModalOpen, 
    language,
    calculateWarisanDistribution,
    createWarisanEstateCase,
    approveWarisanMutation,
    warisanCases,
    selectedWarisanCase,
    setSelectedWarisanCase,
  } = useLandApp();

  // Selected deceased estate Khatian
  const [selectedKhatianId, setSelectedKhatianId] = useState<string>(khatians[0]?.id || 'plot-1');
  const selectedKhatian = useMemo(() => {
    return khatians.find(k => k.id === selectedKhatianId) || khatians[0];
  }, [khatians, selectedKhatianId]);

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
        { id: 'h-1', relationship: 'MOTHER', nameEn: 'Mst. Rabeya Begum', nameBn: 'মোসাঃ রাবেয়া বেগম', dummyNid: 'DUMMY-NID-2026-9107', phone: '01711-000107' },
        { id: 'h-2', relationship: 'SON', nameEn: 'Enamul Haque', nameBn: 'এনামুল হক', dummyNid: 'DUMMY-NID-2026-9108', phone: '01711-000108' },
      ]);
    }
  };

  const handleCreateAndApprove = async () => {
    if (!selectedKhatian) return;
    setIsProcessing(true);
    setSuccessMessage(null);

    const newCase = createWarisanEstateCase(selectedKhatian.id, heirRows);
    await new Promise(r => setTimeout(r, 600));

    await approveWarisanMutation(newCase.id);
    setIsProcessing(false);
    setSuccessMessage(language === 'en' 
      ? `Success! Jomabhag Split executed. ${calculatedHeirs.length} individual Khatians issued to heirs with zero-touch automation.`
      : `সফল! জমাভাগ বণ্টন সম্পন্ন। ওয়ারিশদের অনুকূলে ${calculatedHeirs.length}টি পৃথক খতিয়ান সৃজিত হয়েছে।`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#09090b]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#09090b] rounded-xl shadow-2xl border border-[#27272a] overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#121215] text-[#f4f4f5] px-6 py-4 flex items-center justify-between border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#231d13] text-[#d4a657] border border-[#4a3a1f] flex items-center justify-center">
              <Calculator className="w-4 h-4 text-[#d4a657]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-display font-medium text-[#f4f4f5] tracking-tight">
                {language === 'en' ? 'Warisan (Farayez) Inheritance Calculator & Succession Engine' : 'ওয়ারিশান (ফারায়েজ) সম্পত্তি বণ্টন ও উত্তরাধিকার ইঞ্জিন'}
              </h2>
              <p className="text-[11px] text-[#a1a1aa] font-mono">
                {language === 'en' ? 'Automated Islamic Farayez Math • Real-time Anna/Ganda Shares • Zero-Touch Split' : 'স্বয়ংক্রিয় ফারায়েজ বণ্টন • আনা-গণ্ডা হিসাব • ডিজিটাল খতিয়ান সৃজন'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWarisanModalOpen(false)}
            className="text-[#a1a1aa] hover:text-[#f4f4f5] p-1.5 rounded-md hover:bg-[#1b1b1f] transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#f4f4f5] bg-[#121215]">
          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 bg-[#142318] border border-[#1e4a27] rounded-lg text-[#22c55e] text-xs flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Top Controls: Target Khatian & Presets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#09090b] rounded-lg border border-[#27272a] space-y-2">
              <label className="text-[11px] font-mono uppercase text-[#a1a1aa] block">
                {language === 'en' ? '1. Select Deceased Estate Khatian:' : '১. মরহুমের মূল খতিয়ান নির্বাচন করুন:'}
              </label>
              <select
                value={selectedKhatianId}
                onChange={(e) => setSelectedKhatianId(e.target.value)}
                className="w-full bg-[#1b1b1f] border border-[#27272a] text-[#f4f4f5] rounded-md px-3 py-2 text-xs font-mono focus:border-[#d4a657] focus:outline-none"
              >
                {khatians.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.khatianNo} (Dag #{k.dagNo}) • {k.ownerName} • {formatDec(k.totalAreaDecimals)} Dec
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between text-[11px] text-[#a1a1aa] pt-1">
                <span>{language === 'en' ? 'Estate Area:' : 'মোট জমি:'} <strong className="text-[#d4a657] font-mono">{formatDec(selectedKhatian?.totalAreaDecimals || 0)} Dec</strong></span>
                <span>{language === 'en' ? 'Deceased Owner:' : 'মরহুম মালিক:'} <strong className="text-[#f4f4f5]">{selectedKhatian?.ownerName}</strong></span>
              </div>
            </div>

            <div className="p-4 bg-[#09090b] rounded-lg border border-[#27272a] space-y-2">
              <label className="text-[11px] font-mono uppercase text-[#a1a1aa] block">
                {language === 'en' ? 'Quick Farayez Case Presets:' : 'দ্রুত ফারায়েজ কেস নির্বাচন:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset('STANDARD')}
                  className="px-2.5 py-2 bg-[#1b1b1f] hover:bg-[#27272a] text-[#f4f4f5] rounded-md text-[11px] font-mono border border-[#27272a] transition-colors text-center"
                >
                  {language === 'en' ? 'Wife, Son, Dtr' : 'স্ত্রী, পুত্র, কন্যা'}
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('TWO_DAUGHTERS')}
                  className="px-2.5 py-2 bg-[#1b1b1f] hover:bg-[#27272a] text-[#f4f4f5] rounded-md text-[11px] font-mono border border-[#27272a] transition-colors text-center"
                >
                  {language === 'en' ? 'Wife, 2 Dtrs' : 'স্ত্রী, ২ কন্যা'}
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('SON_MOTHER')}
                  className="px-2.5 py-2 bg-[#1b1b1f] hover:bg-[#27272a] text-[#f4f4f5] rounded-md text-[11px] font-mono border border-[#27272a] transition-colors text-center"
                >
                  {language === 'en' ? 'Mother, Son' : 'মাতা, পুত্র'}
                </button>
              </div>
              <p className="text-[10px] text-[#71717a]">
                {language === 'en' ? 'Applies standard Qur’anic Quranic shares and residuary (Asaba) distribution.' : 'কুরআনিক অংশ ও আসাবা বণ্টন নীতি প্রযোজ্য।'}
              </p>
            </div>
          </div>

          {/* Heirs Input Form Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#d4a657]" />
                <span className="text-xs font-mono font-medium text-[#f4f4f5] uppercase">
                  {language === 'en' ? '2. Legal Heirs (ওয়ারিশগণ):' : '২. আইনগত ওয়ারিশগণ:'}
                </span>
                <span className="text-[10px] bg-[#231d13] text-[#d4a657] border border-[#4a3a1f] px-2 py-0.5 rounded-sm font-mono">
                  {heirRows.length} Heirs
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddHeir}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#1b1b1f] hover:bg-[#27272a] text-[#d4a657] rounded-md text-xs font-mono border border-[#27272a] transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'en' ? '+ Add Heir' : '+ ওয়ারিশ যোগ'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {heirRows.map((heir, idx) => (
                <div 
                  key={heir.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-[#09090b] p-3 rounded-lg border border-[#27272a] items-center text-xs"
                >
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-[#71717a] block sm:hidden">Relationship</label>
                    <select
                      value={heir.relationship}
                      onChange={(e) => handleUpdateHeir(heir.id, 'relationship', e.target.value as HeirRelationship)}
                      className="w-full bg-[#1b1b1f] border border-[#27272a] text-[#f4f4f5] rounded-md px-2.5 py-1.5 text-xs font-mono focus:border-[#d4a657] focus:outline-none"
                    >
                      <option value="WIFE">Wife / স্ত্রী</option>
                      <option value="HUSBAND">Husband / স্বামী</option>
                      <option value="SON">Son / পুত্র (২ ভাগ)</option>
                      <option value="DAUGHTER">Daughter / কন্যা (১ ভাগ)</option>
                      <option value="MOTHER">Mother / মাতা</option>
                      <option value="FATHER">Father / পিতা</option>
                      <option value="BROTHER">Brother / ভাই</option>
                      <option value="SISTER">Sister / বোন</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-[#71717a] block sm:hidden">Name</label>
                    <input
                      type="text"
                      value={language === 'en' ? heir.nameEn : heir.nameBn}
                      onChange={(e) => handleUpdateHeir(heir.id, language === 'en' ? 'nameEn' : 'nameBn', e.target.value)}
                      placeholder="Name"
                      className="w-full bg-[#1b1b1f] border border-[#27272a] text-[#f4f4f5] rounded-md px-2.5 py-1.5 text-xs focus:border-[#d4a657] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-[#71717a] block sm:hidden">Dummy NID</label>
                    <input
                      type="text"
                      value={heir.dummyNid}
                      onChange={(e) => handleUpdateHeir(heir.id, 'dummyNid', e.target.value)}
                      className="w-full bg-[#1b1b1f] border border-[#27272a] text-[#a1a1aa] rounded-md px-2.5 py-1.5 text-xs font-mono focus:border-[#d4a657] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-[#71717a] block sm:hidden">Phone (SMS)</label>
                    <input
                      type="text"
                      value={heir.phone}
                      onChange={(e) => handleUpdateHeir(heir.id, 'phone', e.target.value)}
                      className="w-full bg-[#1b1b1f] border border-[#27272a] text-[#a1a1aa] rounded-md px-2.5 py-1.5 text-xs font-mono focus:border-[#d4a657] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      disabled={heirRows.length <= 1}
                      onClick={() => handleRemoveHeir(heir.id)}
                      className="p-1.5 text-[#71717a] hover:text-[#ef4444] disabled:opacity-30 transition-colors"
                      title="Remove Heir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Calculated Farayez Distribution Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-[#f4f4f5] uppercase">
                {language === 'en' ? '3. Live Farayez Distribution (ফারায়েজ অংশ ও হিস্যা):' : '৩. স্বয়ংক্রিয় ফারায়েজ বণ্টন হিসাব:'}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#a1a1aa]">Total:</span>
                <span className={`font-medium ${isExactMatch ? 'text-[#22c55e]' : 'text-[#f59e0b]'}`}>
                  {formatDec(distributedTotal)} / {formatDec(estateTotal)} Dec
                </span>
                {isExactMatch ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                )}
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#27272a]">
              <table className="w-full text-left text-xs text-[#f4f4f5] font-sans">
                <thead className="bg-[#09090b] text-[#a1a1aa] font-mono text-[11px] border-b border-[#27272a]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">{language === 'en' ? 'Heir' : 'ওয়ারিশ'}</th>
                    <th className="py-2.5 px-3">{language === 'en' ? 'Relation' : 'সম্পর্ক'}</th>
                    <th className="py-2.5 px-3">{language === 'en' ? 'Fraction Share' : 'অংশ'}</th>
                    <th className="py-2.5 px-3">{language === 'en' ? 'Traditional Share' : 'আনা-গণ্ডা'}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'en' ? 'Assigned Area' : 'বরাদ্দকৃত জমি'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a]/60 bg-[#121215]">
                  {calculatedHeirs.map((h, i) => (
                    <tr key={h.id} className="hover:bg-[#1b1b1f]/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[#71717a]">{i + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-[#f4f4f5]">{language === 'en' ? h.nameEn : h.nameBn}</div>
                        <div className="font-mono text-[10px] text-[#71717a]">{h.dummyNid}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#d4a657]">{h.relationship}</td>
                      <td className="py-2.5 px-3 font-mono text-[#a1a1aa]">{h.shareLabelBn}</td>
                      <td className="py-2.5 px-3 font-mono text-[#22c55e]">{h.anaShareStr || '—'}</td>
                      <td className="py-2.5 px-3 font-mono font-medium text-right text-[#d4a657]">
                        {formatDec(h.assignedDecimals)} Dec
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#121215] px-6 py-4 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#a1a1aa] font-mono">
            {language === 'en'
              ? 'Clicking below will execute automated Jomabhag Khatian splitting and dispatch Gov-SMS notifications.'
              : 'নিচে ক্লিক করলে স্বয়ংক্রিয় জমাভাগ বিভাজন ও এসএমএস পাঠানো হবে।'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsWarisanModalOpen(false)}
              className="px-4 py-2 bg-[#1b1b1f] hover:bg-[#27272a] text-[#f4f4f5] rounded-md text-xs font-mono border border-[#27272a] transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'বাতিল'}
            </button>
            <button
              type="button"
              disabled={isProcessing || !isExactMatch}
              onClick={handleCreateAndApprove}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-[#d4a657] hover:bg-[#c29547] text-[#09090b] font-medium text-xs rounded-md transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isProcessing
                  ? (language === 'en' ? 'Executing Jomabhag Split...' : 'জমাভাগ বিভাজন সম্পন্ন হচ্ছে...')
                  : (language === 'en' ? 'Execute Warisan Succession Split' : 'ওয়ারিশান জমাভাগ বিভাজন কার্যকর করুন')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
