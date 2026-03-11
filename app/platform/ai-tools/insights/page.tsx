'use client';

import React, { useState, useEffect } from 'react';

interface CustomerSegment {
  id: string;
  name: string;
  count: number;
  revenue: number;
  growth: number;
  churnRisk: 'low' | 'medium' | 'high';
}

interface Insight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend';
  title: string;
  description: string;
  impact: string;
}

export default function InsightsPage() {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSegments([
      { id: '1', name: 'Enterprise', count: 145, revenue: 2450000, growth: 18.5, churnRisk: 'low' },
      { id: '2', name: 'Mid-Market', count: 892, revenue: 1890000, growth: 12.3, churnRisk: 'low' },
      { id: '3', name: 'SMB', count: 3450, revenue: 890000, growth: 8.7, churnRisk: 'medium' },
      { id: '4', name: 'Startup', count: 1205, revenue: 420000, growth: 25.2, churnRisk: 'high' },
      { id: '5', name: 'Free Tier', count: 15680, revenue: 0, growth: 45.1, churnRisk: 'medium' }
    ]);

    setInsights([
      { id: '1', type: 'opportunity', title: 'Enterprise Expansion Opportunity', description: '45 Enterprise accounts showing signs of expansion readiness', impact: '+$1.2M potential revenue' },
      { id: '2', type: 'risk', title: 'Startup Churn Alert', description: 'Startup segment showing 23% higher churn than baseline', impact: '-$180K at-risk ARR' },
      { id: '3', type: 'trend', title: 'Mid-Market Growth Acceleration', description: 'Mid-market segment grew 12.3% this quarter vs 8% last quarter', impact: '+340 new accounts' },
      { id: '4', type: 'opportunity', title: 'Free-to-Paid Conversion', description: 'Free tier users with 5+ seats showing 34% conversion potential', impact: '+$320K pipeline' }
    ]);

    setLoading(false);
  }, []);

  const getChurnColor = (risk: string) => {
    if (risk === 'low') return 'text-green-400 bg-green-500/10';
    if (risk === 'medium') return 'text-yellow-400 bg-yellow-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  const getInsightIcon = (type: string) => {
    if (type === 'opportunity') return '💡';
    if (type === 'risk') return '⚠️';
    return '📈';
  };

  const getInsightColor = (type: string) => {
    if (type === 'opportunity') return 'bg-green-500/5 border-green-500/20';
    if (type === 'risk') return 'bg-red-500/5 border-red-500/20';
    return 'bg-blue-500/5 border-blue-500/20';
  };

  const totalRevenue = segments.reduce((sum, s) => sum + s.revenue, 0);
  const totalCustomers = segments.reduce((sum, s) => sum + s.count, 0);
  const avgGrowth = segments.filter(s => s.revenue > 0).reduce((sum, s, _, arr) => sum + s.growth / arr.length, 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
    return '$' + value.toString();
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="bg-neutral-900/50 border-b border-neutral-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <a href="/platform/ai-tools" className="text-neutral-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div className="text-3xl">👥</div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Customer Insights</h1>
              <p className="text-sm text-neutral-400">Segmentation analysis and customer intelligence</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Total Customers</p>
              <p className="text-2xl font-bold text-white mt-1">{totalCustomers.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Total ARR</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Avg Growth Rate</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{avgGrowth.toFixed(1)}%</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Active Segments</p>
              <p className="text-2xl font-bold text-white mt-1">{segments.length}</p>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h2 className="text-lg font-semibold text-white">AI-Powered Insights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <div key={insight.id} className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getInsightIcon(insight.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white">{insight.title}</h3>
                      </div>
                      <p className="text-sm text-neutral-400 mb-2">{insight.description}</p>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-neutral-800 text-primary">
                        {insight.impact}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800">
              <h2 className="text-lg font-semibold text-white">Customer Segments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-950/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Segment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Growth</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Churn Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                        Loading segments...
                      </td>
                    </tr>
                  ) : (
                    segments.map((segment) => (
                      <tr key={segment.id} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-medium text-white">{segment.name}</p>
                        </td>
                        <td className="px-4 py-4 text-neutral-300">{segment.count.toLocaleString()}</td>
                        <td className="px-4 py-4 text-neutral-300">
                          {segment.revenue > 0 ? formatCurrency(segment.revenue) : '-'}
                        </td>
                        <td className="px-4 py-4">
                          <span className={segment.growth >= 15 ? 'text-green-400' : segment.growth >= 5 ? 'text-yellow-400' : 'text-red-400'}>
                            +{segment.growth}%
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getChurnColor(segment.churnRisk)}`}>
                            {segment.churnRisk}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
