/**
 * Risk and Premium Engine - Usage Examples
 * Demonstrates complete API usage with various scenarios
 */

import {
  RiskAndPremiumEngine,
  EnhancedRiskEngine,
  EnhancedPremiumEngine,
  LOCATION_MASTER_DATA,
} from "./enhanced-risk-premium";

/**
 * ============================================================================
 * EXAMPLE 1: Single Zone Analysis
 * ============================================================================
 */

console.log("=".repeat(80));
console.log("EXAMPLE 1: Single Zone Risk & Premium Analysis");
console.log("=".repeat(80));

const northZoneAnalysis = RiskAndPremiumEngine.analyzeZone("north", 500);

console.log("\n📍 Zone: North (Delhi/NCR)");
console.log("📦 Coverage Amount: ₹500");
console.log("\n🎯 RISK ASSESSMENT:");
console.log(`   Risk Level: ${northZoneAnalysis.risk.riskLevel}`);
console.log(`   Risk Score: ${northZoneAnalysis.risk.riskScore}/100`);
console.log("\n   Risk Factors:");
console.log(`   • Weather: ${northZoneAnalysis.risk.factors.weather} (0-1 scale)`);
console.log(`   • Location: ${northZoneAnalysis.risk.factors.location}`);
console.log(`   • Disruption: ${northZoneAnalysis.risk.factors.disruption}`);
console.log(`   • Combined: ${northZoneAnalysis.risk.factors.combined}`);
console.log("\n   Weather & Alerts:");
console.log(`   • ${northZoneAnalysis.risk.details.weatherCondition}`);
console.log(`   • ${northZoneAnalysis.risk.details.disruptionHistory}`);
if (northZoneAnalysis.risk.details.alerts.length > 0) {
  console.log(`   • Alerts: ${northZoneAnalysis.risk.details.alerts.join(", ")}`);
}

console.log("\n💰 PREMIUM CALCULATION:");
console.log(`   Base Price: ₹${northZoneAnalysis.premium.breakdown.basePrice}`);
console.log(`   Risk Adjustment: ₹${northZoneAnalysis.premium.breakdown.riskAdjustment}`);
console.log(`   Coverage Factor: ₹${northZoneAnalysis.premium.breakdown.coverageFactor}`);
console.log(`   Tier Multiplier: ${northZoneAnalysis.premium.breakdown.tierMultiplier}`);
console.log(`   Weekly Adjustment: ₹${northZoneAnalysis.premium.breakdown.weeklyAdjustment}`);
console.log(`   ────────────────────`);
console.log(`   FINAL PREMIUM: ₹${northZoneAnalysis.premium.premium}`);
console.log(`   Tier: ${northZoneAnalysis.premium.tier.name.toUpperCase()}`);
console.log(`   Weekly Factor: ${northZoneAnalysis.premium.weeklyAdjustment.seasonalFactor}`);
console.log(`   Reason: ${northZoneAnalysis.premium.weeklyAdjustment.reason}`);

console.log("\n📊 ANNUAL PRICING:");
console.log(`   Monthly Average: ₹${northZoneAnalysis.annual.monthlyPremium}`);
console.log(`   Annual Estimate: ₹${northZoneAnalysis.annual.annualPremium}`);

console.log("\n" + northZoneAnalysis.recommendation);

/**
 * ============================================================================
 * EXAMPLE 2: Compare All Zones
 * ============================================================================
 */

console.log("\n" + "=".repeat(80));
console.log("EXAMPLE 2: Zone Comparison for ₹600 Coverage");
console.log("=".repeat(80));

const comparison = RiskAndPremiumEngine.compareAllZones(600);

console.log("\n📋 ZONE-BY-ZONE COMPARISON:\n");
console.log(
  "Zone     | Risk Level | Risk Score | Weekly Factor | Premium | Annual"
);
console.log("-".repeat(72));

