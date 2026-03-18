"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export default function Pricing() {
  return (
    <section className="py-16 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Pricing
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Simple, transparent pricing that scales with your business.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Free */}
          <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
            <div className="space-y-4">
              <h3 className="font-semibold text-white mb-3">Free</h3>
              <p className="text-2xl font-bold text-white mb-4">$0</p>
              <p className="text-gray-400 mb-6">Forever free for individuals</p>
              <ul className="text-left text-gray-300 space-y-3">
                <li>✓ Unified data layer</li>
                <li>✓ Basic AI insights</li>
                <li>✓ Limited automations</li>
                <li>✓ Community support</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Free
              </Button>
            </div>
          </div>
          
          {/* Starter */}
          <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
            <div className="space-y-4">
              <h3 className="font-semibold text-white mb-3">Starter</h3>
              <p className="text-2xl font-bold text-white mb-4">$49</p>
              <p className="text-gray-400 mb-6">per month</p>
              <Badge variant="secondary" className="mb-4 inline-block px-3 py-1 text-xs">
                Most Popular
              </Badge>
              <ul className="text-left text-gray-300 space-y-3">
                <li>✓ Everything in Free</li>
                <li>✓ Advanced AI predictions</li>
                <li>✓ Unlimited automations</li>
                <li>✓ Email & chat support</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Button>
            </div>
          </div>
          
          {/* Pro */}
          <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
            <div className="space-y-4">
              <h3 className="font-semibold text-white mb-3">Pro</h3>
              <p className="text-2xl font-bold text-white mb-4">$199</p>
              <p className="text-gray-400 mb-6">per month</p>
              <ul className="text-left text-gray-300 space-y-3">
                <li>✓ Everything in Starter</li>
                <li>✓ Custom AI models</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Dedicated account manager</li>
                <li>✓ Priority support</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Contact Sales
              </Button>
            </div>
          </div>
          
          {/* Enterprise */}
          <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
            <div className="space-y-4">
              <h3 className="font-semibold text-white mb-3">Enterprise</h3>
              <p className="text-2xl font-bold text-white mb-4">Custom</p>
              <p className="text-gray-400 mb-6">per month</p>
              <ul className="text-left text-gray-300 space-y-3">
                <li>✓ Everything in Pro</li>
                <li>✓ Custom integrations</li>
                <li>✓ On-premise deployment</li>
                <li>✓ SLA guarantees</li>
                <li>✓ 24/7 premium support</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}