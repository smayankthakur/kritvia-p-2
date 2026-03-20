import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  plan: z.enum(['starter', 'pro', 'enterprise']).optional(),
  subscription_status: z.enum(['trialing', 'active', 'past_due', 'canceled', 'unpaid']).optional(),
})

export type User = z.infer<typeof userSchema>