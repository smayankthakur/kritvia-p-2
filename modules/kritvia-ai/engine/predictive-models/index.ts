/**
 * Predictive Business Analytics
 * 
 * ML models for business predictions.
 */

// Mock predictive models (replace with real ML models in production)

export interface RevenueForecast {
  period: string;
  predicted: number;
  confidence: number;
  factors: string[];
}

export interface ConversionPrediction {
  leadId: string;
  probability: number;
  factors: string[];
  recommendation: string;
}

export interface ChurnRisk {
  customerId: string;
  riskLevel: 'high' | 'medium' | 'low';
  probability: number;
  indicators: string[];
}

export interface MarketingROI {
  campaignId: string;
  predictedROI: number;
  confidence: number;
  recommendations: string[];
}

/**
 * Predict revenue for upcoming periods
 */
export async function predictRevenue(
  periods: number = 12,
  historicalData?: Record<string, unknown>[]
): Promise<RevenueForecast[]> {
  // Simulate prediction (replace with real model)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const forecasts: RevenueForecast[] = [];
  let baseRevenue = 100000;
  
  for (let i = 1; i <= periods; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() + i);
    
    // Simple growth model
    const growth = 1 + (Math.random() * 0.1 - 0.02); // 8% avg growth
    baseRevenue = baseRevenue * growth;
    
    forecasts.push({
      period: month.toISOString().slice(0, 7),
      predicted: Math.round(baseRevenue),
      confidence: 0.7 - (i * 0.02), // Confidence decreases over time
      factors: ['Historical growth', 'Seasonal adjustments', 'Market trends'],
    });
  }
  
  return forecasts;
}

/**
 * Predict lead conversion probability
 */
export async function predictConversion(
  leadData: Record<string, unknown>
): Promise<ConversionPrediction> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Calculate based on features
  let score = 0.5;
  const factors: string[] = [];
  
  if (leadData.email) {
    score += 0.1;
    factors.push('Has email');
  }
  if (leadData.company) {
    score += 0.15;
    factors.push('Has company');
  }
  if (leadData.phone) {
    score += 0.1;
    factors.push('Has phone');
  }
  if (leadData.budget) {
    score += 0.15;
    factors.push('Has budget');
  }
  
  const probability = Math.min(0.95, Math.max(0.1, score));
  
  let recommendation = 'Add to nurture campaign';
  if (probability > 0.7) {
    recommendation = 'Priority follow-up recommended';
  } else if (probability > 0.5) {
    recommendation = 'Standard follow-up';
  }
  
  return {
    leadId: String(leadData.id || 'unknown'),
    probability,
    factors,
    recommendation,
  };
}

/**
 * Detect churn risk
 */
export async function detectChurnRisk(
  customerData: Record<string, unknown>
): Promise<ChurnRisk> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Calculate risk factors
  let riskScore = 0.2; // Base risk
  
  const indicators: string[] = [];
  
  if (customerData.lastActivityDays && Number(customerData.lastActivityDays) > 30) {
    riskScore += 0.3;
    indicators.push('No activity in 30+ days');
  }
  
  if (customerData.supportTickets && Number(customerData.supportTickets) > 5) {
    riskScore += 0.2;
    indicators.push('High support ticket volume');
  }
  
  if (customerData.paymentIssues) {
    riskScore += 0.25;
    indicators.push('Payment issues detected');
  }
  
  const probability = Math.min(0.95, riskScore);
  
  let riskLevel: 'high' | 'medium' | 'low' = 'low';
  if (probability > 0.6) riskLevel = 'high';
  else if (probability > 0.3) riskLevel = 'medium';
  
  return {
    customerId: String(customerData.id || 'unknown'),
    riskLevel,
    probability,
    indicators,
  };
}

/**
 * Predict marketing ROI
 */
export async function predictMarketingROI(
  campaignData: Record<string, unknown>
): Promise<MarketingROI> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const baseROI = 2.5; // 250% base ROI
  const variance = Math.random() * 1 - 0.5;
  
  const predictedROI = baseROI + variance;
  
  return {
    campaignId: String(campaignData.id || 'unknown'),
    predictedROI,
    confidence: 0.65,
    recommendations: [
      'Focus budget on top-performing channels',
      'A/B test creative variations',
      'Optimize targeting parameters',
    ],
  };
}

/**
 * Analyze pipeline health
 */
export async function analyzePipelineHealth(
  deals: Record<string, unknown>[]
): Promise<{
  health: 'healthy' | 'warning' | 'critical';
  score: number;
  issues: string[];
  recommendations: string[];
}> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const issues: string[] = [];
  let score = 70;
  
  if (!deals || deals.length === 0) {
    issues.push('No deals in pipeline');
    score = 30;
  }
  
  const avgProbability = deals.reduce((sum, d) => sum + (Number(d.probability) || 0), 0) / (deals.length || 1);
  
  if (avgProbability < 30) {
    issues.push('Low average deal probability');
    score -= 20;
  }
  
  const stagedDeals: Record<string, number> = {};
  deals.forEach(d => {
    const stage = String(d.stage || 'unknown');
    stagedDeals[stage] = (stagedDeals[stage] || 0) + 1;
  });
  
  if (!stagedDeals['closed-won']) {
    issues.push('No closed-won deals');
    score -= 10;
  }
  
  let health: 'healthy' | 'warning' | 'critical' = 'healthy';
  if (score < 40) health = 'critical';
  else if (score < 60) health = 'warning';
  
  const recommendations = [];
  if (health !== 'healthy') recommendations.push('Review deal stages and probabilities');
  if (avgProbability < 40) recommendations.push('Focus on qualified opportunities');
  
  return { health, score, issues, recommendations };
}

export default {
  predictRevenue,
  predictConversion,
  detectChurnRisk,
  predictMarketingROI,
  analyzePipelineHealth,
};
