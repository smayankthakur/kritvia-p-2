/**
 * Kritvia AI Engine Module
 * 
 * Core AI processing engines:
 * - Decision Engine
 * - Action Engine
 * - Knowledge Layer
 * - AI Orchestrator
 * - AI Service
 * - Logger
 */

export * from './decision-engine';
export * from './action-engine';
export * from './knowledge-layer';
export * from './orchestrator';
export * from './ai-service';
export * from './logger';

// Engine types
export type EngineType = 'decision' | 'action' | 'knowledge';

export interface EngineConfig {
  type: EngineType;
  enabled: boolean;
  model?: string;
}
