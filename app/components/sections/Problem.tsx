import { motion } from "framer-motion";

export default function Problem() {
  return (
    <section className="py-16 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Your Business Runs on 10+ Tools That Don’t Talk
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Silos. Manual work. Missed opportunities.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid gap-8 lg:grid-cols-2"
        >
          {/* Tools */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Disconnected Tools</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="h-3 w-3 bg-white/10 rounded-full"></div>
                <span>CRM</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="h-3 w-3 bg-white/10 rounded-full"></div>
                <span>Email tools</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="h-3 w-3 bg-white/10 rounded-full"></div>
                <span>Marketing tools</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="h-3 w-3 bg-white/10 rounded-full"></div>
                <span>Analytics</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="h-3 w-3 bg-white/10 rounded-full"></div>
                <span>Ops tools</span>
              </div>
            </div>
          </div>
          
          {/* Chaos diagram */}
          <div className="relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22><circle cx=%22100%22 cy=%22100%22 r=%2280%22 stroke=%22%23ffffff%22 stroke-width=%222%22 fill=%22none%22/%3E<path d=%22M30,100 Q100,30 170,100 T30,100%22 stroke=%22%23ffffff%22 stroke-width=%221.5%22 fill=%22none%22/%3E</svg>')] opacity-10"></div>
            <div className="relative h-96">
              {/* Dots representing tools */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-3 w-3 bg-white/50 rounded-full"></div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 h-3 w-3 bg-white/50 rounded-full"></div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 h-3 w-3 bg-white/50 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3 w-3 bg-white/50 rounded-full"></div>
              <div className="absolute -top-4 left-1/4 -translate-x-1/2 h-3 w-3 bg-white/50 rounded-full"></div>
              <div className="absolute -top-4 right-1/4 -translate-x-1/2 h-3 w-3 bg-white/50 rounded-full"></div>
              <div className="absolute bottom-0 left-1/4 -translate-x-1/2 h-3 w-3 bg-white/50 rounded-full"></div>
              <div className="absolute bottom-0 right-1/4 -translate-x-1/2 h-3 w-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}