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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kritvia.com',
    siteName: 'Kritvia',
    title: 'Kritvia - Modern Tech Solutions',
    description: 'Building the future of technology through innovative solutions and cutting-edge development.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kritvia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kritvia - Modern Tech Solutions',
    description: 'Building the future of technology through innovative solutions and cutting-edge development.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-screen flex flex-col font-sans bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
          <AIAssistant />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
