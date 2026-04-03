/**
 * Claims Engine - Insurance Claims Processing System
 * File: backend/engines/claims-engine.ts
 *
 * Features:
 * - Automatic claim creation on trigger events
 * - Payout calculation based on coverage and disruption
 * - Claim lifecycle management
 * - User claim history tracking
 * - Status transitions
 */

import { Trigger } from "./trigger-engine";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ClaimStatus = "CREATED" | "PROCESSING" | "APPROVED" | "PAID" | "REJECTED" | "CANCELLED";

export type ClaimReason = 
  | "RAIN_DISRUPTION"
  | "HEAT_DISRUPTION"
  | "AQI_DISRUPTION"
  | "FLOOD_DISRUPTION"
  | "CURFEW_DISRUPTION"
  | "EXTREME_WEATHER_DISRUPTION"
  | "MANUAL_CLAIM";

export interface EventSummary {
  triggerId: string;
  triggerType: string;
  zone: string;
  timestamp: Date;
  affectedUsers: number;
  claimsGenerated: number;
  totalPayout: number;
  autoApproved: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  policyNumber: string;
  coverage: number; // Coverage amount in ₹
  activeSince: Date;
  dailyIncome?: number; // ₹ per day
  workingHours?: number; // hours per day
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
}

export interface Claim {
  id: string;
  userId: string;
  user?: User;
  triggerId?: string;
  triggerType?: string; // RAIN_ALERT, HEAT_ALERT, AQI_ALERT
  status: ClaimStatus;
  reason: ClaimReason;
  zone: string;
  
  // Claim amounts
  coverageAmount: number;
  disruptionDuration: number; // in hours
  riskLevel: string; // LOW, MEDIUM, HIGH, CRITICAL
  
  // Payout calculation
  disruptionFactor: number; // 0-1, based on duration
  riskMultiplier: number; // 1-2, based on risk level
  payoutAmount: number; // Final calculated payout
  dailyIncome?: number; // ₹ per day
  lostHours?: number; // lost working hours
  
  // Auto-processing
  isAutoProcessed?: boolean;
  processedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  processingStartedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  
  // Details
  description: string;
  notes?: string;
  rejectionReason?: string;
  fraudFlags?: string[];
  
  // History
  statusHistory: Array<{
    status: ClaimStatus;
    timestamp: Date;
    notes?: string;
  }>;
}

// ============================================================================
// PAYOUT CALCULATION CONSTANTS
// ============================================================================

export const PAYOUT_CONFIGURATION = {
  // Disruption duration factors
  DISRUPTION_FACTORS: {
    SHORT: 0.25, // < 2 hours
    MEDIUM: 0.50, // 2-6 hours
    LONG: 0.75, // 6-12 hours
    EXTENDED: 1.0, // > 12 hours
  },

  // Risk level multipliers
  RISK_MULTIPLIERS: {
    LOW: 0.8,
    MEDIUM: 1.0,
    HIGH: 1.2,
    CRITICAL: 1.5,
  },

  // Maximum payout limits
  PAYOUT_LIMITS: {
    MIN: 100, // ₹100 minimum
    MAX_PERCENTAGE: 0.8, // 80% of coverage as max
  },

  // Processing timeline
  PROCESSING_TIME: {
    AUTO_PROCESS: 3600000, // 1 hour to auto-process
    AUTO_APPROVE: 86400000, // 24 hours to auto-approve
    AUTO_PAY: 172800000, // 48 hours to auto-pay
  },
};

// ============================================================================
// MOCK USER DATABASE
// ============================================================================

export const MOCK_USERS: User[] = [
  {
    id: "user_001",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91-9876543210",
    zone: "north",
    policyNumber: "POL-2024-001",
    coverage: 500,
    activeSince: new Date("2024-01-15"),
    dailyIncome: 800,
    workingHours: 10,
    riskLevel: "HIGH",
  },
  {
    id: "user_002",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91-9876543211",
    zone: "south",
    policyNumber: "POL-2024-002",
    coverage: 750,
    activeSince: new Date("2024-02-20"),
    dailyIncome: 600,
    workingHours: 8,
    riskLevel: "MEDIUM",
  },
  {
    id: "user_003",
    name: "Amit Patel",
    email: "amit@example.com",
    phone: "+91-9876543212",
    zone: "east",
    policyNumber: "POL-2024-003",
    coverage: 600,
    activeSince: new Date("2024-01-10"),
    dailyIncome: 700,
    workingHours: 9,
    riskLevel: "HIGH",
  },
  {
    id: "user_004",
    name: "Sneha Desai",
    email: "sneha@example.com",
    phone: "+91-9876543213",
    zone: "west",
    policyNumber: "POL-2024-004",
    coverage: 800,
    activeSince: new Date("2024-03-05"),
    dailyIncome: 1000,
    workingHours: 10,
    riskLevel: "MEDIUM",
  },
];

