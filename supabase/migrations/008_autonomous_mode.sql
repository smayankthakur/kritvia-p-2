-- Autonomous Mode Database Schema
-- Kritvia Autonomous Business System

-- AI Action Approvals Table
CREATE TABLE IF NOT EXISTS ai_action_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id VARCHAR(255) NOT NULL,
  decision_type VARCHAR(100) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(255),
  risk_level VARCHAR(20) DEFAULT 'low',
  execution_mode VARCHAR(20) DEFAULT 'auto_execute',
  approved BOOLEAN DEFAULT false,
  approved_by VARCHAR(255),
  approved_at TIMESTAMPTZ,
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Autonomous Events Table
CREATE TABLE IF NOT EXISTS ai_autonomous_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Learning Log Table
CREATE TABLE IF NOT EXISTS ai_learning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id VARCHAR(255) NOT NULL,
  decision_type VARCHAR(100) NOT NULL,
  outcome VARCHAR(50) NOT NULL,
  confidence_before DECIMAL(5,2),
  confidence_after DECIMAL(5,2),
  user_override BOOLEAN DEFAULT false,
  override_reason TEXT,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Decisions Table (Enhanced with confidence and execution mode)
CREATE TABLE IF NOT EXISTS ai_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_type VARCHAR(100) NOT NULL,
  lead_id VARCHAR(255),
  deal_id VARCHAR(255),
  task_id VARCHAR(255),
  confidence DECIMAL(5,2) DEFAULT 0.5,
  priority VARCHAR(20) DEFAULT 'medium',
  execution_mode VARCHAR(20) DEFAULT 'auto_execute',
  status VARCHAR(20) DEFAULT 'pending',
  action VARCHAR(255) NOT NULL,
  reason TEXT NOT NULL,
  risk_level VARCHAR(20) DEFAULT 'low',
  metadata JSONB DEFAULT '{}',
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI System Modes Table
CREATE TABLE IF NOT EXISTS ai_system_modes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode VARCHAR(20) NOT NULL DEFAULT 'assistive',
  max_actions_per_hour INTEGER DEFAULT 100,
  require_approval_for_risk VARCHAR(20) DEFAULT 'medium',
  enabled_actions TEXT[] DEFAULT ARRAY['send_email', 'create_task', 'update_lead_status', 'move_deal_stage', 'trigger_webhook', 'assign_sales_rep'],
  blocked_actions TEXT[] DEFAULT ARRAY[],
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Safety Logs Table
CREATE TABLE IF NOT EXISTS ai_safety_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  blocked_action_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Autonomous Actions Execution Log
CREATE TABLE IF NOT EXISTS ai_autonomous_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id VARCHAR(255) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  action_name VARCHAR(255) NOT NULL,
  parameters JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending',
  result JSONB,
  error_message TEXT,
  executed_by VARCHAR(255) DEFAULT 'autonomous_engine',
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_action_approvals_status ON ai_action_approvals(status) WHERE approved = false;
CREATE INDEX IF NOT EXISTS idx_ai_autonomous_events_processed ON ai_autonomous_events(processed) WHERE processed = false;
CREATE INDEX IF NOT EXISTS idx_ai_learning_logs_action ON ai_learning_logs(action_id);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_status ON ai_decisions(status);
CREATE INDEX IF NOT EXISTS idx_ai_autonomous_actions_status ON ai_autonomous_actions(status);

-- Insert default system mode
INSERT INTO ai_system_modes (mode, max_actions_per_hour, require_approval_for_risk, enabled_actions)
VALUES ('assistive', 100, 'medium', ARRAY['send_email', 'create_task', 'update_lead_status', 'move_deal_stage', 'trigger_webhook', 'assign_sales_rep'])
ON CONFLICT DO NOTHING;

-- Function to calculate action count in last hour
CREATE OR REPLACE FUNCTION get_actions_last_hour()
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*) INTO count
  FROM ai_autonomous_actions
  WHERE created_at > NOW() - INTERVAL '1 hour'
  AND status = 'completed';
  RETURN count;
END;
$$ LANGUAGE plpgsql;

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(max_actions INTEGER DEFAULT 100)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
BEGIN
  current_count := get_actions_last_hour();
  RETURN current_count < max_actions;
END;
$$ LANGUAGE plpgsql;
