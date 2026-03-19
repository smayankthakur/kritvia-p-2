"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Total Leads", value: "124", change: "+12%" },
  { label: "Active Deals", value: "18", change: "+5%" },
  { label: "Revenue", value: "₹4.2L", change: "+23%" },
  { label: "Conversion", value: "24%", change: "+3%" },
];

export default function Overview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-green-600 mt-2">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { text: "New lead added: John Doe", time: "2 min ago" },
            { text: "Deal moved to 'Negotiation'", time: "15 min ago" },
            { text: "AI insight generated", time: "1 hour ago" },
          ].map((activity, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <p className="text-gray-600">{activity.text}</p>
              <p className="text-sm text-gray-400">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