// ============================================================================
// CLAIMS ENGINE
// ============================================================================

export class ClaimsEngine {
  private claims = new Map<string, Claim>();
  private claimsByUser = new Map<string, Claim[]>();
  private claimHistory: Claim[] = [];
  private userMap = new Map<string, User>();
  private processedEvents = new Map<string, Set<string>>(); // For fraud detection: triggerId -> userIds
  private eventSummary = new Map<string, EventSummary>(); // Track events for dashboard

  // Simple fraud flag tracking
  private userClaimTimings = new Map<string, number[]>(); // Track claim timestamps per user

  constructor() {
    // Initialize user map
    MOCK_USERS.forEach((user) => {
      this.userMap.set(user.id, user);
    });
  }

  /**
   * Check for fraud indicators before processing claim
   */
  private detectFraud(trigger: any, userId: string): string[] {
    const fraudFlags: string[] = [];
    const user = this.userMap.get(userId);

    if (!user) {
      fraudFlags.push("User not found");
      return fraudFlags;
    }

    // Check 1: Zone mismatch
    if (user.zone.toLowerCase() !== trigger.zone.toLowerCase()) {
      fraudFlags.push("Zone mismatch - user zone does not match event zone");
    }

    // Check 2: Duplicate claim for same trigger
    const duplicateForTrigger = Array.from(this.claims.values()).find(
      (c) => c.triggerId === trigger.id && c.userId === userId
    );
    if (duplicateForTrigger) {
      fraudFlags.push("Duplicate claim detected for same trigger");
    }

    // Check 3: Multiple claims in short time window (e.g., within 10 minutes)
    const now = Date.now();
    const recentWindow = 10 * 60 * 1000; // 10 minutes
    const userRecentClaims = Array.from(this.claims.values()).filter(
      (c) => c.userId === userId && now - c.createdAt.getTime() < recentWindow
    );
    if (userRecentClaims.length > 2) {
      fraudFlags.push("Multiple claims in short time window");
    }

    return fraudFlags;
  }

  /**
   * Calculate payout using lost income formula
   */
  private calculatePayoutFromIncome(
    user: User,
    lostHours: number
  ): number {
    if (!user.dailyIncome || !user.workingHours) {
      // Fallback to default calculation
      return user.coverage * 0.5;
    }

    // payout = (daily_income / working_hours) × lost_hours
    const hourlyRate = user.dailyIncome / user.workingHours;
    const payout = hourlyRate * lostHours;

    // Cap at 80% of coverage
    const maxPayout = user.coverage * 0.8;
    const finalPayout = Math.min(payout, maxPayout);

    // Ensure minimum ₹100
    return Math.max(finalPayout, 100);
  }

