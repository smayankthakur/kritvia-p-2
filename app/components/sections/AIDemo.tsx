import { motion } from "framer-motion";

export default function AIDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          See Kritvia AI in Action
        </h2>
        <div className="bg-gray-50 rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Lead Scoring Assistant
                </h3>
                <p className="text-gray-600">
                  Watch as our AI analyzes lead data and automatically scores
                  prospects based on conversion likelihood.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Campaign Optimizer
                </h3>
                <p className="text-gray-600">
                  See how the AI adjusts marketing campaigns in real-time for
                  maximum ROI based on engagement metrics.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l3 3m0 0l3-3m-3 3V9" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Operations Coordinator
                </h3>
                <p className="text-gray-600">
                  Observe the AI managing workflows, assigning tasks, and
                  predicting bottlenecks before they occur.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1">
              Try Interactive Demo
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}