/**
 * Kritvia AI Agents Module
 * 
 * Specialized AI agents for different business functions.
 */

import type { AgentConfig } from '../index';

export * from './ceo-agent';
export * from './sales-agent';
export * from './marketing-agent';
export * from './operations-agent';

// Agent types
export type AgentType = 'ceo' | 'sales' | 'marketing' | 'operations';

export interface AgentConfig {
  name: string;
  type: AgentType;
  enabled: boolean;
  model?: string;
}

export interface AgentResponse {
  agent: AgentType;
  response: string;
  confidence: number;
  actions?: string[];
}

// Base agent interface
export interface KritviaAgent {
  name: string;
  role: string;
  capabilities: string[];
  execute(input: AgentInput): Promise<AgentOutput>;
}

export interface AgentInput {
  query: string;
  context: Record<string, unknown>;
}

export interface AgentOutput {
  response: string;
  confidence: number;
  actions?: string[];
}

// Import individual agents
import { generateStrategicInsight, type StrategicInsight } from './ceo-agent';
import { 
  scoreLead, 
  calculateDealProbability, 
  processSalesQuery,
  type LeadScore,
  type DealProbability 
} from './sales-agent';
import { 
  analyzeCampaign, 
  generateContent, 
  processMarketingQuery,
  type CampaignAnalysis 
} from './marketing-agent';
import { 
  createWorkflow, 
  orchestrateTasks, 
  processOperationsQuery,
  type WorkflowAutomation 
} from './operations-agent';

// Agent registry
const agents: Record<AgentType, KritviaAgent> = {
  ceo: {
    name: 'CEO Agent',
    role: 'Strategic Decision Making',
    capabilities: ['revenue_forecasting', 'market_analysis', 'pricing_strategy'],
    execute: async (input) => {
      const result = await generateStrategicInsight(input.query, input.context);
      return {
        response: result.response,
        confidence: result.confidence,
        actions: result.actions,
      };
    },
  },
  sales: {
    name: 'Sales Agent',
    role: 'CRM Intelligence',
    capabilities: ['lead_scoring', 'deal_prediction', 'pipeline_analysis'],
    execute: async (input) => {
      const result = await processSalesQuery(input.query, input.context);
      return {
        response: result.response,
        confidence: result.confidence,
        actions: result.actions,
      };
    },
  },
  marketing: {
    name: 'Marketing Agent',
    role: 'Marketing Intelligence',
    capabilities: ['campaign_analysis', 'content_generation', 'seo_insights'],
    execute: async (input) => {
      const result = await processMarketingQuery(input.query, input.context);
      return {
        response: result.response,
        confidence: result.confidence,
        actions: result.actions,
      };
    },
  },
  operations: {
    name: 'Operations Agent',
    role: 'Workflow Automation',
    capabilities: ['task_orchestration', 'process_optimization', 'productivity_insights'],
    execute: async (input) => {
      const result = await processOperationsQuery(input.query, input.context);
      return {
        response: result.response,
        confidence: result.confidence,
        actions: result.actions,
      };
    },
  },
};

/**
 * Get agent by type
 */
export function getAgentByType(type: AgentType): KritviaAgent | undefined {
  return agents[type];
}

/**
 * Process agent request - routes to appropriate agent
 */
export async function processAgentRequest(input: {
  agent: AgentType;
  query: string;
  context: Record<string, unknown>;
}): Promise<AgentResponse> {
  const agent = agents[input.agent];
  
  if (!agent) {
    return {
      agent: input.agent,
      response: `Agent type '${input.agent}' not found`,
      confidence: 0,
      actions: [],
    };
  }
  
  try {
    const result = await agent.execute({
      query: input.query,
      context: input.context,
    });
    
    return {
      agent: input.agent,
      response: result.response,
      confidence: result.confidence,
      actions: result.actions,
    };
  } catch (error) {
    return {
      agent: input.agent,
      response: error instanceof Error ? error.message : 'Unknown error',
      confidence: 0,
      actions: [],
    };
  }
}

/**
 * List all available agents
 */
export function listAgents(): { type: AgentType; name: string; capabilities: string[] }[] {
  return Object.entries(agents).map(([type, agent]) => ({
    type: type as AgentType,
    name: agent.name,
    capabilities: agent.capabilities,
  }));
}
