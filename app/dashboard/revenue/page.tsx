"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RevenueDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    revenue: {},
    campaigns: [],
    attribution: null,
    agentDecisions: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch revenue by source
      const { data: revenueData } = await supabase
        .from("revenue_events")
        .select("source, revenue, event_type")
        .order("created_at", { ascending: false })
        .limit(100);

      // Fetch campaigns
      const { data: campaigns } = await supabase
        .from("outreach_campaigns")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch agent decisions
      const { data: decisions } = await supabase
        .from("agent_decisions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      // Process revenue data
      const revenueBySource: Record<string, number> = {
        seo: 0,
        ads: 0,
        outbound: 0,
        referral: 0,
        organic: 0,
        direct: 0,
      };

      for (const event of revenueData || []) {
        revenueBySource[event.source] =
          (revenueBySource[event.source] || 0) + (event.revenue || 0);
      }

      setData({
        revenue: revenueBySource,
        campaigns: campaigns || [],
        agentDecisions: decisions || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = Object.values(data.revenue).reduce<number>(
    (a, b) => a + (Number(b) || 0),
    0
  );

  const channelLabels: Record<string, string> = {
    seo: "SEO",
    ads: "Paid Ads",
    outbound: "Outbound",
    referral: "Referral",
    organic: "Organic",
    direct: "Direct",
  };

  const channelColors: Record<string, string> = {
    seo: "bg-green-500",
    ads: "bg-blue-500",
    outbound: "bg-purple-500",
    referral: "bg-yellow-500",
    organic: "bg-indigo-500",
    direct: "bg-gray-500",
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Revenue & AI</h1>
        <p className="text-gray-500 mt-2">
          Autonomous revenue engine and AI agent control center
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["overview", "campaigns", "attribution", "agents"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Active Campaigns</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {data.campaigns.filter((c: any) => c.status === "active").length}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">AI Decisions Today</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {data.agentDecisions.filter((d: any) => {
                      const today = new Date().toDateString();
                      return new Date(d.created_at).toDateString() === today;
                    }).length}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Best Channel</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Object.entries(data.revenue).sort(
                      (a, b) => (b[1] as number) - (a[1] as number)
                    )[0]?.[0] || "N/A"}
                  </p>
                </div>
              </div>

              {/* Revenue by Channel */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Revenue by Channel
                </h3>
                <div className="space-y-4">
                  {Object.entries(data.revenue).map(([channel, revenue]) => (
                    <div key={channel}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          {channelLabels[channel] || channel}
                        </span>
                        <span className="font-medium">
                          ₹{(revenue as number).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            channelColors[channel] || "bg-gray-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              ((revenue as number) / Math.max(1, totalRevenue)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-left">
                  <p className="font-semibold">Run AI Agents</p>
                  <p className="text-sm text-indigo-200 mt-1">
                    Execute autonomous loop
                  </p>
                </button>
                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <p className="font-semibold text-gray-900">Launch Campaign</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Start outbound outreach
                  </p>
                </button>
                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <p className="font-semibold text-gray-900">Generate Ads</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create ad creatives
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Outreach Campaigns</h3>
                </div>
                {data.campaigns.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No campaigns yet
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Leads
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Sent
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Reply Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.campaigns.map((campaign: any) => (
                        <tr key={campaign.id}>
                          <td className="px-4 py-4 font-medium text-gray-900">
                            {campaign.name}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                campaign.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : campaign.status === "draft"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {campaign.leads_count || 0}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {campaign.sent_count || 0}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {campaign.reply_rate || 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {/* Attribution Tab */}
          {activeTab === "attribution" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Channel Attribution
              </h3>
              <p className="text-gray-500 mb-6">
                Track which channels drive the most revenue
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(data.revenue).map(([channel, revenue]) => (
                  <div
                    key={channel}
                    className="p-4 bg-gray-50 rounded-lg text-center"
                  >
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{(revenue as number).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {channelLabels[channel] || channel}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Agents Tab */}
          {activeTab === "agents" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Agent Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["CEO Agent", "Marketing Agent", "SDR Agent", "Ops Agent"].map(
                  (agent) => (
                    <div
                      key={agent}
                      className="bg-white rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-medium text-gray-900">{agent}</span>
                      </div>
                      <p className="text-sm text-gray-500">Active</p>
                    </div>
                  )
                )}
              </div>

              {/* Decision Log */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI Decision Log
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {data.agentDecisions.map((decision: any) => (
                    <div
                      key={decision.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-medium text-indigo-600 uppercase">
                            {decision.agent_type}
                          </span>
                          <p className="text-sm text-gray-900">
                            {decision.decision_type}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(decision.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
