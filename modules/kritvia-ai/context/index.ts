/**
 * AI Context Builder
 * 
 * Prepares context for AI queries from various data sources.
 */

import { randomUUID } from 'crypto';

// Context Types
export interface BusinessContext {
  organizationId: string;
  userId: string;
  timestamp: number;
  dataSources: string[];
  sales?: SalesContext;
  marketing?: MarketingContext;
  operations?: OperationsContext;
  customers?: CustomerContext;
  analytics?: AnalyticsContext;
  memory?: AIMemoryContext;
}

export interface SalesContext {
  pipeline: {
    totalValue: number;
    weightedValue: number;
    dealCount: number;
    avgProbability: number;
  };
  deals: Array<{
    id: string;
    name: string;
    value: number;
    probability: number;
    stage: string;
    owner: string;
    closeDate: string;
  }>;
  recentInsights: string[];
}

export interface MarketingContext {
  campaigns: Array<{
    id: string;
    name: string;
    channel: string;
    status: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    roi: number;
  }>;
  metrics: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgCTR: number;
    avgROI: number;
  };
}

export interface OperationsContext {
  tasks: Array<{
    id: string;
    name: string;
    status: string;
    priority: string;
    assignee: string;
    dueDate: string;
  }>;
  metrics: {
    activeTasks: number;
    completedThisWeek: number;
    overdueTasks: number;
    avgCompletionTime: number;
  };
}

export interface CustomerContext {
  segments: Array<{
    id: string;
    name: string;
    count: number;
    revenue: number;
    growth: number;
    churnRisk: string;
  }>;
  metrics: {
    totalCustomers: number;
    totalRevenue: number;
    avgGrowth: number;
    churnRate: number;
  };
}

export interface AnalyticsContext {
  revenue: {
    ytd: number;
    target: number;
    forecast: number;
    growth: number;
  };
  metrics: {
    conversionRate: number;
    avgDealSize: number;
    salesCycle: number;
  };
}

export interface AIMemoryContext {
  recentConversations: Array<{
    id: string;
    query: string;
    timestamp: number;
  }>;
  importantInsights: string[];
  pastRecommendations: string[];
}

// Context Builder Class
export class AIContextBuilder {
  private organizationId: string;
  private userId: string;
  
  constructor(organizationId: string, userId: string) {
    this.organizationId = organizationId;
    this.userId = userId;
  }
  
  async buildBusinessContext(): Promise<BusinessContext> {
    const context: BusinessContext = {
      organizationId: this.organizationId,
      userId: this.userId,
      timestamp: Date.now(),
      dataSources: [],
    };
    
    // Fetch and add sales context
    try {
      context.sales = await this.buildSalesContext();
      context.dataSources.push('crm-deals');
    } catch (error) {
      console.error('Failed to build sales context:', error);
    }
    
    // Fetch and add marketing context
    try {
      context.marketing = await this.buildMarketingContext();
      context.dataSources.push('marketing-campaigns');
    } catch (error) {
      console.error('Failed to build marketing context:', error);
    }
    
    // Fetch and add operations context
    try {
      context.operations = await this.buildOperationsContext();
      context.dataSources.push('operations-tasks');
    } catch (error) {
      console.error('Failed to build operations context:', error);
    }
    
    // Fetch and add customer context
    try {
      context.customers = await this.buildCustomerContext();
      context.dataSources.push('customer-segments');
    } catch (error) {
      console.error('Failed to build customer context:', error);
    }
    
    // Fetch and add analytics context
    try {
      context.analytics = await this.buildAnalyticsContext();
      context.dataSources.push('analytics');
    } catch (error) {
      console.error('Failed to build analytics context:', error);
    }
    
    // Fetch and add memory context
    try {
      context.memory = await this.buildMemoryContext();
      context.dataSources.push('ai-memory');
    } catch (error) {
      console.error('Failed to build memory context:', error);
    }
    
    return context;
  }
  
  async buildSalesContext(): Promise<SalesContext> {
    // Fetch from CRM API - use absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/crm/deals?organizationId=${this.organizationId}&limit=50`);
    const data = await response.json();
    
    if (!data.success) {
      return this.getDefaultSalesContext();
    }
    
    const deals = data.data?.deals || [];
    const totalValue = deals.reduce((sum: number, d: { value: number }) => sum + d.value, 0);
    const weightedValue = deals.reduce((sum: number, d: { value: number; probability: number }) => 
      sum + (d.value * d.probability / 100), 0);
    const avgProbability = deals.length > 0 
      ? deals.reduce((sum: number, d: { probability: number }) => sum + d.probability, 0) / deals.length 
      : 0;
    
    return {
      pipeline: {
        totalValue,
        weightedValue,
        dealCount: deals.length,
        avgProbability: Math.round(avgProbability),
      },
      deals: deals.slice(0, 20).map((d: { id: string; name: string; value: number; probability: number; stage: string; owner: string; closeDate: string }) => ({
        id: d.id,
        name: d.name,
        value: d.value,
        probability: d.probability,
        stage: d.stage,
        owner: d.owner,
        closeDate: d.closeDate,
      })),
      recentInsights: this.generateSalesInsights(deals),
    };
  }
  
  private getDefaultSalesContext(): SalesContext {
    return {
      pipeline: { totalValue: 0, weightedValue: 0, dealCount: 0, avgProbability: 0 },
      deals: [],
      recentInsights: [],
    };
  }
  
