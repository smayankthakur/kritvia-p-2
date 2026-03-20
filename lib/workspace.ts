/**
 * Workspace System
 * Multi-tenant workspace management
 */

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Types
export interface Workspace {
  id: string
  name: string
  owner_id: string
  plan: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status: string
  plan_limits: {
    leads: number
    ai_messages: number
    users: number
  }
  created_at: string
}

export interface WorkspaceUser {
  id: string
  user_id: string
  workspace_id: string
  role: 'owner' | 'admin' | 'member'
  invited_by?: string
  joined_at: string
}

export interface WorkspaceInvitation {
  id: string
  workspace_id: string
  email: string
  role: string
  token: string
  expires_at: string
  accepted_at?: string
}

// Create server client
export async function createWorkspaceClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Get current user's workspace
 */
export async function getUserWorkspace(): Promise<Workspace | null> {
  const supabase = await createWorkspaceClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching workspace:', error)
    return null
  }

  return data
}

/**
 * Get workspace by ID
 */
export async function getWorkspace(workspaceId: string): Promise<Workspace | null> {
  const supabase = await createWorkspaceClient()
  
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', workspaceId)
    .single()

  if (error) {
    console.error('Error fetching workspace:', error)
    return null
  }

  return data
}

/**
 * Get workspace users
 */
export async function getWorkspaceUsers(workspaceId: string): Promise<WorkspaceUser[]> {
  const supabase = await createWorkspaceClient()
  
  const { data, error } = await supabase
    .from('workspace_users')
    .select('*')
    .eq('workspace_id', workspaceId)

  if (error) {
    console.error('Error fetching workspace users:', error)
    return []
  }

  return data || []
}

/**
 * Check if user is workspace member
 */
export async function isWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
  const supabase = await createWorkspaceClient()
  
  const { data, error } = await supabase
    .from('workspace_users')
    .select('id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .single()

  return !!data && !error
}

/**
 * Get user role in workspace
 */
export async function getUserRole(workspaceId: string, userId: string): Promise<string | null> {
  const supabase = await createWorkspaceClient()
  
  const { data, error } = await supabase
    .from('workspace_users')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .single()

  if (error) {
    return null
  }

  return data?.role
}

/**
 * Update workspace
 */
export async function updateWorkspace(
  workspaceId: string,
  updates: Partial<Workspace>
): Promise<boolean> {
  const supabase = await createWorkspaceClient()
  
  const { error } = await supabase
    .from('workspaces')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', workspaceId)

  return !error
}

/**
 * Create workspace invitation
 */
export async function createInvitation(
  workspaceId: string,
  email: string,
  role: string = 'member'
): Promise<string | null> {
  const supabase = await createWorkspaceClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

  const { data, error } = await supabase
    .from('workspace_invitations')
    .insert({
      workspace_id: workspaceId,
      email,
      role,
      invited_by: user.id,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating invitation:', error)
    return null
  }

  return token
}

/**
 * Accept workspace invitation
 */
export async function acceptInvitation(token: string): Promise<boolean> {
  const supabase = await createWorkspaceClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }

  // Get invitation
  const { data: invitation, error: fetchError } = await supabase
    .from('workspace_invitations')
    .select('*')
    .eq('token', token)
    .single()

  if (fetchError || !invitation) {
    console.error('Invalid invitation token')
    return false
  }

  // Check expiration
  if (new Date(invitation.expires_at) < new Date()) {
    console.error('Invitation expired')
    return false
  }

  // Add user to workspace
  const { error: insertError } = await supabase
    .from('workspace_users')
    .insert({
      workspace_id: invitation.workspace_id,
      user_id: user.id,
      role: invitation.role,
      joined_at: new Date().toISOString(),
    })

  if (insertError) {
    console.error('Error accepting invitation:', insertError)
    return false
  }

  // Mark invitation as accepted
  await supabase
    .from('workspace_invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invitation.id)

  return true
}

/**
 * Get workspace by invitation token
 */
export async function getWorkspaceByToken(token: string): Promise<{
  workspace: Workspace
  invitation: WorkspaceInvitation
} | null> {
  const supabase = await createWorkspaceClient()
  
  const { data: invitation, error } = await supabase
    .from('workspace_invitations')
    .select('*, workspaces(*)')
    .eq('token', token)
    .single()

  if (error || !invitation) {
    return null
  }

  return {
    workspace: invitation.workspaces,
    invitation,
  }
}

export default {
  getUserWorkspace,
  getWorkspace,
  getWorkspaceUsers,
  isWorkspaceMember,
  getUserRole,
  updateWorkspace,
  createInvitation,
  acceptInvitation,
  getWorkspaceByToken,
}
