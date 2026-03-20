/**
 * Viral Loop & Referral System
 * Self-replicating growth engine
 */

import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Generate unique referral code
export function generateReferralCode(): string {
  return `REF${randomBytes(4).toString('hex').toUpperCase()}`
}

// Create referral for user
export async function createReferral(userId: string): Promise<string | null> {
  const referralCode = generateReferralCode()

  const { data, error } = await supabase
    .from('referrals')
    .insert({
      user_id: userId,
      referral_code: referralCode,
      status: 'pending',
    })
    .select('referral_code')
    .single()

  if (error) {
    console.error('Error creating referral:', error)
    return null
  }

  return data?.referral_code || null
}

// Get referral by code
export async function getReferralByCode(code: string) {
  const { data, error } = await supabase
    .from('referrals')
    .select('*, users!inner(email, name)')
    .eq('referral_code', code)
    .single()

  return data
}

// Process referral signup
export async function processReferralSignup(
  referrerId: string,
  referredUserId: string
): Promise<boolean> {
  // Find pending referral
  const { data: referral } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', referrerId)
    .eq('referred_user_id', referredUserId)
    .is('referred_signup_at', null)
    .single()

  if (!referral) {
    // Create new referral record
    await supabase.from('referrals').insert({
      user_id: referrerId,
      referrer_id: referrerId,
      referred_user_id: referredUserId,
      referral_code: generateReferralCode(),
      status: 'completed',
      referred_signup_at: new Date().toISOString(),
    })
  } else {
    // Update existing
    await supabase
      .from('referrals')
      .update({
        status: 'completed',
        referred_signup_at: new Date().toISOString(),
      })
      .eq('id', referral.id)
  }

  return true
}

// Award referral rewards
export async function awardReferralReward(
  referrerId: string,
  referredUserId: string,
  rewardTier: 'bronze' | 'silver' | 'gold' = 'bronze'
): Promise<boolean> {
  const rewards = {
    bronze: 100, // 100 credits
    silver: 250,
    gold: 500,
  }

  const creditAmount = rewards[rewardTier]

  // Update referral status
  await supabase
    .from('referrals')
    .update({
      status: 'rewarded',
      reward_credits: creditAmount,
      reward_tier: rewardTier,
      referred_conversion_at: new Date().toISOString(),
    })
    .eq('referred_user_id', referredUserId)
    .eq('referrer_id', referrerId)

  // Add credits to user account (would integrate with billing)
  // For now, just log it
  await supabase.from('growth_events').insert({
    event_type: 'referral_reward',
    user_context: { referrer_id: referrerId },
    event_data: { credits: creditAmount, tier: rewardTier },
  })

  return true
}

// Get user referrals
export async function getUserReferrals(userId: string) {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })

  return data || []
}

// Get referral stats
export async function getReferralStats(userId: string): Promise<{
  totalReferrals: number
  successfulReferrals: number
  totalCredits: number
  pendingCredits: number
}> {
  const { data } = await supabase
    .from('referrals')
    .select('status, reward_credits')
    .eq('referrer_id', userId)

  const stats = {
    totalReferrals: data?.length || 0,
    successfulReferrals: data?.filter(r => r.status === 'completed' || r.status === 'rewarded').length || 0,
    totalCredits: data?.reduce((sum, r) => sum + (r.reward_credits || 0), 0) || 0,
    pendingCredits: 0,
  }

  stats.pendingCredits = stats.totalReferrals * 100 - stats.totalCredits // Assume 100 pending

  return stats
}

// Viral incentive tiers
export const viralTiers = [
  { name: 'bronze', referrals: 1, credits: 100, badge: '🥉' },
  { name: 'silver', referrals: 5, credits: 250, badge: '🥈' },
  { name: 'gold', referrals: 10, credits: 500, badge: '🥇' },
  { name: 'platinum', referrals: 25, credits: 1500, badge: '💎' },
]

// Get current tier
export function getCurrentTier(referralCount: number): typeof viralTiers[0] {
  for (let i = viralTiers.length - 1; i >= 0; i--) {
    if (referralCount >= viralTiers[i].referrals) {
      return viralTiers[i]
    }
  }
  return viralTiers[0]
}

// Share referral link (generate multiple formats)
export function generateShareLinks(referralCode: string, baseUrl: string = 'https://kritvia.app'): {
  link: string
  twitter: string
  linkedin: string
  email: string
} {
  const link = `${baseUrl}/signup?ref=${referralCode}`

  const twitter = `https://twitter.com/intent/tweet?text=I've been using%20@kritvia%20and%20it's%20amazing!%20Sign%20up%20with%20my%20link%20and%20we%20both%20get%20free%20credits&url=${encodeURIComponent(link)}`

  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`

  const email = `mailto:?subject=Try%20Kritvia&body=Hey!%20Check%20out%20this%20AI%20CRM%20-%20it's%20free%20to%20start.%20Use%20my%20link%20to%20sign%20up%20and%20we%20both%20get%20bonus%20credits!%20${encodeURIComponent(link)}`

  return { link, twitter, linkedin, email }
}

export default {
  createReferral,
  getReferralByCode,
  processReferralSignup,
  awardReferralReward,
  getUserReferrals,
  getReferralStats,
  generateShareLinks,
}
