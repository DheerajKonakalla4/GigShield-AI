/**
 * Premium Engine - Dynamic Premium Calculation System
 * File: backend/engines/premium-engine.ts
 *
 * Features:
 * - Risk-based premium calculation
 * - Zone risk assessment
 * - Weather frequency analysis
 * - Historical disruption tracking
 * - Dynamic pricing tiers
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface UserPremium {
  userId: string;
  riskLevel: RiskLevel;
  weeklyPremium: number; // ₹ per week
  monthlyPremium: number; // ₹ per month
  annualPremium: number; // ₹ per year
  riskScore: number; // 0-100
  breakdown: {
    zoneRisk: number; // 0-100
    weatherFrequency: number; // 0-100
    historicalDisruptions: number; // 0-100
  };
  lastUpdated: Date;
}

export interface ZoneRiskData {
  zone: string;
  riskLevel: RiskLevel;
  baseScore: number; // 0-100
  weatherFrequency: number; // disruptions per month
  historicalClaimsCount: number;
  averagePayoutPerClaim: number;
  disruptionTrend: number; // -1 to 1 (decreasing to increasing)
}

// ============================================================================
// PREMIUM CONFIGURATION
// ============================================================================

export const PREMIUM_CONFIG = {
  // Base weekly premiums by risk level
  BASE_PREMIUMS: {
    LOW: 15, // ₹15/week
    MEDIUM: 25, // ₹25/week
    HIGH: 40, // ₹40/week
  },

  // Risk score ranges
  RISK_SCORE_RANGES: {
    LOW: { min: 0, max: 33 },
    MEDIUM: { min: 34, max: 66 },
    HIGH: { min: 67, max: 100 },
  },

  // Zone base risk scores
  ZONE_BASE_RISK: {
    north: 45, // Moderate-high risk
    south: 35, // Moderate risk
    east: 60, // High risk
    west: 40, // Moderate risk
  } as Record<string, number>,

  // Weather frequency impact (per disruption/month)
  WEATHER_FREQUENCY_IMPACT: 0.3,

  // Historical disruption impact
  HISTORICAL_DISRUPTION_IMPACT: 0.2,

  // Multipliers for different seasons
  SEASONAL_MULTIPLIERS: {
    monsoon: 1.3, // Higher risk
    summer: 1.2,
    winter: 0.9,
    spring: 1.0,
  },
};

// ============================================================================
// ZONE RISK DATA (Mock)
// ============================================================================

export const ZONE_RISK_DATABASE: ZoneRiskData[] = [
  {
    zone: "north",
    riskLevel: "HIGH",
    baseScore: 45,
    weatherFrequency: 3.2, // 3-4 disruptions per month
    historicalClaimsCount: 156,
    averagePayoutPerClaim: 2850,
    disruptionTrend: 0.15, // Increasing trend
  },
  {
    zone: "south",
    riskLevel: "MEDIUM",
    baseScore: 35,
    weatherFrequency: 2.1,
    historicalClaimsCount: 98,
    averagePayoutPerClaim: 2450,
    disruptionTrend: -0.05, // Slightly decreasing
  },
  {
    zone: "east",
    riskLevel: "HIGH",
    baseScore: 60,
    weatherFrequency: 4.5,
    historicalClaimsCount: 201,
    averagePayoutPerClaim: 3200,
    disruptionTrend: 0.2, // Increasing trend
  },
  {
    zone: "west",
    riskLevel: "MEDIUM",
    baseScore: 40,
    weatherFrequency: 2.8,
    historicalClaimsCount: 112,
    averagePayoutPerClaim: 2650,
    disruptionTrend: 0.1,
  },
];

// ============================================================================
// PREMIUM ENGINE
// ============================================================================

export class PremiumEngine {
  private zoneRiskMap = new Map<string, ZoneRiskData>();
  private userPremiums = new Map<string, UserPremium>();

  constructor() {
    // Initialize zone risk data
    ZONE_RISK_DATABASE.forEach((zone) => {
      this.zoneRiskMap.set(zone.zone.toLowerCase(), zone);
    });
  }

  /**
   * Calculate user premium based on risk factors
   */
  calculateUserPremium(
    userId: string,
    zone: string,
    claimHistory: number = 0
  ): UserPremium {
    const zoneData = this.zoneRiskMap.get(zone.toLowerCase());
    if (!zoneData) {
      throw new Error(`Zone not found: ${zone}`);
    }

    // Calculate risk score (0-100)
    const riskScore = this.calculateRiskScore(zoneData, claimHistory);

    // Determine risk level
    const riskLevel = this.getRiskLevel(riskScore);

    // Get base weekly premium
    const baseWeekly = PREMIUM_CONFIG.BASE_PREMIUMS[riskLevel];

    // Apply adjustments
    const adjustedWeekly = this.applyAdjustments(baseWeekly, zoneData);

    // Calculate other periods
    const monthlyPremium = adjustedWeekly * 4.33;
    const annualPremium = adjustedWeekly * 52;

    // Breakdown of risk factors
    const breakdown = {
      zoneRisk: zoneData.baseScore,
      weatherFrequency: Math.min(zoneData.weatherFrequency * 20, 100),
      historicalDisruptions: Math.min((zoneData.historicalClaimsCount / 200) * 100, 100),
    };

    const premium: UserPremium = {
      userId,
      riskLevel,
      weeklyPremium: Math.round(adjustedWeekly * 100) / 100,
      monthlyPremium: Math.round(monthlyPremium * 100) / 100,
      annualPremium: Math.round(annualPremium * 100) / 100,
      riskScore,
      breakdown,
      lastUpdated: new Date(),
    };

    // Cache the result
    this.userPremiums.set(userId, premium);

    return premium;
  }

  /**
   * Calculate risk score based on zone and historical data
   */
  private calculateRiskScore(zoneData: ZoneRiskData, claimHistory: number): number {
    let score = zoneData.baseScore; // Start with zone base risk

    // Add impact from weather frequency
    const weatherImpact = Math.min(zoneData.weatherFrequency * 8, 30);
    score += weatherImpact * PREMIUM_CONFIG.WEATHER_FREQUENCY_IMPACT;

    // Add impact from historical disruptions
    const historicalImpact = Math.min((zoneData.historicalClaimsCount / 200) * 30, 30);
    score += historicalImpact * PREMIUM_CONFIG.HISTORICAL_DISRUPTION_IMPACT;

    // Add impact from user's personal claim history
    score += claimHistory * 5; // +5 for each claim

    // Normalize to 0-100
    return Math.min(Math.round(score), 100);
  }

  /**
   * Get risk level from risk score
   */
  private getRiskLevel(riskScore: number): RiskLevel {
    if (riskScore <= PREMIUM_CONFIG.RISK_SCORE_RANGES.LOW.max) {
      return "LOW";
    } else if (riskScore <= PREMIUM_CONFIG.RISK_SCORE_RANGES.MEDIUM.max) {
      return "MEDIUM";
    } else {
      return "HIGH";
    }
  }

  /**
   * Apply adjustments to base premium
   */
  private applyAdjustments(basePremium: number, zoneData: ZoneRiskData): number {
    let adjustedPremium = basePremium;

    // Apply disruption trend adjustment
    if (zoneData.disruptionTrend > 0.1) {
      adjustedPremium *= 1.1; // +10% for increasing trend
    } else if (zoneData.disruptionTrend < -0.1) {
      adjustedPremium *= 0.95; // -5% for decreasing trend
    }

    // Apply seasonal adjustment (mock: assume current season is monsoon)
    const currentSeason = "monsoon";
    adjustedPremium *= PREMIUM_CONFIG.SEASONAL_MULTIPLIERS[
      currentSeason as keyof typeof PREMIUM_CONFIG.SEASONAL_MULTIPLIERS
    ] || 1.0;

    return adjustedPremium;
  }

  /**
   * Get premium for all zones
   */
  getZonePremiums(): Record<string, Omit<UserPremium, 'userId'>> {
    const result: Record<string, Omit<UserPremium, 'userId'>> = {};

    this.zoneRiskMap.forEach((zoneData, zone) => {
      const premium = this.calculateUserPremium(`ref_${zone}`, zone);
      const { userId, ...rest } = premium;
      result[zone] = rest;
    });

    return result;
  }

  /**
   * Get user premium
   */
  getUserPremium(userId: string): UserPremium | null {
    return this.userPremiums.get(userId) || null;
  }

  /**
   * Get all zone risk data
   */
  getZoneRiskData(): ZoneRiskData[] {
    return Array.from(this.zoneRiskMap.values());
  }

  /**
   * Get zone risk data by zone
   */
  getZoneRisk(zone: string): ZoneRiskData | null {
    return this.zoneRiskMap.get(zone.toLowerCase()) || null;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let premiumEngine: PremiumEngine | null = null;

export function initializePremiumEngine(): PremiumEngine {
  if (!premiumEngine) {
    premiumEngine = new PremiumEngine();
  }
  return premiumEngine;
}

export function getPremiumEngine(): PremiumEngine {
  if (!premiumEngine) {
    return initializePremiumEngine();
  }
  return premiumEngine;
}
