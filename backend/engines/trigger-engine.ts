/**
 * Trigger Engine - Real-time Disruption Detection System
 * File: backend/engines/trigger-engine.ts
 *
 * Features:
 * - Simulates external data sources (Weather, AQI, Curfew)
 * - Event-based detection system
 * - Real-time trigger management
 * - Affected user tracking
 * - Active trigger storage
 */

import { EventEmitter } from "events";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type TriggerType =
  | "RAIN_ALERT"
  | "HEAT_ALERT"
  | "AQI_ALERT"
  | "CURFEW_ALERT"
  | "FLOOD_ALERT"
  | "EXTREME_WEATHER";

export type TriggerSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ExternalDataSource {
  timestamp: Date;
  zone: string;
  value: number;
  unit: string;
  status: "NORMAL" | "WARNING" | "CRITICAL";
}

export interface WeatherData extends ExternalDataSource {
  type: "RAINFALL" | "TEMPERATURE" | "HUMIDITY";
  value: number; // mm for rain, °C for temp
  trend: number; // -1: decreasing, 0: stable, 1: increasing
}

export interface PollutionData extends ExternalDataSource {
  type: "AQI";
  value: number; // 0-500
  category: "GOOD" | "SATISFACTORY" | "MODERATELY_POLLUTED" | "POORLY_POLLUTED" | "SEVERELY_POLLUTED";
}

export interface CurfewData extends ExternalDataSource {
  type: "CURFEW";
  startTime: Date;
  endTime: Date;
  reason: string;
  severity: TriggerSeverity;
}

export interface Trigger {
  id: string;
  type: TriggerType;
  zone: string;
  severity: TriggerSeverity;
  createdAt: Date;
  activatedAt: Date;
  reason: string;
  affectedUsers: number;
  data: any;
  isActive: boolean;
  resolvedAt?: Date;
}

export interface TriggerEvent {
  trigger: Trigger;
  affectedZones: string[];
  impactSummary: string;
  recommendedActions: string[];
}

// ============================================================================
// THRESHOLD CONFIGURATION
// ============================================================================

export const TRIGGER_THRESHOLDS = {
  RAIN_ALERT: {
    min: 5, // mm in 30 minutes
    max: 50,
    severity: "HIGH" as TriggerSeverity,
  },
  HEAT_ALERT: {
    min: 38, // °C
    max: 50,
    severity: "HIGH" as TriggerSeverity,
  },
  AQI_ALERT: {
    min: 200, // AQI value
    max: 500,
    severity: "CRITICAL" as TriggerSeverity,
  },
  FLOOD_ALERT: {
    min: 100, // mm
    max: 500,
    severity: "CRITICAL" as TriggerSeverity,
  },
  CURFEW_ALERT: {
    severity: "MEDIUM" as TriggerSeverity,
  },
};

// ============================================================================
// EXTERNAL DATA SOURCE SIMULATOR
// ============================================================================

export class ExternalDataSimulator {
  private zones = ["north", "south", "east", "west"];

  /**
   * Simulate weather data from external source
   */
  simulateWeatherData(): WeatherData[] {
    return this.zones.map((zone) => {
      const rainfall = Math.random() * 60; // 0-60mm
      const isIncreasing = Math.random() > 0.5;

      return {
        timestamp: new Date(),
        zone,
        type: Math.random() > 0.5 ? "RAINFALL" : "TEMPERATURE",
        value: rainfall,
        unit: "mm",
        trend: isIncreasing ? 1 : -1,
        status:
          rainfall > TRIGGER_THRESHOLDS.RAIN_ALERT.min
            ? "WARNING"
            : "NORMAL",
      };
    });
  }

  /**
   * Simulate pollution data from external source
   */
  simulatePollutionData(): PollutionData[] {
    return this.zones.map((zone) => {
      const aqi = Math.random() * 500; // 0-500 AQI

      let category: PollutionData["category"];
      if (aqi <= 50) category = "GOOD";
      else if (aqi <= 100) category = "SATISFACTORY";
      else if (aqi <= 200) category = "MODERATELY_POLLUTED";
      else if (aqi <= 300) category = "POORLY_POLLUTED";
      else category = "SEVERELY_POLLUTED";

      return {
        timestamp: new Date(),
        zone,
        type: "AQI",
        value: aqi,
        unit: "AQI",
        category,
        status:
          aqi > TRIGGER_THRESHOLDS.AQI_ALERT.min ? "CRITICAL" : "NORMAL",
      };
    });
  }

