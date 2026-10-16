'use client';

import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  Phone, 
  User, 
  Search, 
  Smartphone,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { GovSmsLog } from '@/types';

export const GovSmsDrawer: React.FC = () => {
  const { 
    isSmsDrawerOpen, 
    setIsSmsDrawerOpen, 
    smsLogs, 
    language,
    dispatchGovSms 
  } = useLandApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'DEED' | 'MUTATION' | 'WARISAN'>('ALL');
  const [resentIds, setResentIds] = useState<Record<string, boolean>>({});
  const [showTestModal, setShowTestModal] = useState(false);
  const [testPhone, setTestPhone] = useState('01712-998877');
  const [testName, setTestName] = useState('Md. Alamin Hossain');
  const [testMessage, setTestMessage] = useState('আপনার খতিয়ান সংক্রান্ত নোটিশ প্রেরিত হয়েছে।');

  if (!isSmsDrawerOpen) return null;

  const handleResend = (sms: GovSmsLog) => {
    setResentIds(prev => ({ ...prev, [sms.id]: true }));
    dispatchGovSms(
      sms.recipientPhone,
      sms.recipientName,
      `[RESEND] ${sms.messageEn}`,
      `[পুনরায় প্রেরিত] ${sms.messageBn}`,
      sms.triggerEvent
    );
    setTimeout(() => {
      setResentIds(prev => ({ ...prev, [sms.id]: false }));
    }, 2500);
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;
    dispatchGovSms(
      testPhone,
      testName,
      `[GOV-LAND TEST ALERT] Notification for ${testName}: ${testMessage}`,
      `[GOV-LAND টেস্ট বার্তা] ${testName} এর জন্য সরকারি ভূমি তথ্য: ${testMessage}`,
      'MANUAL_TEST'
    );
    setShowTestModal(false);
  };

  const filteredLogs = smsLogs.filter(log => {
    const matchesSearch = 
      log.recipientPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.gatewayRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.messageBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.messageEn.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'DEED') {
      return log.triggerEvent === 'DEED_REGISTERED' || log.messageEn.toLowerCase().includes('deed');
    }
    if (filterType === 'MUTATION') {
      return log.triggerEvent === 'MUTATION_APPROVED' || log.messageEn.toLowerCase().includes('mutation');
    }
    if (filterType === 'WARISAN') {
      return log.triggerEvent === 'WARISAN_ESTATE_DISTRIBUTED' || log.messageEn.toLowerCase().includes('warisan');
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm"
        onClick={() => setIsSmsDrawerOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-[#09090b] text-[#f4f4f5] border-l border-[#27272a] flex flex-col h-full shadow-2xl z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#27272a] bg-[#121215] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg bg-[#231d13] text-[#d4a657] border border-[#4a3a1f] flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-[#d4a657]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-display font-medium text-[#f4f4f5] tracking-tight">
                  {language === 'en' ? 'Gov-SMS Gateway (88096...)' : 'সরকারি এসএমএস গেটওয়ে (৮৮০৯৬...)'}
                </h2>
                <span className="bg-[#142318] text-[#22c55e] text-[10px] font-mono px-2 py-0.5 rounded-sm border border-[#1e4a27]">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-[#a1a1aa] font-mono">
                {language === 'en' ? 'Automated Citizen Alert Feed & Dispatch Ledger' : 'স্বয়ংক্রিয় ভূমি নোটিফিকেশন ফিড ও বার্তা লেজার'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSmsDrawerOpen(false)}
            className="p-1.5 rounded-md text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1b1b1f] transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search, Filter & Quick Test Bar */}
        <div className="p-4 border-b border-[#27272a] bg-[#121215] space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search by phone, name, gateway ref...' : 'ফোন, নাম, গেটওয়ে রেফ দিয়ে খুঁজুন...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] text-[#f4f4f5] rounded-md pl-9 pr-3 py-1.5 text-xs font-mono placeholder:text-[#71717a] focus:outline-none focus:border-[#d4a657]"
              />
            </div>
            <button
              onClick={() => setShowTestModal(!showTestModal)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4a657] hover:bg-[#c29547] text-[#09090b] rounded-md text-xs font-medium transition-colors shrink-0"
            >
              <Send className="w-3 h-3" />
              <span>{language === 'en' ? 'Send Test' : 'টেস্ট পাঠান'}</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'ALL'
                  ? 'bg-[#231d13] text-[#d4a657] border border-[#4a3a1f]'
                  : 'bg-[#09090b] text-[#a1a1aa] border border-[#27272a] hover:text-[#f4f4f5]'
              }`}
            >
              {language === 'en' ? 'All Alerts' : 'সকল'} ({smsLogs.length})
            </button>
            <button
              onClick={() => setFilterType('DEED')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'DEED'
                  ? 'bg-[#231d13] text-[#d4a657] border border-[#4a3a1f]'
                  : 'bg-[#09090b] text-[#a1a1aa] border border-[#27272a] hover:text-[#f4f4f5]'
              }`}
            >
              {language === 'en' ? 'Deeds' : 'দলিল'}
            </button>
            <button
              onClick={() => setFilterType('MUTATION')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'MUTATION'
                  ? 'bg-[#231d13] text-[#d4a657] border border-[#4a3a1f]'
                  : 'bg-[#09090b] text-[#a1a1aa] border border-[#27272a] hover:text-[#f4f4f5]'
              }`}
            >
              {language === 'en' ? 'e-Mutation' : 'নামজারি'}
            </button>
            <button
              onClick={() => setFilterType('WARISAN')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'WARISAN'
                  ? 'bg-[#231d13] text-[#d4a657] border border-[#4a3a1f]'
                  : 'bg-[#09090b] text-[#a1a1aa] border border-[#27272a] hover:text-[#f4f4f5]'
              }`}
            >
              {language === 'en' ? 'Warisan' : 'ওয়ারিশান'}
            </button>
          </div>
        </div>

        {/* Test SMS Dispatch Drawer Form */}
        {showTestModal && (
          <form onSubmit={handleSendTestSms} className="p-4 bg-[#09090b] border-b border-[#27272a] space-y-3 animate-fade-in text-xs font-mono">
            <div className="flex items-center justify-between text-[#d4a657] font-medium">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Dispatch Simulated Gov-SMS:' : 'সরাসরি সরকারি এসএমএস প্রেরণ টেস্ট:'}</span>
              </span>
              <button 
                type="button" 
                onClick={() => setShowTestModal(false)}
                className="text-[#71717a] hover:text-[#f4f4f5]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#71717a] block mb-1">Recipient Mobile</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full bg-[#1b1b1f] border border-[#27272a] text-[#f4f4f5] rounded-md px-2.5 py-1.5 focus:border-[#d4a657] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-[#71717a] block mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full bg-[#1b1b1f] border border-[#27272a] text-[#f4f4f5] rounded-md px-2.5 py-1.5 focus:border-[#d4a657] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#71717a] block mb-1">Bangla SMS Content</label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={2}
                className="w-full bg-[#1b1b1f] border border-[#27272a] text-[#f4f4f5] rounded-md px-2.5 py-1.5 font-sans focus:border-[#d4a657] focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="px-3 py-1 bg-[#1b1b1f] text-[#a1a1aa] rounded-md border border-[#27272a]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-[#d4a657] text-[#09090b] rounded-md font-medium"
              >
                Transmit Now
              </button>
            </div>
          </form>
        )}

        {/* SMS Feed Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#121215]">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-[#71717a] font-mono text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#a1a1aa]" />
              <p>{language === 'en' ? 'No SMS notifications matched the criteria.' : 'কোনো এসএমএস নোটিফিকেশন পাওয়া যায়নি।'}</p>
            </div>
          ) : (
            filteredLogs.map((sms) => (
              <div 
                key={sms.id}
                className="bg-[#09090b] rounded-xl p-4 border border-[#27272a] hover:border-[#4a3a1f] transition-all space-y-3 text-xs"
              >
                {/* Meta Row */}
                <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#27272a]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#f4f4f5] flex items-center gap-1">
                      <User className="w-3 h-3 text-[#a1a1aa]" />
                      <span>{sms.recipientName}</span>
                    </span>
                    <span className="text-[#71717a]">•</span>
                    <span className="text-[#a1a1aa] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#a1a1aa]" />
                      <span>{sms.recipientPhone}</span>
                    </span>
                  </div>

                  <span className="text-[10px] bg-[#142318] text-[#22c55e] border border-[#1e4a27] px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#22c55e]" />
                    <span>{sms.status}</span>
                  </span>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5 font-sans">
                  <p className="text-xs text-[#f4f4f5] leading-relaxed">
                    {language === 'en' ? sms.messageEn : sms.messageBn}
                  </p>
                  <p className="text-[11px] text-[#71717a] font-sans italic">
                    {language === 'en' ? sms.messageBn : sms.messageEn}
                  </p>
                </div>

                {/* Gateway Metadata & Resend Button */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a] pt-1 border-t border-[#27272a]/40">
                  <span className="flex items-center gap-1">
                    <span>Sender:</span>
                    <strong className="text-[#d4a657]">{sms.gatewayRef}</strong>
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(sms.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>

                    <button
                      type="button"
                      disabled={resentIds[sms.id]}
                      onClick={() => handleResend(sms)}
                      className="inline-flex items-center gap-1 text-[#d4a657] hover:underline disabled:opacity-40"
                    >
                      <RotateCcw className={`w-3 h-3 ${resentIds[sms.id] ? 'animate-spin' : ''}`} />
                      <span>{resentIds[sms.id] ? 'Resending...' : 'Resend'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#27272a] bg-[#121215] flex items-center justify-between text-[11px] font-mono text-[#a1a1aa]">
          <span>Gov Gateway Ref: 8809612345678 • BTCL High-Throughput Node</span>
          <button
            onClick={() => setIsSmsDrawerOpen(false)}
            className="px-3.5 py-1.5 bg-[#1b1b1f] hover:bg-[#27272a] text-[#f4f4f5] rounded-md text-xs font-mono border border-[#27272a] transition-colors"
          >
            {language === 'en' ? 'Close Feed' : 'ফিড বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
