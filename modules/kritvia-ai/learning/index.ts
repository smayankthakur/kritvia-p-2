/**
 * Learning Feedback Loop
 * 
 * AI learning system that improves recommendations over time.
 */

import { storeDecision, storeFeedback } from '../memory';

export interface DecisionOutcome {
  decisionId: string;
  context: Record<string, unknown>;
  predicted: string;
  actual?: string;
  success?: boolean;
  feedback?: 'positive' | 'negative' | 'neutral';
}

// Learning records
const decisionOutcomes: Map<string, DecisionOutcome> = new Map();
const patternConfidence: Map<string, number> = new Map();

/**
 * Record outcome of a decision
 */
export function recordOutcome(
  decisionId: string,
  context: Record<string, unknown>,
  predicted: string,
  actual?: string
): void {
  const outcome: DecisionOutcome = {
    decisionId,
    context,
    predicted,
    actual,
    success: actual ? predicted === actual : undefined,
  };
  
  decisionOutcomes.set(decisionId, outcome);
  
  // Store in memory
  storeDecision(predicted, context, patternConfidence.get(decisionId) || 0.5, { actual, success: outcome.success });
}

/**
 * Record feedback on AI output
 */
export function recordFeedback(
  targetId: string,
  feedback: 'positive' | 'negative' | 'neutral',
  comment?: string
): void {
  storeFeedback(targetId, feedback, comment);
  
  // Adjust confidence based on feedback
  const currentConfidence = patternConfidence.get(targetId) || 0.5;
  
  if (feedback === 'positive') {
    patternConfidence.set(targetId, Math.min(1, currentConfidence + 0.1));
  } else if (feedback === 'negative') {
    patternConfidence.set(targetId, Math.max(0.1, currentConfidence - 0.1));
  }
  
  // Learn from feedback
  learnFromFeedback(targetId, feedback);
}

/**
 * Internal learning from feedback
 */
function learnFromFeedback(targetId: string, feedback: 'positive' | 'negative' | 'neutral'): void {
  // Simple learning: adjust similar patterns
  const similarKeys = Array.from(patternConfidence.keys())
    .filter(key => key.includes(targetId.split('-')[0]));
  
  similarKeys.forEach(key => {
    const current = patternConfidence.get(key) || 0.5;
    
    if (feedback === 'positive') {
      patternConfidence.set(key, Math.min(0.95, current + 0.05));
    } else if (feedback === 'negative') {
      patternConfidence.set(key, Math.max(0.2, current - 0.05));
    }
  });
}

/**
 * Get confidence score for a pattern
 */
export function getConfidence(patternId: string): number {
  return patternConfidence.get(patternId) || 0.5;
}

/**
 * Update confidence based on action result
 */
export function updateConfidenceModel(
  decisionId: string,
  result: Record<string, unknown>
): void {
  const outcome = decisionOutcomes.get(decisionId);
  
  if (!outcome) return;
  
  const success = result.success as boolean | undefined;
  
  if (success !== undefined) {
    const current = patternConfidence.get(decisionId) || 0.5;
    
    // Adjust based on result
    const adjustment = success ? 0.05 : -0.05;
    patternConfidence.set(decisionId, Math.max(0.1, Math.min(0.95, current + adjustment)));
    
    // Update outcome with actual result
    outcome.success = success;
  }
}

/**
 * Get learning statistics
 */
export function getLearningStats(): {
  totalDecisions: number;
  successfulDecisions: number;
  averageConfidence: number;
  patternsLearned: number;
} {
  const decisions = Array.from(decisionOutcomes.values());
  const successful = decisions.filter(d => d.success === true).length;
  const confidences = Array.from(patternConfidence.values());
  const avgConfidence = confidences.length > 0
    ? confidences.reduce((a, b) => a + b, 0) / confidences.length
    : 0.5;
  
  return {
    totalDecisions: decisions.length,
    successfulDecisions: successful,
    averageConfidence: avgConfidence,
    patternsLearned: patternConfidence.size,
  };
}

/**
 * Learn from actions performed
 */
export function learnFromActions(actions: {
  actionId: string;
  type: string;
  parameters: Record<string, unknown>;
  result: Record<string, unknown>;
}[]): void {
  actions.forEach(action => {
    const success = action.result.success as boolean | undefined;
    const patternId = action.type;
    
    if (success !== undefined) {
      const current = patternConfidence.get(patternId) || 0.5;
      const adjustment = success ? 0.03 : -0.03;
      patternConfidence.set(patternId, Math.max(0.1, Math.min(0.95, current + adjustment)));
    }
  });
}

/**
 * Get recommended confidence threshold
 */
export function getRecommendedThreshold(): number {
  const stats = getLearningStats();
  
  if (stats.averageConfidence > 0.8) return 0.6;
  if (stats.averageConfidence > 0.6) return 0.5;
  return 0.4;
}

export default {
  recordOutcome,
  recordFeedback,
  getConfidence,
  updateConfidenceModel,
  getLearningStats,
  learnFromActions,
  getRecommendedThreshold,
};
