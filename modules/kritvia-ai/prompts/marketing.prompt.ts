export class MarketingPrompt {
  getAnalysisPrompt(input: any) {
    return `
      As a Marketing AI Agent, analyze the following marketing-related query:
      "${input.query}"
      
      Context: ${JSON.stringify(input.context || {})}
      
      Provide insights on campaign performance, audience targeting, 
      channel effectiveness, and marketing ROI. Focus on metrics like 
      CAC, LTV, conversion rates, and engagement.
      
      Determine if you need to query CRM data or analytics to provide 
      data-driven marketing recommendations.
    `;
  }
}