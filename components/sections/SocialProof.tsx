"use client";

import { motion } from "framer-motion";

export default function SocialProof() {
  const testimonials = [
    {
      quote: "Kritvia helped us increase our lead conversion rate by 340% in just 3 months. The AI insights are incredibly accurate.",
      author: "Rajesh Kumar",
      role: "Founder, TechStart India",
      company: "TechStart",
      image: "RK",
    },
    {
      quote: "Finally, a tool that understands Indian business dynamics. Our sales team now closes 50% more deals with AI guidance.",
      author: "Priya Sharma",
      role: "VP Sales, GlobalServices",
      company: "GlobalServices",
      image: "PS",
    },
    {
      quote: "The predictive analytics are game-changing. We know which leads to focus on before we even call them.",
      author: "Amit Patel",
      role: "CEO, GrowthLabs",
      company: "GrowthLabs",
      image: "AP",
    },
  ];

  const stats = [
    { value: "340%", label: "Lead Conversion Increase" },
    { value: "50%", label: "More Deals Closed" },
    { value: "7 Days", label: "Average Time to ROI" },
    { value: "10x", label: "Return on Investment" },
  ];

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-4">
            Trusted by Growing Businesses
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Results That Speak
            <span className="block text-indigo-400">For Themselves</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm hover:border-indigo-500/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-slate-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-slate-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company Logos / Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-slate-700/50"
        >
          <p className="text-center text-slate-500 text-sm mb-8">Powering growth for companies across India</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['TechStart', 'GlobalServices', 'GrowthLabs', 'CloudTech', 'DataPro'].map((company) => (
              <span key={company} className="text-xl font-bold text-slate-400">{company}</span>
            ))}
          </div>
        </motion.div>

        {/* Founder Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm">
            Built by <span className="text-white font-medium">SitelYT</span> — powering Indian businesses with AI
          </p>
        </motion.div>
      </div>
    </section>
  );
}
