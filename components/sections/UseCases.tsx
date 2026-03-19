"use client";

import { motion } from "framer-motion";

const useCases = [
  {
    title: "Sales Teams",
    description: "Automate follow-ups and prioritize leads with AI"
  },
  {
    title: "Marketing",
    description: "Create personalized campaigns based on customer insights"
  },
  {
    title: "Customer Support",
    description: "AI-powered chatbots and ticket prioritization"
  },
  {
    title: "Operations",
    description: "Streamline workflows and reduce manual tasks"
  }
];

export default function UseCases() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Built for Every Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {useCase.title}
              </h3>
              <p className="text-gray-600">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
