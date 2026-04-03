"use client";

/**
 * Toast Container Component
 * File: components/ToastContainer.tsx
 *
 * Displays toast notifications with animations
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/useToast";

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  const getToastStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-500",
          borderColor: "border-green-600",
          icon: "✅",
        };
      case "error":
        return {
          bgColor: "bg-red-500",
          borderColor: "border-red-600",
          icon: "❌",
        };
      case "warning":
        return {
          bgColor: "bg-amber-500",
          borderColor: "border-amber-600",
          icon: "⚠️",
        };
      default:
        return {
          bgColor: "bg-blue-500",
          borderColor: "border-blue-600",
          icon: "ℹ️",
        };
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 400, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 400, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`mb-3 pointer-events-auto ${styles.bgColor} text-white rounded-lg shadow-lg border-l-4 ${styles.borderColor} px-6 py-4 flex items-center gap-3 min-w-max`}
            >
              <span className="text-xl">{styles.icon}</span>
              <p className="font-medium text-sm">{toast.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
