/**
 * Predictive Scenario Simulator
 * 
 * Allows AI to simulate business outcomes based on hypothetical changes.
 */

export interface SimulationResult {
  scenario: string;
  description: string;
  currentValue: number;
  projectedValue: number;
  change: number;
  changePercent: number;
  confidenceScore: number;
  factors: string[];
  recommendations: string[];
}

// Scenario Simulator
export class ScenarioSimulator {
  /**
   * Simulate revenue scenario
   */
  simulateRevenueScenario(
    currentRevenue: number,
    growthRate: number,
    months: number = 12
  ): SimulationResult {
    // Calculate compound growth
    let projected = currentRevenue;
    const monthlyGrowth = growthRate / 100 / 12;
    
    for (let i = 0; i < months; i++) {
      projected *= (1 + monthlyGrowth);
    }
    
    const change = projected - currentRevenue;
    const changePercent = (change / currentRevenue) * 100;
    
    return {
      scenario: 'Revenue Growth',
      description: `If revenue grows at ${growthRate}% annually`,
      currentValue: currentRevenue,
      projectedValue: Math.round(projected),
      change: Math.round(change),
      changePercent: Math.round(changePercent * 10) / 10,
      confidenceScore: 0.75,
      factors: [
        'Current revenue trajectory',
        'Market growth rate',
        'Sales team capacity',
      ],
      recommendations: [
        'Ensure sales capacity matches growth targets',
        'Monitor customer acquisition costs',
        'Plan for increased support needs',
      ],
    };
  }

  /**
   * Simulate conversion rate change impact
   */
  simulateConversionScenario(
    currentConversion: number,
    conversionChange: number,
    traffic: number,
    avgDealValue: number
  ): SimulationResult {
    const newConversion = currentConversion + conversionChange;
    const currentDeals = traffic * (currentConversion / 100);
    const newDeals = traffic * (newConversion / 100);
    const additionalDeals = newDeals - currentDeals;
    
    const currentRevenue = currentDeals * avgDealValue;
    const projectedRevenue = newDeals * avgDealValue;
    const change = projectedRevenue - currentRevenue;
    const changePercent = (change / currentRevenue) * 100;
    
    return {
      scenario: 'Conversion Rate Impact',
      description: `If conversion rate changes from ${currentConversion}% to ${newConversion}%`,
      currentValue: Math.round(currentRevenue),
      projectedValue: Math.round(projectedRevenue),
      change: Math.round(change),
      changePercent: Math.round(changePercent * 10) / 10,
      confidenceScore: 0.72,
      factors: [
        `Current conversion: ${currentConversion}%`,
        `Traffic: ${traffic} visitors/month`,
        `Avg deal value: $${avgDealValue}`,
      ],
      recommendations: conversionChange > 0 ? [
        'Implement conversion optimization initiatives',
        'A/B test landing pages',
        'Improve lead scoring',
      ] : [
        'Review funnel for bottlenecks',
        'Analyze drop-off points',
        'Consider lead quality review',
      ],
    };
  }

  /**
   * Simulate marketing budget change impact
   */
  simulateMarketingBudgetScenario(
    currentBudget: number,
    budgetChangePercent: number,
    currentROI: number
  ): SimulationResult {
    const newBudget = currentBudget * (1 + budgetChangePercent / 100);
    // Assume diminishing returns - 80% efficiency for extra spend
    const efficiencyFactor = budgetChangePercent > 0 ? 0.8 : 1;
    const roiChange = currentROI * efficiencyFactor * (budgetChangePercent / 100);
    const newROI = currentROI + roiChange;
    
    const currentValue = currentBudget * (currentROI / 100);
    const projectedValue = newBudget * (newROI / 100);
    const change = projectedValue - currentValue;
    const changePercent = (change / currentValue) * 100;
    
    return {
      scenario: 'Marketing Budget Impact',
      description: `If marketing budget ${budgetChangePercent > 0 ? 'increases' : 'decreases'} by ${Math.abs(budgetChangePercent)}%`,
      currentValue: Math.round(currentValue),
      projectedValue: Math.round(projectedValue),
      change: Math.round(change),
      changePercent: Math.round(changePercent * 10) / 10,
      confidenceScore: 0.68,
      factors: [
        `Current budget: $${currentBudget.toLocaleString()}`,
        `Current ROI: ${currentROI}%`,
        'Diminishing returns factor: 20%',
      ],
      recommendations: budgetChangePercent > 0 ? [
        'Focus budget on highest ROI channels',
        'Monitor CAC closely',
        'Test before scaling',
      ] : [
        'Protect core channels',
        'Prioritize high-converting campaigns',
        'Look for efficiency gains',
      ],
    };
  }

