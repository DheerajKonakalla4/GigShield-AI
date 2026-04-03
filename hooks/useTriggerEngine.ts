"use client";

import { useState, useCallback, useEffect } from "react";

// Type definitions
export interface Trigger {
  id: string;
  type: string;
  zone: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
  activatedAt: string;
  reason: string;
  affectedUsers: number;
  data: any;
  isActive: boolean;
  resolvedAt?: string;
}

export interface TriggerStatistics {
  totalActive: number;
  totalHistorical: number;
  byType: { [key: string]: number };
  byZone: { [key: string]: number };
  bySeverity: { [key: string]: number };
  affectedUsers: number;
}

export interface TriggerResponse {
  triggers: Trigger[];
  count: number;
  statistics: TriggerStatistics;
}

// Hook 1: Use Active Triggers
export function useActiveTriggers() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [statistics, setStatistics] = useState<TriggerStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTriggers = useCallback(async (zone?: string, type?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (zone) params.append("zone", zone);
      if (type) params.append("type", type);

      const response = await fetch(`/api/trigger-event?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setTriggers(result.data.triggers);
        setStatistics(result.data.statistics);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { triggers, statistics, loading, error, fetchTriggers, setTriggers };
}

// Hook 2: Detect Triggers
export function useDetectTriggers() {
  const [detectedTriggers, setDetectedTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async (zone?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/trigger-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "detect",
          zone,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDetectedTriggers(result.data.activeTriggers);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { detectedTriggers, loading, error, detect };
}

// Hook 3: Activate Trigger
export function useActivateTrigger() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activate = useCallback(
    async (type: string, zoneOverride?: string, severity?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/trigger-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "activate",
            type,
            zoneOverride,
            severity,
          }),
        });

        const result = await response.json();

        if (result.success) {
          return result.data.trigger;
        } else {
          setError(result.error);
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, activate };
}

// Hook 4: Resolve Trigger
export function useResolveTrigger() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = useCallback(async (triggerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/trigger-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolve",
          triggerId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, resolve };
}

// Hook 5: Auto-refresh Triggers
export function useAutoRefreshTriggers(interval: number = 10000) {
  const { fetchTriggers, triggers, statistics } = useActiveTriggers();

  useEffect(() => {
    // Fetch immediately
    fetchTriggers();

    // Set up interval
    const timer = setInterval(() => {
      fetchTriggers();
    }, interval);

    return () => clearInterval(timer);
  }, [fetchTriggers, interval]);

  return { triggers, statistics, refetch: fetchTriggers };
}

// Hook 6: Trigger History
export function useTriggerHistory() {
  const [history, setHistory] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHistory = useCallback(async (zone?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ history: "true" });
      if (zone) params.append("zone", zone);

      const response = await fetch(`/api/trigger-event?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setHistory(result.data.triggers);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { history, loading, error, getHistory };
}

// Hook 7: Trigger Statistics
export function useTriggerStatistics() {
  const [stats, setStats] = useState<TriggerStatistics | null>(null);
  const [loading, setLoading] = useState(false);

  const getStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/trigger-event");
      const result = await response.json();

      if (result.success) {
        setStats(result.data.statistics);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, getStats };
}
