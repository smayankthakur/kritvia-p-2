/**
 * Business Pattern Detection Engine
 * 
 * Detects recurring patterns across the organization.
 */

import { randomUUID } from 'crypto';

// Types
export interface AIPattern {
  id: string;
  organizationId: string;
  patternType: 'revenue' | 'sales' | 'customer' | 'marketing' | 'operations';
  title: string;
  description: string;
  confidenceScore: number;
  detectedAt: number;
  evidence: string[];
  trend?: 'increasing' | 'decreasing' | 'stable';
  impact?: 'positive' | 'negative' | 'neutral';
}

// In-memory storage
const patternsStore: Map<string, AIPattern[]> = new Map();

// Pattern Detection Engine
export class PatternDetectionEngine {
  /**
   * Detect revenue patterns
   */
  async detectRevenuePatterns(
    organizationId: string,
    revenueData: {
      monthly: Array<{ month: string; revenue: number }>;
      target: number;
    }
  ): Promise<AIPattern[]> {
    const patterns: AIPattern[] = [];
    const monthly = revenueData.monthly;
    
    if (monthly.length < 2) return patterns;
    
    // Calculate growth trend
    const revenues = monthly.map(m => m.revenue);
    const avgGrowth = this.calculateAverageGrowth(revenues);
    
    // Detect strong growth
    if (avgGrowth > 10) {
      patterns.push({
        id: randomUUID(),
        organizationId,
        patternType: 'revenue',
        title: 'Strong Revenue Growth',
        description: `Revenue growing at ${avgGrowth.toFixed(1)}% month-over-month`,
        confidenceScore: 0.85,
        detectedAt: Date.now(),
        evidence: [
          `Average growth: ${avgGrowth.toFixed(1)}%`,
          `Latest month: $${monthly[monthly.length - 1].revenue.toLocaleString()}`,
        ],
        trend: 'increasing',
        impact: 'positive',
      });
    }
    
    // Detect revenue shortfall
    const latestRevenue = revenues[revenues.length - 1];
    const targetProgress = (latestRevenue / revenueData.target) * 100;
    
    if (targetProgress < 80) {
      patterns.push({
        id: randomUUID(),
        organizationId,
        patternType: 'revenue',
        title: 'Revenue Target At Risk',
        description: `Current revenue at ${targetProgress.toFixed(0)}% of annual target`,
        confidenceScore: 0.78,
        detectedAt: Date.now(),
        evidence: [
          `Target progress: ${targetProgress.toFixed(0)}%`,
          `Latest revenue: $${latestRevenue.toLocaleString()}`,
          `Annual target: $${revenueData.target.toLocaleString()}`,
        ],
        trend: 'decreasing',
        impact: 'negative',
      });
    }
    
    // Detect seasonality (simple check)
    if (monthly.length >= 6) {
      const firstHalf = revenues.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
      const secondHalf = revenues.slice(3, 6).reduce((a, b) => a + b, 0) / 3;
      const variance = Math.abs((secondHalf - firstHalf) / firstHalf);
      
      if (variance < 0.1) {
        patterns.push({
          id: randomUUID(),
          organizationId,
          patternType: 'revenue',
          title: 'Stable Revenue Pattern',
          description: 'Revenue has been stable over the past 6 months',
          confidenceScore: 0.72,
          detectedAt: Date.now(),
          evidence: [
            `Variance: ${(variance * 100).toFixed(1)}%`,
            'Low fluctuation indicates predictable revenue',
          ],
          trend: 'stable',
          impact: 'neutral',
        });
      }
    }
    
    // Store patterns
    this.storePatterns(organizationId, patterns);
    
    return patterns;
  }

  /**
   * Detect sales patterns
   */
  async detectSalesPatterns(
    organizationId: string,
    dealsData: {
      deals: Array<{ value: number; probability: number; stage: string; closeDate: string }>;
    }
  ): Promise<AIPattern[]> {
    const patterns: AIPattern[] = [];
    const deals = dealsData.deals;
    
    if (deals.length === 0) return patterns;
    
    // Calculate average win rate by stage
    const stageWinRates: Record<string, number> = {
      lead: 10,
      qualified: 25,
      proposal: 50,
      negotiation: 75,
      closed_won: 100,
      closed_lost: 0,
    };
    
    const avgProbability = deals.reduce((sum, d) => sum + (d.probability || stageWinRates[d.stage] || 0), 0) / deals.length;
    
    // High average probability
    if (avgProbability > 60) {
      patterns.push({
        id: randomUUID(),
        organizationId,
        patternType: 'sales',
        title: 'Healthy Pipeline',
        description: `Average deal probability at ${avgProbability.toFixed(0)}%`,
        confidenceScore: 0.82,
        detectedAt: Date.now(),
        evidence: [
          `Avg probability: ${avgProbability.toFixed(0)}%`,
          `Total deals: ${deals.length}`,
        ],
        trend: 'increasing',
        impact: 'positive',
      });
    }
    
    // High value deals concentration
    const highValueDeals = deals.filter(d => d.value > 50000);
    if (highValueDeals.length > deals.length * 0.3) {
      patterns.push({
        id: randomUUID(),
        organizationId,
        patternType: 'sales',
        title: 'Enterprise Focus',
        description: `${highValueDeals.length} high-value deals (>$50K) in pipeline`,
        confidenceScore: 0.76,
        detectedAt: Date.now(),
        evidence: [
          `High-value deals: ${highValueDeals.length}`,
          `Percentage: ${((highValueDeals.length / deals.length) * 100).toFixed(0)}%`,
        ],
        trend: 'stable',
        impact: 'positive',
      });
    }
    
    // Deals stuck in negotiation
    const stuckDeals = deals.filter(d => d.stage === 'negotiation' && d.probability < 40);
    if (stuckDeals.length > 3) {
      patterns.push({
        id: randomUUID(),
        organizationId,
        patternType: 'sales',
        title: 'Negotiation Bottleneck',
        description: `${stuckDeals.length} deals stuck in negotiation with low probability`,
        confidenceScore: 0.71,
        detectedAt: Date.now(),
        evidence: [
          `Stuck deals: ${stuckDeals.length}`,
          'May require executive intervention',
        ],
        trend: 'decreasing',
        impact: 'negative',
      });
    }
    
    this.storePatterns(organizationId, patterns);
    
    return patterns;
  }

