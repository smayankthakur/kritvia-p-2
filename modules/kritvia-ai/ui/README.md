# Kritvia AI UI

User interface components for interacting with Kritvia AI.

## Components

### AI Chat (`ai-chat/`)
Chat-based interaction with Kritvia AI.

**Example:**
> "What deals are most likely to close this month?"
> "Which marketing channel has the highest ROI?"

### AI Dashboard (`ai-dashboard/`)
Dashboard with automatic insights.

**Features:**
- Revenue drop prediction
- High-probability lead alerts
- Campaign performance warnings

### AI Command (`ai-command/`)
Command-based interaction.

**Example:**
> `/generate proposal for client`
> `/assign lead to sales rep`
> `/create onboarding workflow`

## Usage

```typescript
import { sendChatMessage } from '@kritvia/kritvia-ai/ui/ai-chat';
import { getDashboardData } from '@kritvia/kritvia-ai/ui/ai-dashboard';
import { executeCommand } from '@kritvia/kritvia-ai/ui/ai-command';
```

## Integration

These UI components can be integrated into Next.js pages with Tailwind CSS and Shadcn UI.
