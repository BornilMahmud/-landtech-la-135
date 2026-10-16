'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Landmark, 
  Copy, 
  Check 
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { generateSvgQrCode } from '@/lib/crypto';
import { SetuLandLogo } from './SetuLandLogo';

export const DigitalKhatianModal: React.FC = () => {
  const { activePorcha, setActivePorcha, language } = useLandApp();
  const [copiedHash, setCopiedHash] = useState(false);

  if (!activePorcha) return null;

  const { khatian, mutationId } = activePorcha;
  const qrSvg = generateSvgQrCode(`SETULAND:KHATIAN:${khatian.khatianNo}:${khatian.dagNo}:${khatian.ownerNid}`, 130);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(khatian.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#121215]/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#09090b] rounded-xl shadow-2xl border border-[#27272a] overflow-hidden max-h-[94vh] flex flex-col">
        {/* Modal Top Control Bar (Hidden on Print) */}
        <div className="no-print bg-[#121215] text-[#f4f4f5] px-6 py-3.5 flex items-center justify-between border-b border-[#27272a]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a657]" />
            <span className="text-xs font-mono tracking-wider uppercase text-[#f4f4f5]">
              {language === 'en' ? 'Partitioned Digital Khatian (Record of Rights)' : 'নতুন ডিজিটাল খতিয়ান (পর্চা) সনদ'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1f] hover:bg-[#242429] text-[#f4f4f5] rounded-md text-xs font-mono border border-[#27272a] transition-colors focus:outline-none"
            >
              <Printer className="w-3.5 h-3.5 text-[#A8A6A0]" />
              <span>{language === 'en' ? 'Print / Export' : 'পর্চা প্রিন্ট'}</span>
            </button>
            <button
              onClick={() => setActivePorcha(null)}
              className="text-[#A8A6A0] hover:text-[#f4f4f5] p-1.5 rounded-md hover:bg-[#1b1b1f] transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Khatian Body */}
        <div className="printable-document preview-watermark p-6 sm:p-8 overflow-y-auto space-y-6 text-[#f4f4f5] bg-[#121215]">
          {/* Header */}
          <div className="text-center border-b border-[#27272a] pb-5">
            <div className="flex justify-center mb-2">
              <SetuLandLogo size="md" showText={false} />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-light text-[#f4f4f5] uppercase tracking-tight">
              {language === 'en' ? "Government of the People's Republic of Bangladesh" : 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার'}
            </h2>
            <p className="text-xs font-sans text-[#a1a1aa] mt-0.5">
              {language === 'en' ? 'Directorate of Land Records & Surveys (DLRS) — AC Land Secretariat' : 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর এবং উপজেলা ভূমি প্রশাসন'}
            </p>
            <div className="inline-block mt-2 bg-[#231d13] text-[#d4a657] border border-[#4a3a1f] text-[11px] font-mono px-3 py-0.5 rounded-sm uppercase tracking-wider">
              {language === 'en' ? 'Record of Rights (Porcha) • Partitioned' : 'ডিজিটাল নামজারি খতিয়ান (স্বত্বলিপি পর্চা)'}
            </div>
          </div>

          {/* Location & Survey Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#09090b] p-3.5 rounded-lg border border-[#27272a] font-mono shadow-xs">
            <div>
              <span className="text-[#a1a1aa] block text-[10px] uppercase">{language === 'en' ? 'District:' : 'জেলা:'}</span>
              <span className="text-[#f4f4f5]">{khatian.district}</span>
            </div>
            <div>
              <span className="text-[#a1a1aa] block text-[10px] uppercase">{language === 'en' ? 'Upazila:' : 'উপজেলা:'}</span>
              <span className="text-[#f4f4f5]">{khatian.upazila}</span>
            </div>
            <div>
              <span className="text-[#a1a1aa] block text-[10px] uppercase">{language === 'en' ? 'Mouza & JL:' : 'মৌজা ও জেএল:'}</span>
              <span className="text-[#f4f4f5]">{khatian.mouza} (JL-42)</span>
            </div>
            <div>
              <span className="text-[#a1a1aa] block text-[10px] uppercase">{language === 'en' ? 'Survey:' : 'জরিপ শ্রেণি:'}</span>
              <span className="text-[#d4a657]">BS Survey</span>
            </div>
          </div>

          {/* Core Numbers Banner */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-[#09090b] rounded-lg border border-[#27272a] text-center font-mono shadow-xs">
            <div>
              <span className="text-[10px] uppercase text-[#a1a1aa] tracking-wider block">
                {language === 'en' ? 'Newly Partitioned Khatian:' : 'নতুন সৃজিত খতিয়ান নম্বর:'}
              </span>
              <span className="text-xl text-[#f4f4f5] tabular-nums block mt-0.5">
                {khatian.khatianNo}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#a1a1aa] tracking-wider block">
                {language === 'en' ? 'Cadastral Dag (Plot):' : 'দাগ নম্বর:'}
              </span>
              <span className="text-xl text-[#f4f4f5] tabular-nums block mt-0.5">
                #{khatian.dagNo}
              </span>
            </div>
          </div>

          {/* Owner Table */}
          <div className="border border-[#27272a] rounded-lg overflow-hidden text-xs shadow-xs">
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-[#E8E3DA]">
                <tr className="bg-[#09090b]">
                  <td className="p-3 font-mono text-[#a1a1aa] w-1/3">Proprietor Name:</td>
                  <td className="p-3 font-display text-sm text-[#f4f4f5]">{khatian.ownerName}</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[#a1a1aa]">Proprietor NID:</td>
                  <td className="p-3 font-mono text-[#f4f4f5]">{khatian.ownerNid}</td>
                </tr>
                <tr className="bg-[#09090b]">
                  <td className="p-3 font-mono text-[#a1a1aa]">Land Classification:</td>
                  <td className="p-3 font-mono text-[#f4f4f5]">{khatian.landClass}</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[#a1a1aa]">Mutated Decimals:</td>
                  <td className="p-3 font-mono text-sm text-[#d4a657] tabular-nums font-medium">
                    {khatian.totalAreaDecimals.toFixed(2)} Decimals
                  </td>
                </tr>
                <tr className="bg-[#09090b]">
                  <td className="p-3 font-mono text-[#a1a1aa]">e-Mutation Reference:</td>
                  <td className="p-3 font-mono text-[#f4f4f5]">{mutationId || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cryptographic Proof & QR */}
          <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#f4f4f5]">
                <ShieldCheck className="w-4 h-4 text-[#d4a657]" />
                <span>SHA-256 Digital Porcha Signature</span>
              </div>
              <p className="text-[11px] font-mono text-[#a1a1aa] break-all leading-tight">
                {khatian.sha256Hash}
              </p>
              <button
                onClick={handleCopyHash}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d4a657] hover:underline pt-0.5 focus:outline-none"
              >
                {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'Hash Copied to Clipboard' : 'Copy Hash'}</span>
              </button>
            </div>

            <div 
              className="shrink-0 flex flex-col items-center"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="no-print bg-[#09090b] px-6 py-4 border-t border-[#27272a] flex items-center justify-between">
          <span className="text-xs font-mono text-[#a1a1aa]">
            * Legally partition-sealed under State Acquisition &amp; Tenancy Act.
          </span>
          <button
            onClick={() => setActivePorcha(null)}
            className="px-4 py-2 bg-[#191817] hover:bg-[#242429] text-[#f4f4f5] font-sans text-xs font-medium rounded-md border border-[#27272a] transition-colors focus:outline-none shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
