import { motion } from 'framer-motion';

export function HowItWorksSection() {
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
            How It Works
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Three simple steps to run your business on AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Step 1 */}
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-6 text-center p-8 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-3xl text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Connect your data</h3>
            <p className="text-slate-400">
              Sync your CRM, marketing tools, and operations systems in minutes.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-6 text-center p-8 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-3xl text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white">AI understands your business</h3>
            <p className="text-slate-400">
              Our intelligence layer learns your patterns, goals, and challenges.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-6 text-center p-8 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-3xl text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white">AI runs operations</h3>
            <p className="text-slate-400">
              Automated actions, insights, and recommendations execute in real-time.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}