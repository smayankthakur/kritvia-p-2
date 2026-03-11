/**
 * Continuous AI Feedback Loop
 * 
 * Captures user feedback on AI recommendations to improve accuracy.
 */

import { randomUUID } from 'crypto';

// Types
export interface AIFeedback {
  id: string;
  organizationId: string;
  recommendationId: string;
  feedbackType: 'positive' | 'negative' | 'neutral';
  rating?: number; // 1-5
  comment?: string;
  userId?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface FeedbackSummary {
  organizationId: string;
  totalFeedback: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  averageRating: number;
  positivePercentage: number;
  lastUpdated: number;
}

// In-memory storage
const feedbackStore: Map<string, AIFeedback[]> = new Map();

/**
 * Record feedback on AI recommendation
 */
export async function recordFeedback(
  organizationId: string,
  recommendationId: string,
  feedback: {
    feedbackType: 'positive' | 'negative' | 'neutral';
    rating?: number;
    comment?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<AIFeedback> {
  const newFeedback: AIFeedback = {
    id: randomUUID(),
    organizationId,
    recommendationId,
    feedbackType: feedback.feedbackType,
    rating: feedback.rating,
    comment: feedback.comment,
    userId: feedback.userId,
    timestamp: Date.now(),
    metadata: feedback.metadata,
  };
  
  // Store feedback
  const existing = feedbackStore.get(organizationId) || [];
  existing.push(newFeedback);
  feedbackStore.set(organizationId, existing);
  
  return newFeedback;
}

/**
 * Get feedback for organization
 */
export async function getFeedback(
  organizationId: string,
  limit: number = 50
): Promise<AIFeedback[]> {
  const feedback = feedbackStore.get(organizationId) || [];
  return feedback.slice(-limit);
}

/**
 * Get feedback by recommendation
 */
export async function getFeedbackByRecommendation(
  organizationId: string,
  recommendationId: string
): Promise<AIFeedback[]> {
  const feedback = feedbackStore.get(organizationId) || [];
  return feedback.filter(f => f.recommendationId === recommendationId);
}

/**
 * Get feedback summary for organization
 */
export async function getFeedbackSummary(
  organizationId: string
): Promise<FeedbackSummary> {
  const feedback = feedbackStore.get(organizationId) || [];
  
  if (feedback.length === 0) {
    return {
      organizationId,
      totalFeedback: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      averageRating: 0,
      positivePercentage: 0,
      lastUpdated: Date.now(),
    };
  }
  
  const positiveCount = feedback.filter(f => f.feedbackType === 'positive').length;
  const negativeCount = feedback.filter(f => f.feedbackType === 'negative').length;
  const neutralCount = feedback.filter(f => f.feedbackType === 'neutral').length;
  
  const ratedFeedback = feedback.filter(f => f.rating !== undefined);
  const averageRating = ratedFeedback.length > 0
    ? ratedFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) / ratedFeedback.length
    : 0;
  
  return {
    organizationId,
    totalFeedback: feedback.length,
    positiveCount,
    negativeCount,
    neutralCount,
    averageRating: Math.round(averageRating * 10) / 10,
    positivePercentage: Math.round((positiveCount / feedback.length) * 100),
    lastUpdated: feedback[feedback.length - 1].timestamp,
  };
}

/**
 * Calculate recommendation accuracy based on feedback
 */
export async function getRecommendationAccuracy(
  organizationId: string
): Promise<Record<string, number>> {
  const feedback = feedbackStore.get(organizationId) || [];
  
  // Group by recommendation
  const byRecommendation: Record<string, AIFeedback[]> = {};
  feedback.forEach(f => {
    if (!byRecommendation[f.recommendationId]) {
      byRecommendation[f.recommendationId] = [];
    }
    byRecommendation[f.recommendationId].push(f);
  });
  
  // Calculate accuracy per recommendation
  const accuracy: Record<string, number> = {};
  Object.entries(byRecommendation).forEach(([recId, recFeedback]) => {
    const positive = recFeedback.filter(f => f.feedbackType === 'positive').length;
    accuracy[recId] = positive / recFeedback.length;
  });
  
  return accuracy;
}

/**
 * Clear feedback (for testing)
 */
export async function clearFeedback(organizationId: string): Promise<void> {
  feedbackStore.delete(organizationId);
}

/**
 * Analyze feedback trends over time
 */
export async function getFeedbackTrends(
  organizationId: string,
  days: number = 30
): Promise<{
  daily: Array<{ date: string; positive: number; negative: number; neutral: number }>;
  trend: 'improving' | 'declining' | 'stable';
}> {
  const feedback = feedbackStore.get(organizationId) || [];
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = feedback.filter(f => f.timestamp > cutoff);
  
  // Group by day
  const byDay: Record<string, { positive: number; negative: number; neutral: number }> = {};
  
  recent.forEach(f => {
    const date = new Date(f.timestamp).toISOString().split('T')[0];
    if (!byDay[date]) {
      byDay[date] = { positive: 0, negative: 0, neutral: 0 };
    }
    byDay[date][f.feedbackType === 'positive' ? 'positive' : f.feedbackType === 'negative' ? 'negative' : 'neutral']++;
  });
  
  const daily = Object.entries(byDay)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  // Calculate trend
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (daily.length >= 7) {
    const firstHalf = daily.slice(0, Math.floor(daily.length / 2));
    const secondHalf = daily.slice(Math.floor(daily.length / 2));
    
    const firstPositive = firstHalf.reduce((sum, d) => sum + d.positive, 0) / firstHalf.length;
    const secondPositive = secondHalf.reduce((sum, d) => sum + d.positive, 0) / secondHalf.length;
    
    if (secondPositive > firstPositive * 1.1) trend = 'improving';
    else if (secondPositive < firstPositive * 0.9) trend = 'declining';
  }
  
  return { daily, trend };
}
