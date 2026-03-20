-- Self-Scaling AI Company Layer
-- Product Intelligence, Scaling, Pricing, Localization

-- Feature Usage Tracking
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  workspace_id UUID REFERENCES workspaces(id),
  feature TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  time_spent_seconds INTEGER DEFAULT 0,
  first_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Improvements
CREATE TABLE IF NOT EXISTS product_improvements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('feature_improvement', 'flow_fix', 'new_feature', 'deprecation', 'ux_improvement')),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT CHECK (status IN ('identified', 'in_progress', 'completed', 'rejected')) DEFAULT 'identified',
  impact_score INTEGER,
  effort_estimate TEXT,
  created_by TEXT DEFAULT 'ai',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Pricing History (for dynamic pricing)
CREATE TABLE IF NOT EXISTS pricing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan TEXT NOT NULL,
  price_before DECIMAL(10,2),
  price_after DECIMAL(10,2),
  reason TEXT,
  conversion_rate_before DECIMAL(5,2),
  conversion_rate_after DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor Intelligence
CREATE TABLE IF NOT EXISTS competitor_intel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_name TEXT NOT NULL,
  feature TEXT,
  pricing DECIMAL(10,2),
  positioning TEXT,
  threat_level TEXT CHECK (threat_level IN ('low', 'medium', 'high')),
  opportunity TEXT,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Localization
CREATE TABLE IF NOT EXISTS localization_strings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  context TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(locale, key)
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('revenue', 'churn', 'growth', 'usage', 'market')) NOT NULL,
  prediction JSONB NOT NULL,
  confidence DECIMAL(5,2),
  actual_value DECIMAL(10,2),
  accuracy_score DECIMAL(5,2),
  predicted_for DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Decision Memory
CREATE TABLE IF NOT EXISTS decision_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL,
  decision_type TEXT NOT NULL,
  context JSONB NOT NULL,
  decision JSONB NOT NULL,
  outcome TEXT,
  outcome_data JSONB,
  confidence_before DECIMAL(5,2),
  confidence_after DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  outcome_recorded_at TIMESTAMP WITH TIME ZONE
);

-- Network Effects
CREATE TABLE IF NOT EXISTS network_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT CHECK (type IN ('referral', 'share', 'testimonial', 'case_study', 'integration')),
  impact_score INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  conversion_value DECIMAL(10,2),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Metrics (for scaling)
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit TEXT,
  threshold_triggered BOOLEAN DEFAULT FALSE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feature_usage_user ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON feature_usage(feature);
CREATE INDEX IF NOT EXISTS idx_product_improvements_status ON product_improvements(status);
CREATE INDEX IF NOT EXISTS idx_predictions_type ON predictions(type);
CREATE INDEX IF NOT EXISTS idx_decision_memory_agent ON decision_memory(agent_type);
CREATE INDEX IF NOT EXISTS idx_system_metrics_type ON system_metrics(metric_type);

-- Enable RLS
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_intel ENABLE ROW LEVEL SECURITY;
ALTER TABLE localization_strings ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own feature usage" ON feature_usage FOR SELECT USING (true);
CREATE POLICY "System can manage improvements" ON product_improvements FOR ALL USING (true);
CREATE POLICY "Public can view pricing" ON pricing_history FOR SELECT USING (true);
CREATE POLICY "System can manage intel" ON competitor_intel FOR ALL USING (true);
CREATE POLICY "Public can view localization" ON localization_strings FOR SELECT USING (true);
CREATE POLICY "System can manage predictions" ON predictions FOR ALL USING (true);
CREATE POLICY "System can manage decisions" ON decision_memory FOR ALL USING (true);
CREATE POLICY "System can manage network effects" ON network_effects FOR ALL USING (true);
CREATE POLICY "System can manage metrics" ON system_metrics FOR ALL USING (true);

-- Insert default localization strings
INSERT INTO localization_strings (locale, key, value) VALUES
('en', 'hero.title', 'The AI Operating System for Your Business'),
('en', 'hero.subtitle', 'Automate leads, deals, and growth with AI that learns your business'),
('en', 'cta.start_trial', 'Start Free Trial'),
('en', 'cta.book_demo', 'Book a Demo'),
('hi', 'hero.title', 'आपके व्यापार के लिए AI ऑपरेटिंग सिस्टम'),
('hi', 'hero.subtitle', 'AI से लीड्स, डील्स और ग्रोथ को ऑटोमेट करें'),
('hi', 'cta.start_trial', 'मुफ्त ट्रायल शुरू करें'),
('es', 'hero.title', 'El Sistema Operativo de IA para su Negocio'),
('es', 'hero.subtitle', 'Automatice leads, deals y crecimiento con IA'),
('es', 'cta.start_trial', 'Comenzar Prueba Gratis')
ON CONFLICT DO NOTHING;
