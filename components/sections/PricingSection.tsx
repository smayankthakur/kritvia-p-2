import { motion } from 'framer-motion';
import Link from 'next/link';

export function PricingSection() {
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include access to the full AI Operating System.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Free Plan */}
          <motion.div
            key="free"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-slate-900/50 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Free</h3>
              <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">$0</span>
            </div>
            <p className="text-slate-400 mb-6">Perfect for getting started</p>
            <ul className="space-y-3 text-slate-400 mb-6">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Up to 1,000 contacts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Basic AI insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Email automation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Basic reporting</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105"
            >
              Start Free
            </Link>
          </motion.div>

          {/* Starter Plan */}
          <motion.div
            key="starter"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Starter</h3>
              <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">$49</span>
              <span className="text-xs text-slate-500">/mo</span>
            </div>
            <p className="text-slate-400 mb-6">For growing teams</p>
            <ul className="space-y-3 text-slate-400 mb-6">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Up to 10,000 contacts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Advanced AI insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Multi-channel automation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Custom reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>API access</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            key="pro"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Pro</h3>
              <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">$199</span>
              <span className="text-xs text-slate-500">/mo</span>
            </div>
            <p className="text-slate-400 mb-6">For scaling businesses</p>
            <ul className="space-y-3 text-slate-400 mb-6">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Unlimited contacts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Predictive AI</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Workflow automation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Dedicated support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Custom integrations</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            key="enterprise"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Enterprise</h3>
              <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">Custom</span>
              <span className="text-xs text-slate-500">/mo</span>
            </div>
            <p className="text-slate-400 mb-6">For large organizations</p>
            <ul className="space-y-3 text-slate-400 mb-6">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Custom AI models</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Advanced security</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>SLAs & uptime guarantee</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-purple-400">●</span>
                <span>On-premise deployment</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all hover:scale-105"
            >
              Contact Sales
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}