import { motion } from 'framer-motion';

export function AIDemoSection() {
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
            Ask Your Business Anything
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get instant insights and automated actions from your AI business operating system.
          </p>
        </motion.div>

        {/* AI Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="h-10 bg-slate-800/50 border-b border-white/5 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          
          <div className="p-6 space-y-4">
            {/* Chat Messages */}
            <div className="space-y-3 h-96 overflow-y-auto">
              {/* Example Prompt 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zM12 12a.5.5 0 000 1h7a.5.5 0 000-1h-7zm0 3a.5.5 0 000 0 0h4a.5.5 0 000 0 0h-4z" />
                  </svg>
                </div>
                <div className="bg-slate-700/50 rounded-xl px-4 py-2 max-w-xs text-sm">
                  Why did sales drop last week?
                </div>
              </div>
              
              {/* AI Response 1 */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-purple-600/20 rounded-xl px-4 py-2 max-w-xs text-sm">
                  Sales dropped 8% due to decreased LinkedIn ad performance. Your CTR fell from 2.1% to 1.4%. Recommended action: Increase budget by 15% and refresh ad creatives.
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zM12 12a.5.5 0 000 1h7a.5.5 0 000-1h-7zm0 3a.5.5 0 000 0 0h4a.5.5 0 000 0 0h-4z" />
                  </svg>
                </div>
              </div>
              
              {/* Example Prompt 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zM12 12a.5.5 0 000 0h7a.5.5 0 000 0-1h-7zm0 3a.5.5 0 000 0 0h4a.5.5 0 000 0 0h-4z" />
                  </svg>
                </div>
                <div className="bg-slate-700/50 rounded-xl px-4 py-2 max-w-xs text-sm">
                  Show top converting leads
                </div>
              </div>
              
              {/* AI Response 2 */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-purple-600/20 rounded-xl px-4 py-2 max-w-xs text-sm">
                  Top 3 leads: 1) Acme Corp (Score: 95) - Requested demo 2 days ago, 2) Beta Inc (Score: 87) - Downloaded pricing guide, 3) Gamma LLC (Score: 82) - Attended webinar. Suggested action: Send personalized follow-up to Acme Corp today.
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zM12 12a.5.5 0 000 1h7a.5.5 0 000-1h-7zm0 3a.5.5 0 000 0 0h4a.5.5 0 000 0 0h-4z" />
                  </svg>
                </div>
              </div>
              
              {/* Example Prompt 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zM12 12a.5.5 0 000 0h7a.5.5 0 000 0-1h-7zm0 3a.5.5 0 000 0 0h4a.5.5 0 000 0 0h-4z" />
                  </svg>
                </div>
                <div className="bg-slate-700/50 rounded-xl px-4 py-2 max-w-xs text-sm">
                  What should I do next?
                </div>
              </div>
              
              {/* AI Response 3 */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-purple-600/20 rounded-xl px-4 py-2 max-w-xs text-sm">
                  Based on your current data: 1) Launch email campaign to warm leads, 2) Schedule 3 sales calls for high-intent prospects, 3) Create retargeting ads for website visitors, 4) Review and optimize your sales funnel.
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
        </motion.div>
      </div>
    </section>
  );
}