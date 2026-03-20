/**
 * Database Optimization Migrations
 * Indexes and performance improvements
 */

export const dbIndexes = `
-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- Leads table indexes
CREATE INDEX IF NOT EXISTS idx_leads_workspace ON leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_workspace_status ON leads(workspace_id, status);

-- Deals table indexes
CREATE INDEX IF NOT EXISTS idx_deals_workspace ON deals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_value ON deals(value DESC);
CREATE INDEX IF NOT EXISTS idx_deals_workspace_stage ON deals(workspace_id, stage);

-- Payment transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_workspace ON payment_transactions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider ON payment_transactions(provider);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_idempotency ON payment_transactions(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_date ON payment_transactions(created_at DESC);

-- AI cost metrics indexes
CREATE INDEX IF NOT EXISTS idx_ai_cost_workspace ON ai_cost_metrics(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ai_cost_date ON ai_cost_metrics(date);
CREATE INDEX IF NOT EXISTS idx_ai_cost_model ON ai_cost_metrics(model);
CREATE INDEX IF NOT EXISTS idx_ai_cost_workspace_date ON ai_cost_metrics(workspace_id, date);

-- Usage metrics indexes
CREATE INDEX IF NOT EXISTS idx_usage_workspace ON usage_metrics(workspace_id);
CREATE INDEX IF NOT EXISTS idx_usage_type ON usage_metrics(type);
CREATE INDEX IF NOT EXISTS idx_usage_period ON usage_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_usage_workspace_type ON usage_metrics(workspace_id, type);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace ON subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- Companies/Workspaces indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_plan ON workspaces(plan);
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(created_by);

-- User companies indexes
CREATE INDEX IF NOT EXISTS idx_user_companies_user ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_role ON user_companies(role);

-- =============================================
-- PARTIAL INDEXES (Filter-based)
-- =============================================

-- Active subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(workspace_id) 
  WHERE status IN ('active', 'trialing');

-- Pending payments
CREATE INDEX IF NOT EXISTS idx_transactions_pending ON payment_transactions(transaction_id) 
  WHERE status IN ('pending', 'processing');

-- =============================================
-- FUNCTION: Update updated_at timestamp
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS: Auto-update timestamps
-- =============================================

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;
CREATE TRIGGER update_deals_updated_at 
  BEFORE UPDATE ON deals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces;
CREATE TRIGGER update_workspaces_updated_at 
  BEFORE UPDATE ON workspaces 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ANALYTICS VIEWS
-- =============================================

-- Monthly revenue by workspace
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
  workspace_id,
  DATE_TRUNC('month', completed_at) as month,
  SUM(amount) as total_revenue,
  COUNT(*) as transaction_count
FROM payment_transactions
WHERE status = 'completed' AND completed_at IS NOT NULL
GROUP BY workspace_id, DATE_TRUNC('month', completed_at);

-- Lead sources performance
CREATE OR REPLACE VIEW lead_source_performance AS
SELECT 
  workspace_id,
  source,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as converted,
  ROUND(COUNT(*) FILTER (WHERE status = 'converted')::numeric / COUNT(*)::numeric * 100, 2) as conversion_rate
FROM leads
GROUP BY workspace_id, source;

-- Deal pipeline value
CREATE OR REPLACE VIEW deal_pipeline_value AS
SELECT 
  workspace_id,
  stage,
  SUM(value) as total_value,
  COUNT(*) as deal_count,
  AVG(value) as average_value
FROM deals
WHERE status != 'lost'
GROUP BY workspace_id, stage;
`

export const aiCostMetricsSchema = `
-- AI Cost Tracking Table
CREATE TABLE IF NOT EXISTS ai_cost_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  model VARCHAR(50) NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(workspace_id, date, model)
);

-- Indexes for AI cost queries
CREATE INDEX IF NOT EXISTS idx_ai_cost_metrics_workspace_date 
  ON ai_cost_metrics(workspace_id, date);

-- RLS
ALTER TABLE ai_cost_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own AI costs"
  ON ai_cost_metrics FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM user_companies 
      WHERE user_id = auth.uid()
    )
  );
`

export default { dbIndexes, aiCostMetricsSchema }
