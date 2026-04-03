/**
 * Claims Engine Utility Functions
 * File: backend/engines/claims-utils.ts
 *
 * Helper functions for claims processing and formatting
 */

import { Claim, ClaimStatus, PAYOUT_CONFIGURATION } from "./claims-engine";

/**
 * Format claim for API response
 */
export function formatClaimResponse(claim: Claim) {
  return {
    id: claim.id,
    userId: claim.userId,
    userName: claim.user?.name,
    userEmail: claim.user?.email,
    policyNumber: claim.user?.policyNumber,
    triggerId: claim.triggerId,
    status: claim.status,
    reason: claim.reason,
    zone: claim.zone,
    coverageAmount: claim.coverageAmount,
    disruptionDuration: claim.disruptionDuration,
    riskLevel: claim.riskLevel,
    disruptionFactor: claim.disruptionFactor,
    riskMultiplier: claim.riskMultiplier,
    payoutAmount: claim.payoutAmount,
    description: claim.description,
    rejectionReason: claim.rejectionReason,
    createdAt: claim.createdAt.toISOString(),
    processingStartedAt: claim.processingStartedAt?.toISOString(),
    approvedAt: claim.approvedAt?.toISOString(),
    paidAt: claim.paidAt?.toISOString(),
  };
}

/**
 * Get claim age in minutes
 */
export function getClaimAgeInMinutes(createdAt: Date): number {
  return Math.floor((Date.now() - createdAt.getTime()) / 60000);
}

/**
 * Get status badge color
 */
export function getStatusColor(status: ClaimStatus): string {
  const colors: { [key in ClaimStatus]: string } = {
    CREATED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    PROCESSING: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    CANCELLED: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
  };
  return colors[status];
}

/**
 * Get status emoji
 */
export function getStatusEmoji(status: ClaimStatus): string {
  const emojis: { [key in ClaimStatus]: string } = {
    CREATED: "📝",
    PROCESSING: "⏳",
    APPROVED: "✅",
    PAID: "💰",
    REJECTED: "❌",
    CANCELLED: "🚫",
  };
  return emojis[status];
}

/**
 * Get reason emoji
 */
export function getReasonEmoji(reason: string): string {
  const emojis: { [key: string]: string } = {
    RAIN_DISRUPTION: "🌧️",
    HEAT_DISRUPTION: "🔥",
    AQI_DISRUPTION: "💨",
    FLOOD_DISRUPTION: "🌊",
    CURFEW_DISRUPTION: "🚨",
    EXTREME_WEATHER_DISRUPTION: "⛈️",
    MANUAL_CLAIM: "📋",
  };
  return emojis[reason] || "📋";
}

/**
 * Format claim reason for display
 */
