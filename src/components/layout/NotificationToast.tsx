'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useLandApp } from '@/context/LandRegistryContext';

export const NotificationToast: React.FC = () => {
  const { notification, clearNotification, language } = useLandApp();
  const [showInDom, setShowInDom] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(notification);

  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const unmountTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (notification) {
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);

      setActiveItem(notification);
      setShowInDom(true);
      setIsVisible(false);

      // Trigger 1-second fade-in on the next animation frame
      const frameId = requestAnimationFrame(() => {
        const innerFrame = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(innerFrame);
      });

      // Display for 4.5 seconds before starting the 1-second fade-out
      autoDismissTimerRef.current = setTimeout(() => {
        triggerFadeOut();
      }, 4500);

      return () => {
        cancelAnimationFrame(frameId);
      };
    }
  }, [notification]);

  const triggerFadeOut = () => {
    setIsVisible(false); // Triggers 1s opacity fade-out
    if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    unmountTimerRef.current = setTimeout(() => {
      setShowInDom(false);
      clearNotification();
      setActiveItem(null);
    }, 1000); // 1000ms matches the 1s transition duration
  };

  if (!showInDom || !activeItem) return null;

  const type = activeItem.type || 'success';
  const text =
    language === 'bn' && activeItem.messageBn
      ? activeItem.messageBn
      : activeItem.messageEn;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-16 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#121215]/95 backdrop-blur-md text-[#f4f4f5] border border-[#d4a657] shadow-gold rounded-lg font-mono text-xs select-none max-w-md transition-all duration-1000 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
      }`}
      style={{
        transitionDuration: '1000ms',
        transitionProperty: 'opacity, transform',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />}
      {type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#d4a657] shrink-0" />}
      {type === 'info' && <Info className="w-4 h-4 text-[#60a5fa] shrink-0" />}

      <span className="leading-snug text-left">{text}</span>

      <button
        type="button"
        onClick={triggerFadeOut}
        className="ml-2 text-[#a1a1aa] hover:text-[#f4f4f5] p-1 rounded-md hover:bg-[#1b1b1f] cursor-pointer focus:outline-none transition-colors shrink-0"
        title={language === 'en' ? 'Dismiss' : 'বন্ধ করুন'}
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default NotificationToast;
