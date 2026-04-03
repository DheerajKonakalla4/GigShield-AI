/**
 * Enhanced Risk Engine with Weather, Location, and Historical Disruption Data
 */

/**
 * ============================================================================
 * DATA MODELS
 * ============================================================================
 */

/**
 * Weather risk data
 */
export interface WeatherRiskData {
  zone: string;
  rainProbability: number; // 0-1
  heatIndex: number; // 0-100 (temperature-based)
  season: "monsoon" | "summer" | "winter" | "spring";
  alerts: string[]; // e.g., "flood_warning", "extreme_heat"
}

/**
 * Historical disruption frequency data
 */
export interface HistoricalDisruption {
  zone: string;
  disruptionType: "weather" | "traffic" | "platform";
  frequency: number; // disruptions per month
  avgSeverity: number; // 0-100
  lastOccurrence: Date;
  yearlyTrend: number; // -1 to 1 (decreasing to increasing)
}

/**
 * Location/Zone data
 */
export interface LocationData {
  zone: string;
  city: string;
  state: string;
  riskTier: "low" | "medium" | "high"; // base risk tier
  disruptionFrequency: number; // per month
  weatherRisk: WeatherRiskData;
  historicalDisruptions: HistoricalDisruption[];
}

/**
 * Risk factors breakdown
 */
export interface RiskFactorBreakdown {
  location: number; // 0-1
  weather: number; // 0-1
  disruption: number; // 0-1
  combined: number; // 0-1 (final score)
}

/**
 * Complete risk assessment result
 */
export interface RiskAssessmentResult {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riskScore: number; // 0-100
  factors: RiskFactorBreakdown;
  details: {
    locationName: string;
    weatherCondition: string;
    disruptionHistory: string;
    alerts: string[];
  };
}

/**
 * Pricing tier configuration
 */
export interface PricingTier {
  name: "starter" | "pro" | "premium" | "enterprise";
  basePremium: number;
  coverageMin: number;
  coverageMax: number;
  features: string[];
  riskMultiplier: number;
}

/**
 * Weekly pricing adjustment
 */
export interface WeeklyPricingAdjustment {
  week: number; // 1-52
  seasonalFactor: number; // 0.8-1.2
  reason: string;
}

/**
 * Premium calculation result
 */
export interface PremiumResult {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  premium: number;
  breakdown: {
    basePrice: number;
    riskAdjustment: number;
    coverageFactor: number;
    tierMultiplier: number;
    weeklyAdjustment: number;
    finalPremium: number;
  };
  factors: {
    weather: number;
    location: number;
    disruption: number;
  };
  tier: PricingTier;
  weeklyAdjustment: WeeklyPricingAdjustment;
}

/**
 * ============================================================================
 * MOCK DATA
 * ============================================================================
 */

export const MOCK_WEATHER_DATA: Record<string, WeatherRiskData> = {
  north: {
    zone: "north",
    rainProbability: 0.3,
    heatIndex: 35,
    season: "summer",
    alerts: [],
  },
  south: {
    zone: "south",
    rainProbability: 0.6,
    heatIndex: 28,
    season: "monsoon",
    alerts: ["flood_warning"],
  },
  east: {
    zone: "east",
    rainProbability: 0.45,
    heatIndex: 38,
    season: "summer",
    alerts: ["extreme_heat"],
  },
  west: {
    zone: "west",
    rainProbability: 0.2,
    heatIndex: 32,
    season: "spring",
    alerts: [],
  },
};

