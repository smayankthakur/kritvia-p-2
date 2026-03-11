/**
 * AI Analyze API
 * 
 * POST /api/ai/analyze
 * Analyze business data and provide insights
 */

import type { APIResponse } from '../index';
import { runAIRequest } from '../../engine/orchestrator';

export interface AnalyzeRequest {
  organizationId: string;
  userId?: string;
  data: Record<string, unknown>;
  analysisType: 'general' | 'financial' | 'marketing' | 'sales' | 'operations';
  query?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  message: string;
  insights?: string[];
  actions?: string[];
  data?: Record<string, unknown>;
}

/**
 * Handle analyze request
 */
export async function handleAnalyze(
  req: AnalyzeRequest
): Promise<APIResponse<AnalyzeResponse>> {
  try {
    // Use organization context
    const response = await runAIRequest({
      organizationId: req.organizationId,
      userId: req.userId,
      query: req.query || `Analyze my ${req.analysisType} data`,
    });
    
    return {
      success: true,
      data: response,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    };
  }
}

export default handleAnalyze;
