-- Feedback Events Table
-- Tracks outcomes of AI actions for learning

CREATE TABLE IF NOT EXISTS feedback_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(50) NOT NULL,
  action_id VARCHAR(100),
  action_type VARCHAR(100) NOT NULL,
  lead_id UUID,
  expected_outcome TEXT,
  actual_outcome TEXT,
  success_score INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Learning Memory Table
-- Stores successful patterns and strategies

CREATE TABLE IF NOT EXISTS ai_learning_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(50) NOT NULL,
  pattern_type VARCHAR(50) NOT NULL,
  pattern_data JSONB NOT NULL,
  success_rate FLOAT DEFAULT 0,
  sample_size INT DEFAULT 0,
  last_verified TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Performance Metrics Table
-- Tracks overall performance over time

CREATE TABLE IF NOT EXISTS ai_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value FLOAT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_events_agent ON feedback_events(agent_name);
CREATE INDEX IF NOT EXISTS idx_feedback_events_lead ON feedback_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_feedback_events_created ON feedback_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_learning_memory_agent ON ai_learning_memory(agent_name);
CREATE INDEX IF NOT EXISTS idx_ai_learning_memory_pattern ON ai_learning_memory(pattern_type);
CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_agent ON ai_performance_metrics(agent_name);

-- Enable RLS
ALTER TABLE feedback_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Service role can manage feedback_events" ON feedback_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage ai_learning_memory" ON ai_learning_memory
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage ai_performance_metrics" ON ai_performance_metrics
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can read feedback" ON feedback_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can read memory" ON ai_learning_memory
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can read metrics" ON ai_performance_metrics
  FOR SELECT TO authenticated USING (true);
