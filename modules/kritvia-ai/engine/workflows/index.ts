/**
 * AI Automation Workflows
 * 
 * Workflow system for automated business processes.
 */

export interface WorkflowStep {
  id: string;
  name: string;
  action: string;
  params: Record<string, unknown>;
  onSuccess?: string; // Next step ID
  onFailure?: string; // Next step ID
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  trigger: {
    type: 'lead_created' | 'deal_stage_changed' | 'scheduled' | 'manual';
    condition?: Record<string, unknown>;
  };
  status: 'active' | 'paused';
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  currentStep?: string;
  results: Record<string, unknown>[];
  startedAt: string;
  completedAt?: string;
}

// Predefined workflows
export const workflows: Workflow[] = [
  {
    id: 'new-lead-workflow',
    name: 'New Lead Workflow',
    description: 'Automatically score and assign new leads',
    steps: [
      {
        id: 'score',
        name: 'Score Lead',
        action: 'score_lead',
        params: {},
        onSuccess: 'assign',
      },
      {
        id: 'assign',
        name: 'Assign to Sales Rep',
        action: 'assign_lead',
        params: {},
        onSuccess: 'notify',
      },
      {
        id: 'notify',
        name: 'Create Follow-up Task',
        action: 'create_task',
        params: {},
      },
    ],
    trigger: {
      type: 'lead_created',
    },
    status: 'active',
  },
  {
    id: 'deal-alert-workflow',
    name: 'Deal Alert Workflow',
    description: 'Monitor deals and send alerts',
    steps: [
      {
        id: 'check-probability',
        name: 'Check Deal Probability',
        action: 'check_probability',
        params: { threshold: 80 },
        onSuccess: 'alert',
      },
      {
        id: 'alert',
        name: 'Send Alert',
        action: 'send_alert',
        params: {},
      },
    ],
    trigger: {
      type: 'deal_stage_changed',
    },
    status: 'active',
  },
];

/**
 * Execute a workflow
 */
export async function executeWorkflow(
  workflowId: string,
  data: Record<string, unknown>
): Promise<WorkflowExecution> {
  const workflow = workflows.find(w => w.id === workflowId);
  
  if (!workflow) {
    return {
      id: crypto.randomUUID(),
      workflowId,
      status: 'failed',
      results: [],
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  }

  const execution: WorkflowExecution = {
    id: crypto.randomUUID(),
    workflowId,
    status: 'running',
    results: [],
    startedAt: new Date().toISOString(),
  };

  // Execute steps sequentially
  for (const step of workflow.steps) {
    execution.currentStep = step.id;
    
    try {
      // Simulate step execution
      const result = await executeStep(step, data);
      execution.results.push({ step: step.id, ...result });
      
      if (!result.success && step.onFailure) {
        // Handle failure path
        break;
      }
    } catch (error) {
      execution.results.push({ 
        step: step.id, 
        success: false, 
        error: String(error) 
      });
      
      if (step.onFailure) {
        break;
      }
    }
  }

  execution.status = 'completed';
  execution.completedAt = new Date().toISOString();
  
  return execution;
}

/**
 * Execute a single workflow step
 */
async function executeStep(
  step: WorkflowStep,
  data: Record<string, unknown>
): Promise<{ success: boolean; result?: Record<string, unknown> }> {
  // Simulate step execution
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    result: { step: step.name, executed: true, ...data },
  };
}

/**
 * Get all workflows
 */
export function getWorkflows(): Workflow[] {
  return workflows;
}

/**
 * Get workflow by ID
 */
export function getWorkflow(id: string): Workflow | undefined {
  return workflows.find(w => w.id === id);
}

/**
 * Pause a workflow
 */
export function pauseWorkflow(id: string): Workflow | undefined {
  const workflow = workflows.find(w => w.id === id);
  if (workflow) {
    workflow.status = 'paused';
  }
  return workflow;
}

/**
 * Resume a workflow
 */
export function resumeWorkflow(id: string): Workflow | undefined {
  const workflow = workflows.find(w => w.id === id);
  if (workflow) {
    workflow.status = 'active';
  }
  return workflow;
}

export default {
  executeWorkflow,
  getWorkflows,
  getWorkflow,
  pauseWorkflow,
  resumeWorkflow,
};
