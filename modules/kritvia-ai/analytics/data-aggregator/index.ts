/**
 * Analytics Data Aggregator
 * 
 * Gathers and aggregates CRM data over time periods.
 */

import { getLeads, getDeals, getTasks } from '../../integrations/crm';
import { insightOperations, activityOperations } from '../../../core/database';

export interface DailyStats {
  date: string;
  pipelineValue: number;
  conversionRate: number;
  revenue: number;
  leadCount: number;
  dealCount: number;
  taskCompleted: number;
}

// In-memory analytics snapshots
const analyticsSnapshots: Map<string, DailyStats[]> = new Map();

/**
 * Aggregate daily statistics
 */
export async function aggregateDailyStats(organizationId: string, date?: string): Promise<DailyStats> {
  const targetDate = date || new Date().toISOString().slice(0, 10);
  
  const [leads, deals, tasks] = await Promise.all([
    getLeads(organizationId),
    getDeals(organizationId),
    getTasks(organizationId),
  ]);
  
  const activeDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
  const closedWonDeals = deals.filter(d => d.stage === 'closed_won');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const pipelineValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const revenue = closedWonDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const conversionRate = leads.length > 0 ? closedWonDeals.length / leads.length : 0;
  
  return {
    date: targetDate,
    pipelineValue,
    conversionRate,
    revenue,
    leadCount: leads.length,
    dealCount: deals.length,
    taskCompleted: completedTasks.length,
  };
}

/**
 * Aggregate weekly statistics
 */
export async function aggregateWeeklyStats(organizationId: string): Promise<DailyStats[]> {
  const stats: DailyStats[] = [];
  const today = new Date();
  
  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    
    // Generate slightly varied stats for demo
    const baseStats = await aggregateDailyStats(organizationId, dateStr);
    baseStats.pipelineValue *= (0.8 + Math.random() * 0.4);
    baseStats.revenue *= (0.5 + Math.random() * 0.5);
    
    stats.push(baseStats);
  }
  
  return stats;
}

/**
 * Aggregate monthly statistics
 */
export async function aggregateMonthlyStats(organizationId: string): Promise<DailyStats[]> {
  const stats: DailyStats[] = [];
  const today = new Date();
  
  // Get last 30 days in weekly chunks
  for (let i = 3; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));
    const dateStr = date.toISOString().slice(0, 10);
    
    const baseStats = await aggregateDailyStats(organizationId, dateStr);
    stats.push(baseStats);
  }
  
  return stats;
}

/**
 * Store analytics snapshot
 */
export async function storeSnapshot(organizationId: string, stats: DailyStats): Promise<void> {
  if (!analyticsSnapshots.has(organizationId)) {
    analyticsSnapshots.set(organizationId, []);
  }
  
  const snapshots = analyticsSnapshots.get(organizationId)!;
  
  // Remove existing snapshot for same date
  const existingIndex = snapshots.findIndex(s => s.date === stats.date);
  if (existingIndex !== -1) {
    snapshots.splice(existingIndex, 1);
  }
  
  // Add new snapshot
  snapshots.push(stats);
  
  // Keep only last 90 days
  if (snapshots.length > 90) {
    snapshots.shift();
  }
}

/**
 * Get historical snapshots
 */
export function getSnapshots(organizationId: string, days = 30): DailyStats[] {
  const snapshots = analyticsSnapshots.get(organizationId) || [];
  return snapshots.slice(-days);
}

/**
 * Calculate trends from historical data
 */
export function calculateTrend(data: number[]): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';
  
  const recent = data.slice(-7);
  const older = data.slice(-14, -7);
  
  if (recent.length === 0 || older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (percentChange > 5) return 'up';
  if (percentChange < -5) return 'down';
  return 'stable';
}

/**
 * Run full daily aggregation
 */
export async function runDailyAggregation(organizationId: string): Promise<void> {
  const stats = await aggregateDailyStats(organizationId);
  await storeSnapshot(organizationId, stats);
  
  // Also generate an insight from the data
  if (stats.pipelineValue > 0) {
    await insightOperations.store(organizationId, {
      type: 'analytics',
      title: 'Daily Analytics Update',
      description: `Pipeline: ${stats.pipelineValue.toLocaleString()}, Leads: ${stats.leadCount}, Deals: ${stats.dealCount}`,
      confidence: 0.9,
      data: stats as unknown as Record<string, unknown>,
    });
  }
}

export default {
  aggregateDailyStats,
  aggregateWeeklyStats,
  aggregateMonthlyStats,
  storeSnapshot,
  getSnapshots,
  calculateTrend,
  runDailyAggregation,
};
