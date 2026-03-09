import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Services — Enterprise Technology Consulting',
  description:
    'From AI development to cloud architecture, Kritvia delivers end-to-end technology services for enterprises ready to compete in the AI era.',
};

const services = [
  {
    slug: 'ai-development',
    icon: '🤖',
    title: 'AI & Machine Learning',
    tagline: 'Build Intelligent Systems at Scale',
    description:
      'We design and deploy custom AI solutions — from LLM integrations and RAG pipelines to computer vision and predictive analytics. Our ML engineers have shipped 30+ AI products in production.',
    highlights: [
      'Large Language Model (LLM) integrations & fine-tuning',
      'Retrieval-Augmented Generation (RAG) systems',
      'Computer vision & image recognition',
      'Predictive analytics & forecasting models',
      'MLOps pipelines & model monitoring',
      'AI-powered product features',
    ],
    tags: ['GPT-4', 'Claude', 'LangChain', 'PyTorch', 'TensorFlow', 'Hugging Face'],
    color: 'from-blue-600/20 to-blue-900/5',
    borderColor: 'border-blue-700/30',
  },
  {
    slug: 'cloud-architecture',
    icon: '☁️',
    title: 'Cloud Architecture',
    tagline: 'Scalable, Resilient, Cost-Efficient Infrastructure',
    description:
      'We architect and migrate enterprise systems to AWS, GCP, and Azure. Our cloud engineers have designed infrastructure handling billions of requests with 99.99% uptime.',
    highlights: [
      'Cloud-native architecture design',
      'Multi-cloud & hybrid cloud strategies',
      'Cost optimization (avg. 35% reduction)',
      'Infrastructure as Code (Terraform, Pulumi)',
      'Kubernetes orchestration & GitOps',
      'Security & compliance frameworks',
    ],
    tags: ['AWS', 'GCP', 'Azure', 'Terraform', 'Kubernetes', 'Docker'],
    color: 'from-cyan-600/20 to-cyan-900/5',
    borderColor: 'border-cyan-700/30',
  },
  {
    slug: 'saas-development',
    icon: '⚡',
    title: 'SaaS Development',
    tagline: 'From MVP to Enterprise-Grade Platform',
    description:
      'We build full-stack SaaS products that scale from zero to millions of users. Using Next.js, TypeScript, and microservices, we deliver production-ready platforms in weeks.',
    highlights: [
      'Full-stack Next.js / React development',
      'Multi-tenant SaaS architecture',
      'Payment integrations (Stripe, Razorpay)',
      'Real-time features with WebSockets',
      'Authentication, RBAC, and SSO',
      'API design & developer documentation',
    ],
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'GraphQL', 'Stripe'],
    color: 'from-violet-600/20 to-violet-900/5',
    borderColor: 'border-violet-700/30',
  },
  {
    slug: 'ai-automation',
    icon: '🔄',
    title: 'AI Automation',
    tagline: 'Eliminate Operational Bottlenecks with AI Agents',
    description:
      'We build intelligent automation systems — from AI agents that handle complex workflows to RPA bots that replace repetitive tasks, saving hundreds of engineering hours per month.',
    highlights: [
      'Agentic AI systems with LangChain & AutoGen',
      'RPA bot development (UiPath, Automation Anywhere)',
      'Document processing & intelligent OCR',
      'Email & communication automation',
      'Workflow orchestration (n8n, Zapier)',
      'Custom API integrations',
    ],
    tags: ['LangChain', 'AutoGen', 'n8n', 'UiPath', 'Python', 'Webhooks'],
    color: 'from-green-600/20 to-green-900/5',
    borderColor: 'border-green-700/30',
  },
  {
    slug: 'data-engineering',
    icon: '📊',
    title: 'Data Engineering',
    tagline: 'Turn Raw Data into Business Intelligence',
    description:
      'We build robust data infrastructure — ETL pipelines, real-time streaming platforms, and analytics dashboards that give you the insights to make faster, smarter decisions.',
    highlights: [
      'Data pipeline development (ETL/ELT)',
      'Real-time streaming (Apache Kafka)',
      'Data warehouse design (Snowflake, BigQuery)',
      'Business intelligence dashboards',
      'Vector databases for AI (Pinecone, Weaviate)',
      'Data governance & quality frameworks',
    ],
    tags: ['Apache Spark', 'Kafka', 'dbt', 'Snowflake', 'Airflow', 'Pinecone'],
    color: 'from-orange-600/20 to-orange-900/5',
    borderColor: 'border-orange-700/30',
  },
  {
    slug: 'security-compliance',
    icon: '🔒',
    title: 'Security & Compliance',
    tagline: 'Security-First Engineering for Regulated Industries',
    description:
      'We integrate security at every layer of your stack and guide you through SOC 2, HIPAA, ISO 27001, and GDPR compliance — so you can close enterprise deals faster.',
    highlights: [
      'Architecture security reviews',
      'Penetration testing & vulnerability assessment',
      'SOC 2 Type II readiness',
      'HIPAA compliance implementation',
      'Zero Trust network architecture',
      'Incident response planning',
    ],
    tags: ['SOC 2', 'HIPAA', 'ISO 27001', 'GDPR', 'Zero Trust', 'PCI DSS'],
    color: 'from-red-600/20 to-red-900/5',
    borderColor: 'border-red-700/30',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-6">
              Services
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Technology Services for{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                the AI Era
              </span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed mb-8">
              End-to-end technology consulting from strategy to production. We embed with your team to architect, build, and scale systems that create lasting competitive advantage.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors">
                Start a Project
              </Link>
              <Link href="/case-studies" className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-medium rounded-xl transition-colors">
                View Our Work
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section className="bg-neutral-950">
        <Container>
          <div className="space-y-8">
            {services.map((service, i) => (
              <div
                key={service.slug}
                id={service.slug}
                className={`bg-gradient-to-br ${service.color} border ${service.borderColor} rounded-2xl p-8 lg:p-10`}
              >
                <div className={`grid lg:grid-cols-2 gap-8 items-start ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{service.icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{service.title}</h2>
                        <p className="text-sm text-primary-400 font-medium">{service.tagline}</p>
                      </div>
                    </div>
                    <p className="text-neutral-300 leading-relaxed mb-6">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.tags.map((tag) => (
                        <span key={tag} className="text-xs px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-neutral-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors text-sm"
                    >
                      Discuss this service →
                    </Link>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">What We Deliver</h3>
                    <ul className="space-y-3">
                      {service.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-neutral-300 text-sm">
                          <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-neutral-900/50 border-t border-neutral-800">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Not sure which service you need?</h2>
            <p className="text-neutral-400 mb-8">Book a free 60-minute technology assessment and we'll map out the right approach for your specific business goals.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors">
              Schedule Free Assessment
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
