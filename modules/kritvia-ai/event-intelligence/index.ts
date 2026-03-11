/**
 * AI Event Intelligence Engine
 * 
 * Analyze incoming events using AI to detect anomalies and opportunities.
 */

import { randomUUID } from 'crypto';
import { AIEvent, EventType } from '../event-stream';

// Insight Types
export type InsightType = 'anomaly' | 'opportunity' | 'warning' | 'info';
export type InsightSeverity = 'critical' | 'high' | 'medium' | 'low';

// AI Insight
export interface AIInsight {
  id: string;
  organizationId: string;
  eventId: string;
  insightType: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  confidenceScore: number;
  recommendedActions: string[];
  metadata: Record<string, unknown>;
  createdAt: number;
  acknowledged: boolean;
}

// Anomaly Detection Rules
interface AnomalyRule {
  eventType: EventType;
  condition: (event: AIEvent, context: EventContext) => boolean;
  severity: InsightSeverity;
  title: string;
  description: string;
}

interface EventContext {
  recentEvents: AIEvent[];
  baseline?: Record<string, number>;
}

// Store insights
const insightsStore: Map<string, AIInsight[]> = new Map();

// Event Intelligence Engine
export class EventIntelligenceEngine {
  /**
   * Analyze an event and generate insights
   */
  async analyzeEvent(event: AIEvent): Promise<AIInsight | null> {
    // Check anomaly rules
    const anomalyResult = this.detectAnomaly(event);
    if (anomalyResult) {
      return this.createInsight(event, anomalyResult);
    }

    // Check for opportunities
    const opportunityResult = this.detectOpportunity(event);
    if (opportunityResult) {
      return this.createInsight(event, opportunityResult);
    }

    return null;
  }

  /**
   * Detect anomalies in events
   */
  detectAnomaly(event: AIEvent): {
    type: InsightType;
    severity: InsightSeverity;
    title: string;
    description: string;
    actions: string[];
  } | null {
    // Pipeline value dropped significantly
    if (event.eventType === 'pipeline_value_changed') {
      const newValue = event.metadata.newValue as number;
      const oldValue = event.metadata.oldValue as number;
      if (newValue && oldValue) {
        const dropPercent = ((oldValue - newValue) / oldValue) * 100;
        if (dropPercent > 20) {
          return {
            type: 'anomaly',
            severity: 'critical',
            title: 'Significant Pipeline Drop Detected',
            description: `Pipeline value dropped by ${dropPercent.toFixed(1)}% ($${oldValue.toLocaleString()} → $${newValue.toLocaleString()})`,
            actions: [
              'Review recent deal losses',
              'Analyze deals moved to lost stage',
              'Check for data issues',
              'Alert sales leadership',
            ],
          };
        } else if (dropPercent > 10) {
          return {
            type: 'warning',
            severity: 'high',
            title: 'Pipeline Value Decreased',
            description: `Pipeline dropped by ${dropPercent.toFixed(1)}% this period`,
            actions: [
              'Review deal progression',
              'Identify stalled deals',
            ],
          };
        }
      }
    }

    // Deal stuck in stage too long
    if (event.eventType === 'deal_stage_changed') {
      const daysInStage = event.metadata.daysInStage as number;
      const stage = event.metadata.stage as string;
      if (daysInStage && daysInStage > 30 && (stage === 'Negotiation' || stage === 'Proposal')) {
        return {
          type: 'warning',
          severity: 'medium',
          title: 'Deal Stagnating in Negotiation',
          description: `Deal has been in ${stage} stage for ${daysInStage} days`,
          actions: [
            'Schedule executive review',
            'Identify negotiation blockers',
            'Prepare escalation plan',
          ],
        };
      }
    }

    // Customer churn detected
    if (event.eventType === 'customer_churn_detected') {
      const customerName = event.metadata.customerName || 'Customer';
      const riskScore = event.metadata.riskScore as number;
      return {
        type: 'anomaly',
        severity: riskScore && riskScore > 80 ? 'critical' : 'high',
        title: 'Customer Churn Risk Detected',
        description: `${customerName} shows signs of churning (risk score: ${riskScore || 'N/A'})`,
        actions: [
          'Trigger customer success outreach',
          'Schedule retention call',
          'Review recent support tickets',
          'Offer retention incentive',
        ],
      };
    }

    // Deal closed lost
    if (event.eventType === 'deal_lost') {
      const dealValue = event.metadata.value as number;
      const reason = event.metadata.reason as string;
      if (dealValue && dealValue > 50000) {
        return {
          type: 'warning',
          severity: dealValue > 100000 ? 'high' : 'medium',
          title: 'Large Deal Lost',
          description: `$${dealValue.toLocaleString()} deal lost${reason ? `: ${reason}` : ''}`,
          actions: [
            'Analyze loss reasons',
            'Update competitive intelligence',
            'Review pricing strategy',
          ],
        };
      }
    }

    return null;
  }

