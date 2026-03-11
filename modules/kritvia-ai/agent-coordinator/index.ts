/**
 * Multi-Agent Coordination System
 * 
 * Coordinate multiple AI agents when events occur.
 */

import { randomUUID } from 'crypto';

// Agent Types
export type AgentType = 'sales' | 'marketing' | 'operations' | 'customer_success' | 'finance' | 'general';

// Agent Task
export interface AgentTask {
  id: string;
  agentType: AgentType;
  organizationId: string;
  eventId: string;
  task: string;
  priority: number; // 1-10
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

// Agent Response
export interface AgentResponse {
  taskId: string;
  agentType: AgentType;
  success: boolean;
  result: string;
  actions: string[];
  metadata: Record<string, unknown>;
}

// Agent definitions
const agentCapabilities: Record<AgentType, string[]> = {
  sales: ['pipeline_analysis', 'deal_review', 'forecasting', 'lead_scoring'],
  marketing: ['campaign_optimization', 'content_generation', 'audience_targeting'],
  operations: ['task_management', 'resource_allocation', 'process_automation'],
  customer_success: ['churn_prevention', 'upselling', 'support_automation'],
  finance: ['budget_analysis', 'forecasting', 'roi_calculation'],
  general: ['analysis', 'reporting', 'recommendations'],
};

// Task queue
const taskQueue: AgentTask[] = [];
const runningTasks: Map<string, AgentTask> = new Map();

// Multi-Agent Coordinator
export class AgentCoordinator {
  /**
   * Coordinate agents for an event
   */
  async coordinate(
    eventType: string,
    organizationId: string,
    eventId: string,
    context: Record<string, unknown> = {}
  ): Promise<AgentTask[]> {
    const tasks: AgentTask[] = [];

    // Determine which agents should respond
    const agentsToInvoke = this.determineAgents(eventType, context);

    // Create tasks for each agent
    for (const agentType of agentsToInvoke) {
      const task = await this.assignTask(agentType, organizationId, eventId, eventType, context);
      tasks.push(task);
    }

    // Execute tasks (in parallel with priority ordering)
    const sortedTasks = tasks.sort((a, b) => b.priority - a.priority);
    await this.executeTasks(sortedTasks);

    return tasks;
  }

  /**
   * Determine which agents should respond to an event
   */
  determineAgents(eventType: string, context: Record<string, unknown>): AgentType[] {
    const agents: AgentType[] = [];

    // Event type to agent mapping
    const eventAgentMap: Record<string, AgentType[]> = {
      deal_created: ['sales'],
      deal_stage_changed: ['sales', 'operations'],
      deal_closed: ['sales', 'finance'],
      deal_lost: ['sales', 'customer_success'],
      pipeline_value_changed: ['sales', 'finance'],
      campaign_launched: ['marketing'],
      campaign_performance_update: ['marketing'],
      customer_churn_detected: ['customer_success', 'sales'],
      customer_upgrade: ['customer_success', 'sales'],
      revenue_target_updated: ['sales', 'finance', 'operations'],
      lead_created: ['sales'],
      lead_converted: ['sales', 'customer_success'],
      task_completed: ['operations'],
      budget_updated: ['finance', 'operations'],
    };

    // Get agents for this event type
    const mappedAgents = eventAgentMap[eventType];
    if (mappedAgents) {
      agents.push(...mappedAgents);
    }

    // Add general agent for complex events
    const dealValue = context.dealValue as number;
    if (dealValue && dealValue > 100000) {
      agents.push('general');
    }

    // Remove duplicates
    return [...new Set(agents)];
  }

  /**
   * Assign a task to an agent
   */
  async assignTask(
    agentType: AgentType,
    organizationId: string,
    eventId: string,
    eventType: string,
    context: Record<string, unknown>
  ): Promise<AgentTask> {
    // Generate task description based on event
    const taskDescription = this.generateTaskDescription(agentType, eventType, context);
    const priority = this.calculatePriority(agentType, eventType, context);

    const task: AgentTask = {
      id: randomUUID(),
      agentType,
      organizationId,
      eventId,
      task: taskDescription,
      priority,
      status: 'pending',
      createdAt: Date.now(),
    };

    taskQueue.push(task);
    return task;
  }

  /**
   * Execute tasks with priority ordering
   */
  private async executeTasks(tasks: AgentTask[]): Promise<void> {
    for (const task of tasks) {
      if (task.status !== 'pending') continue;

      task.status = 'running';
      task.startedAt = Date.now();
      runningTasks.set(task.id, task);

      try {
        // Execute agent task
        const result = await this.executeAgentTask(task);
        
        task.status = 'completed';
        task.result = result.result;
        task.completedAt = Date.now();
      } catch (error) {
        task.status = 'failed';
        task.error = error instanceof Error ? error.message : 'Unknown error';
        task.completedAt = Date.now();
      }

      runningTasks.delete(task.id);
    }
  }

