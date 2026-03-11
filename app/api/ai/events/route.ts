import { NextRequest, NextResponse } from 'next/server';
import { eventProducer, eventProcessor, emitEvent } from '@/modules/kritvia-ai/event-stream';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, organizationId, entityId, metadata, entityType } = body;

    if (!eventType || !organizationId || !entityId) {
      return NextResponse.json(
        { error: 'Event type, organization ID, and entity ID are required' },
        { status: 400 }
      );
    }

    const event = await emitEvent(eventType, organizationId, entityId, metadata || {}, entityType);

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Event emission error:', error);
    return NextResponse.json(
      { error: 'Failed to emit event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId');
    const eventType = searchParams.get('eventType');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (eventType) {
      const events = await eventProcessor.getByType(
        eventType as any,
        organizationId || undefined,
        limit
      );
      return NextResponse.json({ success: true, events, count: events.length });
    }

    if (organizationId) {
      const events = await eventProcessor.getByOrganization(organizationId, limit);
      return NextResponse.json({ success: true, events, count: events.length });
    }

    // Get all recent events
    const events = await eventProcessor.getRecent(limit);
    return NextResponse.json({ success: true, events, count: events.length });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Failed to get events' },
      { status: 500 }
    );
  }
}
