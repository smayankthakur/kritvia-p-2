/**
 * AI Orchestrator - Central AI Request Handler
 * 
 * Coordinates AI requests by:
 * 1. Receiving requests
 * 2. Determining appropriate agent
 * 3. Retrieving knowledge
 * 4. Calling decision engine
 * 5. Returning structured output
 */

import { aiLogger, agentLogger, decisionLogger } from './logger';
import { searchKnowledge, retrieveContext } from './knowledge-layer';
import { analyzeData, predictLeadScore, generateRecommendation } from './decision-engine';
import { processAgentRequest, getAgentByType, type KritviaAgent } from '../agents';

export type AgentType = 'ceo' | 'sales' | 'marketing' | 'operations';

export interface OrchestratorRequest {
  query: string;
  context: Record<string, unknown>;
  requestedAgent?: AgentType;
  options?: {
    useKnowledge?: boolean;
    useDecision?: boolean;
    returnActions?: boolean;
  };
}

export interface OrchestratorResponse {
  success: boolean;
  response: string;
  agent: AgentType;
  confidence: number;
  insights?: string[];
  recommendedActions?: string[];
  sources?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Determine which agent should handle the request
 */
function selectAgent(query: string, requestedAgent?: AgentType): AgentType {
  // If specific agent requested, use it
  if (requestedAgent && ['ceo', 'sales', 'marketing', 'operations'].includes(requestedAgent)) {
    return requestedAgent;
  }

  // Keyword-based agent selection
  const lowerQuery = query.toLowerCase();

  // Sales keywords
  if (
    lowerQuery.includes('lead') ||
    lowerQuery.includes('deal') ||
    lowerQuery.includes('pipeline') ||
    lowerQuery.includes('revenue') ||
    lowerQuery.includes('customer')
  ) {
    return 'sales';
  }

  // Marketing keywords
  if (
    lowerQuery.includes('campaign') ||
    lowerQuery.includes('seo') ||
    lowerQuery.includes('content') ||
    lowerQuery.includes('ads') ||
    lowerQuery.includes('marketing')
  ) {
    return 'marketing';
  }

  // Operations keywords
  if (
    lowerQuery.includes('task') ||
    lowerQuery.includes('workflow') ||
    lowerQuery.includes('process') ||
    lowerQuery.includes('automation') ||
    lowerQuery.includes('productivity')
  ) {
    return 'operations';
  }

  // Default to CEO/strategic for business-level queries
  return 'ceo';
}

/**
 * Main orchestrator function - processes AI requests
 */
export async function orchestrate(request: OrchestratorRequest): Promise<OrchestratorResponse> {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  aiLogger.request('Processing AI request', { 
    requestId, 
    query: request.query.substring(0, 100),
    requestedAgent: request.requestedAgent 
  });

  try {
    // Step 1: Select appropriate agent
    const selectedAgent = selectAgent(request.query, request.requestedAgent);
    agentLogger.selection(selectedAgent, `Based on query analysis`);
    
    aiLogger.request('Agent selected', { requestId, agent: selectedAgent });

    // Step 2: Retrieve knowledge if enabled
    let sources: string[] = [];
    let contextPrompt = '';

    if (request.options?.useKnowledge !== false) {
      const knowledgeResult = await retrieveContext(request.query, 2000);
      contextPrompt = knowledgeResult.context;
      sources = knowledgeResult.sources;
      
      aiLogger.request('Knowledge retrieved', { 
        requestId, 
        sourceCount: sources.length 
      });
    }

    // Step 3: Process with the selected agent
    const agentResponse = await processAgentRequest({
      agent: selectedAgent,
      query: request.query,
      context: {
        ...request.context,
        knowledgeContext: contextPrompt,
        sources,
      },
    });

    agentLogger.execution(selectedAgent, 'completed');

    // Step 4: Generate decision if enabled
    let recommendedActions: string[] = [];
    let insights: string[] = [];

    if (request.options?.useDecision !== false) {
      const decisionResult = await generateRecommendation(
        request.query,
        {
          ...request.context,
          agentResponse: agentResponse.response,
        }
      );

      if (decisionResult.recommendations) {
        recommendedActions = decisionResult.recommendations;
        insights = decisionResult.insights || [];
      }

      decisionLogger.output(decisionResult.primaryRecommendation, decisionResult.confidence);
    }

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    const response: OrchestratorResponse = {
      success: true,
      response: agentResponse.response,
      agent: selectedAgent,
      confidence: agentResponse.confidence,
      insights,
      recommendedActions,
      sources,
      metadata: {
        requestId,
        processingTime,
        agentUsed: selectedAgent,
      },
    };

    aiLogger.response('Request completed successfully', { 
      requestId, 
      processingTime 
    });

    return response;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    aiLogger.error('Request failed', { requestId, error: errorMessage });
    agentLogger.error('orchestrator', errorMessage);

    return {
      success: false,
      response: 'I apologize, but I encountered an error processing your request. Please try again.',
      agent: 'ceo',
      confidence: 0,
      metadata: {
        requestId,
        error: errorMessage,
      },
    };
  }
}

/**
 * Quick agent execution without full orchestration
 */
export async function executeAgent(
  agentType: AgentType,
  input: string,
  context?: Record<string, unknown>
): Promise<{
  success: boolean;
  response: string;
  confidence: number;
}> {
  try {
    const agent = getAgentByType(agentType);
    if (!agent) {
      return {
        success: false,
        response: `Agent type '${agentType}' not found`,
        confidence: 0,
      };
    }

    return await processAgentRequest({
      agent: agentType,
      query: input,
      context: context || {},
    });
  } catch (error) {
    return {
      success: false,
      response: error instanceof Error ? error.message : 'Unknown error',
      confidence: 0,
    };
  }
}

/**
 * Get system status
 */
export function getSystemStatus(): {
  agents: AgentType[];
  status: 'ready' | 'degraded';
  lastRequest?: number;
} {
  return {
    agents: ['ceo', 'sales', 'marketing', 'operations'],
    status: 'ready',
  };
}

export default {
  orchestrate,
  executeAgent,
  getSystemStatus,
  selectAgent,
};
