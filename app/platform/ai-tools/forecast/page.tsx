'use client';

import React, { useState, useEffect } from 'react';

interface ForecastData {
  month: string;
  actual: number | null;
  forecast: number;
  target: number;
}

interface Scenario {
  name: string;
  probability: number;
  revenue: number;
}

export default function ForecastPage() {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'base' | 'optimistic'>('base');

  useEffect(() => {
    setForecastData([
      { month: 'Jan', actual: 125000, forecast: 120000, target: 130000 },
      { month: 'Feb', actual: 142000, forecast: 135000, target: 140000 },
      { month: 'Mar', actual: 158000, forecast: 150000, target: 155000 },
      { month: 'Apr', actual: null, forecast: 165000, target: 170000 },
      { month: 'May', actual: null, forecast: 180000, target: 185000 },
      { month: 'Jun', actual: null, forecast: 195000, target: 200000 }
    ]);
    setLoading(false);
  }, []);

  const scenarios: Scenario[] = [
    { name: 'Conservative', probability: 25, revenue: 820000 },
    { name: 'Base Case', probability: 55, revenue: 945000 },
    { name: 'Optimistic', probability: 20, revenue: 1100000 }
  ];

  const getCurrentScenario = () => {
    switch (selectedScenario) {
      case 'conservative': return scenarios[0];
      case 'optimistic': return scenarios[2];
      default: return scenarios[1];
    }
  };

  const totalActual = forecastData.filter(d => d.actual).reduce((sum, d) => sum + (d.actual || 0), 0);
  const totalForecast = forecastData.reduce((sum, d) => sum + d.forecast, 0);
  const totalTarget = forecastData.reduce((sum, d) => sum + d.target, 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
    return '$' + value.toString();
  };

  const calculateProgress = () => {
    if (!totalActual) return 0;
    return Math.round((totalActual / totalTarget) * 100);
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
            <div className="text-3xl">🔮</div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Revenue Forecast</h1>
              <p className="text-sm text-neutral-400">Predictive analytics and scenario planning</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">YTD Actual Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalActual)}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Full Year Forecast</p>
              <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(totalForecast)}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Annual Target</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalTarget)}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
              <p className="text-sm text-neutral-400">Target Achievement</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{calculateProgress()}%</p>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <h2 className="text-lg font-semibold text-white">Scenario Planning</h2>
              </div>
              <div className="flex gap-2">
                {(['conservative', 'base', 'optimistic'] as const).map((scenario) => (
                  <button
                    key={scenario}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedScenario === scenario
                        ? 'bg-primary text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.name}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedScenario === scenario.name.toLowerCase()
                      ? 'bg-primary/10 border-primary/50'
                      : 'bg-neutral-900/50 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{scenario.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedScenario === scenario.name.toLowerCase()
                        ? 'bg-primary/20 text-primary'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {scenario.probability}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(scenario.revenue)}</p>
                  <p className="text-sm text-neutral-500 mt-1">Expected Revenue</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h2 className="text-lg font-semibold text-white">Forecast Insights</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                <span className="text-green-400">📈</span>
                <div>
                  <p className="font-medium text-white">Strong Q1 Performance</p>
                  <p className="text-sm text-neutral-400">Actual revenue 8% above forecast</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <span className="text-blue-400">🎯</span>
                <div>
                  <p className="font-medium text-white">On Track for Base Case</p>
                  <p className="text-sm text-neutral-400">Current trajectory aligns with 55% probability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
