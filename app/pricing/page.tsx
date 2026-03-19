'use client'

import { useState } from 'react'
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { pricingPlans, formatPrice, type PricingPlan } from "@/lib/config/pricing";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  // Find recommended plan
  const recommendedPlan = pricingPlans.find(p => p.recommended)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Pricing Plans
        </h2>
        <div className="mb-8 flex items-center justify-center space-x-4 text-gray-600">
          <span>Monthly</span>
          <div className="relative inline-flex h-6 w-11 items-center">
            <input
              id="pricing-toggle"
              type="checkbox"
              className="peer hidden"
              checked={isYearly}
              onChange={(e) => setIsYearly(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600">
              <div className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition peer-checked:translate-x-5 peer-checked:bg-white">
              </div>
            </div>
          </div>
          <span>Yearly</span>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan: PricingPlan, index: number) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`border rounded-xl shadow-sm p-6 flex flex-col h-full ${
                plan.recommended
                  ? "border-2 border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300 transition-border"
              }`}
            >
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                {plan.recommended && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                    Most Popular
                  </span>
                )}
                {!plan.custom && (
                  <div className="mt-4 text-2xl font-bold text-gray-900">
                    {formatPrice(isYearly ? plan.price.yearly : plan.price.monthly)}{" "}
                    <span className="text-gray-500 text-lg">
                      {isYearly ? "/year" : "/month"}
                    </span>
                  </div>
                )}
                {plan.custom && (
                  <div className="mt-4 text-2xl font-bold text-gray-900">
                    Custom
                    <span className="text-gray-500 text-lg">
                      /month
                    </span>
                  </div>
                )}
              </div>
              <ul className="mb-8 flex-1 space-y-4 text-gray-600">
                {plan.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <svg className="w-4 h-4 mt-1 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A4.002 4.002 0 006 8a4 4 0 107.898-.004c.012.016.023.034.023.052v.001l-.001.008a1 1 0 10-1.996.004v-.003c0-.028.011-.05.03-.069z" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {!plan.custom && (
                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <div className="space-y-1">
                    {plan.limits.map((limit, idx) => (
                      <div key={idx}>
                        <span className="font-medium">{limit.name}:</span>{" "}
                        {limit.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6">
                {plan.custom ? (
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    Contact Sales
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500">
          <p>
            All prices are in INR (₹). Yearly billing includes 2 months free.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
