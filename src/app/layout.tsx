import type { Metadata } from 'next';
import { DM_Sans, Outfit } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://purescoop.vercel.app'),
  title: 'Pure Scoop Nutrition | Purity is Priority',
  description:
    'Premium wellness and sports nutrition. Clean, science-backed supplements for your daily routine.',
  openGraph: {
    title: 'Pure Scoop Nutrition | Purity is Priority',
    description:
      'Premium wellness and sports nutrition. Clean, science-backed supplements for your daily routine.',
    type: 'website',
    images: ['/assets/placeholder_hero.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@purescoop',
    title: 'Pure Scoop Nutrition | Purity is Priority',
    description:
      'Premium wellness and sports nutrition. Clean, science-backed supplements for your daily routine.',
    images: ['/assets/placeholder_hero.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${outfit.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
