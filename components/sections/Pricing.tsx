"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { motion } from "framer-motion";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: number;
  annualPrice: number;
  description: string;
  cta: string;
  popular?: boolean;
  recommended?: boolean;
  roi: string;
  features: PlanFeature[];
  limits: {
    users: string;
    aiMessages: string;
    contacts: string;
  };
}

const plans: Plan[] = [
  {
    name: "Free",
    price: 0,
    annualPrice: 0,
    description: "For individuals getting started",
    cta: "Get Started",
    roi: "Perfect for learning the basics",
    features: [
      { text: "Basic CRM", included: true },
      { text: "Lead Management", included: true },
      { text: "Email Support", included: true },
      { text: "Advanced Analytics", included: false },
      { text: "AI Insights", included: false },
      { text: "Automation Workflows", included: false },
      { text: "Priority Support", included: false },
      { text: "Custom Integrations", included: false },
    ],
    limits: {
      users: "1 user",
      aiMessages: "50/month",
      contacts: "100",
    },
  },
  {
    name: "Starter",
    price: 2999,
    annualPrice: 2399,
    description: "For growing businesses scaling with AI",
    cta: "Start Free Trial",
    popular: true,
    recommended: true,
    roi: "Save 20+ hours/month on manual work",
    features: [
      { text: "Advanced CRM", included: true },
      { text: "Lead Management", included: true },
      { text: "Email Support", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "AI Insights", included: true },
      { text: "Automation Workflows", included: true },
      { text: "Priority Support", included: false },
      { text: "Custom Integrations", included: false },
    ],
    limits: {
      users: "5 users",
      aiMessages: "5,000/month",
      contacts: "5,000",
    },
  },
  {
    name: "Pro",
    price: 7999,
    annualPrice: 6399,
    description: "For teams ready to scale operations",
    cta: "Start Free Trial",
    roi: "Increase sales efficiency by 35%",
    features: [
      { text: "Advanced CRM", included: true },
      { text: "Lead Management", included: true },
      { text: "24/7 Priority Support", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "AI Insights", included: true },
      { text: "Automation Workflows", included: true },
      { text: "Priority Support", included: true },
      { text: "Custom Integrations", included: true },
    ],
    limits: {
      users: "25 users",
      aiMessages: "25,000/month",
      contacts: "50,000",
    },
  },
  {
    name: "Enterprise",
    price: -1,
    annualPrice: -1,
    description: "For organizations needing full control",
    cta: "Contact Sales",
    roi: "Automate 80% of manual workflows",
    features: [
      { text: "Advanced CRM", included: true },
      { text: "Lead Management", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "AI Insights", included: true },
      { text: "Automation Workflows", included: true },
      { text: "Priority Support", included: true },
      { text: "Custom Integrations", included: true },
      { text: "Custom AI Models", included: true },
      { text: "SLA Guarantee", included: true },
      { text: "On-premise Deployment", included: true },
    ],
    limits: {
      users: "Unlimited",
      aiMessages: "Unlimited",
      contacts: "Unlimited",
    },
  },
];

// Simulated recommendation logic
function getRecommendedPlan(userSource: string = "organic"): string {
  switch (userSource) {
    case "ad":
      return "Starter";
    case "blog":
      return "Free";
    case "demo":
      return "Pro";
    default:
      return "Starter";
  }
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  
  // Get UTM source from URL on mount
  const [userSource, setUserSource] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("utm_source") || "organic";
    }
    return "organic";
  });
  
  // Compute recommended plan based on source
  const recommendedPlan = getRecommendedPlan(userSource);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the perfect plan for your business. Scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!annual ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-8 bg-slate-200 rounded-full transition-colors"
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-indigo-600 rounded-full shadow transition-transform ${
                  annual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
              Annual
              <span className="ml-2 text-xs text-green-600 font-medium">Save 20%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const isRecommended = plan.name === recommendedPlan;
            const displayPrice = annual && plan.price > 0 
              ? plan.annualPrice 
              : plan.price;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-600 to-cyan-600 shadow-2xl shadow-indigo-500/25 scale-105 z-10'
                    : 'bg-white border border-slate-200 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Popular & Recommended Badges */}
                {(plan.popular || isRecommended) && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {plan.popular && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⭐ Popular
                      </span>
                    )}
                    {isRecommended && !plan.popular && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ✓ Recommended
                      </span>
                    )}
                  </div>
                )}

                <div className={`p-6 ${plan.popular ? 'text-white' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.popular ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">₹</span>
                      <span className="text-5xl font-bold">
                        {plan.price === -1 ? 'Custom' : displayPrice.toLocaleString()}
                      </span>
                      {plan.price !== -1 && (
                        <span className={`text-lg ${plan.popular ? 'text-indigo-100' : 'text-slate-500'}`}>
                          /month
                        </span>
                      )}
                    </div>
                    {annual && plan.price > 0 && (
                      <p className={`text-sm mt-2 ${plan.popular ? 'text-indigo-100' : 'text-slate-500'}`}>
                        Billed ₹{(displayPrice * 12).toLocaleString()} annually
                      </p>
                    )}
                  </div>

                  {/* ROI Hint */}
                  <div className={`mb-4 p-3 rounded-xl text-center ${plan.popular ? 'bg-white/10' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`text-sm font-medium ${plan.popular ? 'text-green-100' : 'text-green-700'}`}>
                      {plan.roi}
                    </p>
                  </div>

                  {/* Limits */}
                  <div className={`mb-6 p-4 rounded-xl ${plan.popular ? 'bg-white/10' : 'bg-slate-50'}`}>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={plan.popular ? 'text-indigo-100' : 'text-slate-500'}>Users</span>
                        <span className={`font-semibold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                          {plan.limits.users}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={plan.popular ? 'text-indigo-100' : 'text-slate-500'}>AI Messages</span>
                        <span className={`font-semibold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                          {plan.limits.aiMessages}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={plan.popular ? 'text-indigo-100' : 'text-slate-500'}>Contacts</span>
                        <span className={`font-semibold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                          {plan.limits.contacts}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <svg
                            className={`w-5 h-5 flex-shrink-0 ${
                              plan.popular ? 'text-white' : 'text-green-500'
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 flex-shrink-0 text-slate-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? plan.popular
                                ? 'text-white'
                                : 'text-slate-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href={`/dashboard?plan=${plan.name.toLowerCase()}&source=${userSource}`}>
                    <Button
                      onClick={() => {
                        // Track plan selection event
                        if (typeof window !== 'undefined' && window.gtag) {
                          window.gtag('event', 'select_plan', {
                            plan_name: plan.name,
                            price: plan.price,
                            currency: "INR",
                          });
                        }
                      }}
                      className={`w-full py-3 font-semibold transition-all ${
                        plan.popular
                          ? 'bg-white text-indigo-600 hover:bg-slate-100 shadow-lg'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>

                {/* Glow Effect for Popular */}
                {plan.popular && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No credit card required for trial
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure payments
            </div>
          </div>
        </motion.div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600">
            Questions?{" "}
            <Link href="/contact" className="text-indigo-600 font-semibold hover:underline">
              Contact our sales team
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
