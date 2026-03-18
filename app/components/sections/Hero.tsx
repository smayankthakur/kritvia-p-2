import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6 py-20 sm:py-24"
    >
      <div className="max-w-4xl text-center">
        <h1
          className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl"
        >
          The AI Operating System for Your Entire Business
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          CRM + Marketing + Operations + AI Agents unified
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Free
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              className="px-8 py-3 border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Book Demo
            </Button>
          </Link>
        </div>
      </div>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(90deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 50%)",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            animation: "gradientShift 15s ease infinite",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
