import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Button } from '@/components/ui';
import { TestimonialCarousel, TechStack } from '@/components/features';

export const metadata: Metadata = {
  title: 'Kritvia — Engineering AI-Powered Digital Platforms',
  description:
    'Kritvia partners with enterprises to build AI-native products, scalable cloud infrastructure, and custom software that creates competitive advantage. Trusted by 50+ companies worldwide.',
  openGraph: {
    title: 'Kritvia — Engineering AI-Powered Digital Platforms',
    description: 'Build AI-native products, scalable cloud infrastructure, and custom software with Kritvia.',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630 }],
  },
};

// Premium client logos for trust section
const trustedClients = [
  { name: 'Stripe', logo: 'S' },
  { name: 'Vercel', logo: 'V' },
  { name: 'Linear', logo: 'L' },
  { name: 'Notion', logo: 'N' },
  { name: 'Figma', logo: 'F' },
  { name: 'Slack', logo: 'S' },
];

// Stats for trust section
const stats = [
  { value: '50+', label: 'Enterprise Clients', suffix: '' },
  { value: '150+', label: 'Projects Delivered', suffix: '' },
  { value: '98%', label: 'Client Retention', suffix: '' },
  { value: '$2B+', label: 'Value Generated', suffix: '' },
];

// Services data
const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'AI & Machine Learning',
    description: 'Custom LLM integrations, RAG pipelines, computer vision, predictive analytics, and AI-powered product features.',
    href: '/services',
    tags: ['LLM', 'RAG', 'MLOps', 'Computer Vision'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: 'Cloud Architecture',
    description: 'Enterprise-grade AWS, GCP, and Azure architectures designed for scale, resilience, and cost efficiency.',
    href: '/services',
    tags: ['AWS', 'GCP', 'Azure', 'Terraform'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'SaaS Development',
    description: 'Full-stack SaaS platforms from MVP to enterprise, built with modern Next.js, TypeScript, and microservices.',
    href: '/services',
    tags: ['Next.js', 'TypeScript', 'APIs', 'Microservices'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'AI Automation',
    description: 'Intelligent workflow automation, RPA bots, and agentic AI systems that eliminate operational bottlenecks.',
    href: '/services',
    tags: ['Agents', 'RPA', 'LangChain', 'n8n'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Data Engineering',
    description: 'End-to-end data pipelines, real-time analytics platforms, and data warehouses that power business intelligence.',
    href: '/services',
    tags: ['Spark', 'dbt', 'Kafka', 'Snowflake'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Security & Compliance',
    description: 'Security-first architecture reviews, penetration testing, and compliance frameworks for regulated industries.',
    href: '/services',
    tags: ['SOC 2', 'HIPAA', 'ISO 27001', 'Zero Trust'],
  },
];

// Solutions data - 5 solutions
const solutions = [
  {
    title: 'AI Development',
    description: 'Intelligent AI solutions tailored to your business needs',
    href: '/solutions/ai-development',
    icon: '🤖',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Web Development',
    description: 'Modern web applications that scale with your business',
    href: '/solutions/web-development',
    icon: '🌐',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'SaaS Development',
    description: 'Scalable multi-tenant platforms for B2B and B2C',
    href: '/solutions/saas-development',
    icon: '☁️',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Cloud Architecture',
    description: 'Enterprise cloud solutions built for resilience',
    href: '/solutions/cloud-architecture',
    icon: '🏗️',
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Automation',
    description: 'Business process automation to boost efficiency',
    href: '/solutions/automation',
    icon: '⚡',
    color: 'from-red-500 to-rose-500',
  },
];

// Case studies with metrics
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

// Products for future SaaS
const products = [
  {
    name: 'Kritvia AI',
    description: 'AI-powered analytics platform',
    href: '/products/kritvia-ai',
    status: 'Coming Soon',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Kritvia Cloud',
    description: 'Cloud management platform',
    href: '/products/kritvia-cloud',
    status: 'Coming Soon',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    name: 'Kritvia CRM',
    description: 'Next-gen customer relationship management',
    href: '/products/kritvia-crm',
    status: 'Coming Soon',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 03 3  3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

// Blog/Insights data
const insights = [
  {
    title: 'Building Production-Ready RAG Systems',
    description: 'A comprehensive guide to implementing retrieval-augmented generation at scale.',
    category: 'Engineering',
    date: 'Mar 5, 2026',
    readTime: '12 min read',
    href: '/blog',
  },
  {
    title: 'The Future of AI Agents in Enterprise',
    description: 'How autonomous agents are transforming business operations and decision making.',
    category: 'AI Strategy',
    date: 'Feb 28, 2026',
    readTime: '8 min read',
    href: '/blog',
  },
  {
    title: 'Scaling Next.js Applications to Millions',
    description: 'Performance optimization techniques for high-traffic Next.js deployments.',
    category: 'Engineering',
    date: 'Feb 21, 2026',
    readTime: '10 min read',
    href: '/blog',
  },
];

// Process steps
const processSteps = [
  { 
    number: '01', 
    title: 'Discovery', 
    description: 'We deep-dive into your business goals, technical constraints, and competitive landscape to define the right solution.' 
  },
  { 
    number: '02', 
    title: 'Architecture', 
    description: 'Our architects design a scalable, future-proof system blueprint with technology choices validated by your team.' 
  },
  { 
    number: '03', 
    title: 'Delivery', 
    description: 'Agile sprints with weekly demos, CI/CD pipelines, and continuous feedback loops ensure on-time delivery.' 
  },
  { 
    number: '04', 
    title: 'Scale', 
    description: 'Post-launch monitoring, optimization, and ongoing engineering support to evolve your system as you grow.' 
  },
];

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION - Premium, Stripe-style with gradient accents
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-neutral-950">
        {/* Animated grid background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-sm font-medium mb-10 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              <span>Now offering AI strategy workshops</span>
              <span className="text-neutral-500">→</span>
            </div>

            {/* Main headline - Engineering AI-Powered Digital Platforms */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-8">
              Engineering{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-400/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0 9c50-6 100-6 200 0" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
              <br />
              Digital Platforms
            </h1>

            <p className="text-xl lg:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-12">
              Kritvia partners with technology leaders to architect, build, and deploy AI-powered systems that create lasting competitive advantage — from concept to production in weeks, not months.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-20">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-950 font-semibold rounded-xl text-base transition-all hover:bg-neutral-100 hover:shadow-xl hover:shadow-white/10 hover:-translate-y-0.5"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto pt-8 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">{stat.value}{stat.suffix}</div>
                  <div className="text-sm text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-600">
          <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex justify-center pt-2">
            <div className="w-1 h-2 bg-neutral-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST SECTION - Client logos and metrics
      ═══════════════════════════════════════════════════════════ */}
      <div className="border-y border-neutral-800/50 bg-neutral-950 py-16">
        <Container>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">
              Trusted by forward-thinking companies
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {trustedClients.map((client) => (
              <div 
                key={client.name} 
                className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-lg group-hover:border-primary-500/50 transition-colors">
                  {client.logo}
                </div>
                <span className="text-lg font-medium">{client.name}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES SECTION - 6 service cards with premium design
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-neutral-950 relative">
        {/* Background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4">
              What We Do
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
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
                className="group relative bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-800/50 hover:border-primary-700/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Explore all services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SOLUTIONS SECTION - 5 solution cards with business impact
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-neutral-900/30 relative">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Solutions
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Solutions Built for Business Impact
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Tailored solutions that address your unique business challenges and drive measurable outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {solutions.map((solution) => (
              <Link
                key={solution.title}
                href={solution.href}
                className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {solution.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{solution.title}</h3>
                <p className="text-neutral-400 text-sm">{solution.description}</p>
                <div className="mt-4 flex items-center gap-1 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          CASE STUDIES SECTION - Results that speak
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-neutral-950">
        <Container>
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider mb-4">
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
                className={`bg-gradient-to-br ${cs.color} border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all group`}
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
                  <Link 
                    href="/case-studies" 
                    className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link 
              href="/case-studies" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              View All Case Studies
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS SECTION - How we work
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-neutral-900/50">
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
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary-700/50 to-transparent z-10" />
                )}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-primary-700/30 transition-colors">
                  <div className="text-4xl font-black text-primary-600/40 mb-4">{step.number}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          TECH STACK SECTION - Categorized technologies
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-neutral-950">
        <Container>
          <TechStack
            title="Our Technology Stack"
            subtitle="We use the best tools for the job — battle-tested at scale and aligned with your team's capabilities."
          />
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          PRODUCTS SECTION - Future SaaS products
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-neutral-900/30 relative">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]" />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Coming Soon
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Building the Future of Work
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Our internal tools, now available to you. Powering the next generation of enterprise productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-purple-700/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                  {product.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                    {product.status}
                  </span>
                </div>
                <p className="text-neutral-400 mb-4">{product.description}</p>
                <Link
                  href={product.href}
                  className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Get notified
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          INSIGHTS SECTION - Blog previews
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-neutral-950">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Insights
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Latest from Our Blog
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 text-neutral-400 hover:text-white font-medium transition-colors"
            >
              View all posts
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <Link
                key={insight.title}
                href={insight.href}
                className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-primary-400">{insight.category}</span>
                  <span className="text-xs text-neutral-600">•</span>
                  <span className="text-xs text-neutral-500">{insight.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                  {insight.title}
                </h3>
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">{insight.date}</span>
                  <svg className="w-4 h-4 text-neutral-600 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white font-medium transition-colors"
            >
              View all posts
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
      ═══════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA SECTION - Premium, high-converting
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-gradient-to-br from-neutral-950 via-neutral-950 to-primary-950/20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to build something{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                exceptional?
              </span>
            </h2>
            <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
              Join 50+ companies that trust Kritvia to build the technology that powers their growth. Start with a free 60-minute strategy session.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-neutral-950 font-bold rounded-xl text-lg transition-all hover:bg-neutral-100 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-0.5"
              >
                Book Free Strategy Session
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl text-lg transition-all"
              >
                Explore Pricing
              </Link>
            </div>
            <p className="text-neutral-600 text-sm">No commitment required. 60-minute session. Expert engineers.</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
