/**
 * Analytics Metrics API
 * 
 * GET /api/analytics/metrics
 */

import { NextResponse } from 'next/server';

// Mock metrics data
const mockMetrics = {
  metrics: [
    { metric: 'revenue', value: 245000, change: '+12.5%', trend: 'up' as const },
    { metric: 'pipeline_value', value: 1850000, change: '+8.3%', trend: 'up' as const },
    { metric: 'conversion_rate', value: 3.2, change: '+0.4%', trend: 'up' as const },
    { metric: 'deals_won', value: 28, change: '+15%', trend: 'up' as const },
    { metric: 'customer_acquisition', value: 15, change: '+20%', trend: 'up' as const },
    { metric: 'avg_deal_size', value: 8750, change: '+5.2%', trend: 'up' as const },
    { metric: 'sales_cycle_days', value: 32, change: '-3 days', trend: 'down' as const },
    { metric: 'churn_rate', value: 2.1, change: '-0.5%', trend: 'down' as const },
  ],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'org_demo';
    
    return NextResponse.json({
      success: true,
      data: mockMetrics,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}
