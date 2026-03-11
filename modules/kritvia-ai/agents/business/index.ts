/**
 * Core Business Agents
 * 
 * Specialized autonomous agents for different business domains.
 */

import { BaseAgent, AgentContext, AgentAnalysis, AgentDecision, AgentReport, AgentConfig } from '../framework';
import { getLeads, getDeals, getTasks, createTask } from '../../integrations/crm';
import { calculateAllMetrics } from '../../analytics/metrics';
import { getAllForecasts } from '../../analytics/forecasting';
import { createAction } from '../../actions';
import { activityOperations } from '../../../core/database';

/**
 * Sales Agent
 * Monitors sales pipeline and recommends actions
 */
export class SalesAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: 'sales_agent',
      name: 'Sales Agent',
      role: 'sales',
      description: 'Monitors sales pipeline, detects high-value deals, and recommends follow-ups',
      capabilities: ['read_analytics', 'access_crm', 'create_tasks', 'make_recommendations'],
      schedule: { type: 'interval', interval: 10 },
      riskLevel: 'medium',
      enabled: true,
    };
    super(config);
  }

  async analyze(context: AgentContext): Promise<AgentAnalysis> {
    const [deals, metrics, forecasts] = await Promise.all([
      getDeals(context.organizationId),
      calculateAllMetrics(context.organizationId),
      getAllForecasts(context.organizationId),
    ]);

    const findings: string[] = [];
    
    // Check for high-value deals
    const highValueDeals = deals.filter(d => (d.value || 0) > 20000 && d.stage !== 'closed_won');
    if (highValueDeals.length > 0) {
      findings.push(`Found ${highValueDeals.length} high-value deals requiring attention`);
    }
    
    // Check for deals in negotiation
    const negotiationDeals = deals.filter(d => d.stage === 'negotiation');
    if (negotiationDeals.length > 0) {
      findings.push(`${negotiationDeals.length} deals in negotiation stage`);
    }
    
    // Check pipeline health
    const pipelineMetric = metrics.metrics.find(m => m.metric === 'pipeline_value');
    if (pipelineMetric && pipelineMetric.trend === 'down') {
      findings.push('Pipeline value is declining');
    }

    return {
      agentId: this.getId(),
      organizationId: context.organizationId,
      timestamp: new Date(),
      data: { deals: deals.length, metrics: metrics.metrics, forecasts },
      findings,
    };
  }

  async decide(analysis: AgentAnalysis): Promise<AgentDecision[]> {
    const decisions: AgentDecision[] = [];
    const deals = analysis.data.deals as any[];
    const forecasts = analysis.data.forecasts as any;
    
    // Recommend follow-up for high-probability deals
    if (forecasts?.deals) {
      const hotDeals = forecasts.deals.filter((d: any) => d.probability > 60);
      if (hotDeals.length > 0) {
        decisions.push({
          agentId: this.getId(),
          decision: 'Create follow-up tasks for high-probability deals',
          confidence: 0.85,
          reasoning: `${hotDeals.length} deals have >60% close probability`,
        });
      }
    }
    
    return decisions;
  }

  async act(decisions: AgentDecision[], context: AgentContext): Promise<any[]> {
    const actions = [];
    
    for (const decision of decisions) {
      if (decision.decision.includes('follow-up')) {
        const action = await createAction(
          context.organizationId,
          this.getId(),
          {
            type: 'CREATE_TASK',
            title: 'Sales Agent: Follow up on hot deals',
            description: decision.reasoning,
            params: { source: 'sales_agent' },
          },
          'medium'
        );
        
        // Log activity
        await activityOperations.store(context.organizationId, {
          agent_id: this.getId(),
          type: 'agent_action',
          title: 'Sales Agent Action',
          description: decision.decision,
          metadata: { actionId: action.id },
        });
        
        actions.push(action);
      }
    }
    
    return actions;
  }

  async report(context: AgentContext): Promise<AgentReport> {
    const [deals, actions] = await Promise.all([
      getDeals(context.organizationId),
      import('../../actions').then(m => m.getAgentActions(this.getId())),
    ]);
    
    return {
      agentId: this.getId(),
      organizationId: context.organizationId,
      period: 'daily',
      summary: `Analyzed ${deals.length} deals`,
      actionsCreated: actions.length,
      actionsExecuted: actions.filter(a => a.status === 'executed').length,
      insightsGenerated: 0,
      recommendations: ['Continue monitoring high-value deals'],
    };
  }
}

/**
 * Marketing Agent
 * Monitors lead generation and marketing effectiveness
 */
