/**
 * Trigger Engine Utilities
 * File: backend/engines/trigger-utils.ts
 *
 * Helper functions for trigger management and formatting
 */

import { Trigger, TriggerType, TriggerSeverity } from "./trigger-engine";

/**
 * Format trigger for API response
 */
export function formatTriggerResponse(trigger: Trigger) {
  return {
    id: trigger.id,
    type: trigger.type,
    zone: trigger.zone,
    severity: trigger.severity,
    createdAt: trigger.createdAt.toISOString(),
    activatedAt: trigger.activatedAt.toISOString(),
    reason: trigger.reason,
    affectedUsers: trigger.affectedUsers,
    data: trigger.data,
    isActive: trigger.isActive,
    resolvedAt: trigger.resolvedAt?.toISOString(),
    age: getAgeInMinutes(trigger.activatedAt),
  };
}

/**
 * Get trigger age in minutes
 */
export function getAgeInMinutes(timestamp: Date): number {
  return Math.floor((Date.now() - timestamp.getTime()) / 60000);
}

/**
 * Get severity level color
 */
export function getSeverityColor(severity: TriggerSeverity): string {
  switch (severity) {
    case "LOW":
      return "yellow";
    case "MEDIUM":
      return "orange";
    case "HIGH":
      return "red";
    case "CRITICAL":
      return "darkred";
    default:
      return "gray";
  }
}

/**
 * Get severity level emoji
 */
export function getSeverityEmoji(severity: TriggerSeverity): string {
  switch (severity) {
    case "LOW":
      return "⚠️";
    case "MEDIUM":
      return "🟠";
    case "HIGH":
      return "🔴";
    case "CRITICAL":
      return "🚨";
    default:
      return "❓";
  }
}

/**
 * Get trigger type emoji
 */
export function getTriggerEmoji(type: TriggerType): string {
  switch (type) {
    case "RAIN_ALERT":
      return "🌧️";
    case "HEAT_ALERT":
      return "🔥";
    case "AQI_ALERT":
      return "💨";
    case "FLOOD_ALERT":
      return "🌊";
    case "CURFEW_ALERT":
      return "🚨";
    case "EXTREME_WEATHER":
      return "⛈️";
    default:
      return "❓";
  }
}

/**
 * Calculate impact score (0-100)
 */
export function calculateImpactScore(trigger: Trigger): number {
  let score = 0;

  // Severity weight (40%)
  const severityWeights: { [key in TriggerSeverity]: number } = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 100,
  };
  score += severityWeights[trigger.severity] * 0.4;

  // User impact weight (40%)
  const totalUsers = 196000; // Total in all zones
  const userImpactRatio = trigger.affectedUsers / totalUsers;
  score += userImpactRatio * 100 * 0.4;

  // Trigger type weight (20%)
  const typeWeights: { [key in TriggerType]: number } = {
    RAIN_ALERT: 50,
    HEAT_ALERT: 60,
    AQI_ALERT: 70,
    FLOOD_ALERT: 100,
    CURFEW_ALERT: 80,
    EXTREME_WEATHER: 95,
  };
  score += typeWeights[trigger.type] * 0.2;

  return Math.round(score);
}

/**
 * Get human-readable impact summary
 */
export function getImpactSummary(trigger: Trigger): string {
  const impactScore = calculateImpactScore(trigger);
  const affectedPercent = (
    (trigger.affectedUsers / 196000) *
    100
  ).toFixed(1);

  if (impactScore >= 80) {
    return `CRITICAL: Affecting ${affectedPercent}% of users (${trigger.affectedUsers.toLocaleString()})`;
  } else if (impactScore >= 60) {
    return `HIGH: Affecting ${affectedPercent}% of users (${trigger.affectedUsers.toLocaleString()})`;
  } else if (impactScore >= 40) {
    return `MEDIUM: Affecting ${affectedPercent}% of users (${trigger.affectedUsers.toLocaleString()})`;
  } else {
    return `LOW: Affecting ${affectedPercent}% of users (${trigger.affectedUsers.toLocaleString()})`;
  }
}

/**
 * Get recommended action for trigger
 */
export function getRecommendedAction(trigger: Trigger): string {
  switch (trigger.type) {
    case "RAIN_ALERT":
      return "Activate umbrella policies and weather-related coverage";
    case "HEAT_ALERT":
      return "Alert users to heat exhaustion risks; activate health coverage";
    case "AQI_ALERT":
      return "Issue air quality warnings; recommend indoor activities";
    case "FLOOD_ALERT":
      return "Trigger emergency protocols; prepare evacuation assistance";
    case "CURFEW_ALERT":
      return "Notify affected users of movement restrictions";
    case "EXTREME_WEATHER":
      return "Activate emergency response; provide disaster relief information";
    default:
      return "Monitor situation closely";
  }
}

/**
 * Group triggers by property
 */
export function groupTriggersBy(
  triggers: Trigger[],
  groupBy: "type" | "zone" | "severity"
): { [key: string]: Trigger[] } {
  const groups: { [key: string]: Trigger[] } = {};

  triggers.forEach((trigger) => {
    const key = trigger[groupBy] as string;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(trigger);
  });

  return groups;
}

/**
 * Sort triggers by priority
 */
export function sortTriggersByPriority(triggers: Trigger[]): Trigger[] {
  const severityOrder: { [key in TriggerSeverity]: number } = {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
  };

  return [...triggers].sort((a, b) => {
    // First by severity
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }

    // Then by affected users
    if (a.affectedUsers !== b.affectedUsers) {
      return b.affectedUsers - a.affectedUsers;
    }

    // Then by age (newest first)
    return (
      new Date(b.activatedAt).getTime() - new Date(a.activatedAt).getTime()
    );
  });
}

