import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, getProductById } from '@/lib/data';
import { Container, Section, Button, Grid } from '@/components/ui';
import Link from 'next/link';

// Generate static params for all products
export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id,
  }));
}

// Generate metadata for each product
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductById(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found | Kritvia',
    };
  }

  return {
    title: `${product.name} | Kritvia Products`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductById(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter((p) => p.id !== product.id);

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[60vh] flex items-center pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-purple-950" />
        
        <Container className="relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Gradient header */}
            <div className={`h-2 bg-gradient-to-r ${product.gradient} rounded-full mb-8 max-w-xs mx-auto`} />
            
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-white tracking-tight mb-6 leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-primary-600 dark:text-primary-400 mb-6">
              {product.tagline}
            </p>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              {product.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      {product.features && (
        <Section>
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Everything you need to succeed
              </p>
            </div>
            <Grid cols={3} colsMobile={1} gap="lg">
              {product.features.map((feature, index) => (
                <div
                  key={feature}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-neutral-200/50 dark:shadow-neutral-800/50 border border-neutral-100 dark:border-neutral-800"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {feature}
                  </h3>
                </div>
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Related Products */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Explore Other Products
            </h2>
          </div>
          <Grid cols={3} colsMobile={1} gap="lg">
            {relatedProducts.map((related) => (
              <Link key={related.id} href={related.href}>
                <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-800">
                  <div className={`h-2 bg-gradient-to-r ${related.gradient}`} />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                      {related.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm mb-3">
                      {related.tagline}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      {related.description}
                    </p>
                  </div>
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
              Start your free trial
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Try {product.name} risk-free for 14 days.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-neutral-100">
                Get Started Now
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
