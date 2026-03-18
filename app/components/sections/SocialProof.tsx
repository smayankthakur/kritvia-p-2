<<<<<<< HEAD
=======
"use client";

>>>>>>> 8c88b573be037840ce560e58b824b8cff510d717
import { motion } from "framer-motion";

export default function SocialProof() {
  return (
<<<<<<< HEAD
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          What Our Customers Say
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="mb-4 text-gray-600 italic">
              "Kritvia has transformed our business operations. We've seen a 30%
              increase in productivity and a 25% reduction in operational costs
              within the first three months."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                <p className="text-sm text-gray-500">CEO, TechStartup Inc.</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="mb-4 text-gray-600 italic">
              "The AI agents in Kritvia have automated our entire marketing
              funnel, allowing our team to focus on strategy and creative work.
              Our ROI has doubled since implementation."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Marcus Rodriguez</h4>
                <p className="text-sm text-gray-500">Marketing Director, GrowthCorp</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="mb-4 text-gray-600 italic">
              "As a small business owner, I was overwhelmed by the number of
              tools I needed to run my business. Kritvia replaced 5 different
              platforms and saved me over 15 hours per week."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Anita Desai</h4>
                <p className="text-sm text-gray-500">Owner, Boutique Retail Co.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
=======
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sm text-gray-400 font-medium">
            Trusted by modern teams building AI-first companies
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {/* Placeholder logos - in real implementation, these would be actual company logos */}
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 1</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 2</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 3</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 4</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 5</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 6</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
>>>>>>> 8c88b573be037840ce560e58b824b8cff510d717
  );
}