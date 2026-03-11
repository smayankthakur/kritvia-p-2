/**
 * Kritvia AI UI Module
 * 
 * UI components for AI interaction:
 * - AI Chat Interface
 * - AI Dashboard
 * - AI Command Interface
 */

export * from './ai-chat';
export * from './ai-dashboard';
export * from './ai-command';

// UI types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
}

export interface CommandInput {
  command: string;
  args: Record<string, unknown>;
}
