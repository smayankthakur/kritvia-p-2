"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";

export default function AIDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleDemo = async () => {
    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setResponse("Based on your data, I recommend focusing on high-value leads in the 'Contacted' stage. Your conversion rate could improve by 25% with automated follow-ups.");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-indigo-900 text-white"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold">
          Try Kritvia AI
        </h2>
        <p className="mb-8 text-indigo-200">
          See how AI can transform your business in seconds
        </p>
        
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
          {response ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg"
            >
              {response}
            </motion.p>
          ) : (
            <p className="text-indigo-300">
              Click the button to get an AI-powered business insight
            </p>
          )}
        </div>

        <Button
          onClick={handleDemo}
          disabled={isLoading}
          className="bg-white text-indigo-900 hover:bg-gray-100"
        >
          {isLoading ? "Analyzing..." : "Get AI Insight"}
        </Button>
      </div>
    </motion.div>
  );
}
