import { motion } from "framer-motion";

export default function Solution() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">
          The Solution: Kritvia AI Operating System
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Unified Platform
            </h3>
            <p className="text-gray-600">
              CRM, marketing, operations, and AI agents work together in one
              seamless interface, eliminating context switching and data silos.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              AI-Powered Automation
            </h3>
            <p className="text-gray-600">
              Intelligent agents automate repetitive tasks, from lead nurturing
              to inventory management, freeing your team for high-value work.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Real-Time Intelligence
            </h3>
            <p className="text-gray-600">
              Get instant insights across all business functions with AI-driven
              analytics that predict trends and recommend actions.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Scalable & Secure
            </h3>
            <p className="text-gray-600">
              Built for businesses of all sizes with enterprise-grade security,
              customizable workflows, and seamless integrations.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}