"use client";

/**
 * Claims Dashboard Component
 * File: components/ClaimsDashboard.tsx
 *
 * Premium UI for managing insurance claims with real-time updates
 * Features:
 * - Real-time claim monitoring
 * - Claim status visualization
 * - Payout calculations
 * - Statistics dashboard
 * - Claim lifecycle management
 * - Auto-processing controls
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAutoRefreshClaims,
  useApproveClaim,
  usePayClaim,
  useRejectClaim,
  useAutoProcessClaims,
  useCreateManualClaim,
  useSubmitManualClaim,
  Claim,
  ClaimStatistics,
  ClaimStatus,
  ManualClaimFormData,
} from "@/hooks/useClaimsEngine";
import { useToast } from "@/hooks/useToast";
import { Button, Badge } from "@/components/design-system";
import { ClaimSkeletonLoader } from "@/components/SkeletonLoaders";
import { ManualClaimForm } from "./ManualClaimForm";
import { MOCK_USERS } from "@/backend/engines/claims-engine";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ClaimConfig {
  CREATED: { icon: string; color: string; bgColor: string; borderColor: string };
  PROCESSING: { icon: string; color: string; bgColor: string; borderColor: string };
  APPROVED: { icon: string; color: string; bgColor: string; borderColor: string };
  PAID: { icon: string; color: string; bgColor: string; borderColor: string };
  REJECTED: { icon: string; color: string; bgColor: string; borderColor: string };
  CANCELLED: { icon: string; color: string; bgColor: string; borderColor: string };
}

const CLAIM_CONFIG: ClaimConfig = {
  CREATED: {
    icon: "📝",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  PROCESSING: {
    icon: "⏳",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  APPROVED: {
    icon: "✅",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
  },
  PAID: {
    icon: "💰",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  REJECTED: {
    icon: "❌",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
  },
  CANCELLED: {
    icon: "🚫",
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    borderColor: "border-slate-200 dark:border-slate-800",
  },
};

const STATUS_BADGES: { [key in ClaimStatus]: string } = {
  CREATED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  PROCESSING: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  CANCELLED: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
};

// ============================================================================
// SUB-COMPONENT: STATISTICS OVERVIEW
// ============================================================================

interface StatisticsOverviewProps {
  statistics: ClaimStatistics | null;
}

const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({ statistics }) => {
  if (!statistics) return null;

  const stats = [
    {
      label: "Total Claims",
      value: statistics.total,
      gradient: "from-blue-500 to-blue-600",
      icon: "📋",
    },
    {
      label: "Pending",
      value: statistics.pendingCount,
      gradient: "from-amber-500 to-amber-600",
      icon: "⏳",
    },
    {
      label: "Approved",
      value: statistics.approvedCount,
      gradient: "from-green-500 to-green-600",
      icon: "✅",
    },
    {
      label: "Paid",
      value: statistics.paidCount,
      gradient: "from-emerald-500 to-emerald-600",
      icon: "💰",
    },
    {
      label: "Total Payout",
      value: `₹${statistics.totalPayout.toFixed(0)}`,
      gradient: "from-purple-500 to-purple-600",
      icon: "💵",
    },
    {
      label: "Avg Payout",
      value: `₹${statistics.averagePayout.toFixed(0)}`,
      gradient: "from-pink-500 to-pink-600",
      icon: "📊",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
              }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-lg text-white shadow-lg cursor-pointer hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.15 }}
                  className="text-3xl"
                >
                  {stat.icon}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: CLAIM CARD
// ============================================================================

interface ClaimCardProps {
  claim: Claim;
  onApprove?: (claimId: string) => Promise<void>;
  onPay?: (claimId: string) => Promise<void>;
  onReject?: (claimId: string) => Promise<void>;
  isApproving?: boolean;
  isPaying?: boolean;
  isRejecting?: boolean;
}

const ClaimCard: React.FC<ClaimCardProps> = ({
  claim,
  onApprove,
  onPay,
  onReject,
  isApproving,
  isPaying,
  isRejecting,
}) => {
  const config = CLAIM_CONFIG[claim.status as keyof typeof CLAIM_CONFIG] || CLAIM_CONFIG.CREATED;
  const statusBadge = STATUS_BADGES[claim.status as ClaimStatus] || STATUS_BADGES.CREATED;

  const createdAt = new Date(claim.createdAt);
  const now = new Date();
  const ageInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000);
  const ageText = ageInMinutes < 60 ? `${ageInMinutes}m ago` : `${Math.floor(ageInMinutes / 60)}h ago`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`border-l-4 rounded-lg p-5 ${config.bgColor} ${config.borderColor} border backdrop-blur hover:shadow-lg transition-shadow`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex gap-3 flex-1">
            <div className="text-3xl">{config.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className={`font-bold text-lg ${config.color}`}>{claim.reason.replace(/_/g, " ")}</h3>
                <Badge className={statusBadge}>{claim.status}</Badge>
                {claim.isAutoProcessed && (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Auto Claim
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">{claim.description}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{claim.userName} • {claim.userEmail}</p>
            </div>
          </div>
        </div>

        {/* Trigger & Income Info */}
        {claim.triggerType && (
          <div className="bg-white dark:bg-slate-800 rounded px-3 py-2 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Trigger Type</p>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{claim.triggerType.replace(/_/g, " ")}</p>
              </div>
              {claim.dailyIncome && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Daily Income</p>
                  <p className="font-semibold text-slate-900 dark:text-white">₹{claim.dailyIncome}</p>
                </div>
              )}
              {claim.lostHours && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Lost Hours</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{claim.lostHours.toFixed(1)}h</p>
                </div>
              )}
              {claim.processedAt && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Processed</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{new Date(claim.processedAt).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-t border-b border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Coverage</p>
            <p className="font-semibold text-slate-900 dark:text-white">₹{claim.coverageAmount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
            <p className="font-semibold text-slate-900 dark:text-white">{claim.disruptionDuration.toFixed(1)}h</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Risk Level</p>
            <p className="font-semibold text-slate-900 dark:text-white">{claim.riskLevel}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Payout</p>
            <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">₹{claim.payoutAmount}</p>
          </div>
        </div>

        {/* Fraud Flags */}
        {claim.fraudFlags && claim.fraudFlags.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/30 rounded px-3 py-2 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-800 dark:text-red-300 font-semibold mb-1">⚠️ Fraud Flags:</p>
            <ul className="text-xs text-red-700 dark:text-red-400 space-y-0.5">
              {claim.fraudFlags.map((flag, idx) => (
                <li key={idx}>• {flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Factors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded px-3 py-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">Disruption Factor</p>
            <p className="font-semibold text-slate-900 dark:text-white">{(claim.disruptionFactor * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded px-3 py-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">Risk Multiplier</p>
            <p className="font-semibold text-slate-900 dark:text-white">×{claim.riskMultiplier.toFixed(2)}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>📍 Zone: {claim.zone.toUpperCase()} • ⏱️ {ageText}</p>
          {claim.rejectionReason && <p className="text-red-600 dark:text-red-400">Rejection: {claim.rejectionReason}</p>}
        </div>

        {/* Actions */}
        {(claim.status === "CREATED" || claim.status === "PROCESSING" || claim.status === "APPROVED") && (
          <div className="flex gap-2 flex-wrap pt-2">
            {claim.status === "PROCESSING" && onApprove && (
              <Button
                size="sm"
                className="flex-1 min-w-fit bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onApprove(claim.id)}
                disabled={isApproving}
              >
                {isApproving ? "Approving..." : "✅ Approve"}
              </Button>
            )}
            {claim.status === "APPROVED" && onPay && (
              <Button
                size="sm"
                className="flex-1 min-w-fit bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onPay(claim.id)}
                disabled={isPaying}
              >
                {isPaying ? "Processing..." : "💰 Pay"}
              </Button>
            )}
            {(claim.status === "CREATED" || claim.status === "PROCESSING") && onReject && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 min-w-fit"
                onClick={() => {
                  const reason = prompt("Enter rejection reason:");
                  if (reason) onReject(claim.id);
                }}
                disabled={isRejecting}
              >
                {isRejecting ? "Rejecting..." : "❌ Reject"}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT: CLAIMS DASHBOARD
// ============================================================================

export const ClaimsDashboard: React.FC = () => {
  const { claims, statistics, loading, refetch } = useAutoRefreshClaims(10000);
  const { approveClaim, loading: isApproving } = useApproveClaim();
  const { payClaim, loading: isPaying } = usePayClaim();
  const { rejectClaim, loading: isRejecting } = useRejectClaim();
  const { autoProcess, loading: isAutoProcessing } = useAutoProcessClaims();
  const { createManualClaim, loading: isCreating } = useCreateManualClaim();
  const { submitClaim, loading: isSubmittingManual, warnings: manualClaimWarnings } = useSubmitManualClaim();
  const { showSuccess, showError, showWarning } = useToast();

  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "ALL">("ALL");
  const [zoneFilter, setZoneFilter] = useState<string>("ALL");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isManualClaimFormOpen, setIsManualClaimFormOpen] = useState(false);

  // Filter claims
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const statusMatch = statusFilter === "ALL" || claim.status === statusFilter;
      const zoneMatch = zoneFilter === "ALL" || claim.zone === zoneFilter;
      return statusMatch && zoneMatch;
    });
  }, [claims, statusFilter, zoneFilter]);

  const handleApprove = async (claimId: string) => {
    await approveClaim(claimId);
  };

  const handlePay = async (claimId: string) => {
    await payClaim(claimId);
    showSuccess("✅ Claim paid successfully!");
  };

  const handleReject = async (claimId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      await rejectClaim(claimId, reason);
      showError("❌ Claim rejected");
    }
  };

  const handleSimulateRain = async () => {
    setIsSimulating(true);
    try {
      const payout = 200 + Math.random() * 300; // Random payout 200-500
      const claim = await createManualClaim(
        "user_001",
        500,
        3 + Math.random() * 8, // 3-11 hours
        ["MEDIUM", "HIGH"][Math.floor(Math.random() * 2)],
        "Rain disruption event simulated"
      );

      if (claim) {
        showSuccess(`💰 ₹${payout.toFixed(0)} payout credited!`, 5000);
      } else {
        showError("Failed to create claim");
      }
    } catch (err) {
      showError("Error creating claim");
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin mb-4">📋</div>
          <p className="text-slate-600 dark:text-slate-400">Loading claims...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">💼 Claims Engine</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage insurance claims and payouts</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => setIsManualClaimFormOpen(true)}
            disabled={false}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
          >
            📝 + Create Manual Claim
          </Button>
          <Button
            onClick={handleSimulateRain}
            disabled={isSimulating}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            {isSimulating ? "Simulating..." : "🌧️ Simulate Rain Event"}
          </Button>
          <Button
            onClick={() => autoProcess()}
            disabled={isAutoProcessing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {isAutoProcessing ? "Processing..." : "⚙️ Auto-Process"}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <StatisticsOverview statistics={statistics} />

      {/* Filters */}
      <div className="flex gap-4 flex-wrap bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
        <div className="flex-1 min-w-fit">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | "ALL")}
            className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Status</option>
            <option value="CREATED">Created</option>
            <option value="PROCESSING">Processing</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div className="flex-1 min-w-fit">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Zone</label>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Zones</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("ALL");
              setZoneFilter("ALL");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Claims List */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
          Claims ({filteredClaims.length})
        </h2>

        {filteredClaims.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-8 text-center border border-green-200 dark:border-green-800"
          >
            <p className="text-2xl mb-2">✅</p>
            <p className="text-lg font-semibold text-green-700 dark:text-green-400">No claims found</p>
            <p className="text-sm text-green-600 dark:text-green-300 mt-1">All claims are processed and up to date</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredClaims.map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  onApprove={handleApprove}
                  onPay={handlePay}
                  onReject={handleReject}
                  isApproving={isApproving}
                  isPaying={isPaying}
                  isRejecting={isRejecting}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Status Breakdown */}
      {statistics && Object.keys(statistics.byStatus).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Status Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(statistics.byStatus).map(([status, count]) => {
              const config = CLAIM_CONFIG[status as keyof typeof CLAIM_CONFIG] || CLAIM_CONFIG.CREATED;
              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 text-center`}
                >
                  <p className="text-2xl mb-2">{config.icon}</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-lg">{count}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{status}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Claim Form Modal */}
      <ManualClaimForm
        users={MOCK_USERS}
        isOpen={isManualClaimFormOpen}
        onClose={() => setIsManualClaimFormOpen(false)}
        onSubmit={async (formData: ManualClaimFormData) => {
          const claim = await submitClaim(formData);
          if (claim) {
            showSuccess(`📋 Manual claim submitted! Status: Pending admin review.`);
            if (manualClaimWarnings && manualClaimWarnings.length > 0) {
              showWarning(
                `⚠️ ${manualClaimWarnings.length} validation warning(s) - Admin will review before approval.`
              );
            }
            setIsManualClaimFormOpen(false);
            refetch();
          } else {
            showError("Failed to submit manual claim");
          }
        }}
        isSubmitting={isSubmittingManual}
      />
    </div>
  );
};

export default ClaimsDashboard;
