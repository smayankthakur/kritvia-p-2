import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { industries, getIndustryById } from '@/lib/data';
import { Container, Section, Button, Grid, Card, CardContent } from '@/components/ui';
import Link from 'next/link';

// Generate static params for all industries
export function generateStaticParams() {
  return industries.map((industry) => ({
    slug: industry.id,
  }));
}

// Generate metadata for each industry
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const industry = getIndustryById(params.slug);
  
  if (!industry) {
    return {
      title: 'Industry Not Found | Kritvia',
    };
  }

  return {
    title: `${industry.title} Solutions | Kritvia`,
    description: industry.description,
    openGraph: {
      title: industry.title,
      description: industry.description,
      type: 'website',
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

export default function IndustryPage({ params }: { params: { slug: string } }) {
  const industry = getIndustryById(params.slug);

  if (!industry) {
    notFound();
  }

  const relatedIndustries = industries.filter((i) => i.id !== industry.id);

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[60vh] flex items-center pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-purple-950" />
        
        <Container className="relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-primary-200/50 rounded-full px-4 py-2 mb-8 shadow-sm">
              <span className="text-3xl">{industry.icon}</span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Industry</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-white tracking-tight mb-6 leading-tight">
              {industry.title}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              {industry.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="shadow-lg shadow-primary-500/25">
                  Talk to an Expert
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button size="lg" variant="outline">
                  View Case Studies
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Why Choose Us for This Industry */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Why Choose Kritvia for {industry.title}
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              We understand the unique challenges in the {industry.title.toLowerCase()} sector
            </p>
          </div>
          <Grid cols={3} colsMobile={1} gap="lg">
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  Industry Compliance
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  We build solutions that meet industry-specific regulations and standards.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  Scalable Solutions
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Our solutions grow with your business, handling increased demand seamlessly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  Expert Team
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Work with professionals who understand your industry inside and out.
                </p>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Related Industries */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Explore Other Industries
            </h2>
          </div>
          <Grid cols={3} colsMobile={1} gap="lg">
            {relatedIndustries.map((related) => (
              <Link key={related.id} href={related.href}>
                <Card hover className="h-full">
                  <CardContent className="p-8 text-center">
                    <span className="text-5xl mb-4 block">{related.icon}</span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      {related.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {related.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section variant="primary">
        <Container>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to transform your {industry.title.toLowerCase()} business?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let us help you leverage technology to achieve your goals.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-neutral-100">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
