import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Navbar, Footer } from '@/components/layout';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AIAssistant } from '@/components/features';
import { getSettings } from '@/lib/sanity/queries';
import { sanityFetch } from '@/lib/sanity/live';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export async function generateMetadata() {
  const settings = await sanityFetch({
    query: getSettingsQuery,
    tags: ['settings']
  });
  
  const siteTitle = settings?.title || 'Kritvia — Enterprise AI & Technology Consulting';
  const siteDescription = settings?.description || 'Kritvia delivers enterprise AI development, cloud architecture, and custom software solutions to transform businesses at scale.';
  const ogImage = settings?.seo?.ogImage?.asset?.url || '/og-image.jpg';
  const defaultOgImage = settings?.seo?.defaultOgImage?.asset?.url || '/og-image.jpg';
  
  return {
    title: {
      template: '%s | Kritvia',
      default: siteTitle,
    },
    description: siteDescription,
    metadataBase: new URL('https://kritvia.com'),
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    icons: {
      icon: settings?.logo?.asset?.url || '/logo.png',
      apple: settings?.logo?.asset?.url || '/logo.png',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://kritvia.com',
      siteName: 'Kritvia',
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Kritvia - AI-Powered Digital Platforms',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: 'google-site-verification-code',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch({
    query: getSettingsQuery,
    tags: ['settings']
  });
  
  const siteTitle = settings?.title || 'Kritvia';
  const logoUrl = settings?.logo?.asset?.url || '/logo.png';
  
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
          {/* Navbar and Footer will be updated to use settings in their respective files */}
          <Navbar settings={settings} />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer settings={settings} />
          <AIAssistant />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  );
}
