/**
 * Submit Manual Claim API Route
 * File: app/api/submit-manual-claim/route.ts
 *
 * POST: Submit a new manual claim with fraud validation
 */

import { NextRequest, NextResponse } from "next/server";
import { getClaimsEngine } from "@/backend/engines/claims-engine";

const claimsEngine = getClaimsEngine();

/**
 * POST /api/submit-manual-claim
 * Submits a new manual claim
 *
 * Body:
 * - userId: ID of policy holder
 * - eventType: Type of event (Rain, Pollution, Heatwave, Other)
 * - zone: Zone where incident occurred
 * - dateOfIncident: Date of incident
 * - lostHours: Number of lost working hours
 * - description?: Optional description
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, eventType, zone, dateOfIncident, lostHours, description } = body;

    // Validate required fields
    if (!userId || !eventType || !zone || !dateOfIncident || !lostHours) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fraud validation
    const warnings: string[] = [];
    const user = claimsEngine.getUser(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check 1: Zone mismatch
    if (user.zone.toLowerCase() !== zone.toLowerCase()) {
      warnings.push(
        `⚠️ Zone mismatch: User zone is '${user.zone}' but incident zone is '${zone}'`
      );
    }

    // Check 2: Check for duplicate auto claims on same date
    const allClaims = claimsEngine.getAllClaims();
    const sameDateClaims = allClaims.filter((c) => {
      const claimDate = new Date(c.createdAt).toLocaleDateString();
      const incidentDate = new Date(dateOfIncident).toLocaleDateString();
      return c.userId === userId && claimDate === incidentDate && c.isAutoProcessed;
    });

    if (sameDateClaims.length > 0) {
      warnings.push(
        `⚠️ Possible duplicate: User already has ${sameDateClaims.length} auto-processed claim(s) on ${dateOfIncident}`
      );
    }

    // Check 3: Multiple manual claims in short window
    const userRecentClaims = allClaims.filter((c) => {
      const now = Date.now();
      const claimTime = new Date(c.createdAt).getTime();
      return c.userId === userId && now - claimTime < 3600000 && !c.isAutoProcessed; // 1 hour window
    });

    if (userRecentClaims.length > 1) {
      warnings.push(
        `⚠️ Multiple manual claims: ${userRecentClaims.length} manual claims submitted in the last hour`
      );
    }

    // Check 4: Invalid lost hours
    if (lostHours <= 0 || lostHours > 24) {
      return NextResponse.json(
        {
          success: false,
          error: "Lost hours must be between 0 and 24",
          warnings,
        },
        { status: 400 }
      );
    }

    // Calculate payout
    const dailyIncome = user.dailyIncome || 500; // Default to ₹500/day
    const workingHours = user.workingHours || 8; // Default to 8 hours/day
    const payoutAmount = (dailyIncome / workingHours) * lostHours;

    // Create manual claim
    const claim = {
      id: `claim_${Date.now()}_manual`,
      userId,
      user,
      status: "CREATED" as const,
      reason: `MANUAL_${eventType.toUpperCase()}_DISRUPTION` as any,
      zone,
      coverageAmount: user.coverage,
      disruptionDuration: lostHours,
      riskLevel: user.riskLevel || "MEDIUM",
      disruptionFactor: 1.0,
      riskMultiplier: 1.0,
      payoutAmount: Math.max(Math.min(payoutAmount, user.coverage * 0.8), 100), // Cap at 80% of coverage, minimum ₹100
      dailyIncome,
      lostHours,
      isAutoProcessed: false,
      isManualClaim: true,
      createdAt: new Date(),
      description: description || `Manual claim: ${eventType}`,
      fraudFlags: warnings.length > 0 ? warnings : undefined,
      statusHistory: [
        {
          status: "CREATED" as const,
          timestamp: new Date(),
          notes: "Manual claim created - Pending admin review",
        },
      ],
    };

    // Store claim in the claims engine
    claimsEngine.addManualClaim(claim as any);
    
    return NextResponse.json(
      {
        success: true,
        data: {
          claim,
        },
        warnings: warnings.length > 0 ? warnings : undefined,
        message: warnings.length > 0 
          ? `Claim submitted with ${warnings.length} warning(s). Admin review recommended.`
          : "Manual claim created successfully. Pending admin review.",
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API] Submit Manual Claim Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit manual claim",
      },
      { status: 500 }
    );
  }
}