export function formatClaimReason(reason: string): string {
  return reason
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Calculate days until auto-approval
 */
export function getDaysUntilAutoApproval(claim: Claim): number {
  if (claim.status !== "PROCESSING" || !claim.processingStartedAt) {
    return -1;
  }

  const autoApproveTime = claim.processingStartedAt.getTime() +
    PAYOUT_CONFIGURATION.PROCESSING_TIME.AUTO_APPROVE;
  const daysRemaining = Math.ceil((autoApproveTime - Date.now()) / (1000 * 60 * 60 * 24));

  return Math.max(0, daysRemaining);
}

/**
 * Get status transition options
 */
export function getNextStatusOptions(currentStatus: ClaimStatus): ClaimStatus[] {
  const transitions: { [key in ClaimStatus]: ClaimStatus[] } = {
    CREATED: ["PROCESSING", "REJECTED"],
    PROCESSING: ["APPROVED", "REJECTED"],
    APPROVED: ["PAID", "REJECTED"],
    PAID: [],
    REJECTED: [],
    CANCELLED: [],
  };
  return transitions[currentStatus] || [];
}

/**
 * Calculate total payout for multiple claims
 */
export function calculateTotalPayout(claims: Claim[]): number {
  return claims.reduce((sum, claim) => sum + claim.payoutAmount, 0);
}

/**
 * Group claims by zone
 */
export function groupClaimsByZone(claims: Claim[]): { [zone: string]: Claim[] } {
  const grouped: { [zone: string]: Claim[] } = {};
  claims.forEach((claim) => {
    if (!grouped[claim.zone]) {
      grouped[claim.zone] = [];
    }
    grouped[claim.zone].push(claim);
  });
  return grouped;
}

/**
 * Group claims by status
 */
export function groupClaimsByStatus(claims: Claim[]): { [status: string]: Claim[] } {
  const grouped: { [status: string]: Claim[] } = {};
  claims.forEach((claim) => {
    if (!grouped[claim.status]) {
      grouped[claim.status] = [];
    }
    grouped[claim.status].push(claim);
  });
  return grouped;
}

/**
 * Group claims by reason
 */
export function groupClaimsByReason(claims: Claim[]): { [reason: string]: Claim[] } {
  const grouped: { [reason: string]: Claim[] } = {};
  claims.forEach((claim) => {
    if (!grouped[claim.reason]) {
      grouped[claim.reason] = [];
    }
    grouped[claim.reason].push(claim);
  });
  return grouped;
}

/**
 * Sort claims by priority (status → payout → age)
 */
export function sortClaimsByPriority(claims: Claim[]): Claim[] {
  const statusPriority: { [key in ClaimStatus]: number } = {
    CREATED: 1,
    PROCESSING: 2,
    APPROVED: 3,
    REJECTED: 4,
    CANCELLED: 5,
    PAID: 6,
  };

  return [...claims].sort((a, b) => {
    // First by status priority
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;

    // Then by payout amount (higher first)
    const payoutDiff = b.payoutAmount - a.payoutAmount;
    if (payoutDiff !== 0) return payoutDiff;

    // Then by creation date (newer first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

/**
 * Get claims needing immediate attention
 */
export function getClaimsNeedingAttention(claims: Claim[]): Claim[] {
  return claims.filter((claim) => {
    // Claims in CREATED or PROCESSING status older than 12 hours
    if (claim.status === "CREATED" || claim.status === "PROCESSING") {
      const ageInHours = getClaimAgeInMinutes(claim.createdAt) / 60;
      return ageInHours > 12;
    }
    return false;
  });
}

/**
 * Generate claim summary for user
 */
export function generateClaimSummary(claim: Claim): string {
  return `Claim #${claim.id.slice(-6).toUpperCase()} - ₹${claim.payoutAmount} ${claim.status} - ${formatClaimReason(claim.reason)} in ${claim.zone.toUpperCase()} zone`;
}

/**
 * Calculate average processing time
 */
export function calculateAverageProcessingTime(claims: Claim[]): number {
  const paidClaims = claims.filter((c) => c.status === "PAID");
  if (paidClaims.length === 0) return 0;

  const totalTime = paidClaims.reduce((sum, claim) => {
    if (claim.paidAt) {
      return sum + (claim.paidAt.getTime() - claim.createdAt.getTime());
    }
    return sum;
  }, 0);

  return Math.round((totalTime / paidClaims.length) / (1000 * 60)); // Return in minutes
}

/**
 * Get payout efficiency (% of claims paid vs total)
 */
export function getPayoutEfficiency(claims: Claim[]): number {
  if (claims.length === 0) return 0;
  const paidCount = claims.filter((c) => c.status === "PAID").length;
  return Math.round((paidCount / claims.length) * 100);
}

/**
 * Generate claim alert message
 */
export function generateClaimAlertMessage(claim: Claim): string {
  const messages: { [key: string]: string } = {
    CREATED: `Your claim for ₹${claim.payoutAmount} has been created and is awaiting processing.`,
    PROCESSING: `Your claim is being processed. Expected approval within 24 hours.`,
    APPROVED: `Great news! Your claim of ₹${claim.payoutAmount} has been approved. Payment coming soon.`,
    PAID: `Your claim of ₹${claim.payoutAmount} has been paid to your account.`,
    REJECTED: `Your claim could not be approved: ${claim.rejectionReason || "Ineligible"}`,
    CANCELLED: "Your claim has been cancelled.",
  };
  return messages[claim.status] || "Claim status updated.";
}

/**
 * Export claims to CSV format
 */
export function exportClaimsToCSV(claims: Claim[]): string {
  const headers = [
    "Claim ID",
    "User Name",
    "Zone",
    "Status",
    "Reason",
    "Coverage",
    "Duration (hrs)",
    "Risk Level",
    "Payout",
    "Created At",
    "Approved At",
    "Paid At",
  ];

  const rows = claims.map((claim) => [
    claim.id,
    claim.user?.name || "Unknown",
    claim.zone,
    claim.status,
    claim.reason,
    `₹${claim.coverageAmount}`,
    claim.disruptionDuration.toFixed(2),
    claim.riskLevel,
    `₹${claim.payoutAmount}`,
    claim.createdAt.toISOString(),
    claim.approvedAt?.toISOString() || "—",
    claim.paidAt?.toISOString() || "—",
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csv;
}

/**
 * Validate claim for approval
 */
export function validateClaimForApproval(claim: Claim): {
  isValid: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (claim.status !== "PROCESSING") {
    reasons.push("Claim must be in PROCESSING status");
  }

  if (claim.disruptionDuration < 0.5) {
    reasons.push("Disruption duration too short");
  }

  if (claim.payoutAmount < PAYOUT_CONFIGURATION.PAYOUT_LIMITS.MIN) {
    reasons.push("Payout below minimum threshold");
  }

  return {
    isValid: reasons.length === 0,
    reasons,
  };
}

/**
 * Calculate claim score (0-100) for priority ranking
 */
export function calculateClaimScore(claim: Claim): number {
  let score = 0;

  // Status weight (0-20)
  const statusWeights: { [key in ClaimStatus]: number } = {
    CREATED: 5,
    PROCESSING: 10,
    APPROVED: 15,
    PAID: 0,
    REJECTED: 0,
    CANCELLED: 0,
  };
  score += statusWeights[claim.status];

  // Payout weight (0-30)
  const payoutPercentage = (claim.payoutAmount / claim.coverageAmount) * 30;
  score += Math.min(30, payoutPercentage);

  // Duration weight (0-20)
  const durationWeight = Math.min(20, claim.disruptionDuration * 2);
  score += durationWeight;

  // Risk weight (0-30)
  const riskWeights: { [key: string]: number } = {
    LOW: 10,
    MEDIUM: 20,
    HIGH: 25,
    CRITICAL: 30,
  };
  score += riskWeights[claim.riskLevel] || 10;

  return Math.round(score);
}
