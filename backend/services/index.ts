/**
 * Core Business Logic Services
 * Implements the six engines of the parametric insurance platform
 */

import {
  RiskAssessment,
  RiskFactor,
  RiskData,
  PremiumCalculation,
  PremiumBreakdown,
  PremiumInput,
  DisruptionEvent,
  TriggerEvaluation,
  WeatherData,
  TrafficData,
  PlatformStatus,
  ClaimProcessing,
  ProcessingStep,
  FraudAssessment,
  FraudFlag,
  UserBehaviorAnalysis,
  Payment,
  PaymentStatus,
  Claim,
} from "../types";

/**
 * ============================================================================
 * RISK ENGINE SERVICE
 * ============================================================================
 * Calculates risk scores based on multiple factors
 */
export class RiskEngineService {
  /**
   * Comprehensive risk assessment for a user
   */
  static assessRisk(riskData: RiskData): RiskAssessment {
    const factors: RiskFactor[] = [];
    let totalScore = 0;

    // Factor 1: Location Risk (30% weight)
    const locationFactor = this.calculateLocationRisk(riskData.location);
    factors.push({
      name: "Location Risk",
      weight: 0.3,
      contribution: locationFactor * 0.3,
      description: `Risk multiplier for zone: ${riskData.location.zone}`,
    });
    totalScore += locationFactor * 0.3;

    // Factor 2: Historical Claims (25% weight)
    const historicalFactor = this.calculateHistoricalClaimsRisk(
      riskData.historicalClaims
    );
    factors.push({
      name: "Historical Claims",
      weight: 0.25,
      contribution: historicalFactor * 0.25,
      description: `Based on ${riskData.historicalClaims} claims in area`,
    });
    totalScore += historicalFactor * 0.25;

    // Factor 3: Weather Pattern (20% weight)
    const weatherFactor = this.calculateWeatherRisk(riskData.weatherPattern);
    factors.push({
      name: "Weather Pattern",
      weight: 0.2,
      contribution: weatherFactor * 0.2,
      description: `${riskData.weatherPattern} pattern detected`,
    });
    totalScore += weatherFactor * 0.2;

    // Factor 4: Traffic Pattern (15% weight)
    const trafficFactor = this.calculateTrafficRisk(riskData.trafficPattern);
    factors.push({
      name: "Traffic Pattern",
      weight: 0.15,
      contribution: trafficFactor * 0.15,
      description: `${riskData.trafficPattern} traffic pattern`,
    });
    totalScore += trafficFactor * 0.15;

    // Factor 5: User Behavior (10% weight)
    const behaviorFactor = this.calculateBehaviorRisk(riskData.userBehavior);
    factors.push({
      name: "User Behavior",
      weight: 0.1,
      contribution: behaviorFactor * 0.1,
      description: `Behavioral risk score`,
    });
    totalScore += behaviorFactor * 0.1;

    // Normalize score to 0-100
    const riskScore = Math.min(100, Math.max(0, totalScore * 100));

    return {
      userId: "",
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      factors,
      timestamp: new Date(),
    };
  }

  private static calculateLocationRisk(location: any): number {
    // Use location's risk multiplier (typically 0.8 - 1.2)
    return location.riskMultiplier || 1.0;
  }

  private static calculateHistoricalClaimsRisk(claims: number): number {
    // More claims = higher risk
    // Linear scaling: 0 claims = 0.3, 10+ claims = 1.0
    return Math.min(1.0, claims / 10);
  }

  private static calculateWeatherRisk(pattern: string): number {
    const riskMap: { [key: string]: number } = {
      monsoon: 0.9,
      tropical: 0.7,
      temperate: 0.4,
      arid: 0.3,
      unpredictable: 0.8,
    };
    return riskMap[pattern.toLowerCase()] || 0.5;
  }

  private static calculateTrafficRisk(pattern: string): number {
    const riskMap: { [key: string]: number } = {
      high: 0.8,
      medium: 0.5,
      low: 0.2,
      variable: 0.6,
    };
    return riskMap[pattern.toLowerCase()] || 0.5;
  }

  private static calculateBehaviorRisk(behavior: string): number {
    const riskMap: { [key: string]: number } = {
      aggressive: 0.7,
      moderate: 0.4,
      conservative: 0.2,
      unknown: 0.5,
    };
    return riskMap[behavior.toLowerCase()] || 0.5;
  }

  private static getRiskLevel(
    score: number
  ): "low" | "medium" | "high" {
    if (score < 33) return "low";
    if (score < 66) return "medium";
    return "high";
  }
}

