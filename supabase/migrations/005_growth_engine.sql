-- Growth Engine Database Schema
-- SEO Keywords, Landing Pages, Content, and Performance Tracking

-- SEO Keywords Table
CREATE TABLE IF NOT EXISTS seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL UNIQUE,
  intent TEXT CHECK (intent IN ('informational', 'transactional', 'commercial', 'navigational')) DEFAULT 'informational',
  cluster TEXT,
  industry TEXT,
  use_case TEXT,
  difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100),
  volume INTEGER DEFAULT 0,
  cpc DECIMAL(10,2),
  status TEXT CHECK (status IN ('active', 'targeting', 'completed', 'dropped')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing Pages Table (Programmatic)
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  use_case TEXT NOT NULL,
  keyword_id UUID REFERENCES seo_keywords(id),
  title TEXT NOT NULL,
  h1 TEXT NOT NULL,
  meta_description TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  pain_points TEXT[],
  solution_content TEXT,
  features TEXT[],
  roi_content TEXT,
  cta_text TEXT DEFAULT 'Start Free Trial',
  cta_type TEXT DEFAULT 'primary',
  faq JSONB,
  internal_links JSONB,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  keyword_id UUID REFERENCES seo_keywords(id),
  meta_description TEXT,
  featured_image TEXT,
  author TEXT DEFAULT 'Kritvia Team',
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  avg_read_time INTEGER,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Content Performance Table
CREATE TABLE IF NOT EXISTS content_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type TEXT NOT NULL CHECK (page_type IN ('landing_page', 'blog', 'home', 'pricing', 'other')),
  page_slug TEXT NOT NULL,
  page_id UUID,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  scroll_depth DECIMAL(5,2) DEFAULT 0,
  cta_clicks INTEGER DEFAULT 0,
  form_starts INTEGER DEFAULT 0,
  form_submissions INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_slug, period_start)
);

-- Lead Capture Submissions
CREATE TABLE IF NOT EXISTS growth_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  business_type TEXT,
  industry TEXT,
  goal TEXT,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  lead_score INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')) DEFAULT 'new',
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Personalization Rules
CREATE TABLE IF NOT EXISTS personalization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_name TEXT NOT NULL,
  conditions JSONB NOT NULL,
  personalization JSONB NOT NULL,
  priority INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'paused', 'archived')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_seo_keywords_cluster ON seo_keywords(cluster);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_industry ON seo_keywords(industry);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_intent ON seo_keywords(intent);
CREATE INDEX IF NOT EXISTS idx_landing_pages_industry ON landing_pages(industry);
CREATE INDEX IF NOT EXISTS idx_landing_pages_usecase ON landing_pages(use_case);
CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON landing_pages(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_keyword ON blog_posts(keyword_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_slug ON content_performance(page_slug);
CREATE INDEX IF NOT EXISTS idx_content_performance_period ON content_performance(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_growth_leads_email ON growth_leads(email);
CREATE INDEX IF NOT EXISTS idx_growth_leads_status ON growth_leads(status);

-- RLS Policies
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalization_rules ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public can view published landing pages" ON landing_pages FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view active keywords" ON seo_keywords FOR SELECT USING (status = 'active');

-- Insert default industries
INSERT INTO seo_keywords (keyword, intent, cluster, industry, use_case, difficulty, volume) VALUES
('AI CRM for real estate', 'transactional', 'ai-crm', 'real-estate', 'lead-management', 45, 1200),
('best sales automation tool for startups', 'transactional', 'sales-automation', 'startups', 'sales-automation', 55, 1800),
('how to automate lead generation', 'informational', 'lead-generation', 'general', 'automation', 35, 3200),
('AI powered CRM for small business', 'transactional', 'ai-crm', 'small-business', 'crm', 40, 2100),
('automate customer relationship management', 'informational', 'crm-automation', 'general', 'automation', 30, 1500),
('lead tracking software for sales teams', 'transactional', 'lead-tracking', 'sales', 'lead-management', 50, 900),
('AI sales assistant for real estate agents', 'transactional', 'ai-sales', 'real-estate', 'sales-automation', 55, 600),
('automate real estate follow ups', 'transactional', 'follow-up-automation', 'real-estate', 'automation', 45, 800),
('SaaS CRM with AI insights', 'transactional', 'ai-crm', 'saas', 'analytics', 60, 1100),
('best CRM for marketing agencies', 'transactional', 'crm-marketing', 'marketing', 'crm', 48, 1400),
('AI lead scoring and qualification', 'transactional', 'lead-scoring', 'general', 'lead-management', 52, 750),
('automate outbound sales outreach', 'transactional', 'sales-outreach', 'sales', 'automation', 58, 950),
('free CRM with email integration', 'transactional', 'free-crm', 'general', 'crm', 38, 2800),
('AI business intelligence for sales', 'transactional', 'ai-bi', 'sales', 'analytics', 62, 650),
('real estate client management system', 'transactional', 'client-management', 'real-estate', 'crm', 42, 1100)
ON CONFLICT (keyword) DO NOTHING;

-- Insert default landing page templates
INSERT INTO landing_pages (slug, industry, use_case, title, h1, meta_description, status) VALUES
('real-estate/lead-generation', 'real-estate', 'lead-generation', 
 'AI CRM for Real Estate - Automate Lead Management',
 'Generate More Real Estate Leads with AI-Powered CRM',
 'Automate your real estate lead generation and management with Kritvia AI CRM. Intelligent lead scoring, automated follow-ups, and more.',
 'published'),
('saas/sales-automation', 'saas', 'sales-automation',
 'Sales Automation for SaaS Startups',
 'Scale Your SaaS Sales with AI Automation',
 'Automate your entire sales process with Kritvia. AI-powered insights, automated outreach, and predictive analytics.',
 'published'),
('marketing/crm', 'marketing', 'crm',
 'CRM for Marketing Agencies',
 'All-in-One CRM for Marketing Agencies',
 'Manage clients, track campaigns, and automate workflows. Built for modern marketing agencies.',
 'published'),
('startups/lead-management', 'startups', 'lead-management',
 'Startup Lead Management System',
 'AI-Powered Lead Management for Startups',
 'Capture, qualify, and convert leads automatically. Built for fast-growing startups.',
 'published')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, keyword_id, status, published_at) VALUES
('How AI is Revolutionizing Real Estate CRM', 'ai-real-estate-crm',
 'Discover how artificial intelligence is transforming how real estate agents manage leads and close deals.',
 'Full article content here...',
 (SELECT id FROM seo_keywords WHERE keyword = 'AI CRM for real estate' LIMIT 1),
 'published',
 NOW()),
('The Ultimate Guide to Sales Automation in 2024', 'sales-automation-guide-2024',
 'Learn everything about sales automation and how AI can transform your sales process.',
 'Full article content here...',
 (SELECT id FROM seo_keywords WHERE keyword = 'best sales automation tool for startups' LIMIT 1),
 'published',
 NOW())
ON CONFLICT (slug) DO NOTHING;
