'use client';

import React, { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  roi: number;
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'impressions' | 'clicks' | 'conversions'>('clicks');

  useEffect(() => {
    // Mock campaign data
    setCampaigns([
      {
        id: '1',
        name: 'Q1 Brand Awareness',
        channel: 'Social',
        status: 'active',
        impressions: 245000,
        clicks: 12800,
        conversions: 890,
        spend: 12500,
        roi: 245
      },
      {
        id: '2',
        name: 'Product Launch - Enterprise',
        channel: 'LinkedIn',
        status: 'active',
        impressions: 89000,
        clicks: 4200,
        conversions: 312,
        spend: 8200,
        roi: 312
      },
      {
        id: '3',
        name: 'Retargeting - SaaS',
        channel: 'Display',
        status: 'active',
        impressions: 156000,
        clicks: 7800,
        conversions: 456,
        spend: 5400,
        roi: 189
      },
      {
        id: '4',
        name: 'Email Nurture Series',
        channel: 'Email',
        status: 'active',
        impressions: 45000,
        clicks: 8900,
        conversions: 723,
        spend: 1200,
        roi: 567
      },
      {
        id: '5',
        name: 'Search - Brand Terms',
        channel: 'Google',
        status: 'paused',
        impressions: 67000,
        clicks: 3400,
        conversions: 198,
        spend: 4100,
        roi: 145
      }
    ]);
    setLoading(false);
  }, []);

  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const avgRoi = campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length;

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (status === 'paused') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
  };

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, string> = {
      'Social': '📱',
      'LinkedIn': '💼',
      'Display': '🖥️',
      'Email': '📧',
      'Google': '🔍'
    };
    return icons[channel] || '📊';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="bg-neutral-900/50 border-b border-neutral-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <a href="/platform/ai-tools" className="text-neutral-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div className="text-3xl">📈</div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Marketing Analyst</h1>
              <p className="text-sm text-neutral-400">Campaign performance insights and optimization</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Total Impressions</p>
              <p className="text-2xl font-bold text-white mt-1">{formatNumber(totalImpressions)}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Total Clicks</p>
              <p className="text-2xl font-bold text-white mt-1">{formatNumber(totalClicks)}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Conversions</p>
              <p className="text-2xl font-bold text-white mt-1">{formatNumber(totalConversions)}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Total Spend</p>
              <p className="text-2xl font-bold text-white mt-1">${totalSpend.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Avg ROI</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{Math.round(avgRoi)}%</p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                <span className="text-green-400">✓</span>
                <div>
                  <p className="font-medium text-white">Increase Email Campaign Budget</p>
                  <p className="text-sm text-neutral-400">Highest ROI (567%) - Consider scaling by 20%</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <span className="text-blue-400">💡</span>
                <div>
                  <p className="font-medium text-white">Optimize LinkedIn Creative</p>
                  <p className="text-sm text-neutral-400">CTR above benchmark - Test new headlines</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <span className="text-yellow-400">⚠</span>
                <div>
                  <p className="font-medium text-white">Review Paused Campaign</p>
                  <p className="text-sm text-neutral-400">"Brand Terms" has low performance - Consider restructuring</p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns Table */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Campaign Performance</h2>
              <div className="flex gap-2">
                {(['impressions', 'clicks', 'conversions'] as const).map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      selectedMetric === metric
                        ? 'bg-primary text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-950/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Campaign</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Channel</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Impressions</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Clicks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">CTR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Conv.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Spend</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-neutral-500">
                        Loading campaigns...
                      </td>
                    </tr>
                  ) : campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-white">{campaign.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-2">
                          <span>{getChannelIcon(campaign.channel)}</span>
                          <span className="text-neutral-300">{campaign.channel}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-neutral-300">{formatNumber(campaign.impressions)}</td>
                      <td className="px-4 py-4 text-neutral-300">{formatNumber(campaign.clicks)}</td>
                      <td className="px-4 py-4 text-primary">{((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</td>
                      <td className="px-4 py-4 text-neutral-300">{campaign.conversions}</td>
                      <td className="px-4 py-4 text-neutral-300">${campaign.spend.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={campaign.roi >= 200 ? 'text-green-400' : campaign.roi >= 100 ? 'text-yellow-400' : 'text-red-400'}>
                          {campaign.roi}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
