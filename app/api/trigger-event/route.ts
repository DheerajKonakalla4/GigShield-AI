import { NextRequest, NextResponse } from "next/server";
import {
  getTriggerEngine,
  initializeTriggerEngine,
  type Trigger,
  type TriggerType,
} from "@/backend/engines/trigger-engine";
import { getClaimsEngine } from "@/backend/engines/claims-engine";
import { getPremiumEngine } from "@/backend/engines/premium-engine";

// Initialize engines on module load
initializeTriggerEngine();

/**
 * POST /api/trigger-event
 *
 * Description: Create or detect trigger events
 * Request Body:
 *   - action: "detect" | "activate" | "resolve" | "simulate-rain" | "simulate-pollution" | "simulate-heatwave"
 *   - triggerId?: string (for resolve action)
 *   - zone?: string (optional, for filtering)
 *   - zoneOverride?: string
 *   - severity?: string
 *
 * Response:
 *   - triggers: Trigger[]
 *   - claimsGenerated: number (for simulate actions)
 *   - eventSummary: object
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, triggerId, zone, zoneOverride, severity } = body;

    const { detectionEngine, eventBroker } = getTriggerEngine();
    const claimsEngine = getClaimsEngine();
    const premiumEngine = getPremiumEngine();

    // ========== RAIN ALERT SIMULATION ==========
    if (action === "simulate-rain") {
      const triggerZone = zoneOverride || "north";
      const rainfallMM = Math.random() * 80 + 20; // 20-100mm (high precipitation)

      const trigger: Trigger = {
        id: `trigger_${Date.now()}_rain`,
        type: "RAIN_ALERT",
        zone: triggerZone,
        severity: severity || "HIGH",
        createdAt: new Date(),
        activatedAt: new Date(),
        reason: `Rainfall: ${rainfallMM.toFixed(1)}mm detected in ${triggerZone}`,
        affectedUsers: Math.floor(Math.random() * 30000) + 5000,
        data: { rainfall: rainfallMM, threshold: 10 },
        isActive: true,
      };

      // Activate trigger
      detectionEngine.activateTrigger(trigger);

      // Auto-generate claims for affected users
      const claims = [];
      const affectedUserCount = Math.floor(Math.random() * 15) + 3;
      for (let i = 0; i < affectedUserCount; i++) {
        try {
          const claim = claimsEngine.createClaimFromTrigger(trigger);
          claims.push(claim);
        } catch (err) {
          // Skip if user lookup fails
        }
      }

      // Get event summary
      const eventSummaries = claimsEngine.getEventSummaries();
      const eventSummary = eventSummaries[eventSummaries.length - 1];

      return NextResponse.json(
        {
          success: true,
          action: "simulate-rain",
          data: {
            trigger,
            claimsGenerated: claims.length,
            totalPayout: claims.reduce((sum, c) => sum + c.payoutAmount, 0),
            eventSummary,
            claims: claims.map((c) => ({
              id: c.id,
              userId: c.userId,
              status: c.status,
              payoutAmount: c.payoutAmount,
              isAutoProcessed: c.isAutoProcessed,
            })),
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // ========== POLLUTION ALERT SIMULATION ==========
    if (action === "simulate-pollution") {
      const triggerZone = zoneOverride || "east";
      const aqiValue = Math.random() * 150 + 350; // 350-500 (severe)

      const trigger: Trigger = {
        id: `trigger_${Date.now()}_aqi`,
        type: "AQI_ALERT",
        zone: triggerZone,
        severity: severity || "CRITICAL",
        createdAt: new Date(),
        activatedAt: new Date(),
        reason: `Air Quality Index: ${aqiValue.toFixed(0)} (Severe) in ${triggerZone}`,
        affectedUsers: Math.floor(Math.random() * 40000) + 8000,
        data: { aqi: aqiValue, threshold: 300 },
        isActive: true,
      };

      // Activate trigger
      detectionEngine.activateTrigger(trigger);

      // Auto-generate claims
      const claims = [];
      const affectedUserCount = Math.floor(Math.random() * 12) + 4;
      for (let i = 0; i < affectedUserCount; i++) {
        try {
          const claim = claimsEngine.createClaimFromTrigger(trigger);
          claims.push(claim);
        } catch (err) {
          // Skip if user lookup fails
        }
      }

      const eventSummaries = claimsEngine.getEventSummaries();
      const eventSummary = eventSummaries[eventSummaries.length - 1];

      return NextResponse.json(
        {
          success: true,
          action: "simulate-pollution",
          data: {
            trigger,
            claimsGenerated: claims.length,
            totalPayout: claims.reduce((sum, c) => sum + c.payoutAmount, 0),
            eventSummary,
            claims: claims.map((c) => ({
              id: c.id,
              userId: c.userId,
              status: c.status,
              payoutAmount: c.payoutAmount,
              isAutoProcessed: c.isAutoProcessed,
            })),
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // ========== HEATWAVE ALERT SIMULATION ==========
    if (action === "simulate-heatwave") {
      const triggerZone = zoneOverride || "west";
      const temperatureC = Math.random() * 10 + 42; // 42-52°C

      const trigger: Trigger = {
        id: `trigger_${Date.now()}_heat`,
        type: "HEAT_ALERT",
        zone: triggerZone,
        severity: severity || "HIGH",
        createdAt: new Date(),
        activatedAt: new Date(),
        reason: `Extreme Heat: ${temperatureC.toFixed(1)}°C in ${triggerZone}`,
        affectedUsers: Math.floor(Math.random() * 25000) + 3000,
        data: { temperature: temperatureC, threshold: 42 },
        isActive: true,
      };

      // Activate trigger
      detectionEngine.activateTrigger(trigger);

      // Auto-generate claims
      const claims = [];
      const affectedUserCount = Math.floor(Math.random() * 10) + 2;
      for (let i = 0; i < affectedUserCount; i++) {
        try {
          const claim = claimsEngine.createClaimFromTrigger(trigger);
          claims.push(claim);
        } catch (err) {
          // Skip if user lookup fails
        }
      }

      const eventSummaries = claimsEngine.getEventSummaries();
      const eventSummary = eventSummaries[eventSummaries.length - 1];

      return NextResponse.json(
        {
          success: true,
          action: "simulate-heatwave",
          data: {
            trigger,
            claimsGenerated: claims.length,
            totalPayout: claims.reduce((sum, c) => sum + c.payoutAmount, 0),
            eventSummary,
            claims: claims.map((c) => ({
              id: c.id,
              userId: c.userId,
              status: c.status,
              payoutAmount: c.payoutAmount,
              isAutoProcessed: c.isAutoProcessed,
            })),
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // ========== DETECT TRIGGERS ==========
    if (action === "detect") {
      // Detect new triggers from external data
      const newTriggers = await detectionEngine.detectTriggers();

      // Activate detected triggers
      newTriggers.forEach((trigger) => {
        detectionEngine.activateTrigger(trigger);
      });

      const activeTriggers = zone
        ? detectionEngine.getTriggersByZone(zone)
        : detectionEngine.getActiveTriggers();

      const totalAffected = activeTriggers.reduce((sum, t) => sum + t.affectedUsers, 0);

      return NextResponse.json(
        {
          success: true,
          action: "detect",
          data: {
            newTriggersDetected: newTriggers.length,
            activeTriggers: activeTriggers,
            totalAffected,
            statistics: detectionEngine.getStatistics(),
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // ========== ACTIVATE GENERIC TRIGGER ==========
    else if (action === "activate") {
      // Manually simulate a trigger
      const { type } = body;

      if (!type) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required field: type",
          },
          { status: 400 }
        );
      }

      // Create a manual trigger
      const zones = ["north", "south", "east", "west"];
      const triggerZone = zoneOverride || zones[Math.floor(Math.random() * zones.length)];
      const value = Math.random() * 100;

      const trigger: Trigger = {
        id: `trigger_${Date.now()}_manual`,
        type: type as TriggerType,
        zone: triggerZone,
        severity: (severity as any) || "HIGH",
        createdAt: new Date(),
        activatedAt: new Date(),
        reason: `Manual trigger: ${type}`,
        affectedUsers: Math.floor(Math.random() * 60000),
        data: { value, unit: "manual" },
        isActive: true,
      };

      detectionEngine.activateTrigger(trigger);

      return NextResponse.json(
        {
          success: true,
          action: "activate",
          data: {
            trigger,
            affectedUsers: trigger.affectedUsers,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // ========== RESOLVE TRIGGER ==========
    else if (action === "resolve") {
      // Resolve a trigger
      if (!triggerId) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required field: triggerId",
          },
          { status: 400 }
        );
      }

      detectionEngine.resolveTrigger(triggerId);

      return NextResponse.json(
        {
          success: true,
          action: "resolve",
          data: {
            triggerId,
            resolved: true,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Use: detect, activate, resolve, simulate-rain, simulate-pollution, or simulate-heatwave",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("[API] Trigger Event Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process trigger event",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/trigger-event?zone=<zone>&type=<type>
 *
 * Description: Get active triggers with optional filtering
 * Query Parameters:
 *   - zone?: string (north | south | east | west)
 *   - type?: string (RAIN_ALERT | HEAT_ALERT | AQI_ALERT | etc)
 *   - history?: boolean (get history instead of active)
 *
 * Response:
 *   - triggers: Trigger[]
 *   - statistics: object
 *   - timestamp: string
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone") || undefined;
    const type = searchParams.get("type") || undefined;
    const showHistory = searchParams.get("history") === "true";

    const { detectionEngine } = getTriggerEngine();

    let triggers = showHistory ? detectionEngine.getTriggerHistory() : detectionEngine.getActiveTriggers();

    // Apply filters
    if (zone) {
      triggers = triggers.filter((t) => t.zone === zone);
    }

    if (type) {
      triggers = triggers.filter((t) => t.type === type);
    }

    // Filter active only if not showing history
    if (!showHistory) {
      triggers = triggers.filter((t) => t.isActive);
    }

    const statistics = detectionEngine.getStatistics();

    return NextResponse.json(
      {
        success: true,
        data: {
          triggers,
          count: triggers.length,
          statistics,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API] Get Triggers Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to get triggers",
      },
      { status: 500 }
    );
  }
}
