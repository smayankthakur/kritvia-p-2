'use client';

import Link from 'next/link';
import { Container, Section, Button } from '@/components/ui';
import { TestimonialCarousel, TechStack } from '@/components/features';
import { LogoCloud } from '@/components/home/LogoCloud';
import { WebGLHero, AIPlayground, APIDemo, ArchitectureDiagram, ClientPortfolio, FounderProfile } from '@/components/home';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Page is now a client component for Framer Motion animations
// Metadata is handled in layout.tsx

// Stats for trust section
const stats = [
  { value: '50+', label: 'Enterprise Clients', suffix: '' },
  { value: '150+', label: 'Projects Delivered', suffix: '' },
  { value: '98%', label: 'Client Retention', suffix: '' },
  { value: '$2B+', label: 'Value Generated', suffix: '' },
];

// Services data
const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'AI & Machine Learning',
    description: 'Custom LLM integrations, RAG pipelines, computer vision, predictive analytics, and AI-powered product features.',
    href: '/services',
    tags: ['LLM', 'RAG', 'MLOps', 'Computer Vision'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: 'Cloud Architecture',
    description: 'Enterprise-grade AWS, GCP, and Azure architectures designed for scale, resilience, and cost efficiency.',
    href: '/services',
    tags: ['AWS', 'GCP', 'Azure', 'Terraform'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'SaaS Development',
    description: 'Full-stack SaaS platforms from MVP to enterprise, built with modern Next.js, TypeScript, and microservices.',
    href: '/services',
    tags: ['Next.js', 'TypeScript', 'APIs', 'Microservices'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'AI Automation',
    description: 'Intelligent workflow automation, RPA bots, and agentic AI systems that eliminate operational bottlenecks.',
    href: '/services',
    tags: ['Agents', 'RPA', 'LangChain', 'n8n'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Data Engineering',
    description: 'End-to-end data pipelines, real-time analytics platforms, and data warehouses that power business intelligence.',
    href: '/services',
    tags: ['Spark', 'dbt', 'Kafka', 'Snowflake'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Security & Compliance',
    description: 'Security-first architecture reviews, penetration testing, and compliance frameworks for regulated industries.',
    href: '/services',
    tags: ['SOC 2', 'HIPAA', 'ISO 27001', 'Zero Trust'],
  },
];

// Solutions data - 5 solutions
const solutions = [
  {
    title: 'AI Development',
    description: 'Intelligent AI solutions tailored to your business needs',
    href: '/solutions/ai-development',
    icon: '🤖',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Web Development',
    description: 'Modern web applications that scale with your business',
    href: '/solutions/web-development',
    icon: '🌐',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'SaaS Development',
    description: 'Scalable multi-tenant platforms for B2B and B2C',
    href: '/solutions/saas-development',
    icon: '☁️',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Cloud Architecture',
    description: 'Enterprise cloud solutions built for resilience',
    href: '/solutions/cloud-architecture',
    icon: '🏗️',
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Automation',
    description: 'Business process automation to boost efficiency',
    href: '/solutions/automation',
    icon: '⚡',
    color: 'from-red-500 to-rose-500',
  },
];

// Case studies with metrics
const caseStudies = [
  {
    client: 'Global FinTech',
    industry: 'Financial Services',
    title: 'AI Fraud Detection Platform',
    result: '78% reduction in fraud losses',
    metric: '$45M saved annually',
    tags: ['AI/ML', 'Real-time', 'AWS'],
    color: 'from-blue-600/20 to-blue-900/10',
    glow: 'hover:shadow-blue-500/20',
  },
  {
    client: 'HealthTech Corp',
    industry: 'Healthcare',
    title: 'Clinical Decision Support System',
    result: '40% faster diagnosis',
    metric: '1M+ patients served',
    tags: ['LLM', 'HIPAA', 'GCP'],
    color: 'from-green-600/20 to-green-900/10',
    glow: 'hover:shadow-green-500/20',
  },
  {
    client: 'RetailAI Inc',
    industry: 'E-Commerce',
    title: 'Personalization Engine',
    result: '34% conversion uplift',
    metric: '$12M additional revenue',
    tags: ['ML', 'Real-time', 'Microservices'],
    color: 'from-purple-600/20 to-purple-900/10',
    glow: 'hover:shadow-purple-500/20',
  },
];

// Benefits/Outcomes data
const benefits = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Automate Enterprise Workflows',
    description: 'Eliminate manual processes with intelligent automation that reduces operational costs by up to 60%.',
    metric: '60% cost reduction',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Accelerate Time-to-Market',
    description: 'Ship products 3x faster with our proven delivery framework and battle-tested infrastructure.',
    metric: '3x faster delivery',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Reduce Technical Debt',
    description: 'Modernize legacy systems with clean, scalable architecture that reduces maintenance costs significantly.',
    metric: '70% less maintenance',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Enterprise Security Posture',
    description: 'Achieve SOC 2, HIPAA, and ISO 27001 compliance with security-first architecture and continuous monitoring.',
    metric: '100% compliance',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Scale Your Engineering Team',
    description: 'Access elite engineers and technical leadership to execute on your most ambitious initiatives.',
    metric: '500+ hires placed',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'AI-Powered Decision Making',
    description: 'Transform data into actionable insights with predictive analytics and real-time business intelligence.',
    metric: '10x faster insights',
    color: 'from-blue-500 to-indigo-500',
  },
];

// Products for future SaaS
const products = [
  {
    name: 'Kritvia AI',
    description: 'AI-powered analytics platform',
    href: '/products/kritvia-ai',
    status: 'Coming Soon',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Kritvia Cloud',
    description: 'Cloud management platform',
    href: '/products/kritvia-cloud',
    status: 'Coming Soon',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    name: 'Kritvia CRM',
    description: 'Next-gen customer relationship management',
    href: '/products/kritvia-crm',
    status: 'Coming Soon',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 03 3  3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

// Blog/Insights data
const insights = [
  {
    title: 'Building Production-Ready RAG Systems',
    description: 'A comprehensive guide to implementing retrieval-augmented generation at scale.',
    category: 'Engineering',
    date: 'Mar 5, 2026',
    readTime: '12 min read',
    href: '/blog',
  },
  {
    title: 'The Future of AI Agents in Enterprise',
    description: 'How autonomous agents are transforming business operations and decision making.',
    category: 'AI Strategy',
    date: 'Feb 28, 2026',
    readTime: '8 min read',
    href: '/blog',
  },
  {
    title: 'Scaling Next.js Applications to Millions',
    description: 'Performance optimization techniques for high-traffic Next.js deployments.',
    category: 'Engineering',
    date: 'Feb 21, 2026',
    readTime: '10 min read',
    href: '/blog',
  },
];

// Process steps
const processSteps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We deep-dive into your business goals, technical constraints, and competitive landscape to define the right solution.'
  },
  {
    number: '02',
    title: 'Architecture',
    description: 'Our architects design a scalable, future-proof system blueprint with technology choices validated by your team.'
  },
  {
    number: '03',
    title: 'Delivery',
    description: 'Agile sprints with weekly demos, CI/CD pipelines, and continuous feedback loops ensure on-time delivery.'
  },
  {
    number: '04',
    title: 'Scale',
    description: 'Post-launch monitoring, optimization, and ongoing engineering support to evolve your system as you grow.'
  },
];

// Product story sections - alternating layout
const storySections = [
  {
    id: 1,
    align: 'left',
    overline: 'The Problem',
    title: 'Enterprise Technology is Broken',
    description: 'Traditional software development is too slow. Legacy systems are too rigid. AI adoption is too fragmented. Companies lose millions annually because their technology stack cannot keep pace with market demands.',
    highlight: '67% of enterprise projects fail to deliver expected value',
    image: (
      <div className="relative w-full h-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        {/* Problem visualization */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="h-2 w-3/4 bg-slate-700 rounded mb-2" />
              <div className="h-2 w-1/2 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4 opacity-60">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="h-2 w-2/3 bg-slate-700 rounded mb-2" />
              <div className="h-2 w-1/3 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4 opacity-40">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="h-2 w-full bg-slate-700 rounded mb-2" />
              <div className="h-2 w-2/3 bg-slate-800 rounded" />
            </div>
          </div>
        </div>
        {/* Red warning bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
      </div>
    ),
  },
  {
    id: 2,
    align: 'right',
    overline: 'The Solution',
    title: 'Kritvia: Engineering at the Speed of Thought',
    description: 'We\'ve built a proprietary development methodology that combines AI-augmented engineering, battle-tested infrastructure patterns, and elite technical leadership. The result: enterprise-grade software delivered in weeks, not months.',
    highlight: '3x faster time-to-market with 40% less complexity',
    image: (
      <div className="relative w-full h-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        {/* Solution visualization - workflow */}
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs text-slate-500">AI Analysis</span>
            </div>
            {/* Arrow */}
            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-xs text-slate-500">Architecture</span>
            </div>
            {/* Arrow */}
            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-slate-500">Deploy</span>
            </div>
          </div>
        </div>
        {/* Green success bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-cyan-500" />
      </div>
    ),
  },
  {
    id: 3,
    align: 'left',
    overline: 'The Platform',
    title: 'Trinity OS: Your Complete AI Infrastructure',
    description: 'Built from our years of serving enterprise clients, Trinity OS is our unified platform that provides AI integration, cloud infrastructure, and operational intelligence — all in one cohesive system.',
    highlight: 'Single pane of glass for all your AI & cloud operations',
    image: (
      <div className="relative w-full h-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        {/* Dashboard preview */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="col-span-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <div className="h-2 w-20 bg-blue-500/30 rounded" />
            </div>
            <div className="flex items-end gap-1 h-16">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/40 to-blue-500/10 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-3">
              <div className="h-2 w-12 bg-cyan-500/30 rounded mb-2" />
              <div className="h-4 w-8 bg-cyan-400/50 rounded" />
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-3">
              <div className="h-2 w-12 bg-green-500/30 rounded mb-2" />
              <div className="h-4 w-10 bg-green-400/50 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-2 text-center">
              <div className="h-1 w-full bg-slate-700 rounded mb-1" />
              <div className="h-1 w-2/3 bg-slate-800 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// Platform features for Trinity OS showcase
const platformFeatures = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'AI Command Center',
    description: 'Unified interface for managing LLMs, RAG pipelines, and AI agents across your entire organization.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: 'Cloud Orchestration',
    description: 'Multi-cloud infrastructure management with intelligent cost optimization and auto-scaling.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Observability Suite',
    description: 'Real-time monitoring, logging, and alerting with AI-powered anomaly detection.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Security Fabric',
    description: 'Zero-trust security model with automated compliance monitoring and threat detection.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION - Premium SaaS Aesthetic (Stripe/Vercel style)
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* ===== WEBGL HERO BACKGROUND ===== */}
        <WebGLHero />

        {/* ===== RADIAL LIGHTING BACKGROUND ===== */}
        <div className="absolute inset-0 radial-glow" />
        <div className="absolute inset-0 radial-glow-bottom" />

        {/* ===== ANIMATED GRID OVERLAY ===== */}
        <div className="absolute inset-0 grid-overlay [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]" />
        <div className="absolute inset-0 grid-overlay-premium opacity-50" />

        {/* ===== NOISE TEXTURE ===== */}
        <div className="absolute inset-0 noise-texture pointer-events-none" />

        {/* ===== FLOATING GLOW ORBS ===== */}
        {/* Top left - Blue orb */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] orb">
          <div className="w-full h-full rounded-full bg-blue-500/20 blur-[120px]" />
        </div>
        {/* Top right - Purple orb */}
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] orb-delayed">
          <div className="w-full h-full rounded-full bg-purple-500/15 blur-[100px]" />
        </div>
        {/* Center - Cyan accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb-slow">
          <div className="w-full h-full rounded-full bg-cyan-500/10 blur-[150px]" />
        </div>
        {/* Bottom left - Mixed glow */}
        <div className="absolute bottom-[20%] left-[15%] w-[350px] h-[350px] orb-delayed">
          <div className="w-full h-full rounded-full bg-indigo-500/12 blur-[80px]" />
        </div>
        {/* Bottom right - Pink accent */}
        <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] orb">
          <div className="w-full h-full rounded-full bg-violet-500/10 blur-[90px]" />
        </div>

        <Container className="relative z-10 py-24">
          <div className="max-w-6xl mx-auto text-center px-6 sm:px-8 md:px-12">
            {/* ===== PREMIUM BADGE ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass text-sm font-medium mb-8 sm:mb-12"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-400" />
              </span>
              <span className="text-slate-300">Now offering AI strategy workshops</span>
              <span className="text-slate-500">→</span>
            </motion.div>

            {/* ===== MAIN HEADLINE - Extra Large & Impactful ===== */}
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.92] tracking-tight mb-8 sm:mb-10"
            >
              Engineering{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent relative z-10">
                  AI-Powered
                </span>
                {/* Glow underline effect */}
                <svg className="absolute -bottom-3 sm:-bottom-5 left-0 w-full h-3 sm:h-5 text-indigo-400/30" viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path d="M0 15 Q75 5 150 15 T300 15" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path d="M0 18 Q75 8 150 18 T300 18" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
                </svg>
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Digital Platforms</span>
            </motion.h1>

            {/* ===== SUBHEADLINE ===== */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10 sm:mb-14"
            >
              Kritvia partners with technology leaders to architect, build, and deploy{' '}
              <span className="text-white font-medium">AI-powered systems</span> that create lasting competitive advantage — from concept to production in weeks, not months.
            </motion.p>

            {/* ===== PREMIUM CTA BUTTONS ===== */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16 sm:mb-24"
            >
              {/* Primary gradient button with glow */}
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center gap-3 py-3 px-6 sm:py-5 sm:px-9 font-semibold rounded-xl text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]"
              >
                {/* Gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_100%] group-hover:bg-[length:100%_100%] transition-all duration-500" />
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center gap-2">
                  Start Your Project
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>

              {/* Secondary glass button */}
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-3 px-9 py-5 font-semibold rounded-2xl text-white transition-all duration-300 hover:bg-white/10 border border-white/10 hover:border-white/20 glass group"
              >
                <span>View Case Studies</span>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </motion.div>

            {/* ===== STATS ROW ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-10 border-t border-white/10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* ===== SCROLL INDICATOR ===== */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-xs text-slate-600 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border border-slate-800 flex justify-center pt-2 bg-slate-950/50">
            <div className="w-1 h-2.5 bg-gradient-to-b from-slate-500 to-slate-700 rounded-full animate-bounce" />
          </div>
        </div>

        {/* ===== BOTTOM GRADIENT FADE ===== */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRODUCT STORY SECTION - Alternating layout with problem/solution narrative
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950 relative overflow-hidden">
        {/* Background atmosphere */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay-premium opacity-30" />

        <Container className="relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Our Story
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              From Vision to <span className="gradient-text">Reality</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              The story of how we're transforming enterprise technology — one breakthrough at a time.
            </p>
          </motion.div>

          <div className="space-y-24">
            {storySections.map((story, index) => (
              <div 
                key={story.id} 
                className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${story.align === 'right' ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className={`flex-1 ${story.align === 'right' ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
                    {story.overline}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                    {story.description}
                  </p>
                  <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r ${story.id === 1 ? 'from-red-500/10 to-orange-500/10' : story.id === 2 ? 'from-green-500/10 to-cyan-500/10' : 'from-blue-500/10 to-purple-500/10'} border ${story.id === 1 ? 'border-red-500/20' : story.id === 2 ? 'border-green-500/20' : 'border-blue-500/20'}`}>
                    <svg className={`w-5 h-5 ${story.id === 1 ? 'text-red-400' : story.id === 2 ? 'text-green-400' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className={`font-semibold ${story.id === 1 ? 'text-red-300' : story.id === 2 ? 'text-green-300' : 'text-blue-300'}`}>
                      {story.highlight}
                    </span>
                  </div>
                </div>

                {/* Visual/Image */}
                <div className="flex-1 w-full">
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-r ${story.id === 1 ? 'from-red-500/20 to-orange-500/20' : story.id === 2 ? 'from-green-500/20 to-cyan-500/20' : 'from-blue-500/20 to-purple-500/20'} opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />
                    
                    <div className="relative h-[320px] lg:h-[380px] bg-slate-900/50 rounded-2xl border border-slate-800/80 overflow-hidden group-hover:border-slate-700 transition-colors">
                      {/* Decorative elements */}
                      <div className="absolute top-4 left-4 right-4 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      </div>
                      
                      {/* Content */}
                      <div className="pt-16 px-6 h-full">
                        {story.image}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          PLATFORM SHOWCASE - Trinity OS
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-900/50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]" />

        <Container className="relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Platform info */}
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Introducing Trinity OS
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                Your Complete AI & Cloud <span className="gradient-text">Operating System</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Trinity OS consolidates your AI infrastructure, cloud operations, and observability into a single, intelligent platform. Built for enterprises that demand the best.
              </p>

              {/* Feature highlights */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {platformFeatures.map((feature, index) => (
                  <div 
                    key={feature.title} 
                    className="group flex gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-cyan-500/20 hover:bg-slate-800/40 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/platform"
                  className="group relative inline-flex items-center gap-3 px-7 py-3.5 font-semibold rounded-xl text-slate-950 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-[length:200%_100%] group-hover:bg-[length:100%_100%] transition-all duration-500" />
                  <span className="relative flex items-center gap-2">
                    Explore Trinity OS
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-7 py-3.5 font-semibold rounded-xl text-white transition-all duration-300 hover:bg-white/10 border border-white/10 hover:border-white/20 glass group"
                >
                  <span>Request Demo</span>
                </Link>
              </div>
            </div>

            {/* Right: Platform visual/dashboard */}
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
              
              <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Dashboard header */}
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">T</span>
                      </div>
                      <span className="text-white font-semibold">Trinity OS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-slate-500">System Online</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-6 space-y-4">
                  {/* Main stats row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-1">AI Models</div>
                      <div className="text-2xl font-bold text-white">24</div>
                      <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        +3 this week
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-1">Requests/day</div>
                      <div className="text-2xl font-bold text-white">1.2M</div>
                      <div className="text-xs text-cyan-400 flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        99.9% uptime
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-1">Cost Savings</div>
                      <div className="text-2xl font-bold text-white">42%</div>
                      <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        vs. previous
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-400">API Performance</span>
                      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Healthy</span>
                    </div>
                    <div className="flex items-end gap-1 h-20">
                      {[35, 55, 45, 70, 50, 85, 65, 90, 75, 95, 80, 88, 92, 85, 78, 95, 82, 90].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-gradient-to-t from-blue-600/60 to-cyan-500/40 rounded-t transition-all duration-300 hover:from-blue-500 hover:to-cyan-400"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'CPU', value: '34%', color: 'bg-blue-500' },
                      { label: 'Memory', value: '62%', color: 'bg-purple-500' },
                      { label: 'Disk', value: '45%', color: 'bg-cyan-500' },
                      { label: 'Network', value: '28%', color: 'bg-green-500' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/30 text-center">
                        <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                        <div className="text-sm font-semibold text-white">{stat.value}</div>
                        <div className={`h-1 mt-1 rounded-full ${stat.color}/50`} style={{ width: stat.value }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          LOGO CLOUD SECTION - Real company logos with grayscale to color on hover
      ═══════════════════════════════════════════════════════════ */}
      <LogoCloud />

      {/* ═══════════════════════════════════════════════════════════
          AI PLAYGROUND SECTION - Interactive AI Demo
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-purple-950/20 pointer-events-none" />
        <Container className="relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Interactive Demo
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Try Kritvia AI
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Experience the power of AI firsthand. Ask questions and get intelligent responses.
            </p>
          </div>
          <AIPlayground />
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          API DEMO SECTION - Live API Console
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-blue-950/20 pointer-events-none" />
        <Container className="relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Developer Experience
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Powerful APIs
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Build with our simple yet powerful APIs. Copy, run, and integrate in minutes.
            </p>
          </div>
          <APIDemo />
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          ARCHITECTURE DIAGRAM SECTION - Interactive System Diagram
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-purple-950/20 pointer-events-none" />
        <Container className="relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Platform Architecture
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Built for Scale
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Enterprise-grade architecture designed for reliability, security, and performance.
            </p>
          </div>
          <ArchitectureDiagram />
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          CLIENT PORTFOLIO SECTION - Work from sitelytc.com
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 via-transparent to-purple-950/10 pointer-events-none" />
        <Container className="relative z-10">
          <ClientPortfolio />
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          FOUNDER PROFILE SECTION - From mayank.sitelytc.com
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-indigo-950/10 pointer-events-none" />
        <Container className="relative z-10">
          <FounderProfile />
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES SECTION - 6 service cards with premium design
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950 relative">
        {/* Background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 grid-overlay-premium opacity-20" />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
              What We Do
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              End-to-End Technology Services
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From AI strategy to production deployment — we cover the full stack of modern technology consulting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group relative bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 hover:bg-slate-800/40 hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 via-transparent to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Bottom gradient on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:border-blue-500/30 transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/30 text-slate-500 group-hover:text-slate-400 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Explore all services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SOLUTIONS SECTION - Premium card styling with hover glow effects
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-900/30 relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
        {/* Subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-secondary-500/10 to-primary-500/10 border border-secondary-500/20 text-secondary-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Solutions
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Solutions Built for <span className="gradient-text">Business Impact</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Tailored solutions that address your unique business challenges and drive measurable outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {solutions.map((solution, index) => (
              <Link
                key={solution.title}
                href={solution.href}
                className="group relative bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-slate-700 transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient accent border on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-transparent transition-all duration-500">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${solution.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:xor] [border-radius:16px] border-2 border-transparent`} />
                </div>

                {/* Glow effect */}
                <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />

                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}>
                    {solution.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{solution.description}</p>
                  <div className="mt-5 flex items-center gap-1 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Learn more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          CASE STUDIES SECTION - Prominent metrics with gradient backgrounds
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950 relative">
        {/* Background glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Results That Speak
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Featured <span className="gradient-text-slow">Case Studies</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Real outcomes from real partnerships. See how we've helped companies transform with technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {caseStudies.map((cs, index) => (
              <Link
                key={cs.title}
                href="/case-studies"
                className={`group relative bg-gradient-to-br ${cs.color} border border-slate-800/60 rounded-2xl p-7 hover:border-slate-600 transition-all duration-500 hover:-translate-y-2 ${cs.glow} hover:shadow-xl`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{cs.industry}</span>
                    <div className="flex gap-1.5">
                      {cs.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm font-medium text-slate-400 mb-1">{cs.client}</div>
                  <h3 className="text-xl font-bold text-white mb-5 group-hover:text-primary-200 transition-colors">{cs.title}</h3>

                  {/* Prominent metric display */}
                  <div className="border-t border-slate-800/60 pt-5 mt-5">
                    <div className="flex items-baseline gap-3 mb-2">
                      <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        {cs.metric.split(' ')[0]}
                      </div>
                      {cs.metric.split(' ').slice(1).join(' ') && (
                        <div className="text-lg font-semibold text-slate-300">
                          {cs.metric.split(' ').slice(1).join(' ')}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {cs.result}
                    </div>
                  </div>

                  {/* Read more indicator */}
                  <div className="mt-6 flex items-center gap-2 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Read full case study
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-primary-500/30 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/10"
            >
              View All Case Studies
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          BENEFITS/OUTCOMES SECTION - Business outcomes with premium cards
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-900/50 relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Business Outcomes
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Transform Your Business with <span className="gradient-text">Measurable Results</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              We focus on delivering tangible outcomes that impact your bottom line — not just technical metrics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit, index) => (
              <Link
                key={benefit.title}
                href="/solutions"
                className="group relative bg-slate-900/60 border border-slate-800/60 rounded-2xl p-7 hover:bg-slate-800/60 hover:border-slate-700 transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-15 blur-xl transition-all duration-500`} />

                {/* Gradient accent border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-transparent transition-all duration-500">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:xor] [border-radius:16px] border-2 border-transparent`} />
                </div>

                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}>
                    {benefit.icon}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-100 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">
                    {benefit.description}
                  </p>

                  {/* Metric badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/30">
                    <svg className={`w-4 h-4 bg-gradient-to-br ${benefit.color} bg-clip-text text-transparent`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className={`text-sm font-bold bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}>
                      {benefit.metric}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Explore all solutions
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS SECTION - How we work
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-900/50 relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-secondary-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 grid-overlay-premium opacity-15" />

        <Container className="relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Our Proven Process</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A systematic approach to delivering complex technology projects on time and on budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary-700/50 to-transparent z-10" />
                )}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-primary-700/30 transition-colors">
                  <div className="text-4xl font-black text-primary-600/40 mb-4">{step.number}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          TECH STACK SECTION - Categorized technologies
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950">
        <Container>
          <TechStack
            title="Our Technology Stack"
            subtitle="We use the best tools for the job — battle-tested at scale and aligned with your team's capabilities."
          />
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          PRODUCTS SECTION - Future SaaS products
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-900/30 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Coming Soon
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Building the Future of Work
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Our internal tools, now available to you. Powering the next generation of enterprise productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500/30 transition-all group hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                  {product.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                    {product.status}
                  </span>
                </div>
                <p className="text-slate-400 mb-4">{product.description}</p>
                <Link
                  href={product.href}
                  className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Get notified
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          INSIGHTS SECTION - Blog previews
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-950">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Insights
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Latest from Our Blog
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
            >
              View all posts
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <Link
                key={insight.title}
                href={insight.href}
                className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-primary-400">{insight.category}</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-500">{insight.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                  {insight.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{insight.date}</span>
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
            >
              View all posts
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
      ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-900/50">
        <Container>
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Client Stories
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <TestimonialCarousel />
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA SECTION - Cinematic dark mode with premium styling
      ═══════════════════════════════════════════════════════════ */}
      <Section className="relative overflow-hidden">
        {/* Cinematic dark background */}
        <div className="absolute inset-0 bg-slate-950">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px]" />

          {/* Grid overlay */}
          <div className="absolute inset-0 grid-overlay opacity-30" />

          {/* Radial gradient for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
        </div>

        <Container className="relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-white/10 mb-10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span className="text-slate-300 text-sm font-medium">Start your transformation today</span>
            </div>

            {/* Main headline */}
            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
              Ready to build something{' '}
              <span className="relative inline-block">
                <span className="gradient-text relative z-10">
                  exceptional?
                </span>
                {/* Glow underline */}
                <svg className="absolute -bottom-3 left-0 w-full h-5 text-cyan-400/30" viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path d="M0 15 Q75 5 150 15 T300 15" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h2>

            <p className="text-xl lg:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join <span className="text-white font-semibold">50+ companies</span> that trust Kritvia to build the technology that powers their growth. Start with a free 60-minute strategy session.
            </p>

            {/* Premium CTA buttons */}
            <div className="flex flex-wrap gap-5 justify-center mb-10">
              {/* Primary gradient button with glow */}
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-3 px-10 py-5 font-bold rounded-2xl text-slate-950 overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(59,130,246,0.5)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_100%] group-hover:bg-[length:100%_100%] transition-all duration-500" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center gap-2 text-lg">
                  Book Free Strategy Session
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>

              {/* Secondary glass button */}
              <Link
                href="/pricing"
                className="inline-flex items-center gap-3 px-10 py-5 font-semibold rounded-2xl text-white transition-all duration-300 hover:bg-white/10 border border-white/10 hover:border-white/25 glass group"
              >
                <span className="text-lg">Explore Pricing</span>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Trust indicator */}
            <div className="flex items-center justify-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">No commitment required</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">60-minute session</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Expert engineers</span>
              </div>
            </div>
          </div>
        </Container>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      </Section>
    </>
  );
}
