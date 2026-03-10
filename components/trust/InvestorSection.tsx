'use client'

import { motion } from 'framer-motion'

const investorCards = [
  {
    title: 'Vision',
    description: 'Building foundational digital infrastructure for the next generation of technology companies.',
    icon: '🎯'
  },
  {
    title: 'Technology',
    description: 'Modern architecture powered by scalable cloud infrastructure and modular SaaS systems.',
    icon: '⚡'
  },
  {
    title: 'Platform',
    description: 'A platform-first approach enabling powerful digital products and ecosystems.',
    icon: '🚀'
  }
]

export function InvestorSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Built for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Global Scale
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            KRITVIA is designed as a next-generation SaaS platform capable of powering 
            startups, developers, and enterprise products worldwide.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {investorCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl border border-white/10 bg-neutral-900/30 hover:border-white/20 transition-colors"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
