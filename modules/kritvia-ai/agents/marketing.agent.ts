import { z } from 'zod';
import { ReasoningEngine } from '../engine/reasoning';
import { Planner } from '../engine/planner';
import { Executor } from '../engine/executor';
import { CRMTool } from '../tools/crm.tool';
import { AnalyticsTool } from '../tools/analytics.tool';
import { MarketingPrompt } from '../prompts/marketing.prompt';

export class MarketingAgent {
  private reasoning: ReasoningEngine;
  private planner: Planner;
  private executor: Executor;
  private crmTool: CRMTool;
  private analyticsTool: AnalyticsTool;
  private prompt: MarketingPrompt;

  constructor() {
    this.reasoning = new ReasoningEngine();
    this.planner = new Planner();
    this.executor = new Executor();
    this.crmTool = new CRMTool();
    this.analyticsTool = new AnalyticsTool();
    this.prompt = new MarketingPrompt();
  }

  async analyze(input: z.infer<typeof MarketingAgentInputSchema>) {
    const prompt = this.prompt.getAnalysisPrompt(input);
    const reasoningResult = await this.reasoning.reason(prompt);
    
    // Decide if we need to use tools
    if (reasoningResult.needsTools) {
      const plan = this.planner.createPlan(reasoningResult, [this.crmTool, this.analyticsTool]);
      const toolResults = await this.executor.executePlan(plan);
      return this.synthesize(reasoningResult, toolResults);
    }
    
    return reasoningResult;
  }

  private synthesize(reasoningResult: any, toolResults: any[]) {
    // Combine reasoning and tool results
    return {
      ...reasoningResult,
      toolResults,
    };
  }
}

const MarketingAgentInputSchema = z.object({
  query: z.string(),
  context: z.record(z.any()).optional(),
});