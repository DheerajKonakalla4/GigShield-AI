"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAutoRefreshTriggers,
  useActivateTrigger,
  useResolveTrigger,
  type Trigger,
} from "@/hooks/useTriggerEngine";
import { Button, Badge } from "@/components/design-system";

// Trigger type icons and colors
const TRIGGER_CONFIG: {
  [key: string]: {
    bgColor: string;
    borderColor: string;
    icon: string;
    label: string;
    color: string;
  };
} = {
  RAIN_ALERT: {
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
    icon: "🌧️",
    label: "Rain Alert",
    color: "text-blue-600 dark:text-blue-400",
  },
  HEAT_ALERT: {
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
    icon: "🔥",
    label: "Heat Alert",
    color: "text-orange-600 dark:text-orange-400",
  },
  AQI_ALERT: {
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
    icon: "💨",
    label: "Air Quality Alert",
    color: "text-red-600 dark:text-red-400",
  },
  FLOOD_ALERT: {
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
    icon: "🌊",
    label: "Flood Alert",
    color: "text-purple-600 dark:text-purple-400",
  },
  CURFEW_ALERT: {
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
    icon: "🚨",
    label: "Curfew Alert",
    color: "text-red-600 dark:text-red-400",
  },
  EXTREME_WEATHER: {
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
    icon: "⛈️",
    label: "Extreme Weather",
    color: "text-red-600 dark:text-red-400",
  },
};

/**
 * Individual Trigger Card Component
 */
