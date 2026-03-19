"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Business?
        </h2>
        <p className="text-lg text-blue-100 mb-8">
          Join thousands of businesses already using Kritvia to streamline their operations with AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button
              size="lg"
              className="px-8 bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              Start Free Trial
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-white text-white hover:bg-white/10"
            >
              Book Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
