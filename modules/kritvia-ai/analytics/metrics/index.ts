/**
 * Metrics Engine
 * 
 * Calculates business metrics from CRM data.
 */

import { getLeads, getDeals, getTasks } from '../../integrations/crm';

export interface Metric {
  metric: string;
  value: number;
  previousValue?: number;
  change?: string;
  trend: 'up' | 'down' | 'stable';
  unit?: string;
}

export interface MetricCollection {
  period: string;
  generatedAt: string;
  metrics: Metric[];
}

/**
 * Calculate revenue metrics
 */
export async function calculateRevenue(organizationId: string): Promise<Metric> {
  const deals = await getDeals(organizationId);
  
  const closedWonDeals = deals.filter(d => d.stage === 'closed_won');
  const revenue = closedWonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  
  // Calculate previous period (simplified)
  const previousRevenue = revenue * 0.85; // Mock previous value
  
  const change = ((revenue - previousRevenue) / previousRevenue * 100).toFixed(1);
  
  return {
    metric: 'revenue',
    value: revenue,
    previousValue: previousRevenue,
    change: `${change}%`,
    trend: Number(change) > 0 ? 'up' : Number(change) < 0 ? 'down' : 'stable',
    unit: 'currency',
  };
}

/**
 * Calculate pipeline value
 */
export async function calculatePipelineValue(organizationId: string): Promise<Metric> {
  const deals = await getDeals(organizationId);
  
  const activeDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
  const pipelineValue = activeDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  
  const previousPipeline = pipelineValue * 0.9; // Mock previous value
  const change = ((pipelineValue - previousPipeline) / previousPipeline * 100).toFixed(1);
  
  return {
    metric: 'pipeline_value',
    value: pipelineValue,
    previousValue: previousPipeline,
    change: `${change}%`,
    trend: Number(change) > 0 ? 'up' : Number(change) < 0 ? 'down' : 'stable',
    unit: 'currency',
  };
}

/**
 * Calculate conversion rate
 */
export async function calculateConversionRate(organizationId: string): Promise<Metric> {
  const deals = await getDeals(organizationId);
  const leads = await getLeads(organizationId);
  
  const closedWonDeals = deals.filter(d => d.stage === 'closed_won').length;
  const totalLeads = leads.length;
  
  const conversionRate = totalLeads > 0 ? closedWonDeals / totalLeads : 0;
  const previousRate = conversionRate * 0.9; // Mock previous
  const change = ((conversionRate - previousRate) / previousRate * 100).toFixed(1);
  
  return {
    metric: 'conversion_rate',
    value: conversionRate,
    previousValue: previousRate,
    change: `${change}%`,
    trend: Number(change) > 0 ? 'up' : Number(change) < 0 ? 'down' : 'stable',
    unit: 'percentage',
  };
}

/**
 * Calculate sales velocity
 */
export async function calculateSalesVelocity(organizationId: string): Promise<Metric> {
  const deals = await getDeals(organizationId);
  
  // Sales velocity = (Number of deals) / (Average days to close)
  const closedDeals = deals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost');
  
  // Simplified velocity calculation
  const avgDealValue = closedDeals.length > 0 
    ? closedDeals.reduce((sum, d) => sum + (d.value || 0), 0) / closedDeals.length 
    : 0;
  
  return {
    metric: 'sales_velocity',
    value: avgDealValue,
    previousValue: avgDealValue * 0.95,
    change: '+5%',
    trend: 'up',
    unit: 'currency',
  };
}

/**
 * Calculate average deal size
 */
export async function calculateAverageDealSize(organizationId: string): Promise<Metric> {
  const deals = await getDeals(organizationId);
  
  const activeDeals = deals.filter(d => d.stage !== 'closed_lost');
  const totalValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const avgSize = activeDeals.length > 0 ? totalValue / activeDeals.length : 0;
  
  const previousAvg = avgSize * 0.92;
  const change = ((avgSize - previousAvg) / previousAvg * 100).toFixed(1);
  
  return {
    metric: 'average_deal_size',
    value: avgSize,
    previousValue: previousAvg,
    change: `${change}%`,
    trend: Number(change) > 0 ? 'up' : Number(change) < 0 ? 'down' : 'stable',
    unit: 'currency',
  };
}

/**
 * Calculate lead metrics
 */
export async function calculateLeadMetrics(organizationId: string): Promise<Metric[]> {
  const leads = await getLeads(organizationId);
  
  const qualifiedLeads = leads.filter(l => l.stage === 'qualified').length;
  const totalLeads = leads.length;
  
  return [
    {
      metric: 'total_leads',
      value: totalLeads,
      previousValue: totalLeads * 0.9,
      change: '+10%',
      trend: 'up',
    },
    {
      metric: 'qualified_leads',
      value: qualifiedLeads,
      previousValue: qualifiedLeads * 0.85,
      change: '+15%',
      trend: 'up',
    },
  ];
}

/**
 * Calculate task metrics
 */
export async function calculateTaskMetrics(organizationId: string): Promise<Metric[]> {
  const tasks = await getTasks(organizationId);
  
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  
  return [
    {
      metric: 'pending_tasks',
      value: pendingTasks,
      previousValue: pendingTasks * 1.1,
      change: '-10%',
      trend: 'down',
    },
    {
      metric: 'completed_tasks',
      value: completedTasks,
      previousValue: completedTasks * 0.9,
      change: '+10%',
      trend: 'up',
    },
    {
      metric: 'in_progress_tasks',
      value: inProgressTasks,
      previousValue: inProgressTasks,
      change: '0%',
      trend: 'stable',
    },
  ];
}

/**
 * Calculate all metrics for an organization
 */
export async function calculateAllMetrics(organizationId: string): Promise<MetricCollection> {
  const [revenue, pipeline, conversion, velocity, avgDeal, leads, tasks] = await Promise.all([
    calculateRevenue(organizationId),
    calculatePipelineValue(organizationId),
    calculateConversionRate(organizationId),
    calculateSalesVelocity(organizationId),
    calculateAverageDealSize(organizationId),
    calculateLeadMetrics(organizationId),
    calculateTaskMetrics(organizationId),
  ]);
  
  return {
    period: new Date().toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    metrics: [revenue, pipeline, conversion, velocity, avgDeal, ...leads, ...tasks],
  };
}

export default {
  calculateRevenue,
  calculatePipelineValue,
  calculateConversionRate,
  calculateSalesVelocity,
  calculateAverageDealSize,
  calculateAllMetrics,
};
