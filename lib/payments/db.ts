/**
 * Payment Settings Database Schema
 * 
 * SQL Migration for payment gateway configuration storage
 */

export const paymentSettingsSchema = `
-- Payment Settings Table
-- Stores gateway configuration per company/workspace

CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(company_id, provider)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_payment_settings_company 
  ON payment_settings(company_id);

CREATE INDEX IF NOT EXISTS idx_payment_settings_active 
  ON payment_settings(company_id, is_active) 
  WHERE is_active = true;

-- Row Level Security
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Companies can manage their own payment settings
CREATE POLICY "Companies manage own payment settings"
  ON payment_settings FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM user_companies 
      WHERE user_id = auth.uid()
    )
  );
`

export const paymentTransactionsSchema = `
-- Payment Transactions Table
-- Logs all payment attempts for analytics

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  order_id VARCHAR(255),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(company_id, transaction_id)
);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_transactions_company 
  ON payment_transactions(company_id, created_at);

CREATE INDEX IF NOT EXISTS idx_transactions_provider 
  ON payment_transactions(provider, created_at);

-- RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies view own transactions"
  ON payment_transactions FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM user_companies 
      WHERE user_id = auth.uid()
    )
  );
`

export const paymentAnalyticsSchema = `
-- Payment Analytics Table
-- Aggregated metrics per provider

CREATE TABLE IF NOT EXISTS payment_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metrics
  total_transactions INTEGER DEFAULT 0,
  successful_transactions INTEGER DEFAULT 0,
  failed_transactions INTEGER DEFAULT 0,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  average_amount DECIMAL(12, 2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(company_id, provider, period_start)
);

CREATE INDEX IF NOT EXISTS idx_analytics_company 
  ON payment_analytics(company_id, period_start);
`
