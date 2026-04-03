/**
 * Business Logic Controllers
 * Orchestrates services to implement complete workflows
 */

import {
  RiskEngineService,
  PremiumEngineService,
  TriggerEngineService,
  ClaimsEngineService,
  FraudDetectionService,
  PaymentSimulatorService,
} from "../services";

import {
  Policy,
  PolicyInput,
  PremiumCalculation,
  Claim,
  ClaimProcessing,
  Payment,
  RiskAssessment,
} from "../types";

import { dataStore, PolicyModel, ClaimModel, PaymentModel } from "../models";

/**
 * ============================================================================
 * POLICY CONTROLLER
 * ============================================================================
 * Handles policy creation and management
 */
export class PolicyController {
  /**
   * Create a new policy with full calculations
   */
  static async createPolicy(input: PolicyInput): Promise<Policy> {
    // Step 1: Assess risk
    const riskAssessment = RiskEngineService.assessRisk({
      location: input.location,
      historicalClaims: Math.floor(Math.random() * 20),
      weatherPattern: ["monsoon", "tropical", "temperate"][Math.floor(Math.random() * 3)],
      trafficPattern: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
      userBehavior: ["aggressive", "moderate", "conservative"][Math.floor(Math.random() * 3)],
    });

    // Step 2: Calculate premium
    const premiumCalc = PremiumEngineService.calculatePremium({
      coverageAmount: input.coverageAmount,
      riskLevel: riskAssessment.riskLevel,
      location: input.location,
      triggers: input.triggers,
    });

    // Step 3: Create policy
    const policy: Policy = {
      id: `POL_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: input.userId,
      coverageAmount: input.coverageAmount,
      weeklyPremium: premiumCalc.finalPremium,
      riskLevel: riskAssessment.riskLevel,
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      triggers: input.triggers,
      createdAt: new Date(),
    };

    // Save to store
    await dataStore.savePolicy(policy as PolicyModel);

    return policy;
  }

  /**
   * Get policy with all details
   */
  static async getPolicyDetails(policyId: string, userId: string): Promise<Policy | null> {
    // In real implementation, fetch from database
    return null;
  }

  /**
   * Renew or update policy
   */
  static async renewPolicy(policyId: string): Promise<Policy> {
    // Implementation would fetch existing policy and create new one
    throw new Error("Not implemented");
  }
}

/**
 * ============================================================================
 * CLAIM CONTROLLER
 * ============================================================================
 * Handles claim creation and processing
 */
export class ClaimController {
  /**
   * Create and process a claim end-to-end
   */
  static async createAndProcessClaim(
    userId: string,
    policyId: string,
    coverageAmount: number,
    triggerType: string
  ): Promise<{ claim: Claim; processing: ClaimProcessing }> {
    // Step 1: Detect disruption (simulate)
    let disruption = null;

    if (triggerType === "rain") {
      disruption = TriggerEngineService.detectWeatherEvent("north");
    } else if (triggerType === "traffic") {
      disruption = TriggerEngineService.detectTrafficEvent("north");
    } else if (triggerType === "platform_down") {
      disruption = TriggerEngineService.detectPlatformDown();
    }

    if (!disruption) {
      throw new Error("Disruption not detected");
    }

    // Step 2: Trigger evaluation
    const triggerEval = TriggerEngineService.evaluateTrigger(
      policyId,
      [triggerType],
      disruption
    );

    if (!triggerEval.triggersPolicy) {
      throw new Error(`Policy not triggered: ${triggerEval.reason}`);
    }

    // Step 3: Calculate claim amount
    const claimAmount = ClaimsEngineService.calculateClaimAmount(
      coverageAmount,
      disruption.severity
    );

    // Step 4: Create claim object
    const claim: Claim = {
      id: `CLM_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      policyId,
      userId,
      claimAmount,
      status: "triggered",
      triggerType: disruption.type as any,
      triggerData: {
        severity: disruption.severity,
        confidence: disruption.confidence,
        description: disruption.description,
      },
      createdAt: new Date(),
    };

    // Step 5: Assess risk
    const riskAssessment = RiskEngineService.assessRisk({
      location: { zone: "north", latitude: 0, longitude: 0, riskMultiplier: 1 },
      historicalClaims: Math.floor(Math.random() * 20),
      weatherPattern: "monsoon",
      trafficPattern: "high",
      userBehavior: "moderate",
    });

    // Step 6: Fraud detection
    const userBehavior = FraudDetectionService.mockUserBehavior(userId);
    const fraudAssessment = FraudDetectionService.assessFraud(
      claim,
      userBehavior,
      disruption.confidence
    );

    // Step 7: Process claim
    const processing = await ClaimsEngineService.processClaim(
      claim,
      riskAssessment,
      fraudAssessment.fraudScore
    );

    // Step 8: Update claim status
    claim.status = processing.recommendation === "approve" ? "approved" : "processing";

    // Save claim
    await dataStore.saveClaim(claim as ClaimModel);

    return { claim, processing };
  }

  /**
   * Get claim details with full processing history
   */
  static async getClaimDetails(claimId: string): Promise<Claim | null> {
    return (await dataStore.getClaim(claimId)) as Claim | null;
  }