/**
 * ============================================================================
 * PREMIUM ENGINE SERVICE
 * ============================================================================
 * Calculates premiums based on risk and coverage
 */
export class PremiumEngineService {
  private static readonly BASE_RATE = 0.05; // 5% of coverage
  private static readonly ADMIN_FEE = 50; // Fixed fee
  private static readonly TAX_RATE = 0.18; // 18% GST (India)

  static calculatePremium(input: PremiumInput): PremiumCalculation {
    // Base premium calculation
    const basePremium = input.coverageAmount * this.BASE_RATE;

    // Risk adjustment
    const riskAdjustment = this.calculateRiskAdjustment(
      input.riskLevel,
      basePremium
    );

    // Location multiplier
    const locationMultiplier = input.location.riskMultiplier || 1.0;

    // Calculate subtotal before taxes
    const subtotal = (basePremium + riskAdjustment) * locationMultiplier;

    // Add admin fee
    const adminFeeAmount = this.ADMIN_FEE;

    // Calculate taxes
    const taxes = (subtotal + adminFeeAmount) * this.TAX_RATE;

    // Final premium
    const finalPremium = subtotal + adminFeeAmount + taxes;

    const breakdown: PremiumBreakdown = {
      baseRate: this.BASE_RATE * 100,
      riskMarkup: riskAdjustment,
      locationFactor: locationMultiplier,
      adminFee: adminFeeAmount,
      taxes,
    };

    return {
      basePremium,
      riskAdjustment,
      locationMultiplier,
      finalPremium: Math.round(finalPremium * 100) / 100,
      breakdown,
    };
  }

  private static calculateRiskAdjustment(
    riskLevel: string,
    basePremium: number
  ): number {
    const markupMap: { [key: string]: number } = {
      low: basePremium * 0.1, // 10% markup
      medium: basePremium * 0.25, // 25% markup
      high: basePremium * 0.5, // 50% markup
    };
    return markupMap[riskLevel.toLowerCase()] || basePremium * 0.25;
  }

  static getMarketPrice(coverageAmount: number): number {
    // Simulated market price (typically higher than our price)
    return coverageAmount * 0.08;
  }

  static calculateSavings(
    finalPremium: number,
    coverageAmount: number
  ): { amount: number; percentage: number } {
    const marketPrice = this.getMarketPrice(coverageAmount);
    const savings = marketPrice - finalPremium;
    const percentage = (savings / marketPrice) * 100;
    return {
      amount: Math.max(0, Math.round(savings * 100) / 100),
      percentage: Math.max(0, Math.round(percentage * 100) / 100),
    };
  }
}

/**
 * ============================================================================
 * TRIGGER ENGINE SERVICE
 * ============================================================================
 * Detects and evaluates disruption events
 */
export class TriggerEngineService {
  /**
   * Evaluate if a disruption triggers a claim
   */
  static evaluateTrigger(
    policyId: string,
    policyTriggers: string[],
    disruption: DisruptionEvent
  ): TriggerEvaluation {
    const triggers = policyTriggers.map((t) => t.toLowerCase());

    // Check if disruption type matches policy triggers
    const matches = triggers.includes(disruption.type);

    // Check severity threshold (>40 for all types)
    const severityMeetsThreshold = disruption.severity > 40;

    // Check confidence level (>0.6 required)
    const confidenceAdequate = disruption.confidence > 0.6;

    const triggersPolicy = matches && severityMeetsThreshold && confidenceAdequate;

    let reason = "";
    if (!matches) reason = `Disruption type '${disruption.type}' not covered`;
    else if (!severityMeetsThreshold) reason = `Severity ${disruption.severity} below threshold`;
    else if (!confidenceAdequate) reason = `Confidence ${disruption.confidence} insufficient`;
    else reason = "Policy triggered - all conditions met";

    return {
      policyId,
      disruption,
      triggersPolicy,
      reason,
      confidence: disruption.confidence,
    };
  }

