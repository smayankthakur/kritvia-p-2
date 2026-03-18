import { motion } from 'framer-motion';

export function SocialProofStrip() {
  return (
    <section className="py-12 bg-[#0B0F19] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm mb-8"
        >
          Trusted by modern teams building AI-first companies
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {/* Placeholder logos - in production these would be actual company logos */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-center"
            >
              <div className="w-20 h-12 bg-slate-800/50 rounded-xl border border-white/10 flex items-center justify-center">
                <span className="text-slate-400 text-xl">Co</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}