  /**
   * Get all claims for a user
   */
  static async getUserClaims(userId: string): Promise<Claim[]> {
    return (await dataStore.getClaimsByUserId(userId)) as Claim[];
  }
}

/**
 * ============================================================================
 * PREMIUM CONTROLLER
 * ============================================================================
 * Handles premium calculations and comparisons
 */
export class PremiumController {
  /**
   * Calculate premium with all breakdowns
   */
  static calculatePremium(
    coverageAmount: number,
    riskLevel: string,
    zone: string
  ): PremiumCalculation & { savings: { amount: number; percentage: number } } {
    const location = {
      zone,
      latitude: 0,
      longitude: 0,
      riskMultiplier: zone === "north" ? 1.1 : zone === "south" ? 0.95 : 1.0,
    };

    const calculation = PremiumEngineService.calculatePremium({
      coverageAmount,
      riskLevel: riskLevel as any,
      location,
      triggers: ["rain", "heat", "traffic"],
    });

    const savings = PremiumEngineService.calculateSavings(
      calculation.finalPremium,
      coverageAmount
    );

    return {
      ...calculation,
      savings,
    };
  }

  /**
   * Compare different coverage options
   */
  static compareCoverageOptions(
    baseAmount: number,
    zone: string
  ): {
    option: string;
    coverage: number;
    premium: number;
    savings: number;
  }[] {
    return [100, 300, 500, 750, 1000].map((amount) => {
      const calc = this.calculatePremium(amount, "medium", zone);
      return {
        option: `₹${amount} Coverage`,
        coverage: amount,
        premium: calc.finalPremium,
        savings: calc.savings.amount,
      };
    });
  }
}

/**
 * ============================================================================
 * PAYMENT CONTROLLER
 * ============================================================================
 * Handles payment processing and tracking
 */
export class PaymentController {
  /**
   * Process payment for a claim
   */
  static async processPaymentForClaim(claimId: string, amount: number): Promise<Payment> {
    const payment: Payment = {
      id: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      claimId,
      userId: "", // Would be set from claim
      amount,
      status: "pending",
      paymentMethod: "bank_transfer",
      transactionId: undefined,
    };

    const processed = await PaymentSimulatorService.processPayment(payment);
    await dataStore.savePayment(processed as PaymentModel);

    return processed;
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(paymentId: string): Promise<Payment | null> {
    // Implementation would fetch from database
    return null;
  }

  /**
   * Get all payments for a user
   */
  static async getUserPayments(userId: string): Promise<Payment[]> {
    // Implementation would fetch from database
    return [];
  }
}

/**
 * ============================================================================
 * ANALYTICS CONTROLLER
 * ============================================================================
 * Provides platform analytics and reporting
 */
export class AnalyticsController {
  /**
   * Get platform-wide metrics
   */
  static async getPlatformMetrics() {
    return {
      totalUsers: 8467,
      activeUsers: 5234,
      totalClaims: 1243,
      claimsThisMonth: 385,
      totalPayouts: 3820000,
      paidOutThisMonth: 1250000,
      averageClaimAmount: 3073,
      approvalRate: 0.78,
      fraudDetectionRate: 0.12,
    };
  }

  /**
   * Get user analytics
   */
  static async getUserAnalytics(userId: string) {
    return {
      userId,
      claimHistory: [],
      avgClaimAmount: 325,
      claimFrequency: 1.5, // claims per month
      approvalRate: 0.85,
      fraudRiskScore: 15,
      totalPaidOut: 1450,
      lastClaimDate: new Date(),
    };
  }

  /**
   * Get zone risk analysis
   */
  static async getZoneAnalytics(zone: string) {
    const zones: { [key: string]: any } = {
      north: {
        zone: "North Zone",
        riskLevel: "High",
        activeUsers: 2340,
        claimsThisMonth: 156,
        avgClaimAmount: 385,
        averageRiskScore: 72,
      },
      south: {
        zone: "South Zone",
        riskLevel: "Medium",
        activeUsers: 1560,
        claimsThisMonth: 78,
        avgClaimAmount: 295,
        averageRiskScore: 54,
      },
      east: {
        zone: "East Zone",
        riskLevel: "High",
        activeUsers: 1890,
        claimsThisMonth: 124,
        avgClaimAmount: 325,
        averageRiskScore: 68,
      },
      west: {
        zone: "West Zone",
        riskLevel: "Low",
        activeUsers: 890,
        claimsThisMonth: 32,
        avgClaimAmount: 210,
        averageRiskScore: 38,
      },
    };
    return zones[zone] || null;
  }
}

/**
 * ============================================================================
 * DISPUTE CONTROLLER
 * ============================================================================
 * Handles claim disputes and appeals
 */
export class DisputeController {
  /**
   * File a dispute for a rejected claim
   */
  static async fileDispute(claimId: string, reason: string): Promise<{ id: string; status: string }> {
    return {
      id: `DISP_${Date.now()}`,
      status: "pending_review",
    };
  }

  /**
   * Get dispute status
   */
  static async getDisputeStatus(disputeId: string): Promise<any> {
    return {
      id: disputeId,
      status: "pending_review",
      createdAt: new Date(),
    };
  }
}
