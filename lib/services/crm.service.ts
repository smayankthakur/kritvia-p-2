import { supabaseServer } from '@/lib/supabase/supabase-server'
import { Database } from '@/lib/types/database'

type Company = Database['public']['Tables']['companies']['Row']
type Lead = Database['public']['Tables']['leads']['Row']
type Deal = Database['public']['Tables']['deals']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

export class CRMService {
  // Company methods
  static async getCompanyByUserId(userId: string): Promise<Company | null> {
    const { data, error } = await supabaseServer
      .from('users')
      .select('company_id, companies(*)')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.companies || null
  }

  static async getCompanyById(companyId: string): Promise<Company | null> {
    const { data, error } = await supabaseServer
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single()

    if (error) throw error
    return data
  }

  // Lead methods
  static async getLeadsByCompanyId(companyId: string): Promise<Lead[]> {
    const { data, error } = await supabaseServer
      .from('leads')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> {
    const { data, error } = await supabaseServer
      .from('leads')
      .insert([lead])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateLead(id: string, lead: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabaseServer
      .from('leads')
      .update(lead)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteLead(id: string): Promise<void> {
    const { error } = await supabaseServer
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Deal methods
  static async getDealsByCompanyId(companyId: string): Promise<Deal[]> {
    const { data, error } = await supabaseServer
      .from('deals')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createDeal(deal: Omit<Deal, 'id' | 'created_at'>): Promise<Deal> {
    const { data, error } = await supabaseServer
      .from('deals')
      .insert([deal])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateDeal(id: string, deal: Partial<Deal>): Promise<Deal> {
    const { data, error } = await supabaseServer
      .from('deals')
      .update(deal)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteDeal(id: string): Promise<void> {
    const { error } = await supabaseServer
      .from('deals')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Task methods
  static async getTasksByUserId(userId: string): Promise<Task[]> {
    const { data, error } = await supabaseServer
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
    const { data, error } = await supabaseServer
      .from('tasks')
      .insert([task])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const { data, error } = await supabaseServer
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteTask(id: string): Promise<void> {
    const { error } = await supabaseServer
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}