  /**
   * Automatically create and approve claim from trigger (ZERO-TOUCH)
   */
  createClaimFromTrigger(trigger: Trigger, userId?: string): Claim {
    // Get random user in zone if userId not provided
    const actualUserId = userId || this.getRandomUserInZone(trigger.zone)?.id || "user_001";
    const user = this.userMap.get(actualUserId);

    if (!user) {
      throw new Error(`User not found: ${actualUserId}`);
    }

    // Detect fraud indicators
    const fraudFlags = this.detectFraud(trigger, actualUserId);

    // Calculate lost hours (2-8 hours for disruption)
    const lostHours = Math.random() * 6 + 2;

    // Convert riskLevel severity to string
    const riskLevelStr = trigger.severity || "MEDIUM";
    
    // Calculate payout using income formula
    const payoutAmount = this.calculatePayoutFromIncome(user, lostHours);

    // Create claim with AUTO-APPROVAL status
    const now = new Date();
    const claim: Claim = {
      id: `claim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId: actualUserId,
      user,
      triggerId: trigger.id,
      triggerType: trigger.type,
      status: "PAID", // Immediately mark as PAID (zero-touch automation)
      reason: this.getTriggerClaimReason(trigger.type),
      zone: trigger.zone,
      coverageAmount: user.coverage,
      disruptionDuration: lostHours,
      riskLevel: riskLevelStr,
      disruptionFactor: 1.0,
      riskMultiplier: 1.0,
      payoutAmount,
      dailyIncome: user.dailyIncome,
      lostHours,
      isAutoProcessed: true,
      processedAt: now,
      createdAt: now,
      processingStartedAt: now,
      approvedAt: now,
      paidAt: now,
      description: `Auto-claim from ${trigger.type}: ${trigger.reason}`,
      fraudFlags: fraudFlags.length > 0 ? fraudFlags : undefined,
      statusHistory: [
        {
          status: "CREATED",
          timestamp: now,
          notes: "Auto-created from trigger",
        },
        {
          status: "PROCESSING",
          timestamp: now,
          notes: "Auto-processed (zero-touch)",
        },
        {
          status: "APPROVED",
          timestamp: now,
          notes: "Auto-approved",
        },
        {
          status: "PAID",
          timestamp: now,
          notes: `Auto-paid: ₹${payoutAmount} (lost ${lostHours}h @ ₹${user.dailyIncome}/day)`,
        },
      ],
    };

    // Store claim
    this.claims.set(claim.id, claim);

    // Track by user
    if (!this.claimsByUser.has(actualUserId)) {
      this.claimsByUser.set(actualUserId, []);
    }
    this.claimsByUser.get(actualUserId)!.push(claim);

    // Add to history
    this.claimHistory.push(claim);

    // Track processed event for fraud prevention
    if (!this.processedEvents.has(trigger.id)) {
      this.processedEvents.set(trigger.id, new Set());
    }
    this.processedEvents.get(trigger.id)!.add(actualUserId);

    // Update event summary
    this.updateEventSummary(trigger, claim, payoutAmount);

    return claim;
  }

  /**
   * Update event summary with claim information
   */
  private updateEventSummary(trigger: Trigger, claim: Claim, payout: number) {
    const summaryKey = trigger.id;
    
    if (!this.eventSummary.has(summaryKey)) {
      this.eventSummary.set(summaryKey, {
        triggerId: trigger.id,
        triggerType: trigger.type,
        zone: trigger.zone,
        timestamp: trigger.activatedAt,
        affectedUsers: 0,
        claimsGenerated: 0,
        totalPayout: 0,
        autoApproved: true,
      });
    }

    const summary = this.eventSummary.get(summaryKey)!;
    summary.claimsGenerated += 1;
    summary.totalPayout += payout;
    summary.affectedUsers = trigger.affectedUsers;
  }

  /**
   * Get event summaries
   */
  getEventSummaries(): EventSummary[] {
    return Array.from(this.eventSummary.values());
  }

  /**
   * Manually create a claim
   */
  createManualClaim(
    userId: string,
    coverageAmount: number,
    disruptionDuration: number,
    riskLevel: string,
    reason: string
  ): Claim {
    const user = this.userMap.get(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const disruptionFactor = this.calculateDisruptionFactor(disruptionDuration);
    const riskMultiplier = PAYOUT_CONFIGURATION.RISK_MULTIPLIERS[
      riskLevel as keyof typeof PAYOUT_CONFIGURATION.RISK_MULTIPLIERS
    ] || 1.0;

    const payoutAmount = this.calculatePayout(
      coverageAmount,
      disruptionFactor,
      riskMultiplier
    );

    const claim: Claim = {
      id: `claim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      user,
      status: "CREATED",
      reason: "MANUAL_CLAIM",
      zone: user.zone,
      coverageAmount,
      disruptionDuration,
      riskLevel,
      disruptionFactor,
      riskMultiplier,
      payoutAmount,
      createdAt: new Date(),
      description: reason,
      statusHistory: [
        {
          status: "CREATED",
          timestamp: new Date(),
          notes: "Manual claim created",
        },
      ],
    };

    // Store claim
    this.claims.set(claim.id, claim);

    // Track by user
    if (!this.claimsByUser.has(userId)) {
      this.claimsByUser.set(userId, []);
    }
    this.claimsByUser.get(userId)!.push(claim);

    // Add to history
    this.claimHistory.push(claim);

    return claim;
  }

  /**
   * Calculate disruption factor based on duration
   */
  private calculateDisruptionFactor(durationInHours: number): number {
    if (durationInHours < 2) {
      return PAYOUT_CONFIGURATION.DISRUPTION_FACTORS.SHORT;
    } else if (durationInHours < 6) {
      return PAYOUT_CONFIGURATION.DISRUPTION_FACTORS.MEDIUM;
    } else if (durationInHours < 12) {
      return PAYOUT_CONFIGURATION.DISRUPTION_FACTORS.LONG;
    } else {
      return PAYOUT_CONFIGURATION.DISRUPTION_FACTORS.EXTENDED;
    }
  }

