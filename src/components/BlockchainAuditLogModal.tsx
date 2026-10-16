'use client';

import React from 'react';
import { 
  History, 
  X, 
  ShieldCheck, 
  Link2, 
  Clock, 
  CheckCircle2,
  Database
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { formatHashDisplay } from '@/lib/crypto-utils';

export const BlockchainAuditLogModal: React.FC = () => {
  const { isAuditLogOpen, setIsAuditLogOpen, auditLogs, language } = useLandApp();

  if (!isAuditLogOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm"
        onClick={() => setIsAuditLogOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-[#09090b] text-[#f4f4f5] shadow-2xl border-l border-[#27272a] flex flex-col h-full z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#27272a] flex items-center justify-between bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#231d13] text-[#d4a657] rounded-lg border border-[#4a3a1f]">
              <Database className="w-4 h-4 text-[#d4a657]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-medium text-sm text-[#f4f4f5]">
                  {language === 'en' ? 'Cryptographic Audit Ledger' : 'ক্রিপ্টোগ্রাফিক অডিট লেজার'}
                </h3>
                <span className="text-[10px] bg-[#142318] text-[#22c55e] border border-[#1e4a27] px-2 py-0.5 rounded-sm font-mono">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-[#a1a1aa] font-mono">
                SHA-256 Merkle Chaining • Tamper-Proof Audit Trail
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuditLogOpen(false)}
            className="text-[#a1a1aa] hover:text-[#f4f4f5] p-1.5 rounded-md hover:bg-[#1b1b1f] transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-xs bg-[#121215]">
          <div className="text-[11px] text-[#a1a1aa] font-mono bg-[#09090b] p-3 rounded-lg border border-[#27272a]">
            {language === 'en'
              ? 'Every deed registration, escrow lock, tahsil inquiry, and Khatian split is cryptographically linked with its previous block hash.'
              : 'প্রতিটি দলিল সম্পাদন, এসক্রো জমি লক, তহশিল প্রতিবেদন ও খতিয়ান বিভাজন পূর্ববর্তী ব্লকের হ্যাশের সাথে শৃঙ্খলিত।'}
          </div>

          <div className="space-y-3">
            {[...auditLogs].reverse().map((log, index) => {
              return (
                <div 
                  key={log.id} 
                  className="bg-[#09090b] rounded-xl p-4 border border-[#27272a] hover:border-[#4a3a1f] transition-all space-y-2.5"
                >
                  {/* Event Type & Timestamp */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#27272a]/60 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] bg-[#1b1b1f] text-[#a1a1aa] px-2 py-0.5 rounded border border-[#27272a]">
                        Block #{log.blockIndex ?? (auditLogs.length - index)}
                      </span>
                      <span className="font-mono text-[10px] text-[#d4a657] bg-[#231d13] px-2 py-0.5 rounded border border-[#4a3a1f]">
                        {log.eventType}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#71717a] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#71717a]" />
                      <span>
                        {(() => {
                          try {
                            const d = new Date(log.timestamp);
                            return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')} UTC`;
                          } catch {
                            return log.timestamp;
                          }
                        })()}
                      </span>
                    </span>
                  </div>

                  {/* Actor & Description */}
                  <div>
                    <div className="font-mono text-[11px] text-[#f4f4f5] font-medium">
                      {log.actorName} ({log.actorRole})
                    </div>
                    <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                      {language === 'en' ? log.detailsEn : log.detailsBn}
                    </p>
                  </div>

                  {/* Hash Chain Linkages */}
                  <div className="bg-[#121215] p-2.5 rounded-lg border border-[#27272a] font-mono text-[10px] space-y-1">
                    <div className="flex items-center justify-between text-[#71717a]">
                      <span>prev_hash:</span>
                      <span className="text-[#a1a1aa]">{formatHashDisplay(log.prevHash || log.previousHash || '', 6)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#22c55e] font-medium">
                      <span className="flex items-center gap-1">
                        <Link2 className="w-3 h-3 text-[#22c55e]" />
                        <span>curr_hash:</span>
                      </span>
                      <span>{formatHashDisplay(log.currentHash, 8)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#27272a] bg-[#121215] flex items-center justify-between text-[11px] font-mono text-[#a1a1aa]">
          <span>Total Blocks: {auditLogs.length}</span>
          <button
            onClick={() => setIsAuditLogOpen(false)}
            className="px-3.5 py-1.5 bg-[#1b1b1f] hover:bg-[#27272a] text-[#f4f4f5] rounded-md text-xs font-mono border border-[#27272a] transition-colors"
          >
            {language === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
