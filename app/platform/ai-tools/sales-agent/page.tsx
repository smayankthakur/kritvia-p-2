'use client';

import React, { useState, useEffect } from 'react';

interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
  owner: string;
}

export default function SalesAgentPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const res = await fetch('/api/crm/deals?organizationId=org_demo');
      const data = await res.json();
      if (data.success) {
        setDeals(data.data?.deals || []);
      }
    } catch (error) {
      console.error('Failed to load deals:', error);
    }
    setLoading(false);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'lead': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'qualified': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'proposal': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'negotiation': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'closed_won': 'bg-green-500/10 text-green-400 border-green-500/20',
      'closed_lost': 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return colors[stage] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-green-400';
    if (prob >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const pipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const weightedValue = deals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0);
  const avgProbability = deals.length > 0 
    ? deals.reduce((sum, d) => sum + d.probability, 0) / deals.length 
    : 0;

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
            <div className="text-3xl">💰</div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Sales Assistant</h1>
              <p className="text-sm text-neutral-400">Monitor pipeline and get intelligent recommendations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Pipeline Value</p>
              <p className="text-2xl font-bold text-white mt-1">${pipelineValue.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Weighted Value</p>
              <p className="text-2xl font-bold text-white mt-1">${weightedValue.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Avg Probability</p>
              <p className="text-2xl font-bold text-white mt-1">{Math.round(avgProbability)}%</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Active Deals</p>
              <p className="text-2xl font-bold text-white mt-1">{deals.length}</p>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
            </div>
            <div className="space-y-3">
              {deals.filter(d => d.probability >= 60).slice(0, 3).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{deal.name}</p>
                    <p className="text-sm text-neutral-400">${deal.value.toLocaleString()} • {deal.stage}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full">
                    High Priority
                  </span>
                </div>
              ))}
              {deals.length === 0 && (
                <p className="text-neutral-500 text-center py-4">No deals found</p>
              )}
            </div>
          </div>

          {/* Deals Table */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800">
              <h2 className="text-lg font-semibold text-white">Pipeline Deals</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-950/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Deal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Stage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Probability</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Expected Close</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                        Loading deals...
                      </td>
                    </tr>
                  ) : deals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                        No deals found
                      </td>
                    </tr>
                  ) : (
                    deals.map((deal) => (
                      <tr 
                        key={deal.id} 
                        className="hover:bg-neutral-800/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedDeal(selectedDeal?.id === deal.id ? null : deal)}
                      >
                        <td className="px-4 py-4">
                          <p className="font-medium text-white">{deal.name}</p>
                          <p className="text-sm text-neutral-500">{deal.owner}</p>
                        </td>
                        <td className="px-4 py-4 text-white">${deal.value.toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getStageColor(deal.stage)}`}>
                            {deal.stage}
                          </span>
                        </td>
                        <td className={`px-4 py-4 font-medium ${getProbabilityColor(deal.probability)}`}>
                          {deal.probability}%
                        </td>
                        <td className="px-4 py-4 text-neutral-400">
                          {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString() : '-'}
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
