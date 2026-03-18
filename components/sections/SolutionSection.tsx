import { motion } from 'framer-motion';

export function SolutionSection() {
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
            One System. Total Control.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Kritvia OS unifies your business data, intelligence, and actions in one intelligent system.
          </p>
        </motion.div>

        {/* 3-Layer Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="grid lg:grid-cols-1 gap-12">
            {/* Data Layer */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 bg-slate-900/50 rounded-2xl border border-white/10 p-6">
              <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">💾</span>
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-semibold text-white">Data Layer</h3>
                <p className="text-slate-400">
                  All business data unified (CRM, leads, campaigns, ops) in a single source of truth.
                </p>
              </div>
            </div>
            
            {/* Intelligence Layer */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 bg-slate-900/50 rounded-2xl border border-white/10 p-6">
              <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">🧠</span>
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-semibold text-white">Intelligence Layer</h3>
                <p className="text-slate-400">
                  AI understands everything with RAG + decision engine that learns from your business patterns.
                </p>
              </div>
            </div>
            
            {/* Action Layer */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 bg-slate-900/50 rounded-2xl border border-white/10 p-6">
              <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-semibold text-white">Action Layer</h3>
                <p className="text-slate-400">
                  AI executes actions: emails, tasks, campaigns, insights - all automated based on intelligence.
                </p>
              </div>
            </div>
          </div>
          
          {/* Connecting lines between layers */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute inset-0" stroke="white" strokeWidth="1" strokeDasharray="4,2" opacity="0.3">
              <path d="M200 150 Q250 100 300 150" />
              <path d="M200 250 Q250 300 300 250" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}