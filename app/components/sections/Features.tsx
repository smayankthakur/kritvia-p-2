import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Features → Outcomes (Not Features)
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Replace your entire stack with intelligent automation that drives real business results.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Close More Deals Automatically */}
          <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center hover:bg-black/50 transition-all duration-300">
            <div className="h-10 w-10 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
              📈
            </div>
            <h3 className="font-semibold text-white mb-3">Close More Deals Automatically</h3>
            <p className="text-sm text-gray-300">
              AI identifies high-intent leads and automates follow-ups to increase conversion rates by 40%.
            </p>
          </div>
          
          {/* Run Marketing on Autopilot */}
          <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center hover:bg-black/50 transition-all duration-300">
            <div className="h-10 w-10 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
              🤖
            </div>
            <h3 className="font-semibold text-white mb-3">Run Marketing on Autopilot</h3>
            <p className="text-sm text-gray-300">
              Campaigns optimize themselves based on real-time performance data, reducing CAC by 35%.
            </p>
          </div>
          
          {/* Get Daily Business Insights */}
          <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center hover:bg-black/50 transition-all duration-300">
            <div className="h-10 w-10 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
              💡
            </div>
            <h3 className="font-semibold text-white mb-3">Get Daily Business Insights</h3>
            <p className="text-sm text-gray-300">
              Receive proactive insights and recommendations delivered every morning to your inbox.
            </p>
          </div>
          
          {/* Replace Your Entire Stack */}
          <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center hover:bg-black/50 transition-all duration-300">
            <div className="h-10 w-10 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
              🔄
            </div>
            <h3 className="font-semibold text-white mb-3">Replace Your Entire Stack</h3>
            <p className="text-sm text-gray-300">
              One system that handles CRM, marketing, analytics, and operations — eliminating tool sprawl.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}