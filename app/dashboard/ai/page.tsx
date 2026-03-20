"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  {
    label: "Analyze my leads",
    prompt: "Analyze my current leads and tell me which ones are most likely to convert based on their score and activity.",
  },
  {
    label: "Growth strategy",
    prompt: "Give me a growth strategy for my business based on my current sales pipeline.",
  },
  {
    label: "Next best actions",
    prompt: "What are the next best actions I should take to close more deals this month?",
  },
  {
    label: "Write email",
    prompt: "Write a follow-up email for a lead who hasn't responded in 2 weeks.",
  },
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [useStreaming, setUseStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call the AI API
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.message?.content || "I'm here to help!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Track usage
      await supabase.from("ai_logs").insert({
        workspace_id: "default", // Would come from user context
        user_id: "anonymous",
        prompt: content,
        response: assistantMessage.content,
        tokens_used: data.tokens || 0,
        model: data.model || "gpt-3.5-turbo",
      });
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please try again or rephrase your question.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-500 mt-2">
          Your intelligent business assistant powered by AI
        </p>
      </motion.div>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-sm text-gray-500 mb-3">Quick actions:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickPrompts.map((item) => (
              <button
                key={item.label}
                onClick={() => handleQuickPrompt(item.prompt)}
                disabled={loading}
                className="p-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chat Container */}
      <div className="bg-white rounded-xl border border-gray-200 h-[calc(100%-120px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How can I help you today?
              </h3>
              <p className="text-gray-500 max-w-md">
                Ask me about your leads, deals, or get business insights. I can
                analyze your data and provide actionable recommendations.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">
                        {message.role === "user" ? "👤" : "🤖"}
                      </span>
                      <div className="flex-1 whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-indigo-200"
                          : "text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🤖</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your business..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📊</span>
            <h4 className="font-medium text-gray-900">Data Analysis</h4>
          </div>
          <p className="text-sm text-gray-500">
            Analyze your leads, deals, and performance metrics
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💡</span>
            <h4 className="font-medium text-gray-900">Smart Insights</h4>
          </div>
          <p className="text-sm text-gray-500">
            Get actionable recommendations for your business
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">✍️</span>
            <h4 className="font-medium text-gray-900">Content Generation</h4>
          </div>
          <p className="text-sm text-gray-500">
            Write emails, proposals, and follow-ups instantly
          </p>
        </div>
      </motion.div>
    </div>
  );
}
