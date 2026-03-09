import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui';
import { ContactForm } from './ContactForm';
import { ConsultationBooking } from '@/components/features';

export const metadata: Metadata = {
  title: 'Contact — Get in Touch | Kritvia',
  description:
    'Start your project with Kritvia. Book a free consultation, get an estimate, or send us a message. We respond within 24 hours.',
};

const offices = [
  { city: 'Bangalore', country: 'India', flag: '🇮🇳', timezone: 'IST (UTC+5:30)' },
  { city: 'Singapore', country: 'Singapore', flag: '🇸🇬', timezone: 'SGT (UTC+8)' },
  { city: 'London', country: 'United Kingdom', flag: '🇬🇧', timezone: 'GMT/BST (UTC+0)' },
];

const contactMethods = [
  {
    icon: '📧',
    title: 'Email',
    value: 'hello@kritvia.com',
    href: 'mailto:hello@kritvia.com',
  },
  {
    icon: '📅',
    title: 'Schedule a Call',
    value: 'Book on Calendly',
    href: '#booking',
  },
  {
    icon: '💬',
    title: 'LinkedIn',
    value: 'linkedin.com/company/kritvia',
    href: 'https://linkedin.com/company/kritvia',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <Container className="relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-6">
              Get in Touch
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Let's Build{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Something Great
              </span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed mb-8">
              Whether you have a specific project in mind or want to explore how AI can transform your business, we'd love to talk. Every engagement starts with a free consultation.
            </p>

            {/* Contact Methods */}
            <div className="flex flex-wrap gap-4">
              {contactMethods.map((method) => (
                <a
                  key={method.title}
                  href={method.href}
                  className="flex items-center gap-3 px-4 py-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-colors"
                >
                  <span className="text-xl">{method.icon}</span>
                  <div>
                    <div className="text-xs text-neutral-500">{method.title}</div>
                    <div className="text-sm text-white font-medium">{method.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section className="bg-neutral-950">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Send Us a Message</h2>
              <p className="text-neutral-400 text-sm mb-6">We respond to all inquiries within 24 hours, typically much faster.</p>
              <ContactForm />
            </div>

            {/* Info Panel */}
            <div className="space-y-8">
              {/* What to Expect */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">What Happens Next?</h3>
                <ol className="space-y-4">
                  {[
                    { step: '1', title: 'We review your message', desc: 'Within 24 hours, a senior engineer reviews your inquiry.' },
                    { step: '2', title: 'Discovery call', desc: 'We schedule a 30–60 min call to understand your goals and challenges.' },
                    { step: '3', title: 'Proposal', desc: 'We send a detailed proposal with scope, timeline, and pricing within 3 business days.' },
                    { step: '4', title: 'Kickoff', desc: 'Once approved, we can start in as little as 2 weeks.' },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600/20 border border-primary-600/40 flex items-center justify-center text-xs font-bold text-primary-400">
                        {item.step}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{item.title}</div>
                        <div className="text-neutral-500 text-xs leading-relaxed mt-0.5">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Offices */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Our Offices</h3>
                <div className="space-y-3">
                  {offices.map((office) => (
                    <div key={office.city} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{office.flag}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{office.city}</div>
                          <div className="text-neutral-500 text-xs">{office.country}</div>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-600">{office.timezone}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust signals */}
              <div className="bg-gradient-to-br from-primary-900/20 to-secondary-900/10 border border-primary-700/20 rounded-2xl p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { value: '< 24h', label: 'Response Time' },
                    { value: '98%', label: 'Client Retention' },
                    { value: '5★', label: 'Average Rating' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Booking Section */}
      <Section id="booking" className="bg-neutral-900/50 border-t border-neutral-800">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Or Book a Session Directly</h2>
            <p className="text-neutral-400">Choose a time that works for you — no email ping-pong needed.</p>
          </div>
          <div className="max-w-lg mx-auto">
            <ConsultationBooking />
          </div>
        </Container>
      </Section>
    </>
  );
}
