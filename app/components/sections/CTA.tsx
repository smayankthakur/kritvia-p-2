<<<<<<< HEAD
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
=======
"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export default function CTA() {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-b from-black/90 to-black/80">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><path d=%22M0,0 L100,100 L0,100 Z%22 fill=%22%230B0F19%22 opacity=%220.1%22/%3E</svg>')]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10 blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none mb-6">
            Stop Managing Tools. Start Running Your Business.
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Kritvia is the AI Operating System that replaces your CRM, marketing tools, and operations — with one intelligent system.
          </p>
          <Button 
            className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started Free
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
>>>>>>> 8c88b573be037840ce560e58b824b8cff510d717
