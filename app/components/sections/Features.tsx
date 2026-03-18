import { motion } from "framer-motion";

export default function Features() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Powerful Features to Transform Your Business
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100"
          >
            <div className="mb-6 w-16 h-16 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01-.5-.5h1a.5.5 0 010 1H12zm0 4a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              CRM & Sales Management
            </h3>
            <p className="text-gray-600">
              Manage leads, track deals, and automate follow-ups with intelligent
              CRM that learns from your sales patterns.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100"
          >
            <div className="mb-6 w-16 h-16 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01-.5-.5h1a.5.5 0 010 1H12zm0 4a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Marketing Automation
            </h3>
            <p className="text-gray-600">
              Create, schedule, and optimize multi-channel campaigns with AI-driven
              personalization and real-time performance tracking.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100"
          >
            <div className="mb-6 w-16 h-16 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01-.5-.5h1a.5.5 0 010 1H12zm0 4a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Operations & Workflow
            </h3>
            <p className="text-gray-600">
              Streamline operations with customizable workflows, automated task
              management, and real-time collaboration tools.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100"
          >
            <div className="mb-6 w-16 h-16 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01-.5-.5h1a.5.5 0 010 1H12zm0 4a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              AI Agents & Assistants
            </h3>
            <p className="text-gray-600">
              Deploy specialized AI agents for sales, support, marketing, and
              operations that work 24/7 to boost productivity and accuracy.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100"
          >
            <div className="mb-6 w-16 h-16 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01-.5-.5h1a.5.5 0 010 1H12zm0 4a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Analytics & Intelligence
            </h3>
            <p className="text-gray-600">
              Get deep insights with predictive analytics, custom dashboards, and
              AI-powered recommendations for data-driven decisions.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100"
          >
            <div className="mb-6 w-16 h-16 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01-.5-.5h1a.5.5 0 010 1H12zm0 4a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Integrations & API
            </h3>
            <p className="text-gray-600">
              Connect with 1000+ apps and services through our extensive
              integration library and robust API for seamless data flow.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}