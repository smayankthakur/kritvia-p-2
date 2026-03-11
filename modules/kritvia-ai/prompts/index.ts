/**
 * Prompt Orchestration System
 * 
 * Manages structured prompts for AI reasoning across different business domains.
 */

import type { AIRequest } from '../ai-model';

// Prompt Types
export interface PromptTemplate {
  name: string;
  description: string;
  systemPrompt: string;
  buildUserPrompt: (context: Record<string, unknown>) => string;
}

// Sales Analysis Prompt
export const salesAnalysisPrompt: PromptTemplate = {
  name: 'sales-analysis',
  description: 'Analyzes sales pipeline, deals, and provides recommendations',
  systemPrompt: `You are Kritvia AI Sales Analyst, an expert in sales pipeline analysis and deal strategy.

Your expertise includes:
- Pipeline health assessment and optimization
- Deal prioritization and probability analysis
- Sales forecasting and trend identification
- Customer engagement strategies
- Win/loss analysis

When analyzing deals:
1. Consider deal value, probability, and stage
2. Identify at-risk deals and recommend actions
3. Highlight expansion and upsell opportunities
4. Provide specific, actionable recommendations

Always format your response with:
- Executive summary
- Key findings
- Specific recommendations
- Next steps`,
  buildUserPrompt: (context) => {
    const deals = (context.deals as unknown[]) || [];
    const metrics = context.metrics as Record<string, number> || {};
    const insights = (context.insights as string) || 'No recent insights available';
    return `
## Sales Analysis Request

### Current Pipeline Data
${JSON.stringify(deals, null, 2)}

### Key Metrics
- Total Pipeline Value: $${metrics.pipelineValue || 0}
- Weighted Value: $${metrics.weightedValue || 0}
- Average Probability: ${metrics.avgProbability || 0}%
- Win Rate: ${metrics.winRate || 0}%

### Recent AI Insights
${insights}

### Your Task
Analyze this sales data and provide:
1. Priority deals to focus on
2. At-risk deals requiring attention
3. Recommended actions to improve conversion
4. Growth opportunities

Focus on deals with high probability and value first.`;
  },
};

// Marketing Analysis Prompt
export const marketingAnalysisPrompt: PromptTemplate = {
  name: 'marketing-analysis',
  description: 'Analyzes marketing campaigns and performance metrics',
  systemPrompt: `You are Kritvia AI Marketing Analyst, an expert in digital marketing strategy and campaign optimization.

Your expertise includes:
- Multi-channel marketing performance analysis
- Conversion funnel optimization
- Campaign ROI and attribution
- Lead generation and nurturing strategies
- Content marketing effectiveness

When analyzing marketing data:
1. Identify top and underperforming channels
2. Recommend budget reallocation strategies
3. Highlight optimization opportunities
4. Provide specific, data-driven suggestions`,
  buildUserPrompt: (context) => {
    const campaigns = (context.campaigns as unknown[]) || [];
    const metrics = context.metrics as Record<string, number> || {};
    const channels = (context.channels as unknown[]) || [];
    return `
## Marketing Analysis Request

### Campaign Performance
${JSON.stringify(campaigns, null, 2)}

### Channel Performance
${JSON.stringify(channels, null, 2)}

### Key Metrics
- Total Impressions: ${metrics.impressions || 0}
- Total Clicks: ${metrics.clicks || 0}
- Conversion Rate: ${metrics.conversionRate || 0}%
- ROI: ${metrics.roi || 0}%

### Your Task
Analyze this marketing data and provide:
1. Top performing campaigns and channels
2. Underperforming areas needing attention
3. Budget optimization recommendations
4. Next quarter strategy suggestions`;
  },
};

// Operations Analysis Prompt
export const operationsAnalysisPrompt: PromptTemplate = {
  name: 'operations-analysis',
  description: 'Analyzes operational tasks, workflows, and team productivity',
  systemPrompt: `You are Kritvia AI Operations Analyst, an expert in workflow optimization and team productivity.

Your expertise includes:
- Task management and prioritization
- Workflow bottleneck identification
- Team capacity planning
- Process automation opportunities
- Resource allocation optimization

When analyzing operations data:
1. Identify completed, in-progress, and pending tasks
2. Detect bottlenecks and blockers
3. Recommend workflow improvements
4. Suggest automation opportunities`,
  buildUserPrompt: (context) => {
    const tasks = (context.tasks as unknown[]) || [];
    const teamLoad = (context.teamLoad as unknown[]) || [];
    const metrics = context.metrics as Record<string, number> || {};
    return `
## Operations Analysis Request

### Task Distribution
${JSON.stringify(tasks, null, 2)}

### Team Workload
${JSON.stringify(teamLoad, null, 2)}

### Key Metrics
- Active Tasks: ${metrics.activeTasks || 0}
- Completed This Week: ${metrics.completed || 0}
- Overdue Tasks: ${metrics.overdue || 0}
- Avg Completion Time: ${metrics.avgTime || 0} days

### Your Task
Analyze this operations data and provide:
1. Task distribution recommendations
2. Bottlenecks and blockers to address
3. Workload rebalancing suggestions
4. Automation opportunities`;
  },
};

