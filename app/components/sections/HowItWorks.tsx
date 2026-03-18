<<<<<<< HEAD
=======
"use client";

>>>>>>> 8c88b573be037840ce560e58b824b8cff510d717
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
<<<<<<< HEAD
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          How It Works
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
          >
            <div className="mb-6 w-16 h-16 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Step 1: Connect Your Data
            </h3>
            <p className="text-gray-600">
              Seamlessly integrate your existing tools and data sources with our
              unified platform. CRM, email, social media, and more - all in one
              place.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
          >
            <div className="mb-6 w-16 h-16 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Step 2: AI-Powered Insights
            </h3>
            <p className="text-gray-600">
              Our AI agents analyze your data in real-time, identifying patterns,
              predicting outcomes, and recommending actions to optimize your
              business performance.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
          >
            <div className="mb-6 w-16 h-16 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l3 3m0 0l3-3m-3 3V9" />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Step 3: Automated Action
            </h3>
            <p className="text-gray-600">
              Turn insights into action with automated workflows. From lead
              nurturing to inventory management, our AI agents execute tasks
              while you focus on strategy.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
=======
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
>>>>>>> 8c88b573be037840ce560e58b824b8cff510d717
  );
}