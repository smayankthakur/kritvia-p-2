import { motion } from "framer-motion";
import { Tabs } from "../ui/Tabs";
import { TabsList } from "../ui/Tabs";
import { TabsTrigger } from "../ui/Tabs";
import { TabsContent } from "../ui/Tabs";

export default function UseCases() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Use Cases
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See how different teams use Kritvia to run their business on AI.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-8"
        >
          <Tabs defaultValue="founders" className="w-full">
            <TabsList className="grid w-full grid-cols-1 bg-black/50 rounded-xl p-1">
              <TabsTrigger value="founders" className="hover:bg-black/40 transition-colors">
                Founders
              </TabsTrigger>
              <TabsTrigger value="sales" className="hover:bg-black/40 transition-colors">
                Sales Teams
              </TabsTrigger>
              <TabsTrigger value="marketing" className="hover:bg-black/40 transition-colors">
                Marketing Teams
              </TabsTrigger>
              <TabsTrigger value="operations" className="hover:bg-black/40 transition-colors">
                Operations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="founders" className="mt-4 text-gray-300">
              <h3 className="font-semibold text-white mb-4">For Founders</h3>
              <p className="mb-4">
                Get a real-time view of your entire business health. Kritvia's AI predicts cash flow, 
                identifies growth opportunities, and alerts you to risks before they become problems.
              </p>
              <div className="space-y-3">
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Daily AI-generated business health report</span>
                </p>
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">AI-powered fundraising preparation and investor updates</span>
                </p>
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Scenario planning for product launches and market expansion</span>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="mt-4 text-gray-300">
              <h3 className="font-semibold text-white mb-4">For Sales Teams</h3>
              <p className="mb-4">
                Kritvia automates lead scoring, follow-ups, and pipeline management. Your reps spend 
                less time on admin and more time closing deals.
              </p>
              <div className="space-y-3">
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Automatic lead enrichment and scoring</span>
                </p>
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Personalized outreach sequences based on lead behavior</span>
                </p>
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Real-time deal forecasting and risk alerts</span>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="marketing" className="mt-4 text-gray-300">
              <h3 className="font-semibold text-white mb-4">For Marketing Teams</h3>
              <p className="mb-4">
                From campaign creation to optimization and reporting, Kritvia handles the full marketing 
                lifecycle with AI that learns what works best for your audience.
              </p>
              <div className="space-y-3">
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">AI-generated ad copy and creative variations</span>
                </p>
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Automatic budget allocation based on ROAS predictions</span>
                </p>
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Real-time performance dashboards with actionable insights</span>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="operations" className="mt-4 text-gray-300">
              <h3 className="font-semibold text-white mb-4">For Operations</h3>
              <p className="mb-4">
                Streamline your internal processes with AI that automates routine tasks, manages 
                resources, and ensures nothing falls through the cracks.
              </p>
              <div className="space-y-3">
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Automated task creation and assignment based on triggers</span>
                </p>
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Resource allocation and capacity planning</span>
                </p>
                <p className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-2.5 w-2.5 bg-violet-500 rounded-full mt-0.5"></div>
                  <span className="text-sm">Automated reporting and compliance tracking</span>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}