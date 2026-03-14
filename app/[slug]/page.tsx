import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { routes, getRouteBySlug, Route } from '@/lib/routes'
import { sanityFetch } from '@/lib/sanity/fetch'
import { getPageBySlug } from '@/lib/sanity/queries'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all pages
export async function generateStaticParams() {
  // We'll fetch all page slugs from Sanity
  const slugs = await sanityFetch({
    query: `*[_type == "page" && defined(slug.current)]{
      slug{
        current
      }
    }`,
    tags: ['pages']
  });
  
  return slugs.map((slug: { slug: { current: string } }) => ({
    slug: slug.slug.current,
  }));
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page Not Found | Kritvia',
    }
  }

  return {
    title: `${page.seo?.seoTitle || page.title} | Kritvia`,
    description: page.seo?.seoDescription || page.description || `Learn more about ${page.title} on Kritvia's AI infrastructure platform.`,
  }
}

// Page template component
function PageContent({ page }: { page: Route }) {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{page.title}</span>
          </nav>
          
          {/* Title */}
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            {page.title}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-slate-400 max-w-2xl mb-10">
            {page.description || 'Content coming soon. This page is part of Kritvia\'s AI infrastructure platform.'}
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Get Started
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Scalable', description: 'Built for enterprise-scale deployments with global infrastructure.' },
              { title: 'Secure', description: 'Enterprise-grade security with SOC 2 compliance.' },
              { title: 'Reliable', description: '99.99% uptime SLA with 24/7 support.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of developers building AI applications with Kritvia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all"
            >
              Contact Sales
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

// Main page component
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  
  // Check if this is a static route that should use the registry
  const staticRoutes = ['', 'about', 'services', 'solutions', 'products', 'case-studies', 'blog', 'research', 'pricing', 'contact', 
    'company/about', 'company/team', 'company/careers', 'founder', 'platform', 'platform/ai-tools', 'platform/dashboard', 
    'platform/developers', 'platform/invoices', 'platform/projects', 'platform/startup-builder', 'developers', 
    'resources', 'resources/blog', 'resources/guides', 'resources/whitepapers', 'privacy', 'terms', 'status', 'changelog', 
    'community', 'security', 'compliance', 'legal/privacy', 'legal/terms'];
  
  if (staticRoutes.includes(slug)) {
    // For static routes, we still want to fetch from Sanity but fall back to registry content if needed
    const page = await getPageBySlug(slug);
    
    if (page) {
      return <PageContent page={page} />;
    }
    
    // Fall back to registry content
    const route = getRouteBySlug(slug)
    if (route) {
      return <PageContent page={route} />
    }
    
    // If neither Sanity nor registry has the page, show 404
    notFound()
  }
  
  // For dynamic routes, fetch from Sanity
  const page = await getPageBySlug(slug);

  // If no page found, show 404
  if (!page) {
    notFound()
  }

  return <PageContent page={page} />
}
