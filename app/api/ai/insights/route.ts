import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationInsights, eventIntelligence } from '@/modules/kritvia-ai/event-intelligence';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId') || 'default';
    const insightId = searchParams.get('insightId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Acknowledge insight
    if (insightId) {
      const acknowledged = await eventIntelligence.acknowledgeInsight(insightId, organizationId);
      return NextResponse.json({ success: acknowledged });
    }

    // Get insights
    const insights = await getOrganizationInsights(organizationId, limit);

    return NextResponse.json({
      success: true,
      insights,
      count: insights.length,
    });
  } catch (error) {
    console.error('Insights error:', error);
    return NextResponse.json(
      { error: 'Failed to get insights' },
      { status: 500 }
    );
  }
}
