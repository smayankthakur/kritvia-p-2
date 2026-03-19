"use client";

import { motion } from "framer-motion";

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            Product Preview
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Command Center for
            <span className="block text-indigo-400">Business Growth</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need to manage leads, close deals, and grow revenue — powered by AI.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Browser Frame */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
            {/* Browser Header */}
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-slate-700/50 rounded-lg px-4 py-1.5 text-sm text-slate-400 text-center max-w-md mx-auto">
                  kritvia.dashboard
                </div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="grid grid-cols-12 min-h-[500px]">
              {/* Sidebar */}
              <div className="col-span-2 bg-slate-800/50 border-r border-slate-700/50 p-4">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">K</span>
                  </div>
                  <span className="text-white font-semibold">Kritvia</span>
                </div>
                <nav className="space-y-1">
                  {['Dashboard', 'Leads', 'Deals', 'AI Assistant', 'Analytics', 'Settings'].map((item, i) => (
                    <div key={item} className={`px-3 py-2 rounded-lg text-sm ${i === 0 ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white'}`}>
                      {item}
                    </div>
                  ))}
                </nav>
              </div>
              
              {/* Main Content */}
              <div className="col-span-10 p-6">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Leads', value: '1,247', change: '+12%', color: 'text-indigo-400' },
                    { label: 'Active Deals', value: '89', change: '+5%', color: 'text-cyan-400' },
                    { label: 'Revenue', value: '₹24.5L', change: '+23%', color: 'text-green-400' },
                    { label: 'AI Insights', value: '12', change: 'New', color: 'text-purple-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                    </div>
                  ))}
                </div>
                
                {/* Pipeline & Insights */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Pipeline */}
                  <div className="col-span-2 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <h3 className="text-white font-semibold mb-4">Deal Pipeline</h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Acme Corp Deal', value: '₹5,00,000', stage: 'Negotiation', progress: 75 },
                        { title: 'TechStart Proposal', value: '₹2,50,000', stage: 'Proposal', progress: 50 },
                        { title: 'Global Services', value: '₹10,00,000', stage: 'New', progress: 25 },
                      ].map((deal) => (
                        <div key={deal.title} className="bg-slate-700/30 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm font-medium">{deal.title}</span>
                            <span className="text-green-400 text-sm font-medium">{deal.value}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full" style={{ width: `${deal.progress}%` }} />
                            </div>
                            <span className="text-xs text-slate-400">{deal.stage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI Insights Panel */}
                  <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-indigo-500/30">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold">AI Insights</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                        <p className="text-indigo-300 text-xs mb-1">💡 Recommendation</p>
                        <p className="text-white text-sm">Follow up with Acme Corp this week for 90% close probability</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                        <p className="text-cyan-300 text-xs mb-1">⚠️ At Risk</p>
                        <p className="text-white text-sm">3 deals haven't been updated in 7+ days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="absolute -right-4 top-1/4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            <p className="text-sm font-medium">Real-time Analytics</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
