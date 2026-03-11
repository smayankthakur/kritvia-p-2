/**
 * AI Action API
 * 
 * POST /ai/action
 * Execute AI-triggered actions
 */

import type { APIResponse } from '../index';
import { executeAction } from '../../engine/action-engine';
import { actionLogger } from '../../engine/logger';

export interface ActionRequest {
  action: string;
  parameters: Record<string, unknown>;
  target?: 'crm' | 'email' | 'task' | 'report' | 'meeting';
}

export interface ActionResponse {
  actionId: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: Record<string, unknown>;
}

/**
 * Handle action request
 */
export async function handleAction(
  req: ActionRequest
): Promise<APIResponse<ActionResponse>> {
  const requestId = crypto.randomUUID();
  
  actionLogger.execution(req.action, req.target || 'unknown');
  
  try {
    const result = await executeAction({
      action: req.action,
      parameters: req.parameters,
      target: req.target || 'crm',
    });
    
    if (result.success) {
      actionLogger.success(result.actionId);
    } else {
      actionLogger.failure(result.actionId, result.error || 'Unknown error');
    }
    
    return {
      success: result.success,
      requestId,
      timestamp: Date.now(),
      data: {
        actionId: result.actionId,
        status: result.success ? 'completed' : 'failed',
        result: result.result,
      },
      error: result.error,
    };
    
  } catch (error) {
    actionLogger.failure(requestId, error instanceof Error ? error.message : 'Unknown error');
    
    return {
      success: false,
      requestId,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default { handleAction };