export const MOCK_DISRUPTION_HISTORY: Record<string, HistoricalDisruption[]> = {
  north: [
    {
      zone: "north",
      disruptionType: "weather",
      frequency: 2.5,
      avgSeverity: 45,
      lastOccurrence: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      yearlyTrend: 0.1,
    },
    {
      zone: "north",
      disruptionType: "traffic",
      frequency: 4.0,
      avgSeverity: 35,
      lastOccurrence: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      yearlyTrend: 0.05,
    },
  ],
  south: [
    {
      zone: "south",
      disruptionType: "weather",
      frequency: 5.5,
      avgSeverity: 65,
      lastOccurrence: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      yearlyTrend: 0.2,
    },
    {
      zone: "south",
      disruptionType: "traffic",
      frequency: 3.5,
      avgSeverity: 40,
      lastOccurrence: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      yearlyTrend: -0.05,
    },
  ],
  east: [
    {
      zone: "east",
      disruptionType: "weather",
      frequency: 3.0,
      avgSeverity: 55,
      lastOccurrence: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      yearlyTrend: 0.15,
    },
    {
      zone: "east",
      disruptionType: "traffic",
      frequency: 5.0,
      avgSeverity: 45,
      lastOccurrence: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      yearlyTrend: 0.1,
    },
  ],
  west: [
    {
      zone: "west",
      disruptionType: "weather",
      frequency: 1.5,
      avgSeverity: 30,
      lastOccurrence: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      yearlyTrend: -0.1,
    },
  ],
};

export const LOCATION_MASTER_DATA: Record<string, LocationData> = {
  north: {
    zone: "north",
    city: "Delhi/NCR",
    state: "Delhi",
    riskTier: "medium",
    disruptionFrequency: 6.5,
    weatherRisk: MOCK_WEATHER_DATA.north,
    historicalDisruptions: MOCK_DISRUPTION_HISTORY.north,
  },
  south: {
    zone: "south",
    city: "Bangalore/Chennai",
    state: "Karnataka/Tamil Nadu",
    riskTier: "high",
    disruptionFrequency: 9.0,
    weatherRisk: MOCK_WEATHER_DATA.south,
    historicalDisruptions: MOCK_DISRUPTION_HISTORY.south,
  },
  east: {
    zone: "east",
    city: "Kolkata/Guwahati",
    state: "West Bengal/Assam",
    riskTier: "high",
    disruptionFrequency: 8.0,
    weatherRisk: MOCK_WEATHER_DATA.east,
    historicalDisruptions: MOCK_DISRUPTION_HISTORY.east,
  },
  west: {
    zone: "west",
    city: "Mumbai/Pune",
    state: "Maharashtra",
    riskTier: "medium",
    disruptionFrequency: 4.5,
    weatherRisk: MOCK_WEATHER_DATA.west,
    historicalDisruptions: MOCK_DISRUPTION_HISTORY.west,
  },
};

/**
 * Pricing tiers
 */
export const PRICING_TIERS: Record<string, PricingTier> = {
  starter: {
    name: "starter",
    basePremium: 50,
    coverageMin: 100,
    coverageMax: 300,
    features: ["Basic coverage", "Email support"],
    riskMultiplier: 1.0,
  },
  pro: {
    name: "pro",
    basePremium: 100,
    coverageMin: 300,
    coverageMax: 600,
    features: ["Enhanced coverage", "24/7 support", "Fast claims"],
    riskMultiplier: 0.95,
  },
  premium: {
    name: "premium",
    basePremium: 200,
    coverageMin: 600,
    coverageMax: 800,
    features: [
      "Maximum coverage",
      "Priority support",
      "Same-day claims",
      "Accident waiver",
    ],
    riskMultiplier: 0.9,
  },
  enterprise: {
    name: "enterprise",
    basePremium: 300,
    coverageMin: 800,
    coverageMax: 1000,
    features: [
      "Customizable coverage",
      "Dedicated account manager",
      "Instant claims",
      "Zero deductible",
    ],
    riskMultiplier: 0.85,
  },
};

/**
 * Weekly pricing adjustments (simulated seasonal patterns)
 */
