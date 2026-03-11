/**
 * AI Decision API
 * 
 * POST /ai/decision
 * Get AI-powered business decisions
 */

import type { APIResponse } from '../index';
import { orchestrate } from '../../engine/orchestrator';
import { aiLogger } from '../../engine/logger';

export interface DecisionRequest {
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
  
  aiLogger.request('Decision request received', { requestId, decisionType: req.type });
  
  try {
    // Build query from type or use provided query
    const query = req.query || `Provide a ${req.type} for this business context`;
    
    // Use orchestrator to process
    const result = await orchestrate({
      query,
      context: req.context,
      options: {
        useKnowledge: true,
        useDecision: true,
        returnActions: true,
      },
    });
    
    const response: APIResponse<DecisionResponse> = {
      success: result.success,
      requestId,
      timestamp: Date.now(),
      data: {
        decision: result.response,
        confidence: result.confidence,
        reasoning: result.insights?.join(' ') || '',
        alternatives: [],
      },
    };
    
    aiLogger.response('Decision request completed', { 
      requestId, 
      processingTime: Date.now() - startTime 
    });
    
    return response;
    
  } catch (error) {
    aiLogger.error('Decision request failed', { requestId, error: String(error) });
    
    return {
      success: false,
      requestId,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default { handleDecision };
