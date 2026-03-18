import { motion } from "framer-motion";

export default function HowItWorks() {
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
            How It Works
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Three simple steps to run your entire business on AI.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Step 1 */}
          <div className="flex-1 bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-8 text-center">
            <div className="h-12 w-12 mx-auto mb-6 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              01
            </div>
            <h3 className="font-semibold text-white mb-4">Connect your data</h3>
            <p className="text-gray-300">
              Sync your CRM, email, marketing, and ops tools with one-click integrations. All your business data flows into a unified intelligence layer.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex-1 bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-8 text-center">
            <div className="h-12 w-12 mx-auto mb-6 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              02
            </div>
            <h3 className="font-semibold text-white mb-4">AI understands your business</h3>
            <p className="text-gray-300">
              Our AI analyzes patterns, predicts outcomes, and builds a deep understanding of your business operations, customers, and market dynamics.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex-1 bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-8 text-center">
            <div className="h-12 w-12 mx-auto mb-6 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              03
            </div>
            <h3 className="font-semibold text-white mb-4">AI runs operations</h3>
            <p className="text-gray-300">
              From sending personalized emails to launching campaigns and generating reports, Kritvia executes actions autonomously based on your goals.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}