  /**
   * Simulate team growth impact
   */
  simulateTeamGrowthScenario(
    currentTeamSize: number,
    newHires: number,
    avgRevenuePerRep: number,
    rampUpMonths: number = 3
  ): SimulationResult {
    const currentRevenue = currentTeamSize * avgRevenuePerRep;
    const effectiveNewHires = newHires * (rampUpMonths / 12); // Partial year contribution
    const projectedRevenue = (currentTeamSize + effectiveNewHires) * avgRevenuePerRep;
    
    const change = projectedRevenue - currentRevenue;
    const changePercent = (change / currentRevenue) * 100;
    
    return {
      scenario: 'Team Growth Impact',
      description: `If team grows by ${newHires} reps (${rampUpMonths} month ramp-up)`,
      currentValue: Math.round(currentRevenue),
      projectedValue: Math.round(projectedRevenue),
      change: Math.round(change),
      changePercent: Math.round(changePercent * 10) / 10,
      confidenceScore: 0.78,
      factors: [
        `Current team: ${currentTeamSize} reps`,
        `New hires: ${newHires}`,
        `Avg revenue/rep: $${avgRevenuePerRep.toLocaleString()}`,
        `Ramp-up period: ${rampUpMonths} months`,
      ],
      recommendations: [
        'Plan onboarding process',
        'Assign mentors to new reps',
        'Ensure CRM data access',
        'Set realistic ramp-up expectations',
      ],
    };
  }

  /**
   * Simulate pipeline scenario
   */
  simulatePipelineScenario(
    currentPipeline: number,
    winRate: number,
    dealVelocityDays: number,
    accelerationDays: number = 0
  ): SimulationResult {
    const newVelocity = dealVelocityDays - accelerationDays;
    const velocityImprovement = (accelerationDays / dealVelocityDays) * 100;
    
    // More velocity = more deals closed in same time period
    const currentDeals = currentPipeline / 365 * dealVelocityDays;
    const projectedDeals = currentPipeline / 365 * newVelocity;
    const additionalDeals = projectedDeals - currentDeals;
    
    // Simplified: each accelerated deal worth avg $30K
    const avgDealValue = 30000;
    const currentValue = currentPipeline * (winRate / 100);
    const projectedValue = (currentPipeline + (additionalDeals * avgDealValue)) * (winRate / 100);
    
    const change = projectedValue - currentValue;
    const changePercent = (change / currentValue) * 100;
    
    return {
      scenario: 'Pipeline Velocity Impact',
      description: `If deal velocity improves by ${accelerationDays} days`,
      currentValue: Math.round(currentValue),
      projectedValue: Math.round(projectedValue),
      change: Math.round(change),
      changePercent: Math.round(changePercent * 10) / 10,
      confidenceScore: 0.71,
      factors: [
        `Current pipeline: $${currentPipeline.toLocaleString()}`,
        `Win rate: ${winRate}%`,
        `Current velocity: ${dealVelocityDays} days`,
        `Velocity improvement: ${velocityImprovement.toFixed(0)}%`,
      ],
      recommendations: [
        'Streamline proposal process',
        'Reduce approval bottlenecks',
        'Implement automated follow-ups',
        'Focus on stalled deals',
      ],
    };
  }

  /**
   * Simulate churn reduction impact
   */
  simulateChurnReductionScenario(
    currentCustomers: number,
    currentChurnRate: number,
    churnReductionPercent: number,
    avgRevenuePerCustomer: number
  ): SimulationResult {
    const newChurnRate = currentChurnRate * (1 - churnReductionPercent / 100);
    const churnedCustomers = currentCustomers * (currentChurnRate / 100);
    const newChurnedCustomers = currentCustomers * (newChurnRate / 100);
    const retainedCustomers = churnedCustomers - newChurnedCustomers;
    
    const currentValue = churnedCustomers * avgRevenuePerCustomer;
    const projectedValue = retainedCustomers * avgRevenuePerCustomer;
    const change = projectedValue;
    const changePercent = (change / currentValue) * 100;
    
    return {
      scenario: 'Churn Reduction Impact',
      description: `If churn reduces by ${churnReductionPercent}%`,
      currentValue: Math.round(currentValue),
      projectedValue: Math.round(projectedValue),
      change: Math.round(change),
      changePercent: Math.round(changePercent * 10) / 10,
      confidenceScore: 0.74,
      factors: [
        `Current customers: ${currentCustomers}`,
        `Churn rate: ${currentChurnRate}%`,
        `Churn reduction: ${churnReductionPercent}%`,
        `Avg revenue/customer: $${avgRevenuePerCustomer}`,
      ],
      recommendations: [
        'Implement proactive customer success',
        'Identify at-risk customers early',
        'Improve onboarding process',
        'Develop retention programs',
      ],
    };
  }
}

// Export singleton
export const scenarioSimulator = new ScenarioSimulator();

// Helper to format currency
export function formatCurrency(value: number): string {
  if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
  if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
  return '$' + value.toFixed(0);
}