  /**
   * Detect opportunities in events
   */
  detectOpportunity(event: AIEvent): {
    type: InsightType;
    severity: InsightSeverity;
    title: string;
    description: string;
    actions: string[];
  } | null {
    // Large deal created
    if (event.eventType === 'deal_created') {
      const dealValue = event.metadata.value as number;
      if (dealValue && dealValue > 100000) {
        return {
          type: 'opportunity',
          severity: 'high',
          title: 'Enterprise Deal Created',
          description: `New $${dealValue.toLocaleString()} deal requires attention`,
          actions: [
            'Assign experienced rep',
            'Schedule discovery call',
            'Prepare custom proposal',
          ],
        };
      }
    }

    // Campaign launched
    if (event.eventType === 'campaign_launched') {
      const campaignName = event.metadata.name as string;
      const budget = event.metadata.budget as number;
      return {
        type: 'info',
        severity: 'low',
        title: 'Campaign Launched',
        description: `${campaignName || 'New campaign'} is now live${budget ? ` with $${budget.toLocaleString()} budget` : ''}`,
        actions: [
          'Monitor initial performance',
          'Track engagement metrics',
        ],
      };
    }

    // Deal moved to negotiation
    if (event.eventType === 'deal_stage_changed') {
      const newStage = event.metadata.stage as string;
      const dealValue = event.metadata.value as number;
      if (newStage === 'Negotiation' && dealValue && dealValue > 50000) {
        return {
          type: 'opportunity',
          severity: 'medium',
          title: 'Deal Entered Negotiation',
          description: `$${dealValue.toLocaleString()} deal moved to negotiation stage`,
          actions: [
            'Prepare contract',
            'Coordinate with legal',
            'Schedule close planning',
          ],
        };
      }
    }

    // Customer upgrade
    if (event.eventType === 'customer_upgrade') {
      const customerName = event.metadata.customerName || 'Customer';
      const newTier = event.metadata.newTier as string;
      return {
        type: 'opportunity',
        severity: 'medium',
        title: 'Customer Upgrade',
        description: `${customerName} upgraded to ${newTier || 'higher tier'}`,
        actions: [
          'Celebrate with customer',
          'Review expansion opportunities',
          'Update success plan',
        ],
      };
    }

    // Revenue target updated positively
    if (event.eventType === 'revenue_target_updated') {
      const newTarget = event.metadata.newTarget as number;
      const change = event.metadata.change as number;
      if (change && change > 0) {
        return {
          type: 'info',
          severity: 'low',
          title: 'Revenue Target Increased',
          description: `Annual target raised by ${change}% to $${newTarget?.toLocaleString() || 'N/A'}`,
          actions: [
            'Update sales quotas',
            'Plan hiring if needed',
          ],
        };
      }
    }

    return null;
  }

