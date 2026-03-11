/**
 * Analytics Dashboard API
 * 
 * GET /api/analytics/dashboard
 * Returns all analytics data for dashboard
 */

import { NextResponse } from 'next/server';
import { calculateAllMetrics } from '../../../../modules/kritvia-ai/analytics/metrics';
import { getAllForecasts } from '../../../../modules/kritvia-ai/analytics/forecasting';
import { aggregateWeeklyStats } from '../../../../modules/kritvia-ai/analytics/data-aggregator';
import { getAIInsights } from '../../../../modules/kritvia-ai/engine/orchestrator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'org_demo';
    
    // Get all analytics data in parallel
    const [metrics, forecasts, weeklyStats, insights] = await Promise.all([
      calculateAllMetrics(organizationId),
      getAllForecasts(organizationId),
      aggregateWeeklyStats(organizationId),
      getAIInsights(organizationId, 5),
    ]);
    
    // Get key metrics
    const revenue = metrics.metrics.find(m => m.metric === 'revenue');
    const pipeline = metrics.metrics.find(m => m.metric === 'pipeline_value');
    const conversion = metrics.metrics.find(m => m.metric === 'conversion_rate');
    
    return NextResponse.json({
      success: true,
      data: {
        // Summary
        summary: {
          revenue: revenue?.value || 0,
          revenueChange: revenue?.change || '0%',
          pipeline: pipeline?.value || 0,
          pipelineChange: pipeline?.change || '0%',
          conversion: conversion?.value || 0,
          conversionChange: conversion?.change || '0%',
        },
        // Metrics
        metrics: metrics.metrics,
        // Weekly data for charts
        weeklyData: weeklyStats,
        // Forecasts
        forecasts: {
          revenue: forecasts.revenue.slice(0, 3),
          deals: forecasts.deals.slice(0, 5),
        },
        // AI Insights
        insights: insights.map(i => ({
          id: i.id,
          title: i.title,
          description: i.description,
          confidence: i.confidence,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}
