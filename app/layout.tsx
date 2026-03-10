import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Navbar, Footer } from '@/components/layout';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AIAssistant } from '@/components/features';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Kritvia',
    default: 'Kritvia — Enterprise AI & Technology Consulting',
  },
  description: 'Kritvia delivers enterprise AI development, cloud architecture, and custom software solutions to transform businesses at scale.',
  metadataBase: new URL('https://kritvia.com'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kritvia.com',
    siteName: 'Kritvia',
    title: 'Kritvia - Enterprise AI & Technology Consulting',
    description: 'Kritvia delivers enterprise AI development, cloud architecture, and custom software solutions to transform businesses at scale.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kritvia - AI-Powered Digital Platforms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kritvia - Enterprise AI & Technology Consulting',
    description: 'Kritvia delivers enterprise AI development, cloud architecture, and custom software solutions.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.add('dark')
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-screen flex flex-col font-sans bg-[rgb(var(--background-primary))] text-[rgb(var(--text-primary))]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
          <AIAssistant />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  );
}