comparison.forEach((analysis) => {
  const zoneData = LOCATION_MASTER_DATA[analysis.zone];
  console.log(
    `${analysis.zone.padEnd(8)} | ${analysis.risk.riskLevel.padEnd(10)} | ${String(analysis.risk.riskScore).padEnd(10)} | ${String(analysis.premium.weeklyAdjustment.seasonalFactor).padEnd(13)} | ₹${String(analysis.premium.premium).padEnd(6)} | ₹${analysis.annual.annualPremium}`
  );
});

/**
 * ============================================================================
 * EXAMPLE 3: Tier Comparison for Same Zone
 * ============================================================================
 */

console.log("\n" + "=".repeat(80));
console.log("EXAMPLE 3: Coverage Tier Comparison for South Zone");
console.log("=".repeat(80));

const tierComparison = EnhancedPremiumEngine.compareTiers("south");

console.log("\n📊 PRICING BY COVERAGE TIER:\n");
console.log("Coverage | Tier       | Premium | Risk Level | Factors (W/L/D)");
console.log("-".repeat(72));

tierComparison.forEach((result) => {
  const factorsStr =
    `${result.factors.weather.toFixed(2)}/${result.factors.location.toFixed(2)}/${result.factors.disruption.toFixed(2)}`;
  console.log(
    `₹${String(600 + tierComparison.indexOf(result) * 100).padEnd(7)} | ${String(result.tier).padEnd(10)} | ₹${String(result.premium).padEnd(6)} | ${String(result.riskLevel).padEnd(10)} | ${factorsStr}`
  );
});

/**
 * ============================================================================
 * EXAMPLE 4: Different Coverage Amounts & Risk Impact
 * ============================================================================
 */

console.log("\n" + "=".repeat(80));
console.log("EXAMPLE 4: Impact of Coverage Amount on Premium (East Zone)");
console.log("=".repeat(80));

const coverageAmounts = [100, 250, 500, 750, 1000];
console.log("\nCoverage | Base Price | Risk Adjustment | Final Premium | ₹ per Unit");
console.log("-".repeat(72));

coverageAmounts.forEach((coverage) => {
  const premium = EnhancedPremiumEngine.calculatePremium("east", coverage);
  const perUnit = Math.round((premium.premium / coverage) * 100) / 100;
  console.log(
    `₹${String(coverage).padEnd(7)} | ₹${String(premium.breakdown.basePrice).padEnd(10)} | ₹${String(premium.breakdown.riskAdjustment).padEnd(15)} | ₹${String(premium.premium).padEnd(13)} | ₹${perUnit}`
  );
});

/**
 * ============================================================================
 * EXAMPLE 5: Annual Premium Breakdown
 * ============================================================================
 */

console.log("\n" + "=".repeat(80));
console.log("EXAMPLE 5: Annual Premium Breakdown (West Zone, ₹400 Coverage)");
console.log("=".repeat(80));

const annual = EnhancedPremiumEngine.calculateAnnualPremium("west", 400);

console.log(`\nMonthly Average Premium: ₹${annual.monthlyPremium}`);
console.log(`Annual Estimated Cost: ₹${annual.annualPremium}`);
console.log(
  `\nSeasonal Impact: Premium varies throughout the year due to weather patterns`
);
console.log(`  • Low: ₹${Math.round(annual.monthlyPremium * 0.85 * 100) / 100} (winter, low season)`);
console.log(`  • Medium: ₹${annual.monthlyPremium} (average)`);
console.log(`  • High: ₹${Math.round(annual.monthlyPremium * 1.25 * 100) / 100} (monsoon, peak season)`);

/**
 * ============================================================================
 * EXAMPLE 6: Complete JSON Response Format
 * ============================================================================
 */

console.log("\n" + "=".repeat(80));
console.log("EXAMPLE 6: Complete JSON API Response");
console.log("=".repeat(80));

const jsonResponse = RiskAndPremiumEngine.analyzeZone("south", 450);

console.log(
  "\nJSON Response for API Endpoint: /api/v1/premium/analyze?zone=south&coverage=450"
);
console.log(JSON.stringify(jsonResponse, null, 2));

