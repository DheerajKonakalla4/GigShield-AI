"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, Badge } from "@/components/design-system";
import { X } from "lucide-react";

interface User {
  id: string;
  name: string;
  zone: string;
  dailyIncome?: number;
  workingHours?: number;
}

interface ManualClaimFormProps {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (claim: ManualClaimData) => Promise<void>;
  isSubmitting?: boolean;
}

export interface ManualClaimData {
  userId: string;
  eventType: string;
  zone: string;
  dateOfIncident: string;
  lostHours: number;
  description?: string;
}

const eventTypes = ["Rain", "Pollution", "Heatwave", "Other"];

export const ManualClaimForm: React.FC<ManualClaimFormProps> = ({
  users,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<ManualClaimData>({
    userId: "",
    eventType: "",
    zone: "",
    dateOfIncident: "",
    lostHours: 0,
    description: "",
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill zone when user is selected
  useEffect(() => {
    if (formData.userId) {
      const user = users.find((u) => u.id === formData.userId);
      if (user) {
        setSelectedUser(user);
        setFormData((prev) => ({ ...prev, zone: user.zone }));
      }
    }
  }, [formData.userId, users]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId) newErrors.userId = "User is required";
    if (!formData.eventType) newErrors.eventType = "Event type is required";
    if (!formData.dateOfIncident) newErrors.dateOfIncident = "Date is required";
    if (formData.lostHours <= 0 || formData.lostHours > 24) {
      newErrors.lostHours = "Lost hours must be between 0 and 24";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        userId: "",
        eventType: "",
        zone: "",
        dateOfIncident: "",
        lostHours: 0,
        description: "",
      });
      setSelectedUser(null);
      onClose();
    } catch (err) {
      console.error("Error submitting claim:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  📋 Create Manual Claim
                </h2>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Info Banner */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>ℹ️ Note:</strong> Most claims are processed automatically. Use this form only for exceptional cases.
                  </p>
                </div>

                {/* User Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    👤 Select User *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="w-full px-4 py-2 text-left border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      {selectedUser ? selectedUser.name : "Select a user..."}
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {showUserDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                        >
                          {users.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, userId: user.id }));
                                setShowUserDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-colors border-b border-slate-200 dark:border-slate-600 last:border-b-0"
                            >
                              <div className="font-semibold">{user.name}</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">
                                Zone: {user.zone} • Income: ₹{user.dailyIncome}/day
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {errors.userId && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.userId}</p>
                  )}
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    ⚠️ Event Type *
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, eventType: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select event type...</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.eventType}</p>
                  )}
                </div>

                {/* Zone (Auto-filled) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    📍 Zone
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.zone}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white opacity-70 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Auto-filled from user</p>
                </div>

                {/* Date of Incident */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    📅 Date of Incident *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfIncident}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, dateOfIncident: e.target.value }))
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.dateOfIncident && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.dateOfIncident}</p>
                  )}
                </div>

                {/* Lost Working Hours */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    ⏱️ Lost Working Hours *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={formData.lostHours || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lostHours: e.target.value ? parseFloat(e.target.value) : 0,
                      }))
                    }
                    placeholder="e.g., 4, 6.5, 8"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.lostHours && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.lostHours}</p>
                  )}
                  {selectedUser && selectedUser.dailyIncome && formData.lostHours > 0 && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      💰 Estimated payout: ₹
                      {(
                        (selectedUser.dailyIncome / (selectedUser.workingHours || 8)) *
                        formData.lostHours
                      ).toFixed(0)}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    📝 Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe the incident and circumstances..."
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {isSubmitting ? "Submitting..." : "📤 Submit Manual Claim"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
