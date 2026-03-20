"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  options?: { value: string; label: string; icon?: string }[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "What do you want to do?",
    description: "Tell us what brings you to Kritvia",
    options: [
      { value: "manage-leads", label: "Manage leads & CRM", icon: "📊" },
      { value: "automate-workflows", label: "Automate workflows", icon: "⚡" },
      { value: "ai-insights", label: "Get AI insights", icon: "🤖" },
      { value: "scale-business", label: "Scale my business", icon: "📈" },
    ],
  },
  {
    id: 2,
    title: "What's your business size?",
    description: "Help us personalize your experience",
    options: [
      { value: "solo", label: "Just me (Solo)", icon: "👤" },
      { value: "startup", label: "2-10 employees", icon: "🚀" },
      { value: "growth", label: "11-50 employees", icon: "🌱" },
      { value: "enterprise", label: "50+ employees", icon: "🏢" },
    ],
  },
  {
    id: 3,
    title: "What industry are you in?",
    description: "We'll tailor recommendations for you",
    options: [
      { value: "saas", label: "SaaS / Tech", icon: "💻" },
      { value: "ecommerce", label: "E-commerce", icon: "🛒" },
      { value: "services", label: "Professional Services", icon: "💼" },
      { value: "other", label: "Other", icon: "🌐" },
    ],
  },
];

interface OnboardingFlowProps {
  onComplete?: (data: OnboardingData) => void;
}

interface OnboardingData {
  goal: string;
  businessSize: string;
  industry: string;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    goal: "",
    businessSize: "",
    industry: "",
  });

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleOptionSelect = (value: string) => {
    const step = onboardingSteps[currentStep];
    
    if (step.id === 1) {
      setFormData({ ...formData, goal: value });
    } else if (step.id === 2) {
      setFormData({ ...formData, businessSize: value });
    } else if (step.id === 3) {
      setFormData({ ...formData, industry: value });
    }
  };

  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setIsComplete(true);
      
      // Save onboarding data
      try {
        await fetch("/api/users/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (error) {
        console.error("Failed to save onboarding data:", error);
      }
      
      onComplete?.(formData);
    }
  };

  const handleSkip = () => {
    setIsComplete(true);
    onComplete?.(formData);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">You're All Set!</h2>
        <p className="text-slate-400 mb-6">
          Let's get you to your dashboard and start growing your business.
        </p>
        <Button
          onClick={() => window.location.href = "/dashboard"}
          className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500"
        >
          Go to Dashboard
        </Button>
      </motion.div>
    );
  }

  const step = onboardingSteps[currentStep];
  const canProceed = step.id === 1 ? !!formData.goal : step.id === 2 ? !!formData.businessSize : !!formData.industry;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            {step.title}
          </h2>
          <p className="text-slate-400 text-center mb-8">
            {step.description}
          </p>

          {/* Options */}
          {step.options && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {step.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    (step.id === 1 ? formData.goal : step.id === 2 ? formData.businessSize : formData.industry) === option.value
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-white font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Skip
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