  /**
   * Simulate weather detection
   */
  static detectWeatherEvent(location: string): DisruptionEvent | null {
    const random = Math.random();

    if (random < 0.3) {
      // 30% chance of rain
      return {
        id: `weather_${Date.now()}`,
        type: "rain",
        severity: Math.floor(Math.random() * 100),
        location: { zone: location, latitude: 0, longitude: 0, riskMultiplier: 1 },
        startTime: new Date(),
        description: "Heavy rainfall detected",
        confidence: 0.85 + Math.random() * 0.15,
        dataSource: "weather_api",
      };
    }

    if (random < 0.5) {
      // 20% chance of heat
      return {
        id: `weather_${Date.now()}`,
        type: "heat",
        severity: Math.floor(Math.random() * 100),
        location: { zone: location, latitude: 0, longitude: 0, riskMultiplier: 1 },
        startTime: new Date(),
        description: "Extreme heat detected",
        confidence: 0.8 + Math.random() * 0.2,
        dataSource: "weather_api",
      };
    }

    return null;
  }

  /**
   * Simulate traffic detection
   */
  static detectTrafficEvent(location: string): DisruptionEvent | null {
    const random = Math.random();

    if (random < 0.25) {
      // 25% chance of traffic jam
      return {
        id: `traffic_${Date.now()}`,
        type: "traffic",
        severity: Math.floor(Math.random() * 100),
        location: { zone: location, latitude: 0, longitude: 0, riskMultiplier: 1 },
        startTime: new Date(),
        description: "Heavy traffic congestion detected",
        confidence: 0.75 + Math.random() * 0.25,
        dataSource: "traffic_api",
      };
    }

    return null;
  }

  /**
   * Simulate platform downtime detection
   */
  static detectPlatformDown(): DisruptionEvent | null {
    const random = Math.random();

    if (random < 0.05) {
      // 5% chance of platform down
      return {
        id: `platform_${Date.now()}`,
        type: "platform_down",
        severity: 85,
        location: { zone: "all", latitude: 0, longitude: 0, riskMultiplier: 1 },
        startTime: new Date(),
        description: "Platform downtime detected",
        confidence: 0.95,
        dataSource: "system_monitor",
      };
    }

    return null;
  }
}

/**
 * ============================================================================
 * CLAIMS ENGINE SERVICE
 * ============================================================================
 * Processes and manages claims
 */
export class ClaimsEngineService {
  /**
   * Process a triggered claim end-to-end
   */
  static async processClaim(
    claim: Claim,
    riskAssessment: RiskAssessment,
    fraudScore: number
  ): Promise<ClaimProcessing> {
    const processing: ClaimProcessing = {
      claimId: claim.id,
      userId: claim.userId,
      policyId: claim.policyId,
      disruption: {} as DisruptionEvent,
      riskAssessment,
      fraudScore,
      recommendation: this.determineRecommendation(fraudScore, riskAssessment),
      processingLog: [],
    };

    // Log processing steps
    processing.processingLog.push({
      step: "Claim Received",
      status: "completed",
      timestamp: new Date(),
      details: `Claim ${claim.id} received for policy ${claim.policyId}`,
    });

    processing.processingLog.push({
      step: "Risk Check",
      status: "completed",
      timestamp: new Date(),
      details: `Risk score: ${riskAssessment.riskScore}, Level: ${riskAssessment.riskLevel}`,
    });

    processing.processingLog.push({
      step: "Fraud Detection",
      status: "completed",
      timestamp: new Date(),
      details: `Fraud score: ${fraudScore}`,
    });

    processing.processingLog.push({
      step: "Approval Decision",
      status: "completed",
      timestamp: new Date(),
      details: `Recommendation: ${processing.recommendation}`,
    });

    return processing;
  }

  private static determineRecommendation(
    fraudScore: number,
    riskAssessment: RiskAssessment
  ): "approve" | "reject" | "manual_review" {
    // High fraud score = reject
    if (fraudScore > 70) return "reject";

    // Moderate fraud or risk = manual review
    if (fraudScore > 40 || riskAssessment.riskLevel === "high") {
      return "manual_review";
    }

    // Low fraud and risk = approve
    return "approve";
  }

  /**
   * Calculate claim amount based on coverage and trigger
   */
  static calculateClaimAmount(coverageAmount: number, triggerSeverity: number): number {
    // Payout scales with trigger severity (0-100)
    // At 50% severity = 50% of coverage, at 100% = full coverage
    const payoutPercentage = Math.min(1, triggerSeverity / 100);
    return Math.round(coverageAmount * payoutPercentage * 100) / 100;
  }
}

/**
 * ============================================================================
 * FRAUD DETECTION ENGINE SERVICE
 * ============================================================================
 * Detects fraudulent claims
 */
