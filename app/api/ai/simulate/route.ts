import { NextRequest, NextResponse } from 'next/server';
import { scenarioSimulator } from '@/modules/kritvia-ai/simulation';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioType, params } = body;

    if (!scenarioType || !params) {
      return NextResponse.json(
        { error: 'Scenario type and parameters are required' },
        { status: 400 }
      );
    }

    let result;

    switch (scenarioType) {
      case 'revenue':
        result = scenarioSimulator.simulateRevenueScenario(
          params.currentRevenue,
          params.growthRate,
          params.months
        );
        break;

      case 'conversion':
        result = scenarioSimulator.simulateConversionScenario(
          params.currentConversion,
          params.conversionChange,
          params.traffic,
          params.avgDealValue
        );
        break;

      case 'marketing':
        result = scenarioSimulator.simulateMarketingBudgetScenario(
          params.currentBudget,
          params.budgetChangePercent,
          params.currentROI
        );
        break;

      case 'team':
        result = scenarioSimulator.simulateTeamGrowthScenario(
          params.currentTeamSize,
          params.newHires,
          params.avgRevenuePerRep,
          params.rampUpMonths
        );
        break;

      case 'pipeline':
        result = scenarioSimulator.simulatePipelineScenario(
          params.currentPipeline,
          params.winRate,
          params.dealVelocityDays,
          params.accelerationDays
        );
        break;

      case 'churn':
        result = scenarioSimulator.simulateChurnReductionScenario(
          params.currentCustomers,
          params.currentChurnRate,
          params.churnReductionPercent,
          params.avgRevenuePerCustomer
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown scenario type: ${scenarioType}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      simulation: result,
    });
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: 'Failed to run simulation' },
      { status: 500 }
    );
  }
}