function TriggerCard({
  trigger,
  onResolve,
}: {
  trigger: Trigger;
  onResolve: (id: string) => void;
}) {
  const config = TRIGGER_CONFIG[trigger.type] || TRIGGER_CONFIG.RAIN_ALERT;
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async () => {
    setIsResolving(true);
    await onResolve(trigger.id);
    setIsResolving(false);
  };

  const severityColors: {
    [key: string]: string;
  } = {
    LOW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    MEDIUM:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    CRITICAL: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200",
  };

  const timeAgo = Math.floor(
    (Date.now() - new Date(trigger.activatedAt).getTime()) / 60000
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`border-l-4 rounded-lg p-4 backdrop-blur-sm ${config.bgColor} ${config.borderColor} border`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3 flex-1">
          <div className="text-3xl">{config.icon}</div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-bold ${config.color}`}>{config.label}</h3>
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${severityColors[trigger.severity]}`}
              >
                {trigger.severity}
              </Badge>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {trigger.reason}
            </p>

            <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>📍 {trigger.zone.toUpperCase()}</span>
              <span>👥 {trigger.affectedUsers.toLocaleString()} users</span>
              <span>⏱️ {timeAgo}m ago</span>
            </div>

            {trigger.data.value && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Value:</strong> {trigger.data.value.toFixed(1)}{" "}
                  {trigger.data.unit}
                </p>
              </div>
            )}
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleResolve}
          disabled={isResolving}
          className="ml-2 whitespace-nowrap"
        >
          {isResolving ? "Resolving..." : "Resolve"}
        </Button>
      </div>

      {/* Animated background pulse */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-20"
        animate={{
          boxShadow: [
            "0 0 0 0px rgba(59, 130, 246, 0.5)",
            "0 0 0 10px rgba(59, 130, 246, 0)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ pointerEvents: "none" }}
      />
    </motion.div>
  );
}

/**
 * Statistics Overview Component
 */
function StatisticsOverview({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40 rounded-lg p-3 border border-red-200 dark:border-red-800"
      >
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          {stats?.totalActive || 0}
        </div>
        <div className="text-xs text-red-600/70 dark:text-red-400/70">
          Active Triggers
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg p-3 border border-blue-200 dark:border-blue-800"
      >
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {(stats?.affectedUsers || 0).toLocaleString()}
        </div>
        <div className="text-xs text-blue-600/70 dark:text-blue-400/70">
          Users Affected
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40 rounded-lg p-3 border border-orange-200 dark:border-orange-800"
      >
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {stats?.totalHistorical || 0}
        </div>
        <div className="text-xs text-orange-600/70 dark:text-orange-400/70">
          Total Events
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 rounded-lg p-3 border border-purple-200 dark:border-purple-800"
      >
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {Object.keys(stats?.bySeverity || {}).length}
        </div>
        <div className="text-xs text-purple-600/70 dark:text-purple-400/70">
          Severity Levels
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Main Trigger Dashboard Component
 */
export default function TriggerDashboard() {
  const { triggers, statistics, refetch } = useAutoRefreshTriggers(10000);
  const { activate, loading: activatingTrigger } = useActivateTrigger();
  const { resolve, loading: resolvingTrigger } = useResolveTrigger();
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");

  // Filter triggers
  const filteredTriggers = triggers.filter((trigger) => {
    if (selectedZone && trigger.zone !== selectedZone) return false;
    if (selectedSeverity && trigger.severity !== selectedSeverity) return false;
    return true;
  });

  const handleActivateTrigger = async (type: string) => {
    const trigger = await activate(type);
    if (trigger) {
      refetch();
    }
  };

  const handleSimulateRain = async () => {
    try {
      const response = await fetch("/api/trigger-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate-rain",
          zoneOverride: "north",
        }),
      });
      if (response.ok) {
        refetch();
      }
    } catch (err) {
      console.error("Error simulating rain:", err);
    }
  };

  const handleSimulatePollution = async () => {
    try {
      const response = await fetch("/api/trigger-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate-pollution",
          zoneOverride: "east",
        }),
      });
      if (response.ok) {
        refetch();
      }
    } catch (err) {
      console.error("Error simulating pollution:", err);
    }
  };

  const handleSimulateHeatwave = async () => {
    try {
      const response = await fetch("/api/trigger-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate-heatwave",
          zoneOverride: "west",
        }),
      });
      if (response.ok) {
        refetch();
      }
    } catch (err) {
      console.error("Error simulating heatwave:", err);
    }
  };

  const handleResolveTrigger = async (triggerId: string) => {
    const success = await resolve(triggerId);
    if (success) {
      // Remove from local state
      await refetch();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
            🚨 Trigger Engine
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time disruption detection and management
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          className="gap-2"
          variant="outline"
        >
          🔄 Refresh
        </Button>
      </motion.div>

      {/* Statistics */}
      {statistics && <StatisticsOverview stats={statistics} />}

      {/* Manual Trigger Creation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
      >
        <h2 className="font-bold mb-4">📊 Simulate Disruption Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button
            size="sm"
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleSimulateRain()}
            disabled={activatingTrigger}
          >
            🌧️ Simulate Rain Event
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleSimulatePollution()}
            disabled={activatingTrigger}
          >
            💨 Simulate Pollution (AQI)
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => handleSimulateHeatwave()}
            disabled={activatingTrigger}
          >
            🔥 Simulate Heatwave
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Zones</option>
          <option value="north">North</option>
          <option value="south">South</option>
          <option value="east">East</option>
          <option value="west">West</option>
        </select>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Severities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        {(selectedZone || selectedSeverity) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedZone("");
              setSelectedSeverity("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Triggers List */}
      <div className="space-y-3">
        <h2 className="font-bold text-lg">
          Active Triggers ({filteredTriggers.length})
        </h2>

        {filteredTriggers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
          >
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-700 dark:text-green-400 font-semibold">
              All Systems Operational
            </p>
            <p className="text-sm text-green-600 dark:text-green-500 mt-1">
              No active disruption triggers at the moment
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTriggers.map((trigger) => (
              <TriggerCard
                key={trigger.id}
                trigger={trigger}
                onResolve={handleResolveTrigger}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Trigger Type Breakdown */}
      {statistics && Object.keys(statistics.byType).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
        >
          <h3 className="font-bold mb-3">📈 Breakdown by Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(statistics.byType).map(([type, count]) => {
              const config = TRIGGER_CONFIG[type as keyof typeof TRIGGER_CONFIG];
              return (
                <div
                  key={type}
                  className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-lg">{config?.icon || "❓"}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {config?.label || type}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {count}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Zone Breakdown */}
      {statistics && Object.keys(statistics.byZone).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
        >
          <h3 className="font-bold mb-3">🗺️ Breakdown by Zone</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["north", "south", "east", "west"].map((zone) => (
              <div
                key={zone}
                className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">
                  {zone}
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {statistics.byZone[zone] || 0}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
