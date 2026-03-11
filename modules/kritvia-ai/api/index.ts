/**
 * Kritvia AI API Module
 * 
 * API endpoints for AI functionality:
 * - /ai/analyze
 * - /ai/decision
 * - /ai/action
 * - /ai/insights
 */

export * from './analyze';
export * from './decision';
export * from './action';
export * from './insights';

// API types
export interface APIRequest {
  requestId: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  requestId: string;
  timestamp: number;
  data?: T;
  error?: string;
}
