/**
 * Kritvia API Validation Layer
 * 
 * Request validation using Zod schemas for all API endpoints.
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */
export const commonSchemas = {
  /** UUID string validation */
  uuid: z.string().uuid({ message: 'Invalid UUID format' }),
  
  /** Organization ID format */
  organizationId: z.string().min(1, 'Organization ID is required'),
  
  /** Pagination parameters */
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
  
  /** Date range filter */
  dateRange: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
  }),
};

/**
 * AI API Schemas
 */
export const aiSchemas = {
  /** Analyze endpoint request */
  analyze: z.object({
    organizationId: commonSchemas.organizationId,
    query: z.string().min(3, 'Query must be at least 3 characters').max(1000),
    context: z.record(z.unknown()).optional(),
  }),

  /** Decision endpoint request */
  decision: z.object({
    organizationId: commonSchemas.organizationId,
    context: z.record(z.unknown()),
    type: z.enum(['lead_scoring', 'recommendation', 'prediction', 'analysis']),
  }),

  /** Chat endpoint request */
  chat: z.object({
    organizationId: commonSchemas.organizationId,
    message: z.string().min(1, 'Message is required').max(2000),
    history: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })).optional(),
  }),
};

/**
 * Analytics API Schemas
 */
export const analyticsSchemas = {
  /** Metrics endpoint request */
  metrics: z.object({
    organizationId: commonSchemas.organizationId,
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
    metrics: z.array(z.enum([
      'revenue', 'leads', 'deals', 'conversion_rate', 
      'avg_deal_size', 'pipeline_value', 'win_rate'
    ])).optional(),
  }).strict(),

  /** Forecast endpoint request */
  forecast: z.object({
    organizationId: commonSchemas.organizationId,
    metric: z.enum(['revenue', 'leads', 'deals', 'pipeline_value']),
    periods: z.coerce.number().int().positive().max(12).default(3),
  }),

  /** Dashboard endpoint request */
  dashboard: z.object({
    organizationId: commonSchemas.organizationId,
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
  }),
};

/**
 * CRM API Schemas
 */
export const crmSchemas = {
  /** Lead creation */
  createLead: z.object({
    organizationId: commonSchemas.organizationId,
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email format').optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    source: z.string().optional(),
  }),

  /** Lead update */
  updateLead: z.object({
    organizationId: commonSchemas.organizationId,
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    status: z.enum(['new', 'contacted', 'qualified', 'lost', 'won']).optional(),
    score: z.coerce.number().int().min(0).max(100).optional(),
  }),

  /** Deal creation */
  createDeal: z.object({
    organizationId: commonSchemas.organizationId,
    name: z.string().min(1, 'Deal name is required').max(100),
    value: z.coerce.number().nonnegative('Value must be non-negative').optional(),
    stage: z.string().min(1, 'Stage is required'),
    leadId: commonSchemas.uuid.optional(),
    probability: z.coerce.number().int().min(0).max(100).optional(),
  }),

  /** Deal update */
  updateDeal: z.object({
    organizationId: commonSchemas.organizationId,
    name: z.string().min(1).max(100).optional(),
    value: z.coerce.number().nonnegative().optional(),
    stage: z.string().optional(),
    probability: z.coerce.number().int().min(0).max(100).optional(),
    leadId: commonSchemas.uuid.optional(),
  }),
};

/**
 * Validation helper function
 * Returns parsed data or throws ValidationError
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data);
}

/**
 * Safe validation helper
 * Returns result object instead of throwing
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
