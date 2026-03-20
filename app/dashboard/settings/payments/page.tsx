'use client'

/**
 * Payment Gateway Settings Dashboard
 * 
 * Admin interface for configuring payment gateways
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Switch } from '@/app/components/ui/switch'
import { Badge } from '@/app/components/ui/Badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/app/components/ui/dialog'
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Plus, 
  Settings,
  Trash2,
  AlertTriangle
} from 'lucide-react'

// Provider icons and colors
const providerConfig: Record<string, { 
  name: string
  color: string
  bgColor: string
  icon: string
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[]
}> = {
  stripe: {
    name: 'Stripe',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: '💳',
    fields: [
      { key: 'STRIPE_SECRET_KEY', label: 'Secret Key', placeholder: 'sk_...', secret: true },
      { key: 'STRIPE_PUBLISHABLE_KEY', label: 'Publishable Key', placeholder: 'pk_...' },
      { key: 'STRIPE_WEBHOOK_SECRET', label: 'Webhook Secret', placeholder: 'whsec_...', secret: true }
    ]
  },
  paypal: {
    name: 'PayPal',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: '🅿️',
    fields: [
      { key: 'PAYPAL_CLIENT_ID', label: 'Client ID', placeholder: '...' },
      { key: 'PAYPAL_CLIENT_SECRET', label: 'Client Secret', placeholder: '...', secret: true }
    ]
  },
  razorpay: {
    name: 'Razorpay',
    color: 'text-blue-700',
    bgColor: 'bg-blue-200',
    icon: '⚡',
    fields: [
      { key: 'RAZORPAY_KEY_ID', label: 'Key ID', placeholder: 'rzp_...' },
      { key: 'RAZORPAY_KEY_SECRET', label: 'Key Secret', placeholder: '...', secret: true },
      { key: 'RAZORPAY_WEBHOOK_SECRET', label: 'Webhook Secret', placeholder: '...', secret: true }
    ]
  },
  cashfree: {
    name: 'Cashfree',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: '💰',
    fields: [
      { key: 'CASHFREE_APP_ID', label: 'App ID', placeholder: '...' },
      { key: 'CASHFREE_SECRET_KEY', label: 'Secret Key', placeholder: '...', secret: true }
    ]
  },
  phonepe: {
    name: 'PhonePe',
    color: 'text-purple-700',
    bgColor: 'bg-purple-200',
    icon: '📱',
    fields: [
      { key: 'PHONEPE_MERCHANT_ID', label: 'Merchant ID', placeholder: '...' },
      { key: 'PHONEPE_SALT_KEY', label: 'Salt Key', placeholder: '...', secret: true },
      { key: 'PHONEPE_SALT_INDEX', label: 'Salt Index', placeholder: '1' }
    ]
  },
  paytm: {
    name: 'Paytm',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    icon: '🅰️',
    fields: [
      { key: 'PAYTM_MERCHANT_ID', label: 'Merchant ID', placeholder: '...' },
      { key: 'PAYTM_MERCHANT_KEY', label: 'Merchant Key', placeholder: '...', secret: true }
    ]
  }
}

interface PaymentSettings {
  id: string
  provider: string
  is_active: boolean
  is_primary: boolean
  config: Record<string, string>
}

interface ProviderInfo {
  name: string
  displayName: string
  supportedCurrencies: string[]
  supportedCountries: string[]
  fees: { fixed: number; percentage: number }
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings[]>([])
  const [availableProviders, setAvailableProviders] = useState<ProviderInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isPrimary, setIsPrimary] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/payment-settings')
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch settings')
      }
      
      setSettings(data.settings || [])
      setAvailableProviders(data.availableProviders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading settings')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (provider: string) => {
    setSelectedProvider(provider)
    setFormData({})
    setIsPrimary(false)
    
    // Load existing config if available
    const existing = settings.find(s => s.provider === provider)
    if (existing?.config) {
      setFormData(existing.config)
      setIsPrimary(existing.is_primary)
    }
    
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!selectedProvider) return
    
    try {
      setSaving(true)
      setError(null)
      
      const res = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          isActive: true,
          isPrimary,
          config: formData
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save')
      }
      
      await fetchSettings()
      setDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (provider: string) => {
    if (!confirm(`Are you sure you want to remove ${provider}?`)) return
    
    try {
      setSaving(true)
      
      const res = await fetch(`/api/admin/payment-settings?provider=${provider}`, {
        method: 'DELETE'
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete')
      }
      
      await fetchSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (provider: string, isActive: boolean) => {
    try {
      const existing = settings.find(s => s.provider === provider)
      
      await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          isActive,
          isPrimary: existing?.is_primary || false,
          config: existing?.config || {}
        })
      })
      
      await fetchSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure payment gateways for your business
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Available Providers */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(providerConfig).map(([key, config]) => {
          const isConnected = settings.some(s => s.provider === key && s.is_active)
          const isPrimary = settings.find(s => s.provider === key)?.is_primary
          const providerInfo = availableProviders.find(p => p.name === key)
          
          return (
            <Card key={key} className={isConnected ? 'border-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center text-xl`}>
                      {config.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      {isConnected && isPrimary && (
                        <Badge variant="secondary" className="mt-1">Primary</Badge>
                      )}
                    </div>
                  </div>
                  {isConnected ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {providerInfo && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Fees: {providerInfo.fees.fixed > 0 ? `$${providerInfo.fees.fixed} + ` : ''}
                    {providerInfo.fees.percentage}%
                  </p>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant={isConnected ? 'outline' : 'default'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenDialog(key)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {isConnected ? 'Configure' : 'Connect'}
                  </Button>
                  
                  {isConnected && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(key)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                
                {isConnected && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Switch
                      checked={settings.find(s => s.provider === key)?.is_active || false}
                      onCheckedChange={(checked: boolean) => handleToggleActive(key, checked)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Configure {selectedProvider && providerConfig[selectedProvider]?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your API credentials. These are encrypted before storage.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedProvider && providerConfig[selectedProvider]?.fields.map(field => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  type={field.secret ? 'password' : 'text'}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="mt-1"
                />
              </div>
            ))}
            
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="isPrimary">Set as primary gateway</Label>
              <Switch
                id="isPrimary"
                checked={isPrimary}
                onCheckedChange={setIsPrimary}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