// Forecast Analysis Prompt
export const forecastAnalysisPrompt: PromptTemplate = {
  name: 'forecast-analysis',
  description: 'Provides revenue forecasting and scenario planning',
  systemPrompt: `You are Kritvia AI Forecast Analyst, an expert in revenue forecasting and financial planning.

Your expertise includes:
- Revenue prediction and trend analysis
- Scenario modeling and probability assessment
- Growth rate analysis
- Seasonal pattern detection
- Risk assessment and mitigation

When analyzing forecast data:
1. Consider historical performance and trends
2. Provide multiple scenarios (conservative, base, optimistic)
3. Identify key drivers and risks
4. Give confidence-weighted recommendations`,
  buildUserPrompt: (context) => {
    const historicalData = (context.historicalData as unknown[]) || [];
    const pipeline = context.pipeline as Record<string, number> || {};
    const targets = context.targets as Record<string, number> || {};
    return `
## Revenue Forecast Request

### Historical Performance
${JSON.stringify(historicalData, null, 2)}

### Current Pipeline
- Total Pipeline: $${pipeline.total || 0}
- Weighted Pipeline: $${pipeline.weighted || 0}
- Pipeline Coverage: ${pipeline.coverage || 0}x

### Annual Targets
- Revenue Target: $${targets.revenue || 0}
- Growth Target: ${targets.growth || 0}%

### Your Task
Analyze this forecast data and provide:
1. Revenue projection for next quarter/year
2. Scenario analysis (conservative, base, optimistic)
3. Key factors affecting forecast
4. Recommendations to meet/exceed targets`;
  },
};

// Customer Insights Prompt
export const customerInsightsPrompt: PromptTemplate = {
  name: 'customer-insights',
  description: 'Analyzes customer segments and provides retention strategies',
  systemPrompt: `You are Kritvia AI Customer Insights Analyst, an expert in customer segmentation and retention.

Your expertise includes:
- Customer segmentation analysis
- Churn prediction and prevention
- Lifetime value calculation
- Upsell and cross-sell opportunities
- Customer satisfaction analysis

When analyzing customer data:
1. Segment customers by value and behavior
2. Identify at-risk segments
3. Recommend retention strategies
4. Highlight expansion opportunities`,
  buildUserPrompt: (context) => {
    const segments = (context.segments as unknown[]) || [];
    const churnData = context.churnData as Record<string, number> || {};
    const nps = context.nps as Record<string, number> || {};
    return `
## Customer Insights Request

### Customer Segments
${JSON.stringify(segments, null, 2)}

### Churn Analysis
- Overall Churn Rate: ${churnData.rate || 0}%
- At-Risk Customers: ${churnData.atRisk || 0}

### Customer Satisfaction
- NPS Score: ${nps.score || 0}

### Your Task
Analyze this customer data and provide:
1. Segment health assessment
2. Churn risk analysis
3. Retention recommendations
4. Expansion opportunities by segment`;
  },
};

// General Chat Prompt
export const generalChatPrompt: PromptTemplate = {
  name: 'general-chat',
  description: 'General business assistant for ad-hoc queries',
  systemPrompt: `You are Kritvia AI, an intelligent business assistant.

Your role is to help users with any business question. Be concise, actionable, and data-driven.
Use clear formatting with headers, bullet points, and tables where appropriate.`,
  buildUserPrompt: (context) => {
    const query = (context.query as string) || '';
    const additionalContext = context.additionalContext;
    return `
## Question
${query}

${additionalContext ? `
### Additional Context
${JSON.stringify(additionalContext, null, 2)}
` : ''}

Please provide a helpful, actionable response.`;
  },
};

// Prompt Manager
export class PromptManager {
  private prompts: Map<string, PromptTemplate> = new Map();
  
  constructor() {
    this.registerPrompt(salesAnalysisPrompt);
    this.registerPrompt(marketingAnalysisPrompt);
    this.registerPrompt(operationsAnalysisPrompt);
    this.registerPrompt(forecastAnalysisPrompt);
    this.registerPrompt(customerInsightsPrompt);
    this.registerPrompt(generalChatPrompt);
  }
  
  registerPrompt(prompt: PromptTemplate): void {
    this.prompts.set(prompt.name, prompt);
  }
  
  getPrompt(name: string): PromptTemplate | undefined {
    return this.prompts.get(name);
  }
  
  buildAIRequest(
    promptName: string,
    organizationId: string,
    userId: string,
    context: Record<string, unknown>
  ): AIRequest {
    const prompt = this.prompts.get(promptName);
    
    if (!prompt) {
      const fallbackPrompt = this.prompts.get('general-chat')!;
      return {
        organizationId,
        userId,
        query: (context.query as string) || '',
        context,
        systemPrompt: fallbackPrompt.systemPrompt,
      };
    }
    
    return {
      organizationId,
      userId,
      query: prompt.buildUserPrompt(context),
      context,
      systemPrompt: prompt.systemPrompt,
    };
  }
  
  listPrompts(): string[] {
    return Array.from(this.prompts.keys());
  }
  
  getPromptInfo(name: string): { name: string; description: string } | undefined {
    const prompt = this.prompts.get(name);
    if (!prompt) return undefined;
    return { name: prompt.name, description: prompt.description };
  }
}

// Export singleton
export const promptManager = new PromptManager();
