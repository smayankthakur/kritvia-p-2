/**
 * Payment Settings Admin API
 * 
 * CRUD operations for payment gateway configuration
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { getPaymentProvider, getAllProviderInfo } from '@/lib/payments/factory'
import { encryptConfig, decryptConfig } from '@/lib/payments/encryption'
import { PaymentProviderName } from '@/lib/payments/types'
import { z } from 'zod'

// Force runtime
export const dynamic = 'force-dynamic'

// Validation schema
const paymentSettingsSchema = z.object({
  provider: z.enum(['stripe', 'paypal', 'razorpay', 'cashfree', 'phonepe', 'paytm']),
  isActive: z.boolean(),
  isPrimary: z.boolean(),
  config: z.record(z.string(), z.string()).optional()
})

/**
 * GET /api/admin/payment-settings
 * Get all payment settings for the company
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's company
    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id, role')
      .eq('user_id', user.id)
      .single()
    
    if (!userCompany || !['owner', 'admin'].includes(userCompany.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Get payment settings
    const { data: settings, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('company_id', userCompany.company_id)
    
    if (error) {
      console.error('Error fetching payment settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
    
    // Decrypt config for each setting
    const decryptedSettings = (settings || []).map((setting: { id: string; company_id: string; provider: string; is_active: boolean; is_primary: boolean; config: { encrypted: string; iv: string }; created_at: string; updated_at: string }) => ({
      ...setting,
      config: setting.config ? decryptConfig(setting.config.encrypted, setting.config.iv) : {}
    }))
    
    // Get available providers
    const availableProviders = getAllProviderInfo()
    
    return NextResponse.json({
      settings: decryptedSettings,
      availableProviders,
      companyId: userCompany.company_id
    })
    
  } catch (error) {
    console.error('Error in GET payment settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/payment-settings
 * Add or update a payment gateway
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's company
    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id, role')
      .eq('user_id', user.id)
      .single()
    
    if (!userCompany || !['owner', 'admin'].includes(userCompany.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Validate request
    const body = await req.json()
    const validated = paymentSettingsSchema.parse(body)
    
    // Validate provider is available
    try {
      const provider = getPaymentProvider(validated.provider)
      provider.getProviderInfo() // This will throw if not configured
    } catch (providerError) {
      return NextResponse.json({ 
        error: `Provider ${validated.provider} is not configured` 
      }, { status: 400 })
    }
    
    // Encrypt sensitive config
    const configRecord = validated.config || {}
    const stringConfig: Record<string, string> = {}
    for (const [key, value] of Object.entries(configRecord)) {
      stringConfig[key] = String(value)
    }
    const encryptedConfig = Object.keys(stringConfig).length > 0 
      ? encryptConfig(stringConfig)
      : { encrypted: '', iv: '' }
    
    // Check if setting exists
    const { data: existing } = await supabase
      .from('payment_settings')
      .select('id')
      .eq('company_id', userCompany.company_id)
      .eq('provider', validated.provider)
      .single()
    
    if (existing) {
      // Update existing
      const { error: updateError } = await supabase
        .from('payment_settings')
        .update({
          is_active: validated.isActive,
          is_primary: validated.isPrimary,
          config: encryptedConfig,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
      
      if (updateError) {
        console.error('Error updating payment settings:', updateError)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
      }
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from('payment_settings')
        .insert({
          company_id: userCompany.company_id,
          provider: validated.provider,
          is_active: validated.isActive,
          is_primary: validated.isPrimary,
          config: encryptedConfig
        })
      
      if (insertError) {
        console.error('Error inserting payment settings:', insertError)
        return NextResponse.json({ error: 'Failed to add gateway' }, { status: 500 })
      }
    }
    
    // If this is primary, unset other primaries
    if (validated.isPrimary) {
      await supabase
        .from('payment_settings')
        .update({ is_primary: false })
        .eq('company_id', userCompany.company_id)
        .neq('provider', validated.provider)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Gateway ${validated.provider} configured successfully` 
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    console.error('Error in POST payment settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/payment-settings
 * Remove a payment gateway
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's company
    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id, role')
      .eq('user_id', user.id)
      .single()
    
    if (!userCompany || !['owner', 'admin'].includes(userCompany.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Get provider from query
    const { searchParams } = new URL(req.url)
    const provider = searchParams.get('provider') as PaymentProviderName
    
    if (!provider) {
      return NextResponse.json({ error: 'Provider required' }, { status: 400 })
    }
    
    // Check for active subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('company_id', userCompany.company_id)
      .eq('status', 'active')
      .limit(1)
    
    if (subscriptions && subscriptions.length > 0) {
      // Check if trying to delete primary
      const { data: setting } = await supabase
        .from('payment_settings')
        .select('is_primary')
        .eq('company_id', userCompany.company_id)
        .eq('provider', provider)
        .single()
      
      if (setting?.is_primary) {
        return NextResponse.json({ 
          error: 'Cannot delete primary gateway with active subscriptions' 
        }, { status: 400 })
      }
    }
    
    // Delete setting
    const { error: deleteError } = await supabase
      .from('payment_settings')
      .delete()
      .eq('company_id', userCompany.company_id)
      .eq('provider', provider)
    
    if (deleteError) {
      console.error('Error deleting payment settings:', deleteError)
      return NextResponse.json({ error: 'Failed to delete gateway' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Gateway ${provider} removed` 
    })
    
  } catch (error) {
    console.error('Error in DELETE payment settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