export const WEEKLY_ADJUSTMENTS: WeeklyPricingAdjustment[] = [
  // January - Low season
  { week: 1, seasonalFactor: 0.85, reason: "winter_low_activity" },
  { week: 2, seasonalFactor: 0.85, reason: "winter_low_activity" },
  { week: 3, seasonalFactor: 0.85, reason: "winter_low_activity" },
  { week: 4, seasonalFactor: 0.85, reason: "winter_low_activity" },
  // February - Low season
  { week: 5, seasonalFactor: 0.88, reason: "pre_monsoon" },
  { week: 6, seasonalFactor: 0.88, reason: "pre_monsoon" },
  { week: 7, seasonalFactor: 0.88, reason: "pre_monsoon" },
  { week: 8, seasonalFactor: 0.9, reason: "pre_monsoon" },
  // March - Pre-season
  { week: 9, seasonalFactor: 0.95, reason: "spring_peak" },
  { week: 10, seasonalFactor: 0.95, reason: "spring_peak" },
  { week: 11, seasonalFactor: 0.95, reason: "spring_peak" },
  { week: 12, seasonalFactor: 1.0, reason: "spring_peak" },
  // April - High season
  { week: 13, seasonalFactor: 1.1, reason: "summer_high_activity" },
  { week: 14, seasonalFactor: 1.15, reason: "summer_high_activity" },
  { week: 15, seasonalFactor: 1.15, reason: "summer_high_activity" },
  { week: 16, seasonalFactor: 1.15, reason: "summer_high_activity" },
  // May - Peak season
  { week: 17, seasonalFactor: 1.2, reason: "peak_heat_disruptions" },
  { week: 18, seasonalFactor: 1.2, reason: "peak_heat_disruptions" },
  { week: 19, seasonalFactor: 1.2, reason: "peak_heat_disruptions" },
  { week: 20, seasonalFactor: 1.2, reason: "peak_heat_disruptions" },
  // June - Monsoon begins
  { week: 21, seasonalFactor: 1.15, reason: "monsoon_start" },
  { week: 22, seasonalFactor: 1.2, reason: "monsoon_active" },
  { week: 23, seasonalFactor: 1.2, reason: "monsoon_active" },
  { week: 24, seasonalFactor: 1.2, reason: "monsoon_active" },
  // July - Peak monsoon
  { week: 25, seasonalFactor: 1.25, reason: "heavy_monsoon" },
  { week: 26, seasonalFactor: 1.25, reason: "heavy_monsoon" },
  { week: 27, seasonalFactor: 1.25, reason: "heavy_monsoon" },
  { week: 28, seasonalFactor: 1.2, reason: "heavy_monsoon" },
  // August - Monsoon continues
  { week: 29, seasonalFactor: 1.2, reason: "monsoon_continues" },
  { week: 30, seasonalFactor: 1.15, reason: "monsoon_continues" },
  { week: 31, seasonalFactor: 1.15, reason: "monsoon_continues" },
  { week: 32, seasonalFactor: 1.1, reason: "monsoon_easing" },
  // September - Post-monsoon
  { week: 33, seasonalFactor: 1.05, reason: "post_monsoon" },
  { week: 34, seasonalFactor: 1.0, reason: "post_monsoon" },
  { week: 35, seasonalFactor: 1.0, reason: "post_monsoon" },
  { week: 36, seasonalFactor: 0.95, reason: "post_monsoon" },
  // October - Low season
  { week: 37, seasonalFactor: 0.9, reason: "october_dip" },
  { week: 38, seasonalFactor: 0.9, reason: "october_dip" },
  { week: 39, seasonalFactor: 0.88, reason: "october_dip" },
  { week: 40, seasonalFactor: 0.88, reason: "october_dip" },
  // November - Low season
  { week: 41, seasonalFactor: 0.85, reason: "winter_approaching" },
  { week: 42, seasonalFactor: 0.85, reason: "winter_approaching" },
  { week: 43, seasonalFactor: 0.85, reason: "winter_approaching" },
  { week: 44, seasonalFactor: 0.85, reason: "winter_approaching" },
  // December - Low season
  { week: 45, seasonalFactor: 0.85, reason: "winter_low" },
  { week: 46, seasonalFactor: 0.85, reason: "winter_low" },
  { week: 47, seasonalFactor: 0.85, reason: "winter_low" },
  { week: 48, seasonalFactor: 0.85, reason: "year_end_low" },
  { week: 49, seasonalFactor: 0.85, reason: "year_end_low" },
  { week: 50, seasonalFactor: 0.85, reason: "year_end_low" },
  { week: 51, seasonalFactor: 0.85, reason: "year_end_low" },
  { week: 52, seasonalFactor: 0.85, reason: "year_end_low" },
];

/**
 * ============================================================================
 * RISK ENGINE
 * ============================================================================
 */

