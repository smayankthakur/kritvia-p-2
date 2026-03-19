"use client";

import { motion } from "framer-motion";

const problems = [
  "Too many disconnected tools",
  "Manual data entry waste",
  "Missed follow-ups",
  "No insights into pipeline"
];

export default function Problem() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gray-900 text-white"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="mb-8 text-3xl font-bold">
          Sound Familiar?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-700 rounded-lg"
            >
              {problem}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
