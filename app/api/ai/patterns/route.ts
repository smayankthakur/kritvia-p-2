import { NextRequest, NextResponse } from 'next/server';
import { detectAllPatterns, patternDetectionEngine } from '@/modules/kritvia-ai/patterns';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, data } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const patterns = await detectAllPatterns(organizationId, data || {});

    return NextResponse.json({
      success: true,
      patterns,
      count: patterns.length,
    });
  } catch (error) {
    console.error('Pattern detection error:', error);
    return NextResponse.json(
      { error: 'Failed to detect patterns' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId');
    const type = searchParams.get('type') as 'revenue' | 'sales' | 'customer' | 'marketing' | 'operations' | null;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    let patterns;
    if (type) {
      patterns = await patternDetectionEngine.getPatternsByType(organizationId, type);
    } else {
      patterns = await patternDetectionEngine.getPatterns(organizationId);
    }

    return NextResponse.json({
      success: true,
      patterns,
      count: patterns.length,
    });
  } catch (error) {
    console.error('Get patterns error:', error);
    return NextResponse.json(
      { error: 'Failed to get patterns' },
      { status: 500 }
    );
  }
}
