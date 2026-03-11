/**
 * AI Orchestrator - Multi-Tenant Version
 * 
 * Coordinates AI agents with organization context.
 */

import { getLeads, getDeals, getTasks, getCRMStats } from '../integrations/crm';
import { memoryOperations, insightOperations, activityOperations, usageOperations } from '../../core/database';
import { logger } from '../observability';

/**
 * Request context with organization information
 */
export interface AIRequestContext {
  organizationId: string;
  userId?: string;
  query: string;
  metadata?: Record<string, unknown>;
}

/**
 * AI response
 */
export interface AIResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  insights?: string[];
  actions?: string[];
}

/**
 * Run AI request with organization context
 */
export async function runAIRequest(context: AIRequestContext): Promise<AIResponse> {
  const { organizationId, userId, query } = context;
  
  logger.info('AIOrchestrator', `Processing request for org: ${organizationId}`, { query });
  
  try {
    // Track usage
    await usageOperations.track(organizationId, { requests: 1 });
    
    // Load organization-specific CRM data
    const [leads, deals, tasks, stats] = await Promise.all([
      getLeads(organizationId),
      getDeals(organizationId),
      getTasks(organizationId),
      getCRMStats(organizationId),
    ]);
    
    // Load organization memory
    const memories = await memoryOperations.getByOrganization(organizationId);
    const recentInsights = await insightOperations.getByOrganization(organizationId, 5);
    
    // Store activity
    await activityOperations.store(organizationId, {
      user_id: userId,
      type: 'ai_request',
      title: 'AI Request',
      description: query,
      metadata: { stats },
    });
    
    // Simple response generation (replace with real AI in production)
    let message = '';
    let insights: string[] = [];
    let actions: string[] = [];
    
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('lead') || queryLower.includes('prospect')) {
      message = `You have ${leads.length} leads in your pipeline.`;
      if (leads.length > 0) {
        insights.push(`${leads.length} leads worth approximately $${leads.reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}`);
      }
    } else if (queryLower.includes('deal') || queryLower.includes('revenue') || queryLower.includes('pipeline')) {
      message = `Your pipeline has ${deals.length} deals worth $${stats.pipelineValue.toLocaleString()}.`;
      const highValueDeals = deals.filter(d => d.value && d.value > 20000);
      if (highValueDeals.length > 0) {
        insights.push(`${highValueDeals.length} deals are high value (> $20k)`);
      }
    } else if (queryLower.includes('task') || queryLower.includes('todo')) {
      message = `You have ${tasks.filter(t => t.status === 'pending').length} pending tasks.`;
    } else if (queryLower.includes('analyze') || queryLower.includes('insight')) {
      // Generate AI insights
      const topDeal = deals.sort((a, b) => (b.value || 0) - (a.value || 0))[0];
      if (topDeal) {
        insights.push(`Your highest value deal is "${topDeal.name}" worth $${topDeal.value?.toLocaleString()}`);
      }
      
      const pendingTasks = tasks.filter(t => t.status === 'pending');
      if (pendingTasks.length > 3) {
        insights.push(`You have ${pendingTasks.length} pending tasks - consider prioritizing`);
      }
      
      message = 'Based on your data analysis:';
    } else {
      message = `I can help you analyze your CRM data. You have ${stats.totalLeads} leads, ${stats.totalDeals} deals worth $${stats.pipelineValue.toLocaleString()}, and ${stats.totalTasks} tasks.`;
    }
    
    // Generate suggested actions
    if (deals.some(d => d.stage === 'negotiation' && d.probability && d.probability > 70)) {
      actions.push('Follow up with deals in negotiation with high probability');
    }
    if (tasks.filter(t => t.status === 'pending').length > 5) {
      actions.push('Review and complete pending tasks');
    }
    
    return {
      success: true,
      message,
      data: {
        leads: leads.length,
        deals: deals.length,
        tasks: tasks.length,
        pipelineValue: stats.pipelineValue,
        memories: memories.length,
      },
      insights,
      actions,
    };
  } catch (error) {
    logger.error('AIOrchestrator', 'Request failed', { error: String(error) });
    
    return {
      success: false,
      message: 'I encountered an error processing your request. Please try again.',
    };
  }
}

/**
 * Execute AI action with organization context
 */
export async function executeAIAction(
  organizationId: string,
  userId: string,
  actionType: string,
  params: Record<string, unknown>
): Promise<{ success: boolean; result?: Record<string, unknown> }> {
  logger.info('AIOrchestrator', `Executing action: ${actionType}`, { organizationId });
  
  try {
    // Track action in usage
    await usageOperations.track(organizationId, { actionsExecuted: 1 });
    
    // Store activity
    await activityOperations.store(organizationId, {
      user_id: userId,
      type: 'ai_action',
      title: `AI Action: ${actionType}`,
      description: `Executed ${actionType}`,
      metadata: params,
    });
    
    // Handle different action types
    switch (actionType) {
      case 'create_lead':
        // Would create lead via CRM
        return { success: true, result: { message: 'Lead created' } };
        
      case 'create_deal':
        return { success: true, result: { message: 'Deal created' } };
        
      case 'create_task':
        return { success: true, result: { message: 'Task created' } };
        
      case 'send_email':
        return { success: true, result: { message: 'Email queued' } };
        
      default:
        return { success: true, result: { message: `Action ${actionType} completed` } };
    }
  } catch (error) {
    logger.error('AIOrchestrator', 'Action failed', { error: String(error) });
    return { success: false };
  }
}

/**
 * Get AI insights for organization
 */
export async function getAIInsights(organizationId: string, limit = 10) {
  return insightOperations.getByOrganization(organizationId, limit);
}

/**
 * Store AI insight for organization
 */
export async function storeAIInsight(
  organizationId: string,
  insight: {
    type: string;
    title: string;
    description: string;
    confidence: number;
    data?: Record<string, unknown>;
  }
) {
  return insightOperations.store(organizationId, insight);
}

/**
 * Get AI activity for organization
 */
export async function getAIActivity(organizationId: string, limit = 50) {
  return activityOperations.getByOrganization(organizationId, limit);
}

/**
 * Get usage stats for organization
 */
export async function getUsageStats(organizationId: string) {
  const currentPeriod = await usageOperations.getCurrentPeriod(organizationId);
  const history = await usageOperations.getByOrganization(organizationId);
  
  return {
    current: currentPeriod || { requests: 0, tokens_used: 0, actions_executed: 0 },
    history: history.slice(-12), // Last 12 months
  };
}

export default {
  runAIRequest,
  executeAIAction,
  getAIInsights,
  storeAIInsight,
  getAIActivity,
  getUsageStats,
};
