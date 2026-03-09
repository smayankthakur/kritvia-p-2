'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

type ProjectType = 'web-app' | 'saas' | 'ai-integration' | 'mobile' | 'enterprise';
type ProjectSize = 'mvp' | 'standard' | 'enterprise';
type Timeline = 'rushed' | 'normal' | 'relaxed';

interface Estimates {
  min: number;
  max: number;
  weeks: [number, number];
}

const BASE_COSTS: Record<ProjectType, { min: number; max: number; label: string; icon: string }> = {
  'web-app': { min: 15000, max: 45000, label: 'Web Application', icon: '🌐' },
  'saas': { min: 40000, max: 120000, label: 'SaaS Platform', icon: '☁️' },
  'ai-integration': { min: 25000, max: 80000, label: 'AI Integration', icon: '🤖' },
  'mobile': { min: 30000, max: 90000, label: 'Mobile App', icon: '📱' },
  'enterprise': { min: 100000, max: 350000, label: 'Enterprise Solution', icon: '🏢' },
};

const SIZE_MULTIPLIERS: Record<ProjectSize, { multiplier: number; label: string; weeks: [number, number] }> = {
  mvp: { multiplier: 0.5, label: 'MVP (Core Features)', weeks: [6, 12] },
  standard: { multiplier: 1, label: 'Standard (Full Features)', weeks: [12, 20] },
  enterprise: { multiplier: 2, label: 'Enterprise (Advanced)', weeks: [20, 36] },
};

const TIMELINE_MULTIPLIERS: Record<Timeline, { multiplier: number; label: string }> = {
  rushed: { multiplier: 1.4, label: 'Urgent (< 3 months)' },
  normal: { multiplier: 1, label: 'Standard (3–6 months)' },
  relaxed: { multiplier: 0.85, label: 'Flexible (6+ months)' },
};

const ADDONS: { id: string; label: string; cost: number }[] = [
  { id: 'design', label: 'Custom UI/UX Design', cost: 8000 },
  { id: 'cms', label: 'CMS Integration', cost: 5000 },
  { id: 'auth', label: 'Advanced Auth & SSO', cost: 4000 },
  { id: 'analytics', label: 'Analytics Dashboard', cost: 6000 },
  { id: 'devops', label: 'CI/CD & DevOps Setup', cost: 5000 },
  { id: 'support', label: '6-Month Support Plan', cost: 7500 },
];

export function CostEstimator() {
  const [projectType, setProjectType] = useState<ProjectType>('web-app');
  const [projectSize, setProjectSize] = useState<ProjectSize>('standard');
  const [timeline, setTimeline] = useState<Timeline>('normal');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const calculate = (): Estimates => {
    const base = BASE_COSTS[projectType];
    const sizeM = SIZE_MULTIPLIERS[projectSize];
    const timelineM = TIMELINE_MULTIPLIERS[timeline];
    const addonCost = selectedAddons.reduce((sum, id) => {
      const addon = ADDONS.find((a) => a.id === id);
      return sum + (addon?.cost ?? 0);
    }, 0);

    return {
      min: Math.round((base.min * sizeM.multiplier * timelineM.multiplier + addonCost) / 1000) * 1000,
      max: Math.round((base.max * sizeM.multiplier * timelineM.multiplier + addonCost) / 1000) * 1000,
      weeks: sizeM.weeks,
    };
  };

  const estimate = calculate();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border-b border-neutral-800 p-6">
        <h2 className="text-2xl font-bold text-white">Project Cost Estimator</h2>
        <p className="text-neutral-400 mt-1 text-sm">Get an instant estimate for your project in seconds.</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Project Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-3">1. Project Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(Object.entries(BASE_COSTS) as [ProjectType, typeof BASE_COSTS[ProjectType]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setProjectType(key)}
                className={cn(
                  'p-3 rounded-xl border text-center transition-all text-sm',
                  projectType === key
                    ? 'bg-primary-600/20 border-primary-500 text-primary-300'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500',
                )}
              >
                <div className="text-xl mb-1">{val.icon}</div>
                <div className="font-medium text-xs leading-tight">{val.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Project Size */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-3">2. Project Scope</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.entries(SIZE_MULTIPLIERS) as [ProjectSize, typeof SIZE_MULTIPLIERS[ProjectSize]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setProjectSize(key)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  projectSize === key
                    ? 'bg-primary-600/20 border-primary-500'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-500',
                )}
              >
                <div className={cn('font-semibold text-sm mb-1', projectSize === key ? 'text-primary-300' : 'text-white')}>
                  {val.label}
                </div>
                <div className="text-xs text-neutral-400">{val.weeks[0]}–{val.weeks[1]} weeks</div>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-3">3. Timeline</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.entries(TIMELINE_MULTIPLIERS) as [Timeline, typeof TIMELINE_MULTIPLIERS[Timeline]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setTimeline(key)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  timeline === key
                    ? 'bg-primary-600/20 border-primary-500'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-500',
                )}
              >
                <div className={cn('font-semibold text-sm', timeline === key ? 'text-primary-300' : 'text-white')}>
                  {val.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-3">4. Add-ons (Optional)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ADDONS.map((addon) => (
              <button
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border text-left transition-all',
                  selectedAddons.includes(addon.id)
                    ? 'bg-secondary-600/20 border-secondary-500'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-500',
                )}
              >
                <span className={cn('text-sm', selectedAddons.includes(addon.id) ? 'text-secondary-300' : 'text-neutral-300')}>
                  {addon.label}
                </span>
                <span className="text-xs text-neutral-500">+{formatCurrency(addon.cost)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Estimate Result */}
        <div className="bg-gradient-to-br from-primary-900/50 to-secondary-900/50 border border-primary-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-400 mb-1">Estimated Investment</div>
              <div className="text-3xl font-bold text-white">
                {formatCurrency(estimate.min)} – {formatCurrency(estimate.max)}
              </div>
              <div className="text-sm text-neutral-400 mt-1">
                Estimated Timeline: {estimate.weeks[0]}–{estimate.weeks[1]} weeks
              </div>
            </div>
            <div className="text-5xl opacity-20">💰</div>
          </div>
          <p className="text-xs text-neutral-500 mt-4">
            * This is a rough estimate. Final pricing depends on detailed requirements. Schedule a free consultation for an accurate quote.
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Get Exact Quote →
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-xl transition-colors"
            >
              View Pricing Plans
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
