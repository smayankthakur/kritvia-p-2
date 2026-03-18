import { motion } from "framer-motion";

export default function AIDemo() {
  return (
    <section className="py-16 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ask Your Business Anything
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get instant insights and actions from your AI operating system.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-black/40 backdrop-blur rounded-2xl border border-white/10"
        >
          <div className="p-6 lg:p-12">
            {/* Chat header */}
            <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-white/5">
              <div className="h-8 w-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                AI
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-white">Kritvia Assistant</h3>
                <p className="text-sm text-gray-400">Ready to help you run your business</p>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="space-y-4 mb-6">
              {/* User message */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-3 w-3 bg-blue-500 rounded-full mt-1"></div>
                <div className="ml-3">
                  <p className="text-sm text-gray-300 bg-white/10 rounded-lg px-4 py-2 max-w-xs">
                    Why did sales drop last week?
                  </p>
                </div>
              </div>
              
              {/* AI response */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-3 w-3 bg-violet-500 rounded-full mt-1"></div>
                <div className="ml-3 space-y-2">
                  <p className="text-sm text-gray-300 bg-white/10 rounded-lg px-4 py-2 max-w-xl">
                    Our AI analyzed your funnel and found a 23% drop in lead-to-opportunity conversion. The main issue is delayed follow-ups on webinar leads.
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Suggested actions:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <button className="bg-white/10 hover:bg-white/20 text-xs text-gray-300 px-3 py-1 rounded hover:text-white transition-colors">
                      Schedule follow-ups
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-xs text-gray-300 px-3 py-1 rounded hover:text-white transition-colors">
                      Launch retargeting
                    </button>
                  </div>
                </div>
              </div>
              
              {/* User message */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-3 w-3 bg-blue-500 rounded-full mt-1"></div>
                <div className="ml-3">
                  <p className="text-sm text-gray-300 bg-white/10 rounded-lg px-4 py-2 max-w-xs">
                    Show top converting leads
                  </p>
                </div>
              </div>
              
              {/* AI response */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-3 w-3 bg-violet-500 rounded-full mt-1"></div>
                <div className="ml-3 space-y-2">
                  <p className="text-sm text-gray-300 bg-white/10 rounded-lg px-4 py-2 max-w-xl">
                    Here are your top 5 leads with 90%+ conversion probability: Enterprise Corp ($45K), StartupX ($12K), Growth Inc ($28K), TechSolutions ($33K), InnovateLtd ($19K).
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Suggested actions:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <button className="bg-white/10 hover:bg-white/20 text-xs text-gray-300 px-3 py-1 rounded hover:text-white transition-colors">
                      Send personalized emails
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-xs text-gray-300 px-3 py-1 rounded hover:text-white transition-colors">
                      Schedule calls
                    </button>
                  </div>
                </div>
              </div>
              
              {/* User message */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-3 w-3 bg-blue-500 rounded-full mt-1"></div>
                <div className="ml-3">
                  <p className="text-sm text-gray-300 bg-white/10 rounded-lg px-4 py-2 max-w-xs">
                    What should I do next?
                  </p>
                </div>
              </div>
              
              {/* AI response */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-3 w-3 bg-violet-500 rounded-full mt-1"></div>
                <div className="ml-3 space-y-2">
                  <p className="text-sm text-gray-300 bg-white/10 rounded-lg px-4 py-2 max-w-xl">
                    Schedule follow-ups with 3 high-intent leads from the webinar list and launch a retargeting campaign for visitors who viewed pricing but didn't convert.
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Suggested actions:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <button className="bg-white/10 hover:bg-white/20 text-xs text-gray-300 px-3 py-1 rounded hover:text-white transition-colors">
                      Execute now
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-xs text-gray-300 px-3 py-1 rounded hover:text-white transition-colors">
                      Review plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Input area */}
            <div className="flex items-center space-x-3 pt-4 border-t border-white/5">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ask Kritvia about your business..."
                  className="w-full bg-transparent border-none text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-0"
                />
              </div>
              <Button 
                className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg"
              >
                Send
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}