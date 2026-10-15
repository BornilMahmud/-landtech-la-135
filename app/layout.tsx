import type { Metadata } from 'next';
import './globals.css';
import { LandAppProvider } from '@/context/LandAppContext';

export const metadata: Metadata = {
  title: 'SetuLand (সেতু-ল্যান্ড) | Smart e-Mutation & Unified Registry Engine',
  description: 'Connected Deed Registration to e-Mutation with automated 5-point verification, anti-double-selling cryptographic locks, and real-time status tracking. LandTech 2026 Innovation Hackathon (Track: Digital Land Records).',
  keywords: 'e-Mutation, Sub-Registry, Land Records Bangladesh, AC Land, DLRS, Cadastral Map, LandTech 2026, Smart Land Registry',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
        <LandAppProvider>
          {children}
        </LandAppProvider>
      </body>
    </html>
  );
}
