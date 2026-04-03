"use client";

import React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 px-3 py-1 text-sm gap-1.5",
  {
    variants: {
      variant: {
        active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        inactive:
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        warning:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        success:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        purple:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        secondary:
          "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
      pulse: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "active",
      size: "md",
      pulse: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, pulse, icon, dot, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(badgeVariants({ variant, size, pulse }), className)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {dot && (
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              variant === "active" && "bg-emerald-500",
              variant === "inactive" && "bg-gray-400",
              variant === "pending" && "bg-amber-500",
              variant === "danger" && "bg-red-500",
              variant === "warning" && "bg-orange-500",
              variant === "success" && "bg-emerald-500",
              variant === "info" && "bg-blue-500",
              variant === "purple" && "bg-purple-500"
            )}
          />
        )}
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
      </motion.div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
