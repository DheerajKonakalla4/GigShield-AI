import { NextRequest, NextResponse } from "next/server";
import { EnhancedRiskEngine } from "@/backend/engines/enhanced-risk-premium";

/**
 * GET /api/risk/assess?zone=<zone>
 *
 * Description: Returns risk assessment for a specific zone
 * Query Params:
 *   - zone: string (north, south, east, west)
 *
 * Response:
 *   - riskLevel: LOW | MEDIUM | HIGH | CRITICAL
 *   - riskScore: 0-100
 *   - factors: {location, weather, disruption, combined} (0-1)
 *   - details: {locationName, weatherCondition, disruptionHistory, alerts}
 *
 * Example: /api/risk/assess?zone=north
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone") || "north";

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

    // Get risk assessment
    const riskAssessment = EnhancedRiskEngine.assessRisk(zone);

    // Format response
    return NextResponse.json(
      {
        success: true,
        data: {
          zone,
          riskLevel: riskAssessment.riskLevel,
          riskScore: riskAssessment.riskScore,
          factors: {
            weather: riskAssessment.factors.weather,
            location: riskAssessment.factors.location,
            disruption: riskAssessment.factors.disruption,
            combined: riskAssessment.factors.combined,
          },
          details: riskAssessment.details,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API] Risk Assessment Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to assess risk",
      },
      { status: 500 }
    );
  }
}
