'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Landmark, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { generateSvgQrCode } from '@/lib/crypto';
import { SetuLandLogo } from './SetuLandLogo';

export const DigitalDeedModal: React.FC = () => {
  const { 
    activeDeedReceipt, 
    setActiveDeedReceipt, 
    language, 
    setActiveRole 
  } = useLandApp();

  const [copiedHash, setCopiedHash] = useState(false);

  if (!activeDeedReceipt) return null;

  const qrSvg = generateSvgQrCode(`SETULAND:DEED:${activeDeedReceipt.deedNo}:${activeDeedReceipt.trackingId}`, 130);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(activeDeedReceipt.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#121215]/70 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#09090b] rounded-xl shadow-2xl border border-[#27272a] overflow-hidden max-h-[94vh] flex flex-col">
        {/* Modal Top Control Bar (Hidden on Print) */}
        <div className="no-print bg-[#121215] text-[#f4f4f5] px-6 py-3.5 flex items-center justify-between border-b border-[#27272a]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a657]" />
            <span className="text-xs font-mono tracking-wider uppercase text-[#f4f4f5]">
              {language === 'en' ? 'Deed Registration & e-Mutation Docket' : 'দলিল রেজিস্ট্রি সনদ ও ই-নামজারি রসিদ'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1f] hover:bg-[#242429] text-[#f4f4f5] rounded-md text-xs font-mono border border-[#27272a] transition-colors focus:outline-none"
            >
              <Printer className="w-3.5 h-3.5 text-[#A8A6A0]" />
              <span>{language === 'en' ? 'Print / Export' : 'প্রিন্ট'}</span>
            </button>
            <button
              onClick={() => setActiveDeedReceipt(null)}
              className="text-[#A8A6A0] hover:text-[#f4f4f5] p-1.5 rounded-md hover:bg-[#1b1b1f] transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div className="printable-document preview-watermark p-6 sm:p-8 overflow-y-auto space-y-6 text-[#f4f4f5] bg-[#121215]">
          {/* Certificate Header */}
          <div className="text-center border-b border-[#27272a] pb-5">
            <div className="flex justify-center mb-2">
              <SetuLandLogo size="md" showText={false} />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-light text-[#f4f4f5] uppercase tracking-tight">
              {language === 'en' ? "People's Republic of Bangladesh" : 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার'}
            </h2>
            <p className="text-xs font-sans text-[#a1a1aa] mt-0.5">
              {language === 'en' ? 'Directorate of Registration — Sub-Registry Complex' : 'নিবন্ধন পরিদপ্তর — সাব-রেজিস্ট্রার কার্যালয়'}
            </p>
            <div className="inline-block mt-2 bg-[#231d13] text-[#d4a657] border border-[#4a3a1f] text-[11px] font-mono px-3 py-0.5 rounded-sm uppercase tracking-wider">
              {activeDeedReceipt.subRegistryOffice} • Official Certified Receipt
            </div>
          </div>

          {/* Key Identifiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#09090b] p-4 rounded-lg border border-[#27272a]">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#a1a1aa] tracking-wider block">
                {language === 'en' ? 'Deed No:' : 'দলিল নম্বর:'}
              </span>
              <div className="font-mono text-base font-normal text-[#f4f4f5] tabular-nums">
                {activeDeedReceipt.deedNo}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[#d4a657] tracking-wider block">
                {language === 'en' ? 'e-Mutation Tracking ID:' : 'ই-নামজারি ট্র্যাকিং নম্বর:'}
              </span>
              <div className="font-mono text-base font-normal text-[#d4a657] tabular-nums">
                {activeDeedReceipt.trackingId}
              </div>
            </div>
          </div>

          {/* Detailed Transaction Table */}
          <div className="border border-[#27272a] rounded-lg overflow-hidden text-xs">
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-[#27272a]">
                <tr className="bg-[#09090b]">
                  <td className="p-3 font-mono text-[#a1a1aa] w-1/3">Cadastral Parcel:</td>
                  <td className="p-3 font-mono text-[#f4f4f5]">
                    Khatian #{activeDeedReceipt.khatianNo} • Dag #{activeDeedReceipt.dagNo} ({activeDeedReceipt.mouza} Mouza)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[#a1a1aa]">Transferor (Seller):</td>
                  <td className="p-3 font-display text-[#f4f4f5]">
                    {activeDeedReceipt.sellerName}{' '}
                    <span className="text-xs font-mono text-[#a1a1aa]">({activeDeedReceipt.sellerNid})</span>
                  </td>
                </tr>
                <tr className="bg-[#09090b]">
                  <td className="p-3 font-mono text-[#a1a1aa]">Transferee (Buyer):</td>
                  <td className="p-3 font-display text-[#f4f4f5]">
                    {activeDeedReceipt.buyerName}{' '}
                    <span className="text-xs font-mono text-[#a1a1aa]">({activeDeedReceipt.buyerNid})</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[#a1a1aa]">Transferred Decimals:</td>
                  <td className="p-3 font-mono text-[#f4f4f5] tabular-nums font-semibold">
                    {activeDeedReceipt.transferAreaDecimals.toFixed(2)} Decimals
                  </td>
                </tr>
                <tr className="bg-[#09090b]">
                  <td className="p-3 font-mono text-[#a1a1aa]">Declared Value:</td>
                  <td className="p-3 font-mono text-[#f4f4f5] tabular-nums">
                    ৳ {activeDeedReceipt.saleValueBDT.toLocaleString()} BDT
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[#a1a1aa]">Single-Window Statutory Fees:</td>
                  <td className="p-3 font-mono text-[#d4a657] tabular-nums">
                    ৳ {activeDeedReceipt.fees.totalFeeBDT.toLocaleString()} BDT (Includes ৳ 1,170 e-Mutation Fee)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cryptographic Seal & Dynamic SVG QR Code */}
          <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#f4f4f5]">
                <ShieldCheck className="w-4 h-4 text-[#d4a657]" />
                <span>SHA-256 Ledger Signature</span>
              </div>
              <p className="text-[11px] font-mono text-[#a1a1aa] break-all leading-tight">
                {activeDeedReceipt.sha256Hash}
              </p>
              <button
                onClick={handleCopyHash}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d4a657] hover:underline pt-0.5"
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
        <div className="no-print bg-[#09090b] px-6 py-4 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-[#a1a1aa]">
            * Decimals locked on parent Khatian. Case dispatched to AC Land queue.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveDeedReceipt(null);
                setActiveRole('ac_land');
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#d4a657] hover:bg-[#be8a3a] text-[#09090b] font-sans text-xs font-semibold rounded-md border border-[#d4a657] transition-colors shadow-xs focus:outline-none"
            >
              <span>View in AC Land Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveDeedReceipt(null)}
              className="px-4 py-2 bg-[#121215] hover:bg-[#1b1b1f] text-[#f4f4f5] font-sans text-xs font-medium rounded-md border border-[#27272a] transition-colors focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
