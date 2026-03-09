import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Button } from '@/components/ui';
import { TestimonialCarousel, TechStack } from '@/components/features';

export const metadata: Metadata = {
  title: 'Kritvia — Enterprise AI & Technology Consulting',
  description:
    'Kritvia partners with enterprises to build AI-native products, scalable cloud infrastructure, and custom software that creates competitive advantage. Trusted by 50+ companies worldwide.',
  openGraph: {
    title: 'Kritvia — Enterprise AI & Technology Consulting',
    description: 'Build AI-native products, scalable cloud infrastructure, and custom software with Kritvia.',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630 }],
  },
};

// Static data for performance — enriched by CMS in production
const stats = [
  { value: '50+', label: 'Enterprise Clients' },
  { value: '150+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Retention' },
  { value: '$2B+', label: 'Value Generated' },
];

const services = [
  {
    icon: '🤖',
    title: 'AI & Machine Learning',
    description: 'Custom LLM integrations, RAG pipelines, computer vision, predictive analytics, and AI-powered product features.',
    href: '/services',
    tags: ['LLM', 'RAG', 'MLOps', 'Computer Vision'],
  },
  {
    icon: '☁️',
    title: 'Cloud Architecture',
    description: 'Enterprise-grade AWS, GCP, and Azure architectures designed for scale, resilience, and cost efficiency.',
    href: '/services',
    tags: ['AWS', 'GCP', 'Azure', 'Terraform'],
  },
  {
    icon: '⚡',
    title: 'SaaS Development',
    description: 'Full-stack SaaS platforms from MVP to enterprise, built with modern Next.js, TypeScript, and microservices.',
    href: '/services',
    tags: ['Next.js', 'TypeScript', 'APIs', 'Microservices'],
  },
  {
    icon: '🔄',
    title: 'AI Automation',
    description: 'Intelligent workflow automation, RPA bots, and agentic AI systems that eliminate operational bottlenecks.',
    href: '/services',
    tags: ['Agents', 'RPA', 'LangChain', 'n8n'],
  },
  {
    icon: '📊',
    title: 'Data Engineering',
    description: 'End-to-end data pipelines, real-time analytics platforms, and data warehouses that power business intelligence.',
    href: '/services',
    tags: ['Spark', 'dbt', 'Kafka', 'Snowflake'],
  },
  {
    icon: '🔒',
    title: 'Security & Compliance',
    description: 'Security-first architecture reviews, penetration testing, and compliance frameworks for regulated industries.',
    href: '/services',
    tags: ['SOC 2', 'HIPAA', 'ISO 27001', 'Zero Trust'],
  },
];

const caseStudies = [
  {
    client: 'Global FinTech',
    industry: 'Financial Services',
    title: 'AI Fraud Detection Platform',
    result: '78% reduction in fraud losses',
    metric: '$45M saved annually',
    tags: ['AI/ML', 'Real-time', 'AWS'],
    color: 'from-blue-600/20 to-blue-900/10',
  },
  {
    client: 'HealthTech Corp',
    industry: 'Healthcare',
    title: 'Clinical Decision Support System',
    result: '40% faster diagnosis',
    metric: '1M+ patients served',
    tags: ['LLM', 'HIPAA', 'GCP'],
    color: 'from-green-600/20 to-green-900/10',
  },
  {
    client: 'RetailAI Inc',
    industry: 'E-Commerce',
    title: 'Personalization Engine',
    result: '34% conversion uplift',
    metric: '$12M additional revenue',
    tags: ['ML', 'Real-time', 'Microservices'],
    color: 'from-purple-600/20 to-purple-900/10',
  },
];

