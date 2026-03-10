'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { FounderAuthority } from '@/components/home/FounderAuthority'
import { PressSection } from '@/components/trust/PressSection'
import { InvestorSection } from '@/components/trust/InvestorSection'
import { SocialProofSection } from '@/components/trust/SocialProofSection'

// Animation variants
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// ==================== 1. ANNOUNCEMENT BAR ====================
function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm py-2 text-center">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
        <span>🎉</span>
        <span className="font-medium">Now available: Kritvia AI Cloud - Start building for free</span>
        <Link href="/products/ai-cloud" className="underline hover:text-white/80">
          Learn more →
        </Link>
      </div>
    </div>
  )
}

// ==================== 2. AUTHORITY HERO SECTION ====================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/10 to-transparent rounded-full" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Now serving 50+ enterprises worldwide
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              The Future of{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AI Infrastructure
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              Build, deploy, and scale AI-powered applications with Trinity OS. 
              The next-generation platform for modern software builders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Start Building Free
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/platform"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                View Documentation
              </Link>
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            {/* Dashboard Mockup */}
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 overflow-hidden shadow-2xl">
              <div className="h-10 bg-slate-800/50 border-b border-white/5 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'API Calls', value: '2.4M', change: '+12%' },
                    { label: 'AI Models', value: '48', change: '+8%' },
                    { label: 'Uptime', value: '99.9%', change: '99.9%' }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-green-400">{stat.change}</p>
                    </div>
                  ))}
                </div>

                <div className="h-40 rounded-xl bg-white/5 border border-white/5 p-4 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 95, 75, 88, 92].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -right-4 top-1/4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">AI Model Deployed</p>
                    <p className="text-xs text-slate-400">gpt-4-kritvia-v2</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== 3. TRUSTED BY SECTION ====================
