import { supabaseServer } from '@/lib/supabase/supabase-server'

// Event type definition
export interface Event {
  id: string
  user_id: string
  type: string
  action: string
  metadata?: Record<string, unknown>
  timestamp: string
}

export class EventService {
  // Log an event
  static async logEvent(event: Omit<Event, 'id' | 'timestamp'>): Promise<Event> {
    const { data, error } = await supabaseServer
      .from('events')
      .insert([event])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get events for a user
  static async getEventsByUserId(userId: string): Promise<Event[]> {
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get events for a company by company_id (by checking metadata)
  static async getEventsByCompanyId(companyId: string): Promise<Event[]> {
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .contains('metadata', { company_id: companyId })
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data || []
  }
}
