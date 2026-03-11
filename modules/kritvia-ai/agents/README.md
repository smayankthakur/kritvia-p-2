# Kritvia AI Agents

Specialized AI agents for different business functions.

## Agents

### CEO Agent (`ceo-agent/`)
- Revenue forecasting
- Market expansion advice
- Pricing suggestions

### Sales Agent (`sales-agent/`)
- Lead scoring
- Deal probability
- Follow-up suggestions
- Pipeline analysis

### Marketing Agent (`marketing-agent/`)
- Campaign analysis
- Content generation
- Ad optimization
- SEO insights

### Operations Agent (`operations-agent/`)
- Workflow automation
- Task orchestration
- Productivity insights

## Usage

```typescript
import { 
  generateStrategicInsight, 
  processSalesQuery,
  analyzeCampaign,
  processOperationsQuery 
} from '@kritvia/kritvia-ai/agents';
```

## Development

Each agent is a specialized module that can be extended with:
- Custom prompts
- Domain-specific knowledge
- Integration with external APIs
