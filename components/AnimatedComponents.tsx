"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <Button
        {...(props as any)}
        className={`transition-all ${className}`}
      >
        {children}
      </Button>
    </motion.div>
  );
};

interface AnimatedStatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: { value: number; direction: "up" | "down" };
  className?: string;
}

export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  icon,
  label,
  value,
  trend,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-lg p-4 backdrop-blur-sm border border-white/10 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm opacity-75">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div className={`text-xs font-semibold ${
              trend.direction === "up" ? "text-green-500" : "text-red-500"
            }`}>
              {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
};

interface PulseDotsProps {
  count?: number;
  color?: string;
}

export const PulseDots: React.FC<PulseDotsProps> = ({ count = 3, color = "bg-blue-500" }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${color}`}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedButton;
