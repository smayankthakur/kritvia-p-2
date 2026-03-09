'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

type Step = 'input' | 'processing' | 'results';

export default function StartupBuilderPage() {
  const [step, setStep] = useState<Step>('input');
  const [formData, setFormData] = useState({
    idea: '',
    budget: '',
    timeline: '',
    teamSize: '',
  });

  const handleSubmit = () => {
    setStep('processing');
    setTimeout(() => setStep('results'), 2500);
  };

  const results = {
    estimatedCost: '$85,000 - $150,000',
    timeline: '5-8 months',
    techStack: ['Next.js', 'PostgreSQL', 'AWS', 'OpenAI', 'Stripe'],
    architecture: [
      'Frontend: Next.js 14 with TypeScript',
      'Backend: Node.js microservices',
      'Database: PostgreSQL + Redis',
      'Cloud: AWS (EC2, RDS, S3, CloudFront)',
      'AI: OpenAI API + LangChain',
      'Payments: Stripe integration',
    ],
    roadmap: [
      { phase: 'Month 1-2', title: 'Discovery & MVP Planning', deliverables: 'PRD, wireframes, architecture design' },
      { phase: 'Month 2-4', title: 'Core Development', deliverables: 'User auth, core features, API' },
      { phase: 'Month 4-6', title: 'AI Integration', deliverables: 'ML models, automation, analytics' },
      { phase: 'Month 6-8', title: 'Launch Preparation', deliverables: 'Testing, security audit, deployment' },
    ],
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="text-4xl mb-2 block">🚀</span>
          <h1 className="text-2xl font-bold text-white">Startup Builder</h1>
          <p className="text-neutral-400">Plan your SaaS product with AI-powered recommendations</p>
        </div>

        {step === 'input' && (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Describe your startup idea</label>
                <textarea
                  value={formData.idea}
                  onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                  placeholder="e.g., An AI-powered CRM for small businesses that helps automate lead follow-ups and predicts deal closure probability..."
                  className="w-full h-32 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Budget Range</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select budget</option>
                    <option value="20-50k">$20K - $50K</option>
                    <option value="50-100k">$50K - $100K</option>
                    <option value="100-200k">$100K - $200K</option>
                    <option value="200k+">$200K+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Timeline</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select timeline</option>
                    <option value="3-months">3 months</option>
                    <option value="6-months">6 months</option>
                    <option value="12-months">12 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Team Size</label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select team</option>
                    <option value="1">Solo founder</option>
                    <option value="2-3">2-3 people</option>
                    <option value="4-5">4-5 people</option>
                    <option value="5+">5+ people</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!formData.idea || !formData.budget}
                className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-40"
              >
                Generate My Startup Plan →
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'processing' && (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <h2 className="text-xl font-semibold text-white mb-2">Analyzing Your Idea...</h2>
              <p className="text-neutral-400">Our AI is generating a comprehensive plan tailored to your startup</p>
            </CardContent>
          </Card>
        )}

        {step === 'results' && (
          <div className="space-y-6">
            {/* Cost & Timeline */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{results.estimatedCost}</div>
                  <div className="text-neutral-400">Estimated Development Cost</div>
                </CardContent>
              </Card>
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{results.timeline}</div>
                  <div className="text-neutral-400">Estimated Timeline</div>
                </CardContent>
              </Card>
            </div>

            {/* Tech Stack */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Recommended Tech Stack</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {results.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Architecture */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Architecture Overview</h2>
                <div className="space-y-3">
                  {results.architecture.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-neutral-300">
                      <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-500">{i + 1}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Roadmap */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Development Roadmap</h2>
                <div className="space-y-4">
                  {results.roadmap.map((phase, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                        {i < results.roadmap.length - 1 && <div className="w-0.5 h-full bg-neutral-800 mt-1" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="text-sm text-primary-400 mb-1">{phase.phase}</div>
                        <div className="font-medium text-white">{phase.title}</div>
                        <div className="text-sm text-neutral-500 mt-1">{phase.deliverables}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep('input')} className="flex-1">
                ← Start Over
              </Button>
              <Button className="flex-1 bg-primary-600 hover:bg-primary-500">
                Schedule Consultation →
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
