'use client';

import React, { useState, useEffect } from 'react';
import ChatInterface from '../../../modules/kritvia-ai/ui/ai-chat/chat-interface';
import AgentDashboard from '../../../modules/kritvia-ai/ui/agent-dashboard';
import { ActivityTimeline } from '../../../modules/kritvia-ai/ui/ai-activity-timeline';

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
      description: 'Analyze business data and generate insights',
      icon: '📊',
      status: 'active',
    },
    {
      id: 'sales',
      name: 'AI Sales Assistant',
      description: 'Monitor pipeline and recommend actions',
      icon: '💰',
      status: 'active',
    },
    {
      id: 'marketing',
      name: 'AI Marketing Strategist',
      description: 'Optimize campaigns and lead generation',
      icon: '📢',
      status: 'active',
    },
    {
      id: 'operations',
      name: 'AI Operations Monitor',
      description: 'Track tasks and detect bottlenecks',
      icon: '⚙️',
      status: 'active',
    },
    {
      id: 'forecast',
      name: 'AI Forecast Engine',
      description: 'Predict revenue and deal outcomes',
      icon: '🔮',
      status: 'active',
    },
    {
      id: 'insights',
      name: 'AI Insight Generator',
      description: 'Auto-generate actionable insights',
      icon: '💡',
      status: 'active',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
              <p className="text-sm text-gray-500">Kritvia AI Control Center</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                ● AI Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'tools', 'agents', 'insights', 'automation'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardData?.summary.revenue.toLocaleString() || '0'}
                </p>
                <p className={`text-sm ${dashboardData?.summary.revenueChange?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardData?.summary.revenueChange || '0%'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-sm text-gray-500">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardData?.summary.pipeline.toLocaleString() || '0'}
                </p>
                <p className={`text-sm ${dashboardData?.summary.pipelineChange?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardData?.summary.pipelineChange || '0%'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((dashboardData?.summary.conversion || 0) * 100)}%
                </p>
                <p className="text-sm text-gray-500">
                  {dashboardData?.summary.conversionChange || '0%'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-sm text-gray-500">AI Agents</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-sm text-green-600">All active</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <span className="text-2xl block mb-2">💬</span>
                  <span className="text-sm font-medium">Ask AI</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <span className="text-2xl block mb-2">📊</span>
                  <span className="text-sm font-medium">Run Analysis</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <span className="text-2xl block mb-2">🔮</span>
                  <span className="text-sm font-medium">View Forecasts</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <span className="text-2xl block mb-2">⚡</span>
                  <span className="text-sm font-medium">Automate</span>
                </button>
              </div>
            </div>

            {/* AI Chat */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
                <p className="text-sm text-gray-500">Ask questions about your business</p>
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <div key={tool.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl">{tool.icon}</div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tool.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tool.status}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">{tool.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">{tool.description}</p>
                    <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                      Open Tool
                    </button>
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
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
                <p className="text-sm text-gray-500">Generated insights and recommendations</p>
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Automation Center</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Lead Qualification', status: 'active', trigger: 'New lead created', action: 'Score and assign' },
                  { name: 'Deal Follow-up', status: 'active', trigger: 'Deal stage changed', action: 'Create follow-up task' },
                  { name: 'Churn Detection', status: 'active', trigger: 'Weekly analysis', action: 'Send alert' },
                  { name: 'Revenue Report', status: 'scheduled', trigger: 'Daily at 9 AM', action: 'Generate report' },
                ].map((automation) => (
                  <div key={automation.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{automation.name}</h3>
                      <p className="text-sm text-gray-500">{automation.trigger} → {automation.action}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      automation.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
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
