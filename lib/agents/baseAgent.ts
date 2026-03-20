/**
 * Base Agent System
 * Abstract base class for all AI agents
 */

import OpenAI from 'openai'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Agent types
export type AgentName = 'ceo' | 'sales' | 'marketing'

// Input/output types
export interface AgentInput {
  [key: string]: unknown
}

export interface AgentOutput {
  insights: string[]
  recommendations: string[]
  actions: AgentAction[]
  summary: string
  confidence: number
}

export interface AgentAction {
  type: 'send_email' | 'update_database' | 'trigger_notification' | 'create_task' | 'none'
  target?: string
  message: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
}

// Base agent class
export abstract class BaseAgent {
  abstract name: AgentName
  abstract role: string
  abstract description: string

  protected systemPrompt: string = ''

  /**
   * Analyze input data and generate output
   */
  async analyze(input: AgentInput): Promise<AgentOutput> {
    const prompt = this.buildPrompt(input)
    const response = await this.reason(prompt)
    const output = this.parseResponse(response)
    return output
  }

  /**
   * Build the prompt from input data
   */
  protected abstract buildPrompt(input: AgentInput): string

  /**
   * Reason using LLM
   */
  protected async reason(prompt: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      return completion.choices[0]?.message?.content || ''
    } catch (error) {
      console.error(`Error in ${this.name} agent reasoning:`, error)
      return JSON.stringify(this.getFallbackOutput())
    }
  }

  /**
   * Parse LLM response into structured output
   */
  protected abstract parseResponse(response: string): AgentOutput

  /**
   * Fallback output when LLM fails
   */
  protected getFallbackOutput(): AgentOutput {
    return {
      insights: ['Unable to generate insights at this time'],
      recommendations: ['Check system logs for errors'],
      actions: [],
      summary: 'Error occurred during analysis',
      confidence: 0,
    }
  }

  /**
   * Get agent info
   */
  getInfo() {
    return {
      name: this.name,
      role: this.role,
      description: this.description,
    }
  }
}

export default {
  BaseAgent,
}
