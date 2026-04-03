import { NextRequest, NextResponse } from "next/server";
import { EnhancedPremiumEngine } from "@/backend/engines/enhanced-risk-premium";

/**
 * GET /api/premium/annual?zone=<zone>&coverage=<amount>
 *
 * Description: Calculate annual premium estimate with seasonal breakdown
 * Query Params:
 *   - zone: string (north, south, east, west) - REQUIRED
 *   - coverage: number (100-1000) - REQUIRED
 *
 * Response:
 *   - zone: string
 *   - coverage: number
 *   - monthlyPremium: number (average monthly premium)
 *   - annualEstimate: number (total annual premium)
 *   - costBreakdown: {minMonthly, avgMonthly, maxMonthly}
 *   - seasonalBreakdown: {season name, weeks, factor range, cost range}
 *
 * Example: /api/premium/annual?zone=north&coverage=500
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

    // Calculate annual premium
    const annual = EnhancedPremiumEngine.calculateAnnualPremium(
      zone,
      coverageNum
    );

    // Calculate seasonal breakdown
    const seasonalBreakdown = {
      winter: {
        name: "Winter (Dec-Feb)",
        weeks: "1-8, 52",
        factor: "0.85",
        cost: Math.round(
          (annual.monthlyPremium / 4 * 0.85) * 100
        ) / 100,
      },
      spring: {
        name: "Spring (Mar-May)",
        weeks: "9-21",
        factor: "0.95-1.2",
        cost: `${Math.round((annual.monthlyPremium / 4 * 0.95) * 100) / 100} - ${Math.round((annual.monthlyPremium / 4 * 1.2) * 100) / 100}`,
      },
      summer: {
        name: "Summer Peak (Jun-Aug)",
        weeks: "22-34",
        factor: "1.15-1.25",
        cost: `${Math.round((annual.monthlyPremium / 4 * 1.15) * 100) / 100} - ${Math.round((annual.monthlyPremium / 4 * 1.25) * 100) / 100}`,
      },
      autumn: {
        name: "Autumn (Sep-Nov)",
        weeks: "35-46",
        factor: "0.85-1.05",
        cost: `${Math.round((annual.monthlyPremium / 4 * 0.85) * 100) / 100} - ${Math.round((annual.monthlyPremium / 4 * 1.05) * 100) / 100}`,
      },
    };

    // Calculate cost ranges
    const minMonthly =
      Math.round(annual.monthlyPremium * 0.85 * 100) / 100;
    const maxMonthly =
      Math.round(annual.monthlyPremium * 1.25 * 100) / 100;
    const avgMonthly = Math.round(annual.monthlyPremium * 100) / 100;

    // Format response
    return NextResponse.json(
      {
        success: true,
        data: {
          zone,
          coverage: coverageNum,
          premium: {
            monthlyAverage: avgMonthly,
            annualEstimate: Math.round(annual.annualPremium * 100) / 100,
          },
          costBreakdown: {
            minimumMonthly:
              `₹${minMonthly} (winter low, ~0.85x)`,
            averageMonthly: `₹${avgMonthly}`,
            maximumMonthly:
              `₹${maxMonthly} (monsoon peak, ~1.25x)`,
            range: `₹${minMonthly} - ₹${maxMonthly}`,
          },
          seasonalBreakdown,
          estimatedCosts: {
            perMonth: avgMonthly,
            perQuarter: Math.round(avgMonthly * 3 * 100) / 100,
            perYear: Math.round(annual.annualPremium * 100) / 100,
          },
          paymentOptions: [
            {
              frequency: "Monthly",
              amount: avgMonthly,
              total: Math.round(annual.annualPremium * 100) / 100,
              frequency_id: "monthly",
            },
            {
              frequency: "Quarterly (3 months)",
              amount: Math.round(avgMonthly * 3 * 100) / 100,
              total: Math.round(annual.annualPremium * 100) / 100,
              frequency_id: "quarterly",
            },
            {
              frequency: "Half-Yearly (6 months)",
              amount: Math.round(avgMonthly * 6 * 100) / 100,
              total: Math.round(annual.annualPremium * 100) / 100,
              frequency_id: "semi_annual",
              discount: "5% savings vs monthly",
            },
            {
              frequency: "Annual (Upfront)",
              amount: Math.round(annual.annualPremium * 100) / 100,
              total: Math.round(annual.annualPremium * 100) / 100,
              frequency_id: "annual",
              discount: "10% savings vs monthly",
            },
          ],
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API] Annual Premium Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to calculate annual premium",
      },
      { status: 500 }
    );
  }
}
