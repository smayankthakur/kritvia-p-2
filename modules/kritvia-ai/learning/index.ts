/**
 * AI Learning Engine
 * 
 * Enables Kritvia AI to learn from business outcomes and improve recommendations over time.
 */

import { randomUUID } from 'crypto';

// Types
export interface AILearningEvent {
  id: string;
  organizationId: string;
  eventType: 'prediction' | 'recommendation' | 'action' | 'feedback';
  inputContext: Record<string, unknown>;
  prediction: string;
  actualOutcome?: string;
  accuracyScore?: number;
  userFeedback?: 'positive' | 'negative';
  createdAt: number;
  resolvedAt?: number;
}

// In-memory storage
const learningStore: Map<string, AILearningEvent[]> = new Map();

// Learning Engine
export class AILearningEngine {
  /**
   * Capture an AI decision for learning
   */
  async capturePrediction(
    organizationId: string,
    eventType: AILearningEvent['eventType'],
    inputContext: Record<string, unknown>,
    prediction: string
  ): Promise<AILearningEvent> {
    const event: AILearningEvent = {
      id: randomUUID(),
      organizationId,
      eventType,
      inputContext,
      prediction,
      createdAt: Date.now(),
    };

    const events = learningStore.get(organizationId) || [];
    events.push(event);
    
    // Keep last 200 events per organization
    if (events.length > 200) {
      events.shift();
    }
    
    learningStore.set(organizationId, events);
    return event;
  }

  /**
   * Record actual outcome and calculate accuracy
   */
  async recordOutcome(
    eventId: string,
    organizationId: string,
    actualOutcome: string
  ): Promise<AILearningEvent | null> {
    const events = learningStore.get(organizationId) || [];
    const event = events.find(e => e.id === eventId);
    
    if (!event) return null;
    
    event.actualOutcome = actualOutcome;
    event.resolvedAt = Date.now();
    
    // Calculate simple accuracy based on keyword matching
    const predictionWords = event.prediction.toLowerCase().split(/\s+/);
    const outcomeWords = actualOutcome.toLowerCase().split(/\s+/);
    
    let matches = 0;
    for (const word of predictionWords) {
      if (outcomeWords.includes(word)) matches++;
    }
    
    event.accuracyScore = predictionWords.length > 0 ? matches / predictionWords.length : 0;
    
    return event;
  }

  /**
   * Record user feedback
   */
  async recordFeedback(
    eventId: string,
    organizationId: string,
    feedback: 'positive' | 'negative'
  ): Promise<AILearningEvent | null> {
    const events = learningStore.get(organizationId) || [];
    const event = events.find(e => e.id === eventId);
    
    if (!event) return null;
    
    event.userFeedback = feedback;
    
    return event;
  }

  /**
   * Get accuracy statistics
   */
  async getAccuracyStats(organizationId: string): Promise<{
    totalPredictions: number;
    avgAccuracy: number;
    positiveFeedback: number;
    negativeFeedback: number;
    accuracyByType: Record<string, number>;
  }> {
    const events = learningStore.get(organizationId) || [];
    
    const resolved = events.filter(e => e.accuracyScore !== undefined);
    const withFeedback = events.filter(e => e.userFeedback !== undefined);
    
    const accuracyByType: Record<string, number[]> = {};
    
    for (const event of resolved) {
      if (!accuracyByType[event.eventType]) {
        accuracyByType[event.eventType] = [];
      }
      accuracyByType[event.eventType].push(event.accuracyScore!);
    }
    
    const avgByType: Record<string, number> = {};
    for (const [type, scores] of Object.entries(accuracyByType)) {
      avgByType[type] = scores.reduce((a, b) => a + b, 0) / scores.length;
    }
    
    return {
      totalPredictions: events.length,
      avgAccuracy: resolved.length > 0 
        ? resolved.reduce((a, e) => a + (e.accuracyScore || 0), 0) / resolved.length 
        : 0,
      positiveFeedback: withFeedback.filter(e => e.userFeedback === 'positive').length,
      negativeFeedback: withFeedback.filter(e => e.userFeedback === 'negative').length,
      accuracyByType: avgByType,
    };
  }

  /**
   * Get recent learning events
   */
  async getRecentEvents(organizationId: string, limit: number = 10): Promise<AILearningEvent[]> {
    const events = learningStore.get(organizationId) || [];
    return events.slice(-limit).reverse();
  }

  /**
   * Adjust confidence based on historical accuracy
   */
  async getAdjustedConfidence(
    organizationId: string,
    predictionType: string
  ): Promise<number> {
    const stats = await this.getAccuracyStats(organizationId);
    
    // Base confidence
    let confidence = 0.75;
    
    // Adjust based on historical accuracy
    if (stats.accuracyByType[predictionType]) {
      confidence = 0.5 + (stats.accuracyByType[predictionType] * 0.5);
    }
    
    // Boost for positive feedback
    const positiveRatio = stats.totalPredictions > 0 
      ? stats.positiveFeedback / (stats.positiveFeedback + stats.negativeFeedback || 1)
      : 0.5;
    
    confidence = confidence * 0.7 + positiveRatio * 0.3;
    
    return Math.min(Math.max(confidence, 0.3), 0.95); // Clamp between 0.3 and 0.95
  }
}

// Export singleton
export const aiLearningEngine = new AILearningEngine();

// Helper function to capture and learn from AI response
export async function learnFromAIResponse(
  organizationId: string,
  query: string,
  prediction: string,
  context: Record<string, unknown>
): Promise<AILearningEvent> {
  // Determine event type from query
  let eventType: AILearningEvent['eventType'] = 'recommendation';
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('forecast') || queryLower.includes('predict')) {
    eventType = 'prediction';
  } else if (queryLower.includes('do') || queryLower.includes('take action')) {
    eventType = 'action';
  }
  
  return aiLearningEngine.capturePrediction(organizationId, eventType, { query, ...context }, prediction);
}

// Helper to record outcome
export async function learnFromOutcome(
  organizationId: string,
  eventId: string,
  outcome: string
): Promise<void> {
  await aiLearningEngine.recordOutcome(eventId, organizationId, outcome);
}

// Helper to record feedback
export async function learnFromFeedback(
  organizationId: string,
  eventId: string,
  feedback: 'positive' | 'negative'
): Promise<void> {
  await aiLearningEngine.recordFeedback(eventId, organizationId, feedback);
}
