'use client';

import React from 'react';
import { 
  FileCheck2, 
  Building2, 
  UserCheck, 
  Map, 
  KeyRound, 
  Lock,
  X
} from 'lucide-react';
import { useLandApp } from '@/context/LandAppContext';
import { RoleType } from '@/types';

export type RoleKey =
  | 'sub_registrar'
  | 'ac_land'
  | 'citizen'
  | 'bank_judiciary'
  | 'mouza_map'
  | 'tamper_test';

interface NavItem {
  id: RoleKey;
  group: 'Mutation process' | 'Record access' | 'Proof';
  titleEn: string;
  titleBn: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'sub_registrar',
    group: 'Mutation process',
    titleEn: 'Sub-Registrar',
    titleBn: 'সাব-রেজিস্ট্রার',
    icon: FileCheck2,
  },
  {
    id: 'ac_land',
    group: 'Mutation process',
    titleEn: 'AC Land',
    titleBn: 'এসি ল্যান্ড',
    icon: Building2,
  },
  {
    id: 'citizen',
    group: 'Record access',
    titleEn: 'Citizen portal',
    titleBn: 'নাগরিক পোর্টাল',
    icon: UserCheck,
  },
  {
    id: 'bank_judiciary',
    group: 'Record access',
    titleEn: 'Banks, courts and governm...',
    titleBn: 'ব্যাংক, আদালত ও সরকার',
    icon: Lock,
  },
  {
    id: 'mouza_map',
    group: 'Record access',
    titleEn: 'Mouza map',
    titleBn: 'মৌজা নকশা',
    icon: Map,
  },
  {
    id: 'tamper_test',
    group: 'Proof',
    titleEn: 'Tamper test',
    titleBn: 'জালিয়াতি পরীক্ষা',
    icon: KeyRound,
  },
];

const GROUPS: ('Mutation process' | 'Record access' | 'Proof')[] = [
  'Mutation process',
  'Record access',
  'Proof',
];

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectRole?: (id: RoleKey) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isOpen = false,
  onClose,
  onSelectRole,
}) => {
  const {
    activeRole,
    setActiveRole,
    language,
    mutations,
    blockedAttemptsCount,
  } = useLandApp();

  const pendingMutationCount = mutations.filter(m => m.status === 'AUTO_INITIATED').length;

  const handleSelect = (id: RoleKey) => {
    setActiveRole(id as RoleType);
    if (onSelectRole) {
      onSelectRole(id);
    }
    if (onClose) {
      onClose();
    }
  };

  const getBadge = (id: RoleKey) => {
    if (id === 'ac_land' && pendingMutationCount > 0) {
      return { count: pendingMutationCount, color: 'bg-[#d4a657] text-[#09090b]' };
    }
    if (id === 'bank_judiciary' && blockedAttemptsCount > 0) {
      return { count: blockedAttemptsCount, color: 'bg-[#f87171] text-[#09090b]' };
    }
    return null;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Full-Height Fixed Left Sidebar - Clean, no right border line, no top header, no bottom options */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 xl:w-72 bg-[#09090b] z-50 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile close button only */}
        {onClose && (
          <div className="lg:hidden flex justify-end p-3 pb-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1b1b1f] focus:outline-none"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Clean Navigation Area - Just the categories and links */}
        <div className="flex-1 overflow-y-auto px-4 pt-6 sm:pt-8 pb-6 scrollbar-none">
          <nav aria-label="Workflow & Role Perspectives" className="space-y-6">
            {GROUPS.map((group) => {
              const groupItems = NAV_ITEMS.filter((item) => item.group === group);
              const groupLabel = language === 'bn' 
                ? (group === 'Mutation process' ? 'নামজারি প্রক্রিয়া' : group === 'Record access' ? 'রেকর্ড অ্যাক্সেস' : 'নিরাপত্তা প্রমাণ')
                : group;

              return (
                <div key={group} className="space-y-1.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] px-3 font-semibold">
                    {groupLabel}
                  </p>
                  
                  <ul className="border-l border-[#27272a] ml-3 pl-0 space-y-1">
                    {groupItems.map((item) => {
                      const isActive = activeRole === item.id;
                      const badge = getBadge(item.id);
                      const Icon = item.icon;

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => handleSelect(item.id)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`-ml-px flex items-center justify-between w-full text-left pl-3.5 pr-2.5 py-2 text-xs font-sans border-l-2 transition-all rounded-r-md group cursor-pointer focus:outline-none ${
                              isActive
                                ? 'border-[#d4a657] text-[#f4f4f5] font-semibold bg-[#d4a657]/10'
                                : 'border-transparent text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1b1b1f] hover:border-[#3f3f46]'
                            }`}
                          >
                            <span className="flex items-center gap-2.5 truncate">
                              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#d4a657]' : 'text-[#71717a] group-hover:text-[#a1a1aa]'}`} />
                              <span className="truncate">
                                {language === 'bn' ? item.titleBn : item.titleEn}
                              </span>
                            </span>

                            {badge && (
                              <span
                                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-bold rounded-sm ${badge.color} shrink-0 ml-1.5`}
                              >
                                {badge.count}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
