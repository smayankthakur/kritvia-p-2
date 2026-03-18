import { motion } from 'framer-motion';

export function ProblemSection() {
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
            Your Business Runs on 10+ Tools That Don’t Talk
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Silos. Manual work. Missed opportunities.
          </p>
        </motion.div>

        {/* Tools Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 text-center mb-12"
        >
          {[
            { icon: '📊', label: 'CRM' },
            { icon: '📧', label: 'Email Tools' },
            { icon: '📈', label: 'Marketing Tools' },
            { icon: '📉', label: 'Analytics' },
            { icon: '⚙️', label: 'Ops Tools' },
            { icon: '💬', label: 'Support' },
            { icon: '📁', label: 'File Storage' },
            { icon: '📅', label: 'Calendar' },
            { icon: '📋', label: 'Task Management' },
          ].map((tool, i) => (
            <div key={i}>
              <span className="text-4xl mb-3 block">{tool.icon}</span>
              <p className="font-medium text-white">{tool.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Chaos Diagram - simple representation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative h-96 bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
          <div className="relative h-full flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-white mb-2">Disconnected Tools</h3>
              <p className="text-slate-400 max-w-md">
                Without a unified system, your data is scattered, leading to inefficiencies and lost revenue.
              </p>
              <div className="flex justify-center space-x-4">
                {/* We'll create a simple chaotic network of dots and lines */}
                <div className="relative w-32 h-32">
                  {/* Dots representing tools */}
                  {[1, 2, 3, 4, 5].map((i, idx) => (
                    <div
                      key={idx}
                      className={`absolute w-4 h-4 bg-purple-500 rounded-full 
                        top-[${20 + idx * 10}%] left-[${30 + idx * 15}%] 
                        animate-pulse`}
                    />
                  ))}
                  {/* Lines representing lack of connection - we'll just show some random lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.1)_30%,transparent_70%)] 
                    bg-[size:300%_300%] animate-[move_10s_linear_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}