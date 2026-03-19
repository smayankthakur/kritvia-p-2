import { createServerSupabase } from './supabase-server'

// Job types
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type JobPriority = 'low' | 'normal' | 'high'

export interface Job<T = any> {
  id: string
  type: string
  payload: T
  status: JobStatus
  priority: JobPriority
  attempts: number
  max_attempts: number
  scheduled_at: string | null
  started_at: string | null
  completed_at: string | null
  failed_at: string | null
  error: string | null
  created_at: string
  updated_at: string
}

// Queue a new job
export async function queueJob<T>(params: {
  type: string
  payload: T
  priority?: JobPriority
  scheduledAt?: Date
  maxAttempts?: number
}): Promise<string | null> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      type: params.type,
      payload: params.payload,
      status: 'pending',
      priority: params.priority || 'normal',
      scheduled_at: params.scheduledAt?.toISOString() || null,
      max_attempts: params.maxAttempts || 3,
      attempts: 0,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error queueing job:', error)
    return null
  }

  return data.id
}

// Get next pending job
export async function getNextJob<T = any>(
  types: string[]
): Promise<Job<T> | null> {
  const supabase = await createServerSupabase()

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .in('type', types)
    .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return data as Job<T>
}

// Mark job as processing
export async function startJob(jobId: string): Promise<boolean> {
  const supabase = await createServerSupabase()

  const { data: currentJob } = await supabase
    .from('jobs')
    .select('attempts')
    .eq('id', jobId)
    .single()

  const { error } = await supabase
    .from('jobs')
    .update({
      status: 'processing',
      started_at: new Date().toISOString(),
      attempts: (currentJob?.attempts || 0) + 1,
    })
    .eq('id', jobId)

  return !error
}

// Mark job as completed
export async function completeJob(jobId: string): Promise<boolean> {
  const supabase = await createServerSupabase()

  const { error } = await supabase
    .from('jobs')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId)

  return !error
}

// Mark job as failed
export async function failJob(jobId: string, error: string): Promise<boolean> {
  const supabase = await createServerSupabase()

  // Get job to check attempts
  const { data: job } = await supabase
    .from('jobs')
    .select('attempts, max_attempts')
    .eq('id', jobId)
    .single()

  const shouldRetry = job && job.attempts < job.max_attempts

  const { error: updateError } = await supabase
    .from('jobs')
    .update({
      status: shouldRetry ? 'pending' : 'failed',
      failed_at: new Date().toISOString(),
      error,
    })
    .eq('id', jobId)

  return !updateError
}

// Get jobs by status
export async function getJobsByStatus(
  status: JobStatus,
  limit = 50
): Promise<Job[]> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching jobs:', error)
    return []
  }

  return (data || []) as Job[]
}

// Delete old completed jobs
export async function cleanupOldJobs(daysOld = 7): Promise<number> {
  const supabase = await createServerSupabase()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  const { count, error } = await supabase
    .from('jobs')
    .delete({ count: 'exact' })
    .eq('status', 'completed')
    .lt('completed_at', cutoffDate.toISOString())

  return count || 0
}

// Predefined job handlers (define types properly in production)
export const jobHandlers: Record<string, (payload: any) => Promise<void>> = {
  // Placeholder for send_email - would integrate with email service
  send_email: async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}`)
    // In production, integrate with Resend, SendGrid, or nodemailer
  },

  // Process AI task
  async ai_task({ userId, prompt, context }: { userId: string; prompt: string; context?: string }) {
    const { AIService } = await import('./ai.service')
    const aiService = new AIService()
    await aiService.chat(prompt, context)
  },

  // Sync Stripe subscription
  async sync_subscription({ userId }: { userId: string }) {
    // Would sync subscription data from Stripe
    console.log('Syncing subscription for user:', userId)
  },
}

// Process jobs (for cron/worker)
export async function processJobs(): Promise<{
  processed: number
  failed: number
}> {
  const processed = 0
  const failed = 0

  const jobTypes = Object.keys(jobHandlers)
  
  while (true) {
    const job = await getNextJob(jobTypes)
    
    if (!job) break

    await startJob(job.id)

    try {
      const handler = jobHandlers[job.type]
      if (handler) {
        await handler(job.payload)
      }
      await completeJob(job.id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await failJob(job.id, errorMessage)
    }
  }

  return { processed, failed }
}
