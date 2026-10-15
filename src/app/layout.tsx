import type { Metadata } from 'next';
import './globals.css';
import { LandRegistryProvider } from '@/context/LandRegistryContext';

export const metadata: Metadata = {
  title: 'SetuLand (সেতু-ল্যান্ড) — Smart e-Mutation & Unified Registry Engine',
  description: 'National Smart Registry & Zero-Touch Automated e-Mutation Interoperability Engine for Bangladesh. LandTech 2026 Innovation Hackathon (Track P4: Digital Land Records, Verification & Digitization).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-slate-100/70 text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-600 selection:text-white">
        <LandRegistryProvider>
          {children}
        </LandRegistryProvider>
      </body>
    </html>
  );
}
