"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Powered CRM",
    description: "Intelligent customer relationship management with predictive insights",
    icon: "🤖"
  },
  {
    title: "Smart Automation",
    description: "Automate repetitive tasks with AI-driven workflows",
    icon: "⚡"
  },
  {
    title: "Lead Intelligence",
    description: "AI scoring and prioritization of your leads",
    icon: "🎯"
  },
  {
    title: "Pipeline Analytics",
    description: "Real-time insights into your sales pipeline",
    icon: "📊"
  },
  {
    title: "Team Collaboration",
    description: "Work together seamlessly with shared dashboards",
    icon: "👥"
  },
  {
    title: "Custom Integrations",
    description: "Connect with 1000+ apps through our extensive API",
    icon: "🔗"
  }
];

export default function Features() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Powerful Features to Transform Your Business
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
