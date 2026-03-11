/**
 * Forecasting Models
 * 
 * Predictive models for business forecasting.
 */

import { getDeals, getLeads } from '../../integrations/crm';
import { getSnapshots } from '../data-aggregator';

export interface Forecast {
  period: string;
  predicted: number;
  confidence: number;
  range: { low: number; high: number };
}

export interface DealProbability {
  dealId: string;
  probability: number;
  expectedValue: number;
  recommendation: string;
}

export interface LeadConversion {
  leadId: string;
  probability: number;
  score: number;
  recommendation: string;
}

export interface ChurnRisk {
  customerId: string;
  risk: 'high' | 'medium' | 'low';
  probability: number;
  factors: string[];
}

/**
 * Simple moving average calculation
 */
function movingAverage(data: number[], window: number): number {
  if (data.length < window) {
    return data.reduce((a, b) => a + b, 0) / data.length;
  }
  const recent = data.slice(-window);
  return recent.reduce((a, b) => a + b, 0) / window;
}

/**
 * Linear regression for trend
 */
function linearRegression(data: number[]): { slope: number; intercept: number } {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumXX += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

/**
 * Generate revenue forecast
 */
export async function revenueForecast(
  organizationId: string,
  periods: number = 3
): Promise<Forecast[]> {
  const snapshots = getSnapshots(organizationId, 30);
  const revenueData = snapshots.map(s => s.revenue);
  
  // Use moving average
  const avgRevenue = movingAverage(revenueData.length > 0 ? revenueData : [0], 7);
  
  // Calculate trend
  const { slope } = linearRegression(revenueData);
  
  const forecasts: Forecast[] = [];
  const today = new Date();
  
  for (let i = 1; i <= periods; i++) {
    const period = new Date(today);
    period.setMonth(period.getMonth() + i);
    
    const predicted = Math.max(0, avgRevenue + (slope * i * 7));
    const confidence = Math.max(0.5, 0.85 - (i * 0.1));
    
    forecasts.push({
      period: period.toISOString().slice(0, 7),
      predicted: Math.round(predicted),
      confidence,
      range: {
        low: Math.round(predicted * (confidence - 0.1)),
        high: Math.round(predicted * (confidence + 0.1)),
      },
    });
  }
  
  return forecasts;
}

/**
 * Calculate deal close probability
 */
export async function dealCloseProbability(organizationId: string): Promise<DealProbability[]> {
  const deals = await getDeals(organizationId);
  
  return deals
    .filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .map(deal => {
      let probability = deal.probability || 50;
      
      // Adjust based on stage
      switch (deal.stage) {
        case 'discovery':
          probability = Math.min(probability, 20);
          break;
        case 'qualification':
          probability = Math.min(probability, 35);
          break;
        case 'proposal':
          probability = Math.min(probability, 50);
          break;
        case 'negotiation':
          probability = Math.min(probability, 75);
          break;
      }
      
      const expectedValue = (deal.value || 0) * (probability / 100);
      
      let recommendation = 'Continue nurturing';
      if (probability > 60) {
        recommendation = 'Priority follow-up recommended';
      } else if (probability > 40) {
        recommendation = 'Schedule next step';
      }
      
      return {
        dealId: deal.id,
        probability,
        expectedValue,
        recommendation,
      };
    })
    .sort((a, b) => b.expectedValue - a.expectedValue);
}

/**
 * Predict lead conversion
 */
export async function leadConversionPrediction(organizationId: string): Promise<LeadConversion[]> {
  const leads = await getLeads(organizationId);
  
  return leads.map(lead => {
    let probability = lead.score / 100;
    
    // Adjust based on stage
    if (lead.stage === 'qualified') {
      probability = Math.min(probability + 0.2, 0.9);
    } else if (lead.stage === 'new') {
      probability = Math.max(probability - 0.1, 0.1);
    }
    
    let recommendation = 'Add to nurture campaign';
    if (probability > 0.7) {
      recommendation = 'Priority follow-up - high potential';
    } else if (probability > 0.4) {
      recommendation = 'Qualify further';
    }
    
    return {
      leadId: lead.id,
      probability,
      score: lead.score,
      recommendation,
    };
  }).sort((a, b) => b.probability - a.probability);
}

/**
 * Predict churn risk (simplified)
 */
export async function churnPrediction(organizationId: string): Promise<ChurnRisk[]> {
  const deals = await getDeals(organizationId);
  
  // Simplified churn prediction based on stale deals
  const staleDeals = deals.filter(d => {
    if (d.stage === 'closed_won' || d.stage === 'closed_lost') return false;
    const created = new Date(d.createdAt);
    const daysSince = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 45;
  });
  
  return staleDeals.map(deal => {
    const created = new Date(deal.createdAt);
    const daysSince = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    
    let risk: 'high' | 'medium' | 'low' = 'low';
    let probability = 0.1;
    
    if (daysSince > 60) {
      risk = 'high';
      probability = 0.7;
    } else if (daysSince > 45) {
      risk = 'medium';
      probability = 0.4;
    }
    
    return {
      customerId: deal.id,
      risk,
      probability,
      factors: [
        `Deal stagnant for ${Math.round(daysSince)} days`,
        `Current stage: ${deal.stage}`,
      ],
    };
  });
}

/**
 * Get all forecasts for dashboard
 */
export async function getAllForecasts(organizationId: string) {
  const [revenue, deals, leads, churn] = await Promise.all([
    revenueForecast(organizationId),
    dealCloseProbability(organizationId),
    leadConversionPrediction(organizationId),
    churnPrediction(organizationId),
  ]);
  
  return {
    revenue,
    deals,
    leads,
    churn,
  };
}

export default {
  revenueForecast,
  dealCloseProbability,
  leadConversionPrediction,
  churnPrediction,
  getAllForecasts,
};
