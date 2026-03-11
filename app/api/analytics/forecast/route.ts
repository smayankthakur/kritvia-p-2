/**
 * Analytics Forecast API
 * 
 * GET /api/analytics/forecast
 */

import { NextResponse } from 'next/server';

// Mock forecast data
const mockForecasts = {
  revenue: [
    { month: 'Apr', predicted: 280000, confidence: 0.85, historical: null },
    { month: 'May', predicted: 310000, confidence: 0.82, historical: null },
    { month: 'Jun', predicted: 345000, confidence: 0.78, historical: null },
  ],
  pipeline: [
    { month: 'Apr', predicted: 2100000, confidence: 0.80 },
    { month: 'May', predicted: 2350000, confidence: 0.77 },
    { month: 'Jun', predicted: 2600000, confidence: 0.75 },
  ],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'org_demo';
    
    return NextResponse.json({
      success: true,
      data: mockForecasts,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}
