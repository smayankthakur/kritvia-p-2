'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const aiTools = [
  {
    id: 'content-generator',
    name: 'AI Content Generator',
    description: 'Generate blog posts, marketing copy, and technical documentation with AI',
    icon: '✍️',
    color: 'from-blue-500/20 to-blue-600/10',
    status: 'Active',
    usage: { current: 450, limit: 1000 },
    features: ['Blog Posts', 'Marketing Copy', 'Technical Docs', 'Email Templates'],
  },
  {
    id: 'lead-analyzer',
    name: 'AI Lead Analyzer',
    description: 'Analyze leads, predict conversion probability, and score prospects',
    icon: '🎯',
    color: 'from-green-500/20 to-green-600/10',
    status: 'Active',
    usage: { current: 280, limit: 500 },
    features: ['Lead Scoring', 'Conversion Prediction', 'Segment Analysis', 'CRM Sync'],
  },
  {
    id: 'automation-builder',
    name: 'AI Automation Builder',
    description: 'Build intelligent workflows with AI-powered decision making',
    icon: '🔄',
    color: 'from-purple-500/20 to-purple-600/10',
    status: 'Beta',
    usage: { current: 45, limit: 100 },
    features: ['Visual Builder', 'AI Decisions', 'Integration Hub', 'Schedule Triggers'],
  },
  {
    id: 'support-bot',
    name: 'AI Customer Support Bot',
    description: 'Deploy an intelligent chatbot trained on your documentation',
    icon: '💬',
    color: 'from-orange-500/20 to-orange-600/10',
    status: 'Coming Soon',
    usage: { current: 0, limit: 0 },
    features: ['Custom Training', 'Multi-channel', 'Human Handoff', 'Analytics'],
  },
];

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState(aiTools[0]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Tools</h1>
            <p className="text-neutral-400">Powerful AI tools to accelerate your business</p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool)}
              className={cn(
                'text-left p-4 rounded-xl border transition-all',
                activeTool.id === tool.id
                  ? 'bg-neutral-800 border-primary-500/50 ring-1 ring-primary-500/30'
                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700',
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{tool.icon}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  tool.status === 'Active' && 'bg-green-500/20 text-green-400',
                  tool.status === 'Beta' && 'bg-yellow-500/20 text-yellow-400',
                  tool.status === 'Coming Soon' && 'bg-neutral-500/20 text-neutral-400',
                )}>{tool.status}</span>
              </div>
              <h3 className="font-semibold text-white mb-1">{tool.name}</h3>
              <p className="text-xs text-neutral-500 line-clamp-2">{tool.description}</p>
            </button>
          ))}
        </div>

        {/* Active Tool Detail */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{activeTool.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeTool.name}</h2>
                    <p className="text-neutral-400 text-sm">{activeTool.description}</p>
                  </div>
                </div>

                {/* Usage */}
                {activeTool.limit > 0 && (
                  <div className="mb-6 p-4 bg-neutral-800/50 rounded-xl">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-400">Usage This Month</span>
                      <span className="text-white">{activeTool.usage.current} / {activeTool.usage.limit}</span>
                    </div>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                        style={{ width: `${(activeTool.usage.current / activeTool.usage.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="space-y-4">
                  <textarea
                    placeholder={`Enter your ${activeTool.name.toLowerCase()} prompt...`}
                    className="w-full h-40 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors">
                        📎 Attach
                      </button>
                      <button className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors">
                        📋 Templates
                      </button>
                    </div>
                    <Button className="bg-primary-600 hover:bg-primary-500">
                      Generate →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-3">Features</h3>
                <div className="space-y-2">
                  {activeTool.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-neutral-400">
                      <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                    📊 View Analytics
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                    ⚙️ Configure
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                    📜 View History
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
