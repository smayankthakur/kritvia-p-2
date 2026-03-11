/**
 * AI Service - OpenAI Integration
 * 
 * Provider-agnostic AI wrapper supporting:
 * - OpenAI
 * - Anthropic
 * - Local LLMs
 */

import type { AIResponse } from '../index';

// Environment variable for API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponseData {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

/**
 * Generate AI response using OpenAI
 */
export async function generateAIResponse<T = AIResponseData>(request: AIRequest): Promise<AIResponse<T>> {
  const startTime = Date.now();
  
  // Check if API key is configured
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      requestId: crypto.randomUUID(),
      timestamp: startTime,
      error: 'OPENAI_API_KEY not configured',
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: request.model || 'gpt-4',
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt },
        ],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        requestId: crypto.randomUUID(),
        timestamp: startTime,
        error: `OpenAI API error: ${error}`,
      };
    }

    const data = await response.json() as {
      choices: Array<{
        message: { content: string };
        finish_reason: string;
      }>;
      usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
    };

    return {
      success: true,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      data: {
        content: data.choices[0]?.message?.content || '',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        finishReason: data.choices[0]?.finish_reason,
      } as T,
    };
  } catch (error) {
    return {
      success: false,
      requestId: crypto.randomUUID(),
      timestamp: startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Analyze text with AI
 */
export async function analyzeText(
  text: string,
  analysisType: 'sentiment' | 'summary' | 'entities'
): Promise<AIResponse<{ result: string }>> {
  const prompts: Record<string, string> = {
    sentiment: `Analyze the sentiment of this text and return a JSON with "sentiment" (positive/negative/neutral) and "confidence" (0-1):\n\n${text}`,
    summary: `Provide a concise summary of this text:\n\n${text}`,
    entities: `Extract key entities from this text as JSON with "entities" array containing {name, type}:\n\n${text}`,
  };

  const systemPrompts: Record<string, string> = {
    sentiment: 'You are a sentiment analysis expert. Always respond with valid JSON.',
    summary: 'You are an expert at summarizing text. Keep summaries concise.',
    entities: 'You are a named entity recognition expert. Always respond with valid JSON.',
  };

  return generateAIResponse({
    prompt: prompts[analysisType] || prompts.summary,
    systemPrompt: systemPrompts[analysisType] || systemPrompts.summary,
    temperature: 0.3,
  });
}

/**
 * Generate insight from business data
 */
export async function generateInsight(
  data: Record<string, unknown>,
  insightType: string
): Promise<AIResponse<{ insight: string; confidence: number }>> {
  const dataJson = JSON.stringify(data, null, 2);
  
  const prompt = `Based on the following business data, provide a ${insightType} insight:

${dataJson}

Respond with JSON containing:
- insight: The main insight (1-2 sentences)
- confidence: Confidence score (0-1)
- reasoning: Brief explanation`;

  const result = await generateAIResponse({
    prompt,
    systemPrompt: 'You are a business intelligence expert. Always respond with valid JSON.',
    temperature: 0.5,
    maxTokens: 500,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      error: result.error || 'Failed to generate insight',
    };
  }

  try {
    // Try to parse JSON response
    const parsed = JSON.parse(result.data.content);
    return {
      success: true,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      data: {
        insight: parsed.insight || 'No insight generated',
        confidence: parsed.confidence || 0.5,
      },
    };
  } catch {
    // If not valid JSON, return the raw content
    return {
      success: true,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      data: {
        insight: result.data.content,
        confidence: 0.5,
      },
    };
  }
}

/**
 * Embed text for vector storage
 */
export async function embedText(text: string): Promise<AIResponse<{ embedding: number[] }>> {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      error: 'OPENAI_API_KEY not configured',
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        requestId: crypto.randomUUID(),
        timestamp: Date.now(),
        error: `OpenAI Embedding API error: ${error}`,
      };
    }

    const data = await response.json() as {
      data: Array<{ embedding: number[] }>;
    };

    return {
      success: true,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      data: {
        embedding: data.data[0]?.embedding || [],
      },
    };
  } catch (error) {
    return {
      success: false,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default {
  generateAIResponse,
  analyzeText,
  generateInsight,
  embedText,
};
