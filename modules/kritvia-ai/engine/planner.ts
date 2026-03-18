import { z } from 'zod';

export class Planner {
  createPlan(reasoningResult: any, availableTools: any[]) {
    // Simple planner that creates a plan based on reasoning result and available tools
    const plan = {
      steps: [],
      toolsToUse: []
    };

    if (reasoningResult.needsTools) {
      // For simplicity, we'll use all available tools if tools are needed
      plan.toolsToUse = availableTools;
      plan.steps = reasoningResult.suggestedActions || [];
    }

    return plan;
  }
}