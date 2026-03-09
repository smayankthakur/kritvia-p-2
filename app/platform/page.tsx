'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Button, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const features = [
  {
    id: 'dashboard',
    name: 'Client Dashboard',
    description: 'Track all your projects, invoices, and deliverables in one place',
    icon: '📊',
    href: '/platform/dashboard',
    color: 'from-blue-500/20 to-blue-600/10',
    stats: ['4 Active Projects', '$85K Revenue', '12 Deliverables'],
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    description: 'Generate content, analyze leads, and build automations with AI',
    icon: '🤖',
    href: '/platform/ai-tools',
    color: 'from-purple-500/20 to-purple-600/10',
    stats: ['4 AI Tools', '775 Generations', '99.9% Uptime'],
  },
  {
    id: 'startup-builder',
    name: 'Startup Builder',
    description: 'Plan your SaaS product with AI-powered recommendations',
    icon: '🚀',
    href: '/platform/startup-builder',
    color: 'from-green-500/20 to-green-600/10',
    stats: ['500+ Plans Generated', '$50K Avg. Budget', '6mo Avg. Timeline'],
  },
  {
    id: 'developers',
    name: 'Developer Portal',
    description: 'Build with our APIs, SDKs, and comprehensive documentation',
    icon: '👨‍💻',
    href: '/platform/developers',
    color: 'from-orange-500/20 to-orange-600/10',
    stats: ['5 API Endpoints', '4 SDKs', '24/7 Access'],
  },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[120px]" />
        
        <Container className="relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-6">
              🚀 Kritvia Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Complete<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                Technology Partner
              </span>
            </h1>
            <p className="text-xl text-neutral-400 mb-8">
              Everything you need to build, launch, and scale your digital products. 
              From AI-powered tools to comprehensive dashboards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/platform/dashboard">
                <Button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 px-8 py-3">
                  Go to Dashboard →
                </Button>
              </Link>
              <Link href="/platform/startup-builder">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-3 border-neutral-700 text-white hover:bg-neutral-800">
                  Try Startup Builder
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-neutral-800/50">
        <Container>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Active Clients' },
              { value: '$12M+', label: 'Projects Delivered' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-neutral-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              A comprehensive suite of tools and services to power your digital transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link key={feature.id} href={feature.href}>
                <Card className="bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-all group h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl',
                        'bg-gradient-to-br',
                        feature.color
                      )}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                          {feature.name}
                        </h3>
                        <p className="text-neutral-400 mb-4">{feature.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {feature.stats.map((stat, i) => (
                            <span key={i} className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-400">
                              {stat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-neutral-800/50">
        <Container>
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20" />
            
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Join 500+ companies already using Kritvia to build and scale their technology products
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-primary-600 hover:bg-white/90 px-8 py-3 font-semibold">
                  Start Free Trial
                </Button>
                <Link href="/contact">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                    Talk to Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
