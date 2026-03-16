import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Navbar, Footer } from '@/components/layout';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AIAssistant } from '@/components/features';
import { getSettings, getSettingsQuery } from '@/lib/sanity/queries';
import { sanityFetch } from '@/lib/sanity/live';
import { generateWebSiteJsonLd, generateOrganizationJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/metadata';

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
  
  // Generate JSON-LD structured data
  const webSiteJsonLd = generateWebSiteJsonLd({
    name: siteTitle,
    description: siteDescription,
    url: 'https://kritvia.com',
  });
  
  const organizationJsonLd = generateOrganizationJsonLd({
    name: siteTitle,
    description: siteDescription,
    url: 'https://kritvia.com',
    logo: settings?.logo?.asset?.url || '/logo.png',
    sameAs: [
      settings?.socialLinks?.find(link => link.platform === 'Twitter')?.url || 'https://twitter.com/kritvia',
      settings?.socialLinks?.find(link => link.platform === 'LinkedIn')?.url || 'https://linkedin.com/company/kritvia',
      settings?.socialLinks?.find(link => link.platform === 'GitHub')?.url || 'https://github.com/kritvia',
    ].filter(Boolean),
  });
  
  // Breadcrumb for homepage
  const breadcrumbJsonLd = generateBreadcrumbJsonLd({
    items: [
      { name: 'Home', href: 'https://kritvia.com' },
    ]
  });
  
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
    // JSON-LD structured data will be injected via dangerouslySetInnerHTML in the layout
    // We're returning it here so it can be accessed by child pages if needed
    // but the actual injection will happen in the layout below
    unstable__jsonLd: JSON.stringify([webSiteJsonLd, organizationJsonLd, breadcrumbJsonLd]),
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
  
  // Generate JSON-LD structured data for the layout
  const webSiteJsonLd = generateWebSiteJsonLd({
    name: siteTitle,
    description: settings?.description || 'Kritvia delivers enterprise AI development, cloud architecture, and custom software solutions to transform businesses at scale.',
    url: 'https://kritvia.com',
  });
  
  const organizationJsonLd = generateOrganizationJsonLd({
    name: siteTitle,
    description: settings?.description || 'Kritvia delivers enterprise AI development, cloud architecture, and custom software solutions to transform businesses at scale.',
    url: 'https://kritvia.com',
    logo: logoUrl,
    sameAs: [
      settings?.socialLinks?.find(link => link.platform === 'Twitter')?.url,
      settings?.socialLinks?.find(link => link.platform === 'LinkedIn')?.url,
      settings?.socialLinks?.find(link => link.platform === 'GitHub')?.url,
    ].filter(Boolean),
  });
  
  // Breadcrumb for homepage (will be overridden by child pages with more specific breadcrumbs)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd({
    items: [
      { name: 'Home', href: 'https://kritvia.com' },
    ]
  });
  
  const jsonLdArray = [webSiteJsonLd, organizationJsonLd, breadcrumbJsonLd];
  
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
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLdArray)}
        </script>
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
