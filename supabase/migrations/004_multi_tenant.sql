-- Multi-tenant SaaS Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- WORKSPACES TABLE
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  plan_limits JSONB DEFAULT '{"leads": 100, "ai_messages": 50, "users": 1}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WORKSPACE USERS TABLE
CREATE TABLE IF NOT EXISTS workspace_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  invited_by UUID,
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workspace_id)
);

-- SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'incomplete',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- USAGE METRICS TABLE
CREATE TABLE IF NOT EXISTS usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  count INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, metric_name, period_start)
);

-- INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS workspace_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  invited_by UUID NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, email)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_users_user ON workspace_users(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_users_workspace ON workspace_users(workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace ON subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_workspace ON usage_metrics(workspace_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_period ON usage_metrics(period_start);

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Workspaces: owners can access their workspace
CREATE POLICY "Owners can view their workspaces" ON workspaces
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Owners can update their workspaces" ON workspaces
  FOR UPDATE USING (owner_id = auth.uid());

-- Workspace users: members can access their workspaces
CREATE POLICY "Members can view workspace" ON workspace_users
  FOR SELECT USING (user_id = auth.uid());

-- Subscriptions: workspace owners can manage
CREATE POLICY "Owners can manage subscriptions" ON subscriptions
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_users WHERE user_id = auth.uid() AND role = 'owner')
  );

-- Usage metrics: workspace members can view
CREATE POLICY "Members can view usage" ON usage_metrics
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_users WHERE user_id = auth.uid())
  );

-- Workspace invitations: invited users can accept
CREATE POLICY "Can view own invitations" ON workspace_invitations
  FOR SELECT USING (email IN (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Function to create workspace on signup
CREATE OR REPLACE FUNCTION create_workspace_on_signup()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Create workspace
  INSERT INTO workspaces (name, owner_id, plan)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.email::text || "'s Workspace"),
    NEW.id,
    'free'
  )
  RETURNING id INTO new_workspace_id;

  -- Add user as workspace owner
  INSERT INTO workspace_users (user_id, workspace_id, role)
  VALUES (NEW.id, new_workspace_id, 'owner');

  -- Update user metadata with default workspace
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('workspace_id', new_workspace_id)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto workspace creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email IS NOT NULL)
  EXECUTE FUNCTION create_workspace_on_signup();

-- Service role policies (for admin operations)
CREATE POLICY "Service role can manage workspaces" ON workspaces
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage workspace users" ON workspace_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage usage" ON usage_metrics
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage invitations" ON workspace_invitations
  FOR ALL TO service_role USING (true) WITH CHECK (true);
