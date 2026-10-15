'use client';

import React from 'react';
import { 
  History, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  Link2, 
  CheckCircle2, 
  Layers, 
  Clock 
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { formatHashDisplay } from '@/lib/crypto-utils';

export const BlockchainAuditLog: React.FC = () => {
  const { isAuditLogOpen, setIsAuditLogOpen, auditLogs, language } = useLandRegistry();

  if (!isAuditLogOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-950 text-slate-100 shadow-2xl border-l border-slate-800 flex flex-col animate-slide-up sm:animate-fade-in">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <span>{language === 'en' ? 'Immutable Blockchain Audit Trail' : 'অপরিবর্তনীয় ক্রিপ্টোগ্রাফিক অডিট লেজার'}</span>
              <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              SHA-256 Merkle Chain • Zero-Tamper Proof
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuditLogOpen(false)}
          className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Audit Log Timeline */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-xs">
        <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          {language === 'en'
            ? 'Every atomic deed registration, escrow lock, tahsil inquiry, and Khatian split is cryptographically linked with its previous block hash.'
            : 'প্রতিটি দলিল সম্পাদন, এসক্রো জমি লক, তহশিল প্রতিবেদন ও খতিয়ান বিভাজন পূর্ববর্তী ব্লকের হ্যাশের সাথে শৃঙ্খলিত।'}
        </div>

        <div className="space-y-3">
          {[...auditLogs].reverse().map((log, index) => {
            return (
              <div 
                key={log.id} 
                className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-emerald-600/50 transition-all space-y-2.5 group"
              >
                {/* Event Type & Timestamp */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      Block #{log.blockIndex ?? (auditLogs.length - index)}
                    </span>
                    <span className="font-mono font-extrabold text-[11px] text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                      {log.eventType}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
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
                  <div className="font-mono text-[11px] text-slate-300 font-bold">
                    {log.actorName} ({log.actorRole})
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {language === 'en' ? log.detailsEn : log.detailsBn}
                  </p>
                </div>

                {/* Hash Chain Linkages */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/90 font-mono text-[10px] space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>prev_hash:</span>
                    <span className="text-slate-400">{formatHashDisplay(log.prevHash, 6)}</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-emerald-500" />
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
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Total Logged Events: {auditLogs.length}</span>
        <button
          onClick={() => setIsAuditLogOpen(false)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
        >
          {language === 'en' ? 'Close Drawer' : 'বন্ধ করুন'}
        </button>
      </div>
    </div>
  );
};