  /**
   * Calculate final payout amount
   */
  private calculatePayout(
    coverageAmount: number,
    disruptionFactor: number,
    riskMultiplier: number
  ): number {
    // payout = coverage * disruption_factor * risk_multiplier
    let payout = coverageAmount * disruptionFactor * riskMultiplier;

    // Apply maximum limit (80% of coverage)
    const maxPayout =
      coverageAmount * PAYOUT_CONFIGURATION.PAYOUT_LIMITS.MAX_PERCENTAGE;
    payout = Math.min(payout, maxPayout);

    // Apply minimum limit
    payout = Math.max(payout, PAYOUT_CONFIGURATION.PAYOUT_LIMITS.MIN);

    // Round to 2 decimals
    return Math.round(payout * 100) / 100;
  }

  /**
   * Get claim reason from trigger type
   */
  private getTriggerClaimReason(triggerType: string): ClaimReason {
    const reasonMap: { [key: string]: ClaimReason } = {
      RAIN_ALERT: "RAIN_DISRUPTION",
      HEAT_ALERT: "HEAT_DISRUPTION",
      AQI_ALERT: "AQI_DISRUPTION",
      FLOOD_ALERT: "FLOOD_DISRUPTION",
      CURFEW_ALERT: "CURFEW_DISRUPTION",
      EXTREME_WEATHER: "EXTREME_WEATHER_DISRUPTION",
    };
    return reasonMap[triggerType] || "MANUAL_CLAIM";
  }

