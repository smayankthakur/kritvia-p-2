"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

interface LeadFormProps {
  source?: string;
  variant?: "inline" | "modal" | "slideup";
  onSuccess?: () => void;
}

const useCases = [
  { value: "leads", label: "Manage leads & CRM" },
  { value: "automation", label: "Automate workflows" },
  { value: "ai-insights", label: "Get AI insights" },
  { value: "scaling", label: "Scale my business" },
  { value: "other", label: "Something else" },
];

export default function LeadForm({ source = "website", variant = "inline", onSuccess }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    useCase: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source,
          leadScore: calculateLeadScore(formData),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSuccess(true);
      onSuccess?.();
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          useCase: "",
          message: "",
        });
      }, 3000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateLeadScore = (data: typeof formData): number => {
    let score = 0;
    
    // Base score for filled fields
    if (data.name) score += 10;
    if (data.email) score += 20;
    if (data.company) score += 15;
    if (data.useCase) score += 25;
    if (data.message) score += 20;
    
    // Bonus for specific use cases that indicate higher intent
    if (data.useCase === "scaling") score += 10;
    if (data.useCase === "automation") score += 5;
    
    return score;
  };

  const containerClass = variant === "modal" 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    : variant === "slideup"
    ? "fixed bottom-0 left-0 right-0 z-50 p-4"
    : "";

  const formClass = variant === "modal" || variant === "slideup"
    ? "bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl"
    : "bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50";

  if (variant === "slideup" && !isSuccess) {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className={containerClass}
      >
        <form onSubmit={handleSubmit} className={formClass}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Get Early Access</h3>
            <button type="button" onClick={() => {}} className="text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500"
            >
              {isSubmitting ? "Joining..." : "Get Early Access"}
            </Button>
          </div>
          
          <p className="text-xs text-slate-400 mt-3 text-center">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {!isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={containerClass}
        >
          <form onSubmit={handleSubmit} className={formClass}>
            {variant === "modal" && (
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Get in Touch</h3>
                <button type="button" onClick={() => {}} className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <Label htmlFor="name" className="text-slate-300 mb-2 block">
                  Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-indigo-500"
                />
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-slate-300 mb-2 block">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-indigo-500"
                />
              </div>

              {/* Company Field */}
              <div>
                <Label htmlFor="company" className="text-slate-300 mb-2 block">
                  Company <span className="text-slate-500">(optional)</span>
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-indigo-500"
                />
              </div>

              {/* Use Case Dropdown */}
              <div>
                <Label htmlFor="useCase" className="text-slate-300 mb-2 block">
                  What do you want to do? *
                </Label>
                <select
                  id="useCase"
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select an option</option>
                  {useCases.map((useCase) => (
                    <option key={useCase.value} value={useCase.value}>
                      {useCase.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Field */}
              <div>
                <Label htmlFor="message" className="text-slate-300 mb-2 block">
                  Message <span className="text-slate-500">(optional)</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 py-3 text-base font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>

              {/* Trust Signal */}
              <p className="text-xs text-slate-400 text-center">
                🔒 We respect your privacy. No spam, ever.
              </p>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${formClass} text-center`}
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-slate-300">
            We've received your message. Our team will get back to you within 24 hours.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