  /**
   * Simulate curfew events
   */
  simulateCurfewData(): CurfewData[] {
    // 20% chance of curfew event
    if (Math.random() < 0.2) {
      const zone = this.zones[Math.floor(Math.random() * this.zones.length)];
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 8 * 60 * 60 * 1000); // 8 hour curfew

      return [
        {
          timestamp: new Date(),
          zone,
          type: "CURFEW",
          value: 1,
          unit: "event",
          startTime,
          endTime,
          reason: "Security Alert",
          severity: "MEDIUM",
          status: "WARNING",
        },
      ];
    }
    return [];
  }
}

// ============================================================================
// TRIGGER DETECTION ENGINE
// ============================================================================

export class TriggerDetectionEngine {
  private simulator = new ExternalDataSimulator();
  private activeTriggers = new Map<string, Trigger>();
  private triggerHistory: Trigger[] = [];
  private eventEmitter = new EventEmitter();

  /**
   * Detect triggers from external data sources
   */
  async detectTriggers(): Promise<Trigger[]> {
    const triggers: Trigger[] = [];

    // Check weather data
    const weatherData = this.simulator.simulateWeatherData();
    triggers.push(...this.checkWeatherTriggers(weatherData));

    // Check pollution data
    const pollutionData = this.simulator.simulatePollutionData();
    triggers.push(...this.checkPollutionTriggers(pollutionData));

    // Check curfew data
    const curfewData = this.simulator.simulateCurfewData();
    triggers.push(...this.checkCurfewTriggers(curfewData));

    return triggers;
  }

  /**
   * Check weather data for trigger conditions
   */
  private checkWeatherTriggers(weatherData: WeatherData[]): Trigger[] {
    const triggers: Trigger[] = [];

    weatherData.forEach((data) => {
      if (data.type === "RAINFALL") {
        // Heavy rain trigger
        if (data.value > TRIGGER_THRESHOLDS.RAIN_ALERT.min) {
          triggers.push(this.createTrigger("RAIN_ALERT", data.zone, data.value, "mm"));
        }

        // Flood alert if very heavy rain
        if (data.value > TRIGGER_THRESHOLDS.FLOOD_ALERT.min) {
          triggers.push(this.createTrigger("FLOOD_ALERT", data.zone, data.value, "mm"));
        }
      } else if (data.type === "TEMPERATURE") {
        // Heat alert
        if (data.value > TRIGGER_THRESHOLDS.HEAT_ALERT.min) {
          triggers.push(this.createTrigger("HEAT_ALERT", data.zone, data.value, "°C"));
        }

        // Extreme weather
        if (data.value > 45) {
          triggers.push(this.createTrigger("EXTREME_WEATHER", data.zone, data.value, "°C"));
        }
      }
    });

    return triggers;
  }

  /**
   * Check pollution data for trigger conditions
   */
  private checkPollutionTriggers(pollutionData: PollutionData[]): Trigger[] {
    const triggers: Trigger[] = [];

    pollutionData.forEach((data) => {
      if (data.value > TRIGGER_THRESHOLDS.AQI_ALERT.min) {
        triggers.push(this.createTrigger("AQI_ALERT", data.zone, data.value, "AQI"));
      }
    });

    return triggers;
  }

  /**
   * Check curfew data for trigger conditions
   */
  private checkCurfewTriggers(curfewData: CurfewData[]): Trigger[] {
    const triggers: Trigger[] = [];

    curfewData.forEach((data) => {
      triggers.push(
        this.createTrigger("CURFEW_ALERT", data.zone, 1, "event", {
          startTime: data.startTime,
          endTime: data.endTime,
          reason: data.reason,
        })
      );
    });

    return triggers;
  }

