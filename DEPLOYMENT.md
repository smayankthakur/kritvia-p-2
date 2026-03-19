# Kritvia - AI Business Operating System

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Landing │ │Pricing  │ │Dashboard│ │  CRM    │ │   AI    │  │
│  │   Page  │ │  Page   │ │  Page   │ │  (Leads │ │Assistant│  │
│  │         │ │         │ │         │ │ Deals)  │ │         │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                            │
┌────────────────────────────▼────────────────────────────────────┐
│                     API LAYER (Next.js API)                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │  /leads  │ │  /deals   │ │  /ai      │ │ /billing  │       │
│  │  CRUD    │ │  CRUD     │ │  Chat     │ │ Stripe    │       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
└────────────────────────────┬────────────────────────────────────┘
                            │
┌────────────────────────────▼────────────────────────────────────┐
│                     INFRASTRUCTURE                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Supabase │  │  Stripe  │  │ Upstash  │  │  OpenAI  │       │
│  │   DB    │  │ Billing  │  │  Redis   │  │   API    │       │
│  │  Auth   │  │ Webhooks │  │ RateLimit│  │    AI    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │  Sentry  │  │  Queue   │  │  Events  │                     │
│  │ Monitoring│ │  Jobs    │  │  Logs    │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion |
| API | Next.js API Routes |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| AI | OpenAI API (GPT-4) |
| Billing | Stripe Subscriptions |
| Rate Limiting | Upstash Redis |
| Monitoring | Sentry |
| Validation | Zod |

## Features

### Core SaaS Features
- ✅ Multi-tenant workspaces
- ✅ Stripe subscription billing (Free/Starter/Pro/Enterprise)
- ✅ Usage-based plan enforcement
- ✅ Rate limiting (Redis-backed)
- ✅ Background job processing
- ✅ Event logging & analytics

### CRM Features
- ✅ Lead management (CRUD)
- ✅ Deal pipeline (Kanban)
- ✅ AI-powered insights
- ✅ AI chat assistant

### Platform Features
- ✅ Premium landing page
- ✅ Contact form with email
- ✅ Blog system
- ✅ Production monitoring (Sentry)
- ✅ Structured logging

## Deployment Guide

### Prerequisites
1. Node.js 18+
2. Supabase account
3. Stripe account
4. Upstash account (for Redis)
5. OpenAI API key
6. Sentry account (optional)

### Step 1: Clone & Install
```bash
git clone https://github.com/smayankthakur/kritvia-p-2
cd kritvia-p-2
npm install
```

### Step 2: Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Step 3: Database Setup
1. Go to Supabase Dashboard
2. Create a new project
3. Run the migration in `supabase/migrations/001_saas_tables.sql`

### Step 4: Stripe Setup
1. Create Stripe account
2. Create products for each plan
3. Get API keys
4. Set up webhook endpoint: `https://your-domain.com/api/billing/webhook`

### Step 5: Run Locally
```bash
npm run dev
```

### Step 6: Deploy to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads` | GET, POST | List/Create leads |
| `/api/leads/[id]` | GET, PUT, DELETE | Single lead |
| `/api/deals` | GET, POST | List/Create deals |
| `/api/deals/[id]` | GET, PUT, DELETE | Single deal |
| `/api/ai` | POST | AI chat |
| `/api/contact` | POST | Contact form |
| `/api/billing/checkout` | POST | Create checkout session |
| `/api/billing/portal` | POST | Manage subscription |
| `/api/billing/webhook` | POST | Stripe webhooks |

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| AI | 100/min |
| Leads/Deals | 60/min |
| Contact | 10/min |
| Auth | 5/min |

## Plan Features

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| Leads | 100 | 1,000 | 10,000 | ∞ |
| Deals | 50 | 200 | 1,000 | ∞ |
| AI Requests/mo | 10 | 100 | 500 | ∞ |
| Workspaces | 1 | 3 | 10 | ∞ |
| Support | - | Email | Priority | Dedicated |

## Security

- All API routes protected with auth
- Row Level Security (RLS) on database
- Input validation with Zod
- Rate limiting on all endpoints
- HTTPS enforced in production

## Monitoring

- Sentry for error tracking
- Structured logging
- Event tracking
- Performance monitoring
