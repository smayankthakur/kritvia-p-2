/**
 * Shared type definitions for contact form
 */

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string;
  phone?: string;
  honeypot?: string;
}

export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  rateLimited?: boolean;
  retryAfter?: number;
}
