/**
 * AI Insights API
 * 
 * GET /ai/insights
 * Retrieve AI-generated insights
 */

import type { APIResponse } from '../index';
import { orchestrate } from '../../engine/orchestrator';
import { aiLogger } from '../../engine/logger';
import { getRecentLogs } from '../../engine/logger';

export interface InsightsRequest {
  type?: 'all' | 'sales' | 'marketing' | 'operations' | 'strategy';
  limit?: number;
}

export interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

// In-memory insights store
const insightsStore: Insight[] = [];

/**
 * Handle insights request
 */
export async function handleInsights(
  req: InsightsRequest
): Promise<APIResponse<Insight[]>> {
  const requestId = crypto.randomUUID();
  
  aiLogger.request('Insights request received', { requestId, insightType: req.type });
  
  try {
    // If requesting specific type, use AI to generate insights
    if (req.type && req.type !== 'all') {
      const query = `Generate ${req.type} insights for the business`;
      
      const result = await orchestrate({
        query,
        context: { insightType: req.type },
        options: {
          useKnowledge: true,
          useDecision: true,
          returnActions: false,
        },
      });
      
      // Create insight from result
      if (result.success && result.insights) {
        const newInsight: Insight = {
          id: crypto.randomUUID(),
          type: req.type,
          title: `${req.type} Insight`,
          description: result.response,
          priority: result.confidence > 0.7 ? 'high' : result.confidence > 0.4 ? 'medium' : 'low',
          createdAt: new Date().toISOString(),
        };
        
        insightsStore.unshift(newInsight);
      }
    }
    
    const limit = req.limit || 10;
    const insights = insightsStore.slice(0, limit);
    
    const response: APIResponse<Insight[]> = {
      success: true,
      requestId,
      timestamp: Date.now(),
      data: insights,
    };
    
    aiLogger.response('Insights request completed', { requestId, count: insights.length });
    
    return response;
    
  } catch (error) {
    aiLogger.error('Insights request failed', { requestId, error: String(error) });
    
    return {
      success: false,
      requestId,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Add insight manually
 */
export function addInsight(insight: Omit<Insight, 'id' | 'createdAt'>): Insight {
  const newInsight: Insight = {
    ...insight,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  insightsStore.unshift(newInsight);
  
  return newInsight;
}

export default { handleInsights, addInsight };
