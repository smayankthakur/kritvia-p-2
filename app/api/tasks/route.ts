import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { supabaseServer } from '@/lib/supabase/supabase-server'
import { getCurrentUser } from '@/lib/auth-context'
import { CRMService } from '@/lib/services/crm.service'
import { rateLimiter } from '@/lib/redis/rateLimiter'

// Update the task schema to match the database
const taskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().optional(), // ISO date string
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting for GET tasks
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'
    
    const limit = await rateLimiter(ip, '/api/tasks', 60, 60) // 60 requests per minute
    if (!limit.success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    // Fetch tasks for the user
    const tasks = await CRMService.getTasksByUserId(user.id)

    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    console.error('Error in GET /api/tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting for creating tasks
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'
    
    const limit = await rateLimiter(ip, '/api/tasks', 10, 60) // 10 requests per minute
    if (!limit.success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    const body = await request.json()
    const { title, description, priority, due_date, status } = taskSchema.parse(body)

    // Create the task for the user
    const task = await CRMService.createTask({
      user_id: user.id,
      title,
      description,
      priority,
      due_date,
      status,
    })

    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    console.error('Error in POST /api/tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// We can also implement PUT and DELETE for individual tasks if needed, but for simplicity, we'll leave them out.
// In a real app, you would have /api/tasks/[id] for individual task operations.