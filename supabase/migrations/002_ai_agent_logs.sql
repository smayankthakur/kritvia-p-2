-- AI Agent Logs Table
-- Stores outputs from CEO, Sales, and Marketing agents

CREATE TABLE IF NOT EXISTS ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(50) NOT NULL,
  input JSONB DEFAULT '{}',
  output JSONB NOT NULL,
  action_taken JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_agent_name ON ai_agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_created_at ON ai_agent_logs(created_at DESC);

-- Enable RLS
ALTER TABLE ai_agent_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert
CREATE POLICY "Service role can manage ai_agent_logs" ON ai_agent_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Authenticated users can read ai_agent_logs" ON ai_agent_logs
  FOR SELECT
  TO authenticated
  USING (true);
