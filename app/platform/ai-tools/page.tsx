'use client';

import React, { useState, useEffect } from 'react';
import ChatInterface from '@/modules/kritvia-ai/ui/ai-chat/chat-interface';
import AgentDashboard from '@/modules/kritvia-ai/ui/agent-dashboard';
import { ActivityTimeline } from '@/modules/kritvia-ai/ui/ai-activity-timeline';

interface DashboardData {
  summary: {
    revenue: number;
    revenueChange: string;
    pipeline: number;
    pipelineChange: string;
    conversion: number;
    conversionChange: string;
  };
  metrics: Array<{
    metric: string;
    value: number;
    change?: string;
    trend: string;
  }>;
  forecasts?: {
    revenue: Array<{ period: string; predicted: number }>;
  };
}

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const res = await fetch('/api/analytics/dashboard?organizationId=org_demo');
      const data = await res.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
    setLoading(false);
  };

  const tools = [
    {
      id: 'analyst',
      name: 'AI Business Analyst',
      description: 'Analyze business data and generate actionable insights with AI-powered analysis.',
      icon: '📊',
      status: 'active',
      href: '/platform/ai-tools/analyst',
    },
    {
      id: 'sales',
      name: 'AI Sales Assistant',
      description: 'Monitor pipeline health and get intelligent recommendations for closing deals.',
      icon: '💰',
      status: 'active',
      href: '/platform/ai-tools/sales-agent',
    },
    {
      id: 'marketing',
      name: 'AI Marketing Strategist',
      description: 'Optimize campaigns and generate leads with AI-driven marketing strategies.',
      icon: '📢',
      status: 'active',
      href: '/platform/ai-tools/marketing',
    },
    {
      id: 'operations',
      name: 'AI Operations Monitor',
      description: 'Track tasks, detect bottlenecks, and automate workflow optimization.',
      icon: '⚙️',
      status: 'active',
      href: '/platform/ai-tools/operations',
    },
    {
      id: 'forecast',
      name: 'AI Forecast Engine',
      description: 'Predict revenue trends and deal outcomes with precision forecasting.',
      icon: '🔮',
      status: 'active',
      href: '/platform/ai-tools/forecast',
    },
    {
      id: 'insights',
      name: 'AI Insight Generator',
      description: 'Automatically generate actionable insights from your business data.',
      icon: '💡',
      status: 'active',
      href: '/platform/ai-tools/insights',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-400">Loading AI Tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="bg-neutral-900/50 border-b border-neutral-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">AI Tools</h1>
              <p className="text-sm text-neutral-400">Kritvia AI Control Center</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-sm rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                AI Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-neutral-900/30 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'tools', 'agents', 'insights', 'automation'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                <p className="text-sm text-neutral-400">Revenue</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ${dashboardData?.summary.revenue.toLocaleString() || '0'}
                </p>
                <p className={`text-sm mt-1 ${
                  dashboardData?.summary.revenueChange?.startsWith('+') 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {dashboardData?.summary.revenueChange || '0%'}
                </p>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                <p className="text-sm text-neutral-400">Pipeline Value</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ${dashboardData?.summary.pipeline.toLocaleString() || '0'}
                </p>
                <p className={`text-sm mt-1 ${
                  dashboardData?.summary.pipelineChange?.startsWith('+')
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {dashboardData?.summary.pipelineChange || '0%'}
                </p>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                <p className="text-sm text-neutral-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {Math.round((dashboardData?.summary.conversion || 0) * 100)}%
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  {dashboardData?.summary.conversionChange || '0%'}
                </p>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                <p className="text-sm text-neutral-400">AI Agents</p>
                <p className="text-2xl font-bold text-white mt-1">4</p>
                <p className="text-sm text-green-400 mt-1">All active</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="p-4 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:border-neutral-700 text-center transition-all group"
                >
                  <span className="text-2xl block mb-2">💬</span>
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Ask AI</span>
                </button>
                <button 
                  onClick={() => setActiveTab('tools')}
                  className="p-4 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:border-neutral-700 text-center transition-all group"
                >
                  <span className="text-2xl block mb-2">📊</span>
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Run Analysis</span>
                </button>
                <button 
                  onClick={() => setActiveTab('insights')}
                  className="p-4 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:border-neutral-700 text-center transition-all group"
                >
                  <span className="text-2xl block mb-2">🔮</span>
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white">View Forecasts</span>
                </button>
                <button 
                  onClick={() => setActiveTab('automation')}
                  className="p-4 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:border-neutral-700 text-center transition-all group"
                >
                  <span className="text-2xl block mb-2">⚡</span>
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Automate</span>
                </button>
              </div>
            </div>

            {/* AI Chat */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-neutral-800">
                <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                <p className="text-sm text-neutral-400">Ask questions about your business</p>
              </div>
              <div className="h-80">
                <ChatInterface />
              </div>
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">AI Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <div 
                    key={tool.id} 
                    className="border border-neutral-800 rounded-xl p-5 hover:border-primary/50 hover:bg-neutral-900/80 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-3xl">{tool.icon}</div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tool.status === 'active' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {tool.status}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-white group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="mt-2 text-sm text-neutral-400">{tool.description}</p>
                    <a 
                      href={tool.href}
                      className="mt-4 w-full px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 hover:border-primary/40 text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      Open Tool
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <AgentDashboard />
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl">
              <div className="p-4 border-b border-neutral-800">
                <h2 className="text-lg font-semibold text-white">AI Insights</h2>
                <p className="text-sm text-neutral-400">Generated insights and recommendations</p>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <ActivityTimeline maxItems={20} />
              </div>
            </div>
          </div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Automation Center</h2>
              
              <div className="space-y-3">
                {[
                  { name: 'Lead Qualification', status: 'active', trigger: 'New lead created', action: 'Score and assign' },
                  { name: 'Deal Follow-up', status: 'active', trigger: 'Deal stage changed', action: 'Create follow-up task' },
                  { name: 'Churn Detection', status: 'active', trigger: 'Weekly analysis', action: 'Send alert' },
                  { name: 'Revenue Report', status: 'scheduled', trigger: 'Daily at 9 AM', action: 'Generate report' },
                ].map((automation) => (
                  <div key={automation.name} className="flex items-center justify-between p-4 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors">
                    <div>
                      <h3 className="font-medium text-white">{automation.name}</h3>
                      <p className="text-sm text-neutral-400">{automation.trigger} → {automation.action}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      automation.status === 'active'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {automation.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
