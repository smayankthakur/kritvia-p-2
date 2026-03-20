/**
 * Analytics and Event Tracking System
 * Tracks user journeys and conversion events
 */

// Event types
export type EventType = 
  | 'USER_VISITED_HERO'
  | 'USER_VISITED_PRICING'
  | 'USER_VISITED_BLOG'
  | 'CLICKED_START_FREE'
  | 'CLICKED_BOOK_DEMO'
  | 'VIEWED_PRICING'
  | 'SELECTED_PLAN'
  | 'SUBMITTED_LEAD_FORM'
  | 'COMPLETED_ONBOARDING'
  | 'SIGNED_UP'
  | 'LOGGED_IN';

// Event data interface
interface EventData {
  event: EventType;
  userId?: string;
  email?: string;
  source?: string;
  plan?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp?: string;
}

// Send event to backend
async function sendEvent(data: EventData): Promise<void> {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await supabase
      .from('analytics_events')
      .insert({
        event_type: data.event,
        user_id: data.userId || null,
        email: data.email || null,
        source: data.source || 'direct',
        plan: data.plan || null,
        metadata: data.metadata || {},
        created_at: new Date().toISOString(),
      })
  } catch (error) {
    console.error('Failed to send analytics event:', error)
  }
}

// Track page views
export function trackPageView(pageName: string, metadata?: Record<string, string>): void {
  if (typeof window === 'undefined') return
  
  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_name: pageName,
      ...metadata,
    })
  }

  // Track in our own analytics
  sendEvent({
    event: `USER_VISITED_${pageName.toUpperCase()}` as EventType,
    metadata: {
      page: pageName,
      ...metadata,
    },
  })
}

// Track CTA clicks
export function trackCTAClick(ctaType: string, destination?: string): void {
  if (typeof window === 'undefined') return

  const eventMap: Record<string, EventType> = {
    'start-free': 'CLICKED_START_FREE',
    'book-demo': 'CLICKED_BOOK_DEMO',
    'pricing': 'VIEWED_PRICING',
  }

  if (window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'CTA',
      event_label: ctaType,
      destination: destination || '',
    })
  }

  sendEvent({
    event: eventMap[ctaType] || 'CLICKED_START_FREE',
    metadata: {
      cta_type: ctaType,
      destination: destination || '',
    },
  })
}

// Track plan selection
export function trackPlanSelection(planName: string, price: number): void {
  if (typeof window === 'undefined') return

  if (window.gtag) {
    window.gtag('event', 'select_content', {
      content_type: 'plan',
      item_id: planName,
      value: price,
      currency: 'INR',
    })
  }

  sendEvent({
    event: 'SELECTED_PLAN',
    plan: planName,
    metadata: {
      plan_name: planName,
      price,
      currency: 'INR',
    },
  })
}

// Track lead form submission
export function trackLeadSubmission(source: string, leadScore: number): void {
  if (typeof window === 'undefined') return

  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      source,
      lead_score: leadScore,
    })
  }

  sendEvent({
    event: 'SUBMITTED_LEAD_FORM',
    source,
    metadata: {
      lead_score: leadScore,
    },
  })
}

// Track onboarding completion
export function trackOnboardingComplete(goal: string, businessSize: string, industry: string): void {
  if (typeof window === 'undefined') return

  if (window.gtag) {
    window.gtag('event', 'complete_registration', {
      registration_method: 'onboarding',
      goal,
      business_size: businessSize,
      industry,
    })
  }

  sendEvent({
    event: 'COMPLETED_ONBOARDING',
    metadata: {
      goal,
      business_size: businessSize,
      industry,
    },
  })
}

// Track signup
export function trackSignup(method: string): void {
  if (typeof window === 'undefined') return

  if (window.gtag) {
    window.gtag('event', 'sign_up', {
      method,
    })
  }

  sendEvent({
    event: 'SIGNED_UP',
    metadata: {
      signup_method: method,
    },
  })
}

// Track login
export function trackLogin(method: string): void {
  if (typeof window === 'undefined') return

  if (window.gtag) {
    window.gtag('event', 'login', {
      method,
    })
  }

  sendEvent({
    event: 'LOGGED_IN',
    metadata: {
      login_method: method,
    },
  })
}

// Custom event tracker
export function trackCustomEvent(eventName: string, metadata?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return

  if (window.gtag) {
    window.gtag('event', eventName, metadata)
  }

  sendEvent({
    event: eventName as EventType,
    metadata,
  })
}

// Initialize analytics (for GA4)
export function initAnalytics(gaId?: string): void {
  if (typeof window === 'undefined') return
  
  const id = gaId || 'G-XXXXXXXXXX'
  
  // Check if already initialized
  if (window.dataLayer) return
  
  window.dataLayer = []
  
  // GTM snippet
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)

  // Initialize gtag
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, {
    page_title: document.title,
    page_location: window.location.href,
  })
}

export default {
  trackPageView,
  trackCTAClick,
  trackPlanSelection,
  trackLeadSubmission,
  trackOnboardingComplete,
  trackSignup,
  trackLogin,
  trackCustomEvent,
  initAnalytics,
}
