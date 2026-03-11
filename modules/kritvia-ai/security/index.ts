/**
 * AI Action Approval Layer
 * 
 * Human-in-the-loop approval system for AI actions.
 */

export interface ApprovalRequest {
  id: string;
  actionType: string;
  agentId: string;
  description: string;
  details: Record<string, unknown>;
  risk: 'low' | 'medium' | 'high' | 'critical';
  requestedAt: Date;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approvedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  expiresAt: Date;
}

export interface ApprovalPolicy {
  id: string;
  name: string;
  description: string;
  actionTypes: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresApproval: boolean;
  autoApprove: boolean;
  approverRoles: string[];
}

export interface ApprovalStats {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  avgResponseTime: number;
}

class ApprovalSystem {
  private requests: Map<string, ApprovalRequest> = new Map();
  private policies: Map<string, ApprovalPolicy> = new Map();
  private pendingCallbacks: Map<string, (approved: boolean, reason?: string) => void> = new Map();
  private requestQueue: ApprovalRequest[] = [];
  private maxPendingAge = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.initializeDefaultPolicies();
    this.startExpirationChecker();
  }

  /**
   * Initialize default approval policies
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicies: ApprovalPolicy[] = [
      {
        id: 'policy_email',
        name: 'Email Actions',
        description: 'Approval required for sending emails',
        actionTypes: ['send_email', 'send_bulk_email'],
        riskLevel: 'medium',
        requiresApproval: true,
        autoApprove: false,
        approverRoles: ['manager', 'admin'],
      },
      {
        id: 'policy_data',
        name: 'Data Modifications',
        description: 'Approval required for data changes',
        actionTypes: ['update_record', 'delete_record', 'create_record'],
        riskLevel: 'high',
        requiresApproval: true,
        autoApprove: false,
        approverRoles: ['manager', 'admin'],
      },
      {
        id: 'policy_financial',
        name: 'Financial Actions',
        description: 'Approval required for financial transactions',
        actionTypes: ['create_invoice', 'process_payment', 'refund'],
        riskLevel: 'critical',
        requiresApproval: true,
        autoApprove: false,
        approverRoles: ['admin'],
      },
      {
        id: 'policy_ai_low',
        name: 'Low Risk AI Actions',
        description: 'Auto-approve low risk AI actions',
        actionTypes: ['ai_insight', 'ai_recommendation', 'ai_analysis'],
        riskLevel: 'low',
        requiresApproval: false,
        autoApprove: true,
        approverRoles: [],
      },
      {
        id: 'policy_webhook',
        name: 'External Webhooks',
        description: 'Approval required for external webhook calls',
        actionTypes: ['webhook', 'api_call'],
        riskLevel: 'high',
        requiresApproval: true,
        autoApprove: false,
        approverRoles: ['manager', 'admin'],
      },
    ];

    for (const policy of defaultPolicies) {
      this.policies.set(policy.id, policy);
    }
  }

  /**
   * Start expiration checker
   */
  private startExpirationChecker(): void {
    setInterval(() => {
      this.expireOldRequests();
    }, 60000); // Check every minute
  }

  /**
   * Expire old pending requests
   */
  private expireOldRequests(): void {
    const now = new Date();
    
    for (const request of Array.from(this.requests.values())) {
      if (request.status === 'pending' && request.expiresAt <= now) {
        request.status = 'expired';
        
        // Notify callback
        const callback = this.pendingCallbacks.get(request.id);
        if (callback) {
          callback(false, 'Request expired');
          this.pendingCallbacks.delete(request.id);
        }
      }
    }
  }

  /**
   * Request approval for an action
   */
  async requestApproval(
    actionType: string,
    agentId: string,
    description: string,
    details: Record<string, unknown>,
    requestedBy: string,
    riskOverride?: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<ApprovalRequest | null> {
    // Find applicable policy
    const policy = this.findPolicy(actionType);
    
    if (!policy) {
      console.log(`[Approval] No policy found for action: ${actionType}`);
      return null;
    }

    // Determine risk level
    const risk = riskOverride || policy.riskLevel;
    
    // Check if auto-approve
    if (policy.autoApprove) {
      const request: ApprovalRequest = {
        id: `apr_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        actionType,
        agentId,
        description,
        details,
        risk,
        requestedAt: new Date(),
        requestedBy,
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: 'system',
        expiresAt: new Date(Date.now() + this.maxPendingAge),
      };
      
      this.requests.set(request.id, request);
      return request;
    }

    // Require approval
    if (!policy.requiresApproval) {
      return null;
    }

    const request: ApprovalRequest = {
      id: `apr_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      actionType,
      agentId,
      description,
      details,
      risk,
      requestedAt: new Date(),
      requestedBy,
      status: 'pending',
      expiresAt: new Date(Date.now() + this.maxPendingAge),
    };
    
    this.requests.set(request.id, request);
    this.requestQueue.push(request);
    
    console.log(`[Approval] Request created: ${request.id} (${risk} risk)`);
    
    return request;
  }

  /**
   * Find applicable policy for action
   */
  private findPolicy(actionType: string): ApprovalPolicy | undefined {
    for (const policy of Array.from(this.policies.values())) {
      if (policy.actionTypes.includes(actionType)) {
        return policy;
      }
    }
    return undefined;
  }

  /**
   * Approve a request
   */
  approve(
    requestId: string,
    approvedBy: string
  ): boolean {
    const request = this.requests.get(requestId);
    if (!request || request.status !== 'pending') {
      return false;
    }

    request.status = 'approved';
    request.approvedAt = new Date();
    request.approvedBy = approvedBy;
    
    // Notify callback
    const callback = this.pendingCallbacks.get(requestId);
    if (callback) {
      callback(true);
      this.pendingCallbacks.delete(requestId);
    }
    
    console.log(`[Approval] Request approved: ${requestId} by ${approvedBy}`);
    return true;
  }

  /**
   * Reject a request
   */
  reject(
    requestId: string,
    rejectedBy: string,
    reason: string
  ): boolean {
    const request = this.requests.get(requestId);
    if (!request || request.status !== 'pending') {
      return false;
    }

    request.status = 'rejected';
    request.approvedAt = new Date();
    request.approvedBy = rejectedBy;
    request.rejectionReason = reason;
    
    // Notify callback
    const callback = this.pendingCallbacks.get(requestId);
    if (callback) {
      callback(false, reason);
      this.pendingCallbacks.delete(requestId);
    }
    
    console.log(`[Approval] Request rejected: ${requestId} by ${rejectedBy}`);
    return true;
  }

  /**
   * Get pending requests
   */
  getPendingRequests(): ApprovalRequest[] {
    return Array.from(this.requests.values())
      .filter(r => r.status === 'pending')
      .sort((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime());
  }

  /**
   * Get request by ID
   */
  getRequest(requestId: string): ApprovalRequest | undefined {
    return this.requests.get(requestId);
  }

  /**
   * Get all requests
   */
  getAllRequests(): ApprovalRequest[] {
    return Array.from(this.requests.values());
  }

  /**
   * Get approval statistics
   */
  getStats(): ApprovalStats {
    const requests = Array.from(this.requests.values());
    
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    const expired = requests.filter(r => r.status === 'expired').length;
    
    // Calculate average response time
    const completed = requests.filter(r => r.approvedAt && r.requestedAt);
    const avgTime = completed.length > 0
      ? completed.reduce((sum, r) => sum + (r.approvedAt!.getTime() - r.requestedAt.getTime()), 0) / completed.length
      : 0;
    
    return {
      totalRequests: total,
      pending,
      approved,
      rejected,
      expired,
      avgResponseTime: avgTime,
    };
  }

  /**
   * Add or update a policy
   */
  setPolicy(policy: ApprovalPolicy): void {
    this.policies.set(policy.id, policy);
  }

  /**
   * Get all policies
   */
  getPolicies(): ApprovalPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Wait for approval (for async operations)
   */
  waitForApproval(requestId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.pendingCallbacks.set(requestId, (approved, reason) => {
        resolve(approved);
      });
      
      // Timeout after max pending age
      setTimeout(() => {
        if (this.pendingCallbacks.has(requestId)) {
          this.pendingCallbacks.delete(requestId);
          resolve(false);
        }
      }, this.maxPendingAge);
    });
  }
}

// Export singleton
export const approvalSystem = new ApprovalSystem();

export default {
  approvalSystem,
};
