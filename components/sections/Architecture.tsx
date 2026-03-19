"use client";

import { motion } from "framer-motion";

export default function Architecture() {
  const layers = [
    {
      name: "Data Layer",
      description: "Connect and unify all your business data",
      features: ["CRM Integration", "Lead Import", "Deal Tracking", "Customer History"],
      color: "from-blue-600 to-blue-400",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      name: "AI Engine",
      description: "Intelligent analysis and predictions",
      features: ["Predictive Analytics", "Pattern Recognition", "Risk Detection", "Opportunity Finding"],
      color: "from-purple-600 to-pink-400",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      name: "Action Engine",
      description: "Automated workflows and recommendations",
      features: ["Smart Prioritization", "Auto-Reminders", "Next Best Action", "Revenue Forecasting"],
      color: "from-cyan-600 to-teal-400",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const integrations = [
    { name: "Google Sheets", icon: "📊" },
    { name: "Salesforce", icon: "☁️" },
    { name: "HubSpot", icon: "🔶" },
    { name: "Slack", icon: "💬" },
    { name: "Zapier", icon: "⚡" },
    { name: "+100 more", icon: "➕" },
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            Under the Hood
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How Kritvia Works
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A powerful three-layer architecture that transforms your data into actionable growth.
          </p>
        </motion.div>

        {/* Architecture Layers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Card */}
              <div className="h-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
                {/* Layer indicator */}
                <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">
                  Layer {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${layer.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {layer.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">{layer.name}</h3>
                <p className="text-slate-400 mb-6">{layer.description}</p>
                
                {/* Features */}
                <ul className="space-y-3">
                  {layer.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-300 text-sm">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${layer.color} flex items-center justify-center`}>
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Connector */}
              {index < layers.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/50 rounded-2xl border border-slate-700/50 p-8"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-8">
            Works With Your Existing Tools
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
              >
                <span className="text-xl">{integration.icon}</span>
                <span className="text-sm font-medium">{integration.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
