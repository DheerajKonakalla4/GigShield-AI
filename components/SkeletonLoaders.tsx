"use client";

/**
 * Loading Skeleton Components
 * File: components/SkeletonLoaders.tsx
 *
 * Animated loading skeletons for better UX
 */

import React from "react";
import { motion } from "framer-motion";

const shimmerVariants = {
  shimmer: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const SkeletonLine: React.FC<{ width?: string; height?: string }> = ({
  width = "w-full",
  height = "h-4",
}) => (
  <motion.div
    variants={shimmerVariants}
    animate="shimmer"
    className={`${width} ${height} rounded bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 bg-[length:200%_100%]`}
  />
);

export const SkeletonCard: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 space-y-4"
  >
    <SkeletonLine width="w-1/2" height="h-6" />
    <div className="space-y-3">
      <SkeletonLine height="h-4" />
      <SkeletonLine height="h-4" />
      <SkeletonLine width="w-3/4" height="h-4" />
    </div>
  </motion.div>
);

export const SkeletonClaimCard: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="border-l-4 border-slate-300 dark:border-slate-600 rounded-lg p-5 bg-slate-50 dark:bg-slate-800 space-y-4"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <SkeletonLine width="w-1/3" height="h-5" />
        <SkeletonLine width="w-2/3" height="h-4" />
      </div>
      <SkeletonLine width="w-20" height="h-8" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <SkeletonLine width="w-20" height="h-3" />
          <SkeletonLine width="w-24" height="h-5" />
        </div>
      ))}
    </div>

    <SkeletonLine height="h-10" />
  </motion.div>
);

export const SkeletonStatistic: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 p-6 rounded-lg space-y-3"
  >
    <SkeletonLine width="w-1/2" height="h-4" />
    <SkeletonLine width="w-2/3" height="h-8" />
  </motion.div>
);

export const ClaimSkeletonLoader: React.FC = () => (
  <div className="space-y-6">
    {/* Statistics */}
    <div>
      <SkeletonLine width="w-32" height="h-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonStatistic key={i} />
        ))}
      </div>
    </div>

    {/* Filters */}
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 flex gap-4">
      <SkeletonLine width="w-40" height="h-10" />
      <SkeletonLine width="w-40" height="h-10" />
      <SkeletonLine width="w-28" height="h-10" />
    </div>

    {/* Claims List */}
    <div>
      <SkeletonLine width="w-32" height="h-6" />
      <div className="space-y-4 mt-4">
        {[1, 2, 3].map((i) => (
          <SkeletonClaimCard key={i} />
        ))}
      </div>
    </div>
  </div>
);
