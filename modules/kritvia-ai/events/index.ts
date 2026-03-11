/**
 * Event-Driven Automation System
 * 
 * Handles real-time event triggers and automated workflows.
 */

import { EventEmitter } from 'events';

export interface KritviaEvent {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: EventTrigger;
  conditions: Condition[];
  actions: Action[];
  enabled: boolean;
  priority: number;
}

export interface EventTrigger {
  type: 'event' | 'schedule' | 'webhook';
  eventType?: string;
  schedule?: string;
  webhook?: string;
}

export interface Condition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
  value: unknown;
}

export interface Action {
  type: 'send_email' | 'create_task' | 'update_record' | 'notify' | 'webhook' | 'ai_analysis';
  params: Record<string, unknown>;
}

export interface EventSubscription {
  id: string;
  eventType: string;
  callback: (event: KritviaEvent) => void;
  filter?: Record<string, unknown>;
}

class KritviaEventBus extends EventEmitter {
  private subscriptions: Map<string, EventSubscription[]> = new Map();
  private eventHistory: KritviaEvent[] = [];
  private maxHistorySize = 1000;

  /**
   * Emit an event to the bus
   */
  emitEvent(event: KritviaEvent): void {
    event.id = event.id || `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    event.timestamp = event.timestamp || new Date();
    
    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
    
    // Emit to listeners
    this.emit(event.type, event);
    this.emit('*', event);
  }

  /**
   * Subscribe to specific event type
   */
  subscribe(eventType: string, callback: (event: KritviaEvent) => void, filter?: Record<string, unknown>): string {
    const subscription: EventSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      eventType,
      callback,
      filter,
    };
    
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }
    this.subscriptions.get(eventType)!.push(subscription);
    
    return subscription.id;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): boolean {
    for (const eventType of Array.from(this.subscriptions.keys())) {
      const subs = this.subscriptions.get(eventType);
      if (!subs) continue;
      const index = subs.findIndex((s: EventSubscription) => s.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Get event history
   */
  getHistory(eventType?: string, limit = 100): KritviaEvent[] {
    let events = this.eventHistory;
    
    if (eventType) {
      events = events.filter(e => e.type === eventType);
    }
    
    return events.slice(-limit);
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }
}

/**
 * Automation Engine
 * Evaluates rules and executes actions
 */
class AutomationEngine {
  private rules: Map<string, AutomationRule> = new Map();
  private eventBus: KritviaEventBus;
  private executionQueue: Array<{ rule: AutomationRule; event: KritviaEvent }> = [];
  private isProcessing = false;

  constructor(eventBus: KritviaEventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Register an automation rule
   */
  registerRule(rule: AutomationRule): void {
    this.rules.set(rule.id, rule);
    
    // Subscribe to trigger events
    if (rule.trigger.type === 'event' && rule.trigger.eventType) {
      this.eventBus.subscribe(rule.trigger.eventType, async (event) => {
        if (this.evaluateConditions(rule.conditions, event)) {
          await this.executeRule(rule, event);
        }
      });
    }
  }

  /**
   * Remove a rule
   */
  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  /**
   * Evaluate conditions
   */
  private evaluateConditions(conditions: Condition[], event: KritviaEvent): boolean {
    return conditions.every(condition => {
      const fieldValue = this.getNestedValue(event, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        default:
          return false;
      }
    });
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((current: unknown, key) => {
      if (current && typeof current === 'object') {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  /**
   * Execute automation rule
   */
  private async executeRule(rule: AutomationRule, event: KritviaEvent): Promise<void> {
    if (!rule.enabled) return;
    
    console.log(`[Automation] Executing rule: ${rule.name}`);
    
    for (const action of rule.actions) {
      try {
        await this.executeAction(action, event);
      } catch (error) {
        console.error(`[Automation] Action failed:`, error);
      }
    }
  }

  /**
   * Execute a single action
   */
  private async executeAction(action: Action, event: KritviaEvent): Promise<void> {
    console.log(`[Automation] Executing action: ${action.type}`, action.params);
    
    switch (action.type) {
      case 'send_email':
        // Implement email sending
        break;
      case 'create_task':
        // Implement task creation
        break;
      case 'update_record':
        // Implement record update
        break;
      case 'notify':
        // Implement notification
        break;
      case 'webhook':
        // Implement webhook call
        break;
      case 'ai_analysis':
        // Trigger AI analysis
        break;
    }
  }

  /**
   * Get all rules
   */
  getRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }
}

// Export singleton instances
export const eventBus = new KritviaEventBus();
export const automationEngine = new AutomationEngine(eventBus);

/**
 * Predefined event types
 */
export const EventTypes = {
  LEAD_CREATED: 'lead.created',
  LEAD_UPDATED: 'lead.updated',
  LEAD_CONVERTED: 'lead.converted',
  DEAL_CREATED: 'deal.created',
  DEAL_UPDATED: 'deal.updated',
  DEAL_WON: 'deal.won',
  DEAL_LOST: 'deal.lost',
  CONTACT_CREATED: 'contact.created',
  CONTACT_UPDATED: 'contact.updated',
  TASK_COMPLETED: 'task.completed',
  TASK_OVERDUE: 'task.overdue',
  EMAIL_RECEIVED: 'email.received',
  EMAIL_SENT: 'email.sent',
  MEETING_SCHEDULED: 'meeting.scheduled',
  MEETING_COMPLETED: 'meeting.completed',
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_FAILED: 'payment.failed',
  AI_INSIGHT_GENERATED: 'ai.insight_generated',
  AI_RECOMMENDATION: 'ai.recommendation',
  AI_ANALYSIS_COMPLETE: 'ai.analysis_complete',
};

/**
 * Helper to create events
 */
export function createEvent(
  type: string,
  source: string,
  payload: Record<string, unknown>,
  metadata?: Record<string, unknown>
): KritviaEvent {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type,
    source,
    timestamp: new Date(),
    payload,
    metadata,
  };
}

/**
 * Emit a business event
 */
export function emitBusinessEvent(
  type: string,
  source: string,
  payload: Record<string, unknown>,
  metadata?: Record<string, unknown>
): void {
  const event = createEvent(type, source, payload, metadata);
  eventBus.emitEvent(event);
}

export default {
  eventBus,
  automationEngine,
  EventTypes,
  createEvent,
  emitBusinessEvent,
};
