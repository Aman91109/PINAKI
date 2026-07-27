import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/providers/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const SITE_URL = 'https://pinaki.dev';
const TITLE = 'Pinaki — Freelance Web, AI & Automation Studio';
const DESCRIPTION =
  'A three-person freelance engineering studio building fast web applications, AI systems and automation. Next.js, Node, Python. Fixed scope, clear timelines, direct access to the people writing the code.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s — Pinaki',
  },
  description: DESCRIPTION,
  keywords: [
    'freelance web developer',
    'Next.js developer',
    'AI engineer',
    'machine learning freelancer',
    'Python automation',
    'full-stack development',
    'React developer India',
  ],
  authors: [{ name: 'Pinaki' }],
  creator: 'Pinaki',
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Pinaki',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body className="overflow-x-hidden bg-canvas font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:text-accent-ink"
        >
          Skip to content
        </a>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
