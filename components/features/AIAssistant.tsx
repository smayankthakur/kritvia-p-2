'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS = [
  'What services do you offer?',
  'How much does a project cost?',
  'How do I get started?',
  'Tell me about your AI solutions',
];

const BOT_RESPONSES: Record<string, string> = {
  default: "Thanks for reaching out! I'm Kritvia's AI assistant. I can help you explore our services, get pricing estimates, or connect you with our team. What would you like to know?",
  services: "Kritvia offers: **AI Development** (ML models, LLMs, computer vision), **Web & SaaS Development** (Next.js, React, Node.js), **Cloud Architecture** (AWS, GCP, Azure), **Automation** (RPA, workflow automation), and **Data Engineering** (ETL, analytics platforms). Which area interests you most?",
  cost: "Project costs vary based on scope. Typical ranges: **Discovery & Strategy** from $5K, **Web/SaaS MVP** from $25K, **Enterprise AI Solutions** from $75K, **Full Platform Build** from $150K. Use our [Cost Estimator](/pricing) for a detailed quote, or we can schedule a free consultation.",
  started: "Getting started is easy! 1️⃣ **Book a free 30-min consultation** at /contact 2️⃣ **We'll assess your needs** and propose a roadmap 3️⃣ **Kick off in as little as 2 weeks**. Ready to schedule? Go to /contact",
  ai: "Our AI solutions include: custom **LLM integrations** (GPT-4, Claude, Llama), **ML model development**, **RAG pipelines**, **AI-powered analytics**, **computer vision**, and **conversational AI**. We've delivered 50+ AI projects across fintech, healthcare, and retail. Want to see case studies?",
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('service') || lower.includes('offer') || lower.includes('do you')) return BOT_RESPONSES.services;
  if (lower.includes('cost') || lower.includes('price') || lower.includes('much') || lower.includes('budget')) return BOT_RESPONSES.cost;
  if (lower.includes('start') || lower.includes('begin') || lower.includes('how')) return BOT_RESPONSES.started;
  if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('llm')) return BOT_RESPONSES.ai;
  return BOT_RESPONSES.default;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Kritvia's AI assistant. How can I help you today? 👋" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
    const response = getResponse(text);
    setIsTyping(false);
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300',
          'bg-gradient-to-br from-primary-500 to-secondary-600 hover:scale-110 hover:shadow-primary-500/30',
          isOpen && 'rotate-45',
        )}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.952 7.952 0 01-4.032-1.094l-.289-.17-2.99.557.557-2.99-.17-.29A7.952 7.952 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={cn(
          'fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl border overflow-hidden',
          'bg-neutral-900 border-neutral-700',
          'animate-in slide-in-from-bottom-4 duration-300',
        )}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-700 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Kritvia AI Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/70">Online · Responds instantly</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-neutral-800 text-neutral-100 rounded-bl-sm border border-neutral-700',
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 border border-neutral-700 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-primary-600/20 hover:border-primary-500 hover:text-primary-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-neutral-700">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4 text-white rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
