<<<<<<< HEAD
=======
"use client";

>>>>>>> 8c88b573be037840ce560e58b824b8cff510d717
import { motion } from "framer-motion";

export default function Solution() {
  return (
<<<<<<< HEAD
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
=======
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            One System. Total Control.
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Kritvia unifies your data, intelligence, and actions in a single AI-powered operating system.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative"
        >
          {/* Three layers diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Data Layer */}
            <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
              <div className="h-12 w-12 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="font-semibold text-white mb-3">Data Layer</h3>
              <p className="text-gray-300 text-sm">
                All business data unified (CRM, leads, campaigns, ops)
              </p>
            </div>
            
            {/* Intelligence Layer */}
            <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
              <div className="h-12 w-12 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="font-semibold text-white mb-3">Intelligence Layer</h3>
              <p className="text-gray-300 text-sm">
                AI understands everything (RAG + decision engine)
              </p>
            </div>
            
            {/* Action Layer */}
            <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
              <div className="h-12 w-12 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="font-semibold text-white mb-3">Action Layer</h3>
              <p className="text-gray-300 text-sm">
                AI executes actions (emails, tasks, campaigns, insights)
              </p>
            </div>
          </div>
          
          {/* Connecting lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute inset-0" stroke="white" strokeWidth="1.5" opacity="20">
              <path d="M200 200 L400 200" />
              <path d="M400 200 L600 200" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
>>>>>>> 8c88b573be037840ce560e58b824b8cff510d717
  );
}