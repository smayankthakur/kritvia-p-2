/**
 * AI Memory System
 * 
 * Manages short-term and long-term memory for the AI.
 */

export interface AIMemory {
  id: string;
  timestamp: number;
  type: 'insight' | 'decision' | 'action' | 'conversation' | 'feedback';
  data: Record<string, unknown>;
  sessionId?: string;
  importance: number; // 0-1
}

// In-memory storage (replace with database in production)
const shortTermMemory: Map<string, AIMemory[]> = new Map();
const longTermMemory: AIMemory[] = [];

/**
 * Store memory
 */
export function storeMemory(
  memory: Omit<AIMemory, 'id' | 'timestamp'>
): AIMemory {
  const newMemory: AIMemory = {
    ...memory,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  // Determine storage type based on importance
  if (memory.importance > 0.7 || memory.type === 'decision') {
    // Long-term memory
    longTermMemory.push(newMemory);
  } else if (memory.sessionId) {
    // Short-term memory (session-based)
    const sessionMemories = shortTermMemory.get(memory.sessionId) || [];
    sessionMemories.push(newMemory);
    
    // Limit short-term memory to 50 items per session
    if (sessionMemories.length > 50) {
      sessionMemories.shift();
    }
    shortTermMemory.set(memory.sessionId, sessionMemories);
  }

  return newMemory;
}

/**
 * Retrieve memory
 */
export function retrieveMemory(
  sessionId: string,
  types?: AIMemory['type'][],
  limit: number = 10
): AIMemory[] {
  const sessionMemories = shortTermMemory.get(sessionId) || [];
  
  let filtered = sessionMemories;
  
  if (types && types.length > 0) {
    filtered = sessionMemories.filter(m => types.includes(m.type));
  }
  
  return filtered.slice(-limit);
}

/**
 * Search memory
 */
export function searchMemory(
  query: string,
  types?: AIMemory['type'][],
  limit: number = 10
): AIMemory[] {
  // Search in long-term memory
  let results = longTermMemory;
  
  if (types && types.length > 0) {
    results = results.filter(m => types.includes(m.type));
  }
  
  // Simple keyword search
  const queryLower = query.toLowerCase();
  results = results.filter(m => 
    JSON.stringify(m.data).toLowerCase().includes(queryLower)
  );
  
  return results.slice(-limit);
}

/**
 * Get recent insights
 */
export function getRecentInsights(limit: number = 5): AIMemory[] {
  return longTermMemory
    .filter(m => m.type === 'insight')
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Get decision history
 */
export function getDecisionHistory(limit: number = 10): AIMemory[] {
  return longTermMemory
    .filter(m => m.type === 'decision')
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Clear session memory
 */
export function clearSessionMemory(sessionId: string): void {
  shortTermMemory.delete(sessionId);
}

/**
 * Store conversation
 */
export function storeConversation(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: Record<string, unknown>
): AIMemory {
  return storeMemory({
    type: 'conversation',
    data: { role, content, ...metadata },
    sessionId,
    importance: 0.5,
  });
}

/**
 * Store decision
 */
export function storeDecision(
  decision: string,
  context: Record<string, unknown>,
  confidence: number,
  outcome?: Record<string, unknown>
): AIMemory {
  return storeMemory({
    type: 'decision',
    data: { decision, context, confidence, outcome },
    importance: confidence,
  });
}

/**
 * Store action result
 */
export function storeAction(
  action: string,
  parameters: Record<string, unknown>,
  result: Record<string, unknown>,
  success: boolean
): AIMemory {
  return storeMemory({
    type: 'action',
    data: { action, parameters, result, success },
    importance: success ? 0.6 : 0.8,
  });
}

/**
 * Store feedback
 */
export function storeFeedback(
  targetId: string,
  feedback: 'positive' | 'negative' | 'neutral',
  comment?: string
): AIMemory {
  return storeMemory({
    type: 'feedback',
    data: { targetId, feedback, comment },
    importance: feedback === 'negative' ? 0.9 : 0.5,
  });
}

/**
 * Get memory statistics
 */
export function getMemoryStats(): {
  shortTermCount: number;
  longTermCount: number;
  byType: Record<string, number>;
} {
  let shortTermCount = 0;
  shortTermMemory.forEach(m => shortTermCount += m.length);
  
  const byType: Record<string, number> = {};
  longTermMemory.forEach(m => {
    byType[m.type] = (byType[m.type] || 0) + 1;
  });
  
  return {
    shortTermCount,
    longTermCount: longTermMemory.length,
    byType,
  };
}

export default {
  storeMemory,
  retrieveMemory,
  searchMemory,
  getRecentInsights,
  getDecisionHistory,
  clearSessionMemory,
  storeConversation,
  storeDecision,
  storeAction,
  storeFeedback,
  getMemoryStats,
};
