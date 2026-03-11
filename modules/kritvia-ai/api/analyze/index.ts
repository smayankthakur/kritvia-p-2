/**
 * AI Analyze API
 * 
 * POST /ai/analyze
 * Analyze business data and provide insights
 */

import type { APIResponse } from '../index';
import { orchestrate } from '../../engine/orchestrator';
import { aiLogger } from '../../engine/logger';

export interface AnalyzeRequest {
  data: Record<string, unknown>;
  analysisType: 'general' | 'financial' | 'marketing' | 'sales' | 'operations';
  query?: string;
}

export interface AnalyzeResponse {
  insights: string[];
  summary: string;
  recommendations: string[];
}

/**
 * Handle analyze request
 */
export async function handleAnalyze(
  req: AnalyzeRequest
): Promise<APIResponse<AnalyzeResponse>> {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  aiLogger.request('Analyze request received', { requestId, analysisType: req.analysisType });
  
  try {
    // Build query from data or use provided query
    const query = req.query || `Analyze ${req.analysisType} data and provide insights`;
    
    // Use orchestrator to process
    const result = await orchestrate({
      query,
      context: {
        ...req.data,
        analysisType: req.analysisType,
      },
      options: {
        useKnowledge: true,
        useDecision: true,
        returnActions: true,
      },
    });
    
    const response: APIResponse<AnalyzeResponse> = {
      success: result.success,
      requestId,
      timestamp: Date.now(),
      data: {
        insights: result.insights || [],
        summary: result.response,
        recommendations: result.recommendedActions || [],
      },
    };
    
    aiLogger.response('Analyze request completed', { 
      requestId, 
      processingTime: Date.now() - startTime 
    });
    
    return response;
    
  } catch (error) {
    aiLogger.error('Analyze request failed', { requestId, error: String(error) });
    
    return {
      success: false,
      requestId,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default { handleAnalyze };
