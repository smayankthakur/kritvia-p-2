/**
 * Analytics Metrics API
 * 
 * GET /api/analytics/metrics
 */

import { NextResponse } from 'next/server';
import { calculateAllMetrics } from '../../../../modules/kritvia-ai/analytics/metrics';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'org_demo';
    
    const metrics = await calculateAllMetrics(organizationId);
    
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}
