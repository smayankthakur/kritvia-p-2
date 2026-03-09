import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui';
import { client } from '@/lib/sanity/client';
import { getAllCaseStudiesQuery } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'Case Studies — Client Success Stories | Kritvia',
  description:
    'Real outcomes from real partnerships. See how Kritvia has helped companies transform with AI, cloud architecture, and custom software development.',
};

interface CaseStudy {
  _id: string;
  title: string;
  slug: { current: string };
  client: string;
  industry: string;
  summary: string;
  results: string[];
  technologies: string[];
}

const FALLBACK_STUDIES: CaseStudy[] = [
  {
    _id: '1',
    title: 'AI-Powered Fraud Detection Platform',
    slug: { current: 'fintech-fraud-detection' },
    client: 'Global FinTech (Confidential)',
    industry: 'Financial Services',
    summary: 'Built a real-time ML fraud detection system processing 2M+ transactions per day with 99.97% accuracy, reducing fraud losses by 78%.',
    results: ['78% reduction in fraud losses', '$45M saved annually', '2M+ transactions/day', '< 50ms detection latency'],
    technologies: ['Python', 'TensorFlow', 'AWS Kinesis', 'Redis', 'PostgreSQL'],
  },
  {
    _id: '2',
    title: 'Clinical Decision Support System',
    slug: { current: 'healthtech-clinical-ai' },
    client: 'HealthTech Corp',
    industry: 'Healthcare',
    summary: 'Deployed a HIPAA-compliant LLM-based clinical decision support system serving 1,200+ physicians with 40% faster diagnosis turnaround.',
    results: ['40% faster diagnosis', '1M+ patients served', '98% physician adoption', 'HIPAA compliant'],
    technologies: ['GPT-4', 'LangChain', 'GCP', 'Next.js', 'Postgres'],
  },
  {
    _id: '3',
    title: 'AI Personalization Engine',
    slug: { current: 'retail-personalization' },
    client: 'RetailAI Inc',
    industry: 'E-Commerce',
    summary: 'Built a real-time product recommendation engine that increased conversion rate by 34% and drove $12M in additional revenue in year one.',
    results: ['34% conversion uplift', '$12M additional revenue', '15ms recommendation latency', '50M+ recommendations/day'],
    technologies: ['Python', 'PyTorch', 'Pinecone', 'Kafka', 'Next.js'],
  },
  {
    _id: '4',
    title: 'Enterprise Cloud Migration',
    slug: { current: 'cloudscale-migration' },
    client: 'CloudScale Systems',
    industry: 'SaaS',
    summary: 'Migrated a monolithic on-premise system to a cloud-native Kubernetes architecture, reducing infrastructure costs by 45% and deployment time from days to minutes.',
    results: ['45% cost reduction', '99.99% uptime achieved', 'Deploy: days → minutes', '10x performance improvement'],
    technologies: ['AWS', 'Kubernetes', 'Terraform', 'Go', 'PostgreSQL'],
  },
  {
    _id: '5',
    title: 'Automated Document Processing Platform',
    slug: { current: 'legal-document-automation' },
    client: 'LegalTech Partners',
    industry: 'Legal Services',
    summary: 'Built an AI-powered document analysis system that processes contracts in seconds instead of hours, saving 2,400 attorney-hours per month.',
    results: ['2,400 hours saved monthly', '95% accuracy on extraction', '500% ROI in year 1', '300+ document types processed'],
    technologies: ['GPT-4', 'Azure', 'Python', 'React', 'MongoDB'],
  },
  {
    _id: '6',
    title: 'Real-Time Analytics Platform',
    slug: { current: 'logistics-analytics' },
    client: 'LogiMetrics',
    industry: 'Logistics',
    summary: 'Engineered a streaming analytics platform ingesting 50GB+ of sensor data daily, providing real-time operational visibility across 10,000+ fleet vehicles.',
    results: ['50GB+ data ingested daily', '10,000+ vehicles tracked', '30% fuel efficiency gain', 'Real-time alerting < 1s'],
    technologies: ['Kafka', 'Apache Flink', 'ClickHouse', 'Grafana', 'GCP'],
  },
];

async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const studies = await client.fetch(getAllCaseStudiesQuery);
    return studies && studies.length > 0 ? studies : FALLBACK_STUDIES;
  } catch {
    return FALLBACK_STUDIES;
  }
}

const INDUSTRY_COLORS: Record<string, string> = {
  'Financial Services': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Healthcare': 'bg-green-500/10 text-green-400 border-green-500/20',
  'E-Commerce': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'SaaS': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Legal Services': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Logistics': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      {/* Hero */}
      <Section className="bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 text-xs font-semibold uppercase tracking-wider mb-6">
              Case Studies
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Results That{' '}
              <span className="bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent">
                Define Partnerships
              </span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              We measure success by the value we create for our clients. Here are some of our proudest partnerships — with real numbers.
            </p>
          </div>
        </Container>
      </Section>

      {/* Summary Stats */}
      <div className="bg-neutral-900/50 border-y border-neutral-800">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
            {[
              { value: '50+', label: 'Clients Served' },
              { value: '$2B+', label: 'Value Generated' },
              { value: '150+', label: 'Projects Shipped' },
              { value: '98%', label: 'Client Retention' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Case Studies Grid */}
      <Section className="bg-neutral-950">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs) => {
              const industryColor = INDUSTRY_COLORS[cs.industry] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
              return (
                <div
                  key={cs._id}
                  className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-b border-neutral-800 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${industryColor}`}>
                        {cs.industry}
                      </span>
                      <span className="text-xs text-neutral-600">{cs.client}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">
                      {cs.title}
                    </h2>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-neutral-400 text-sm leading-relaxed mb-5">{cs.summary}</p>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {cs.results.slice(0, 4).map((result) => (
                        <div key={result} className="flex items-start gap-2 text-sm">
                          <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-neutral-300 leading-tight">{result}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {cs.technologies.slice(0, 5).map((tech) => (
                        <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/case-studies/${cs.slug.current}`}
                      className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                    >
                      Read full case study →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-neutral-900/50 border-t border-neutral-800">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-neutral-400 mb-8">
              Let's explore how we can help you achieve similar results. Start with a free strategy session.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors"
            >
              Start Your Project
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
