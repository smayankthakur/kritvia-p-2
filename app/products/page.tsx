import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Enterprise Products - Kritvia',
  description: 'Discover our suite of enterprise-grade products designed to transform your business operations.',
};

const products = [
  {
    slug: 'kritvia-ai',
    name: 'Kritvia AI',
    tagline: 'AI-Powered Analytics Platform',
    description: 'Transform your data into actionable insights with our advanced AI-powered analytics platform. Built for enterprise scale and security.',
    features: [
      'Real-time Analytics',
      'Predictive Modeling',
      'Custom ML Pipelines',
      'Data Visualization',
      'API Integration',
    ],
    icon: '🤖',
  },
  {
    slug: 'kritvia-cloud',
    name: 'Kritvia Cloud',
    tagline: 'Cloud Management Platform',
    description: 'Unified platform for managing your entire cloud infrastructure. Monitor, optimize, and scale your cloud resources from a single dashboard.',
    features: [
      'Multi-cloud Support',
      'Cost Optimization',
      'Security Monitoring',
      'Auto-scaling',
      'Compliance Tracking',
    ],
    icon: '☁️',
  },
  {
    slug: 'kritvia-crm',
    name: 'Kritvia CRM',
    tagline: 'Intelligent Customer Relationships',
    description: 'Next-generation CRM powered by AI. Understand your customers better and build lasting relationships with data-driven insights.',
    features: [
      'AI Lead Scoring',
      'Sales Forecasting',
      'Customer Segmentation',
      'Automation Workflows',
      'Integration Hub',
    ],
    icon: '💼',
  },
];

export default function ProductsPage() {
  return (
    <>
      <Section className="min-h-[50vh] flex items-center pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              Enterprise Products
            </h1>
            <p className="text-xl text-neutral-600">
              Ready-to-deploy platforms built for enterprise scale. Transform your business with our proven solutions.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid cols={1} gap="xl">
            {products.map((product) => (
              <Card key={product.slug} id={product.slug}>
                <CardContent className="p-12">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <span className="text-6xl mb-6 block">{product.icon}</span>
                      <h2 className="text-3xl font-bold text-neutral-900 mb-2">{product.name}</h2>
                      <p className="text-primary-600 font-medium mb-4">{product.tagline}</p>
                      <p className="text-neutral-600 mb-6">{product.description}</p>
                      <ul className="space-y-3 mb-8">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-neutral-700">
                            <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link href={`/products/${product.slug}`}>
                        <Button>View Details</Button>
                      </Link>
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center">
                      <span className="text-9xl opacity-50">{product.icon}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Need a custom solution?</h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              We also offer custom product development tailored to your specific business requirements.
            </p>
            <Link href="/contact">
              <Button>Contact Sales</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
