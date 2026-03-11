/**
 * AI Insight Generator
 * 
 * Automatically generates business insights from data.
 */

import { getLeads, getDeals, getTasks } from '../../integrations/crm';
import { insightOperations } from '../../../core/database';
import { calculateAllMetrics } from '../metrics';
import { getSnapshots, calculateTrend } from '../data-aggregator';
import { revenueForecast, dealCloseProbability, leadConversionPrediction } from '../forecasting';

export interface GeneratedInsight {
  type: string;
  category: 'sales' | 'marketing' | 'operations' | 'strategy';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
}

/**
 * Generate sales insights
 */
export async function generateSalesInsights(organizationId: string): Promise<GeneratedInsight[]> {
  const insights: GeneratedInsight[] = [];
  
  try {
    const [metrics, deals, forecasts] = await Promise.all([
      calculateAllMetrics(organizationId),
      getDeals(organizationId),
      revenueForecast(organizationId),
    ]);
    
    const revenueMetric = metrics.metrics.find(m => m.metric === 'revenue');
    const pipelineMetric = metrics.metrics.find(m => m.metric === 'pipeline_value');
    
    // Pipeline trend insight
    if (pipelineMetric && pipelineMetric.trend === 'up') {
      insights.push({
        type: 'pipeline_growth',
        category: 'sales',
        title: 'Pipeline Growing Strong',
        description: `Your pipeline value increased ${pipelineMetric.change} this period, reaching $${pipelineMetric.value.toLocaleString()}.`,
        priority: 'high',
        confidence: 0.85,
      });
    } else if (pipelineMetric && pipelineMetric.trend === 'down') {
      insights.push({
        type: 'pipeline_decline',
        category: 'sales',
        title: 'Pipeline Needs Attention',
        description: `Pipeline value decreased ${pipelineMetric.change}. Consider increasing prospecting efforts.`,
        priority: 'high',
        confidence: 0.8,
      });
    }
    
    // Top opportunity insight
    const topDeals = deals
      .filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
      .sort((a, b) => (b.value || 0) - (a.value || 0))
      .slice(0, 3);
    
    if (topDeals.length > 0 && topDeals[0].value) {
      insights.push({
        type: 'top_opportunity',
        category: 'sales',
        title: 'Top Opportunity Detected',
        description: `Your highest value opportunity is "${topDeals[0].name}" worth $${topDeals[0].value.toLocaleString()}.`,
        priority: 'medium',
        confidence: 0.9,
      });
    }
    
    // Revenue forecast insight
    if (forecasts.length > 0) {
      const nextMonth = forecasts[0];
      insights.push({
        type: 'revenue_forecast',
        category: 'sales',
        title: 'Revenue Forecast',
        description: `Projected revenue for ${nextMonth.period}: $${nextMonth.predicted.toLocaleString()} (${Math.round(nextMonth.confidence * 100)}% confidence).`,
        priority: 'medium',
        confidence: nextMonth.confidence,
      });
    }
    
    // Deal velocity insight
    const conversionMetric = metrics.metrics.find(m => m.metric === 'conversion_rate');
    if (conversionMetric) {
      if (conversionMetric.trend === 'up') {
        insights.push({
          type: 'improving_conversion',
          category: 'sales',
          title: 'Conversion Rate Improving',
          description: `Your conversion rate improved ${conversionMetric.change}, indicating better qualification.`,
          priority: 'medium',
          confidence: 0.75,
        });
      }
    }
    
  } catch (error) {
    console.error('Error generating sales insights:', error);
  }
  
  return insights;
}

/**
 * Generate marketing insights
 */