export class EnhancedRiskEngine {
  /**
   * Calculate risk assessment based on location, weather, and historical data
   */
  static assessRisk(zone: string): RiskAssessmentResult {
    const location = LOCATION_MASTER_DATA[zone];

    if (!location) {
      throw new Error(`Invalid zone: ${zone}`);
    }

    // Calculate individual factors (0-1 scale)
    const locationRisk = this.calculateLocationRisk(location);
    const weatherRisk = this.calculateWeatherRisk(location.weatherRisk);
    const disruptionRisk = this.calculateDisruptionRisk(
      location.historicalDisruptions
    );

    // Weighted combination
    const combinedScore =
      locationRisk * 0.35 + weatherRisk * 0.35 + disruptionRisk * 0.3;

    // Normalize to 0-100
    const riskScore = Math.round(combinedScore * 100);

    return {
      riskLevel: this.getRiskLevel(riskScore),
      riskScore,
      factors: {
        location: Math.round(locationRisk * 100) / 100,
        weather: Math.round(weatherRisk * 100) / 100,
        disruption: Math.round(disruptionRisk * 100) / 100,
        combined: Math.round(combinedScore * 100) / 100,
      },
      details: {
        locationName: `${location.city}, ${location.state}`,
        weatherCondition: this.getWeatherDescription(location.weatherRisk),
        disruptionHistory: this.getDisruptionHistoryDescription(
          location.historicalDisruptions
        ),
        alerts: location.weatherRisk.alerts,
      },
    };
  }

  /**
   * Calculate location-based risk (0-1)
   */
  private static calculateLocationRisk(location: LocationData): number {
    const tierRiskMap: Record<string, number> = {
      low: 0.2,
      medium: 0.5,
      high: 0.8,
    };

    const baseRisk = tierRiskMap[location.riskTier] || 0.5;

    // Adjust based on disruption frequency
    // Normalize frequency: 0-12 disruptions per month to 0-1
    const frequencyFactor = Math.min(1, location.disruptionFrequency / 12);

    // Weighted combination
    return baseRisk * 0.6 + frequencyFactor * 0.4;
  }

  /**
   * Calculate weather-based risk (0-1)
   */
  private static calculateWeatherRisk(weather: WeatherRiskData): number {
    // Rain risk
    const rainRisk = weather.rainProbability; // 0-1

    // Heat risk (normalize heat index 0-100 to 0-1)
    const heatRisk = weather.heatIndex > 35 ? (weather.heatIndex - 35) / 15 : 0;
    const normalizedHeat = Math.min(1, heatRisk);

    // Alert level
    const alertFactor = weather.alerts.length > 0 ? 0.2 : 0;

    // Weighted combination
    return rainRisk * 0.45 + normalizedHeat * 0.4 + alertFactor * 0.15;
  }