/**
 * Check if trigger needs immediate action
 */
export function needsImmediateAction(trigger: Trigger): boolean {
  return (
    trigger.severity === "CRITICAL" &&
    trigger.isActive &&
    getAgeInMinutes(trigger.activatedAt) < 30 // Less than 30 minutes old
  );
}

/**
 * Get trigger context message
 */
export function getTriggerContextMessage(trigger: Trigger): string {
  const age = getAgeInMinutes(trigger.activatedAt);
  const impactCount = trigger.affectedUsers.toLocaleString();

  let timeContext = "";
  if (age < 5) {
    timeContext = "just now";
  } else if (age < 60) {
    timeContext = `${age} minutes ago`;
  } else {
    const hours = Math.floor(age / 60);
    timeContext = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  return `${getSeverityEmoji(trigger.severity)} ${trigger.type} in ${trigger.zone.toUpperCase()} affecting ${impactCount} users - triggered ${timeContext}`;
}

/**
 * Calculate zone risk score based on active triggers
 */
export function calculateZoneRiskScore(triggers: Trigger[], zone: string): number {
  const zoneTriggers = triggers.filter((t) => t.zone === zone && t.isActive);

  if (zoneTriggers.length === 0) return 0;

  const severityScores: { [key in TriggerSeverity]: number } = {
    LOW: 10,
    MEDIUM: 25,
    HIGH: 50,
    CRITICAL: 100,
  };

  const totalScore = zoneTriggers.reduce(
    (sum, trigger) => sum + severityScores[trigger.severity],
    0
  );

  return Math.min(totalScore, 100); // Cap at 100
}

/**
 * Format trigger count message
 */
export function formatTriggerCountMessage(count: number): string {
  switch (count) {
    case 0:
      return "No active triggers - All systems normal ✅";
    case 1:
      return `1 active trigger detected ⚠️`;
    default:
      return `${count} active triggers detected 🚨`;
  }
}

/**
 * Check trigger overlap (triggers in same zone)
 */
export function checkTriggerOverlap(triggers: Trigger[]): Map<string, Trigger[]> {
  const overlapMap = new Map<string, Trigger[]>();

  triggers.forEach((trigger) => {
    const samezoneTriggersCount = triggers.filter(
      (t) => t.zone === trigger.zone && t.isActive
    ).length;

    if (samezoneTriggersCount > 1) {
      overlapMap.set(trigger.zone, triggers.filter((t) => t.zone === trigger.zone));
    }
  });

  return overlapMap;
}

/**
 * Generate trigger alert message for users
 */
export function generateUserAlertMessage(trigger: Trigger): {
  title: string;
  message: string;
  actionItems: string[];
} {
  switch (trigger.type) {
    case "RAIN_ALERT":
      return {
        title: "Heavy Rain Alert",
        message: `Heavy rainfall is expected in your area. Stay indoors if possible.`,
        actionItems: [
          "Check weather updates regularly",
          "Secure outdoor items",
          "Prepare umbrella and rain gear",
        ],
      };

    case "HEAT_ALERT":
      return {
        title: "Heat Alert",
        message: `Extreme heat conditions detected. Stay hydrated and avoid outdoor activities.`,
        actionItems: [
          "Drink plenty of water",
          "Use air conditioning",
          "Avoid peak sun hours (11 AM - 4 PM)",
        ],
      };

    case "AQI_ALERT":
      return {
        title: "Air Quality Alert",
        message: `Poor air quality detected in your area. Limit outdoor exposure.`,
        actionItems: [
          "Use N95 masks if going out",
          "Keep windows closed",
          "Use air purifiers",
        ],
      };

    case "FLOOD_ALERT":
      return {
        title: "Flood Warning",
        message: `Severe flooding risk in your area. Prepare for evacuation.`,
        actionItems: [
          "Have emergency kit ready",
          "Pack important documents",
          "Contact local authorities",
        ],
      };

    case "CURFEW_ALERT":
      return {
        title: "Curfew Imposed",
        message: `Curfew has been imposed in your area. Stay indoors during curfew hours.`,
        actionItems: [
          "Stay indoors during curfew",
          "Have emergency supplies",
          "Check official updates",
        ],
      };

    case "EXTREME_WEATHER":
      return {
        title: "Extreme Weather Warning",
        message: `Extreme weather conditions detected. Seek shelter immediately.`,
        actionItems: [
          "Move to shelter immediately",
          "Call emergency services if needed",
          "Stay away from windows",
        ],
      };

    default:
      return {
        title: "Alert",
        message:
          "An alert has been triggered in your area. Please stay alert.",
        actionItems: ["Monitor situation", "Follow official guidance"],
      };
  }
}

/**
 * Export triggers to CSV format
 */
export function exportTriggersToCSV(triggers: Trigger[]): string {
  const headers = [
    "ID",
    "Type",
    "Zone",
    "Severity",
    "Reason",
    "Affected Users",
    "Created At",
    "Activated At",
    "Status",
  ];

  const rows = triggers.map((t) => [
    t.id,
    t.type,
    t.zone,
    t.severity,
    t.reason,
    t.affectedUsers,
    t.createdAt.toISOString(),
    t.activatedAt.toISOString(),
    t.isActive ? "ACTIVE" : "RESOLVED",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell}"`).join(",")
    ),
  ].join("\n");

  return csvContent;
}
