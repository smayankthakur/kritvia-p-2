import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { founder } from '@/data/founder'

export const metadata: Metadata = {
  title: `${founder.name} — Founder of KRITVIA`,
  description: `Learn about ${founder.name}, ${founder.title}. Discover the vision behind KRITVIA and the mission to transform digital infrastructure with AI-powered solutions.`,
  openGraph: {
    title: `${founder.name} — Founder of KRITVIA`,
    description: founder.bio,
    type: 'profile',
    url: '/founder',
    images: [
      {
        url: founder.image,
        width: 600,
        height: 600,
        alt: founder.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${founder.name} — Founder of KRITVIA`,
    description: founder.bio,
    images: [founder.image]
  }
}

// Structured Data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: founder.name,
  jobTitle: 'Founder',
  url: founder.website,
  image: founder.image,
  worksFor: {
    '@type': 'Organization',
    name: 'KRITVIA'
  },
  sameAs: [
    founder.socials.linkedin,
    founder.socials.twitter,
    founder.socials.github
  ].filter(Boolean)
}

export default function FounderPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Founder Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={founder.image}
                  alt={`${founder.name} - ${founder.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 via-transparent to-transparent" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px]" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-500/20 rounded-full blur-[60px]" />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Founder
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {founder.name}
              </h1>
              
              <p className="text-xl lg:text-2xl text-purple-400 mb-6">
                {founder.title}
              </p>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Building the future of digital infrastructure. Leading KRITVIA's mission to transform how businesses build and scale with AI-powered technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={founder.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105"
                >
                  Visit Website
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            The <span className="text-purple-400">Story</span>
          </h2>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-slate-300 mb-6 leading-relaxed">
              {founder.bio}
            </p>
            <p className="text-slate-300 mb-6 leading-relaxed">
              With a passion for building transformative technology, {founder.name} founded KRITVIA with a clear vision: to democratize advanced technology and make it accessible to businesses of all sizes.
            </p>
            <p className="text-slate-300 mb-6 leading-relaxed">
              The journey began with a simple belief—that every business deserves access to the same powerful tools that tech giants use. Today, KRITVIA serves {founder.companies[0]?.description || 'enterprises worldwide'}, turning that vision into reality.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Vision & <span className="text-blue-400">Mission</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Mission</h3>
              <p className="text-slate-400">
                {founder.mission}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Vision</h3>
              <p className="text-slate-400">
                {founder.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Companies & <span className="text-cyan-400">Projects</span>
          </h2>
          
          <div className="space-y-6">
            {founder.companies.map((company, index) => (
              <div 
                key={company.name}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {company.name}
                    </h3>
                    <p className="text-purple-400 text-sm mb-2">{company.role}</p>
                    <p className="text-slate-400">
                      {company.description}
                    </p>
                  </div>
                  {index === 0 && (
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
                      Current
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Key <span className="text-green-400">Achievements</span>
          </h2>
 className="grid          
          <div className="grid md:grid-cols-3 gap-6">
            {founder.achievements.map((achievement, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-300">
                  {achievement}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl lg:text-3xl font-medium text-white mb-8 italic">
            "{founder.quote}"
          </blockquote>
          
          <div className="flex justify-center">
            <a
              href={founder.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105"
            >
              Follow the Journey
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Work With <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">KRITVIA</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join the companies transforming their business with AI-powered digital infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105"
            >
              Start Your Project
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