  /**
   * Calculate disruption history risk (0-1)
   */
  private static calculateDisruptionRisk(
    disruptions: HistoricalDisruption[]
  ): number {
    if (disruptions.length === 0) {
      return 0.1; // Baseline low risk
    }

    let totalRisk = 0;

    disruptions.forEach((disruption) => {
      // Frequency risk: normalize 0-10 disruptions/month to 0-1
      const frequencyRisk = Math.min(1, disruption.frequency / 10);

      // Severity risk: normalize 0-100 to 0-1
      const severityRisk = disruption.avgSeverity / 100;

      // Trend risk: increasing trend adds risk
      const trendRisk = Math.max(0, disruption.yearlyTrend * 0.5);

      // Recency: recent disruptions add more risk
      const daysSinceLastDisruption = Math.floor(
        (new Date().getTime() - disruption.lastOccurrence.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const recencyFactor =
        daysSinceLastDisruption < 30
          ? 0.8
          : daysSinceLastDisruption < 60
            ? 0.5
            : 0.2;

      // Combine disruption factors
      const disruptionRisk =
        frequencyRisk * 0.35 +
        severityRisk * 0.35 +
        trendRisk * 0.15 +
        recencyFactor * 0.15;

      totalRisk += disruptionRisk;
    });

    return Math.min(1, totalRisk / disruptions.length);
  }

  /**
   * Determine risk level from score
   */
  private static getRiskLevel(
    score: number
  ): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
    if (score < 25) return "LOW";
    if (score < 50) return "MEDIUM";
    if (score < 75) return "HIGH";
    return "CRITICAL";
  }

  /**
   * Get human-readable weather description
   */
  private static getWeatherDescription(weather: WeatherRiskData): string {
    const conditions: string[] = [];

    if (weather.rainProbability > 0.5) {
      conditions.push(`High rain probability (${Math.round(weather.rainProbability * 100)}%)`);
    }

    if (weather.heatIndex > 40) {
      conditions.push(`Extreme heat (${weather.heatIndex}°C)`);
    } else if (weather.heatIndex > 35) {
      conditions.push(`High temperature (${weather.heatIndex}°C)`);
    }

    if (weather.alerts.length > 0) {
      conditions.push(`Alerts: ${weather.alerts.join(", ")}`);
    }

    return conditions.length > 0
      ? conditions.join(", ")
      : `${weather.season} season, mild conditions`;
  }

  /**
   * Get human-readable disruption history description
   */
  private static getDisruptionHistoryDescription(
    disruptions: HistoricalDisruption[]
  ): string {
    if (disruptions.length === 0) {
      return "No historical disruptions recorded";
    }

    return disruptions
      .map(
        (d) =>
          `${d.disruptionType}: ${d.frequency.toFixed(1)}/month (avg severity: ${d.avgSeverity})`
      )
      .join("; ");
  }
}

/**
 * ============================================================================
 * PREMIUM ENGINE
 * ============================================================================
 */

export class EnhancedPremiumEngine {
  /**
   * Calculate premium with all factors
   */
  static calculatePremium(
    zone: string,
    coverageAmount: number,
    weekNumber?: number
  ): PremiumResult {
    // Get risk assessment
    const riskAssessment = EnhancedRiskEngine.assessRisk(zone);

    // Determine pricing tier
    const tier = this.determinePricingTier(coverageAmount);

    // Get weekly adjustment
    const week = weekNumber || this.getWeekNumber();
    const weeklyAdjustment = WEEKLY_ADJUSTMENTS[week - 1];

    // Calculate premium components
    const basePrice = tier.basePremium;

    // Risk adjustment based on riskScore (0-100)
    const riskMultiplier = tier.riskMultiplier;
    const riskAdjustment =
      (riskAssessment.riskScore / 50) * basePrice * riskMultiplier;

    // Coverage amount factor: more coverage = higher premium
    // Using linear model: premium increases with coverage
    const coverageMin = tier.coverageMin;
    const coverageMax = tier.coverageMax;
    const coverageRatio = (coverageAmount - coverageMin) / (coverageMax - coverageMin);
    const coverageFactor = basePrice * 0.3 * Math.min(1, Math.max(0, coverageRatio));

    // Tier multiplier (discount for higher tiers)
    const tierMultiplier = tier.riskMultiplier;

    // Calculate subtotal before weekly adjustment
    let subtotal =
      basePrice + riskAdjustment + coverageFactor * tierMultiplier;

    // Apply weekly adjustment
    const weeklyAdjustmentAmount = subtotal * (weeklyAdjustment.seasonalFactor - 1);
    const finalPremium = subtotal + weeklyAdjustmentAmount;

    // Round to 2 decimal places
    const roundedFinal = Math.round(finalPremium * 100) / 100;

    return {
      riskLevel: riskAssessment.riskLevel,
      premium: roundedFinal,
      breakdown: {
        basePrice: Math.round(basePrice * 100) / 100,
        riskAdjustment: Math.round(riskAdjustment * 100) / 100,
        coverageFactor: Math.round(coverageFactor * 100) / 100,
        tierMultiplier: Math.round(tierMultiplier * 100) / 100,
        weeklyAdjustment: Math.round(weeklyAdjustmentAmount * 100) / 100,
        finalPremium: roundedFinal,
      },
      factors: {
        weather: riskAssessment.factors.weather,
        location: riskAssessment.factors.location,
        disruption: riskAssessment.factors.disruption,
      },
      tier,
      weeklyAdjustment,
    };
  }

