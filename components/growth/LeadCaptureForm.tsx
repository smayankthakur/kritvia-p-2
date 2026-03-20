/**
 * Lead Capture Form
 * Smart multi-step form for converting visitors
 */

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LeadCaptureFormProps {
  source?: string
  cta?: string
  variant?: "inline" | "popup" | "floating"
  industry?: string
  onSuccess?: () => void
}

const businessTypes = [
  "Real Estate",
  "SaaS / Tech",
  "Marketing Agency",
  "Sales Team",
  "Startup",
  "E-commerce",
  "Finance",
  "Healthcare",
  "Education",
  "Other",
]

const goals = [
  "Generate more leads",
  "Automate sales process",
  "Improve customer retention",
  "Scale my business",
  "Better analytics",
  "Team collaboration",
  "Don't know yet",
]

export default function LeadCaptureForm({
  source = "website",
  cta = "Start Free Trial",
  variant = "inline",
  industry,
  onSuccess,
}: LeadCaptureFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    business_type: "",
    goal: "",
    industry: industry || "",
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== "" && formData.email.trim() !== ""
      case 2:
        return formData.business_type !== ""
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/growth/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source_page: source,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit")
      }

      setSubmitted(true)
      onSuccess?.()
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          You&apos;re all set!
        </h3>
        <p className="text-gray-600">
          Check your inbox for a confirmation email. We&apos;ll be in touch shortly!
        </p>
      </motion.div>
    )
  }

  const variants = {
    inline: "",
    popup: "fixed inset-0 z-50 flex items-center justify-center p-4",
    floating: "fixed bottom-4 right-4 z-50 max-w-sm",
  }

  const formContainer = {
    inline: "bg-white rounded-xl border border-gray-200 p-6",
    popup: "bg-white rounded-xl shadow-2xl p-6 max-w-md w-full",
    floating: "bg-white rounded-xl shadow-2xl p-6",
  }

  const content = (
    <div className={formContainer[variant as keyof typeof formContainer]}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {step === 1 && "Get Started Free"}
            {step === 2 && "Tell us about your business"}
            {step === 3 && "What are your goals?"}
          </h3>
          {variant === "popup" && (
            <button
              onClick={onSuccess}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        {/* Progress bar */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="john@company.com"
                  required
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {businessTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateField("business_type", type)}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        formData.business_type === type
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Goal
                </label>
                <div className="space-y-2">
                  {goals.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => updateField("goal", goal)}
                      className={`w-full p-3 text-left text-sm rounded-lg border transition-colors ${
                        formData.goal === goal
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-red-600 text-sm mt-4">{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!validateStep(step)}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Submitting..." : cta}
            </button>
          )}
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        No credit card required. Free 14-day trial.
      </p>
    </div>
  )

  if (variant === "popup" || variant === "floating") {
    return (
      <div className={variants[variant as keyof typeof variants]}>
        {variant === "popup" && (
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onSuccess}
          />
        )}
        {content}
      </div>
    )
  }

  return content
}
