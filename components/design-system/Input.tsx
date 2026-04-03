"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  error?: string;
  hint?: string;
  label?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      icon,
      iconPosition = "left",
      error,
      hint,
      label,
      fullWidth = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className={cn("flex flex-col space-y-2", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <motion.div
          className={cn(
            "relative flex items-center rounded-lg border-2 transition-all duration-200",
            isFocused
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
            error && "border-red-500 dark:border-red-500",
            disabled && "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
          )}
          animate={{
            boxShadow: isFocused
              ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
              : "none",
          }}
        >
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "flex-1 bg-transparent px-4 py-3 text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed text-gray-900 dark:text-white",
              icon && iconPosition === "left" && "pl-10",
              icon && iconPosition === "right" && "pr-10"
            )}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute right-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
              {icon}
            </div>
          )}
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
        {hint && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
