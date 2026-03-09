import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent } from '@/components/ui';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Industries We Serve - Kritvia',
  description: 'Kritvia serves enterprises across multiple industries including fintech, healthcare, e-commerce, and startups.',
};

const industries = [
  {
    slug: 'startups',
    name: 'Startups',
    tagline: 'From idea to enterprise',
    description: 'We help startups build scalable technology foundations. From MVP development to enterprise scaling, we partner with you at every stage of growth.',
    services: ['MVP Development', 'Product-Market Fit', 'Scale Engineering', 'Technical Advisory'],
    emoji: '🚀',
  },
  {
    slug: 'fintech',
    name: 'Fintech',
    tagline: 'Secure financial technology',
    description: 'Enterprise fintech solutions built for security and compliance. We understand the unique challenges of the financial services industry.',
    services: ['Payment Processing', 'Fraud Detection', 'Regulatory Compliance', 'Banking APIs'],
    emoji: '💰',
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    tagline: 'HIPAA-compliant solutions',
    description: 'Build secure, compliant healthcare technology. Our solutions meet strict regulatory requirements while improving patient outcomes.',
    services: ['Patient Portals', 'Telemedicine', 'Health Data Analytics', 'HIPAA Compliance'],
    emoji: '🏥',
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    tagline: 'Scalable retail platforms',
    description: 'High-performance e-commerce solutions that drive sales. From small stores to enterprise marketplaces, we build platforms that scale.',
    services: ['Store Development', 'Inventory Management', 'Payment Integration', 'Analytics'],
    emoji: '🛒',
  },
];

export default function IndustriesPage() {
  return (
    <>
      <Section className="min-h-[50vh] flex items-center pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              Industries We Serve
            </h1>
            <p className="text-xl text-neutral-600">
              Deep expertise across multiple industries. We understand your unique challenges and deliver tailored solutions.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid cols={2} colsMobile={1} gap="xl">
            {industries.map((industry) => (
              <Card key={industry.slug} id={industry.slug}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="text-5xl">{industry.emoji}</span>
                    <div>
                      <Link href={`/industries/${industry.slug}`}>
                        <h2 className="text-2xl font-bold text-neutral-900 hover:text-primary-600 transition-colors">
                          {industry.name}
                        </h2>
                      </Link>
                      <p className="text-primary-600 font-medium">{industry.tagline}</p>
                    </div>
                  </div>
                  <p className="text-neutral-600 mb-6">{industry.description}</p>
                  <ul className="space-y-2">
                    {industry.services.map((service) => (
                      <li key={service} className="flex items-center gap-2 text-neutral-700 text-sm">
                        <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {service}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Don't see your industry?</h2>
            <p className="text-lg text-neutral-600 mb-8">
              We work with enterprises across many sectors. Let's discuss your specific needs.
            </p>
            <Link href="/contact">
              <span className="inline-block bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
                Get in Touch
              </span>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
