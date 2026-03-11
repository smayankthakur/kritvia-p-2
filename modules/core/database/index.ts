/**
 * Database Layer
 * 
 * Persistent storage with Supabase integration.
 * Currently uses in-memory storage for development.
 * 
 * To enable Supabase:
 * 1. npm install @supabase/supabase-js
 * 2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env
 */

// Database types
export interface DbOrganization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DbUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbMembership {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  created_at: string;
}

export interface DbLead {
  id: string;
  organization_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  source?: string;
  value?: number;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface DbDeal {
  id: string;
  organization_id: string;
  name: string;
  value?: number;
  stage: string;
  probability?: number;
  lead_id?: string;
  contact_id?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DbTask {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DbAIInsight {
  id: string;
  organization_id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  data: Record<string, unknown>;
  created_at: string;
}

export interface DbAIAction {
  id: string;
  organization_id: string;
  user_id: string;
  type: string;
  description: string;
  status: string;
  result?: Record<string, unknown>;
  created_at: string;
  completed_at?: string;
}

export interface DbAIActivity {
  id: string;
  organization_id: string;
  user_id?: string;
  agent_id?: string;
  type: string;
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface DbAIMemory {
  id: string;
  organization_id: string;
  user_id?: string;
  type: string;
  data: Record<string, unknown>;
  created_at: string;
}

export interface DbAIUsage {
  id: string;
  organization_id: string;
  requests: number;
  tokens_used: number;
  actions_executed: number;
  period: string;
  created_at: string;
}

// In-memory storage for demo mode
const inMemoryDb: {
  leads: DbLead[];
  deals: DbDeal[];
  tasks: DbTask[];
  aiInsights: DbAIInsight[];
  aiActions: DbAIAction[];
  aiActivities: DbAIActivity[];
  aiMemories: DbAIMemory[];
  aiUsage: DbAIUsage[];
} = {
  leads: [],
  deals: [],
  tasks: [],
  aiInsights: [],
  aiActions: [],
  aiActivities: [],
  aiMemories: [],
  aiUsage: [],
};

// Initialize demo data
function initializeDemoData() {
  // Demo lead
  inMemoryDb.leads.push({
    id: 'lead_demo',
    organization_id: 'org_demo',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    status: 'new',
    source: 'website',
    value: 10000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  inMemoryDb.leads.push({
    id: 'lead_demo2',
    organization_id: 'org_demo',
    name: 'Jane Smith',
    email: 'jane@techstart.io',
    company: 'TechStart',
    status: 'qualified',
    source: 'referral',
    value: 25000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Demo deals
  inMemoryDb.deals.push({
    id: 'deal_demo',
    organization_id: 'org_demo',
    name: 'Acme Enterprise Deal',
    value: 50000,
    stage: 'proposal',
    probability: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  inMemoryDb.deals.push({
    id: 'deal_demo2',
    organization_id: 'org_demo',
    name: 'TechStart MVP',
    value: 15000,
    stage: 'negotiation',
    probability: 80,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Demo tasks
  inMemoryDb.tasks.push({
    id: 'task_demo',
    organization_id: 'org_demo',
    title: 'Follow up with Acme',
    description: 'Schedule a demo call',
    status: 'pending',
    priority: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  inMemoryDb.tasks.push({
    id: 'task_demo2',
    organization_id: 'org_demo',
    title: 'Prepare proposal for TechStart',
    description: 'Create detailed pricing proposal',
    status: 'in_progress',
    priority: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

initializeDemoData();

/**
 * Lead Operations
 */
export const leadOperations = {
  async create(organizationId: string, data: Partial<DbLead>): Promise<DbLead> {
    const lead: DbLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      organization_id: organizationId,
      name: data.name || '',
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status || 'new',
      source: data.source,
      value: data.value,
      assigned_to: data.assigned_to,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryDb.leads.push(lead);
    return lead;
  },

  async getById(id: string): Promise<DbLead | null> {
    return inMemoryDb.leads.find(l => l.id === id) || null;
  },

  async getByOrganization(organizationId: string): Promise<DbLead[]> {
    return inMemoryDb.leads.filter(l => l.organization_id === organizationId);
  },

  async update(id: string, data: Partial<DbLead>): Promise<DbLead | null> {
    const idx = inMemoryDb.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    
    inMemoryDb.leads[idx] = {
      ...inMemoryDb.leads[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return inMemoryDb.leads[idx];
  },

  async delete(id: string): Promise<boolean> {
    const idx = inMemoryDb.leads.findIndex(l => l.id === id);
    if (idx === -1) return false;
    inMemoryDb.leads.splice(idx, 1);
    return true;
  },
};

/**
 * Deal Operations
 */
export const dealOperations = {
  async create(organizationId: string, data: Partial<DbDeal>): Promise<DbDeal> {
    const deal: DbDeal = {
      id: `deal_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      organization_id: organizationId,
      name: data.name || '',
      value: data.value,
      stage: data.stage || 'lead',
      probability: data.probability,
      lead_id: data.lead_id,
      contact_id: data.contact_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryDb.deals.push(deal);
    return deal;
  },

  async getById(id: string): Promise<DbDeal | null> {
    return inMemoryDb.deals.find(d => d.id === id) || null;
  },

  async getByOrganization(organizationId: string): Promise<DbDeal[]> {
    return inMemoryDb.deals.filter(d => d.organization_id === organizationId);
  },

  async update(id: string, data: Partial<DbDeal>): Promise<DbDeal | null> {
    const idx = inMemoryDb.deals.findIndex(d => d.id === id);
    if (idx === -1) return null;
    
    inMemoryDb.deals[idx] = {
      ...inMemoryDb.deals[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return inMemoryDb.deals[idx];
  },

  async delete(id: string): Promise<boolean> {
    const idx = inMemoryDb.deals.findIndex(d => d.id === id);
    if (idx === -1) return false;
    inMemoryDb.deals.splice(idx, 1);
    return true;
  },
};

/**
 * Task Operations
 */
export const taskOperations = {
  async create(organizationId: string, data: Partial<DbTask>): Promise<DbTask> {
    const task: DbTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      organization_id: organizationId,
      title: data.title || '',
      description: data.description,
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      assigned_to: data.assigned_to,
      due_date: data.due_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryDb.tasks.push(task);
    return task;
  },

  async getById(id: string): Promise<DbTask | null> {
    return inMemoryDb.tasks.find(t => t.id === id) || null;
  },

  async getByOrganization(organizationId: string): Promise<DbTask[]> {
    return inMemoryDb.tasks.filter(t => t.organization_id === organizationId);
  },

  async update(id: string, data: Partial<DbTask>): Promise<DbTask | null> {
    const idx = inMemoryDb.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    
    inMemoryDb.tasks[idx] = {
      ...inMemoryDb.tasks[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return inMemoryDb.tasks[idx];
  },

  async delete(id: string): Promise<boolean> {
    const idx = inMemoryDb.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    inMemoryDb.tasks.splice(idx, 1);
    return true;
  },
};

/**
 * AI Insight Operations
 */
export const insightOperations = {
  async store(organizationId: string, data: Partial<DbAIInsight>): Promise<DbAIInsight> {
    const insight: DbAIInsight = {
      id: `insight_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      organization_id: organizationId,
      type: data.type || 'general',
      title: data.title || '',
      description: data.description || '',
      confidence: data.confidence || 0.5,
      data: data.data || {},
      created_at: new Date().toISOString(),
    };
    inMemoryDb.aiInsights.push(insight);
    return insight;
  },

  async getByOrganization(organizationId: string, limit = 50): Promise<DbAIInsight[]> {
    return inMemoryDb.aiInsights
      .filter(i => i.organization_id === organizationId)
      .slice(-limit);
  },

  async delete(id: string): Promise<boolean> {
    const idx = inMemoryDb.aiInsights.findIndex(i => i.id === id);
    if (idx === -1) return false;
    inMemoryDb.aiInsights.splice(idx, 1);
    return true;
  },
};

/**
 * AI Activity Operations
 */
export const activityOperations = {
  async store(organizationId: string, data: Partial<DbAIActivity>): Promise<DbAIActivity> {
    const activity: DbAIActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      organization_id: organizationId,
      user_id: data.user_id,
      agent_id: data.agent_id,
      type: data.type || 'action',
      title: data.title || '',
      description: data.description || '',
      metadata: data.metadata,
      created_at: new Date().toISOString(),
    };
    inMemoryDb.aiActivities.push(activity);
    return activity;
  },

  async getByOrganization(organizationId: string, limit = 100): Promise<DbAIActivity[]> {
    return inMemoryDb.aiActivities
      .filter(a => a.organization_id === organizationId)
      .slice(-limit);
  },
};

/**
 * AI Memory Operations
 */
export const memoryOperations = {
  async store(organizationId: string, data: Partial<DbAIMemory>): Promise<DbAIMemory> {
    const memory: DbAIMemory = {
      id: `memory_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      organization_id: organizationId,
      user_id: data.user_id,
      type: data.type || 'short_term',
      data: data.data || {},
      created_at: new Date().toISOString(),
    };
    inMemoryDb.aiMemories.push(memory);
    return memory;
  },

  async getByOrganization(organizationId: string): Promise<DbAIMemory[]> {
    return inMemoryDb.aiMemories.filter(m => m.organization_id === organizationId);
  },

  async getByType(organizationId: string, type: string): Promise<DbAIMemory[]> {
    return inMemoryDb.aiMemories.filter(
      m => m.organization_id === organizationId && m.type === type
    );
  },

  async delete(id: string): Promise<boolean> {
    const idx = inMemoryDb.aiMemories.findIndex(m => m.id === id);
    if (idx === -1) return false;
    inMemoryDb.aiMemories.splice(idx, 1);
    return true;
  },
};

/**
 * Usage Tracking Operations
 */
export const usageOperations = {
  async track(organizationId: string, data: {
    requests?: number;
    tokensUsed?: number;
    actionsExecuted?: number;
  }): Promise<DbAIUsage> {
    const period = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Find existing record for this period
    const existing = inMemoryDb.aiUsage.find(
      u => u.organization_id === organizationId && u.period === period
    );
    
    if (existing) {
      existing.requests += data.requests || 0;
      existing.tokens_used += data.tokensUsed || 0;
      existing.actions_executed += data.actionsExecuted || 0;
      return existing;
    }
    
    // Create new record
    const usage: DbAIUsage = {
      id: `usage_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      organization_id: organizationId,
      requests: data.requests || 0,
      tokens_used: data.tokensUsed || 0,
      actions_executed: data.actionsExecuted || 0,
      period,
      created_at: new Date().toISOString(),
    };
    inMemoryDb.aiUsage.push(usage);
    return usage;
  },

  async getByOrganization(organizationId: string): Promise<DbAIUsage[]> {
    return inMemoryDb.aiUsage.filter(u => u.organization_id === organizationId);
  },

  async getCurrentPeriod(organizationId: string): Promise<DbAIUsage | null> {
    const period = new Date().toISOString().slice(0, 7);
    return inMemoryDb.aiUsage.find(
      u => u.organization_id === organizationId && u.period === period
    ) || null;
  },
};

export default {
  leadOperations,
  dealOperations,
  taskOperations,
  insightOperations,
  activityOperations,
  memoryOperations,
  usageOperations,
};