  /**
   * Trigger insight generation for an organization
   */
  async triggerInsightGeneration(organizationId: string): Promise<AIInsight[]> {
    // This could call AI model to generate more comprehensive insights
    const insights: AIInsight[] = [];
    
    // Get recent events for context
    const { eventProcessor } = await import('../event-stream');
    const recentEvents = await eventProcessor.getByOrganization(organizationId, 20);
    
    // Generate summary insights
    if (recentEvents.length > 0) {
      const dealEvents = recentEvents.filter(e => e.eventType.startsWith('deal_'));
      const customerEvents = recentEvents.filter(e => e.eventType.startsWith('customer_'));
      
      if (dealEvents.length > 5) {
        insights.push({
          id: randomUUID(),
          organizationId,
          eventId: 'summary',
          insightType: 'info',
          severity: 'low',
          title: 'High Deal Activity',
          description: `${dealEvents.length} deal events in recent activity`,
          confidenceScore: 0.9,
          recommendedActions: ['Review pipeline health'],
          metadata: { eventCount: dealEvents.length },
          createdAt: Date.now(),
          acknowledged: false,
        });
      }
      
      if (customerEvents.length > 3) {
        insights.push({
          id: randomUUID(),
          organizationId,
          eventId: 'summary',
          insightType: 'opportunity',
          severity: 'medium',
          title: 'Customer Activity Spike',
          description: `${customerEvents.length} customer events detected`,
          confidenceScore: 0.85,
          recommendedActions: ['Review customer success metrics'],
          metadata: { eventCount: customerEvents.length },
          createdAt: Date.now(),
          acknowledged: false,
        });
      }
    }
    
    // Store insights
    this.storeInsights(organizationId, insights);
    
    return insights;
  }

  /**
   * Get insights for organization
   */
  async getInsights(organizationId: string, limit: number = 20): Promise<AIInsight[]> {
    const insights = insightsStore.get(organizationId) || [];
    return insights.slice(-limit).reverse();
  }

  /**
   * Acknowledge insight
   */
  async acknowledgeInsight(insightId: string, organizationId: string): Promise<boolean> {
    const insights = insightsStore.get(organizationId) || [];
    const insight = insights.find(i => i.id === insightId);
    if (insight) {
      insight.acknowledged = true;
      return true;
    }
    return false;
  }

  /**
   * Clear insights
   */
  async clearInsights(organizationId?: string): Promise<void> {
    if (organizationId) {
      insightsStore.delete(organizationId);
    } else {
      insightsStore.clear();
    }
  }

  // Helper: Create insight
  private createInsight(
    event: AIEvent,
    result: {
      type: InsightType;
      severity: InsightSeverity;
      title: string;
      description: string;
      actions: string[];
    }
  ): AIInsight {
    const insight: AIInsight = {
      id: randomUUID(),
      organizationId: event.organizationId,
      eventId: event.id,
      insightType: result.type,
      severity: result.severity,
      title: result.title,
      description: result.description,
      confidenceScore: 0.8,
      recommendedActions: result.actions,
      metadata: event.metadata,
      createdAt: Date.now(),
      acknowledged: false,
    };

    // Store insight
    this.storeInsights(event.organizationId, [insight]);

    return insight;
  }

  // Helper: Store insights
  private storeInsights(organizationId: string, newInsights: AIInsight[]): void {
    const existing = insightsStore.get(organizationId) || [];
    const updated = [...existing, ...newInsights].slice(-100); // Keep last 100
    insightsStore.set(organizationId, updated);
  }
}

// Export singleton
export const eventIntelligence = new EventIntelligenceEngine();

// Convenience functions
export async function analyzeEvent(event: AIEvent): Promise<AIInsight | null> {
  return eventIntelligence.analyzeEvent(event);
}

export async function getOrganizationInsights(
  organizationId: string,
  limit?: number
): Promise<AIInsight[]> {
  return eventIntelligence.getInsights(organizationId, limit);
}
