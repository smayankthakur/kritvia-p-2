<<<<<<< HEAD
import { motion } from "framer-motion";

export default function UseCases() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Use Cases: Who Benefits from Kritvia
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Sales Teams
            </h3>
            <p className="text-gray-600">
              Close more deals with AI-powered lead scoring, automated follow-ups,
              and real-time sales analytics.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Marketing Agencies
            </h3>
            <p className="text-gray-600">
              Manage multiple client campaigns with AI-driven optimization and
              unified reporting.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              E-commerce Stores
            </h3>
            <p className="text-gray-600">
              Automate inventory, customer service, and marketing to scale your
              online business efficiently.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              SaaS Companies
            </h3>
            <p className="text-gray-600">
              Streamline customer onboarding, support, and product updates with
              integrated AI agents.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Consulting Firms
            </h3>
            <p className="text-gray-600">
              Deliver better client insights with automated data analysis and
              AI-powered recommendations.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Non-profits
            </h3>
            <p className="text-gray-600">
              Maximize impact with donor management, volunteer coordination, and
              AI-driven outreach.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
=======
"use client";

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
>>>>>>> 8c88b573be037840ce560e58b824b8cff510d717
  );
}