function TrustedBySection() {
  const companies = [
    'TechCorp', 'InnovateLabs', 'FutureStack', 'DataFlow', 'CloudNine', 'AIVentures', 'GrowthHQ', 'ScaleUp'
  ]

  return (
    <section className="py-12 bg-[#0A0A0A] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm mb-8"
        >
          Trusted by leading startups and enterprises worldwide
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {companies.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-center"
            >
              <span className="text-xl font-bold text-slate-600">{company}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== 4. PLATFORM OVERVIEW ====================
function PlatformOverview() {
  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            One Platform,{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Infinite Possibilities
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale AI-powered applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🚀', title: 'Build Faster', desc: 'Deploy AI applications in minutes, not months' },
            { icon: '⚡', title: 'Scale Automatically', desc: 'Handle millions of requests with auto-scaling' },
            { icon: '🔒', title: 'Enterprise Security', desc: 'SOC 2 Type II certified with full compliance' }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <span className="text-5xl mb-4 block">{item.icon}</span>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== 5. PRODUCT ECOSYSTEM ====================
function ProductEcosystem() {
  const products = [
    { name: 'Trinity OS', desc: 'AI Operating System', icon: '🧠', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Kritvia AI Cloud', desc: 'Cloud Infrastructure', icon: '☁️', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Kritvia Agents', desc: 'Autonomous AI Agents', icon: '🤖', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Dev Platform', desc: 'Developer Tools', icon: '🛠️', gradient: 'from-orange-500 to-red-500' }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Product{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ecosystem
            </span>
          </h2>
          <p className="text-xl text-slate-400">
            Complete suite of AI-powered products
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/products/${product.name.toLowerCase().replace(' ', '-')}`}
                className="group block p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-2xl mb-4`}>
                  {product.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-400">{product.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== 6. AI INFRASTRUCTURE ====================
function AIInfrastructure() {
  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              AI Infrastructure{' '}
              <span className="text-blue-400">Built for Scale</span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Global edge network, real-time inference, and enterprise-grade reliability.
            </p>
            <div className="space-y-4">
              {[
                'Global edge network in 30+ regions',
                'Real-time AI inference at <50ms latency',
                '99.99% uptime SLA',
                'Auto-scaling for millions of requests'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Edge Regions', value: '30+' },
                  { label: 'Latency', value: '<50ms' },
                  { label: 'Uptime', value: '99.99%' },
                  { label: 'Scale', value: '∞' }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== 7 & 8. DEVELOPER EXPERIENCE ====================
function DeveloperExperience() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Built for{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Developers
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Powerful APIs, SDKs, and tools to build AI applications faster.
            </p>

            <div className="space-y-4 mb-10">
              {[
                'REST & GraphQL APIs',
                'SDKs for JavaScript, Python, Go, Rust',
                'Real-time webhooks',
                'Sandbox environment'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/developers"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium"
            >
              Explore Developer Docs →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                <span className="text-sm text-slate-400">bash</span>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <div className="text-yellow-400"># Install Kritvia CLI</div>
                <div className="text-white mb-4">npm install -g @kritvia/cli</div>
                <div className="text-yellow-400"># Initialize your project</div>
                <div className="text-white mb-4">kritvia init my-ai-app</div>
                <div className="text-yellow-400"># Deploy to Kritvia Cloud</div>
                <div className="text-white mb-4">kritvia deploy --prod</div>
                <div className="text-green-400 mt-4">{`# Your AI app is live!`}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== 9. USE CASES GRID ====================
function UseCasesGrid() {
  const useCases = [
    { title: 'AI Startups', desc: 'Build and scale AI products', icon: '🚀', href: '/solutions/ai-startups' },
    { title: 'Enterprise', desc: 'Secure AI for large organizations', icon: '🏢', href: '/solutions/enterprise' },
    { title: 'Developers', desc: 'Tools for builders', icon: '💻', href: '/solutions/developers' },
    { title: 'Research Labs', desc: 'Compute for AI research', icon: '🔬', href: '/solutions/research' }
  ]

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Solutions for{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Every Builder
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={useCase.href}
                className="group block p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <span className="text-4xl mb-4 block">{useCase.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
                <p className="text-sm text-slate-400">{useCase.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== 10. STARTUP ECOSYSTEM ====================
function StartupEcosystem() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Startup{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ecosystem
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Join our accelerator program and get free credits, mentorship, and networking opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/solutions/ai-startups"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all"
              >
                Join Accelerator
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                View Success Stories
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: '$50K', label: 'Free Credits' },
              { value: '50+', label: 'Mentors' },
              { value: '100+', label: 'Startups' },
              { value: '$10M+', label: 'Funding Raised' }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== 11. ENTERPRISE SOLUTIONS ====================
function EnterpriseSolutions() {
  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Enterprise{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Security, compliance, and support for large organizations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🔒', title: 'Security', desc: 'SOC 2, GDPR, HIPAA compliant' },
            { icon: '🛡️', title: 'Compliance', desc: 'Custom security reviews' },
            { icon: '🎧', title: 'Support', desc: '24/7 dedicated support' }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <span className="text-5xl mb-4 block">{item.icon}</span>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/solutions/enterprise"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  )
}

// ==================== 12. PLATFORM ARCHITECTURE ====================
function PlatformArchitecture() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Platform{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Architecture
            </span>
          </h2>
          <p className="text-xl text-slate-400">
            Built on modern, scalable infrastructure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-4">
          {[
            { name: 'Edge Network', desc: 'Global CDN' },
            { name: 'API Gateway', desc: 'Rate limiting' },
            { name: 'AI Runtime', desc: 'Model serving' },
            { name: 'Data Layer', desc: 'Storage & cache' },
            { name: 'Analytics', desc: 'Monitoring' }
          ].map((layer, i) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 text-center"
            >
              <p className="font-semibold text-white">{layer.name}</p>
              <p className="text-sm text-slate-400">{layer.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== 13. SECURITY & INFRASTRUCTURE ====================
function SecurityInfrastructure() {
  const features = [
    { icon: '🛡️', title: 'Enterprise Security', desc: 'SOC 2 Type II certified' },
    { icon: '🌍', title: 'Global Infrastructure', desc: '30+ regions worldwide' },
    { icon: '🔐', title: 'Data Encryption', desc: 'End-to-end encryption' },
    { icon: '📊', title: 'Real-time Monitoring', desc: '24/7 alerting' }
  ]

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Security &{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Infrastructure
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== 14. MARKETPLACE VISION ====================
function MarketplaceVision() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            AI{' '}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover and publish AI models, agents, and plugins
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: 'AI Models', icon: '🧠', count: '500+' },
            { name: 'Agents', icon: '🤖', count: '200+' },
            { name: 'Plugins', icon: '🔌', count: '150+' },
            { name: 'Templates', icon: '📦', count: '100+' }
          ].map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-pink-500/30 transition-colors"
            >
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <p className="text-2xl font-bold text-white">{item.count}</p>
              <p className="text-slate-400">{item.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-xl transition-all"
          >
            Explore Marketplace →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ==================== 15. INTEGRATION ECOSYSTEM ====================
function IntegrationEcosystem() {
  const integrations = ['GitHub', 'Slack', 'Notion', 'Salesforce', 'Stripe', 'Zendesk', 'HubSpot', 'Jira']

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Integration{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Ecosystem
            </span>
          </h2>
          <p className="text-xl text-slate-400">
            Connect with your favorite tools
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {integrations.map((integration, i) => (
            <motion.div
              key={integration}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors"
            >
              <span className="text-slate-400 font-medium">{integration}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== 16. COMMUNITY SECTION ====================
function CommunitySection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Join Our{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Connect with thousands of developers building AI applications.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '10K+', label: 'Discord' },
                { value: '5K+', label: 'GitHub' },
                { value: '50K+', label: 'Monthly Users' }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { icon: '💬', title: 'Discord Community', desc: 'Get help and share knowledge' },
              { icon: '⭐', title: 'GitHub', desc: 'Open source projects and tools' },
              { icon: '📅', title: 'Events', desc: 'Meetups, conferences, workshops' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== 17-22. TRUST & CONTENT ====================
function CaseStudiesPreview() {
  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Case{' '}
              <span className="text-orange-400">Studies</span>
            </h2>
            <p className="text-xl text-slate-400">
              Real results from real customers
            </p>
          </div>
          <Link href="/case-studies" className="mt-4 md:mt-0 text-orange-400 hover:text-orange-300 font-medium">
            View all cases →
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {[
            { company: 'TechCorp', metric: '3x', impact: 'Faster Deployment', color: 'from-blue-500 to-cyan-500' },
            { company: 'DataFlow', metric: '70%', impact: 'Cost Reduction', color: 'from-green-500 to-emerald-500' },
            { company: 'InnovateLabs', metric: '150%', impact: 'Revenue Growth', color: 'from-purple-500 to-pink-500' }
          ].map((study, i) => (
            <motion.div
              key={study.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                href="/case-studies"
                className="group block rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
              >
                <div className={`h-2 bg-gradient-to-r ${study.color}`} />
                <div className="p-8">
                  <p className="text-sm text-slate-400 mb-4">{study.company}</p>
                  <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-purple-400 transition-colors">
                    {study.company}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold bg-gradient-to-r ${study.color} bg-clip-text text-transparent`}>
                      {study.metric}
                    </span>
                    <span className="text-slate-400">{study.impact}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== 23. DOCS CTA ====================
function DocsCTA() {
  return null
}

// ==================== 24. GLOBAL CTA ====================
function GlobalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Start Building with{' '}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Kritvia</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of developers building the next generation of AI applications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Start Building Free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ==================== 25. PREMIUM FOOTER ====================
function PremiumFooter() {
  const footerLinks = {
    Products: ['Trinity OS', 'AI Cloud', 'Agents', 'Dev Platform', 'SDK', 'CLI'],
    Platform: ['Architecture', 'Security', 'Infrastructure', 'AI Stack'],
    Solutions: ['AI Startups', 'Enterprise', 'Developers', 'Research'],
    Developers: ['Documentation', 'API Reference', 'Tutorials', 'Quickstarts'],
    Company: ['About', 'Founder', 'Team', 'Careers', 'Contact'],
    Resources: ['Blog', 'Guides', 'Case Studies', 'Whitepapers']
  }

  return (
    <footer className="py-20 bg-[#050505] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-white">Kritvia</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-xs">
              AI infrastructure for the next generation of software builders.
            </p>
            <div className="flex gap-4">
              {['twitter', 'linkedin', 'github'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 Kritvia. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-slate-500 hover:text-white text-sm transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ==================== MAIN PAGE ====================
export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <AnnouncementBar />
      <HeroSection />
      <TrustedBySection />
      <PlatformOverview />
      <ProductEcosystem />
      <AIInfrastructure />
      <DeveloperExperience />
      <UseCasesGrid />
      <StartupEcosystem />
      <EnterpriseSolutions />
      <PlatformArchitecture />
      <SecurityInfrastructure />
      <MarketplaceVision />
      <IntegrationEcosystem />
      <CommunitySection />
      <CaseStudiesPreview />
      <FounderAuthority />
      <PressSection />
      <InvestorSection />
      <SocialProofSection />
      <DocsCTA />
      <GlobalCTA />
    </main>
  )
}
