import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Products - Kritvia',
  description: 'Discover our suite of AI-powered products designed to transform your business operations.',
};

const products = [
  {
    slug: 'trinity-os',
    name: 'Trinity OS',
    tagline: 'AI Operating System',
    description: 'The next-generation AI operating system for building, deploying, and scaling intelligent applications. Trinity OS provides the foundational infrastructure for modern AI development.',
    features: [
      'Unified AI Runtime',
      'Real-time Model Serving',
      'Edge Computing Support',
      'Auto-scaling Infrastructure',
      'Enterprise Security',
    ],
    icon: '🧠',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    slug: 'ai-cloud',
    name: 'Kritvia AI Cloud',
    tagline: 'Cloud Infrastructure',
    description: 'Global cloud infrastructure optimized for AI workloads. Deploy and scale your AI with enterprise applications-grade reliability and performance.',
    features: [
      '30+ Global Regions',
      'GPU instances',
      '99.99% Uptime',
      'Real-time Inference',
      'Cost Optimization',
    ],
    icon: '☁️',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    slug: 'agents',
    name: 'Kritvia Agents',
    tagline: 'Autonomous AI Agents',
    description: 'Build, deploy, and manage autonomous AI agents that can reason, plan, and execute complex tasks.',
    features: [
      'Multi-agent Orchestration',
      'Tool Integration',
      'Memory & Context',
      'Safety Guardrails',
      'Real-time Monitoring',
    ],
    icon: '🤖',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    slug: 'dev-platform',
    name: 'Dev Platform',
    tagline: 'Developer Tools',
    description: 'Complete developer toolkit for building AI-powered applications. SDKs, APIs, and CLI for seamless integration.',
    features: [
      'REST & GraphQL APIs',
      'SDKs (JS, Python, Go, Rust)',
      'CLI Tools',
      'Sandbox Environment',
      'Webhooks',
    ],
    icon: '🛠️',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    slug: 'kritvia-ai',
    name: 'Kritvia AI',
    tagline: 'AI-Powered Analytics',
    description: 'Transform your data into actionable insights with our advanced AI-powered analytics platform.',
    features: [
      'Real-time Analytics',
      'Predictive Modeling',
      'Custom ML Pipelines',
      'Data Visualization',
      'API Integration',
    ],
    icon: '📊',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    slug: 'kritvia-cloud',
    name: 'Kritvia Cloud',
    tagline: 'Cloud Management',
    description: 'Unified platform for managing your entire cloud infrastructure.',
    features: [
      'Multi-cloud Support',
      'Cost Optimization',
      'Security Monitoring',
      'Auto-scaling',
      'Compliance Tracking',
    ],
    icon: '🌐',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

export default function ProductsPage() {
  return (
    <>
      <Section className="min-h-[50vh] flex items-center pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6">
              Products
            </h1>
            <p className="text-xl text-slate-400">
              Ready-to-deploy AI platforms built for enterprise scale. Transform your business with our proven solutions.
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
                      <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
                      <p className="text-primary-400 font-medium mb-4">{product.tagline}</p>
                      <p className="text-slate-400 mb-6">{product.description}</p>
                      <ul className="space-y-3 mb-8">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-slate-300">
                            <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                    <div className={`aspect-square bg-gradient-to-br ${product.gradient} rounded-2xl flex items-center justify-center opacity-80`}>
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
            <h2 className="text-3xl font-bold text-white mb-4">Need a custom solution?</h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
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
