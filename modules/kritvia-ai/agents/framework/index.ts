/**
 * AI Agent Framework
 * 
 * Base framework for autonomous business agents.
 */

export type AgentCapability = 
  | 'read_analytics'
  | 'access_crm'
  | 'create_tasks'
  | 'update_deals'
  | 'send_notifications'
  | 'generate_insights'
  | 'make_recommendations';

export type AgentRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AgentSchedule {
  type: 'interval' | 'hourly' | 'daily';
  interval?: number; // minutes
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: AgentCapability[];
  schedule: AgentSchedule;
  riskLevel: AgentRiskLevel;
  enabled: boolean;
}

export interface AgentContext {
  organizationId: string;
  userId?: string;
  timestamp: Date;
}

export interface AgentAnalysis {
  agentId: string;
  organizationId: string;
  timestamp: Date;
  data: Record<string, unknown>;
  findings: string[];
}

export interface AgentDecision {
  agentId: string;
  decision: string;
  confidence: number;
  reasoning: string;
}

export interface AgentAction {
  id: string;
  agentId: string;
  type: string;
  title: string;
  description: string;
  params: Record<string, unknown>;
  riskLevel: AgentRiskLevel;
  status: 'pending' | 'approved' | 'executed' | 'rejected';
  createdAt: Date;
}

export interface AgentReport {
  agentId: string;
  organizationId: string;
  period: string;
  summary: string;
  actionsCreated: number;
  actionsExecuted: number;
  insightsGenerated: number;
  recommendations: string[];
}

/**
 * Base Agent class
 */
export abstract class BaseAgent {
  protected config: AgentConfig;
  protected context: AgentContext | null = null;
  
  constructor(config: AgentConfig) {
    this.config = config;
  }
  
  /**
   * Initialize agent for an organization
   */
  async initialize(organizationId: string, userId?: string): Promise<void> {
    this.context = {
      organizationId,
      userId,
      timestamp: new Date(),
    };
  }
  
  /**
   * Analyze business data
   */
  abstract analyze(context: AgentContext): Promise<AgentAnalysis>;
  
  /**
   * Generate decisions from analysis
   */
  abstract decide(analysis: AgentAnalysis): Promise<AgentDecision[]>;
  
  /**
   * Execute actions from decisions
   */
  abstract act(decisions: AgentDecision[], context: AgentContext): Promise<AgentAction[]>;
  
  /**
   * Generate report
   */
  abstract report(context: AgentContext): Promise<AgentReport>;
  
  /**
   * Get agent configuration
   */
  getConfig(): AgentConfig {
    return this.config;
  }
  
  /**
   * Check if agent is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }
  
  /**
   * Get agent ID
   */
  getId(): string {
    return this.config.id;
  }
  
  /**
   * Get agent name
   */
  getName(): string {
    return this.config.name;
  }
}

/**
 * Agent registry for managing all agents
 */
class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map();
  private agentConfigs: Map<string, AgentConfig> = new Map();
  
  /**
   * Register an agent
   */
  register(agent: BaseAgent): void {
    this.agents.set(agent.getId(), agent);
    this.agentConfigs.set(agent.getId(), agent.getConfig());
  }
  
  /**
   * Get agent by ID
   */
  get(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }
  
  /**
   * Get all agents
   */
  getAll(): BaseAgent[] {
    return Array.from(this.agents.values());
  }
  
  /**
   * Get enabled agents
   */
  getEnabled(): BaseAgent[] {
    return this.getAll().filter(a => a.isEnabled());
  }
  
  /**
   * Get agent config
   */
  getConfig(agentId: string): AgentConfig | undefined {
    return this.agentConfigs.get(agentId);
  }
  
  /**
   * Get all configs
   */
  getAllConfigs(): AgentConfig[] {
    return Array.from(this.agentConfigs.values());
  }
  
  /**
   * Enable agent
   */
  enable(agentId: string): boolean {
    const config = this.agentConfigs.get(agentId);
    if (config) {
      config.enabled = true;
      return true;
    }
    return false;
  }
  
  /**
   * Disable agent
   */
  disable(agentId: string): boolean {
    const config = this.agentConfigs.get(agentId);
    if (config) {
      config.enabled = false;
      return true;
    }
    return false;
  }
}

// Export singleton registry
export const agentRegistry = new AgentRegistry();

export default {
  agentRegistry,
  BaseAgent,
};
