import { NextRequest, NextResponse } from 'next/server';
import { agentCoordinator, coordinateAgents } from '@/modules/kritvia-ai/agent-coordinator';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, organizationId, eventId, context } = body;

    if (!eventType || !organizationId || !eventId) {
      return NextResponse.json(
        { error: 'Event type, organization ID, and event ID are required' },
        { status: 400 }
      );
    }

    const tasks = await coordinateAgents(eventType, organizationId, eventId, context || {});

    return NextResponse.json({
      success: true,
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('Agent coordination error:', error);
    return NextResponse.json(
      { error: 'Failed to coordinate agents' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId') || 'default';
    const action = searchParams.get('action');

    if (action === 'active') {
      const activeTasks = await agentCoordinator.getActiveTasks();
      return NextResponse.json({ success: true, tasks: activeTasks });
    }

    if (action === 'stats') {
      const stats = await agentCoordinator.getAgentStats(organizationId);
      return NextResponse.json({ success: true, stats });
    }

    // Get organization tasks
    const tasks = await agentCoordinator.getOrganizationTasks(organizationId);

    return NextResponse.json({
      success: true,
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to get tasks' },
      { status: 500 }
    );
  }
}
