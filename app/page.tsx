'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { FounderAuthority } from '@/components/home/FounderAuthority'

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
              Build{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Intelligent
              </span>
              {' '}Digital Platforms
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              AI-powered infrastructure for startups, enterprises, and future-ready products. 
              Transform your business with cutting-edge technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Start Your Project
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/platform"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                Explore Platform
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
                    { label: 'Revenue', value: '$2.4M', change: '+12%' },
                    { label: 'Users', value: '48.2K', change: '+8%' },
                    { label: 'Growth', value: '156%', change: '+24%' }
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
                    <p className="text-sm font-medium text-white">Deployment Ready</p>
                    <p className="text-xs text-slate-400">v2.4.1 deployed</p>
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
    <section className="py-20 bg-[#0A0A0A] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm mb-12"
        >
          Trusted by founders, startups, and growing companies worldwide
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

// ==================== PRODUCT ECOSYSTEM ====================
function ProductEcosystem() {
  const products = [
    {
      name: 'Kritvia AI',
      description: 'AI-powered development platform',
      icon: '🤖',
      href: '/products/kritvia-ai',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Kritvia Cloud',
      description: 'Cloud infrastructure at scale',
      icon: '☁️',
      href: '/products/kritvia-cloud',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Kritvia CRM',
      description: 'Next-gen customer management',
      icon: '📊',
      href: '/products/kritvia-crm',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Startup OS',
      description: 'Everything to launch faster',
      icon: '🚀',
      href: '/platform/startup-builder',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      name: 'Analytics',
      description: 'Real-time insights',
      icon: '📈',
      href: '/platform/dashboard',
      gradient: 'from-indigo-500 to-purple-500'
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
            Product <span className="text-purple-400">Ecosystem</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Complete suite of products to power your digital transformation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-2xl mb-4`}>
                  {product.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
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

// ==================== PLATFORM OVERVIEW ====================
function PlatformOverview() {
  const features = [
    { icon: '🤖', title: 'AI Tools', description: 'Build with cutting-edge AI' },
    { icon: '☁️', title: 'Cloud Infrastructure', description: 'Enterprise-grade scalability' },
    { icon: '🚀', title: 'Startup Builder', description: 'Launch in record time' },
    { icon: '📊', title: 'Analytics', description: 'Real-time insights' },
    { icon: '🔧', title: 'Developer Tools', description: 'APIs & SDKs' },
    { icon: '🔒', title: 'Security', description: 'Enterprise-grade security' }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              One Platform,{' '}
              <span className="text-blue-400">Infinite Possibilities</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Everything you need to build, deploy, and scale your digital products. 
              From AI-powered tools to enterprise infrastructure.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 overflow-hidden p-8">
              {/* Platform Dashboard Mockup */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">$2,456,789</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                    +24.5%
                  </div>
                </div>
                
                <div className="h-32 flex items-end gap-2">
                  {[65, 80, 55, 90, 70, 85, 95, 75, 88, 92, 80, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  {[
                    { label: 'Active Users', value: '48.2K' },
                    { label: 'API Calls', value: '1.2M' },
                    { label: 'Uptime', value: '99.9%' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-lg font-semibold text-white">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-8 top-1/4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-lg">⚡</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">API Response</p>
                  <p className="text-xs text-green-400">23ms avg</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== SOLUTIONS GRID ====================
function SolutionsGrid() {
  const solutions = [
    { title: 'AI Development', description: 'Intelligent solutions powered by machine learning', icon: '🧠', href: '/solutions/ai-development' },
    { title: 'SaaS Development', description: 'Scalable software built for growth', icon: '📦', href: '/solutions/saas-development' },
    { title: 'Web Platforms', description: 'Modern web applications', icon: '🌐', href: '/solutions/web-development' },
    { title: 'Cloud Architecture', description: 'Enterprise infrastructure', icon: '🏗️', href: '/solutions/cloud-architecture' },
    { title: 'Mobile Apps', description: 'iOS & Android development', icon: '📱', href: '/services' },
    { title: 'Data Engineering', description: 'Big data & analytics', icon: '💾', href: '/services' }
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
            Solutions for <span className="text-cyan-400">Every Need</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Tailored development services to bring your vision to life
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={solution.href}
                className="group block p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all"
              >
                <span className="text-4xl mb-4 block">{solution.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-slate-400">
                  {solution.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== INDUSTRIES SECTION ====================
function IndustriesSection() {
  const industries = [
    { name: 'Fintech', icon: '💳', description: 'Financial technology' },
    { name: 'Healthcare', icon: '🏥', description: 'Health tech solutions' },
    { name: 'E-commerce', icon: '🛒', description: 'Online retail' },
    { name: 'SaaS', icon: '☁️', description: 'Software platforms' },
    { name: 'EdTech', icon: '🎓', description: 'Education technology' },
    { name: 'Logistics', icon: '🚚', description: 'Supply chain' }
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
            Industry <span className="text-green-400">Expertise</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Deep domain knowledge across multiple industries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/industries/${industry.name.toLowerCase()}`}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10"
              >
                <span className="text-4xl">{industry.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-slate-400">{industry.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== CASE STUDIES ====================
function CaseStudies() {
  const cases = [
    {
      title: 'Fintech AI Platform',
      company: 'Global Bank',
      metric: '70%',
      impact: 'Automation Increase',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Healthcare Dashboard',
      company: 'MedTech Inc',
      metric: '3x',
      impact: 'Faster Diagnosis',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'E-commerce Platform',
      company: 'RetailCo',
      metric: '150%',
      impact: 'Revenue Growth',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section className="py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Case <span className="text-orange-400">Studies</span>
            </h2>
            <p className="text-xl text-slate-400">
              Real results from real clients
            </p>
          </div>
          <Link href="/case-studies" className="mt-4 md:mt-0 text-purple-400 hover:text-purple-300 font-medium">
            View all cases →
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {cases.map((study, i) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                href="/case-studies"
                className="group block rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${study.color}`} />
                <div className="p-8">
                  <p className="text-sm text-slate-400 mb-4">{study.company}</p>
                  <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-purple-400 transition-colors">
                    {study.title}
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

// ==================== DEVELOPER PLATFORM ====================
function DeveloperPlatform() {
  return (
    <section className="py-32 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Built for <span className="text-yellow-400">Developers</span>
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
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
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
                <span className="text-sm text-slate-400">api.kritvia.com/v1</span>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <div className="text-purple-400">curl -X POST</div>
                <div className="text-white">https://api.kritvia.com/v1/ai/analyze</div>
                <div className="text-slate-500 mt-2">{"\\"}</div>
                <div className="text-blue-400">-H</div>
                <div className="text-white">"Authorization: Bearer YOUR_API_KEY"</div>
                <div className="text-blue-400">{"\\"}</div>
                <div className="text-white">"Content-Type: application/json"</div>
                <div className="text-blue-400">{"\\"}</div>
                <div className="text-blue-400">-d</div>
                <div className="text-white">{`{`}</div>
                <div className="text-slate-400 pl-4">"prompt": "Analyze this data...",</div>
                <div className="text-slate-400 pl-4">"model": "kritvia-pro"</div>
                <div className="text-white">{`}`}</div>
                <div className="text-green-400 mt-4">{`{`}</div>
                <div className="text-slate-400 pl-4">"success": true,</div>
                <div className="text-slate-400 pl-4">"data": &#123;...&#125;,</div>
                <div className="text-slate-400 pl-4">"latency": "23ms"</div>
                <div className="text-green-400">{`}`}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== METRICS SECTION ====================
function MetricsSection() {
  const metrics = [
    { value: 128, suffix: '+', label: 'Projects Delivered' },
    { value: 34, suffix: '+', label: 'Enterprise Clients' },
    { value: 9, suffix: '+', label: 'Industries Served' },
    { value: 98, suffix: '%', label: 'Client Retention' }
  ]

  return (
    <section className="py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, i) => (
            <MetricCard key={metric.label} metric={metric} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MetricCard({ metric, index }: { metric: { value: number; suffix: string; label: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(metric.value)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center"
    >
      <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
        <span>{inView ? count : 0}</span>{metric.suffix}
      </div>
      <p className="text-lg text-slate-400">{metric.label}</p>
    </motion.div>
  )
}

// ==================== RESOURCES SECTION ====================
function ResourcesSection() {
  const resources = [
    { type: 'Blog', title: 'The Future of AI in Enterprise', date: 'Jan 15, 2024', image: '🤖' },
    { type: 'Guide', title: 'Building Scalable SaaS Platforms', date: 'Jan 10, 2024', image: '📖' },
    { type: 'Research', title: 'Cloud Architecture Best Practices', date: 'Jan 5, 2024', image: '🔬' }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Latest <span className="text-pink-400">Resources</span>
            </h2>
            <p className="text-xl text-slate-400">
              Insights, guides, and research from our team
            </p>
          </div>
          <Link href="/resources" className="mt-4 md:mt-0 text-pink-400 hover:text-pink-300 font-medium">
            View all resources →
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((resource, i) => (
            <motion.article
              key={resource.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href="/blog" className="group block">
                <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 overflow-hidden mb-4">
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {resource.image}
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                    {resource.type}
                  </span>
                  <span className="text-xs text-slate-500">{resource.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {resource.title}
                </h3>
              </Link>
            </motion.article>
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
            Start Building With <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Kritvia</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join 50+ enterprises already transforming their business with our AI-powered platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Start Your Project
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              Book a Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ==================== FOOTER ====================
function Footer() {
  const footerLinks = {
    Products: ['Kritvia AI', 'Kritvia Cloud', 'Kritvia CRM', 'Startup OS'],
    Solutions: ['AI Development', 'SaaS Development', 'Web Platforms', 'Cloud Architecture'],
    Company: ['About', 'Team', 'Careers', 'Contact'],
    Resources: ['Blog', 'Guides', 'Research', 'Case Studies']
  }

  return (
    <footer className="py-20 bg-[#050505] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-white">Kritvia</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-xs">
              AI-powered infrastructure for startups, enterprises, and future-ready products.
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

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-slate-400 hover:text-white transition-colors">
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
            <Link href="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">
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
      <HeroSection />
      <TrustSection />
      <ProductEcosystem />
      <PlatformOverview />
      <FounderAuthority />
      <SolutionsGrid />
      <IndustriesSection />
      <CaseStudies />
      <DeveloperPlatform />
      <MetricsSection />
      <ResourcesSection />
      <CTASection />
    </main>
  )
}
