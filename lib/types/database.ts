import { SupabaseClient, createClient } from '@supabase/supabase-js'

// Database type definitions based on the actual Supabase schema

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost'
export type DealStage = 'lead' | 'proposal' | 'negotiation' | 'closed'
export type DealStatus = 'open' | 'won' | 'lost'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type UserRole = 'admin' | 'member'
export type UserPlan = 'starter' | 'pro' | 'enterprise'
export type CompanySize = string // Could be more specific if needed
export type CompanyIndustry = string // Could be more specific if needed

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          industry: CompanyIndustry | null
          size: CompanySize | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: CompanyIndustry | null
          size?: CompanySize | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: CompanyIndustry | null
          size?: CompanySize | null
          created_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          company_id: string | null
          role: UserRole
          plan: UserPlan
          subscription_status: string
          stripe_customer_id: string | null
          paypal_subscription_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          company_id?: string | null
          role?: UserRole
          plan?: UserPlan
          subscription_status?: string
          stripe_customer_id?: string | null
          paypal_subscription_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company_id?: string | null
          role?: UserRole
          plan?: UserPlan
          subscription_status?: string
          stripe_customer_id?: string | null
          paypal_subscription_id?: string | null
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "users_company_id_fkey", columns: ["company_id"], referencedTable: "companies", referencedColumns: ["id"] }
        ]
      }
      leads: {
        Row: {
          id: string
          company_id: string
          name: string
          email: string
          phone: string | null
          source: string | null
          status: LeadStatus
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          email: string
          phone?: string | null
          source?: string | null
          status?: LeadStatus
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          email?: string
          phone?: string | null
          source?: string | null
          status?: LeadStatus
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "leads_company_id_fkey", columns: ["company_id"], referencedTable: "companies", referencedColumns: ["id"] },
          { foreignKeyName: "leads_user_id_fkey", columns: ["user_id"], referencedTable: "users", referencedColumns: ["id"] }
        ]
      }
      deals: {
        Row: {
          id: string
          company_id: string
          title: string
          value: number
          stage: DealStage
          status: DealStatus
          assigned_to: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          value: number
          stage?: DealStage
          status?: DealStatus
          assigned_to?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          value?: number
          stage?: DealStage
          status?: DealStatus
          assigned_to?: string | null
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "deals_company_id_fkey", columns: ["company_id"], referencedTable: "companies", referencedColumns: ["id"] },
          { foreignKeyName: "deals_assigned_to_fkey", columns: ["assigned_to"], referencedTable: "auth", referencedColumns: ["id"] }
        ]
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: TaskPriority
          due_date: string | null
          status: TaskStatus
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority?: TaskPriority
          due_date?: string | null
          status?: TaskStatus
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: TaskPriority
          due_date?: string | null
          status?: TaskStatus
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "tasks_user_id_fkey", columns: ["user_id"], referencedTable: "auth", referencedColumns: ["id"] }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for working with the database
export type Company = Database['public']['Tables']['companies']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type Deal = Database['public']['Tables']['deals']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']

export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type LeadInsert = Database['public']['Tables']['leads']['Insert']
export type DealInsert = Database['public']['Tables']['deals']['Insert']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']

export type CompanyUpdate = Database['public']['Tables']['companies']['Update']
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type LeadUpdate = Database['public']['Tables']['leads']['Update']
export type DealUpdate = Database['public']['Tables']['deals']['Update']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']