'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const invoices = [
  {
    id: 'INV-2026-001',
    client: 'TechCorp Inc.',
    project: 'Enterprise CRM Platform',
    amount: 25000,
    status: 'Paid',
    issuedDate: '2026-02-01',
    dueDate: '2026-02-15',
    paidDate: '2026-02-12',
  },
  {
    id: 'INV-2026-002',
    client: 'FinanceFirst',
    project: 'Mobile Banking App',
    amount: 15000,
    status: 'Paid',
    issuedDate: '2026-02-15',
    dueDate: '2026-03-01',
    paidDate: '2026-02-28',
  },
  {
    id: 'INV-2026-003',
    client: 'MedTech Solutions',
    project: 'Healthcare Analytics Dashboard',
    amount: 35000,
    status: 'Pending',
    issuedDate: '2026-03-01',
    dueDate: '2026-03-15',
    paidDate: null,
  },
  {
    id: 'INV-2026-004',
    client: 'TechCorp Inc.',
    project: 'Enterprise CRM Platform',
    amount: 30000,
    status: 'Pending',
    issuedDate: '2026-03-05',
    dueDate: '2026-03-20',
    paidDate: null,
  },
  {
    id: 'INV-2026-005',
    client: 'RetailHub',
    project: 'E-commerce Platform',
    amount: 10000,
    status: 'Draft',
    issuedDate: '2026-03-08',
    dueDate: '2026-03-22',
    paidDate: null,
  },
];

const statusColors: Record<string, string> = {
  'Paid': 'bg-green-500/20 text-green-400',
  'Pending': 'bg-yellow-500/20 text-yellow-400',
  'Overdue': 'bg-red-500/20 text-red-400',
  'Draft': 'bg-neutral-500/20 text-neutral-400',
};

export default function InvoicesPage() {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'draft'>('all');

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'paid') return inv.status === 'Paid';
    if (filter === 'pending') return inv.status === 'Pending';
    if (filter === 'draft') return inv.status === 'Draft';
    return true;
  });

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
  const draftRevenue = invoices.filter(i => i.status === 'Draft').reduce((sum, i) => sum + i.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Invoices</h1>
            <p className="text-neutral-400">Track payments and manage billing</p>
          </div>
          <Button className="bg-primary-600 hover:bg-primary-500">
            + Create Invoice
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-5">
              <div className="text-sm text-neutral-400 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-neutral-500">Received</div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-5">
              <div className="text-sm text-neutral-400 mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-400">${pendingRevenue.toLocaleString()}</div>
              <div className="text-xs text-neutral-500">Awaiting payment</div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-5">
              <div className="text-sm text-neutral-400 mb-1">Draft</div>
              <div className="text-2xl font-bold text-neutral-400">${draftRevenue.toLocaleString()}</div>
              <div className="text-xs text-neutral-500">Not sent</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'paid', 'pending', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm transition-colors',
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Invoices Table */}
        <Card className="bg-neutral-900 border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Invoice</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Client</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Project</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Amount</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Status</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Due Date</th>
                  <th className="text-right text-xs text-neutral-500 font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                    <td className="px-5 py-4">
                      <span className="font-medium text-white">{invoice.id}</span>
                    </td>
                    <td className="px-5 py-4 text-neutral-300">{invoice.client}</td>
                    <td className="px-5 py-4 text-neutral-400 text-sm">{invoice.project}</td>
                    <td className="px-5 py-4 text-white font-medium">${invoice.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={cn('px-2 py-1 text-xs rounded-full', statusColors[invoice.status])}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-400 text-sm">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                          👁️
                        </button>
                        <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                          📥
                        </button>
                        {invoice.status === 'Pending' && (
                          <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                            ✉️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
