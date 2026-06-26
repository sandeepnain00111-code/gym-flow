import { Outfit } from 'next/font/google';
import './globals.css';
import AppProviders from '../components/layout/AppProviders';
import SmoothScrollProvider from '../components/layout/SmoothScrollProvider';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit'
});

export const metadata = {
  title: 'GymFlow SaaS - One QR. Complete Gym Management.',
  description: 'Premium dark gym management SaaS. Effortless check-ins, automated fees, workout splits, diet blueprints, and real-time gym rooms.',
  manifest: '/manifest.json',
  themeColor: '#030712'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;450;500;600;700;800&family=Space+Grotesk:wght@300;450;500;650;700&family=Syne:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏋️</text></svg>" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#030712] text-gray-100 min-h-screen">
        <AppProviders>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </AppProviders>
      </body>
    </html>
  );
}
