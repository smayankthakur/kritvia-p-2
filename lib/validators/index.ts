import { z } from 'zod'

// Lead validation schema
export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']).default('new'),
  source: z.string().optional(),
  notes: z.string().optional(),
})

export type LeadInput = z.infer<typeof leadSchema>

// Deal validation schema
export const dealSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  value: z.number().min(0, 'Value must be positive'),
  stage: z.enum(['new', 'contacted', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).default('new'),
  lead_id: z.string().optional(),
  notes: z.string().optional(),
})

export type DealInput = z.infer<typeof dealSchema>

// Contact form validation schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(1000),
})

export type ContactInput = z.infer<typeof contactSchema>

// AI chat validation schema
export const aiChatSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000),
  context: z.string().optional(),
})

export type AIChatInput = z.infer<typeof aiChatSchema>

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errors = result.error.issues.map((e: z.ZodIssue) => e.message).join(', ')
    return { success: false, error: errors }
  }
  
  return { success: true, data: result.data }
}
