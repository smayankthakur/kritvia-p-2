/**
 * Analytics Dashboard API
 * 
 * GET /api/analytics/dashboard
 * Returns all analytics data for dashboard
 */

export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

// Mock data for analytics
const mockMetrics = [
  { metric: 'revenue', value: 245000, change: '+12.5%', trend: 'up' as const },
  { metric: 'pipeline_value', value: 1850000, change: '+8.3%', trend: 'up' as const },
  { metric: 'conversion_rate', value: 3.2, change: '+0.4%', trend: 'up' as const },
  { metric: 'deals_won', value: 28, change: '+15%', trend: 'up' as const },
  { metric: 'customer_acquisition', value: 15, change: '+20%', trend: 'up' as const },
];

const mockWeeklyData = [
  { week: 'Week 1', revenue: 45000, deals: 5, leads: 120 },
  { week: 'Week 2', revenue: 52000, deals: 7, leads: 145 },
  { week: 'Week 3', revenue: 48000, deals: 6, leads: 132 },
  { week: 'Week 4', revenue: 61000, deals: 8, leads: 168 },
];

const mockForecasts = {
  revenue: [
    { month: 'Apr', predicted: 280000, confidence: 0.85 },
    { month: 'May', predicted: 310000, confidence: 0.82 },
    { month: 'Jun', predicted: 345000, confidence: 0.78 },
  ],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'org_demo';
    
    // Get key metrics
    const revenue = mockMetrics.find(m => m.metric === 'revenue');
    const pipeline = mockMetrics.find(m => m.metric === 'pipeline_value');
    const conversion = mockMetrics.find(m => m.metric === 'conversion_rate');
    
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
        metrics: mockMetrics,
        // Weekly data for charts
        weeklyData: mockWeeklyData,
        // Forecasts
        forecasts: mockForecasts,
        // Recent activity
        recentActivity: [
          { id: 1, type: 'deal_won', description: 'Closed deal with Acme Corp', value: 45000, timestamp: Date.now() - 3600000 },
          { id: 2, type: 'lead_created', description: 'New lead from website', timestamp: Date.now() - 7200000 },
          { id: 3, type: 'campaign_started', description: 'Q2 Email Campaign launched', timestamp: Date.now() - 10800000 },
        ],
      },
      organizationId,
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
