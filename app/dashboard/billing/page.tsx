"use client";

import { motion } from "framer-motion";
import { PLANS } from "@/lib/billing";
import Link from "next/link";

export default function BillingPage() {
  const currentPlan = "free"; // Would come from user context

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: [
        "100 leads",
        "50 AI messages/month",
        "Basic CRM",
        "Email support",
      ],
      cta: "Current Plan",
      popular: false,
    },
    {
      id: "starter",
      name: "Starter",
      price: 2999,
      description: "For small teams",
      features: [
        "5,000 leads",
        "5,000 AI messages/month",
        "Advanced CRM",
        "Email support",
        "Basic automation",
      ],
      cta: "Upgrade",
      popular: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 7999,
      description: "For growing businesses",
      features: [
        "50,000 leads",
        "25,000 AI messages/month",
        "Advanced analytics",
        "Priority support",
        "All integrations",
        "Custom automations",
      ],
      cta: "Upgrade",
      popular: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: -1,
      description: "For large organizations",
      features: [
        "Unlimited leads",
        "Unlimited AI messages",
        "Dedicated support",
        "Custom integrations",
        "White-label",
        "SLA",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const usageData = [
    { label: "AI Messages", used: 23, limit: 50, color: "bg-indigo-500" },
    { label: "Leads", used: 45, limit: 100, color: "bg-emerald-500" },
    { label: "Storage", used: 0.2, limit: 1, unit: "GB", color: "bg-blue-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
        <p className="text-gray-500 mt-2">
          Manage your subscription and monitor usage
        </p>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">
              Current Plan
            </p>
            <h2 className="text-3xl font-bold">{PLANS.free.name}</h2>
            <p className="text-indigo-200 mt-2">
              {PLANS.free.price === 0
                ? "Free forever"
                : `₹${PLANS.free.price}/month`}
            </p>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            View All Plans
          </Link>
        </div>
      </motion.div>

      {/* Usage Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {usageData.map((usage, index) => {
          const percentage = Math.min(100, (usage.used / usage.limit) * 100);
          return (
            <div
              key={usage.label}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">{usage.label}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    percentage > 80
                      ? "bg-red-100 text-red-700"
                      : percentage > 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {percentage > 80 ? "High" : percentage > 50 ? "Medium" : "Low"}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-3">
                {usage.used}
                {usage.unit && <span className="text-sm font-normal text-gray-500 ml-1">{usage.unit}</span>}
                <span className="text-sm font-normal text-gray-500"> / {usage.limit}</span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${usage.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Plans Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Upgrade Your Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-white rounded-xl border-2 p-6 ${
                plan.popular
                  ? "border-indigo-500 ring-2 ring-indigo-200"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              <div className="mt-4 mb-6">
                {plan.price === -1 ? (
                  <span className="text-2xl font-bold text-gray-900">Custom</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </>
                )}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  plan.id === currentPlan
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                disabled={plan.id === currentPlan}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Billing History
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No billing history yet</p>
          <p className="text-sm mt-1">
            Your billing history will appear here after your first payment
          </p>
        </div>
      </motion.div>
    </div>
  );
}
