import { motion } from 'framer-motion';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0B0F19] py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/10 to-transparent rounded-full" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Built for founders, teams, and scaling companies
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Run Your Entire Business on AI
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              Kritvia is the AI Operating System that replaces your CRM, marketing tools, and operations — with one intelligent system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Start Free
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* Right - Interactive AI Panel Mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            {/* AI Chat Panel */}
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 overflow-hidden shadow-2xl">
              <div className="h-10 bg-slate-800/50 border-b border-white/5 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              
              <div className="p-6 space-y-4">
                {/* Chat Messages */}
                <div className="space-y-3 h-64 overflow-y-auto">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zM12 12a.5.5 0 000 1h7a.5.5 0 000-1h-7zm0 3a.5.5 0 000 1h4a.5.5 0 000-1h-4z" />
                      </svg>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl px-4 py-2 max-w-xs text-sm">
                      Hi Kritvia, show me my sales performance this week
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-purple-600/20 rounded-xl px-4 py-2 max-w-xs text-sm">
                      Sales are up 12% this week compared to last week. Your top performing lead source is LinkedIn ads with 34 conversions.
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zM12 12a.5.5 0 000 1h7a.5.5 0 000-1h-7zm0 3a.5.5 0 000 0h4a.5.5 0 000 0-4h-4z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zM12 12a.5.5 0 000 0h7a.5.5 0 000 0-1h-7zm0 3a.5.5 0 000 0 0h4a.5.5 0 000 0 0h-4z" />
                      </svg>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl px-4 py-2 max-w-xs text-sm">
                      What should I do next to improve conversion rates?
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-purple-600/20 rounded-xl px-4 py-2 max-w-xs text-sm">
                      Based on your data, I recommend: 1) Increase LinkedIn ad budget by 20%, 2) Create a follow-up sequence for leads from webinar attendees, 3) A/B test your landing page headline.
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zM12 12a.5.5 0 000 0h7a.5.5 0 000 0-1h-7zm0 3a.5.5 0 000 0 0h4a.5.5 0 000 0 0h-4z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <input
                    type="text"
                    placeholder="Ask Kritvia anything about your business..."
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}