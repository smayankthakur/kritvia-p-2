'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const samplePrompts = [
  "How can I integrate AI into my business?",
  "Build a machine learning pipeline",
  "Explain neural networks in simple terms",
  "Create a pricing strategy for SaaS",
];

const simulatedResponses = [
  "Based on your request, here's a comprehensive analysis...\n\n## AI Integration Strategy\n\n1. **Identify High-Impact Use Cases**\n   - Customer service automation\n   - Predictive analytics\n   - Document processing\n\n2. **Technical Implementation**\n   ```python\n   from kritvia import AIEngine\n   \n   engine = AIEngine(model='gpt-4')\n   result = engine.analyze(customer_data)\n   ```\n\n3. **ROI Projection**\n   - 40% reduction in operational costs\n   - 3x faster decision-making\n   - 99.9% accuracy in predictions",
  
  "Here's a complete ML pipeline architecture:\n\n```python\nfrom kritvia.ml import Pipeline\n\npipeline = Pipeline([\n    DataLoader(),\n    Preprocessor(),\n    FeatureExtractor(),\n    ModelTrainer(model='transformer'),\n    Evaluator()\n])\n\npipeline.train(data)\npipeline.deploy(production=True)\n```\n\n**Key Components:**\n- Data ingestion from multiple sources\n- Automated feature engineering\n- Model versioning with MLflow\n- A/B testing infrastructure",
  
  "## Neural Networks Explained Simply\n\nThink of a neural network like a team of specialists:\n\n- **Input Layer**: The questions you ask\n- **Hidden Layers**: The brain processing information\n- **Output Layer**: The answer you receive\n\nEach \"neuron\" is a simple decision-maker, but together they can solve incredibly complex problems!\n\n**Real-world analogy:** Like recognizing a face - your brain doesn't look at individual pixels, it recognizes patterns of features.",
  
  "## SaaS Pricing Strategy Framework\n\n### 1. Value-Based Pricing\n- Calculate customer ROI\n- Price at 10-20% of delivered value\n\n### 2. Tier Structure\n| Tier | Price | Features |\n|------|-------|----------|\n| Starter | $99/mo | Core features |\n| Pro | $299/mo | + Analytics |\n| Enterprise | Custom | Full platform |\n\n### 3. Psychological Triggers\n- Annual discount (20%)\n- Free trial (14 days)\n- Money-back guarantee",
];

export function AIPlayground() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * simulatedResponses.length);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: simulatedResponses[responseIndex],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSamplePrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Playground Container */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
            <div className="w-3 h-3 rounded-full bg-[#22D3EE]" />
            <div className="w-3 h-3 rounded-full bg-[#A78BFA]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">Kritvia AI</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[400px] overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#22D3EE] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Playground</h3>
              <p className="text-[#6B7280] mb-6">Try these sample prompts or ask your own question</p>
              <div className="flex flex-wrap justify-center gap-2">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSamplePrompt(prompt)}
                    className="px-4 py-2 text-sm bg-[#1A1A1A] hover:bg-[#252525] text-[#9CA3AF] rounded-lg transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-[#6366F1]' 
                    : 'bg-gradient-to-br from-[#6366F1] to-[#22D3EE]'
                }`}>
                  {message.role === 'user' ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-[#6366F1] text-white'
                      : 'bg-[#1A1A1A] text-[#F8FAFC]'
                  }`}>
                    <pre className="whitespace-pre-wrap font-mono text-sm text-left">
                      {message.content}
                    </pre>
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#22D3EE] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="bg-[#1A1A1A] px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-[#1A1A1A] p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={isTyping}
              className="flex-1 bg-[#1A1A1A] border border-[#252525] rounded-xl px-4 py-3 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#6366F1] transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#22D3EE] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
