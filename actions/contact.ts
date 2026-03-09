'use server';

import type { ContactFormData, FormState } from '@/types/contact';
import { validateContactForm } from '@/lib/validation/contact';
import { sendContactEmail } from '@/services/email';

/**
 * Rate limiting store (simple in-memory implementation)
 * In production, use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Check rate limit for a given identifier
 */
function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * Convert FormData to ContactFormData
 */
function formDataToContactFormData(formData: FormData): ContactFormData {
  return {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: (formData.get('subject') as string) || '',
    message: formData.get('message') as string,
    company: (formData.get('company') as string) || undefined,
    phone: (formData.get('phone') as string) || undefined,
    honeypot: (formData.get('honeypot') as string) || undefined,
  };
}

/**
 * Submit contact form
 * Server action that orchestrates validation and email sending
 */
export async function submitContactForm(formData: FormData): Promise<FormState> {
  // Convert FormData to our typed object
  const contactData = formDataToContactFormData(formData);

  // Get client IP for rate limiting
  const ip = 'default'; // In production, get from headers

  // Check rate limit
  const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: 'Too many requests. Please try again later.',
      rateLimited: true,
      retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
    };
  }

  // Check honeypot - if filled, silently accept but don't process
  if (contactData.honeypot) {
    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    };
  }

  // Validate form data
  const validation = validateContactForm(contactData);
  if (!validation.success || !validation.data) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: validation.errors,
    };
  }

  // Destructure validated data
  const { name, email, message, company, phone, subject } = validation.data;

  // Send email using Resend
  const emailResult = await sendContactEmail(name, email, message, company, phone, subject);

  if (!emailResult.success) {
    return {
      success: false,
      message: 'Failed to send message. Please try again or email us directly.',
    };
  }

  return {
    success: true,
    message: 'Thank you for your message! We will get back to you soon.',
  };
}
