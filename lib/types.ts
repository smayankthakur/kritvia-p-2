// Database types for Supabase

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost'
export type DealStage = 'new' | 'contacted' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
export type Plan = 'free' | 'starter' | 'pro' | 'enterprise'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan: Plan
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  user_id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: LeadStatus
  source?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  user_id: string
  title: string
  value: number
  stage: DealStage
  lead_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface DashboardMetrics {
  totalLeads: number
  totalDeals: number
  totalRevenue: number
  conversionRate: number
}

export interface AIConversation {
  id: string
  user_id: string
  messages: AIMessage[]
  created_at: string
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AIInsight {
  id: string
  user_id: string
  type: 'lead_analysis' | 'deal_strategy' | 'growth_tip'
  content: string
  created_at: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Dashboard metrics
export interface DashboardMetrics {
  totalLeads: number
  totalDeals: number
  totalRevenue: number
  conversionRate: number
}