export class MarketingAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: 'marketing_agent',
      name: 'Marketing Agent',
      role: 'marketing',
      description: 'Monitors lead generation, identifies drop-offs, and recommends campaigns',
      capabilities: ['read_analytics', 'access_crm', 'generate_insights', 'make_recommendations'],
      schedule: { type: 'hourly' },
      riskLevel: 'low',
      enabled: true,
    };
    super(config);
  }

  async analyze(context: AgentContext): Promise<AgentAnalysis> {
    const [leads, metrics] = await Promise.all([
      getLeads(context.organizationId),
      calculateAllMetrics(context.organizationId),
    ]);

    const findings: string[] = [];
    
    // Check lead volume
    const leadMetric = metrics.metrics.find(m => m.metric === 'total_leads');
    if (leadMetric && leadMetric.trend === 'down') {
      findings.push('Lead volume is declining');
    }
    
    // Check lead quality
    const qualifiedLeads = leads.filter(l => l.stage === 'qualified');
    if (qualifiedLeads.length < leads.length * 0.3) {
      findings.push('Low qualification rate - review targeting');
    }

    return {
      agentId: this.getId(),
      organizationId: context.organizationId,
      timestamp: new Date(),
      data: { leads: leads.length, metrics: metrics.metrics },
      findings,
    };
  }

  async decide(analysis: AgentAnalysis): Promise<AgentDecision[]> {
    const decisions: AgentDecision[] = [];
    
    if (analysis.findings.some(f => f.includes('declining'))) {
      decisions.push({
        agentId: this.getId(),
        decision: 'Generate report on lead trends',
        confidence: 0.75,
        reasoning: 'Lead volume decline detected',
      });
    }
    
    return decisions;
  }

  async act(decisions: AgentDecision[], context: AgentContext): Promise<any[]> {
    const actions = [];
    
    for (const decision of decisions) {
      const action = await createAction(
        context.organizationId,
        this.getId(),
        {
          type: 'GENERATE_REPORT',
          title: 'Marketing Agent: Lead Trends Report',
          description: decision.reasoning,
          params: { reportType: 'lead_trends' },
        },
        'low'
      );
      
      await activityOperations.store(context.organizationId, {
        agent_id: this.getId(),
        type: 'agent_recommendation',
        title: 'Marketing Recommendation',
        description: decision.decision,
      });
      
      actions.push(action);
    }
    
    return actions;
  }

  async report(context: AgentContext): Promise<AgentReport> {
    const leads = await getLeads(context.organizationId);
    
    return {
      agentId: this.getId(),
      organizationId: context.organizationId,
      period: 'daily',
      summary: `Monitoring ${leads.length} leads`,
      actionsCreated: 0,
      actionsExecuted: 0,
      insightsGenerated: 0,
      recommendations: ['Focus on lead quality improvement'],
    };
  }
}

/**
 * Operations Agent
 * Monitors task completion and pipeline bottlenecks
 */
export class OperationsAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: 'operations_agent',
      name: 'Operations Agent',
      role: 'operations',
      description: 'Monitors task completion, detects bottlenecks, and creates follow-up tasks',
      capabilities: ['read_analytics', 'access_crm', 'create_tasks'],
      schedule: { type: 'interval', interval: 30 },
      riskLevel: 'low',
      enabled: true,
    };
    super(config);
  }

  async analyze(context: AgentContext): Promise<AgentAnalysis> {
    const [tasks, metrics] = await Promise.all([
      getTasks(context.organizationId),
      calculateAllMetrics(context.organizationId),
    ]);

    const findings: string[] = [];
    
    // Check pending tasks
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    if (pendingTasks.length > 10) {
      findings.push(`${pendingTasks.length} tasks pending - potential bottleneck`);
    }
    
    // Check overdue tasks (simplified)
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    if (inProgressTasks.length > 5) {
      findings.push(`${inProgressTasks.length} tasks in progress`);
    }

    return {
      agentId: this.getId(),
      organizationId: context.organizationId,
      timestamp: new Date(),
      data: { tasks: tasks.length, pending: pendingTasks.length },
      findings,
    };
  }

  async decide(analysis: AgentAnalysis): Promise<AgentDecision[]> {
    const decisions: AgentDecision[] = [];
    const pending = analysis.data.pending as number;
    
    if (pending > 10) {
      decisions.push({
        agentId: this.getId(),
        decision: 'Create task to review pending items',
        confidence: 0.8,
        reasoning: 'High number of pending tasks detected',
      });
    }
    
    return decisions;
  }

  async act(decisions: AgentDecision[], context: AgentContext): Promise<any[]> {
    const actions = [];
    
    for (const decision of decisions) {
      const action = await createAction(
        context.organizationId,
        this.getId(),
        {
          type: 'CREATE_TASK',
          title: 'Operations: Review pending tasks',
          description: decision.reasoning,
          params: { source: 'operations_agent' },
        },
        'low'
      );
      
      await activityOperations.store(context.organizationId, {
        agent_id: this.getId(),
        type: 'agent_action',
        title: 'Operations Agent Action',
        description: decision.decision,
      });
      
      actions.push(action);
    }
    
    return actions;
  }

  async report(context: AgentContext): Promise<AgentReport> {
    const tasks = await getTasks(context.organizationId);
    
    return {
      agentId: this.getId(),
      organizationId: context.organizationId,
      period: 'daily',
      summary: `Monitoring ${tasks.length} tasks`,
      actionsCreated: 0,
      actionsExecuted: 0,
      insightsGenerated: 0,
      recommendations: ['Clear task backlog'],
    };
  }
}