  /**
   * Create a new trigger
   */
  private createTrigger(
    type: TriggerType,
    zone: string,
    value: number,
    unit: string,
    additionalData?: any
  ): Trigger {
    const severity = this.calculateSeverity(type, value);
    const affectedUsers = this.calculateAffectedUsers(zone);

    const trigger: Trigger = {
      id: `trigger_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type,
      zone,
      severity,
      createdAt: new Date(),
      activatedAt: new Date(),
      reason: this.getTriggerReason(type, value, unit),
      affectedUsers,
      data: {
        value,
        unit,
        ...additionalData,
      },
      isActive: true,
    };

    return trigger;
  }

  /**
   * Calculate trigger severity based on value
   */
  private calculateSeverity(type: TriggerType, value: number): TriggerSeverity {
    switch (type) {
      case "RAIN_ALERT":
        if (value > 40) return "CRITICAL";
        if (value > 25) return "HIGH";
        return "MEDIUM";

      case "HEAT_ALERT":
        if (value > 45) return "CRITICAL";
        if (value > 42) return "HIGH";
        return "MEDIUM";

      case "AQI_ALERT":
        if (value > 400) return "CRITICAL";
        if (value > 300) return "HIGH";
        return "MEDIUM";

      case "FLOOD_ALERT":
        return "CRITICAL";

      case "CURFEW_ALERT":
        return "MEDIUM";

      case "EXTREME_WEATHER":
        return "CRITICAL";

      default:
        return "LOW";
    }
  }

  /**
   * Calculate affected user count based on zone
   */
  private calculateAffectedUsers(zone: string): number {
    const usersByZone: { [key: string]: number } = {
      north: 45000,
      south: 52000,
      east: 38000,
      west: 61000,
    };
    return usersByZone[zone] || 0;
  }

  /**
   * Get human-readable trigger reason
   */
  private getTriggerReason(type: TriggerType, value: number, unit: string): string {
    switch (type) {
      case "RAIN_ALERT":
        return `Heavy rainfall detected: ${value.toFixed(1)}${unit} in the last 30 minutes`;

      case "HEAT_ALERT":
        return `High temperature alert: ${value.toFixed(1)}${unit}`;

      case "AQI_ALERT":
        return `Poor air quality detected: AQI ${value.toFixed(0)}`;

      case "FLOOD_ALERT":
        return `Flood warning: Excessive rainfall of ${value.toFixed(1)}${unit}`;

      case "CURFEW_ALERT":
        return `Curfew imposed in the area`;

      case "EXTREME_WEATHER":
        return `Extreme weather conditions: ${value.toFixed(1)}${unit}`;

      default:
        return "Trigger detected";
    }
  }

  /**
   * Activate a trigger
   */
  activateTrigger(trigger: Trigger): void {
    if (!this.activeTriggers.has(trigger.id)) {
      this.activeTriggers.set(trigger.id, trigger);
      this.triggerHistory.push(trigger);

      // Emit event
      this.eventEmitter.emit("trigger:activated", trigger);
    }
  }

  /**
   * Resolve a trigger
   */
  resolveTrigger(triggerId: string): void {
    const trigger = this.activeTriggers.get(triggerId);
    if (trigger) {
      trigger.isActive = false;
      trigger.resolvedAt = new Date();
      this.eventEmitter.emit("trigger:resolved", trigger);
    }
  }

  /**
   * Get active triggers
   */
  getActiveTriggers(): Trigger[] {
    return Array.from(this.activeTriggers.values());
  }

  /**
   * Get triggers by zone
   */
  getTriggersByZone(zone: string): Trigger[] {
    return Array.from(this.activeTriggers.values()).filter((t) => t.zone === zone && t.isActive);
  }

  /**
   * Get trigger history
   */
  getTriggerHistory(): Trigger[] {
    return this.triggerHistory;
  }

  /**
   * Clear resolved triggers
   */
  clearResolvedTriggers(): void {
    const toDelete = Array.from(this.activeTriggers.entries())
      .filter(([_, trigger]) => !trigger.isActive)
      .map(([id, _]) => id);

    toDelete.forEach((id) => this.activeTriggers.delete(id));
  }

  /**
   * Get event emitter
   */
  getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }

  /**
   * Subscribe to trigger events
   */
  onTriggerActivated(callback: (trigger: Trigger) => void): void {
    this.eventEmitter.on("trigger:activated", callback);
  }

  /**
   * Subscribe to trigger resolution
   */
  onTriggerResolved(callback: (trigger: Trigger) => void): void {
    this.eventEmitter.on("trigger:resolved", callback);
  }

  /**
   * Get trigger statistics
   */
  getStatistics() {
    const activeTriggers = this.getActiveTriggers();
    const byType: { [key: string]: number } = {};
    const byZone: { [key: string]: number } = {};
    const bySeverity: { [key: string]: number } = {};

    activeTriggers.forEach((t) => {
      byType[t.type] = (byType[t.type] || 0) + 1;
      byZone[t.zone] = (byZone[t.zone] || 0) + 1;
      bySeverity[t.severity] = (bySeverity[t.severity] || 0) + 1;
    });

    return {
      totalActive: activeTriggers.length,
      totalHistorical: this.triggerHistory.length,
      byType,
      byZone,
      bySeverity,
      affectedUsers: activeTriggers.reduce((sum, t) => sum + t.affectedUsers, 0),
    };
  }
}

// ============================================================================
// EVENT BROKER (Pub/Sub System)
// ============================================================================

export class TriggerEventBroker {
  private subscribers: Map<TriggerType, Set<(event: TriggerEvent) => void>> = new Map();
  private globalSubscribers: Set<(event: TriggerEvent) => void> = new Set();
  private eventHistory: TriggerEvent[] = [];

  /**
   * Subscribe to specific trigger type
   */
  subscribe(triggerType: TriggerType, callback: (event: TriggerEvent) => void): void {
    if (!this.subscribers.has(triggerType)) {
      this.subscribers.set(triggerType, new Set());
    }
    this.subscribers.get(triggerType)!.add(callback);
  }

  /**
   * Subscribe to all trigger types
   */
  subscribeAll(callback: (event: TriggerEvent) => void): void {
    this.globalSubscribers.add(callback);
  }

  /**
   * Publish trigger event
   */
  publishTriggerEvent(trigger: Trigger, affectedZones: string[]): void {
    const event: TriggerEvent = {
      trigger,
      affectedZones,
      impactSummary: this.generateImpactSummary(trigger),
      recommendedActions: this.getRecommendedActions(trigger),
    };

    // Store in history
    this.eventHistory.push(event);

    // Publish to global subscribers
    this.globalSubscribers.forEach((callback) => callback(event));

    // Publish to type-specific subscribers
    const typeSubscribers = this.subscribers.get(trigger.type);
    if (typeSubscribers) {
      typeSubscribers.forEach((callback) => callback(event));
    }
  }

  /**
   * Generate impact summary
   */
  private generateImpactSummary(trigger: Trigger): string {
    return `${trigger.type} affecting ${trigger.zone}. ${trigger.affectedUsers.toLocaleString()} users impacted. Severity: ${trigger.severity}`;
  }

  /**
   * Get recommended actions
   */
  private getRecommendedActions(trigger: Trigger): string[] {
    const actions: { [key in TriggerType]?: string[] } = {
      RAIN_ALERT: [
        "Stay indoors during heavy rainfall",
        "Avoid travel if possible",
        "Check local drainage systems",
      ],
      HEAT_ALERT: [
        "Stay hydrated",
        "Avoid outdoor activities during peak heat",
        "Use air conditioning or seek cool shelter",
      ],
      AQI_ALERT: [
        "Use air purifiers",
        "Consider N95 masks if going outside",
        "Keep windows closed",
        "Reduce outdoor activities",
      ],
      FLOOD_ALERT: [
        "Move to higher ground",
        "Avoid flooded areas",
        "Have emergency kit ready",
        "Contact local authorities",
      ],
      CURFEW_ALERT: [
        "Stay indoors during curfew hours",
        "Have essential supplies",
        "Monitor official announcements",
      ],
      EXTREME_WEATHER: [
        "Seek immediate shelter",
        "Contact emergency services if needed",
        "Avoid all outdoor activities",
      ],
    };

    return actions[trigger.type] || ["Monitor situation closely"];
  }

  /**
   * Get event history
   */
  getEventHistory(): TriggerEvent[] {
    return this.eventHistory;
  }

  /**
   * Clear history (keep last 100 events)
   */
  pruneHistory(): void {
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(-100);
    }
  }
}

// ============================================================================
// MAIN TRIGGER ENGINE SINGLETON
// ============================================================================

let detectionEngine: TriggerDetectionEngine | null = null;
let eventBroker: TriggerEventBroker | null = null;

export function initializeTriggerEngine() {
  if (!detectionEngine) {
    detectionEngine = new TriggerDetectionEngine();
  }
  if (!eventBroker) {
    eventBroker = new TriggerEventBroker();
  }

  // Subscribe to detection engine events
  detectionEngine.onTriggerActivated((trigger) => {
    eventBroker!.publishTriggerEvent(trigger, getTriggerAffectedZones(trigger));
  });

  return { detectionEngine, eventBroker };
}

export function getTriggerEngine() {
  if (!detectionEngine || !eventBroker) {
    return initializeTriggerEngine();
  }
  return { detectionEngine, eventBroker };
}

/**
 * Get zones affected by a trigger
 */
function getTriggerAffectedZones(trigger: Trigger): string[] {
  // This zone is primary
  const affected = [trigger.zone];

  // Add adjacent zones based on trigger type and severity
  const zones = ["north", "south", "east", "west"];
  const adjacencyMap: { [key: string]: string[] } = {
    north: ["east", "west"],
    south: ["east", "west"],
    east: ["north", "south"],
    west: ["north", "south"],
  };

  if (
    trigger.severity === "CRITICAL" ||
    trigger.type === "FLOOD_ALERT" ||
    trigger.type === "EXTREME_WEATHER"
  ) {
    const adjacentZones = adjacencyMap[trigger.zone] || [];
    affected.push(...adjacentZones);
  }

  return affected;
}

/**
 * Simulate continuous trigger detection
 */
export async function startTriggerSimulation(interval: number = 30000) {
  const { detectionEngine } = getTriggerEngine();

  setInterval(async () => {
    const newTriggers = await detectionEngine.detectTriggers();
    newTriggers.forEach((trigger) => {
      detectionEngine.activateTrigger(trigger);
    });
  }, interval);
}

