"use client";

import { motion } from "framer-motion";

export default function KritviaInAction() {
  const steps = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Input Your Data",
      description: "Connect your leads, deals, and customer data in one click.",
      highlight: "Works with Excel, CRM, and 100+ integrations",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI Analysis",
      description: "Our AI analyzes patterns, predicts outcomes, and finds opportunities.",
      highlight: "Processes 10,000+ data points in seconds",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Actionable Insights",
      description: "Get specific recommendations you can implement immediately.",
      highlight: "Prioritized by ROI and urgency",
    },
  ];

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            See It In Action
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            From Data to Decisions
            <span className="block text-cyan-400">in 3 Simple Steps</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Watch how Kritvia transforms your raw business data into actionable growth strategies.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Card */}
              <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center text-white mb-6">
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 mb-4">{step.description}</p>
                <p className="text-sm text-cyan-400 font-medium">{step.highlight}</p>
              </div>
              
              {/* Arrow connector (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Live Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-slate-400 text-sm">AI Analysis Terminal</span>
          </div>
          
          <div className="font-mono text-sm space-y-4">
            <div className="flex gap-2">
              <span className="text-purple-400">$</span>
              <span className="text-slate-300">Analyzing 247 leads from your CRM...</span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2"
            >
              <span className="text-purple-400">$</span>
              <span className="text-slate-300">Found 3 high-priority leads ready for outreach</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex gap-2"
            >
              <span className="text-purple-400">$</span>
              <span className="text-green-400">✓ Identified 12 deals at risk of stagnation</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex gap-2"
            >
              <span className="text-purple-400">$</span>
              <span className="text-cyan-400">💡 Recommendation: Focus on 'Acme Corp' deal - 90% close probability</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
