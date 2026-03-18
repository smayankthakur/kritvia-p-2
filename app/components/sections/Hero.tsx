"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-b from-black/90 to-black/80">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><path d=%22M0,0 L100,100 L0,100 Z%22 fill=%22%230B0F19%22 opacity=%220.1%22/%3E</svg>')]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10 blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <div className="lg:w-1/2 space-y-6">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center space-x-3"
            >
              <Badge variant="secondary" className="text-sm">
                AI Operating System
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none">
                Run Your Entire Business on AI
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-300 max-w-xl leading-relaxed"
            >
              Kritvia is the AI Operating System that replaces your CRM, marketing tools, and operations — with one intelligent system.
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <Button 
                className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Free
              </Button>
              <Button 
                className="border border-white/20 hover:border-white/30 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300"
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-6 w-6 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                    AI
                  </div>
                  <h3 className="font-semibold text-white">Kritvia Assistant</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 py-2 border-b border-white/5 last:border-b-0">
                    <div className="flex-shrink-0 h-3 w-3 bg-violet-500 rounded-full mt-1"></div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-gray-300">Why did sales drop last week?</p>
                      <p className="text-xs text-gray-400">Our AI analyzed your funnel and found a 23% drop in lead-to-opportunity conversion.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 py-2 border-b border-white/5 last:border-b-0">
                    <div className="flex-shrink-0 h-3 w-3 bg-blue-500 rounded-full mt-1"></div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-gray-300">Show top converting leads</p>
                      <p className="text-xs text-gray-400">Here are your top 5 leads with 90%+ conversion probability.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 py-2 border-b border-white/5 last:border-b-0">
                    <div className="flex-shrink-0 h-3 w-3 bg-violet-500 rounded-full mt-1"></div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-gray-300">What should I do next?</p>
                      <p className="text-xs text-gray-400">Schedule follow-ups with 3 high-intent leads and launch a retargeting campaign.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          Built for founders, teams, and scaling companies
         </motion.div>
       </div>
     </section>
    );
}