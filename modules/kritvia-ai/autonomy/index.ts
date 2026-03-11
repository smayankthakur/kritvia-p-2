/**
 * Autonomous Workflow Engine
 * 
 * Allow AI agents to trigger automated workflows.
 */

import { randomUUID } from 'crypto';

// Workflow Types
export type WorkflowAction =
  | 'create_task'
  | 'send_email'
  | 'create_crm_record'
  | 'launch_campaign'
  | 'schedule_meeting'
  | 'notify_team'
  | 'update_pipeline'
  | 'generate_report';

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed' | 'requires_approval';

// Workflow Definition
export interface Workflow {
  id: string;
  name: string;
  description: string;
  triggerEvent: string;
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  confidenceThreshold: number;
  requiresApproval: boolean;
  enabled: boolean;
}

// Workflow Execution
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  organizationId: string;
  eventId: string;
  status: WorkflowStatus;
  actions: WorkflowActionExecution[];
  result?: string;
  approvedBy?: string;
  createdAt: number;
  completedAt?: number;
}

// Workflow Action Execution
export interface WorkflowActionExecution {
  action: WorkflowAction;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
}

// Workflow Condition
export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: unknown;
}

// Predefined workflows
const workflowTemplates: Workflow[] = [
  {
    id: 'high_value_deal_alert',
    name: 'High Value Deal Alert',
    description: 'Alert team when a deal over $100K is created',
    triggerEvent: 'deal_created',
    actions: ['notify_team', 'create_task', 'schedule_meeting'],
    conditions: [
      { field: 'dealValue', operator: 'greater_than', value: 100000 },
    ],
    confidenceThreshold: 0.7,
    requiresApproval: false,
    enabled: true,
  },
  {
    id: 'churn_prevention',
    name: 'Churn Prevention',
    description: 'Trigger retention actions when churn risk is detected',
    triggerEvent: 'customer_churn_detected',
    actions: ['notify_team', 'create_task', 'send_email'],
    conditions: [
      { field: 'riskScore', operator: 'greater_than', value: 70 },
    ],
    confidenceThreshold: 0.8,
    requiresApproval: true,
    enabled: true,
  },
  {
    id: 'deal_stage_escalation',
    name: 'Deal Stage Escalation',
    description: 'Create tasks when deals stagnate in negotiation',
    triggerEvent: 'deal_stage_changed',
    actions: ['create_task', 'notify_team'],
    conditions: [
      { field: 'daysInStage', operator: 'greater_than', value: 21 },
    ],
    confidenceThreshold: 0.75,
    requiresApproval: false,
    enabled: true,
  },
  {
    id: 'campaign_performance',
    name: 'Campaign Performance Alert',
    description: 'Alert when campaign underperforms',
    triggerEvent: 'campaign_performance_update',
    actions: ['notify_team', 'create_task'],
    conditions: [
      { field: 'roi', operator: 'less_than', value: 1.5 },
    ],
    confidenceThreshold: 0.7,
    requiresApproval: false,
    enabled: true,
  },
];

// Storage
const workflows: Map<string, Workflow> = new Map();
const executions: WorkflowExecution[] = [];

// Initialize with templates
workflowTemplates.forEach(w => workflows.set(w.id, w));

// Autonomous Workflow Engine
export class AutonomyEngine {
  /**
   * Execute workflows for an event
   */
  async executeWorkflows(
    eventType: string,
    organizationId: string,
    eventId: string,
    eventData: Record<string, unknown>
  ): Promise<WorkflowExecution[]> {
    const triggeredWorkflows: WorkflowExecution[] = [];

    // Find matching workflows
    const matchingWorkflows = this.findMatchingWorkflows(eventType, eventData);

    for (const workflow of matchingWorkflows) {
      if (!workflow.enabled) continue;

      const execution = await this.executeWorkflow(workflow, organizationId, eventId, eventData);
      triggeredWorkflows.push(execution);
    }

    return triggeredWorkflows;
  }

  /**
   * Find workflows that match the event
   */
  private findMatchingWorkflows(
    eventType: string,
    eventData: Record<string, unknown>
  ): Workflow[] {
    const matching: Workflow[] = [];

    for (const workflow of workflows.values()) {
      if (workflow.triggerEvent !== eventType) continue;

      // Check conditions
      if (this.evaluateConditions(workflow.conditions, eventData)) {
        matching.push(workflow);
      }
    }

    return matching;
  }

