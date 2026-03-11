import { NextRequest, NextResponse } from 'next/server';
import { autonomyEngine, triggerWorkflows } from '@/modules/kritvia-ai/autonomy';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, organizationId, eventId, eventData } = body;

    if (!eventType || !organizationId || !eventId) {
      return NextResponse.json(
        { error: 'Event type, organization ID, and event ID are required' },
        { status: 400 }
      );
    }

    const executions = await triggerWorkflows(eventType, organizationId, eventId, eventData || {});

    return NextResponse.json({
      success: true,
      executions,
      count: executions.length,
    });
  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflows' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId') || 'default';
    const action = searchParams.get('action');

    if (action === 'list') {
      const workflows = await autonomyEngine.getWorkflows();
      return NextResponse.json({ success: true, workflows });
    }

    // Get workflow executions
    const executions = await autonomyEngine.getExecutions(organizationId);

    return NextResponse.json({
      success: true,
      executions,
      count: executions.length,
    });
  } catch (error) {
    console.error('Get workflows error:', error);
    return NextResponse.json(
      { error: 'Failed to get workflows' },
      { status: 500 }
    );
  }
}
