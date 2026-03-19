"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/Button";

export default function Pricing() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="mb-12 text-3xl font-bold text-gray-900">
          Simple, Transparent Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Free", price: "₹0", features: ["Up to 100 contacts", "1 AI Agent", "Basic Analytics"] },
            { name: "Starter", price: "₹2,999", features: ["1,000 contacts", "3 AI Agents", "Advanced Analytics"], popular: true },
            { name: "Pro", price: "₹7,999", features: ["10,000 contacts", "10 AI Agents", "Priority Support"] }
          ].map((plan, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border ${plan.popular ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">{plan.price}<span className="text-gray-500 text-sm">/mo</span></p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-600">{feature}</li>
                ))}
              </ul>
              <Link href="/pricing">
                <Button className="w-full">View Details</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
