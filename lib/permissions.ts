/**
 * Permission System
 * Feature gating based on subscription plan
 */

import { PLANS, PlanType } from './billing'

// Feature permissions by plan
export const FEATURES = {
  // Core features
  leads: { free: true, starter: true, pro: true, enterprise: true },
  deals: { free: true, starter: true, pro: true, enterprise: true },
  aiChat: { free: true, starter: true, pro: true, enterprise: true },
  dashboard: { free: true, starter: true, pro: true, enterprise: true },
  
  // Advanced features
  automation: { free: false, starter: true, pro: true, enterprise: true },
  advancedAnalytics: { free: false, starter: false, pro: true, enterprise: true },
  customIntegrations: { free: false, starter: false, pro: true, enterprise: true },
  
  // Support
  prioritySupport: { free: false, starter: false, pro: true, enterprise: true },
  
  // Team
  teamMembers: { free: 1, starter: 5, pro: 25, enterprise: -1 },
  
  // Limits
  leadsLimit: { free: 100, starter: 5000, pro: 50000, enterprise: -1 },
  aiMessagesLimit: { free: 50, starter: 5000, pro: 25000, enterprise: -1 },
  
  // AI Agents
  ceoAgent: { free: false, starter: false, pro: true, enterprise: true },
  salesAgent: { free: false, starter: true, pro: true, enterprise: true },
  marketingAgent: { free: false, starter: true, pro: true, enterprise: true },
  
  // Exports
  dataExport: { free: false, starter: true, pro: true, enterprise: true },
  apiAccess: { free: false, starter: false, pro: true, enterprise: true },
  
  // Branding
  whiteLabel: { free: false, starter: false, pro: false, enterprise: true },
  customDomain: { free: false, starter: false, pro: false, enterprise: true },
} as const

export type FeatureName = keyof typeof FEATURES

// Check if feature is available for plan
export function hasFeature(plan: PlanType | null, feature: FeatureName): boolean {
  if (!plan || plan === 'enterprise') {
    const val = FEATURES[feature].enterprise as boolean | number
    return val === true || val === 1 || val === -1
  }
  const featureConfig = FEATURES[feature]
  const value = featureConfig[plan]
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value > 0
  return false
}

// Get feature limit
export function getFeatureLimit(plan: PlanType | null, feature: FeatureName): number {
  if (!plan || plan === 'enterprise') {
    const val = FEATURES[feature].enterprise as number
    return val === -1 ? Infinity : val
  }
  const featureConfig = FEATURES[feature]
  const limit = featureConfig[plan] as number
  return typeof limit === 'number' ? limit : 0
}

// Get plan features list
export function getPlanFeatures(plan: PlanType): string[] {
  const features: string[] = []
  for (const [feature, enabled] of Object.entries(FEATURES)) {
    if (enabled[plan] === true || enabled[plan] === 1 || enabled[plan] === -1) {
      features.push(feature)
    }
  }
  return features
}

// Check if user can upgrade
export function canUpgrade(plan: PlanType): boolean {
  return plan !== 'enterprise'
}

// Check if user can downgrade
export function canDowngrade(plan: PlanType): boolean {
  return plan !== 'free'
}

// Get next plan
export function getNextPlan(currentPlan: PlanType): PlanType | null {
  const order: PlanType[] = ['free', 'starter', 'pro', 'enterprise']
  const currentIndex = order.indexOf(currentPlan)
  if (currentIndex < 0 || currentIndex >= order.length - 1) return null
  return order[currentIndex + 1]
}

// Get plan hierarchy for upgrade path
export function getPlanHierarchy(): PlanType[] {
  return ['free', 'starter', 'pro', 'enterprise']
}

// Check usage against limit
export function isWithinLimit(used: number, limit: number): boolean {
  if (limit === -1) return true // unlimited
  return used < limit
}

// Get usage percentage
export function getUsagePercentage(used: number, limit: number): number {
  if (limit === -1) return 0
  return Math.min(100, (used / limit) * 100)
}

// Check and format limit message
export function formatLimitMessage(used: number, limit: number, featureName: string): string | null {
  if (limit === -1) return null
  const remaining = limit - used
  if (remaining <= 0) {
    return `You've reached your ${featureName} limit. Upgrade to continue.`
  }
  if (remaining <= Math.ceil(limit * 0.1)) {
    return `Only ${remaining} ${featureName} remaining. Consider upgrading.`
  }
  return null
}

export default {
  FEATURES,
  hasFeature,
  getFeatureLimit,
  getPlanFeatures,
  canUpgrade,
  canDowngrade,
  getNextPlan,
  getPlanHierarchy,
  isWithinLimit,
  getUsagePercentage,
  formatLimitMessage,
}
