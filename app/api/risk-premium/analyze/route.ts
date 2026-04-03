import { NextRequest, NextResponse } from "next/server";
import { RiskAndPremiumEngine } from "@/backend/engines/enhanced-risk-premium";

/**
 * GET /api/risk-premium/analyze?zone=<zone>&coverage=<amount>
 *
 * Description: Get complete analysis combining risk assessment and premium calculation
 * Query Params:
 *   - zone: string (north, south, east, west) - REQUIRED
 *   - coverage: number (100-1000) - REQUIRED
 *
 * Response: Complete analysis object
 *   - zone: string
 *   - coverage: number
 *   - risk: {riskLevel, riskScore, factors}
 *   - premium: {premium, breakdown}
 *   - annual: {monthlyPremium, annualPremium, estimatedCost}
 *   - recommendation: string (human-readable insight)
 *
 * Example: /api/risk-premium/analyze?zone=north&coverage=500
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone");
    const coverage = searchParams.get("coverage");

    // Validation
    if (!zone) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: zone",
        },
        { status: 400 }
      );
    }

    if (!coverage) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: coverage",
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

    // Get full analysis
    const analysis = RiskAndPremiumEngine.analyzeZone(zone, coverageNum);

    // Format response
    const formattedData = {
      zone: analysis.zone,
      coverage: analysis.coverage,
      risk: {
        level: analysis.risk.riskLevel,
        score: Math.round(analysis.risk.riskScore),
        factors: {
          weather: Math.round(analysis.risk.factors.weather * 100) / 100,
          location: Math.round(analysis.risk.factors.location * 100) / 100,
          disruption: Math.round(analysis.risk.factors.disruption * 100) / 100,
          combined: Math.round(analysis.risk.factors.combined * 100) / 100,
        },
        details: analysis.risk.details,
      },
      premium: {
        amount: Math.round(analysis.premium.premium * 100) / 100,
        breakdown: {
          basePrice:
            Math.round(analysis.premium.breakdown.basePrice * 100) / 100,
          riskAdjustment:
            Math.round(analysis.premium.breakdown.riskAdjustment * 100) / 100,
          coverageFactor:
            Math.round(analysis.premium.breakdown.coverageFactor * 100) / 100,
          tierMultiplier:
            Math.round(analysis.premium.breakdown.tierMultiplier * 100) / 100,
          weeklyAdjustment:
            Math.round(analysis.premium.breakdown.weeklyAdjustment * 100) / 100,
          finalPremium:
            Math.round(analysis.premium.breakdown.finalPremium * 100) / 100,
        },
        tier: {
          name: analysis.premium.tier.name,
          basePremium: analysis.premium.tier.basePremium,
          coverageRange: {
            min: analysis.premium.tier.coverageMin,
            max: analysis.premium.tier.coverageMax,
          },
        },
        seasonalFactor: {
          week: analysis.premium.weeklyAdjustment.week,
          factor: analysis.premium.weeklyAdjustment.seasonalFactor,
          season: analysis.premium.weeklyAdjustment.reason,
        },
      },
      annual: {
        monthlyAverage:
          Math.round(analysis.annual.monthlyPremium * 100) / 100,
        annualEstimate:
          Math.round(analysis.annual.annualPremium * 100) / 100,
        estimatedCost: analysis.annual.estimatedCost,
      },
      recommendation: analysis.recommendation,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API] Risk Premium Analysis Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze risk and premium",
      },
      { status: 500 }
    );
  }
}

/**
 * Alternative POST endpoint for more complex analysis
 * Allows additional parameters and calculations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zone, coverage } = body;

    if (!zone || !coverage) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: zone, coverage",
        },
        { status: 400 }
      );
    }

    // Reuse GET logic
    return GET(
      new NextRequest(
        `${request.nextUrl.origin}/api/risk-premium/analyze?zone=${zone}&coverage=${coverage}`,
        {
          method: "GET",
        }
      )
    );
  } catch (error: any) {
    console.error("[API] Risk Premium Analysis Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze risk and premium",
      },
      { status: 500 }
    );
  }
}
