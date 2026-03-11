'use client';

import { useState, useEffect } from 'react';

// Types
interface AIInsight {
  id: string;
  insightType: 'anomaly' | 'opportunity' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  confidenceScore: number;
  recommendedActions: string[];
  createdAt: number;
  acknowledged: boolean;
}

interface AIInsightFeedProps {
  organizationId?: string;
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// Severity colors
const severityColors = {
  critical: 'bg-red-500/20 border-red-500/50 text-red-400',
  high: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
  medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  low: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
};

// Insight type icons
const insightIcons = {
  anomaly: '⚠️',
  opportunity: '🎯',
  warning: '🚨',
  info: 'ℹ️',
};

export default function AIInsightFeed({
  organizationId = 'default',
  maxItems = 10,
  autoRefresh = true,
  refreshInterval = 30000,
}: AIInsightFeedProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch insights
  const fetchInsights = async () => {
    try {
      const response = await fetch(`/api/ai/insights?organizationId=${organizationId}&limit=${maxItems}`);
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights || []);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load insights');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh
  useEffect(() => {
    fetchInsights();
    
    if (autoRefresh) {
      const interval = setInterval(fetchInsights, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [organizationId, autoRefresh, refreshInterval, maxItems]);

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  // Acknowledge insight
  const handleAcknowledge = async (insightId: string) => {
    try {
      await fetch(`/api/ai/insights?insightId=${insightId}`, {
        method: 'PUT',
      });
      setInsights(prev => 
        prev.map(i => 
          i.id === insightId ? { ...i, acknowledged: true } : i
        )
      );
    } catch (err) {
      console.error('Error acknowledging insight:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-neutral-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="text-red-400 text-sm">{error}</div>
        <button 
          onClick={fetchInsights}
          className="mt-2 text-sm text-neutral-400 hover:text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="text-neutral-400 text-sm text-center py-8">
          No AI insights yet. Insights will appear here as they're generated.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`
            relative p-4 rounded-lg border transition-all
            ${severityColors[insight.severity]}
            ${insight.acknowledged ? 'opacity-60' : ''}
          `}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{insightIcons[insight.insightType]}</span>
              <h3 className="font-semibold text-white text-sm">{insight.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">
                {formatTime(insight.createdAt)}
              </span>
              <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                {insight.confidenceScore.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-neutral-300 text-sm mb-3">{insight.description}</p>

          {/* Recommended Actions */}
          {insight.recommendedActions.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-neutral-500 mb-1">Recommended Actions:</p>
              <ul className="space-y-1">
                {insight.recommendedActions.slice(0, 3).map((action, idx) => (
                  <li key={idx} className="text-xs text-neutral-400 flex items-center gap-2">
                    <span className="text-primary-400">→</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          {!insight.acknowledged && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAcknowledge(insight.id)}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1 rounded transition-colors"
              >
                Acknowledge
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