/**
 * Customer Success Agent
 * Monitors customer health and detects churn risk
 */
export class CustomerSuccessAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: 'customer_success_agent',
      name: 'Customer Success Agent',
      role: 'customer_success',
      description: 'Monitors customer health, detects churn risk, and recommends engagement',
      capabilities: ['read_analytics', 'access_crm', 'send_notifications', 'make_recommendations'],
      schedule: { type: 'hourly' },
      riskLevel: 'medium',
      enabled: true,
    };
    super(config);
  }

  async analyze(context: AgentContext): Promise<AgentAnalysis> {
    const [deals, forecasts] = await Promise.all([
      getDeals(context.organizationId),
      getAllForecasts(context.organizationId),
    ]);

    const findings: string[] = [];
    
    // Check for churn risk
    if (forecasts?.churn) {
      const highRisk = forecasts.churn.filter((c: any) => c.risk === 'high');
      if (highRisk.length > 0) {
        findings.push(`${highRisk.length} deals at high churn risk`);
      }
    }
    
    // Check for stale deals
    const staleDeals = deals.filter(d => {
      if (d.stage === 'closed_won' || d.stage === 'closed_lost') return false;
      const daysSince = (Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 45;
    });
    
    if (staleDeals.length > 0) {
      findings.push(`${staleDeals.length} deals stagnant for >45 days`);
    }

    return {
      agentId: this.getId(),
      organizationId: context.organizationId,
      timestamp: new Date(),
      data: { deals: deals.length, churnRisk: forecasts?.churn?.length || 0 },
      findings,
    };
  }

  async decide(analysis: AgentAnalysis): Promise<AgentDecision[]> {
    const decisions: AgentDecision[] = [];
    const churnRisk = analysis.data.churnRisk as number;
    
    if (churnRisk > 0) {
      decisions.push({
        agentId: this.getId(),
        decision: 'Send engagement notifications for at-risk deals',
        confidence: 0.7,
        reasoning: `${churnRisk} deals at high churn risk`,
      });
    }
    
    return decisions;
  }

  async act(decisions: AgentDecision[], context: AgentContext): Promise<any[]> {
    const actions = [];
    
    for (const decision of decisions) {
      const action = await createAction(
        context.organizationId,
        this.getId(),
        {
          type: 'SEND_NOTIFICATION',
          title: 'CS Agent: Engagement Required',
          description: decision.reasoning,
          params: { type: 'churn_risk_alert' },
        },
        'medium'
      );
      
      await activityOperations.store(context.organizationId, {
        agent_id: this.getId(),
        type: 'agent_recommendation',
        title: 'Churn Risk Alert',
        description: decision.decision,
      });
      
      actions.push(action);
    }
    
    return actions;
  }

  async report(context: AgentContext): Promise<AgentReport> {
    return {
      agentId: this.getId(),
      organizationId: context.organizationId,
      period: 'daily',
      summary: 'Monitoring customer health',
      actionsCreated: 0,
      actionsExecuted: 0,
      insightsGenerated: 0,
      recommendations: ['Proactive engagement recommended'],
    };
  }
}

// Export all agents
export const businessAgents = [
  SalesAgent,
  MarketingAgent,
  OperationsAgent,
  CustomerSuccessAgent,
];

export default {
  SalesAgent,
  MarketingAgent,
  OperationsAgent,
  CustomerSuccessAgent,
  businessAgents,
};
