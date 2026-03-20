'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { Badge } from '@/app/components/ui/Badge'
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Loader2,
  BarChart3,
  Target,
  MessageSquare
} from 'lucide-react'

interface AuditForm {
  businessName: string
  industry: string
  monthlyRevenue: string
  currentLeads: string
  mainChallenge: string
  email: string
}

interface AuditResult {
  score: number
  insights: string[]
  recommendations: string[]
  potentialGrowth: string
}

export default function FreeAIAuditPage() {
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form')
  const [form, setForm] = useState<AuditForm>({
    businessName: '',
    industry: '',
    monthlyRevenue: '',
    currentLeads: '',
    mainChallenge: '',
    email: ''
  })
  const [results, setResults] = useState<AuditResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('loading')

    // Simulate AI analysis (in production, call real AI)
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Generate mock results based on input
    const mockResults: AuditResult = {
      score: Math.floor(Math.random() * 30) + 45, // 45-75 score
      insights: [
        `Your ${form.industry} business has untapped potential in lead conversion`,
        'AI automation could reduce manual follow-up time by 70%',
        'Current lead response time is likely > 24 hours - a major conversion killer',
      ],
      recommendations: [
        'Implement AI-powered lead scoring to prioritize hot leads',
        'Add automated follow-up sequences for new leads',
        'Use AI chatbot for 24/7 lead qualification',
      ],
      potentialGrowth: `${Math.floor(Math.random() * 40) + 20}% increase in leads`,
    }

    // Store lead in database
    try {
      await fetch('/api/growth/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.businessName,
          email: form.email,
          source: 'free-audit',
          metadata: {
            industry: form.industry,
            revenue: form.monthlyRevenue,
            leads: form.currentLeads,
            challenge: form.mainChallenge,
          }
        })
      })
    } catch (err) {
      console.error('Lead capture error:', err)
    }

    setResults(mockResults)
    setStep('results')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">Kritvia</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-300 hover:text-white transition">Home</Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white transition">Pricing</Link>
            <Link href="/contact" className="text-slate-300 hover:text-white transition">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="success" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Free AI Business Audit
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Get Your Free AI Business Score
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Answer 6 questions and our AI will analyze your business to find growth opportunities worth lakhs in revenue.
          </p>
        </div>

        {step === 'form' && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.businessName}
                      onChange={e => setForm({ ...form, businessName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Industry
                    </label>
                    <select
                      required
                      value={form.industry}
                      onChange={e => setForm({ ...form, industry: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select industry</option>
                      <option value="saas">SaaS / Software</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="finance">Finance / Fintech</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="e-commerce">E-Commerce</option>
                      <option value="marketing">Marketing Agency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Monthly Revenue (₹)
                    </label>
                    <select
                      required
                      value={form.monthlyRevenue}
                      onChange={e => setForm({ ...form, monthlyRevenue: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select range</option>
                      <option value="0-1L">₹0 - ₹1 Lakh</option>
                      <option value="1-5L">₹1 - ₹5 Lakhs</option>
                      <option value="5-10L">₹5 - ₹10 Lakhs</option>
                      <option value="10-50L">₹10 - ₹50 Lakhs</option>
                      <option value="50L+">₹50+ Lakhs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Monthly Leads
                    </label>
                    <select
                      required
                      value={form.currentLeads}
                      onChange={e => setForm({ ...form, currentLeads: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select range</option>
                      <option value="0-10">0 - 10 leads</option>
                      <option value="10-50">10 - 50 leads</option>
                      <option value="50-100">50 - 100 leads</option>
                      <option value="100-500">100 - 500 leads</option>
                      <option value="500+">500+ leads</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Biggest Challenge
                  </label>
                  <select
                    required
                    value={form.mainChallenge}
                    onChange={e => setForm({ ...form, mainChallenge: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select challenge</option>
                    <option value="leads">Not enough leads</option>
                    <option value="conversion">Low conversion rate</option>
                    <option value="followup">Poor lead follow-up</option>
                    <option value="time">No time for sales</option>
                    <option value="data">Need better analytics</option>
                    <option value="automation">Want to automate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email for your free report
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="you@company.com"
                  />
                </div>

                <Button type="submit" className="w-full py-4 text-lg">
                  <Brain className="w-5 h-5 mr-2" />
                  Generate My Free AI Audit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-center text-slate-500 text-sm">
                  Takes 2 minutes • No credit card required • Instant results
                </p>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'loading' && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="py-16 text-center">
              <Loader2 className="h-16 w-16 text-purple-400 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Analyzing Your Business...
              </h2>
              <p className="text-slate-400">
                Our AI is processing your data and generating personalized insights.
              </p>
              <div className="mt-8 flex justify-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'results' && results && (
          <div className="space-y-6">
            {/* Score Card */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
              <CardContent className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
                  <span className="text-4xl font-bold text-white">{results.score}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Your AI Business Score
                </h2>
                <p className="text-purple-300">
                  Potential growth: <span className="font-bold text-green-400">{results.potentialGrowth}</span>
                </p>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {results.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-400" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {results.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                      <span className="flex items-center justify-center w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-slate-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Unlock Your Growth?
                </h3>
                <p className="text-slate-400 mb-6">
                  Get the full AI-powered platform that makes all this possible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="px-8">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg" className="px-8">
                    Book Demo Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-500">
          <p>© 2024 Kritvia - AI Business Operating System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
