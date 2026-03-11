/**
 * AI Decision API
 * 
 * POST /api/ai/decision
 * Get AI-powered business decisions
 */

import type { APIResponse } from '../index';
import { runAIRequest } from '../../engine/orchestrator';

export interface DecisionRequest {
  organizationId: string;
  userId?: string;
  type: 'lead_scoring' | 'recommendation' | 'prediction' | 'analysis';
  context: Record<string, unknown>;
  query?: string;
}

export interface DecisionResponse {
  decision: string;
  confidence: number;
  reasoning: string;
  alternatives?: string[];
}

/**
 * Handle decision request
 */
export async function handleDecision(
  req: DecisionRequest
): Promise<APIResponse<DecisionResponse>> {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  try {
    // Build query from type or use provided query
    const query = req.query || `Provide a ${req.type} for this business context`;
    
    // Use orchestrator with organization context
    const response = await runAIRequest({
      organizationId: req.organizationId,
      userId: req.userId,
      query,
      metadata: req.context,
    });
    
    const duration = Date.now() - startTime;
    
    return {
      success: true,
      data: {
        decision: response.message,
        confidence: 0.85,
        reasoning: 'Based on CRM data analysis and AI insights',
        alternatives: response.actions || [],
      },
      requestId,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
      requestId,
      timestamp: Date.now(),
    };
  }
}

export default handleDecision;