  private generateSalesInsights(deals: Array<{ value: number; probability: number; stage: string }>): string[] {
    const insights: string[] = [];
    
    // High value deals
    const highValueDeals = deals.filter(d => d.value >= 50000 && d.probability >= 50);
    if (highValueDeals.length > 0) {
      insights.push(`${highValueDeals.length} high-value deals with >50% probability`);
    }
    
    // At risk deals
    const atRiskDeals = deals.filter(d => d.stage === 'negotiation' && d.probability < 40);
    if (atRiskDeals.length > 0) {
      insights.push(`${atRiskDeals.length} deals at risk in negotiation stage`);
    }
    
    return insights;
  }
  
  async buildMarketingContext(): Promise<MarketingContext> {
    // For now, return demo data structure
    // In production, this would fetch from marketing API
    return {
      campaigns: [],
      metrics: {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        avgCTR: 0,
        avgROI: 0,
      },
    };
  }
  
  async buildOperationsContext(): Promise<OperationsContext> {
    return {
      tasks: [],
      metrics: {
        activeTasks: 0,
        completedThisWeek: 0,
        overdueTasks: 0,
        avgCompletionTime: 0,
      },
    };
  }
  
  async buildCustomerContext(): Promise<CustomerContext> {
    return {
      segments: [],
      metrics: {
        totalCustomers: 0,
        totalRevenue: 0,
        avgGrowth: 0,
        churnRate: 0,
      },
    };
  }
  
  async buildAnalyticsContext(): Promise<AnalyticsContext> {
    // Fetch from analytics API - use absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`/api/analytics/dashboard?organizationId=${this.organizationId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const summary = data.data.summary || {};
        return {
          revenue: {
            ytd: summary.revenue || 0,
            target: 1000000, // Would come from targets
            forecast: summary.revenue ? summary.revenue * 2.2 : 0, // Rough estimate
            growth: parseFloat(summary.revenueChange?.replace('%', '') || '0'),
          },
          metrics: {
            conversionRate: summary.conversion || 0,
            avgDealSize: 0,
            salesCycle: 0,
          },
        };
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
    
    return {
      revenue: { ytd: 0, target: 0, forecast: 0, growth: 0 },
      metrics: { conversionRate: 0, avgDealSize: 0, salesCycle: 0 },
    };
  }
  
  async buildMemoryContext(): Promise<AIMemoryContext> {
    // Fetch from memory system
    // For now, return empty structure
    return {
      recentConversations: [],
      importantInsights: [],
      pastRecommendations: [],
    };
  }
  
  // Specialized context builders for specific query types
  async buildSalesQueryContext(query: string): Promise<Record<string, unknown>> {
    const salesContext = await this.buildSalesContext();
    const analyticsContext = await this.buildAnalyticsContext();
    
    return {
      query,
      deals: salesContext.deals,
      metrics: salesContext.pipeline,
      insights: salesContext.recentInsights,
      revenue: analyticsContext.revenue,
    };
  }
  
  async buildMarketingQueryContext(query: string): Promise<Record<string, unknown>> {
    const marketingContext = await this.buildMarketingContext();
    const analyticsContext = await this.buildAnalyticsContext();
    
    return {
      query,
      campaigns: marketingContext.campaigns,
      metrics: marketingContext.metrics,
      revenue: analyticsContext.revenue,
    };
  }
  
  async buildOperationsQueryContext(query: string): Promise<Record<string, unknown>> {
    const operationsContext = await this.buildOperationsContext();
    
    return {
      query,
      tasks: operationsContext.tasks,
      metrics: operationsContext.metrics,
    };
  }
  
  async buildForecastQueryContext(query: string): Promise<Record<string, unknown>> {
    const salesContext = await this.buildSalesContext();
    const analyticsContext = await this.buildAnalyticsContext();
    
    return {
      query,
      historicalData: analyticsContext.revenue,
      pipeline: salesContext.pipeline,
      targets: { revenue: analyticsContext.revenue.target, growth: 20 },
    };
  }
}

// Factory function
export function createContextBuilder(organizationId: string, userId: string): AIContextBuilder {
  return new AIContextBuilder(organizationId, userId);
}

// Auto-detect query type and build appropriate context
export async function autoBuildContext(
  organizationId: string,
  userId: string,
  query: string
): Promise<{ promptName: string; context: Record<string, unknown> }> {
  const builder = createContextBuilder(organizationId, userId);
  const queryLower = query.toLowerCase();
  
  // Detect query type
  if (queryLower.includes('deal') || queryLower.includes('sales') || queryLower.includes('pipeline')) {
    return {
      promptName: 'sales-analysis',
      context: await builder.buildSalesQueryContext(query),
    };
  }
  
  if (queryLower.includes('marketing') || queryLower.includes('campaign') || queryLower.includes('conversion')) {
    return {
      promptName: 'marketing-analysis',
      context: await builder.buildMarketingQueryContext(query),
    };
  }
  
  if (queryLower.includes('operation') || queryLower.includes('task') || queryLower.includes('workflow')) {
    return {
      promptName: 'operations-analysis',
      context: await builder.buildOperationsQueryContext(query),
    };
  }
  
  if (queryLower.includes('forecast') || queryLower.includes('revenue') || queryLower.includes('predict')) {
    return {
      promptName: 'forecast-analysis',
      context: await builder.buildForecastQueryContext(query),
    };
  }
  
  // Default to general context
  return {
    promptName: 'general-chat',
    context: {
      query,
      additionalContext: await builder.buildBusinessContext(),
    },
  };
}
