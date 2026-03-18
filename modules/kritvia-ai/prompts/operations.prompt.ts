export class OperationsPrompt {
  getAnalysisPrompt(input: any) {
    return `
      As an Operations AI Agent, analyze the following operations-related query:
      "${input.query}"
      
      Context: ${JSON.stringify(input.context || {})}
      
      Provide insights on workflow optimization, resource allocation, 
      process efficiency, and operational excellence. Focus on metrics like 
      cycle time, throughput, utilization rates, and bottlenecks.
      
      Determine if you need to query CRM data or analytics to provide 
      data-driven operations recommendations.
    `;
  }
}