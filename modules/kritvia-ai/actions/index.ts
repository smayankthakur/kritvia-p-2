/**
 * Agent Action System
 * 
 * Defines and executes agent actions.
 */

export type ActionType =
  | 'CREATE_TASK'
  | 'UPDATE_DEAL'
  | 'SEND_NOTIFICATION'
  | 'GENERATE_REPORT'
  | 'ASSIGN_LEAD'
  | 'UPDATE_LEAD'
  | 'CREATE_DEAL'
  | 'SCHEDULE_FOLLOWUP';

export interface ActionDefinition {
  type: ActionType;
  title: string;
  description: string;
  params: Record<string, unknown>;
}

export interface PendingAction {
  id: string;
  organizationId: string;
  agentId: string;
  type: ActionType;
  title: string;
  description: string;
  params: Record<string, unknown>;
  status: 'pending' | 'approved' | 'executed' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  executedAt?: Date;
  result?: Record<string, unknown>;
}

// In-memory action store
const pendingActions: Map<string, PendingAction> = new Map();
const actionHistory: PendingAction[] = [];

/**
 * Create a new action
 */
export async function createAction(
  organizationId: string,
  agentId: string,
  definition: ActionDefinition,
  riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): Promise<PendingAction> {
  const action: PendingAction = {
    id: `action_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    organizationId,
    agentId,
    type: definition.type,
    title: definition.title,
    description: definition.description,
    params: definition.params,
    status: 'pending',
    riskLevel,
    createdAt: new Date(),
  };
  
  pendingActions.set(action.id, action);
  return action;
}

/**
 * Approve an action
 */
export async function approveAction(
  actionId: string,
  approvedBy: string
): Promise<PendingAction | null> {
  const action = pendingActions.get(actionId);
  if (!action || action.status !== 'pending') return null;
  
  action.status = 'approved';
  return action;
}

/**
 * Reject an action
 */
export async function rejectAction(
  actionId: string,
  rejectedBy: string,
  reason: string
): Promise<PendingAction | null> {
  const action = pendingActions.get(actionId);
  if (!action || action.status !== 'pending') return null;
  
  action.status = 'rejected';
  action.result = { rejectedBy, reason };
  return action;
}

/**
 * Execute an approved action
 */
export async function executeAction(actionId: string): Promise<PendingAction | null> {
  const action = pendingActions.get(actionId);
  if (!action || action.status !== 'approved') return null;
  
  try {
    // Execute based on type
    let result: Record<string, unknown> = {};
    
    switch (action.type) {
      case 'CREATE_TASK':
        result = { message: 'Task created', taskId: `task_${Date.now()}` };
        break;
      case 'UPDATE_DEAL':
        result = { message: 'Deal updated', dealId: action.params.dealId };
        break;
      case 'SEND_NOTIFICATION':
        result = { message: 'Notification sent' };
        break;
      case 'GENERATE_REPORT':
        result = { message: 'Report generated', reportId: `report_${Date.now()}` };
        break;
      case 'ASSIGN_LEAD':
        result = { message: 'Lead assigned', leadId: action.params.leadId };
        break;
      case 'UPDATE_LEAD':
        result = { message: 'Lead updated', leadId: action.params.leadId };
        break;
      case 'CREATE_DEAL':
        result = { message: 'Deal created', dealId: `deal_${Date.now()}` };
        break;
      case 'SCHEDULE_FOLLOWUP':
        result = { message: 'Follow-up scheduled' };
        break;
      default:
        result = { message: 'Action executed' };
    }
    
    action.status = 'executed';
    action.executedAt = new Date();
    action.result = result;
    
    // Move to history
    actionHistory.push(action);
    pendingActions.delete(action.id);
    
    return action;
  } catch (error) {
    action.result = { error: String(error) };
    return action;
  }
}

/**
 * Get pending actions for organization
 */
export function getPendingActions(organizationId: string): PendingAction[] {
  return Array.from(pendingActions.values())
    .filter(a => a.organizationId === organizationId);
}

/**
 * Get action history
 */
export function getActionHistory(organizationId: string, limit = 50): PendingAction[] {
  return actionHistory
    .filter(a => a.organizationId === organizationId)
    .slice(-limit);
}

/**
 * Get action by ID
 */
export function getAction(actionId: string): PendingAction | undefined {
  return pendingActions.get(actionId) || actionHistory.find(a => a.id === actionId);
}

/**
 * Get agent actions
 */
export function getAgentActions(agentId: string, limit = 20): PendingAction[] {
  return actionHistory
    .filter(a => a.agentId === agentId)
    .slice(-limit);
}

export default {
  createAction,
  approveAction,
  rejectAction,
  executeAction,
  getPendingActions,
  getActionHistory,
  getAction,
  getAgentActions,
};
