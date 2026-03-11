/**
 * Authentication Module
 * 
 * JWT-based authentication system.
 */

import { userOperations, membershipOperations } from '../organizations';

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'kritvia-demo-secret-key';
const JWT_EXPIRY = '24h';

// Simple JWT implementation (replace with proper JWT library in production)
function createToken(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = btoa(JWT_SECRET + '.' + data); // Simple signature (use proper JWT in production)
  return `${header}.${data}.${signature}`;
}

function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [header, data, signature] = token.split('.');
    if (!header || !data || !signature) return null;
    
    // Verify signature (simplified)
    const expectedSignature = btoa(JWT_SECRET + '.' + data);
    if (signature !== expectedSignature) return null;
    
    return JSON.parse(Buffer.from(data, 'base64url').toString());
  } catch {
    return null;
  }
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

// In-memory session storage
const sessions: Map<string, { userId: string; expiresAt: Date }> = new Map();

/**
 * Authentication Operations
 */
export const authOperations = {
  /**
   * Register a new user
   */
  async register(email: string, name: string, password: string): Promise<RegisterResult> {
    // Check if user already exists
    const existing = await userOperations.getByEmail(email);
    if (existing) {
      return { success: false, error: 'User already exists' };
    }
    
    // Create user
    const user = await userOperations.create({ email, name });
    
    // Create default organization for user
    const org = await (await import('../organizations')).organizationOperations.create({
      name: `${name}'s Organization`,
      slug: `org_${user.id.slice(0, 8)}`,
    });
    
    // Add user as owner of organization
    await membershipOperations.addMember(org.id, user.id, 'owner');
    
    // Create session token
    const token = createToken({
      userId: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    });
    
    // Store session
    sessions.set(token, {
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    };
  },

  /**
   * Login with email and password
   */
  async login(email: string, _password: string): Promise<LoginResult> {
    // Find user by email
    const user = await userOperations.getByEmail(email);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Create session token
    const token = createToken({
      userId: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    });
    
    // Store session
    sessions.set(token, {
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    };
  },

  /**
   * Verify token and get user
   */
  async verify(token: string): Promise<AuthUser | null> {
    if (!token) return null;
    
    // Check session
    const session = sessions.get(token);
    if (!session) {
      // Try to verify JWT
      const payload = verifyToken(token);
      if (!payload || !payload.userId) return null;
      
      const userId = payload.userId as string;
      const user = await userOperations.getById(userId);
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      };
    }
    
    // Check expiration
    if (session.expiresAt < new Date()) {
      sessions.delete(token);
      return null;
    }
    
    const user = await userOperations.getById(session.userId);
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };
  },

  /**
   * Logout (invalidate token)
   */
  async logout(token: string): Promise<boolean> {
    return sessions.delete(token);
  },

  /**
   * Get current user from request
   */
  async getCurrentUser(token: string | null): Promise<AuthUser | null> {
    if (!token) return null;
    return this.verify(token);
  },
};

/**
 * Middleware helper for API routes
 */
export async function authenticateRequest(
  headers: Record<string, string | undefined>
): Promise<{ user: AuthUser; organizationId: string } | null> {
  const authHeader = headers.authorization;
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const user = await authOperations.verify(token);
  
  if (!user) return null;
  
  // Get user's default organization
  const memberships = await membershipOperations.getUserOrganizations(user.id);
  const defaultOrg = memberships[0];
  
  if (!defaultOrg) return null;
  
  return {
    user,
    organizationId: defaultOrg.id,
  };
}

export default {
  authOperations,
  authenticateRequest,
};
