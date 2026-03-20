-- Autonomous Revenue Engine Database Schema
-- SDR, Outbound, Ads, Attribution, Referrals

-- Outreach Sequences Table
CREATE TABLE IF NOT EXISTS outreach_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  workspace_id UUID REFERENCES workspaces(id),
  message TEXT NOT NULL,
  channel TEXT CHECK (channel IN ('email', 'linkedin', 'whatsapp', 'sms')) DEFAULT 'email',
  status TEXT CHECK (status IN ('pending', 'sent', 'delivered', 'replied', 'bounced', 'failed', 'ignored')) DEFAULT 'pending',
  score INTEGER DEFAULT 0,
  sentiment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE
);

-- Outreach Campaigns Table
CREATE TABLE IF NOT EXISTS outreach_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  workspace_id UUID REFERENCES workspaces(id),
  target_industry TEXT[],
  target_company_size TEXT[],
  message_template TEXT NOT NULL,
  channel TEXT DEFAULT 'email',
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed')) DEFAULT 'draft',
  leads_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  reply_rate DECIMAL(5,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Ad Campaigns Table
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT CHECK (platform IN ('google', 'meta', 'linkedin', 'twitter')) NOT NULL,
  name TEXT NOT NULL,
  workspace_id UUID REFERENCES workspaces(id),
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed')) DEFAULT 'draft',
  budget_daily DECIMAL(10,2),
  budget_total DECIMAL(10,2),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0,
  cpc DECIMAL(10,2) DEFAULT 0,
  cpa DECIMAL(10,2) DEFAULT 0,
  ad_creative JSONB,
  targeting JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE
);

-- Revenue Events Table
CREATE TABLE IF NOT EXISTS revenue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  workspace_id UUID REFERENCES workspaces(id),
  source TEXT CHECK (source IN ('seo', 'ads', 'outbound', 'referral', 'organic', 'direct')) NOT NULL,
  campaign_id UUID,
  channel_detail TEXT,
  revenue DECIMAL(10,2) DEFAULT 0,
  event_type TEXT CHECK (event_type IN ('lead', 'signup', 'trial', 'subscription', 'upgrade', 'downgrade', 'churn', 'renewal')),
  event_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  referrer_id UUID REFERENCES users(id),
  referral_code TEXT UNIQUE NOT NULL,
  reward_credits INTEGER DEFAULT 0,
  reward_tier TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'rewarded')) DEFAULT 'pending',
  referred_signup_at TIMESTAMP WITH TIME ZONE,
  referred_conversion_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Decision Logs
CREATE TABLE IF NOT EXISTS agent_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL,
  decision_type TEXT NOT NULL,
  context JSONB NOT NULL,
  decision JSONB NOT NULL,
  outcome TEXT,
  confidence DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Growth Events Extended
CREATE TABLE IF NOT EXISTS growth_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_context JSONB,
  event_data JSONB,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_outreach_lead ON outreach_sequences(lead_id);
CREATE INDEX IF NOT EXISTS idx_outreach_status ON outreach_sequences(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace ON outreach_campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ads_workspace ON ad_campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_revenue_source ON revenue_events(source);
CREATE INDEX IF NOT EXISTS idx_revenue_lead ON revenue_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_type ON agent_decisions(agent_type);

-- Enable RLS
ALTER TABLE outreach_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own outreach" ON outreach_sequences FOR ALL USING (true);
CREATE POLICY "Users can manage own campaigns" ON outreach_campaigns FOR ALL USING (true);
CREATE POLICY "Users can manage own ads" ON ad_campaigns FOR ALL USING (true);
CREATE POLICY "Users can manage own revenue" ON revenue_events FOR ALL USING (true);
CREATE POLICY "Users can manage own referrals" ON referrals FOR ALL USING (true);
CREATE POLICY "Users can view own decisions" ON agent_decisions FOR ALL USING (true);
CREATE POLICY "Users can view own events" ON growth_events FOR ALL USING (true);

-- Insert sample outreach templates
INSERT INTO outreach_campaigns (name, target_industry, message_template, channel, status) VALUES
('Cold Outreach - Real Estate', ARRAY['real-estate'], 'Hi {{name}}, I noticed your company is growing in the {{industry}} space. We help businesses like yours automate lead generation and close more deals with AI. Would you be open to a quick 5-minute call?', 'email', 'draft'),
('Cold Outreach - SaaS', ARRAY['saas', 'startups'], 'Hey {{name}}, seeing some great momentum with your product! We help SaaS companies scale their sales with AI-powered automation. Mind if I share how?', 'email', 'draft'),
('Re-engagement - Inactive Leads', ARRAY['real-estate', 'saas', 'marketing'], 'Hi {{name}}, it has been a while since we connected. I wanted to follow up on our previous conversation and see if now might be a better time to chat about how AI can help your business.', 'email', 'draft')
ON CONFLICT DO NOTHING;
