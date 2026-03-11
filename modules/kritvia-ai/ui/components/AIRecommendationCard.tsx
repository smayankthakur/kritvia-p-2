'use client';

import React from 'react';

interface AIRecommendationCardProps {
  recommendation: string;
  reasoning: string;
  confidenceScore: number;
  dataSources: string[];
  type?: 'insight' | 'decision' | 'pattern' | 'action';
  onAction?: () => void;
  actionLabel?: string;
}

export function AIRecommendationCard({
  recommendation,
  reasoning,
  confidenceScore,
  dataSources,
  type = 'insight',
  onAction,
  actionLabel,
}: AIRecommendationCardProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return 'High confidence';
    if (score >= 0.6) return 'Medium confidence';
    return 'Low confidence';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'insight': return '💡';
      case 'decision': return '🎯';
      case 'pattern': return '📈';
      case 'action': return '⚡';
      default: return '🤖';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'insight': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'decision': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'pattern': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'action': return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      default: return 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400';
    }
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getTypeIcon(type)}</span>
          <span className={`px-2 py-0.5 text-xs rounded-full border ${getTypeColor(type)}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-sm font-medium ${getConfidenceColor(confidenceScore)}`}>
            {Math.round(confidenceScore * 100)}%
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mb-3">
        <h4 className="font-semibold text-white text-lg">{recommendation}</h4>
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <p className="text-sm text-neutral-400">{reasoning}</p>
      </div>

      {/* Confidence bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-neutral-500">Confidence</span>
          <span className={getConfidenceColor(confidenceScore)}>{getConfidenceLabel(confidenceScore)}</span>
        </div>
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              confidenceScore >= 0.8 ? 'bg-green-500' : confidenceScore >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${confidenceScore * 100}%` }}
          />
        </div>
      </div>

      {/* Data Sources */}
      <div className="mb-4">
        <p className="text-xs text-neutral-500 mb-2">Data Sources</p>
        <div className="flex flex-wrap gap-2">
          {dataSources.map((source, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-neutral-800 text-neutral-400 rounded"
            >
              {source}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {onAction && (
        <button
          onClick={onAction}
          className="w-full mt-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 
            text-primary rounded-lg transition-colors text-sm font-medium"
        >
          {actionLabel || 'Take Action'}
        </button>
      )}
    </div>
  );
}

// Simplified version for inline use
interface AIRecommendationBadgeProps {
  recommendation: string;
  confidenceScore: number;
}

export function AIRecommendationBadge({ recommendation, confidenceScore }: AIRecommendationBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (score >= 0.6) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${getColor(confidenceScore)}`}>
      <span>🤖</span>
      <span className="font-medium">{recommendation}</span>
      <span className="opacity-70">({Math.round(confidenceScore * 100)}%)</span>
    </div>
  );
}

export default AIRecommendationCard;
