'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useLandApp } from '@/context/LandRegistryContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, language } = useLandApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    const applyTheme = () => {
      setTheme(nextTheme);
      try {
        localStorage.setItem('setuland_theme_mode', nextTheme);
        localStorage.setItem('theme-mode', nextTheme);
      } catch (err) {
        console.warn('Could not save theme to localStorage', err);
      }

      if (typeof document !== 'undefined') {
        if (nextTheme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      }
    };

    // Smooth circular radial View Transition from button center (matching LandTech-LA-135)
    if (
      typeof document === 'undefined' ||
      !('startViewTransition' in document) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      applyTheme();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (
      document as Document & {
        startViewTransition: (callback: () => void) => {
          ready: Promise<void>;
        };
      }
    ).startViewTransition(() => {
      applyTheme();
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        { clipPath },
        {
          duration: 400,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark/light theme"
      title={
        mounted && isDark
          ? (language === 'en' ? 'Switch to Light Mode' : 'লাইট মোডে পরিবর্তন করুন')
          : (language === 'en' ? 'Switch to Dark Mode' : 'ডার্ক মোডে পরিবর্তন করুন')
      }
      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] border border-zinc-200 dark:border-[#27272A] bg-transparent hover:bg-zinc-100 dark:hover:bg-[#18181B] text-zinc-900 dark:text-[#FAFAFA] transition-all cursor-pointer hover:border-zinc-300 dark:hover:border-[#3F3F46] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white"
    >
      {mounted ? (
        isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45 shrink-0" aria-hidden="true" />
        ) : (
          <Moon className="w-4 h-4 text-zinc-700 dark:text-[#FAFAFA] transition-transform duration-200 hover:-rotate-12 shrink-0" aria-hidden="true" />
        )
      ) : (
        <Sun className="w-4 h-4 text-amber-400 shrink-0 opacity-80" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
