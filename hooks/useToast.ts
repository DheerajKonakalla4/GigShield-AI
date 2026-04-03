"use client";

/**
 * Toast Notification System
 * File: hooks/useToast.ts
 *
 * Global toast notifications with animations
 */

import { useState, useCallback, useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Global state
let toasts: Toast[] = [];
let listeners: Set<(toasts: Toast[]) => void> = new Set();

const notify = (message: string, type: ToastType = "info", duration = 4000) => {
  const id = `toast_${Date.now()}_${Math.random()}`;
  const toast: Toast = { id, message, type, duration };

  toasts = [...toasts, toast];
  listeners.forEach((listener) => listener([...toasts]));

  if (duration > 0) {
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      listeners.forEach((listener) => listener([...toasts]));
    }, duration);
  }

  return id;
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return {
    toasts,
    showSuccess: (message: string, duration?: number) =>
      notify(message, "success", duration),
    showError: (message: string, duration?: number) =>
      notify(message, "error", duration),
    showInfo: (message: string, duration?: number) =>
      notify(message, "info", duration),
    showWarning: (message: string, duration?: number) =>
      notify(message, "warning", duration),
    show: (message: string, type?: ToastType, duration?: number) =>
      notify(message, type, duration),
  };
};
