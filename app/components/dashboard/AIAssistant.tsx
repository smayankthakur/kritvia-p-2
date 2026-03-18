"use client";

import { useState } from "react";
import { 
  MessageCircle, 
  Send, 
  Zap, 
  CheckCircle,
  Clock
} from "lucide-react";

export default function AIAssistant() {
  const [messages, setMessages] = useState<Array<{
    id: number;
    content: string;
    isUser: boolean;
    timestamp: Date;
    isLoading?: boolean;
    suggestions?: string[];
  }>>([
    {
      id: 1,
      content: "Hello! I'm your Kritvia AI Assistant. How can I help you run your business today?",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: 2,
      content: "Hi! I'd like to understand why our sales dropped last week.",
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
    },
    {
      id: 3,
      content: "Let me analyze your sales data...",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
      isLoading: true,
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI thinking
    setMessages(prev => {
      const updated = [...prev];
      const lastMsg = updated[updated.length - 1];
      lastMsg.isLoading = true;
      return updated;
    });

    // Simulate AI response after delay
    setTimeout(() => {
      setMessages(prev => {
        const updated = [...prev];
        // Find the loading message and replace it
        const loadingIndex = updated.findIndex(msg => msg.isLoading);
        if (loadingIndex !== -1) {
          updated[loadingIndex] = {
            id: Date.now() + 1,
            content: "I analyzed your sales funnel and found a 23% drop in lead-to-opportunity conversion. The main issue is delayed follow-ups on webinar leads from last Tuesday. Only 35% of webinar leads were contacted within 24 hours, compared to your usual 80%.",
            isUser: false,
            timestamp: new Date(),
            suggestions: [
              "Schedule follow-ups with 15 high-intent webinar leads",
              "Launch a retargeting campaign for webinar attendees",
              "Set up automated lead response workflow"
            ]
          };
        }
        return updated;
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="h-10 w-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Kritvia Assistant
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ready to help you run your business
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-8">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] space-y-2 ${message.isUser ? "text-right" : ""}`}>
              {!message.isUser && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-3 w-3 bg-violet-500 rounded-full mt-1"></div>
                  <div>
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2 animate-pulse">
                        <div className="h-2 w-2 bg-gray-300 rounded"></div>
                        <div className="h-2 w-2 bg-gray-300 rounded"></div>
                        <div className="h-2 w-2 bg-gray-300 rounded"></div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-300 bg-white/10 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-xs">
                        {message.content}
                      </p>
                    )}
                    {message.suggestions && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                          Suggested actions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              className="bg-white/10 dark:bg-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-600/40 text-xs text-gray-300 dark:text-gray-400 px-3 py-1 rounded hover:text-white dark:hover:text-white transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {message.isUser && (
                <div className="flex items-end space-x-3">
                  <div>
                    <p className="text-sm text-gray-300 bg-white/10 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-xs">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex-shrink-0 h-3 w-3 bg-blue-500 rounded-full mt-1"></div>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 text-right">
              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Kritvia about your business..."
            className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-0"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            !input.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}