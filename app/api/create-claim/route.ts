/**
 * Create Claim API Route
 * File: app/api/create-claim/route.ts
 *
 * POST: Create a new claim (manual or from trigger)
 * GET: Auto-process pending claims
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getClaimsEngine,
} from "@/backend/engines/claims-engine";
import { getTriggerEngine } from "@/backend/engines/trigger-engine";

let claimsEngine = getClaimsEngine();
let triggerEngine = getTriggerEngine();

/**
 * POST /api/create-claim
 * Creates a new claim
 *
 * Body:
 * - source: "trigger" | "manual"
 * - triggerId?: ID of trigger (if source=trigger)
 * - userId?: ID of policy holder (if source=manual)
 * - zone?: Zone (if source=manual)
 * - coverageAmount?: Coverage amount
 * - disruptionDuration?: Duration in hours
 * - riskLevel?: Risk level
 * - description?: Description
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, triggerId, userId, coverageAmount, disruptionDuration, riskLevel, description } = body;

    if (!source) {
      return NextResponse.json(
        { success: false, error: "Source is required (trigger or manual)" },
        { status: 400 }
      );
    }

    let claim;

    if (source === "trigger") {
      if (!triggerId) {
        return NextResponse.json(
          { success: false, error: "triggerId is required for trigger-based claims" },
          { status: 400 }
        );
      }

      // Get trigger from trigger engine
      const allTriggers = triggerEngine.detectionEngine.getActiveTriggers();
      const trigger = allTriggers.find((t) => t.id === triggerId);

      if (!trigger) {
        return NextResponse.json(
          { success: false, error: "Trigger not found" },
          { status: 404 }
        );
      }

      // Create claim from trigger
      claim = claimsEngine.createClaimFromTrigger(trigger, userId);
    } else if (source === "manual") {
      if (!userId || !coverageAmount || !disruptionDuration || !riskLevel) {
        return NextResponse.json(
          {
            success: false,
            error: "Manual claim requires: userId, coverageAmount, disruptionDuration, riskLevel",
          },
          { status: 400 }
        );
      }

      claim = claimsEngine.createManualClaim(
        userId,
        coverageAmount,
        disruptionDuration,
        riskLevel,
        description || "Manual claim"
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid source. Use 'trigger' or 'manual'" },
        { status: 400 }
      );
    }

    // Format response
    const formattedClaim = {
      id: claim.id,
      userId: claim.userId,
      userName: claim.user?.name,
      userEmail: claim.user?.email,
      triggerId: claim.triggerId,
      status: claim.status,
      reason: claim.reason,
      zone: claim.zone,
      coverageAmount: claim.coverageAmount,
      disruptionDuration: claim.disruptionDuration,
      riskLevel: claim.riskLevel,
      disruptionFactor: claim.disruptionFactor,
      riskMultiplier: claim.riskMultiplier,
      payoutAmount: claim.payoutAmount,
      description: claim.description,
      createdAt: claim.createdAt.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          claim: formattedClaim,
          message: `Claim ${claim.id} created successfully`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating claim:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create claim",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/create-claim
 * Trigger auto-processing of pending claims
 */
export async function GET(request: NextRequest) {
  try {
    // Run auto-processing
    const results = claimsEngine.autoProcessClaims();

    // Get updated statistics
    const statistics = claimsEngine.getStatistics();

    return NextResponse.json(
      {
        success: true,
        action: "auto-process",
        data: {
          processed: results.processed,
          approved: results.approved,
          paid: results.paid,
          statistics,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in auto-process:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to auto-process claims",
      },
      { status: 500 }
    );
  }
}
