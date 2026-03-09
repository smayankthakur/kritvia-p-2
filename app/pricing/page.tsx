import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui';
import { CostEstimator } from '@/components/features';

export const metadata: Metadata = {
  title: 'Pricing — Transparent Project Investment | Kritvia',
  description:
    'Transparent pricing for AI development, cloud architecture, and SaaS development. Use our cost estimator to get an instant project estimate.',
};

const plans = [
  {
    name: 'Starter',
    price: '$25K',
    period: 'starting from',
    description: 'Perfect for startups and MVPs looking to validate their first product.',
    features: [
      'Up to 8 weeks engagement',
      'Dedicated project manager',
      'Core feature development',
      'Basic cloud infrastructure',
      'Weekly progress demos',
      '30-day post-launch support',
    ],
    cta: 'Start with Starter',
    href: '/contact?plan=starter',
    popular: false,
    highlight: 'best for MVPs',
  },
  {
    name: 'Growth',
    price: '$75K',
    period: 'starting from',
    description: 'For businesses building production-grade systems with AI and advanced features.',
    features: [
      'Up to 20 weeks engagement',
      'Dedicated team of 3+ engineers',
      'AI/ML integration included',
      'Production-ready architecture',
      'CI/CD pipeline setup',
      'Performance optimization',
      '90-day post-launch support',
      'Monthly strategy reviews',
    ],
    cta: 'Start Growth Plan',
    href: '/contact?plan=growth',
    popular: true,
    highlight: 'most popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored to your needs',
    description: 'For large organizations requiring deep integration, compliance, and dedicated resources.',
    features: [
      'Long-term engagement (6–18 months)',
      'Embedded team of 5–10+ engineers',
      'Advanced AI/ML systems',
      'Enterprise security & compliance',
      'Multi-cloud architecture',
      'SOC 2 / HIPAA assistance',
      '12-month SLA & support',
      'Dedicated CTO advisory',
    ],
    cta: 'Contact Sales',
    href: '/contact?plan=enterprise',
    popular: false,
    highlight: 'best for enterprise',
  },
];

const faqs = [
  {
    q: 'How do you price projects?',
    a: 'We price based on scope, complexity, and timeline. We begin with a free discovery session to understand your needs, then provide a detailed proposal with a fixed price or time-and-materials quote depending on project clarity.',
  },
  {
    q: 'Do you work with equity instead of cash?',
    a: 'For early-stage startups with strong potential, we consider equity arrangements for a portion of compensation. This is evaluated case-by-case.',
  },
  {
    q: 'What\'s included in post-launch support?',
    a: 'Post-launch support includes bug fixes, performance monitoring, minor feature additions, and access to our on-call engineering team. We offer extended support plans for ongoing development.',
  },
  {
    q: 'Can we start small and scale up?',
    a: 'Absolutely. Many clients start with a discovery & architecture phase ($5K–$15K), then move to a phased development approach. This lowers initial risk while building confidence.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'MVP projects typically take 6–12 weeks. Full-featured products take 16–24 weeks. Enterprise integrations are scoped at 6–18 months. We set clear milestones from day one.',
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]" />
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-6">
              Pricing
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Honest Pricing,{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Real Outcomes
              </span>
            </h1>
            <p className="text-xl text-neutral-400">
              No black boxes. No hidden fees. We provide fixed-price quotes for defined scopes and transparent billing for evolving projects.
            </p>
          </div>
        </Container>
      </Section>

      {/* Plans */}
      <Section className="bg-neutral-950">
        <Container>
          <div className="grid lg:grid-cols-3 gap-6 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border flex flex-col ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary-900/40 to-secondary-900/20 border-primary-600/50 ring-1 ring-primary-500/30'
                    : 'bg-neutral-900 border-neutral-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8 border-b border-neutral-800 flex-none">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-xl font-bold ${plan.popular ? 'text-primary-300' : 'text-white'}`}>
                      {plan.name}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${plan.popular ? 'bg-primary-500/20 text-primary-400' : 'bg-neutral-800 text-neutral-500'}`}>
                      {plan.highlight}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-neutral-500 text-sm ml-2">{plan.period}</span>
                  </div>
                  <p className="text-neutral-400 text-sm">{plan.description}</p>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-neutral-300">
                        <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-sm text-center transition-colors block ${
                      plan.popular
                        ? 'bg-primary-600 hover:bg-primary-500 text-white'
                        : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Estimator */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Estimate Your Project Cost</h2>
              <p className="text-neutral-400">Get an instant rough estimate based on your project parameters.</p>
            </div>
            <CostEstimator />
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-neutral-900/50 border-t border-neutral-800">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Not sure what you need?</h2>
            <p className="text-neutral-400 mb-8">Start with a free 60-minute technology consultation. No commitment, no sales pressure — just expert advice.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-primary-900/30">
              Book Free Consultation
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
