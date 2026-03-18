import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export default function CTA() {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-b from-black/90 to-black/80">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><path d=%22M0,0 L100,100 L0,100 Z%22 fill=%22%230B0F19%22 opacity=%220.1%22/%3E</svg>')]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10 blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none mb-6">
            Stop Managing Tools. Start Running Your Business.
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Kritvia is the AI Operating System that replaces your CRM, marketing tools, and operations — with one intelligent system.
          </p>
          <Button 
            className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started Free
          </Button>
        </motion.div>
      </div>
    </section>
  );
}