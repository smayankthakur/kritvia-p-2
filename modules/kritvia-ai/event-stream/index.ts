/**
 * Real-Time AI Event Stream
 * 
 * Capture and process business events in real time.
 */

import { randomUUID } from 'crypto';

// Event Types
export type EventType =
  | 'deal_created'
  | 'deal_stage_changed'
  | 'deal_closed'
  | 'deal_lost'
  | 'campaign_launched'
  | 'campaign_ended'
  | 'campaign_performance_update'
  | 'customer_created'
  | 'customer_churn_detected'
  | 'customer_upgrade'
  | 'customer_downgrade'
  | 'revenue_target_updated'
  | 'pipeline_value_changed'
  | 'lead_created'
  | 'lead_converted'
  | 'task_created'
  | 'task_completed'
  | 'team_member_added'
  | 'budget_updated'
  | 'forecast_updated'
  | 'anomaly_detected'
  | 'opportunity_spotted';

// Event Interface
export interface AIEvent {
  id: string;
  eventType: EventType;
  organizationId: string;
  entityId: string;
  entityType?: string;
  metadata: Record<string, unknown>;
  createdAt: number;
  processedAt?: number;
}

// Event Subscriber
export type EventHandler = (event: AIEvent) => Promise<void> | void;

// In-memory storage
const eventStore: AIEvent[] = [];
const subscribers: Map<EventType | '*', EventHandler[]> = new Map();

// Event Producer
export class EventProducer {
  /**
   * Emit a new event
   */
  async emit(
    eventType: EventType,
    organizationId: string,
    entityId: string,
    metadata: Record<string, unknown> = {},
    entityType?: string
  ): Promise<AIEvent> {
    const event: AIEvent = {
      id: randomUUID(),
      eventType,
      organizationId,
      entityId,
      entityType,
      metadata,
      createdAt: Date.now(),
    };

    // Store event
    eventStore.push(event);
    
    // Keep only last 1000 events
    if (eventStore.length > 1000) {
      eventStore.shift();
    }

    // Notify subscribers
    await this.notifySubscribers(event);

    return event;
  }

  /**
   * Notify subscribers
   */
  private async notifySubscribers(event: AIEvent): Promise<void> {
    // Notify specific type subscribers
    const typeHandlers = subscribers.get(event.eventType) || [];
    for (const handler of typeHandlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Event handler error for ${event.eventType}:`, error);
      }
    }

    // Notify wildcard subscribers
    const wildcardHandlers = subscribers.get('*') || [];
    for (const handler of wildcardHandlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Wildcard event handler error:`, error);
      }
    }
  }
}

// Event Processor
export class EventProcessor {
  /**
   * Process events with custom logic
   */
  async process(event: AIEvent): Promise<AIEvent> {
    // Add processing timestamp
    const processed: AIEvent = {
      ...event,
      processedAt: Date.now(),
    };

    return processed;
  }

  /**
   * Get events by organization
   */
  async getByOrganization(
    organizationId: string,
    limit: number = 50
  ): Promise<AIEvent[]> {
    return eventStore
      .filter(e => e.organizationId === organizationId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get events by type
   */
  async getByType(
    eventType: EventType,
    organizationId?: string,
    limit: number = 50
  ): Promise<AIEvent[]> {
    return eventStore
      .filter(e => {
        if (e.eventType !== eventType) return false;
        if (organizationId && e.organizationId !== organizationId) return false;
        return true;
      })
      .slice(-limit)
      .reverse();
  }

  /**
   * Get recent events
   */
  async getRecent(limit: number = 20): Promise<AIEvent[]> {
    return eventStore.slice(-limit).reverse();
  }

  /**
   * Clear events
   */
  async clear(organizationId?: string): Promise<void> {
    if (organizationId) {
      const filtered = eventStore.filter(e => e.organizationId !== organizationId);
      eventStore.length = 0;
      eventStore.push(...filtered);
    } else {
      eventStore.length = 0;
    }
  }
}

// Event Subscriber Manager
export class EventSubscriber {
  /**
   * Subscribe to events
   */
  subscribe(eventType: EventType | '*', handler: EventHandler): () => void {
    const handlers = subscribers.get(eventType) || [];
    handlers.push(handler);
    subscribers.set(eventType, handlers);

    // Return unsubscribe function
    return () => {
      const current = subscribers.get(eventType) || [];
      const index = current.indexOf(handler);
      if (index > -1) {
        current.splice(index, 1);
        subscribers.set(eventType, current);
      }
    };
  }

  /**
   * Subscribe to specific event types
   */
  subscribeToTypes(eventTypes: EventType[], handler: EventHandler): () => void {
    const unsubscribers: (() => void)[] = [];
    
    for (const type of eventTypes) {
      unsubscribers.push(this.subscribe(type, handler));
    }

    // Return combined unsubscribe
    return () => {
      for (const unsub of unsubscribers) {
        unsub();
      }
    };
  }
}

// Export singletons
export const eventProducer = new EventProducer();
export const eventProcessor = new EventProcessor();
export const eventSubscriber = new EventSubscriber();

// Convenience functions
export async function emitEvent(
  eventType: EventType,
  organizationId: string,
  entityId: string,
  metadata: Record<string, unknown> = {},
  entityType?: string
): Promise<AIEvent> {
  return eventProducer.emit(eventType, organizationId, entityId, metadata, entityType);
}

export async function getOrganizationEvents(
  organizationId: string,
  limit?: number
): Promise<AIEvent[]> {
  return eventProcessor.getByOrganization(organizationId, limit);
}

// Predefined event creators
export function createDealEvent(
  organizationId: string,
  dealId: string,
  eventType: 'deal_created' | 'deal_stage_changed' | 'deal_closed' | 'deal_lost',
  metadata: Record<string, unknown>
) {
  return emitEvent(eventType, organizationId, dealId, metadata, 'deal');
}

export function createCustomerEvent(
  organizationId: string,
  customerId: string,
  eventType: 'customer_created' | 'customer_churn_detected' | 'customer_upgrade' | 'customer_downgrade',
  metadata: Record<string, unknown>
) {
  return emitEvent(eventType, organizationId, customerId, metadata, 'customer');
}

export function createCampaignEvent(
  organizationId: string,
  campaignId: string,
  eventType: 'campaign_launched' | 'campaign_ended' | 'campaign_performance_update',
  metadata: Record<string, unknown>
) {
  return emitEvent(eventType, organizationId, campaignId, metadata, 'campaign');
}

export function createRevenueEvent(
  organizationId: string,
  eventType: 'revenue_target_updated' | 'pipeline_value_changed' | 'forecast_updated',
  metadata: Record<string, unknown>
) {
  return emitEvent(eventType, organizationId, organizationId, metadata, 'revenue');
}
