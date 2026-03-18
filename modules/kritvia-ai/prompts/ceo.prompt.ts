export class CEOPrompt {
  getAnalysisPrompt(input: any) {
    return `
      As a CEO AI Agent, analyze the following business query:
      "${input.query}"
      
      Context: ${JSON.stringify(input.context || {})}
      
      Provide strategic insights and recommendations for business growth, 
      operational efficiency, and market positioning. Consider financial 
      implications, resource allocation, and risk assessment.
      
      Determine if you need to query CRM data or analytics to provide 
      data-driven recommendations.
    `;
  }
}