  /**
   * Detect customer patterns
   */
  async detectCustomerPatterns(
    organizationId: string,
    customerData: {
      segments: Array<{ name: string; count: number; churnRisk: string; revenue: number }>;
    }
  ): Promise<AIPattern[]> {
    const patterns: AIPattern[] = [];
    const segments = customerData.segments;
    
    if (segments.length === 0) return patterns;
    
    // High churn risk segment
    const highRiskSegments = segments.filter(s => s.churnRisk === 'high');
    if (highRiskSegments.length > 0) {
      patterns.push({
        id: randomUUID(),
        organizationId,
        patternType: 'customer',
        title: 'At-Risk Customer Segments',
        description: `${highRiskSegments.length} segments with high churn risk`,
        confidenceScore: 0.79,
        detectedAt: Date.now(),
        evidence: highRiskSegments.map(s => `${s.name}: ${s.count} customers`),
        trend: 'decreasing',
        impact: 'negative',
      });
    }
    
    // Revenue concentration
    const totalRevenue = segments.reduce((sum, s) => sum + s.revenue, 0);
    const enterpriseRevenue = segments
      .filter(s => s.name.toLowerCase().includes('enterprise'))
      .reduce((sum, s) => sum + s.revenue, 0);
    
    if (enterpriseRevenue > totalRevenue * 0.6) {
      patterns.push({
        id: randomUUID(),
        organizationId,
        patternType: 'customer',
        title: 'Enterprise Revenue Concentration',
        description: 'Enterprise segment drives majority of revenue',
        confidenceScore: 0.88,
        detectedAt: Date.now(),
        evidence: [
          `Enterprise revenue: $${enterpriseRevenue.toLocaleString()}`,
          `Percentage: ${((enterpriseRevenue / totalRevenue) * 100).toFixed(0)}%`,
        ],
        trend: 'stable',
        impact: 'neutral',
      });
    }
    
    this.storePatterns(organizationId, patterns);
    
    return patterns;
  }

  /**
   * Get all detected patterns
   */
  async getPatterns(organizationId: string): Promise<AIPattern[]> {
    return patternsStore.get(organizationId) || [];
  }

  /**
   * Get patterns by type
   */
  async getPatternsByType(
    organizationId: string,
    type: AIPattern['patternType']
  ): Promise<AIPattern[]> {
    const patterns = patternsStore.get(organizationId) || [];
    return patterns.filter(p => p.patternType === type);
  }

  /**
   * Clear patterns
   */
  async clearPatterns(organizationId: string): Promise<void> {
    patternsStore.delete(organizationId);
  }

  // Helper: Store patterns
  private storePatterns(organizationId: string, newPatterns: AIPattern[]): void {
    const existing = patternsStore.get(organizationId) || [];
    const updated = [...existing, ...newPatterns].slice(-20); // Keep last 20
    patternsStore.set(organizationId, updated);
  }

  // Helper: Calculate average growth
  private calculateAverageGrowth(values: number[]): number {
    if (values.length < 2) return 0;
    
    let totalGrowth = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > 0) {
        totalGrowth += ((values[i] - values[i - 1]) / values[i - 1]) * 100;
      }
    }
    
    return totalGrowth / (values.length - 1);
  }
}

// Export singleton
export const patternDetectionEngine = new PatternDetectionEngine();

// Convenience functions
export async function detectAllPatterns(
  organizationId: string,
  data: {
    revenue?: { monthly: Array<{ month: string; revenue: number }>; target: number };
    deals?: { deals: Array<{ value: number; probability: number; stage: string; closeDate: string }> };
    customers?: { segments: Array<{ name: string; count: number; churnRisk: string; revenue: number }> };
  }
): Promise<AIPattern[]> {
  const allPatterns: AIPattern[] = [];
  
  if (data.revenue) {
    const patterns = await patternDetectionEngine.detectRevenuePatterns(organizationId, data.revenue);
    allPatterns.push(...patterns);
  }
  
  if (data.deals) {
    const patterns = await patternDetectionEngine.detectSalesPatterns(organizationId, data.deals);
    allPatterns.push(...patterns);
  }
  
  if (data.customers) {
    const patterns = await patternDetectionEngine.detectCustomerPatterns(organizationId, data.customers);
    allPatterns.push(...patterns);
  }
  
  return allPatterns;
}
