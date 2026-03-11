'use client';

import { useState, useEffect } from 'react';

interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface PipelineData {
  totalValue: number;
  dealsByStage: Record<string, number>;
  avgProbability: number;
}

export default function InsightsDashboard() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [pipeline, setPipeline] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch insights
        const insightsRes = await fetch('/api/ai/insights?type=all&limit=5');
        const insightsData = await insightsRes.json();
        
        // Add mock insights if none exist
        if (!insightsData.data || insightsData.data.length === 0) {
          setInsights([
            {
              id: '1',
              type: 'sales',
              title: 'High-Value Deal Alert',
              description: 'Acme Corp deal worth $50K is ready for proposal',
              priority: 'high',
            },
            {
              id: '2',
              type: 'pipeline',
              title: 'Pipeline Health',
              description: '3 deals in negotiation, 80% avg probability',
              priority: 'medium',
            },
            {
              id: '3',
              type: 'marketing',
              title: 'Campaign Performance',
              description: 'Campaign ROI: Q1 up 15% this week',
              priority: 'low',
            },
          ]);
        } else {
          setInsights(insightsData.data);
        }

        // Mock pipeline data
        setPipeline({
          totalValue: 150000,
          dealsByStage: {
            discovery: 1,
            proposal: 1,
            negotiation: 1,
          },
          avgProbability: 57,
        });
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      {pipeline && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500">Pipeline Value</p>
            <p className="text-2xl font-bold text-gray-900">
              ${pipeline.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500">Active Deals</p>
            <p className="text-2xl font-bold text-gray-900">
              {Object.values(pipeline.dealsByStage).reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500">Avg. Probability</p>
            <p className="text-2xl font-bold text-gray-900">
              {pipeline.avgProbability}%
            </p>
          </div>
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        {insights.length === 0 ? (
          <p className="text-gray-500">No insights available yet.</p>
        ) : (
          insights.map(insight => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm mt-1">{insight.description}</p>
                </div>
                <span className="text-xs uppercase font-medium px-2 py-1 bg-white rounded">
                  {insight.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            View All Leads
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            View Pipeline
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
