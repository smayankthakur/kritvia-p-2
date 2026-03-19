"use client";

import { motion } from "framer-motion";

export default function Solution() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">
          One Platform, Infinite Possibilities
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Kritvia unifies your CRM, marketing, and operations into one intelligent system powered by AI.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Data', 'Intelligence', 'Action'].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 bg-indigo-50 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-indigo-900">{item}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
