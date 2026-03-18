import { motion } from "framer-motion";

export default function UseCases() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Use Cases: Who Benefits from Kritvia
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Sales Teams
            </h3>
            <p className="text-gray-600">
              Close more deals with AI-powered lead scoring, automated follow-ups,
              and real-time sales analytics.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Marketing Agencies
            </h3>
            <p className="text-gray-600">
              Manage multiple client campaigns with AI-driven optimization and
              unified reporting.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              E-commerce Stores
            </h3>
            <p className="text-gray-600">
              Automate inventory, customer service, and marketing to scale your
              online business efficiently.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              SaaS Companies
            </h3>
            <p className="text-gray-600">
              Streamline customer onboarding, support, and product updates with
              integrated AI agents.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Consulting Firms
            </h3>
            <p className="text-gray-600">
              Deliver better client insights with automated data analysis and
              AI-powered recommendations.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Non-profits
            </h3>
            <p className="text-gray-600">
              Maximize impact with donor management, volunteer coordination, and
              AI-driven outreach.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}