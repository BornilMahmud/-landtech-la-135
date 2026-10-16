import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LandAppProvider } from '@/context/LandAppContext';

export const metadata: Metadata = {
  title: 'SmartBhoomi (স্মার্ট ভূমি) | Smart e-Mutation & Unified Registry Engine',
  description:
    'Connected Deed Registration to e-Mutation with automated 5-point verification, anti-double-selling cryptographic locks, and real-time status tracking. LandTech 2026 Innovation Hackathon (Track: Digital Land Records).',
  keywords:
    'SmartBhoomi, e-Mutation, Sub-Registry, Land Records Bangladesh, AC Land, DLRS, Cadastral Map, LandTech 2026, Smart Land Registry',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light h-full scroll-smooth motion-reduce:scroll-auto" data-theme="light">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('setuland_theme_mode');
                  if (t === 'dark') {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-canvas text-primary antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
        <LandAppProvider>{children}</LandAppProvider>
      </body>
    </html>
  );
}