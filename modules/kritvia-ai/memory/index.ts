/**
 * AI Memory System
 * 
 * Enables Kritvia AI to remember business patterns and previous decisions.
 * Provides long-term intelligence storage for contextual AI responses.
 */

import { randomUUID } from 'crypto';

// Types
export interface AIMemory {
  id: string;
  organizationId: string;
  type: 'insight' | 'decision' | 'pattern' | 'action';
  context: Record<string, unknown>;
  summary: string;
  confidenceScore: number;
  createdAt: number;
  metadata?: {
    query?: string;
    response?: string;
    category?: string;
    tags?: string[];
  };
}

// In-memory storage (would be replaced with database in production)
const memoryStore: Map<string, AIMemory[]> = new Map();

// AI Memory Service
export class AIMemoryService {
  /**
   * Store a new memory
   */
  async storeMemory(
    organizationId: string,
    type: AIMemory['type'],
    context: Record<string, unknown>,
    summary: string,
    confidenceScore: number,
    metadata?: AIMemory['metadata']
  ): Promise<AIMemory> {
    const memory: AIMemory = {
      id: randomUUID(),
      organizationId,
      type,
      context,
      summary,
      confidenceScore,
      createdAt: Date.now(),
      metadata,
    };
    
    // Get existing memories or create new array
    const orgMemories = memoryStore.get(organizationId) || [];
    orgMemories.push(memory);
    
    // Limit stored memories per organization (keep last 100)
    if (orgMemories.length > 100) {
      orgMemories.shift();
    }
    
    memoryStore.set(organizationId, orgMemories);
    
    return memory;
  }
  
  /**
   * Get relevant memories for a query
   */
  async getRelevantMemories(
    organizationId: string,
    query: string,
    limit: number = 5
  ): Promise<AIMemory[]> {
    const orgMemories = memoryStore.get(organizationId) || [];
    
    // Simple keyword matching for relevance
    const queryWords = query.toLowerCase().split(/\s+/);
    
    const scoredMemories = orgMemories.map(memory => {
      let score = 0;
      
      // Check summary for query keywords
      const summaryWords = memory.summary.toLowerCase().split(/\s+/);
      for (const word of queryWords) {
        if (summaryWords.includes(word)) {
          score += 1;
        }
      }
      
      // Check context for relevant data
      const contextStr = JSON.stringify(memory.context).toLowerCase();
      for (const word of queryWords) {
        if (contextStr.includes(word)) {
          score += 0.5;
        }
      }
      
      // Boost recent memories
      const ageInDays = (Date.now() - memory.createdAt) / (1000 * 60 * 60 * 24);
      if (ageInDays < 7) score += 0.3;
      if (ageInDays < 30) score += 0.1;
      
      // Confidence boost
      score += memory.confidenceScore * 0.2;
      
      return { memory, score };
    });
    
    // Sort by score and return top results
    scoredMemories.sort((a, b) => b.score - a.score);
    
    return scoredMemories
      .filter(s => s.score > 0)
      .slice(0, limit)
      .map(s => s.memory);
  }
  
  /**
   * Build memory context for AI prompts
   */
  buildMemoryContext(memories: AIMemory[]): string {
    if (memories.length === 0) {
      return 'No previous relevant memories found.';
    }
    
    const sections = memories.map((memory, index) => {
      const date = new Date(memory.createdAt).toLocaleDateString();
      return `${index + 1}. [${memory.type.toUpperCase()}] ${date}
   Summary: ${memory.summary}
   Confidence: ${(memory.confidenceScore * 100).toFixed(0)}%`;
    });
    
    return `## Previous Relevant Memories\n\n${sections.join('\n\n')}`;
  }
  
  /**
   * Store insight from AI analysis
   */
  async storeInsight(
    organizationId: string,
    insight: string,
    context: Record<string, unknown>,
    confidenceScore: number
  ): Promise<AIMemory> {
    return this.storeMemory(
      organizationId,
      'insight',
      context,
      insight,
      confidenceScore,
      { category: 'ai-insight' }
    );
  }
  
  /**
   * Store AI decision
   */
  async storeDecision(
    organizationId: string,
    decision: string,
    reasoning: string,
    context: Record<string, unknown>,
    confidenceScore: number
  ): Promise<AIMemory> {
    return this.storeMemory(
      organizationId,
      'decision',
      { ...context, reasoning },
      decision,
      confidenceScore,
      { category: 'ai-decision' }
    );
  }
  
  /**
   * Store detected pattern
   */
  async storePattern(
    organizationId: string,
    pattern: string,
    context: Record<string, unknown>,
    confidenceScore: number
  ): Promise<AIMemory> {
    return this.storeMemory(
      organizationId,
      'pattern',
      context,
      pattern,
      confidenceScore,
      { category: 'pattern-detection' }
    );
  }
  
  /**
   * Store action taken
   */
  async storeAction(
    organizationId: string,
    action: string,
    context: Record<string, unknown>,
    result?: string
  ): Promise<AIMemory> {
    return this.storeMemory(
      organizationId,
      'action',
      { ...context, result },
      action,
      1.0,
      { category: 'user-action' }
    );
  }
  
  /**
   * Get memory statistics
   */
  async getStats(organizationId: string): Promise<{
    total: number;
    byType: Record<string, number>;
    oldest: number | null;
    newest: number | null;
  }> {
    const orgMemories = memoryStore.get(organizationId) || [];
    
    const byType: Record<string, number> = {};
    for (const memory of orgMemories) {
      byType[memory.type] = (byType[memory.type] || 0) + 1;
    }
    
    return {
      total: orgMemories.length,
      byType,
      oldest: orgMemories.length > 0 ? Math.min(...orgMemories.map(m => m.createdAt)) : null,
      newest: orgMemories.length > 0 ? Math.max(...orgMemories.map(m => m.createdAt)) : null,
    };
  }
  
  /**
   * Clear all memories for an organization
   */
  async clear(organizationId: string): Promise<void> {
    memoryStore.delete(organizationId);
  }
}

// Export singleton
export const aiMemoryService = new AIMemoryService();

// Helper function to add memory context to AI requests
export async function addMemoryToContext(
  organizationId: string,
  query: string
): Promise<{ memoryContext: string; memoryCount: number }> {
  const memories = await aiMemoryService.getRelevantMemories(organizationId, query);
  const memoryContext = aiMemoryService.buildMemoryContext(memories);
  
  return {
    memoryContext,
    memoryCount: memories.length,
  };
}
