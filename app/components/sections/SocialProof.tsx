import { motion } from "framer-motion";

export default function SocialProof() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sm text-gray-400 font-medium">
            Trusted by modern teams building AI-first companies
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {/* Placeholder logos - in real implementation, these would be actual company logos */}
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 1</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 2</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 3</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 4</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 5</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded-lg">
              <span className="text-gray-400">Logo 6</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}