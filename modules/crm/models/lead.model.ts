export interface Lead {
  id: number;
  name: string;
  email: string;
  company?: string;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source?: 'website' | 'referral' | 'social media' | 'email campaign' | 'event' | 'other';
  createdAt: Date;
  updatedAt: Date;
}