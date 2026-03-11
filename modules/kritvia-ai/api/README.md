# Kritvia AI API

REST API endpoints for AI functionality.

## Endpoints

### POST /ai/analyze
Analyze business data and provide insights.

**Request:**
```json
{
  "data": { ... },
  "analysisType": "sales"
}
```

### POST /ai/decision
Get AI-powered business decisions.

**Request:**
```json
{
  "type": "lead_scoring",
  "context": { ... }
}
```

### POST /ai/action
Execute AI-triggered actions.

**Request:**
```json
{
  "action": "send_email",
  "parameters": { ... }
}
```

### GET /ai/insights
Retrieve AI-generated insights.

**Query Params:**
- `type`: all | sales | marketing | operations | strategy
- `limit`: number of results

## Usage

```typescript
import { handleAnalyze, handleDecision, handleAction, handleInsights } from '@kritvia/kritvia-ai/api';
```

## Rate Limiting

API endpoints are rate-limited to ensure fair usage.

## Authentication

All endpoints require API key authentication via `X-API-Key` header.
