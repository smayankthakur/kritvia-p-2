import { createServerSupabase } from './supabase-server'

// Workspace types
export interface Workspace {
  id: string
  name: string
  slug: string
  owner_id: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  created_at: string
}

// Create a new workspace
export async function createWorkspace(
  ownerId: string,
  name: string,
  slug: string
): Promise<Workspace | null> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('workspaces')
    .insert({
      name,
      slug,
      owner_id: ownerId,
      plan: 'free',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating workspace:', error)
    return null
  }

  // Add owner as workspace member
  await supabase.from('workspace_members').insert({
    workspace_id: data.id,
    user_id: ownerId,
    role: 'owner',
  })

  return data
}

// Get user's workspaces
export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('workspaces')
    .select(`
      *,
      workspace_members!inner(user_id)
    `)
    .eq('workspace_members.user_id', userId)

  if (error) {
    console.error('Error fetching workspaces:', error)
    return []
  }

  return data || []
}

// Get workspace by ID
export async function getWorkspace(workspaceId: string): Promise<Workspace | null> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('workspaces')
    .select()
    .eq('id', workspaceId)
    .single()

  if (error) {
    console.error('Error fetching workspace:', error)
    return null
  }

  return data
}

// Check if user has access to workspace
export async function hasWorkspaceAccess(
  userId: string,
  workspaceId: string
): Promise<boolean> {
  const supabase = await createServerSupabase()

  const { count, error } = await supabase
    .from('workspace_members')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)

  return (count || 0) > 0
}

// Get user's role in workspace
export async function getUserWorkspaceRole(
  userId: string,
  workspaceId: string
): Promise<string | null> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data?.role || null
}

// Add member to workspace
export async function addWorkspaceMember(
  workspaceId: string,
  userId: string,
  role: 'admin' | 'member' | 'viewer' = 'member'
): Promise<boolean> {
  const supabase = await createServerSupabase()

  const { error } = await supabase.from('workspace_members').insert({
    workspace_id: workspaceId,
    user_id: userId,
    role,
  })

  return !error
}

// Remove member from workspace
export async function removeWorkspaceMember(
  workspaceId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createServerSupabase()

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)

  return !error
}

// Update workspace
export async function updateWorkspace(
  workspaceId: string,
  updates: Partial<Workspace>
): Promise<Workspace | null> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('workspaces')
    .update(updates)
    .eq('id', workspaceId)
    .select()
    .single()

  if (error) {
    console.error('Error updating workspace:', error)
    return null
  }

  return data
}

// Delete workspace
export async function deleteWorkspace(workspaceId: string): Promise<boolean> {
  const supabase = await createServerSupabase()

  // Delete all members first
  await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)

  // Delete workspace
  const { error } = await supabase
    .from('workspaces')
    .delete()
    .eq('id', workspaceId)

  return !error
}

// Get workspace members
export async function getWorkspaceMembers(workspaceId: string): Promise<{
  id: string
  user_id: string
  role: string
  email?: string
  created_at: string
}[]> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('workspace_members')
    .select(`
      id,
      user_id,
      role,
      created_at,
      user:user_id(email)
    `)
    .eq('workspace_id', workspaceId)

  if (error) {
    console.error('Error fetching workspace members:', error)
    return []
  }

  return data?.map(m => ({
    ...m,
    email: (m as any).user?.email,
  })) || []
}
