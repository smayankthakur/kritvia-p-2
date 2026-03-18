import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
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
  );
}