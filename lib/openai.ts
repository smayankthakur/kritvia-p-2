import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface BusinessData {
  leads?: any[]
  deals?: any[]
  revenue?: number
}

export async function analyzeBusiness(data: BusinessData): Promise<string> {
  const prompt = `
    As a business analyst AI, analyze the following business data and provide insights:
    
    ${data.leads ? `Leads: ${JSON.stringify(data.leads)}` : 'No leads data'}
    ${data.deals ? `Deals: ${JSON.stringify(data.deals)}` : 'No deals data'}
    ${data.revenue ? `Revenue: ₹${data.revenue}` : 'No revenue data'}
    
    Provide actionable insights about:
    1. Lead quality and conversion potential
    2. Deal pipeline health
    3. Growth opportunities
    4. Recommended next steps
    
    Keep the response concise and business-focused.
  `

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    })
    return completion.choices[0]?.message?.content || 'Unable to generate insights'
  } catch (error) {
    console.error('OpenAI API error:', error)
    return 'Error generating insights. Please try again.'
  }
}

export async function generateInsights(data: BusinessData): Promise<string> {
  const prompt = `
    Generate 5 quick business insights based on:
    - Total Leads: ${data.leads?.length || 0}
    - Total Deals: ${data.deals?.length || 0}
    - Revenue: ₹${data.revenue || 0}
    
    Provide bullet-point insights.
  `

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    })
    return completion.choices[0]?.message?.content || 'Unable to generate insights'
  } catch (error) {
    console.error('OpenAI API error:', error)
    return 'Error generating insights. Please try again.'
  }
}

export async function chat(prompt: string, context?: string): Promise<string> {
  const fullPrompt = context 
    ? `Context: ${context}\n\nUser: ${prompt}`
    : prompt

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are Kritvia, an AI business operating system assistant. You help businesses with CRM, leads, deals, and growth strategy. Be concise, helpful, and professional.' 
        },
        { role: 'user', content: fullPrompt }
      ],
      max_tokens: 1000,
    })
    return completion.choices[0]?.message?.content || 'Unable to process your request'
  } catch (error) {
    console.error('OpenAI API error:', error)
    return 'Error processing your request. Please try again.'
  }
}

export default openai
