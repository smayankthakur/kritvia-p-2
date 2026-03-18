import { create } from 'zustand'
import { createSupabaseBrowserClient } from './supabase'

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: 'new' | 'contacted' | 'qualified' | 'lost'
  source?: string
  notes?: string
  created_at: string
  user_id: string
}

export interface Deal {
  id: string
  title: string
  value: number
  stage: 'new' | 'contacted' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  lead_id?: string
  notes?: string
  created_at: string
  user_id: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface AppState {
  user: any | null
  leads: Lead[]
  deals: Deal[]
  aiMessages: Message[]
  isLoading: boolean
  
  // Actions
  setUser: (user: any | null) => void
  setLeads: (leads: Lead[]) => void
  addLead: (lead: Lead) => void
  updateLead: (id: string, lead: Partial<Lead>) => void
  deleteLead: (id: string) => void
  setDeals: (deals: Deal[]) => void
  addDeal: (deal: Deal) => void
  updateDeal: (id: string, deal: Partial<Deal>) => void
  deleteDeal: (id: string) => void
  addAiMessage: (message: Message) => void
  clearAiMessages: () => void
  setLoading: (loading: boolean) => void
  
  // Data fetching
  fetchLeads: () => Promise<void>
  fetchDeals: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  leads: [],
  deals: [],
  aiMessages: [],
  isLoading: false,

  setUser: (user) => set({ user }),
  
  setLeads: (leads) => set({ leads }),
  
  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  
  updateLead: (id, updatedLead) => set((state) => ({
    leads: state.leads.map((lead) => 
      lead.id === id ? { ...lead, ...updatedLead } : lead
    )
  })),
  
  deleteLead: (id) => set((state) => ({
    leads: state.leads.filter((lead) => lead.id !== id)
  })),
  
  setDeals: (deals) => set({ deals }),
  
  addDeal: (deal) => set((state) => ({ deals: [...state.deals, deal] })),
  
  updateDeal: (id, updatedDeal) => set((state) => ({
    deals: state.deals.map((deal) => 
      deal.id === id ? { ...deal, ...updatedDeal } : deal
    )
  })),
  
  deleteDeal: (id) => set((state) => ({
    deals: state.deals.filter((deal) => deal.id !== id)
  })),
  
  addAiMessage: (message) => set((state) => ({ 
    aiMessages: [...state.aiMessages, message] 
  })),
  
  clearAiMessages: () => set({ aiMessages: [] }),
  
  setLoading: (isLoading) => set({ isLoading }),

  fetchLeads: async () => {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    set({ isLoading: true })
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      set({ leads: data as Lead[] })
    }
    set({ isLoading: false })
  },

  fetchDeals: async () => {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    set({ isLoading: true })
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      set({ deals: data as Deal[] })
    }
    set({ isLoading: false })
  },
}))
