import { NextRequest, NextResponse } from "next/server";
import { EnhancedPremiumEngine } from "@/backend/engines/enhanced-risk-premium";

/**
 * POST /api/premium/calculate
 *
 * Description: Calculate premium for a given zone and coverage amount
 * Request Body:
 *   - zone: string (north, south, east, west) - REQUIRED
 *   - coverage: number (100-1000) - REQUIRED
 *   - weekNumber?: number (1-52) - Optional, defaults to current week
 *
 * Response:
 *   - riskLevel: LOW | MEDIUM | HIGH | CRITICAL
 *   - premium: number (calculated premium in ₹)
 *   - breakdown: {basePrice, riskAdjustment, coverageFactor, tierMultiplier, weeklyAdjustment, finalPremium}
 *   - factors: {weather, location, disruption}
 *   - tier: {name, basePremium, coverageMin, coverageMax, features, riskMultiplier}
 *   - weeklyAdjustment: {week, seasonalFactor, reason}
 *
 * Example:
 * POST /api/premium/calculate
 * {
 *   "zone": "north",
 *   "coverage": 500
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { zone, coverage, weekNumber } = body;

    // Validation
    if (!zone) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: zone",
        },
        { status: 400 }
      );
    }

    if (!coverage) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: coverage",
        },
        { status: 400 }
      );
    }

    // Validate zone
    const validZones = ["north", "south", "east", "west"];
    if (!validZones.includes(zone)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid zone. Must be one of: ${validZones.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate coverage
    const coverageNum = Number(coverage);
    if (isNaN(coverageNum) || coverageNum < 100 || coverageNum > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "Coverage must be a number between 100 and 1000",
        },
        { status: 400 }
      );
    }

    // Calculate premium
    const premium = EnhancedPremiumEngine.calculatePremium(
      zone,
      coverageNum,
      weekNumber ? Number(weekNumber) : undefined
    );

    // Format response
    return NextResponse.json(
      {
        success: true,
        data: {
          zone,
          coverage: coverageNum,
          riskLevel: premium.riskLevel,
          premium: Math.round(premium.premium * 100) / 100, // Round to 2 decimals
          breakdown: {
            basePrice: Math.round(premium.breakdown.basePrice * 100) / 100,
            riskAdjustment:
              Math.round(premium.breakdown.riskAdjustment * 100) / 100,
            coverageFactor:
              Math.round(premium.breakdown.coverageFactor * 100) / 100,
            tierMultiplier:
              Math.round(premium.breakdown.tierMultiplier * 100) / 100,
            weeklyAdjustment:
              Math.round(premium.breakdown.weeklyAdjustment * 100) / 100,
            finalPremium:
              Math.round(premium.breakdown.finalPremium * 100) / 100,
          },
          factors: {
            weather: Math.round(premium.factors.weather * 100) / 100,
            location: Math.round(premium.factors.location * 100) / 100,
            disruption: Math.round(premium.factors.disruption * 100) / 100,
          },
          tier: {
            name: premium.tier.name,
            basePremium: premium.tier.basePremium,
            coverageRange: {
              min: premium.tier.coverageMin,
              max: premium.tier.coverageMax,
            },
            riskMultiplier: premium.tier.riskMultiplier,
          },
          weeklyAdjustment: {
            week: premium.weeklyAdjustment.week,
            seasonalFactor: premium.weeklyAdjustment.seasonalFactor,
            reason: premium.weeklyAdjustment.reason,
          },
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API] Premium Calculation Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to calculate premium",
      },
      { status: 500 }
    );
  }
}

/**
 * Alternative GET endpoint for simple calculations
 * GET /api/premium/calculate?zone=north&coverage=500
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone");
    const coverage = searchParams.get("coverage");

    if (!zone || !coverage) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing query parameters: zone and coverage required",
        },
        { status: 400 }
      );
    }

    // Reuse POST logic by converting to POST request body
    return POST(
      new NextRequest(request.url, {
        method: "POST",
        body: JSON.stringify({
          zone,
          coverage: Number(coverage),
        }),
      })
    );
  } catch (error: any) {
    console.error("[API] Premium Calculation Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to calculate premium",
      },
      { status: 500 }
    );
  }
}
