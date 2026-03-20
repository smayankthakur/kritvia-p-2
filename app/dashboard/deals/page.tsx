"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: "new" | "contacted" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  lead_id?: string;
  contact_name?: string;
  contact_email?: string;
  probability?: number;
  expected_close?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const stages = [
  { id: "new", label: "New", color: "bg-blue-500" },
  { id: "contacted", label: "Contacted", color: "bg-yellow-500" },
  { id: "proposal", label: "Proposal", color: "bg-purple-500" },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { id: "closed_won", label: "Closed Won", color: "bg-green-500" },
  { id: "closed_lost", label: "Closed Lost", color: "bg-red-500" },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    value: 0,
    stage: "new" as Deal["stage"],
    contact_name: "",
    contact_email: "",
    probability: 50,
    expected_close: "",
    notes: "",
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dealData = {
        ...formData,
        value: Number(formData.value),
        probability: Number(formData.probability),
      };

      if (editingDeal) {
        const { error } = await supabase
          .from("deals")
          .update({
            ...dealData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingDeal.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("deals").insert([dealData]);

        if (error) throw error;
      }

      await fetchDeals();
      closeModal();
    } catch (error) {
      console.error("Error saving deal:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    try {
      const { error } = await supabase.from("deals").delete().eq("id", id);

      if (error) throw error;
      await fetchDeals();
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stage: Deal["stage"]) => {
    if (!draggedDeal || draggedDeal.stage === stage) {
      setDraggedDeal(null);
      return;
    }

    try {
      const { error } = await supabase
        .from("deals")
        .update({ stage, updated_at: new Date().toISOString() })
        .eq("id", draggedDeal.id);

      if (error) throw error;
      await fetchDeals();
    } catch (error) {
      console.error("Error moving deal:", error);
    } finally {
      setDraggedDeal(null);
    }
  };

  const openModal = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        contact_name: deal.contact_name || "",
        contact_email: deal.contact_email || "",
        probability: deal.probability || 50,
        expected_close: deal.expected_close || "",
        notes: deal.notes || "",
      });
    } else {
      setEditingDeal(null);
      setFormData({
        title: "",
        value: 0,
        stage: "new",
        contact_name: "",
        contact_email: "",
        probability: 50,
        expected_close: "",
        notes: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDeal(null);
  };

  const getDealsByStage = (stage: string) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getStageTotal = (stage: string) => {
    return deals
      .filter((deal) => deal.stage === stage)
      .reduce((sum, deal) => sum + deal.value, 0);
  };

  const getTotalValue = () => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const getWeightedValue = () => {
    return deals.reduce(
      (sum, deal) => sum + (deal.value * (deal.probability || 0)) / 100,
      0
    );
  };

  return (
    <div className="max-w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deals Pipeline</h1>
            <p className="text-gray-500 mt-2">Track and manage your sales pipeline</p>
          </div>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            + Add Deal
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Pipeline Value</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{getTotalValue().toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Weighted Value</p>
          <p className="text-2xl font-bold text-purple-600">
            ₹{getWeightedValue().toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Deals</p>
          <p className="text-2xl font-bold text-indigo-600">{deals.length}</p>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto pb-4"
      >
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            return (
              <div
                key={stage.id}
                className="w-72 shrink-0"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id as Deal["stage"])}
              >
                {/* Stage Header */}
                <div className="bg-gray-100 rounded-t-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="font-medium text-gray-900">{stage.label}</span>
                    <span className="text-xs text-gray-500">({stageDeals.length})</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    ₹{getStageTotal(stage.id).toLocaleString()}
                  </span>
                </div>

                {/* Deals List */}
                <div className="bg-gray-50 rounded-b-lg p-2 min-h-[400px]">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                  ) : stageDeals.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      No deals
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stageDeals.map((deal) => (
                        <motion.div
                          key={deal.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          draggable
                          onDragStart={() => handleDragStart(deal)}
                          className="bg-white rounded-lg border border-gray-200 p-3 cursor-move hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {deal.title}
                            </h4>
                            <button
                              onClick={() => openModal(deal)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ⋯
                            </button>
                          </div>
                          <p className="text-lg font-bold text-gray-900 mb-2">
                            ₹{deal.value.toLocaleString()}
                          </p>
                          {deal.contact_name && (
                            <p className="text-xs text-gray-500 mb-1">
                              👤 {deal.contact_name}
                            </p>
                          )}
                          {deal.expected_close && (
                            <p className="text-xs text-gray-500">
                              📅 {new Date(deal.expected_close).toLocaleDateString()}
                            </p>
                          )}
                          {deal.probability && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Probability</span>
                                <span className="font-medium">{deal.probability}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-indigo-500 h-1.5 rounded-full"
                                  style={{ width: `${deal.probability}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingDeal ? "Edit Deal" : "Add New Deal"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stage: e.target.value as Deal["stage"],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) =>
                        setFormData({ ...formData, contact_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) =>
                        setFormData({ ...formData, contact_email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Probability (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          probability: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Close
                    </label>
                    <input
                      type="date"
                      value={formData.expected_close}
                      onChange={(e) =>
                        setFormData({ ...formData, expected_close: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  {editingDeal && (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingDeal.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    {editingDeal ? "Save Changes" : "Add Deal"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