  /**
   * Evaluate workflow conditions
   */
  private evaluateConditions(
    conditions: WorkflowCondition[],
    data: Record<string, unknown>
  ): boolean {
    for (const condition of conditions) {
      const fieldValue = data[condition.field];
      
      if (fieldValue === undefined) return false;

      switch (condition.operator) {
        case 'equals':
          if (fieldValue !== condition.value) return false;
          break;
        case 'greater_than':
          if (typeof fieldValue !== 'number' || typeof condition.value !== 'number') return false;
          if (fieldValue <= condition.value) return false;
          break;
        case 'less_than':
          if (typeof fieldValue !== 'number' || typeof condition.value !== 'number') return false;
          if (fieldValue >= condition.value) return false;
          break;
        case 'contains':
          if (typeof fieldValue !== 'string') return false;
          if (!fieldValue.includes(condition.value as string)) return false;
          break;
      }
    }

    return true;
  }

  /**
   * Execute a single workflow
   */
  private async executeWorkflow(
    workflow: Workflow,
    organizationId: string,
    eventId: string,
    eventData: Record<string, unknown>
  ): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: randomUUID(),
      workflowId: workflow.id,
      organizationId,
      eventId,
      status: workflow.requiresApproval ? 'requires_approval' : 'running',
      actions: [],
      createdAt: Date.now(),
    };

    // Store execution
    executions.push(execution);

    // Check approval requirement
    if (workflow.requiresApproval) {
      return execution;
    }

    // Execute actions
    return this.executeActions(execution, workflow.actions);
  }

  /**
   * Execute workflow actions
   */
  private async executeActions(
    execution: WorkflowExecution,
    actions: WorkflowAction[]
  ): Promise<WorkflowExecution> {
    execution.status = 'running';

    for (const action of actions) {
      const actionExec: WorkflowActionExecution = {
        action,
        status: 'running',
      };

      execution.actions.push(actionExec);

      try {
        // Simulate action execution
        await this.executeAction(action, execution);
        actionExec.status = 'completed';
        actionExec.result = `Action ${action} completed successfully`;
      } catch (error) {
        actionExec.status = 'failed';
        actionExec.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    execution.status = 'completed';
    execution.completedAt = Date.now();
    execution.result = `Workflow executed ${execution.actions.length} actions`;

    return execution;
  }

  /**
   * Execute a single action
   */
  private async executeAction(
    action: WorkflowAction,
    execution: WorkflowExecution
  ): Promise<void> {
    // Simulate different action types
    switch (action) {
      case 'create_task':
        await this.simulateDelay(50);
        break;
      case 'send_email':
        await this.simulateDelay(100);
        break;
      case 'notify_team':
        await this.simulateDelay(30);
        break;
      case 'schedule_meeting':
        await this.simulateDelay(80);
        break;
      case 'create_crm_record':
        await this.simulateDelay(60);
        break;
      case 'launch_campaign':
        await this.simulateDelay(150);
        break;
      case 'update_pipeline':
        await this.simulateDelay(40);
        break;
      case 'generate_report':
        await this.simulateDelay(200);
        break;
    }
  }

  /**
   * Simulate async delay
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Approve a workflow execution
   */
  async approveExecution(
    executionId: string,
    approvedBy: string
  ): Promise<WorkflowExecution | null> {
    const execution = executions.find(e => e.id === executionId);
    if (!execution || execution.status !== 'requires_approval') return null;

    const workflow = workflows.get(execution.workflowId);
    if (!workflow) return null;

    execution.approvedBy = approvedBy;
    return this.executeActions(execution, workflow.actions);
  }

  /**
   * Get workflow executions
   */
  async getExecutions(
    organizationId: string,
    limit: number = 20
  ): Promise<WorkflowExecution[]> {
    return executions
      .filter(e => e.organizationId === organizationId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get enabled workflows
   */
  async getWorkflows(): Promise<Workflow[]> {
    return Array.from(workflows.values()).filter(w => w.enabled);
  }

  /**
   * Enable/disable workflow
   */
  async setWorkflowEnabled(workflowId: string, enabled: boolean): Promise<boolean> {
    const workflow = workflows.get(workflowId);
    if (!workflow) return false;
    workflow.enabled = enabled;
    return true;
  }
}

// Export singleton
export const autonomyEngine = new AutonomyEngine();

// Convenience function
export async function triggerWorkflows(
  eventType: string,
  organizationId: string,
  eventId: string,
  eventData: Record<string, unknown>
): Promise<WorkflowExecution[]> {
  return autonomyEngine.executeWorkflows(eventType, organizationId, eventId, eventData);
}