  /**
   * Determine pricing tier based on coverage amount
   */
  private static determinePricingTier(coverageAmount: number): PricingTier {
    const tiers = Object.values(PRICING_TIERS);

    for (const tier of tiers) {
      if (
        coverageAmount >= tier.coverageMin &&
        coverageAmount <= tier.coverageMax
      ) {
        return tier;
      }
    }

    // Default to highest tier if out of range
    return PRICING_TIERS.enterprise;
  }

  /**
   * Get current week number (1-52)
   */
  private static getWeekNumber(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.floor(diff / oneWeek) + 1;
  }

  /**
   * Compare prices across all coverage tiers for a zone
   */
  static compareTiers(zone: string): PremiumResult[] {
    return [100, 300, 500, 700, 900].map((coverage) => {
      return this.calculatePremium(zone, coverage);
    });
  }

  /**
   * Calculate annual premium with monthly estimate
   */
  static calculateAnnualPremium(
    zone: string,
    coverageAmount: number
  ): {
    monthlyPremium: number;
    annualPremium: number;
    estimatedCost: number;
  } {
    let totalAnnual = 0;

    // Calculate premium for each week's seasonal adjustment
    for (let week = 1; week <= 52; week++) {
      const weekPremium = this.calculatePremium(zone, coverageAmount, week);
      totalAnnual += weekPremium.premium;
    }

    const monthlyAverage = totalAnnual / 12;
    const annualPremium = Math.round(totalAnnual * 100) / 100;

    return {
      monthlyPremium: Math.round(monthlyAverage * 100) / 100,
      annualPremium,
      estimatedCost: annualPremium,
    };
  }
}

/**
 * ============================================================================
 * COMBINED API
 * ============================================================================
 */

export const RiskAndPremiumEngine = {
  /**
   * Get complete risk and premium analysis for a zone and coverage
   */
  analyzeZone: (zone: string, coverageAmount: number) => {
    const risk = EnhancedRiskEngine.assessRisk(zone);
    const premium = EnhancedPremiumEngine.calculatePremium(zone, coverageAmount);
    const annual = EnhancedPremiumEngine.calculateAnnualPremium(zone, coverageAmount);

    // Get recommendation based on risk level
    let recommendation = "";
    if (risk.riskLevel === "CRITICAL") {
      recommendation = `⚠️  CRITICAL RISK: Premium is elevated (₹${premium.premium}). Consider relocating delivery zones.`;
    } else if (risk.riskLevel === "HIGH") {
      recommendation = `⚠️  HIGH RISK: Premium of ₹${premium.premium} reflects elevated risk factors.`;
    } else if (risk.riskLevel === "MEDIUM") {
      recommendation = `ℹ️  MODERATE RISK: Premium of ₹${premium.premium} is reasonable for this zone.`;
    } else {
      recommendation = `✅ LOW RISK: Excellent rate of ₹${premium.premium} for this zone.`;
    }

    return {
      zone,
      coverage: coverageAmount,
      risk,
      premium,
      annual,
      recommendation,
    };
  },

  /**
   * Bulk compare all zones
   */
  compareAllZones: (coverageAmount: number) => {
    return Object.keys(LOCATION_MASTER_DATA).map((zone) => {
      const risk = EnhancedRiskEngine.assessRisk(zone);
      const premium = EnhancedPremiumEngine.calculatePremium(zone, coverageAmount);
      const annual = EnhancedPremiumEngine.calculateAnnualPremium(zone, coverageAmount);

      let recommendation = "";
      if (risk.riskLevel === "CRITICAL") {
        recommendation = `⚠️  CRITICAL RISK: Premium is elevated (₹${premium.premium}). Consider relocating delivery zones.`;
      } else if (risk.riskLevel === "HIGH") {
        recommendation = `⚠️  HIGH RISK: Premium of ₹${premium.premium} reflects elevated risk factors.`;
      } else if (risk.riskLevel === "MEDIUM") {
        recommendation = `ℹ️  MODERATE RISK: Premium of ₹${premium.premium} is reasonable for this zone.`;
      } else {
        recommendation = `✅ LOW RISK: Excellent rate of ₹${premium.premium} for this zone.`;
      }

      return {
        zone,
        coverage: coverageAmount,
        risk,
        premium,
        annual,
        recommendation,
      };
    });
  },
};

export default RiskAndPremiumEngine;
