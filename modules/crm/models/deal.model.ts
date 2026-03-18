export interface Deal {
  id: number;
  title: string;
  value: number;
  stage: 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number; // percentage
  expectedCloseDate: Date;
  company?: string;
  contact?: string;
  createdAt: Date;
  updatedAt: Date;
}