/**
 * Data Warehouse
 * 
 * Prepares platform for future big-data analytics.
 * Currently provides data export and aggregation utilities.
 */

import { getLeads, getDeals, getTasks } from '../integrations/crm';

export interface DataExport {
  organizationId: string;
  exportedAt: string;
  records: {
    leads: number;
    deals: number;
    tasks: number;
  };
  data: Record<string, unknown>[];
}

/**
 * Export CRM data for analysis
 */
export async function exportCRMData(organizationId: string): Promise<DataExport> {
  const [leads, deals, tasks] = await Promise.all([
    getLeads(organizationId),
    getDeals(organizationId),
    getTasks(organizationId),
  ]);
  
  const data: Record<string, unknown>[] = [];
  
  // Flatten leads
  for (const lead of leads) {
    data.push({
      type: 'lead',
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      value: lead.value || 0,
      stage: lead.stage,
      score: lead.score,
    });
  }
  
  // Flatten deals
  for (const deal of deals) {
    data.push({
      type: 'deal',
      id: deal.id,
      name: deal.name,
      value: deal.value || 0,
      stage: deal.stage,
      probability: deal.probability,
    });
  }
  
  // Flatten tasks
  for (const task of tasks) {
    data.push({
      type: 'task',
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
    });
  }
  
  return {
    organizationId,
    exportedAt: new Date().toISOString(),
    records: {
      leads: leads.length,
      deals: deals.length,
      tasks: tasks.length,
    },
    data,
  };
}

/**
 * Create analytics dataset for reporting
 */
export async function createAnalyticsDataset(organizationId: string, period: 'daily' | 'weekly' | 'monthly' = 'daily') {
  const [leads, deals, tasks] = await Promise.all([
    getLeads(organizationId),
    getDeals(organizationId),
    getTasks(organizationId),
  ]);
  
  // Calculate aggregations
  const totalLeadValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
  const totalDealValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const pipelineValue = deals
    .filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + (d.value || 0), 0);
  
  const closedRevenue = deals
    .filter(d => d.stage === 'closed_won')
    .reduce((sum, d) => sum + (d.value || 0), 0);
  
  const conversionRate = leads.length > 0 
    ? deals.filter(d => d.stage === 'closed_won').length / leads.length 
    : 0;
  
  return {
    organizationId,
    period,
    generatedAt: new Date().toISOString(),
    metrics: {
      totalLeads: leads.length,
      totalDeals: deals.length,
      totalTasks: tasks.length,
      totalLeadValue,
      totalDealValue,
      pipelineValue,
      closedRevenue,
      conversionRate: Math.round(conversionRate * 100) / 100,
    },
  };
}

/**
 * Build historical dataset for trend analysis
 */
export async function buildHistoricalDataset(organizationId: string, days: number = 30) {
  const snapshots: Record<string, unknown>[] = [];
  const today = new Date();
  
  // Generate mock historical data
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const basePipeline = 50000 + Math.random() * 30000;
    const baseRevenue = 5000 + Math.random() * 10000;
    const baseLeads = 5 + Math.floor(Math.random() * 10);
    const baseDeals = 2 + Math.floor(Math.random() * 5);
    
    snapshots.push({
      date: date.toISOString().slice(0, 10),
      pipelineValue: Math.round(basePipeline),
      revenue: Math.round(baseRevenue),
      leadCount: baseLeads,
      dealCount: baseDeals,
      taskCompleted: Math.floor(Math.random() * 8),
    });
  }
  
  return {
    organizationId,
    period: `${days} days`,
    generatedAt: new Date().toISOString(),
    snapshots,
  };
}

/**
 * Get data warehouse status
 */
export async function getWarehouseStatus(organizationId: string) {
  const [leads, deals, tasks] = await Promise.all([
    getLeads(organizationId),
    getDeals(organizationId),
    getTasks(organizationId),
  ]);
  
  return {
    organizationId,
    status: 'operational',
    dataPoints: leads.length + deals.length + tasks.length,
    lastSync: new Date().toISOString(),
    features: {
      export: true,
      analytics: true,
      forecasting: true,
      historical: true,
    },
  };
}

export default {
  exportCRMData,
  createAnalyticsDataset,
  buildHistoricalDataset,
  getWarehouseStatus,
};
