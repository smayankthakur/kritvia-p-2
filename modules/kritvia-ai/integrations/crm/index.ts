/**
 * CRM Integration Layer
 * 
 * Interfaces for CRM connection.
 * Uses mock data if real CRM is not ready.
 */

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  score: number;
  stage: string;
  assignedTo?: string;
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
  assignee?: string;
  dueDate?: string;
  relatedTo?: {
    type: 'lead' | 'deal' | 'contact';
    id: string;
  };
}

// Mock data store
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    phone: '+1 555-0101',
    score: 85,
    stage: 'qualified',
    assignedTo: 'sales-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@techstart.io',
    company: 'TechStart',
    phone: '+1 555-0102',
    score: 72,
    stage: 'meeting',
    assignedTo: 'sales-2',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@enterprise.com',
    company: 'Enterprise Inc',
    score: 45,
    stage: 'new',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
  },
];

const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'Acme Corp Enterprise License',
    value: 50000,
    stage: 'proposal',
    probability: 60,
    leadId: '1',
    assignedTo: 'sales-1',
    expectedCloseDate: '2024-02-15',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'TechStart MVP Development',
    value: 25000,
    stage: 'negotiation',
    probability: 80,
    leadId: '2',
    assignedTo: 'sales-2',
    expectedCloseDate: '2024-02-01',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: '3',
    name: 'Enterprise Security Audit',
    value: 75000,
    stage: 'discovery',
    probability: 30,
    createdAt: '2024-01-18T10:00:00Z',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with John Doe',
    description: 'Discuss enterprise license terms',
    status: 'pending',
    assignee: 'sales-1',
    dueDate: '2024-01-25',
    relatedTo: { type: 'lead', id: '1' },
  },
  {
    id: '2',
    title: 'Prepare proposal for TechStart',
    description: 'MVP scope and timeline',
    status: 'in_progress',
    assignee: 'sales-2',
    dueDate: '2024-01-28',
    relatedTo: { type: 'deal', id: '2' },
  },
];

/**
 * Get all leads
 */
export async function getLeads(): Promise<Lead[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...mockLeads];
}

/**
 * Get lead by ID
 */
export async function getLead(id: string): Promise<Lead | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockLeads.find(l => l.id === id) || null;
}

/**
 * Get all deals
 */
export async function getDeals(): Promise<Deal[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...mockDeals];
}

/**
 * Get deal by ID
 */
export async function getDeal(id: string): Promise<Deal | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockDeals.find(d => d.id === id) || null;
}

/**
 * Update lead
 */
export async function updateLead(
  id: string,
  data: Partial<Lead>
): Promise<Lead | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const index = mockLeads.findIndex(l => l.id === id);
  if (index === -1) return null;
  
  mockLeads[index] = { ...mockLeads[index], ...data, updatedAt: new Date().toISOString() };
  return mockLeads[index];
}

/**
 * Create task
 */
export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newTask: Task = {
    ...task,
    id: String(mockTasks.length + 1),
  };
  mockTasks.push(newTask);
  return newTask;
}

/**
 * Assign deal to sales rep
 */
export async function assignDeal(
  dealId: string,
  salesRepId: string
): Promise<Deal | null> {
  return updateDeal(dealId, { assignedTo: salesRepId });
}

/**
 * Update deal
 */
export async function updateDeal(
  id: string,
  data: Partial<Deal>
): Promise<Deal | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const index = mockDeals.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  mockDeals[index] = { ...mockDeals[index], ...data };
  return mockDeals[index];
}

/**
 * Get tasks for a user
 */
export async function getTasks(assigneeId?: string): Promise<Task[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (assigneeId) {
    return mockTasks.filter(t => t.assignee === assigneeId);
  }
  return [...mockTasks];
}

/**
 * Get pipeline summary
 */
export async function getPipelineSummary(): Promise<{
  totalValue: number;
  dealsByStage: Record<string, number>;
  avgProbability: number;
}> {
  const deals = await getDeals();
  
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const dealsByStage: Record<string, number> = {};
  deals.forEach(d => {
    dealsByStage[d.stage] = (dealsByStage[d.stage] || 0) + 1;
  });
  const avgProbability = deals.length > 0
    ? deals.reduce((sum, d) => sum + d.probability, 0) / deals.length
    : 0;
  
  return { totalValue, dealsByStage, avgProbability };
}

export default {
  getLeads,
  getLead,
  getDeals,
  getDeal,
  updateLead,
  createTask,
  assignDeal,
  updateDeal,
  getTasks,
  getPipelineSummary,
};
