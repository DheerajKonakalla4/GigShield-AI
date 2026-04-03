import { NextRequest, NextResponse } from "next/server";
import { RiskAndPremiumEngine } from "@/backend/engines/enhanced-risk-premium";

/**
 * GET /api/premium/compare-zones?coverage=<amount>
 *
 * Description: Compare premium prices across all 4 zones for a given coverage amount
 * Query Params:
 *   - coverage: number (100-1000) - REQUIRED
 *
 * Response: Array of zone comparisons
 *   - zone: string
 *   - riskLevel: LOW | MEDIUM | HIGH | CRITICAL
 *   - riskScore: 0-100
 *   - premium: number (monthly premium in ₹)
 *   - annualCost: number (yearly premium in ₹)
 *   - monthlyAverage: number (average monthly premium in ₹)
 *   - recommendation: string
 *
 * Example: /api/premium/compare-zones?coverage=500
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coverage = searchParams.get("coverage");

    // Validation
    if (!coverage) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: coverage",
        },
        { status: 400 }
      );
    }

    const coverageNum = Number(coverage);
    if (
      isNaN(coverageNum) ||
      coverageNum < 100 ||
      coverageNum > 1000
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Coverage must be a number between 100 and 1000",
        },
        { status: 400 }
      );
    }

    // Compare all zones
    const comparison = RiskAndPremiumEngine.compareAllZones(coverageNum);

    // Sort by premium (ascending)
    const sorted = [...comparison].sort(
      (a, b) => a.premium.premium - b.premium.premium
    );

    // Format response
    const data = sorted.map((item, index) => ({
      rank: index + 1,
      zone: item.zone,
      riskLevel: item.risk.riskLevel,
      riskScore: Math.round(item.risk.riskScore),
      premium: Math.round(item.premium.premium * 100) / 100,
      monthlyAverage:
        Math.round(item.annual.monthlyPremium * 100) / 100,
      annualCost: Math.round(item.annual.annualPremium * 100) / 100,
      factors: {
        weather: Math.round(item.risk.factors.weather * 100) / 100,
        location: Math.round(item.risk.factors.location * 100) / 100,
        disruption: Math.round(item.risk.factors.disruption * 100) / 100,
      },
      recommendation: item.recommendation,
    }));

    // Calculate statistics
    const premiums = data.map((d) => d.premium);
    const stats = {
      cheapest: Math.min(...premiums),
      mostExpensive: Math.max(...premiums),
      average: Math.round((premiums.reduce((a, b) => a + b) / premiums.length) * 100) / 100,
      difference:
        Math.round((Math.max(...premiums) - Math.min(...premiums)) * 100) / 100,
    };

    return NextResponse.json(
      {
        success: true,
        data,
        statistics: {
          coverage: coverageNum,
          lowestZone: data[0].zone,
          highestZone: data[data.length - 1].zone,
          priceRange: `₹${stats.cheapest} - ₹${stats.mostExpensive}`,
          average: `₹${stats.average}`,
          savingsRange: `₹0 - ₹${stats.difference} (vs highest)`,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API] Zone Comparison Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to compare zones",
      },
      { status: 500 }
    );
  }
}