  /**
   * Execute a single agent task
   */
  private async executeAgentTask(task: AgentTask): Promise<AgentResponse> {
    // Simulate agent processing
    await this.simulateAgentProcessing(task);

    const result = this.generateAgentResponse(task);

    return result;
  }

  /**
   * Simulate agent processing time
   */
  private simulateAgentProcessing(task: AgentTask): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }

  /**
   * Generate agent response based on task
   */
  private generateAgentResponse(task: AgentTask): AgentResponse {
    const responses: Record<AgentType, { result: string; actions: string[] }> = {
      sales: {
        result: `Sales Agent analyzed the ${task.eventId} event and reviewed pipeline impact.`,
        actions: ['Reviewed deal stages', 'Updated forecast', 'Identified action items'],
      },
      marketing: {
        result: `Marketing Agent evaluated campaign and engagement metrics.`,
        actions: ['Analyzed performance', 'Generated recommendations', 'Scheduled follow-up'],
      },
      operations: {
        result: `Operations Agent assessed resource allocation and task requirements.`,
        actions: ['Reviewed task queue', 'Updated priorities', 'Allocated resources'],
      },
      customer_success: {
        result: `Customer Success Agent evaluated customer health and retention risk.`,
        actions: ['Reviewed customer data', 'Identified upsell opportunities', 'Created action plan'],
      },
      finance: {
        result: `Finance Agent analyzed financial impact and budget implications.`,
        actions: ['Calculated ROI', 'Updated forecasts', 'Generated report'],
      },
      general: {
        result: `AI Agent provided comprehensive analysis and recommendations.`,
        actions: ['Collected data', 'Generated insights', 'Created action items'],
      },
    };

    return {
      taskId: task.id,
      agentType: task.agentType,
      success: task.status === 'completed',
      result: responses[task.agentType].result,
      actions: responses[task.agentType].actions,
      metadata: { taskDescription: task.task },
    };
  }

  /**
   * Generate task description
   */
  private generateTaskDescription(
    agentType: AgentType,
    eventType: string,
    context: Record<string, unknown>
  ): string {
    const dealValue = context.dealValue as number;
    const customerName = context.customerName as string;

    switch (agentType) {
      case 'sales':
        return `Analyze ${eventType} event${dealValue ? ` (Deal value: $${dealValue.toLocaleString()})` : ''}`;
      case 'marketing':
        return `Evaluate marketing impact of ${eventType} event`;
      case 'operations':
        return `Assess operational requirements from ${eventType}`;
      case 'customer_success':
        return `Review customer${customerName ? ` ${customerName}` : ''} status from ${eventType}`;
      case 'finance':
        return `Analyze financial implications of ${eventType}`;
      default:
        return `Process ${eventType} event`;
    }
  }

  /**
   * Calculate task priority
   */
  private calculatePriority(
    agentType: AgentType,
    eventType: string,
    context: Record<string, unknown>
  ): number {
    let priority = 5; // Default

    // High value deals get higher priority
    const dealValue = context.dealValue as number;
    if (dealValue && dealValue > 100000) priority = 9;
    else if (dealValue && dealValue > 50000) priority = 7;

    // Critical events get higher priority
    if (eventType === 'customer_churn_detected') priority = 9;
    if (eventType === 'deal_lost') priority = 8;

    return priority;
  }

  /**
   * Get task status
   */
  async getTaskStatus(taskId: string): Promise<AgentTask | null> {
    const running = runningTasks.get(taskId);
    if (running) return running;
    
    return taskQueue.find(t => t.id === taskId) || null;
  }

  /**
   * Get organization's tasks
   */
  async getOrganizationTasks(organizationId: string, limit: number = 20): Promise<AgentTask[]> {
    return taskQueue
      .filter(t => t.organizationId === organizationId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get active tasks
   */
  async getActiveTasks(): Promise<AgentTask[]> {
    return Array.from(runningTasks.values());
  }

  /**
   * Get agent statistics
   */
  async getAgentStats(organizationId: string): Promise<Record<AgentType, number>> {
    const orgTasks = taskQueue.filter(t => t.organizationId === organizationId);
    
    const stats: Record<AgentType, number> = {
      sales: 0,
      marketing: 0,
      operations: 0,
      customer_success: 0,
      finance: 0,
      general: 0,
    };
    
    for (const task of orgTasks) {
      stats[task.agentType]++;
    }
    
    return stats;
  }
}

// Export singleton
export const agentCoordinator = new AgentCoordinator();

// Convenience function
export async function coordinateAgents(
  eventType: string,
  organizationId: string,
  eventId: string,
  context?: Record<string, unknown>
): Promise<AgentTask[]> {
  return agentCoordinator.coordinate(eventType, organizationId, eventId, context || {});
}