const processSteps = [
  { number: '01', title: 'Discovery', description: 'We deep-dive into your business goals, technical constraints, and competitive landscape to define the right solution.' },
  { number: '02', title: 'Architecture', description: 'Our architects design a scalable, future-proof system blueprint with technology choices validated by your team.' },
  { number: '03', title: 'Delivery', description: 'Agile sprints with weekly demos, CI/CD pipelines, and continuous feedback loops ensure on-time delivery.' },
  { number: '04', title: 'Scale', description: 'Post-launch monitoring, optimization, and ongoing engineering support to evolve your system as you grow.' },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <Section className="relative overflow-hidden min-h-[90vh] flex items-center bg-neutral-950">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        {/* Gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-600/10 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              Now offering AI strategy workshops → 
              <Link href="/contact" className="underline underline-offset-4">Book a session</Link>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              Build AI-Native{' '}
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-300 bg-clip-text text-transparent">
                Products That Scale
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-10">
              Kritvia partners with technology leaders to architect, build, and deploy AI-powered systems that create lasting competitive advantage — from concept to production in weeks, not months.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-base transition-all hover:shadow-xl hover:shadow-primary-900/30 hover:-translate-y-0.5"
              >
                Start Your Project
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl text-base transition-all"
              >
                View Case Studies
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-2xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-600 animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </Section>

      {/* ── TRUSTED BY ── */}
      <div className="border-y border-neutral-800 bg-neutral-950 py-8">
        <Container>
          <p className="text-center text-xs font-semibold text-neutral-600 uppercase tracking-widest mb-6">
            Trusted by forward-thinking companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale">
            {['TechCorp', 'DataFlow Systems', 'CloudNine', 'InnovateTech', 'FutureLabs', 'QuantumEdge'].map((name) => (
              <span key={name} className="text-neutral-300 font-semibold text-lg tracking-tight">{name}</span>
            ))}
          </div>
        </Container>
      </div>

      {/* ── SERVICES ── */}
      <Section className="bg-neutral-950">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4">
              What We Do
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              End-to-End Technology Services
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              From AI strategy to production deployment — we cover the full stack of modern technology consulting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-800/50 hover:border-primary-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Explore all services →
            </Link>
          </div>
        </Container>
      </Section>

      {/* ── CASE STUDIES ── */}
      <Section className="bg-neutral-900/50">
        <Container>
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Results That Speak
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Featured Case Studies</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Real outcomes from real partnerships. See how we've helped companies transform with technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {caseStudies.map((cs) => (
              <div
                key={cs.title}
                className={`bg-gradient-to-br ${cs.color} border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{cs.industry}</span>
                  <div className="flex gap-1">
                    {cs.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-neutral-800/80 text-neutral-400">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="text-sm font-medium text-neutral-400 mb-1">{cs.client}</div>
                <h3 className="text-lg font-bold text-white mb-3">{cs.title}</h3>
                <div className="border-t border-neutral-800 pt-4 mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{cs.metric}</div>
                    <div className="text-sm text-neutral-400">{cs.result}</div>
                  </div>
                  <Link href="/case-studies" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/case-studies" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-xl text-sm font-medium transition-colors">
              View All Case Studies
            </Link>
          </div>
        </Container>
      </Section>

      {/* ── HOW WE WORK ── */}
      <Section className="bg-neutral-950">
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Our Proven Process</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              A systematic approach to delivering complex technology projects on time and on budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary-700/50 to-transparent z-10" />
                )}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="text-4xl font-black text-primary-600/40 mb-4">{step.number}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section className="bg-neutral-900/50">
        <Container>
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Client Stories
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <TestimonialCarousel />
          </div>
        </Container>
      </Section>

      {/* ── TECH STACK ── */}
      <Section className="bg-neutral-950">
        <Container>
          <TechStack
            title="Our Technology Stack"
            subtitle="We use the best tools for the job — battle-tested at scale and aligned with your team's capabilities."
          />
        </Container>
      </Section>

      {/* ── CTA ── */}
      <Section className="bg-gradient-to-br from-primary-950 via-neutral-950 to-secondary-950 border-y border-neutral-800">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Build Something{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Exceptional?
              </span>
            </h2>
            <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
              Join 50+ companies that trust Kritvia to build the technology that powers their growth. Start with a free 60-minute strategy session.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-lg transition-all hover:shadow-2xl hover:shadow-primary-900/40 hover:-translate-y-0.5"
              >
                Book Free Strategy Session
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl text-lg transition-all"
              >
                Explore Pricing
              </Link>
            </div>
            <p className="text-neutral-600 text-sm mt-6">No commitment required. 60-minute session. Expert engineers.</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
