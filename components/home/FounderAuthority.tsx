'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { founder } from '@/data/founder'

export function FounderAuthority() {
  const authorityBadges = [
    'Founder of KRITVIA',
    'Next-Generation SaaS Platform',
    'Platform Architecture Builder',
    'Technology Systems Architect'
  ]

  return (
    <section className="py-28 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Founder Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={founder.image}
                  alt={`${founder.name} - ${founder.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-[60px]" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-full blur-[40px]" />
            </div>
          </motion.div>

          {/* Authority Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Built by a Founder{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Obsessed with the Future of Technology
              </span>
            </h2>

            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              KRITVIA is led by {founder.name}, a technology founder focused on building 
              next-generation digital infrastructure and scalable software systems.
            </p>

            {/* Authority Badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              {authorityBadges.map((badge, index) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="px-4 py-2 rounded-full bg-neutral-900/50 border border-white/10 text-sm text-slate-300"
                >
                  {badge}
                </motion.span>
              ))}
            </div>

            {/* Vision Quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="border-l-4 pl-6 italic text-lg text-slate-400 mt-8"
            >
              "{founder.quote}"
            </motion.blockquote>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                href="/founder"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-black hover:bg-neutral-800 rounded-xl transition-all hover:scale-105"
              >
                Read the Founder Story
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href={founder.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white border border-white/20 hover:bg-white/5 rounded-xl transition-all"
              >
                Visit Personal Website
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
