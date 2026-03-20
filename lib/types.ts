// Database types for Supabase - aligned with actual DB schema

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost'
// DealStage: pipeline stages - aligned with DB (stage column)
export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed'
// DealStatus: win/loss status - aligned with DB (status column)
export type DealStatus = 'open' | 'won' | 'lost'
export type Plan = 'free' | 'starter' | 'pro' | 'enterprise'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

// User types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan: Plan
  created_at: string
  updated_at: string
}

// Lead types
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

// Deal types - aligned with database schema
export interface Deal {
  id: string
  user_id: string
  company_id?: string
  title: string
  value: number
  stage: DealStage
  status: DealStatus  // Added: won/lost status
  lead_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Task types
export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  due_date?: string
  created_at: string
}

// Dashboard metrics
export interface DashboardMetrics {
  totalLeads: number
  totalDeals: number
  activeDeals: number
  wonDeals: number
  totalRevenue: number
  conversionRate: number
  pendingTasks: number
}

// AI types
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

// Helper functions for type-safe comparisons
export const isClosedDeal = (stage: DealStage): boolean => stage === 'closed'
export const isWonDeal = (status: DealStatus): boolean => status === 'won'
export const isLostDeal = (status: DealStatus): boolean => status === 'lost'
export const isTaskCompleted = (status: TaskStatus): boolean => status === 'done'
