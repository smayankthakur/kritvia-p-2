export class SalesPrompt {
  getAnalysisPrompt(input: any) {
    return `
      As a Sales AI Agent, analyze the following sales-related query:
      "${input.query}"
      
      Context: ${JSON.stringify(input.context || {})}
      
      Provide insights on lead conversion, pipeline optimization, 
      sales forecasting, and customer acquisition strategies. 
      Focus on metrics like conversion rates, deal velocity, and 
      customer lifetime value.
      
      Determine if you need to query CRM data or analytics to provide 
      data-driven sales recommendations.
    `;
  }
}