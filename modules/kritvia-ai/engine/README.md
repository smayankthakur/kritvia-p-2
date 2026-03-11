# Kritvia AI Engine

Core AI processing engines that power Kritvia AI.

## Components

### Decision Engine (`decision-engine/`)
Converts data into business decisions using:
- LLM reasoning
- Rules engine
- ML prediction models

**Features:**
- Lead scoring
- Business recommendations
- Predictive analytics

### Action Engine (`action-engine/`)
Executes business tasks automatically:
- Send emails
- Update CRM records
- Create tasks
- Generate reports

**Features:**
- Action routing
- API integrations
- Execution tracking

### Knowledge Layer (`knowledge-layer/`)
Provides long-term memory for the AI:
- Vector database storage
- RAG retrieval
- Document chunking and embedding

**Features:**
- Document ingestion
- Semantic search
- Context retrieval

## Usage

```typescript
import { 
  processDecision, 
  executeAction,
  retrieveContext 
} from '@kritvia/kritvia-ai/engine';
```

## Development

The engine components work together:
1. Knowledge Layer retrieves relevant context
2. Decision Engine processes and generates decisions
3. Action Engine executes automated tasks
