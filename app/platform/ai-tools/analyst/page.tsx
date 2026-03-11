'use client';

import React, { useState, useEffect } from 'react';
import { ActivityTimeline } from '@/modules/kritvia-ai/ui/ai-activity-timeline';

interface AnalysisResult {
  id: string;
  type: string;
  insight: string;
  recommendation: string;
  confidence: number;
  timestamp: string;
}

export default function AnalystPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  const runAnalysis = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setActiveQuery(query);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: 'org_demo',
          query,
          context: { type: 'business_analysis' }
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Add simulated analysis results
        const newResult: AnalysisResult = {
          id: Date.now().toString(),
          type: 'Business Analysis',
          insight: data.data?.result || 'Analysis completed',
          recommendation: 'Review the insights and take action on high-priority items.',
          confidence: 0.85 + Math.random() * 0.1,
          timestamp: new Date().toISOString(),
        };
        setResults(prev => [newResult, ...prev]);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    
    setLoading(false);
  };

  const sampleQueries = [
    "What are my top performing products this quarter?",
    "Analyze customer churn risk",
    "Show revenue trends by region",
    "Identify bottleneck in sales pipeline",
  ];

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
            <div className="text-3xl">📊</div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Business Analyst</h1>
              <p className="text-sm text-neutral-400">Analyze business data and generate actionable insights</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analysis Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Input */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Ask a question about your business
              </label>
              <div className="space-y-3">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., What deals are likely to close this month?"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {sampleQueries.map((sq, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(sq)}
                        className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded hover:bg-neutral-700 hover:text-white transition-colors"
                      >
                        {sq.split(' ').slice(0, 3).join(' ')}...
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={runAnalysis}
                    disabled={loading || !query.trim()}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analyzing...
                      </span>
                    ) : 'Run Analysis'}
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Analysis Results</h2>
              
              {results.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <div className="text-4xl mb-4">📊</div>
                  <p>Run an analysis to see results here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
                    <div key={result.id} className="border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📈</span>
                          <span className="font-medium text-white">{result.type}</span>
                        </div>
                        <span className="text-xs text-neutral-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-neutral-300 mb-3">{result.insight}</p>
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                        <p className="text-sm text-primary-light">
                          <span className="font-medium">Recommendation:</span> {result.recommendation}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Confidence:</span>
                        <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${result.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-400">{Math.round(result.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <h3 className="font-medium text-white mb-4">Analysis Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Analyses</span>
                  <span className="text-white font-medium">{results.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Avg Confidence</span>
                  <span className="text-white font-medium">
                    {results.length > 0 
                      ? `${Math.round(results.reduce((a, b) => a + b.confidence, 0) / results.length * 100)}%`
                      : '-'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <h3 className="font-medium text-white mb-4">Recent Activity</h3>
              <div className="max-h-64 overflow-y-auto">
                <ActivityTimeline maxItems={10} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
