/**
 * Workspace API
 * CRUD operations for workspaces
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Force runtime execution
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validation schemas
const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
})

const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
})

// Helper to get authenticated user
async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { authorization: authHeader } },
  })

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// GET /api/workspace - List user's workspaces
export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Get all workspaces the user is a member of
  const { data: workspaceUsers, error: wsError } = await supabase
    .from('workspace_users')
    .select('workspace_id, role')
    .eq('user_id', user.id)

  if (wsError || !workspaceUsers || workspaceUsers.length === 0) {
    return NextResponse.json({ workspaces: [] })
  }

  const workspaceIds = workspaceUsers.map((wu) => wu.workspace_id)

  const { data: workspaces, error } = await supabase
    .from('workspaces')
    .select('*')
    .in('id', workspaceIds)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Map roles to workspaces
  const workspacesWithRoles = workspaces?.map((ws) => {
    const wu = workspaceUsers.find((w) => w.workspace_id === ws.id)
    return { ...ws, role: wu?.role || 'member' }
  })

  return NextResponse.json({ workspaces: workspacesWithRoles })
}

// POST /api/workspace - Create new workspace
export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = createWorkspaceSchema.parse(body)
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate slug if not provided
    let slug = validated.slug
    if (!slug) {
      slug = validated.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      
      // Check if slug exists
      const { data: existing } = await supabase
        .from('workspaces')
        .select('id')
        .eq('slug', slug)
        .single()
      
      if (existing) {
        slug = `${slug}-${Date.now()}`
      }
    }

    // Create workspace
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert({
        name: validated.name,
        slug,
        plan: 'free',
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add user as owner
    await supabase.from('workspace_users').insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'owner',
    })

    return NextResponse.json({ workspace }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
