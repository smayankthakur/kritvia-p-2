'use client'

import { motion } from 'framer-motion'
import { press } from '@/data/press'

export function PressSection() {
  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            'Platform Vision',
            'Global Infrastructure',
            'Next-Gen SaaS',
            'Builder Ecosystem'
          ].map((metric, index) => (
            <motion.span
              key={metric}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="px-4 py-2 rounded-full border border-white/10 text-sm text-slate-300"
            >
              {metric}
            </motion.span>
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Trusted by Builders and the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Global Tech Community
            </span>
          </h2>
          <p className="text-slate-400">
            Featured in leading technology publications and communities
          </p>
        </motion.div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {press.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors"
            >
              {/* Placeholder Logo Circle */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                <span className="text-lg">{item.name[0]}</span>
              </div>
              <span className="text-sm text-slate-400 text-center">{item.name}</span>
              <span className="text-xs text-slate-500 text-center">{item.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
