// Pricing configuration - single source of truth
export interface PlanFeature {
  name: string
  included: boolean
}

export interface PlanLimit {
  name: string
  value: string | number
}

export interface PricingPlan {
  id: string
  name: string
  price: {
    monthly: number
    yearly: number
  }
  recommended: boolean
  features: string[]
  limits: PlanLimit[]
  custom?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    recommended: false,
    features: [
      'Up to 100 contacts',
      'Basic email marketing',
      'Limited AI agent (1)',
      'Basic analytics',
      'Community support',
    ],
    limits: [
      { name: 'contacts', value: 100 },
      { name: 'emailsPerMonth', value: 500 },
      { name: 'aiAgents', value: 1 },
      { name: 'users', value: 1 },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 2999, yearly: 29990 },
    recommended: false,
    features: [
      'Up to 1,000 contacts',
      'Email marketing automation',
      'AI agents (3)',
      'Advanced analytics',
      'Email support',
      'Custom branding',
    ],
    limits: [
      { name: 'contacts', value: 1000 },
      { name: 'emailsPerMonth', value: 5000 },
      { name: 'aiAgents', value: 3 },
      { name: 'users', value: 3 },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 7999, yearly: 79990 },
    recommended: true,
    features: [
      'Up to 10,000 contacts',
      'Advanced marketing automation',
      'AI agents (10)',
      'Predictive analytics',
      'Priority support',
      'Custom integrations',
      'A/B testing',
      'Multi-user collaboration',
    ],
    limits: [
      { name: 'contacts', value: 10000 },
      { name: 'emailsPerMonth', value: 50000 },
      { name: 'aiAgents', value: 10 },
      { name: 'users', value: 10 },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 0, yearly: 0 },
    recommended: false,
    features: [
      'Unlimited contacts',
      'Unlimited AI agents',
      'Advanced AI customization',
      'Dedicated account manager',
      '24/7 premium support',
      'On-premise deployment',
      'SLA guarantee',
      'Custom everything',
    ],
    limits: [
      { name: 'contacts', value: 'Unlimited' },
      { name: 'emailsPerMonth', value: 'Unlimited' },
      { name: 'aiAgents', value: 'Unlimited' },
      { name: 'users', value: 'Unlimited' },
    ],
    custom: true,
  },
]

export function getPlanById(id: string): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === id)
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Free'
  return `₹${price.toLocaleString()}`
}
