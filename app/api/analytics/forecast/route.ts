/**
 * Analytics Forecast API
 * 
 * GET /api/analytics/forecast
 */

import { NextResponse } from 'next/server';
import { getAllForecasts } from '../../../../modules/kritvia-ai/analytics/forecasting';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'org_demo';
    
    const forecasts = await getAllForecasts(organizationId);
    
    return NextResponse.json({
      success: true,
      data: forecasts,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}