export async function generateMarketingInsights(organizationId: string): Promise<GeneratedInsight[]> {
  const insights: GeneratedInsight[] = [];
  
  try {
    const [leads, metrics] = await Promise.all([
      getLeads(organizationId),
      calculateAllMetrics(organizationId),
    ]);
    
    const leadMetric = metrics.metrics.find(m => m.metric === 'total_leads');
    const qualifiedMetric = metrics.metrics.find(m => m.metric === 'qualified_leads');
    
    // Lead volume insight
    if (leadMetric && leadMetric.trend === 'up') {
      insights.push({
        type: 'lead_volume_growth',
        category: 'marketing',
        title: 'Lead Volume Increasing',
        description: `Generated ${leadMetric.change} more leads this period (${leadMetric.value} total).`,
        priority: 'medium',
        confidence: 0.8,
      });
    }
    
    // Lead quality insight
    if (leadMetric && qualifiedMetric) {
      const qualificationRate = qualifiedMetric.value / leadMetric.value;
      if (qualificationRate > 0.5) {
        insights.push({
          type: 'high_qualification',
          category: 'marketing',
          title: 'Strong Lead Quality',
          description: `${Math.round(qualificationRate * 100)}% of leads are qualified - above average.`,
          priority: 'high',
          confidence: 0.85,
        });
      } else if (qualificationRate < 0.2) {
        insights.push({
          type: 'low_qualification',
          category: 'marketing',
          title: 'Lead Quality Needs Improvement',
          description: `Only ${Math.round(qualificationRate * 100)}% of leads are qualified. Review targeting criteria.`,
          priority: 'high',
          confidence: 0.8,
        });
      }
    }
    
    // Lead source insight
    const leadsBySource = leads.reduce((acc, lead) => {
      const source = lead.stage || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topSource = Object.entries(leadsBySource)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (topSource) {
      insights.push({
        type: 'top_lead_source',
        category: 'marketing',
        title: 'Top Lead Source',
        description: `Most leads (${topSource[1]}) are in "${topSource[0]}" stage.`,
        priority: 'low',
        confidence: 0.7,
      });
    }
    
  } catch (error) {
    console.error('Error generating marketing insights:', error);
  }
  
  return insights;
}

/**
 * Generate operations insights
 */
export async function generateOperationsInsights(organizationId: string): Promise<GeneratedInsight[]> {
  const insights: GeneratedInsight[] = [];
  
  try {
    const [tasks, metrics] = await Promise.all([
      getTasks(organizationId),
      calculateAllMetrics(organizationId),
    ]);
    
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    
    // Task backlog insight
    if (pendingTasks.length > 10) {
      insights.push({
        type: 'task_backlog',
        category: 'operations',
        title: 'Task Backlog Building',
        description: `You have ${pendingTasks.length} pending tasks. Consider delegating or prioritizing.`,
        priority: 'medium',
        confidence: 0.85,
      });
    }
    
    // Workload balance insight
    if (inProgressTasks.length > 5) {
      insights.push({
        type: 'high_workload',
        category: 'operations',
        title: 'Active Workload High',
        description: `${inProgressTasks.length} tasks are in progress. Monitor for bottlenecks.`,
        priority: 'low',
        confidence: 0.75,
      });
    }
    
    // Completed tasks insight
    const completedMetric = metrics.metrics.find(m => m.metric === 'completed_tasks');
    if (completedMetric && completedMetric.trend === 'up') {
      insights.push({
        type: 'productivity_up',
        category: 'operations',
        title: 'Team Productivity Up',
        description: `Task completion increased ${completedMetric.change} this period.`,
        priority: 'low',
        confidence: 0.8,
      });
    }
    
  } catch (error) {
    console.error('Error generating operations insights:', error);
  }
  
  return insights;
}

/**
 * Generate all insights and store in database
 */
export async function generateAndStoreInsights(organizationId: string): Promise<GeneratedInsight[]> {
  const allInsights: GeneratedInsight[] = [];
  
  const [sales, marketing, operations] = await Promise.all([
    generateSalesInsights(organizationId),
    generateMarketingInsights(organizationId),
    generateOperationsInsights(organizationId),
  ]);
  
  allInsights.push(...sales, ...marketing, ...operations);
  
  // Store insights in database
  for (const insight of allInsights) {
    await insightOperations.store(organizationId, {
      type: insight.type,
      title: insight.title,
      description: insight.description,
      confidence: insight.confidence,
      data: { category: insight.category, priority: insight.priority },
    });
  }
  
  return allInsights;
}

export default {
  generateSalesInsights,
  generateMarketingInsights,
  generateOperationsInsights,
  generateAndStoreInsights,
};
