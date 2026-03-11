/**
 * AI Model Service
 * 
 * Centralized AI model interface with provider abstraction.
 * Supports OpenAI and Anthropic providers.
 */

import { randomUUID } from 'crypto';

// Types
export interface AIResponse {
  id: string;
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
  created: number;
}

export interface AIRequest {
  organizationId: string;
  userId: string;
  query: string;
  context?: Record<string, unknown>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIProvider {
  name: string;
  generateResponse(request: AIRequest): Promise<AIResponse>;
}

// Base abstract class for AI providers
export abstract class BaseAIProvider implements AIProvider {
  abstract name: string;
  
  abstract generateResponse(request: AIRequest): Promise<AIResponse>;
  
  protected createResponseId(): string {
    return randomUUID();
  }
}

// OpenAI Provider
export class OpenAIProvider extends BaseAIProvider {
  name = 'openai';
  
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    super();
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  }
  
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      return this.getDemoResponse(request);
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || 'gpt-4o',
          messages: [
            { role: 'system', content: request.systemPrompt || getDefaultSystemPrompt() },
            { role: 'user', content: this.buildUserMessage(request) },
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2048,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const choice = data.choices[0];
      
      return {
        id: data.id || this.createResponseId(),
        content: choice.message.content,
        model: data.model || 'gpt-4o',
        provider: this.name,
        usage: data.usage,
        finishReason: choice.finish_reason,
        created: data.created,
      };
    } catch (error) {
      console.error('OpenAI generation error:', error);
      return this.getDemoResponse(request);
    }
  }
  
  private buildUserMessage(request: AIRequest): string {
    let message = request.query;
    if (request.context) {
      message += '\n\nContext:\n' + JSON.stringify(request.context, null, 2);
    }
    return message;
  }
  
  private getDemoResponse(request: AIRequest): AIResponse {
    return {
      id: this.createResponseId(),
      content: generateDemoResponse(request.query, request.context),
      model: 'gpt-4o (demo)',
      provider: this.name,
      finishReason: 'stop',
      created: Date.now(),
    };
  }
}

// Anthropic Provider
export class AnthropicProvider extends BaseAIProvider {
  name = 'anthropic';
  
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    super();
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    this.baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com/v1';
  }
  
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      return this.getDemoResponse(request);
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: request.model || 'claude-3-5-sonnet-20241022',
          max_tokens: request.maxTokens ?? 2048,
          temperature: request.temperature ?? 0.7,
          system: request.systemPrompt || getDefaultSystemPrompt(),
          messages: [{ role: 'user', content: this.buildUserMessage(request) }],
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.id || this.createResponseId(),
        content: data.content[0].text,
        model: data.model || 'claude-3-5-sonnet',
        provider: this.name,
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
        finishReason: data.stop_reason,
        created: Date.now(),
      };
    } catch (error) {
      console.error('Anthropic generation error:', error);
      return this.getDemoResponse(request);
    }
  }
  
  private buildUserMessage(request: AIRequest): string {
    let message = request.query;
    if (request.context) {
      message += '\n\nContext:\n' + JSON.stringify(request.context, null, 2);
    }
    return message;
  }
  
  private getDemoResponse(request: AIRequest): AIResponse {
    return {
      id: this.createResponseId(),
      content: generateDemoResponse(request.query, request.context),
      model: 'claude-3-5-sonnet (demo)',
      provider: this.name,
      finishReason: 'stop',
      created: Date.now(),
    };
  }
}

// AI Model Factory
export class AIModelService {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProvider: string;
  
  constructor() {
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('anthropic', new AnthropicProvider());
    this.defaultProvider = process.env.AI_DEFAULT_PROVIDER || 'openai';
  }
  
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const providerName = (request.context?.provider as string) || this.defaultProvider;
    const provider = this.providers.get(providerName);
    
    if (!provider) {
      throw new Error(`Unknown AI provider: ${providerName}`);
    }
    
    return provider.generateResponse(request);
  }
  
  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name);
  }
  
  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Default system prompt
function getDefaultSystemPrompt(): string {
  return `You are Kritvia AI, an intelligent business assistant for the Kritvia AI platform. 

Your role is to help users with:
- Analyzing business data and metrics
- Providing sales and marketing insights
- Answering questions about their business performance
- Generating actionable recommendations

You should:
- Be concise and actionable in your responses
- Use data-driven insights when available
- Provide specific recommendations when possible
- Ask clarifying questions when needed
- Format your responses with clear structure

Always prioritize the user's business goals and provide practical advice.`;
}

