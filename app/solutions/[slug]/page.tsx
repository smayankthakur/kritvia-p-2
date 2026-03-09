import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { solutions, getSolutionById } from '@/lib/data';
import { Container, Section, Button, Grid } from '@/components/ui';
import Link from 'next/link';

// Generate static params for all solutions
export function generateStaticParams() {
  return solutions.map((solution) => ({
    slug: solution.id,
  }));
}

// Generate metadata for each solution
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const solution = getSolutionById(params.slug);
  
  if (!solution) {
    return {
      title: 'Solution Not Found | Kritvia',
    };
  }

  return {
    title: `${solution.title} | Kritvia Solutions`,
    description: solution.description,
    openGraph: {
      title: solution.title,
      description: solution.description,
      type: 'website',
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const solution = getSolutionById(params.slug);

  if (!solution) {
    notFound();
  }

  const relatedSolutions = solutions.filter((s) => s.id !== solution.id).slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[60vh] flex items-center pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-purple-950" />
        
        <Container className="relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-primary-200/50 rounded-full px-4 py-2 mb-8 shadow-sm">
              <span className="text-3xl">{solution.icon}</span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Solution</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-white tracking-tight mb-6 leading-tight">
              {solution.title}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              {solution.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="shadow-lg shadow-primary-500/25">
                  Get Started
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

      {/* Features Section */}
      {solution.features && (
        <Section>
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                Key Features
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                What sets our {solution.title.toLowerCase()} solution apart
              </p>
            </div>
            <Grid cols={2} colsMobile={1} colsTablet={2} gap="lg">
              {solution.features.map((feature, index) => (
                <div
                  key={feature}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-neutral-200/50 dark:shadow-neutral-800/50 border border-neutral-100 dark:border-neutral-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {feature}
                    </h3>
                  </div>
                </div>
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Related Solutions */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Explore Other Solutions
            </h2>
          </div>
          <Grid cols={3} colsMobile={1} gap="lg">
            {relatedSolutions.map((related) => (
              <Link key={related.id} href={related.href}>
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-800 h-full">
                  <span className="text-4xl mb-4 block">{related.icon}</span>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    {related.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {related.description}
                  </p>
                </div>
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
              Ready to get started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let us help you implement {solution.title.toLowerCase()} for your business.
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
