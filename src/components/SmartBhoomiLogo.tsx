'use client';

import React from 'react';

interface SmartBhoomiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showSubtitle?: boolean;
  variant?: 'default' | 'inverted' | 'monochrome';
  className?: string;
}

export const SmartBhoomiLogo: React.FC<SmartBhoomiLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
}) => {
  // Dimension mapping
  const markDimensions = {
    sm: { w: 32, h: 32, textClass: 'text-base', subClass: 'text-[10px]' },
    md: { w: 40, h: 40, textClass: 'text-xl', subClass: 'text-[11px]' },
    lg: { w: 48, h: 48, textClass: 'text-2xl', subClass: 'text-xs' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision SmartBhoomi Brand Emblem with 10px Roundness */}
      <div 
        className="relative flex-shrink-0 group cursor-pointer transition-transform duration-200 hover:scale-[1.03] rounded-[10px] overflow-hidden border border-zinc-200/80 dark:border-[#27272a] bg-white dark:bg-[#121215] shadow-xs flex items-center justify-center p-0.5"
        style={{ width: markDimensions.w, height: markDimensions.h }}
      >
        <img
          src="/logo.png"
          alt="SmartBhoomi National Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Typographic Identity */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-baseline gap-2 flex-nowrap">
            <span className={`font-display tracking-tight font-bold text-zinc-950 dark:text-[#FAFAFA] ${markDimensions.textClass} whitespace-nowrap`}>
              SmartBhoomi
            </span>
            <span className="font-sans font-semibold text-zinc-700 dark:text-zinc-300 text-sm sm:text-base whitespace-nowrap">
              স্মার্ট ভূমি
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-wider bg-zinc-100 dark:bg-[#18181B] text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-[#27272A] font-semibold whitespace-nowrap">
              P4
            </span>
          </div>

          {showSubtitle && (
            <span className={`font-sans text-zinc-500 dark:text-[#A1A1AA] font-normal tracking-tight hidden sm:block ${markDimensions.subClass}`}>
              Smart e-Mutation &amp; Unified Registry Engine
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartBhoomiLogo;
