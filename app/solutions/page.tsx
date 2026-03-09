import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Enterprise Solutions - Kritvia',
  description: 'Comprehensive technology solutions including AI development, web development, SaaS platforms, cloud architecture, and automation services.',
};

const solutions = [
  {
    slug: 'ai-development',
    title: 'AI Development',
    tagline: 'Intelligent solutions for the modern enterprise',
    description: 'Leverage the power of artificial intelligence to transform your business operations. Our AI solutions include machine learning models, natural language processing, computer vision, and predictive analytics.',
    features: [
      'Machine Learning Models',
      'Natural Language Processing',
      'Computer Vision',
      'Predictive Analytics',
      'AI Strategy Consulting',
    ],
    icon: '🤖',
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    tagline: 'Modern applications built for scale',
    description: 'Build high-performance web applications with cutting-edge technologies. We deliver scalable, secure, and maintainable solutions using Next.js, React, and modern frameworks.',
    features: [
      'Custom Web Applications',
      'Progressive Web Apps',
      'E-commerce Platforms',
      'API Development',
      'Performance Optimization',
    ],
    icon: '🌐',
  },
  {
    slug: 'saas-development',
    title: 'SaaS Development',
    tagline: 'Build recurring revenue platforms',
    description: 'Create scalable software-as-a-service platforms designed for growth. Our SaaS development covers multi-tenant architecture, subscription management, and cloud-native solutions.',
    features: [
      'Multi-tenant Architecture',
      'Subscription Management',
      'Cloud-native Development',
      'SaaS Security',
      'Integration APIs',
    ],
    icon: '📱',
  },
  {
    slug: 'cloud-architecture',
    title: 'Cloud Architecture',
    tagline: 'Enterprise-grade cloud solutions',
    description: 'Design and implement robust cloud infrastructure on AWS, Azure, or GCP. We build scalable, secure, and cost-effective cloud solutions for enterprises.',
    features: [
      'Cloud Migration',
      'Infrastructure as Code',
      'Microservices Architecture',
      'Container Orchestration',
      'DevOps & CI/CD',
    ],
    icon: '☁️',
  },
  {
    slug: 'automation',
    title: 'Automation',
    tagline: 'Streamline your business processes',
    description: 'Automate repetitive tasks and streamline business processes with our custom automation solutions. Improve efficiency and reduce operational costs.',
    features: [
      'Workflow Automation',
      'RPA Implementation',
      'Process Optimization',
      'Custom Integrations',
      'Monitoring & Analytics',
    ],
    icon: '⚙️',
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Section className="min-h-[50vh] flex items-center pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              Enterprise Solutions
            </h1>
            <p className="text-xl text-neutral-600">
              Comprehensive technology solutions designed to transform your business operations and drive growth.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid cols={2} colsMobile={1} gap="xl">
            {solutions.map((solution) => (
              <Card key={solution.slug} id={solution.slug} className="group">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="text-5xl">{solution.icon}</span>
                    <div className="flex-1">
                      <Link href={`/solutions/${solution.slug}`}>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {solution.title}
                        </h2>
                      </Link>
                      <p className="text-primary-600 font-medium mb-3">{solution.tagline}</p>
                      <p className="text-neutral-600 mb-4">{solution.description}</p>
                      <ul className="space-y-2 mb-6">
                        {solution.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-neutral-700 text-sm">
                            <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link href={`/solutions/${solution.slug}`}>
                        <Button variant="outline" size="sm">Learn More</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section variant="primary">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need a custom solution?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss your specific requirements and create a tailored solution for your business.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-neutral-100">
                Get in Touch
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