  /**
   * Update claim status
   */
  updateClaimStatus(
    claimId: string,
    newStatus: ClaimStatus,
    notes?: string
  ): Claim | null {
    const claim = this.claims.get(claimId);
    if (!claim) return null;

    const oldStatus = claim.status;
    claim.status = newStatus;

    // Update timestamps
    if (newStatus === "PROCESSING" && !claim.processingStartedAt) {
      claim.processingStartedAt = new Date();
    }
    if (newStatus === "APPROVED" && !claim.approvedAt) {
      claim.approvedAt = new Date();
    }
    if (newStatus === "PAID" && !claim.paidAt) {
      claim.paidAt = new Date();
    }

    // Add to history
    claim.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      notes: notes || `Status changed from ${oldStatus} to ${newStatus}`,
    });

    return claim;
  }

  /**
   * Auto-process claims (simulate automatic processing)
   */
  autoProcessClaims(): { processed: number; approved: number; paid: number } {
    let processed = 0;
    let approved = 0;
    let paid = 0;

    const now = Date.now();

    this.claims.forEach((claim) => {
      // Auto-process: CREATED → PROCESSING after 1 hour
      if (
        claim.status === "CREATED" &&
        now - claim.createdAt.getTime() > PAYOUT_CONFIGURATION.PROCESSING_TIME.AUTO_PROCESS
      ) {
        this.updateClaimStatus(claim.id, "PROCESSING", "Auto-processed");
        processed++;
      }

      // Auto-approve: PROCESSING → APPROVED after 24 hours
      if (
        claim.status === "PROCESSING" &&
        claim.processingStartedAt &&
        now - claim.processingStartedAt.getTime() > PAYOUT_CONFIGURATION.PROCESSING_TIME.AUTO_APPROVE
      ) {
        this.updateClaimStatus(claim.id, "APPROVED", "Auto-approved");
        approved++;
      }

      // Auto-pay: APPROVED → PAID after 48 hours
      if (
        claim.status === "APPROVED" &&
        claim.approvedAt &&
        now - claim.approvedAt.getTime() > PAYOUT_CONFIGURATION.PROCESSING_TIME.AUTO_PAY
      ) {
        this.updateClaimStatus(claim.id, "PAID", "Auto-paid");
        paid++;
      }
    });

    return { processed, approved, paid };
  }

  /**
   * Approve a claim
   */
  approveClaim(claimId: string, notes?: string): Claim | null {
    const claim = this.claims.get(claimId);
    if (!claim) return null;

    if (claim.status !== "PROCESSING") {
      throw new Error(`Cannot approve claim with status: ${claim.status}`);
    }

    return this.updateClaimStatus(claimId, "APPROVED", notes || "Claim approved");
  }

  /**
   * Pay a claim
   */
  payClaim(claimId: string, notes?: string): Claim | null {
    const claim = this.claims.get(claimId);
    if (!claim) return null;

    if (claim.status !== "APPROVED") {
      throw new Error(`Cannot pay claim with status: ${claim.status}`);
    }

    return this.updateClaimStatus(claimId, "PAID", notes || "Claim paid");
  }

  /**
   * Reject a claim
   */
  rejectClaim(claimId: string, reason: string): Claim | null {
    const claim = this.claims.get(claimId);
    if (!claim) return null;

    if (claim.status === "PAID") {
      throw new Error("Cannot reject a claim that has already been paid");
    }

    claim.rejectionReason = reason;
    return this.updateClaimStatus(claimId, "REJECTED", reason);
  }

  /**
   * Get all claims
   */
  getAllClaims(): Claim[] {
    return Array.from(this.claims.values());
  }

  /**
   * Get claim by ID
   */
  getClaimById(claimId: string): Claim | null {
    return this.claims.get(claimId) || null;
  }

  /**
   * Get claims by user
   */
  getUserClaims(userId: string): Claim[] {
    return this.claimsByUser.get(userId) || [];
  }

  /**
   * Get claims by status
   */
  getClaimsByStatus(status: ClaimStatus): Claim[] {
    return Array.from(this.claims.values()).filter((c) => c.status === status);
  }

  /**
   * Get claims by zone
   */
  getClaimsByZone(zone: string): Claim[] {
    return Array.from(this.claims.values()).filter((c) => c.zone === zone);
  }

  /**
   * Get claim history
   */
  getClaimHistory(): Claim[] {
    return this.claimHistory;
  }

  /**
   * Get claim statistics
   */
  getStatistics() {
    const allClaims = Array.from(this.claims.values());

    const stats = {
      total: allClaims.length,
      byStatus: {} as { [key: string]: number },
      byZone: {} as { [key: string]: number },
      byReason: {} as { [key: string]: number },
      totalPayout: 0,
      averagePayout: 0,
      pendingCount: 0,
      approvedCount: 0,
      paidCount: 0,
      autoProcessedCount: 0,
      fraudFlaggedCount: 0,
    };

    allClaims.forEach((claim) => {
      // By status
      stats.byStatus[claim.status] = (stats.byStatus[claim.status] || 0) + 1;

      // By zone
      stats.byZone[claim.zone] = (stats.byZone[claim.zone] || 0) + 1;

      // By reason
      stats.byReason[claim.reason] = (stats.byReason[claim.reason] || 0) + 1;

      // Totals
      stats.totalPayout += claim.payoutAmount;

      // Count by status
      if (claim.status === "CREATED" || claim.status === "PROCESSING") {
        stats.pendingCount++;
      }
      if (claim.status === "APPROVED") {
        stats.approvedCount++;
      }
      if (claim.status === "PAID") {
        stats.paidCount++;
      }

      // Count auto-processed
      if (claim.isAutoProcessed) {
        stats.autoProcessedCount++;
      }

      // Count fraud flagged
      if (claim.fraudFlags && claim.fraudFlags.length > 0) {
        stats.fraudFlaggedCount++;
      }
    });

    stats.averagePayout =
      allClaims.length > 0 ? stats.totalPayout / allClaims.length : 0;

    return stats;
  }

  /**
   * Get fraud flagged claims
   */
  getFraudFlaggedClaims(): Claim[] {
    return Array.from(this.claims.values()).filter(
      (c) => c.fraudFlags && c.fraudFlags.length > 0
    );
  }

  /**
   * Get random user in zone (for simulation)
   */
  private getRandomUserInZone(zone: string): User | undefined {
    const zoneUsers = MOCK_USERS.filter((u) => u.zone === zone);
    return zoneUsers[Math.floor(Math.random() * zoneUsers.length)];
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): User | undefined {
    return this.userMap.get(userId);
  }

  /**
   * Add a manual claim to the engine (for claims submitted via form)
   */
  addManualClaim(claim: Claim): Claim {
    // Store claim
    this.claims.set(claim.id, claim);

    // Track by user
    if (!this.claimsByUser.has(claim.userId)) {
      this.claimsByUser.set(claim.userId, []);
    }
    this.claimsByUser.get(claim.userId)!.push(claim);

    // Add to history
    this.claimHistory.push(claim);

    return claim;
  }

  /**
   * Get all users
   */
  getAllUsers(): User[] {
    return MOCK_USERS;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let claimsEngine: ClaimsEngine | null = null;

export function initializeClaimsEngine(): ClaimsEngine {
  if (!claimsEngine) {
    claimsEngine = new ClaimsEngine();
  }
  return claimsEngine;
}

export function getClaimsEngine(): ClaimsEngine {
  if (!claimsEngine) {
    return initializeClaimsEngine();
  }
  return claimsEngine;
}