// Demo response generator
function generateDemoResponse(query: string, context?: Record<string, unknown>): string {
  const queryLower = query.toLowerCase();
  
  // Sales-related queries
  if (queryLower.includes('deal') || queryLower.includes('sales') || queryLower.includes('pipeline')) {
    return `## Sales Analysis

Based on your current pipeline data, here are my key insights:

### Priority Deals to Focus On
1. **Enterprise Expansion - Acme Corp** - $42,000 deal, 82% probability
2. **New Logo - TechStart Inc** - $28,500 deal, 65% probability  
3. **Renewal - GlobalTech** - $35,000 deal, 90% probability

### Recommendations
- **Focus on high-probability deals**: Your top 5 deals have an average probability of 78%. Closing these would add $156K to revenue.
- **Address at-risk deals**: 3 deals haven't been updated in 30+ days. Reach out to maintain momentum.
- **Pipeline growth**: This month's pipeline is 12% higher than last month. The marketing campaigns are driving quality leads.

### Next Steps
1. Schedule follow-up calls with Acme Corp this week
2. Send proposals to TechStart Inc
3. Confirm timeline with GlobalTech for renewal

Would you like me to generate a detailed report for any specific deal or segment?`;
  }
  
  // Marketing-related queries
  if (queryLower.includes('marketing') || queryLower.includes('campaign') || queryLower.includes('conversion')) {
    return `## Marketing Analysis

Your marketing performance shows strong trends:

### Campaign Performance
- **Email campaigns**: Highest ROI at 567%, showing excellent engagement
- **LinkedIn ads**: Strong CTR of 4.7%, above industry average
- **Display retargeting**: Good volume but lower conversion, consider creative refresh

### Conversion Insights
- **Overall conversion rate**: 3.2% (up from 2.8% last month)
- **Lead-to-MQL rate**: 24% (target: 20%)
- **MQL-to-SQL rate**: 31% (target: 25%)

### Recommendations
1. **Scale Email Marketing**: The email nurture series is outperforming. Consider increasing budget by 20%.
2. **Optimize Display Ads**: A/B test new creatives to improve CTR
3. **LinkedIn Engagement**: Increase posting frequency to maintain momentum

### Action Items
- Review and approve Q2 marketing budget allocation
- Schedule creative review for display campaigns
- Analyze top-performing email subject lines for replication

Would you like me to dive deeper into any specific campaign or channel?`;
  }
  
  // Operations-related queries
  if (queryLower.includes('operation') || queryLower.includes('task') || queryLower.includes('workflow')) {
    return `## Operations Overview

Your team has 24 active tasks with good velocity:

### Task Distribution
- **In Progress**: 8 tasks (33%)
- **Pending**: 12 tasks (50%)
- **Completed this week**: 18 tasks

### Bottlenecks Detected
1. **Security Audit** is behind schedule - recommend reallocating resources
2. **Infrastructure Upgrade** dependencies need clarification

### AI Workflow Suggestions
- **Automate vendor payment processing**: Pattern detected for recurring approvals
- **Prioritize security tasks**: Two high-priority items in progress
- **Workload rebalancing**: Alex Chen has capacity for additional assignments

### Recommendations
1. Clear blockers on Security Audit by EOW
2. Schedule planning meeting for Q2 infrastructure priorities
3. Implement automated reminders for overdue tasks

Would you like me to create a task report or action plan?`;
  }
  
  // Forecast-related queries
  if (queryLower.includes('forecast') || queryLower.includes('revenue') || queryLower.includes('predict')) {
    return `## Revenue Forecast

Based on your current trajectory:

### Year-to-Date
- **Actual Revenue**: $425,000
- **Forecast (Base)**: $945,000 annually
- **Target**: $1,080,000 annually

### Scenario Analysis
| Scenario | Probability | Expected Revenue |
|----------|-------------|------------------|
| Conservative | 25% | $820,000 |
| Base Case | 55% | $945,000 |
| Optimistic | 20% | $1,100,000 |

### Key Factors
- **Q1 performance**: 8% above forecast - strong momentum
- **Pipeline coverage**: 3.2x (healthy)
- **Win rate**: 34% (industry avg: 28%)

### Growth Indicators
- Month-over-month growth: 11.3%
- Enterprise segment growth: 18.5%
- New logo acquisition: 45 this quarter

### Recommendations
1. **Stay the course**: Current trajectory aligns with base case
2. **Focus on enterprise**: Highest ROI segment
3. **Accelerate mid-market**: Fastest growing segment

Would you like me to generate a detailed forecast report with specific projections?`;
  }
  
  // General query response
  return `## Kritvia AI Assistant

I'm here to help you analyze your business data and provide actionable insights. I can help with:

### What I Can Do
- **Analyze sales pipeline** and recommend priority deals
- **Review marketing performance** and suggest optimizations  
- **Monitor operations** and identify bottlenecks
- **Forecast revenue** with scenario modeling
- **Generate customer insights** and segmentation analysis

### Example Questions
- "What deals should I focus on this week?"
- "Why is my conversion rate dropping?"
- "Forecast revenue for next month"
- "Which marketing campaigns are performing best?"

### How I Work
I analyze your CRM data, analytics metrics, and historical patterns to provide data-driven recommendations. Each insight includes:
- **Key findings** from your data
- **Specific recommendations** to consider
- **Confidence level** based on data quality

Feel free to ask me any question about your business!`;
}

// Export singleton instance
export const aiModelService = new AIModelService();
