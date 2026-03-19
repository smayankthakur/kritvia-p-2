import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// AI Service class for modular AI operations
export class AIService {
  // Send a chat message to AI
  async chat(prompt: string, context?: string): Promise<string> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: `You are Kritvia, an AI Business Operating System assistant. You help business owners with:
- Analyzing leads and customer data
- Providing growth strategies
- Managing deals and pipeline
- Business insights and recommendations

${context ? `Context: ${context}` : ''}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ]

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      })

      return response.choices[0]?.message?.content || 'No response from AI'
    } catch (error) {
      console.error('AI Chat Error:', error)
      return 'Sorry, I encountered an error processing your request. Please try again.'
    }
  }

  // Analyze leads and provide insights
  async analyzeLeads(leads: { name: string; email: string; status: string; source?: string }[]): Promise<string> {
    const prompt = `Analyze these leads and provide insights:
${JSON.stringify(leads, null, 2)}

Please provide:
1. Summary of lead quality
2. Best performing sources
3. Recommended follow-up actions
4. Potential conversion opportunities`

    return this.chat(prompt, 'Lead Analysis')
  }

  // Analyze deals and provide strategy
  async analyzeDeals(deals: { title: string; value: number; stage: string }[]): Promise<string> {
    const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
    const stageBreakdown = deals.reduce((acc, d) => {
      acc[d.stage] = (acc[d.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const prompt = `Analyze these deals:
Total Pipeline Value: ₹${totalValue.toLocaleString()}
Stage Breakdown: ${JSON.stringify(stageBreakdown)}
Deals: ${JSON.stringify(deals, null, 2)}

Provide:
1. Pipeline health assessment
2. Revenue forecast
3. Recommendations for deal progression
4. Risk analysis`

    return this.chat(prompt, 'Deal Analysis')
  }

  // Generate growth strategy
  async generateGrowthStrategy(data: {
    leads: number
    deals: number
    revenue: number
    conversionRate: number
  }): Promise<string> {
    const prompt = `Generate a growth strategy based on these metrics:
- Total Leads: ${data.leads}
- Total Deals: ${data.deals}
- Revenue: ₹${data.revenue.toLocaleString()}
- Conversion Rate: ${data.conversionRate}%

Provide:
1. Quick wins for immediate impact
2. Medium-term strategies (1-3 months)
3. Long-term growth initiatives
4. Key metrics to track`

    return this.chat(prompt, 'Growth Strategy')
  }

  // Answer business questions
  async answerBusinessQuestion(question: string): Promise<string> {
    return this.chat(question, 'Business Q&A')
  }
}

// Export singleton instance
export const aiService = new AIService()
