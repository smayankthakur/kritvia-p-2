/**
 * AI Insights API
 * 
 * GET /api/ai/insights
 * Retrieve AI-generated insights for organization
 */

import type { APIResponse } from '../index';
import { getAIInsights, storeAIInsight } from '../../engine/orchestrator';

export interface InsightsRequest {
  organizationId: string;
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

/**
 * Handle insights request
 */
export async function handleInsights(
  req: InsightsRequest
): Promise<APIResponse<Insight[]>> {
  const requestId = crypto.randomUUID();
  
  try {
    const limit = req.limit || 10;
    
    // Get insights from database for organization
    const insights = await getAIInsights(req.organizationId, limit);
    
    const response: APIResponse<Insight[]> = {
      success: true,
      requestId,
      timestamp: Date.now(),
      data: insights.map(i => ({
        id: i.id,
        type: i.type,
        title: i.title,
        description: i.description,
        priority: i.confidence > 0.7 ? 'high' : i.confidence > 0.4 ? 'medium' : 'low',
        createdAt: i.created_at,
      })),
    };
    
    return response;
  } catch (error) {
    return {
      success: false,
      error: String(error),
      requestId,
      timestamp: Date.now(),
    };
  }
}

export default handleInsights;