export class FraudDetectionService {
  /**
   * Comprehensive fraud assessment
   */
  static assessFraud(
    claim: Claim,
    userBehavior: UserBehaviorAnalysis,
    disruptionConfidence: number
  ): FraudAssessment {
    let fraudScore = 0;
    const flags: FraudFlag[] = [];

    // Check 1: Claim Frequency (weight: 25%)
    if (userBehavior.claimsPerMonth > 4) {
      fraudScore += 25;
      flags.push({
        type: "high_claim_frequency",
        severity: "high",
        description: `User filing ${userBehavior.claimsPerMonth} claims/month`,
        weight: 0.25,
      });
    } else if (userBehavior.claimsPerMonth > 2) {
      fraudScore += 10;
      flags.push({
        type: "moderate_claim_frequency",
        severity: "medium",
        description: `User filing ${userBehavior.claimsPerMonth} claims/month`,
        weight: 0.15,
      });
    }

    // Check 2: Claim Amount Pattern (weight: 20%)
    if (claim.claimAmount > userBehavior.averageClaimAmount * 2) {
      fraudScore += 20;
      flags.push({
        type: "unusually_high_amount",
        severity: "high",
        description: `Claim ₹${claim.claimAmount} vs avg ₹${userBehavior.averageClaimAmount}`,
        weight: 0.2,
      });
    }

    // Check 3: Recent Payout History (weight: 15%)
    if (
      userBehavior.lastClaimDate &&
      Date.now() - userBehavior.lastClaimDate.getTime() < 7 * 24 * 60 * 60 * 1000
    ) {
      fraudScore += 15;
      flags.push({
        type: "rapid_successive_claims",
        severity: "high",
        description: "Claim filed within 7 days of last claim",
        weight: 0.15,
      });
    }

    // Check 4: Disruption Confidence (weight: 20%)
    if (disruptionConfidence < 0.7) {
      fraudScore += 15;
      flags.push({
        type: "low_disruption_confidence",
        severity: "medium",
        description: `Disruption confidence only ${(disruptionConfidence * 100).toFixed(0)}%`,
        weight: 0.2,
      });
    }

    // Check 5: Approval Rate Anomaly (weight: 20%)
    if (userBehavior.claimApprovalRate > 0.95) {
      fraudScore += 10;
      flags.push({
        type: "unusual_approval_rate",
        severity: "medium",
        description: `${(userBehavior.claimApprovalRate * 100).toFixed(0)}% approval rate`,
        weight: 0.1,
      });
    }

    const riskLevel =
      fraudScore < 30 ? "low" : fraudScore < 60 ? "medium" : "high";

    return {
      claimId: claim.id,
      fraudScore: Math.min(100, fraudScore),
      riskLevel,
      flags,
      recommendation: this.getRecommendation(fraudScore),
      timestamp: new Date(),
    };
  }

  private static getRecommendation(
    score: number
  ): "approve" | "reject" | "manual_review" {
    if (score > 70) return "reject";
    if (score > 40) return "manual_review";
    return "approve";
  }

  /**
   * Create mock user behavior analysis
   */
  static mockUserBehavior(userId: string): UserBehaviorAnalysis {
    return {
      userId,
      claimsPerMonth: Math.floor(Math.random() * 5),
      claimApprovalRate: 0.8 + Math.random() * 0.19,
      averageClaimAmount: 250 + Math.random() * 250,
      suspiciousPatterns: [],
      lastClaimDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    };
  }
}

/**
 * ============================================================================
 * PAYMENT SIMULATOR SERVICE
 * ============================================================================
 * Handles payment processing and simulation
 */
export class PaymentSimulatorService {
  /**
   * Simulate payment processing
   */
  static async processPayment(payment: Payment): Promise<Payment> {
    // Simulate realistic processing time (1-5 seconds)
    const processingTime = Math.random() * 4000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, processingTime));

    // 95% success rate
    const success = Math.random() < 0.95;

    if (success) {
      payment.status = "completed";
      payment.completedAt = new Date();
      payment.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    } else {
      payment.status = "failed";
      payment.failureReason = this.getRandomFailureReason();
    }

    payment.processedAt = new Date();
    return payment;
  }

  private static getRandomFailureReason(): string {
    const reasons = [
      "Insufficient funds",
      "Invalid account details",
      "Bank server timeout",
      "Daily limit exceeded",
      "Account blocked",
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  /**
   * Get payment status
   */
  static getPaymentStatus(payment: Payment): string {
    const statusMap: { [key in PaymentStatus]: string } = {
      pending: "Payment pending",
      processing: "Processing your payment",
      completed: "Payment completed successfully",
      failed: "Payment failed",
    };
    return statusMap[payment.status];
  }
}
