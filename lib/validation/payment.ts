import { z } from 'zod'

export const paymentSchema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise']),
  payment_method_id: z.string().optional(), // For direct payment, but we are using Stripe Checkout so this might not be needed
})

export type Payment = z.infer<typeof paymentSchema>