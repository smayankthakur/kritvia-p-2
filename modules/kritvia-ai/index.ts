/**
 * Kritvia AI Module
 * 
 * An AI-powered business operating system for CRM decision-making and automation.
 * 
 * @package @kritvia/kritvia-ai
 * @version 1.0.0
 */

// Re-export all submodules
export * from './agents';
export * from './engine';
export * from './api';
export * from './ui';

// Core types
export interface KritviaAIConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  requestId?: string;
}

export interface DecisionRequest {
  context: Record<string, unknown>;
  type: 'lead_scoring' | 'recommendation' | 'prediction' | 'analysis';
}

export interface ActionRequest {
  action: string;
  parameters: Record<string, unknown>;
  target?: 'crm' | 'email' | 'task' | 'report';
}
