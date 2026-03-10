'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { founder } from '@/data/founder'

export function FounderSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Founder Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src={founder.image}
                alt={`${founder.name} - ${founder.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 via-transparent to-transparent" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-[60px]" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-full blur-[40px]" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Leadership
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Meet the <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Founder</span>
            </h2>

            <p className="text-xl text-slate-400 mb-2 font-semibold text-white">
              {founder.name}
            </p>
            <p className="text-lg text-purple-400 mb-6">
              {founder.title}
            </p>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              {founder.bio}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/founder"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105"
              >
                Read Full Story
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href={founder.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
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
