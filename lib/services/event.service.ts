import { supabaseServer } from '@/lib/supabase/supabase-server'
import { Database } from '@/lib/types/database'

type Event = Database['public']['Tables']['events']['Row']

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

  // Get events for a company (via user's company)
  static async getEventsByUserId(userId: string): Promise<Event[]> {
    // First get the user's company
    const { data: userData, error: userError } = await supabaseServer
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single()

    if (userError) throw userError
    if (!userData?.company_id) {
      return []
    }

    // Get events for the user (since events are tied to user_id)
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
    // We'll assume that when we log events, we store the company_id in metadata as { company_id: '...' }
    // Then we can query by metadata->>company_id
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .contains('metadata', { company_id: companyId })
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data || []
  }
}