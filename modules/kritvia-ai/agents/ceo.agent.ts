import { z } from 'zod';
import { ReasoningEngine } from '../engine/reasoning';
import { Planner } from '../engine/planner';
import { Executor } from '../engine/executor';
import { CRMTool } from '../tools/crm.tool';
import { AnalyticsTool } from '../tools/analytics.tool';
import { CEOPrompt } from '../prompts/ceo.prompt';

export class CEOAgent {
  private reasoning: ReasoningEngine;
  private planner: Planner;
  private executor: Executor;
  private crmTool: CRMTool;
  private analyticsTool: AnalyticsTool;
  private prompt: CEOPrompt;

  constructor() {
    this.reasoning = new ReasoningEngine();
    this.planner = new Planner();
    this.executor = new Executor();
    this.crmTool = new CRMTool();
    this.analyticsTool = new AnalyticsTool();
    this.prompt = new CEOPrompt();
  }

  async analyze(input: z.infer<typeof CEOAgentInputSchema>) {
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

const CEOAgentInputSchema = z.object({
  query: z.string(),
  context: z.record(z.any()).optional(),
});