/**
 * ============================================================================
 * EXAMPLE 7: Risk by Zone Details
 * ============================================================================
 */

console.log("\n" + "=".repeat(80));
console.log("EXAMPLE 7: Detailed Risk Assessment by Zone");
console.log("=".repeat(80));

Object.keys(LOCATION_MASTER_DATA).forEach((zone) => {
  console.log(`\n📍 ${zone.toUpperCase()} (${LOCATION_MASTER_DATA[zone].city})`);
  console.log("-".repeat(40));

  const riskAssessment = EnhancedRiskEngine.assessRisk(zone);

  console.log(`Risk Level: ${riskAssessment.riskLevel} (${riskAssessment.riskScore}/100)`);
  console.log("\nFactor Breakdown:");
  console.log(`  Weather: ${riskAssessment.factors.weather} (35% weight)`);
  console.log(`  Location: ${riskAssessment.factors.location} (35% weight)`);
  console.log(`  Disruption: ${riskAssessment.factors.disruption} (30% weight)`);
  console.log("\nDetails:");
  console.log(`  ${riskAssessment.details.weatherCondition}`);
  console.log(`  ${riskAssessment.details.disruptionHistory}`);
});

/**
 * ============================================================================
 * EXAMPLE 8: Lowest and Highest Premium Zones
 * ============================================================================
 */

console.log("\n" + "=".repeat(80));
console.log("EXAMPLE 8: Best and Worst Zones for Insurance (₹500 Coverage)");
console.log("=".repeat(80));

const allAnalysis = RiskAndPremiumEngine.compareAllZones(500);
const sortedByPremium = [...allAnalysis].sort(
  (a, b) => a.premium.premium - b.premium.premium
);

console.log("\n✅ BEST RATES:");
console.log(
  `Zone: ${sortedByPremium[0].zone} | Premium: ₹${sortedByPremium[0].premium.premium} | Risk: ${sortedByPremium[0].risk.riskLevel}`
);

console.log("\n❌ HIGHEST RATES:");
console.log(
  `Zone: ${sortedByPremium[sortedByPremium.length - 1].zone} | Premium: ₹${sortedByPremium[sortedByPremium.length - 1].premium.premium} | Risk: ${sortedByPremium[sortedByPremium.length - 1].risk.riskLevel}`
);

const priceDifference =
  sortedByPremium[sortedByPremium.length - 1].premium.premium -
  sortedByPremium[0].premium.premium;
const percentDiff = Math.round((priceDifference / sortedByPremium[0].premium.premium) * 100);

console.log(
  `\nPrice Difference: ₹${Math.round(priceDifference * 100) / 100} (${percentDiff}% higher in worst zone)`
);

/**
 * ============================================================================
 * EXAMPLE 9: Structured JSON Response Format (as per requirements)
 * ============================================================================
 */

console.log("\n" + "=".repeat(80));
console.log("EXAMPLE 9: Structured JSON Response (As Per Requirements)");
console.log("=".repeat(80));

const structuredResponse = (() => {
  const analysis = RiskAndPremiumEngine.analyzeZone("north", 500);
  return {
    riskLevel: analysis.risk.riskLevel,
    premium: analysis.premium.premium,
    factors: {
      weather: analysis.risk.factors.weather,
      location: analysis.risk.factors.location,
      disruption: analysis.risk.factors.disruption,
    },
    riskScore: analysis.risk.riskScore,
    tier: analysis.premium.tier.name,
    weeklyFactor: analysis.premium.weeklyAdjustment.seasonalFactor,
    breakdown: analysis.premium.breakdown,
    location: {
      zone: analysis.zone,
      city: LOCATION_MASTER_DATA[analysis.zone].city,
    },
    annual: analysis.annual,
  };
})();

console.log("\nAPI Response Structure:");
console.log(JSON.stringify(structuredResponse, null, 2));

/**
 * ============================================================================
 * EXPORT FOR API HANDLERS
 * ============================================================================
 */

export { RiskAndPremiumEngine, EnhancedRiskEngine, EnhancedPremiumEngine };
