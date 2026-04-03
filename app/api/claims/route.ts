/**
 * Claims API Routes
 * File: app/api/claims/route.ts
 *
 * GET: Fetch claims with optional filtering
 * POST: Create, update, or manage claims
 */

import { NextRequest, NextResponse } from "next/server";
import { getClaimsEngine, ClaimsEngine, Claim, ClaimStatus } from "@/backend/engines/claims-engine";

let claimsEngine: ClaimsEngine | null = null;

// Initialize engine on module load
if (!claimsEngine) {
  claimsEngine = getClaimsEngine();
}

/**
 * GET /api/claims
 * Query parameters:
 * - userId: Filter by user ID
 * - status: Filter by claim status
 * - zone: Filter by zone
 * - reason: Filter by claim reason
 * - history: Include full history
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const status = searchParams.get("status") as ClaimStatus | null;
    const zone = searchParams.get("zone");
    const reason = searchParams.get("reason");
    const includeHistory = searchParams.get("history") === "true";

    let claims: Claim[] = [];

    // Get claims based on filters
    if (userId) {
      claims = claimsEngine!.getUserClaims(userId);
    } else if (status) {
      claims = claimsEngine!.getClaimsByStatus(status);
    } else if (zone) {
      claims = claimsEngine!.getClaimsByZone(zone);
    } else {
      claims = claimsEngine!.getAllClaims();
    }

    // Additional filtering
    if (reason) {
      claims = claims.filter((c) => c.reason === reason);
    }

    // Sort by creation date (newest first)
    claims.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Format response
    const formattedClaims = claims.map((claim) => ({
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
      rejectionReason: claim.rejectionReason,
      createdAt: claim.createdAt.toISOString(),
      processingStartedAt: claim.processingStartedAt?.toISOString(),
      approvedAt: claim.approvedAt?.toISOString(),
      paidAt: claim.paidAt?.toISOString(),
      statusHistory: includeHistory
        ? claim.statusHistory.map((h) => ({
            status: h.status,
            timestamp: h.timestamp.toISOString(),
            notes: h.notes,
          }))
        : undefined,
    }));

    // Get statistics
    const statistics = claimsEngine!.getStatistics();

    return NextResponse.json(
      {
        success: true,
        data: {
          claims: formattedClaims,
          count: formattedClaims.length,
          statistics,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching claims:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch claims",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/claims
 * Actions:
 * - "approve": Approve a claim
 * - "reject": Reject a claim
 * - "pay": Pay a claim
 * - "update": Update claim status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, claimId, status, notes, reason } = body;

    if (!action || !claimId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: action, claimId",
        },
        { status: 400 }
      );
    }

    let claim;

    switch (action) {
      case "approve":
        claim = claimsEngine!.approveClaim(claimId, notes);
        if (!claim) {
          return NextResponse.json(
            { success: false, error: "Claim not found or cannot be approved" },
            { status: 404 }
          );
        }
        break;

      case "reject":
        if (!reason) {
          return NextResponse.json(
            { success: false, error: "Rejection reason is required" },
            { status: 400 }
          );
        }
        claim = claimsEngine!.rejectClaim(claimId, reason);
        if (!claim) {
          return NextResponse.json(
            { success: false, error: "Claim not found" },
            { status: 404 }
          );
        }
        break;

      case "pay":
        claim = claimsEngine!.payClaim(claimId, notes);
        if (!claim) {
          return NextResponse.json(
            { success: false, error: "Claim not found or cannot be paid" },
            { status: 404 }
          );
        }
        break;

      case "update":
        if (!status) {
          return NextResponse.json(
            { success: false, error: "Status is required" },
            { status: 400 }
          );
        }
        claim = claimsEngine!.updateClaimStatus(claimId, status, notes);
        if (!claim) {
          return NextResponse.json(
            { success: false, error: "Claim not found" },
            { status: 404 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    // Format response
    const formattedClaim = {
      id: claim.id,
      userId: claim.userId,
      userName: claim.user?.name,
      status: claim.status,
      reason: claim.reason,
      zone: claim.zone,
      payoutAmount: claim.payoutAmount,
      createdAt: claim.createdAt.toISOString(),
      statusHistory: claim.statusHistory.map((h) => ({
        status: h.status,
        timestamp: h.timestamp.toISOString(),
      })),
    };

    return NextResponse.json(
      {
        success: true,
        action,
        data: formattedClaim,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing claim:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process claim",
      },
      { status: 500 }
    );
  }
}
