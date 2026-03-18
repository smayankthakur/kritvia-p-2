import { motion } from 'framer-motion';

export function FeaturesSection() {
  return (
    <section className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Features → Outcomes (Not Features)
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Focus on what matters: results that move your business forward.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Feature Cards */}
          {[
            {
              title: "Close More Deals Automatically",
              description: "AI identifies high-intent leads, suggests next steps, and automates follow-ups.",
              icon: "🎯",
              bgGradient: "from-purple-500 to-blue-500"
            },
            {
              title: "Run Marketing on Autopilot",
              description: "Campaigns optimize themselves based on real-time performance data.",
              icon: "📈",
              bgGradient: "from-blue-500 to-cyan-500"
            },
            {
              title: "Get Daily Business Insights",
              description: "Wake up to personalized insights about what's working and what needs attention.",
              icon: "💡",
              bgGradient: "from-green-500 to-emerald-500"
            },
            {
              title: "Replace Your Entire Stack",
              description: "One system that handles CRM, marketing, operations, and analytics.",
              icon: "🔄",
              bgGradient: "from-pink-500 to-purple-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}