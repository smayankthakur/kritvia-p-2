import { motion } from 'framer-motion';
import Link from 'next/link';

export function UseCasesSection() {
  return (
    <section className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Use Cases
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            See how different teams use Kritvia to run their business on AI.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              className="px-6 py-3 text-sm font-medium rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              Founders
            </button>
            <button
              className="px-6 py-3 text-sm font-medium rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              Sales Teams
            </button>
            <button
              className="px-6 py-3 text-sm font-medium rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              Marketing Teams
            </button>
            <button
              className="px-6 py-3 text-sm font-medium rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              Operations
            </button>
          </div>

          {/* Tab Content - Founders (active by default) */}
          <div className="space-y-6">
            <motion.div
              key="founders"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">For Founders</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">💡</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Strategic Decision Making</h4>
                    <p className="text-slate-400 text-sm">
                      Get AI-powered insights on market trends, competitor analysis, and growth opportunities to make informed decisions faster.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">📊</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Investor Reporting</h4>
                    <p className="text-slate-400 text-sm">
                      Automatically generate investor-ready reports with key metrics, performance trends, and forecasts.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">⚡</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Resource Optimization</h4>
                    <p className="text-slate-400 text-sm">
                      AI analyzes team performance and resource allocation to suggest optimizations for maximum impact.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tab Content - Sales Teams */}
            <motion.div
              key="sales"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">For Sales Teams</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">🎯</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Lead Prioritization</h4>
                    <p className="text-slate-400 text-sm">
                      AI scores leads based on intent, engagement, and fit to help reps focus on the most promising opportunities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">📧</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Automated Follow-ups</h4>
                    <p className="text-slate-400 text-sm">
                      Personalized email sequences are triggered automatically based on lead behavior and engagement patterns.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">📈</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Pipeline Forecasting</h4>
                    <p className="text-slate-400 text-sm">
                      Accurate sales forecasts based on historical data, current pipeline, and market conditions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tab Content - Marketing Teams */}
            <motion.div
              key="marketing"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">For Marketing Teams</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">📣</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Campaign Optimization</h4>
                    <p className="text-slate-400 text-sm">
                      AI continuously optimizes ad spend, targeting, and creative based on real-time performance data.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">🔍</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Customer Journey Analysis</h4>
                    <p className="text-slate-400 text-sm">
                      Understand the complete customer journey from first touch to conversion with AI-powered attribution.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">📝</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Content Performance</h4>
                    <p className="text-slate-400 text-sm">
                      Get insights on which content resonates best with your audience and recommendations for improvement.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tab Content - Operations */}
            <motion.div
              key="operations"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">For Operations</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">⚙️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Process Automation</h4>
                    <p className="text-slate-400 text-sm">
                      Automate repetitive tasks, approvals, and workflows based on business rules and AI recommendations.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">📋</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Resource Management</h4>
                    <p className="text-slate-400 text-sm">
                      Optimize team workload, project timelines, and resource allocation with AI-powered planning.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">🛡️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Risk Management</h4>
                    <p className="text-slate-400 text-sm">
                      Identify operational risks and compliance issues before they become problems with predictive analytics.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}