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
  Filter, 
  Radio, 
  Smartphone,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useLandRegistry } from '@/context/LandRegistryContext';
import { t } from '@/lib/i18n';
import { GovSmsLog } from '@/lib/types';

export const GovSmsDrawer: React.FC = () => {
  const { 
    isSmsDrawerOpen, 
    setIsSmsDrawerOpen, 
    smsLogs, 
    language,
    dispatchGovSms 
  } = useLandRegistry();

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
    // Simulate resend dispatch
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSmsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-xl w-full flex pl-10">
        <div className="w-full bg-slate-900 border-l border-emerald-500/20 text-slate-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white tracking-tight">
                    {language === 'en' ? 'Gov-SMS Gateway (88096...)' : 'সরকারি এসএমএস গেটওয়ে (৮৮০৯৬...)'}
                  </h2>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {t(language, 'smsDrawerSubtitle')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSmsDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={t(language, 'closeBtn')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search, Filter & Quick Test Bar */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/90 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'en' ? 'Search by phone, name, or gateway ID...' : 'মোবাইল, নাম বা গেটওয়ে আইডি দিয়ে খুঁজুন...'}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                onClick={() => setShowTestModal(!showTestModal)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Simulate SMS' : 'টেস্ট পাঠান'}</span>
              </button>
            </div>

            {/* Test SMS Quick Form */}
            {showTestModal && (
              <form onSubmit={handleSendTestSms} className="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    {language === 'en' ? 'Dispatch Simulated Gov-SMS' : 'সরাসরি টেস্ট এসএমএস প্রেরণ'}
                  </span>
                  <button type="button" onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="Mobile Number"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="Citizen Name"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  placeholder="SMS Text"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all"
                >
                  {language === 'en' ? 'Dispatch Broadcast Now' : 'এখনই ব্রডকাস্ট করুন'}
                </button>
              </form>
            )}

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'ALL'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'en' ? `All (${smsLogs.length})` : `সকল (${smsLogs.length})`}
              </button>
              <button
                onClick={() => setFilterType('DEED')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'DEED'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'en' ? 'Deed Registrations' : 'দলিল সম্পাদন'}
              </button>
              <button
                onClick={() => setFilterType('MUTATION')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'MUTATION'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'en' ? 'e-Mutations' : 'ই-নামজারি'}
              </button>
              <button
                onClick={() => setFilterType('WARISAN')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'WARISAN'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'en' ? 'Warisan Succession' : 'ওয়ারিশান বণ্টন'}
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {filteredLogs.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <MessageSquare className="w-10 h-10 mb-2 text-slate-600" />
                <p className="text-sm font-bold text-slate-400">
                  {language === 'en' ? 'No Gov-SMS records found' : 'কোনো সরকারি বার্তা রেকর্ড পাওয়া যায়নি'}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {language === 'en' 
                    ? 'Trigger a deed registration, AC Land mutation approval, or Warisan division to see automated alerts here.'
                    : 'সাব-রেজিস্ট্রি দলিল, নামজারি অনুমোদন বা ওয়ারিশান বণ্টন সম্পন্ন করলে এখানে স্বয়ংক্রিয় এসএমএস প্রদর্শিত হবে।'}
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isResent = resentIds[log.id];
                const dateObj = new Date(log.timestamp);
                const timeString = isNaN(dateObj.getTime()) 
                  ? log.timestamp 
                  : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all shadow-md group"
                  >
                    {/* Top Row: Gateway ID + Status + Time */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                          {log.gatewayRef}
                        </span>
                        <span className="text-slate-500">|</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {timeString}
                        </span>
                      </div>

                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {log.status}
                      </span>
                    </div>

                    {/* Recipient Details */}
                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-300 font-semibold">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.recipientName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-slate-400 text-[11px] bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{log.recipientPhone}</span>
                      </div>
                    </div>

                    {/* SMS Bubble (Bangla Primary) */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bangla text-slate-200 leading-relaxed relative">
                      <p className="font-medium text-emerald-100/90">
                        {log.messageBn}
                      </p>
                      
                      {/* Secondary English Text */}
                      {log.messageEn && (
                        <p className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-sans text-slate-400 leading-normal">
                          {log.messageEn}
                        </p>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 text-[10px] uppercase tracking-wider font-mono">
                        Shortcode: 88096 | Route: Priority-Gov
                      </span>

                      <button
                        onClick={() => handleResend(log)}
                        disabled={isResent}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                          isResent
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }`}
                      >
                        <RotateCcw className={`w-3 h-3 ${isResent ? 'animate-spin' : ''}`} />
                        <span>
                          {isResent 
                            ? (language === 'en' ? 'Dispatched!' : 'প্রেরিত!') 
                            : t(language, 'resendSmsBtn')}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500 space-y-1">
            <p className="flex items-center justify-center gap-1.5 text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>BTRC Approved Government Shortcode 88096-XXXXX | 99.99% Gateway SLA</span>
            </p>
            <p>
              {language === 'en'
                ? 'All citizen alerts comply with Digital Security & Personal Data Protection Guidelines 2026.'
                : 'সকল নাগরিক এসএমএস অ্যালার্ট ডিজিটাল নিরাপত্তা ও ব্যক্তিগত উপাত্ত সুরক্ষা নীতিমালা ২০২৬ এর আওতাধীন।'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
