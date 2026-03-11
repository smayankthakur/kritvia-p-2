/**
 * Organization System
 * 
 * Multi-tenant organization management.
 */

export type OrganizationPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type MembershipRole = 'owner' | 'admin' | 'member';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: OrganizationPlan;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  timezone: string;
  dateFormat: string;
  aiEnabled: boolean;
  apiAccess: boolean;
  customBranding: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: MembershipRole;
  createdAt: Date;
}

export interface OrganizationWithMembers extends Organization {
  members: MembershipWithUser[];
}

export interface MembershipWithUser extends Membership {
  user: User;
}

// In-memory storage (replace with database in production)
const organizations: Map<string, Organization> = new Map();
const users: Map<string, User> = new Map();
const memberships: Map<string, Membership> = new Map();
const membershipsByOrg: Map<string, Membership[]> = new Map();
const membershipsByUser: Map<string, Membership[]> = new Map();

// Initialize with demo data
function initializeDemoData() {
  // Demo organization
  const org: Organization = {
    id: 'org_demo',
    name: 'Demo Company',
    slug: 'demo-company',
    plan: 'professional',
    settings: {
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      aiEnabled: true,
      apiAccess: true,
      customBranding: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  organizations.set(org.id, org);

  // Demo user
  const user: User = {
    id: 'user_demo',
    email: 'demo@kritvia.com',
    name: 'Demo User',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.set(user.id, user);

  // Demo membership
  const membership: Membership = {
    id: 'mem_demo',
    userId: user.id,
    organizationId: org.id,
    role: 'owner',
    createdAt: new Date(),
  };
  memberships.set(membership.id, membership);

  // Index by organization
  if (!membershipsByOrg.has(org.id)) {
    membershipsByOrg.set(org.id, []);
  }
  membershipsByOrg.get(org.id)!.push(membership);

  // Index by user
  if (!membershipsByUser.has(user.id)) {
    membershipsByUser.set(user.id, []);
  }
  membershipsByUser.get(user.id)!.push(membership);
}

// Initialize demo data
initializeDemoData();

/**
 * Organization Operations
 */
export const organizationOperations = {
  /**
   * Create organization
   */
  async create(data: {
    name: string;
    slug: string;
    plan?: OrganizationPlan;
  }): Promise<Organization> {
    const org: Organization = {
      id: `org_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: data.name,
      slug: data.slug,
      plan: data.plan || 'free',
      settings: {
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        aiEnabled: true,
        apiAccess: false,
        customBranding: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    organizations.set(org.id, org);
    return org;
  },

  /**
   * Get organization by ID
   */
  async getById(id: string): Promise<Organization | null> {
    return organizations.get(id) || null;
  },

  /**
   * Get organization by slug
   */
  async getBySlug(slug: string): Promise<Organization | null> {
    for (const org of Array.from(organizations.values())) {
      if (org.slug === slug) return org;
    }
    return null;
  },

  /**
   * Update organization
   */
  async update(id: string, data: Partial<Organization>): Promise<Organization | null> {
    const org = organizations.get(id);
    if (!org) return null;
    
    const updated = {
      ...org,
      ...data,
      updatedAt: new Date(),
    };
    organizations.set(id, updated);
    return updated;
  },

  /**
   * Delete organization
   */
  async delete(id: string): Promise<boolean> {
    // Delete all memberships first
    const orgMemberships = membershipsByOrg.get(id) || [];
    for (const mem of orgMemberships) {
      memberships.delete(mem.id);
    }
    membershipsByOrg.delete(id);
    
    return organizations.delete(id);
  },

  /**
   * List all organizations
   */
  async list(): Promise<Organization[]> {
    return Array.from(organizations.values());
  },
};

/**
 * User Operations
 */
export const userOperations = {
  /**
   * Create user
   */
  async create(data: {
    email: string;
    name: string;
  }): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      email: data.email,
      name: data.name,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    users.set(user.id, user);
    return user;
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User | null> {
    return users.get(id) || null;
  },

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<User | null> {
    for (const user of Array.from(users.values())) {
      if (user.email === email) return user;
    }
    return null;
  },

  /**
   * Update user
   */
  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = users.get(id);
    if (!user) return null;
    
    const updated = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };
    users.set(id, updated);
    return updated;
  },

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    // Delete all memberships first
    const userMemberships = membershipsByUser.get(id) || [];
    for (const mem of userMemberships) {
      memberships.delete(mem.id);
      const orgMems = membershipsByOrg.get(mem.organizationId) || [];
      const idx = orgMems.findIndex(m => m.id === mem.id);
      if (idx !== -1) orgMems.splice(idx, 1);
    }
    membershipsByUser.delete(id);
    
    return users.delete(id);
  },
};

/**
 * Membership Operations
 */
export const membershipOperations = {
  /**
   * Add user to organization
   */
  async addMember(
    organizationId: string,
    userId: string,
    role: MembershipRole = 'member'
  ): Promise<Membership | null> {
    const org = organizations.get(organizationId);
    const user = users.get(userId);
    
    if (!org || !user) return null;
    
    // Check if already member
    const existing = membershipsByUser.get(userId) || [];
    if (existing.some(m => m.organizationId === organizationId)) {
      return null; // Already a member
    }
    
    const membership: Membership = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      userId,
      organizationId,
      role,
      createdAt: new Date(),
    };
    
    memberships.set(membership.id, membership);
    
    // Index by organization
    if (!membershipsByOrg.has(organizationId)) {
      membershipsByOrg.set(organizationId, []);
    }
    membershipsByOrg.get(organizationId)!.push(membership);
    
    // Index by user
    if (!membershipsByUser.has(userId)) {
      membershipsByUser.set(userId, []);
    }
    membershipsByUser.get(userId)!.push(membership);
    
    return membership;
  },

  /**
   * Remove user from organization
   */
  async removeMember(organizationId: string, userId: string): Promise<boolean> {
    const userMemberships = membershipsByUser.get(userId) || [];
    const membership = userMemberships.find(m => m.organizationId === organizationId);
    
    if (!membership || membership.role === 'owner') return false;
    
    memberships.delete(membership.id);
    
    // Remove from org index
    const orgMemberships = membershipsByOrg.get(organizationId) || [];
    const orgIdx = orgMemberships.findIndex(m => m.id === membership.id);
    if (orgIdx !== -1) orgMemberships.splice(orgIdx, 1);
    
    // Remove from user index
    const userIdx = userMemberships.findIndex(m => m.id === membership.id);
    if (userIdx !== -1) userMemberships.splice(userIdx, 1);
    
    return true;
  },

  /**
   * Update member role
   */
  async updateRole(
    organizationId: string,
    userId: string,
    role: MembershipRole
  ): Promise<Membership | null> {
    const userMemberships = membershipsByUser.get(userId) || [];
    const membership = userMemberships.find(m => m.organizationId === organizationId);
    
    if (!membership) return null;
    
    membership.role = role;
    memberships.set(membership.id, membership);
    
    return membership;
  },

  /**
   * Get user's organizations
   */
  async getUserOrganizations(userId: string): Promise<OrganizationWithMembers[]> {
    const userMemberships = membershipsByUser.get(userId) || [];
    const result: OrganizationWithMembers[] = [];
    
    for (const membership of userMemberships) {
      const org = organizations.get(membership.organizationId);
      if (!org) continue;
      
      const allMembers = membershipsByOrg.get(org.id) || [];
      const members: MembershipWithUser[] = [];
      
      for (const mem of allMembers) {
        const user = users.get(mem.userId);
        if (user) {
          members.push({ ...mem, user });
        }
      }
      
      result.push({ ...org, members });
    }
    
    return result;
  },

  /**
   * Get organization members
   */
  async getOrganizationMembers(organizationId: string): Promise<MembershipWithUser[]> {
    const orgMemberships = membershipsByOrg.get(organizationId) || [];
    const result: MembershipWithUser[] = [];
    
    for (const membership of orgMemberships) {
      const user = users.get(membership.userId);
      if (user) {
        result.push({ ...membership, user });
      }
    }
    
    return result;
  },

  /**
   * Check if user has role in organization
   */
  async hasRole(
    organizationId: string,
    userId: string,
    roles: MembershipRole[]
  ): Promise<boolean> {
    const userMemberships = membershipsByUser.get(userId) || [];
    const membership = userMemberships.find(m => m.organizationId === organizationId);
    
    if (!membership) return false;
    
    return roles.includes(membership.role);
  },
};

export default {
  organizationOperations,
  userOperations,
  membershipOperations,
};
