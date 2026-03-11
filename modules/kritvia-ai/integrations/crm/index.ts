/**
 * CRM Integration Layer
 * 
 * Multi-tenant CRM interfaces using database layer.
 */

import {
  leadOperations,
  dealOperations,
  taskOperations,
} from '../../../core/database';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  score: number;
  stage: string;
  assignedTo?: string;
  value?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  leadId?: string;
  assignedTo?: string;
  expectedCloseDate?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  role?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority?: string;
  assignee?: string;
  dueDate?: string;
  relatedTo?: {
    type: 'lead' | 'deal' | 'contact';
    id: string;
  };
}

// Convert database lead to CRM lead format
function toLead(dbLead: {
  id: string;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  status: string;
  value?: number;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}): Lead {
  return {
    id: dbLead.id,
    name: dbLead.name,
    email: dbLead.email || '',
    company: dbLead.company || '',
    phone: dbLead.phone,
    score: dbLead.status === 'qualified' ? 80 : dbLead.status === 'new' ? 30 : 50,
    stage: dbLead.status,
    assignedTo: dbLead.assigned_to,
    createdAt: dbLead.created_at,
    updatedAt: dbLead.updated_at,
  };
}

// Convert database deal to CRM deal format
function toDeal(dbDeal: {
  id: string;
  name: string;
  value?: number;
  stage: string;
  probability?: number;
  lead_id?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}): Deal {
  return {
    id: dbDeal.id,
    name: dbDeal.name,
    value: dbDeal.value || 0,
    stage: dbDeal.stage,
    probability: dbDeal.probability || 0,
    leadId: dbDeal.lead_id,
    assignedTo: dbDeal.assigned_to,
    createdAt: dbDeal.created_at,
  };
}

// Convert database task to CRM task format
function toTask(dbTask: {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    status: dbTask.status === 'completed' ? 'completed' : dbTask.status === 'in_progress' ? 'in_progress' : 'pending',
    assignee: dbTask.assigned_to,
    dueDate: dbTask.due_date,
  };
}

/**
 * Get all leads for an organization
 */
export async function getLeads(organizationId: string): Promise<Lead[]> {
  const dbLeads = await leadOperations.getByOrganization(organizationId);
  return dbLeads.map(toLead);
}

/**
 * Get lead by ID
 */
export async function getLead(id: string, organizationId: string): Promise<Lead | null> {
  const dbLead = await leadOperations.getById(id);
  if (!dbLead || dbLead.organization_id !== organizationId) return null;
  return toLead(dbLead);
}

/**
 * Create a new lead
 */
export async function createLead(
  organizationId: string,
  data: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    value?: number;
  }
): Promise<Lead> {
  const dbLead = await leadOperations.create(organizationId, {
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    source: data.source,
    value: data.value,
    status: 'new',
  });
  return toLead(dbLead);
}

/**
 * Update a lead
 */
export async function updateLead(
  id: string,
  organizationId: string,
  data: Partial<Lead>
): Promise<Lead | null> {
  const dbLead = await leadOperations.update(id, {
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    status: data.stage,
    value: data.value,
    assigned_to: data.assignedTo,
  });
  if (!dbLead || dbLead.organization_id !== organizationId) return null;
  return toLead(dbLead);
}

/**
 * Get all deals for an organization
 */
export async function getDeals(organizationId: string): Promise<Deal[]> {
  const dbDeals = await dealOperations.getByOrganization(organizationId);
  return dbDeals.map(toDeal);
}

/**
 * Get deal by ID
 */
export async function getDeal(id: string, organizationId: string): Promise<Deal | null> {
  const dbDeal = await dealOperations.getById(id);
  if (!dbDeal || dbDeal.organization_id !== organizationId) return null;
  return toDeal(dbDeal);
}

/**
 * Create a new deal
 */
export async function createDeal(
  organizationId: string,
  data: {
    name: string;
    value?: number;
    stage?: string;
    probability?: number;
    leadId?: string;
  }
): Promise<Deal> {
  const dbDeal = await dealOperations.create(organizationId, {
    name: data.name,
    value: data.value,
    stage: data.stage || 'lead',
    probability: data.probability,
    lead_id: data.leadId,
  });
  return toDeal(dbDeal);
}

/**
 * Update a deal
 */
export async function updateDeal(
  id: string,
  organizationId: string,
  data: Partial<Deal>
): Promise<Deal | null> {
  const dbDeal = await dealOperations.update(id, {
    name: data.name,
    value: data.value,
    stage: data.stage,
    probability: data.probability,
    lead_id: data.leadId,
    assigned_to: data.assignedTo,
  });
  if (!dbDeal || dbDeal.organization_id !== organizationId) return null;
  return toDeal(dbDeal);
}

/**
 * Get all tasks for an organization
 */
export async function getTasks(organizationId: string): Promise<Task[]> {
  const dbTasks = await taskOperations.getByOrganization(organizationId);
  return dbTasks.map(toTask);
}

/**
 * Create a new task
 */
export async function createTask(
  organizationId: string,
  data: {
    title: string;
    description?: string;
    priority?: string;
    assignee?: string;
    dueDate?: string;
  }
): Promise<Task> {
  const dbTask = await taskOperations.create(organizationId, {
    title: data.title,
    description: data.description,
    status: 'pending',
    priority: data.priority || 'medium',
    assigned_to: data.assignee,
    due_date: data.dueDate,
  });
  return toTask(dbTask);
}

/**
 * Update a task
 */
export async function updateTask(
  id: string,
  organizationId: string,
  data: Partial<Task>
): Promise<Task | null> {
  const dbTask = await taskOperations.update(id, {
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    assigned_to: data.assignee,
    due_date: data.dueDate,
  });
  if (!dbTask || dbTask.organization_id !== organizationId) return null;
  return toTask(dbTask);
}

/**
 * Get CRM statistics for an organization
 */
export async function getCRMStats(organizationId: string): Promise<{
  totalLeads: number;
  totalDeals: number;
  totalTasks: number;
  pipelineValue: number;
}> {
  const [leads, deals, tasks] = await Promise.all([
    getLeads(organizationId),
    getDeals(organizationId),
    getTasks(organizationId),
  ]);

  const pipelineValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return {
    totalLeads: leads.length,
    totalDeals: deals.length,
    totalTasks: tasks.length,
    pipelineValue,
  };
}

export default {
  getLeads,
  getLead,
  createLead,
  updateLead,
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  getTasks,
  createTask,
  updateTask,
  getCRMStats,
};
