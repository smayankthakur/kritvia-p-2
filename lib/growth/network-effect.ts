/**
 * Network Effect Engine
 * Viral compounding and referral system
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Referral {
  id: string
  referrerId: string
  refereeId: string
  reward: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: Date
}

export interface ViralMetrics {
  referralCount: number
  conversionRate: number
  viralCoefficient: number
  networkValue: number
}

// Track referral
export async function trackReferral(
  referrerId: string,
  refereeId: string
): Promise<Referral> {
  const { data, error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referrerId,
      referee_id: refereeId,
      reward: 500, // ₹500 credit
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get viral metrics for a workspace
export async function getViralMetrics(
  workspaceId: string
): Promise<ViralMetrics> {
  const { data: referrals } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', workspaceId)

  const referralCount = referrals?.length || 0
  const conversions = referrals?.filter(r => r.status === 'completed').length || 0
  const conversionRate = referralCount > 0 ? conversions / referralCount : 0

  // Viral coefficient > 1 means viral growth
  const viralCoefficient = conversionRate * 2.5 // Simplified calculation
  const networkValue = referralCount * 1000 // Mock value per user

  return {
    referralCount,
    conversionRate,
    viralCoefficient,
    networkValue,
  }
}

// Get referral program details
export function getReferralProgram(): {
  reward: number
  refereeReward: number
  tiers: Array<{ referrals: number; bonus: number }>
} {
  return {
    reward: 500, // ₹500 for referrer
    refereeReward: 250, // ₹250 for referee
    tiers: [
      { referrals: 5, bonus: 1000 },
      { referrals: 10, bonus: 2500 },
      { referrals: 25, bonus: 7500 },
      { referrals: 50, bonus: 20000 },
    ],
  }
}

// Calculate referral bonus
export function calculateReferralBonus(referralCount: number): number {
  const program = getReferralProgram()
  let bonus = 0

  for (const tier of program.tiers) {
    if (referralCount >= tier.referrals) {
      bonus = tier.bonus
    }
  }

  return bonus
}

// Generate referral link
export function generateReferralLink(workspaceId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kritvia.com'
  return `${baseUrl}?ref=${workspaceId}`
}

// Get referral leaderboard
export async function getReferralLeaderboard(
  limit: number = 10
): Promise<Array<{ workspaceId: string; referrals: number; totalReward: number }>> {
  // Mock leaderboard data
  return [
    { workspaceId: '1', referrals: 45, totalReward: 22500 },
    { workspaceId: '2', referrals: 38, totalReward: 19000 },
    { workspaceId: '3', referrals: 32, totalReward: 16000 },
    { workspaceId: '4', referrals: 28, totalReward: 14000 },
    { workspaceId: '5', referrals: 25, totalReward: 12500 },
  ]
}

// Network effects analysis
export async function analyzeNetworkEffects(): Promise<{
  currentValue: number
  projectedValue: number
  recommendations: string[]
}> {
  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, created_at')

  const totalWorkspaces = workspaces?.length || 100 // Mock
  const currentValue = totalWorkspaces * 1500 // Mock value

  // Metcalfe's law: value proportional to n²
  const projectedValue = Math.pow(totalWorkspaces * 1.2, 2) * 100

  return {
    currentValue,
    projectedValue,
    recommendations: [
      'Increase referral reward during growth phase',
      'Add social sharing features',
      'Create community for users',
      'Enable team invitations',
    ],
  }
}

export default {
  trackReferral,
  getViralMetrics,
  getReferralProgram,
  calculateReferralBonus,
  generateReferralLink,
  getReferralLeaderboard,
  analyzeNetworkEffects,
}
