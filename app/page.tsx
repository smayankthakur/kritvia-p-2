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

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * (end - start) + start))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, end, duration, start])

  return count
}

// ==================== HERO SECTION ====================
function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Mesh */}
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
              {/* Mockup Header */}
              <div className="h-10 bg-slate-800/50 border-b border-white/5 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              
              {/* Mockup Content */}
              <div className="p-6 space-y-4">
                {/* Stats Cards */}
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

                {/* Chart Area */}
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

              {/* Floating Elements */}
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

            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== TRUST SECTION ====================
function TrustSection() {
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

// ==================== PRODUCTS SECTION ====================
function ProductsSection() {
  const products = [
    {
      name: 'Trinity OS',
      description: 'Next-generation operating system for AI applications',
      icon: '🧠',
      href: '/products/trinity-os',
      gradient: 'from-purple-500 to-pink-500',
      tagline: 'AI Operating System'
    },
    {
      name: 'Kritvia AI Cloud',
      description: 'Scalable cloud infrastructure for AI workloads',
      icon: '☁️',
      href: '/products/ai-cloud',
      gradient: 'from-blue-500 to-cyan-500',
      tagline: 'Cloud Platform'
    },
    {
      name: 'Kritvia Agents',
      description: 'Autonomous AI agents for business automation',
      icon: '🤖',
      href: '/products/agents',
      gradient: 'from-green-500 to-emerald-500',
      tagline: 'AI Agents'
    },
    {
      name: 'Dev Platform',
      description: 'Build and deploy AI applications faster',
      icon: '🛠️',
      href: '/platform/developers',
      gradient: 'from-orange-500 to-red-500',
      tagline: 'Developer Tools'
    }
  ]

  return (
    <section className="py-32 bg-[#0A0A0A]">
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
            Complete suite of AI-powered products to build, deploy, and scale your applications
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
                href={product.href}
                className="group block p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-slate-400 mb-4 inline-block">
                  {product.tagline}
                </span>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-2xl mb-4`}>
                  {product.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {product.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== USE CASES SECTION ====================
function UseCasesSection() {
  const useCases = [
    {
      title: 'AI Startups',
      description: 'Build and scale AI-powered products with enterprise-grade infrastructure',
      icon: '🚀',
      href: '/solutions/ai-startups'
    },
    {
      title: 'Enterprise',
      description: 'Deploy secure, scalable AI solutions for large organizations',
      icon: '🏢',
      href: '/solutions/enterprise'
    },
    {
      title: 'Developers',
      description: 'Tools and APIs to build AI applications faster than ever',
      icon: '💻',
      href: '/platform/developers'
    }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Built for{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Every Builder
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Whether you're a startup, enterprise, or solo developer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
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
                className="group block p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all"
              >
                <span className="text-5xl mb-6 block">{useCase.icon}</span>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-slate-400">
                  {useCase.description}
                </p>
                <div className="mt-6 flex items-center text-cyan-400 group-hover:text-cyan-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== DEVELOPER EXPERIENCE ====================
function DeveloperExperience() {
  return (
    <section className="py-32 bg-[#0A0A0A]">
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
              Powerful APIs, comprehensive SDKs, and detailed documentation to integrate Kritvia into your workflow.
            </p>

            <div className="space-y-4 mb-10">
              {[
                'REST & GraphQL APIs',
                'SDKs for all major languages',
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
              href="/platform/developers"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium"
            >
              Explore Developer Docs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
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
                <div className="text-slate-400">→ https://my-ai-app.kritvia.com</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== SECURITY SECTION ====================
function SecuritySection() {
  const features = [
    { icon: '🛡️', title: 'Enterprise Security', description: 'SOC 2 Type II certified, GDPR compliant' },
    { icon: '⚡', title: 'Global Infrastructure', description: 'Deployed across 30+ regions worldwide' },
    { icon: '🔒', title: 'Data Encryption', description: 'End-to-end encryption for all data' },
    { icon: '📊', title: 'Real-time Monitoring', description: '24/7 monitoring and alerting' }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
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
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Built on enterprise-grade infrastructure with security at the core
          </p>
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
              <p className="text-sm text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== CTA SECTION ====================
function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
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

// ==================== MAIN PAGE ====================
export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <HeroSection />
      <TrustSection />
      <ProductsSection />
      <UseCasesSection />
      <DeveloperExperience />
      <FounderAuthority />
      <PressSection />
      <InvestorSection />
      <SocialProofSection />
      <SecuritySection />
      <CTASection />
    </main>
  )
}
