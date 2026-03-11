import { NextRequest, NextResponse } from 'next/server';
import {
  recordFeedback,
  getFeedback,
  getFeedbackSummary,
  getFeedbackTrends,
  getRecommendationAccuracy,
} from '@/modules/kritvia-ai/feedback';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, recommendationId, feedbackType, rating, comment, userId, metadata } = body;

    if (!organizationId || !recommendationId || !feedbackType) {
      return NextResponse.json(
        { error: 'Organization ID, recommendation ID, and feedback type are required' },
        { status: 400 }
      );
    }

    const feedback = await recordFeedback(organizationId, recommendationId, {
      feedbackType,
      rating,
      comment,
      userId,
      metadata,
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to record feedback' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId');
    const type = searchParams.get('type'); // 'summary', 'trends', 'accuracy'

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    if (type === 'summary') {
      const summary = await getFeedbackSummary(organizationId);
      return NextResponse.json({ success: true, ...summary });
    }

    if (type === 'trends') {
      const days = parseInt(searchParams.get('days') || '30');
      const trends = await getFeedbackTrends(organizationId, days);
      return NextResponse.json({ success: true, ...trends });
    }

    if (type === 'accuracy') {
      const accuracy = await getRecommendationAccuracy(organizationId);
      return NextResponse.json({ success: true, accuracy });
    }

    // Default: get recent feedback
    const limit = parseInt(searchParams.get('limit') || '50');
    const feedback = await getFeedback(organizationId, limit);

    return NextResponse.json({
      success: true,
      feedback,
      count: feedback.length,
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to get feedback' },
      { status: 500 }
    );
  }
}
