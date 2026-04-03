/**
 * React Hooks for Risk & Premium Engine API
 * File: hooks/usePremiumEngine.ts
 *
 * Collection of hooks for interacting with the Risk & Premium Engine API
 */

"use client";

import { useState, useCallback } from "react";

// Type definitions
export interface RiskAssessment {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riskScore: number;
  factors: {
    weather: number;
    location: number;
    disruption: number;
    combined: number;
  };
  details: {
    locationName: string;
    weatherCondition: string;
    disruptionHistory: string;
    alerts: string[];
  };
}

export interface PremiumBreakdown {
  basePrice: number;
  riskAdjustment: number;
  coverageFactor: number;
  tierMultiplier: number;
  weeklyAdjustment: number;
  finalPremium: number;
}

export interface PremiumResult {
  zone: string;
  coverage: number;
  riskLevel: string;
  premium: number;
  breakdown: PremiumBreakdown;
  factors: {
    weather: number;
    location: number;
    disruption: number;
  };
  tier: {
    name: string;
    basePremium: number;
    coverageRange: { min: number; max: number };
    riskMultiplier: number;
  };
  weeklyAdjustment: {
    week: number;
    seasonalFactor: number;
    reason: string;
  };
}

export interface AnnualPremium {
  zone: string;
  coverage: number;
  premium: {
    monthlyAverage: number;
    annualEstimate: number;
  };
  costBreakdown: {
    minimumMonthly: string;
    averageMonthly: string;
    maximumMonthly: string;
    range: string;
  };
  seasonalBreakdown: Record<string, any>;
  estimatedCosts: {
    perMonth: number;
    perQuarter: number;
    perYear: number;
  };
  paymentOptions: Array<{
    frequency: string;
    amount: number;
    total: number;
    frequency_id: string;
    discount?: string;
  }>;
}

export interface ZoneComparison {
  rank: number;
  zone: string;
  riskLevel: string;
  riskScore: number;
  premium: number;
  monthlyAverage: number;
  annualCost: number;
  factors: {
    weather: number;
    location: number;
    disruption: number;
  };
  recommendation: string;
}

// Hook 1: Get Risk Assessment
export function useRiskAssessment() {
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assess = useCallback(async (zone: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/risk/assess?zone=${zone}`);
      const result = await response.json();

      if (result.success) {
        setRisk(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { risk, loading, error, assess };
}

// Hook 2: Calculate Premium
export function usePremiumCalculator() {
  const [premium, setPremium] = useState<PremiumResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(
    async (zone: string, coverage: number, weekNumber?: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/premium/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            zone,
            coverage,
            ...(weekNumber && { weekNumber }),
          }),
        });

        const result = await response.json();

        if (result.success) {
          setPremium(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { premium, loading, error, calculate };
}

// Hook 3: Compare Zones
export function useZoneComparison() {
  const [comparison, setComparison] = useState<ZoneComparison[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = useCallback(async (coverage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/premium/compare-zones?coverage=${coverage}`
      );
      const result = await response.json();

      if (result.success) {
        setComparison(result.data);
        setStatistics(result.statistics);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { comparison, statistics, loading, error, compare };
}

// Hook 4: Get Annual Premium
export function useAnnualPremium() {
  const [annual, setAnnual] = useState<AnnualPremium | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(
    async (zone: string, coverage: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/premium/annual?zone=${zone}&coverage=${coverage}`
        );
        const result = await response.json();

        if (result.success) {
          setAnnual(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { annual, loading, error, calculate };
}

// Hook 5: Complete Analysis
export function useRiskPremiumAnalysis() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (zone: string, coverage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/risk-premium/analyze?zone=${zone}&coverage=${coverage}`
      );
      const result = await response.json();

      if (result.success) {
        setAnalysis(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { analysis, loading, error, analyze };
}

/**
 * USAGE EXAMPLES
 *
 * Example 1: Get Risk Assessment
 * function MyComponent() {
 *   const { risk, loading, error, assess } = useRiskAssessment();
 *
 *   return (
 *     <div>
 *       <button onClick={() => assess('north')}>Assess Risk</button>
 *       {loading && <p>Loading...</p>}
 *       {risk && <p>Risk Level: {risk.riskLevel}</p>}
 *       {error && <p>Error: {error}</p>}
 *     </div>
 *   );
 * }
 *
 * Example 2: Calculate Premium
 * function PremiumCalculator() {
 *   const { premium, loading, calculate } = usePremiumCalculator();
 *   const [zone, setZone] = useState('north');
 *   const [coverage, setCoverage] = useState(500);
 *
 *   return (
 *     <div>
 *       <input value={zone} onChange={e => setZone(e.target.value)} />
 *       <input value={coverage} onChange={e => setCoverage(Number(e.target.value))} />
 *       <button onClick={() => calculate(zone, coverage)}>
 *         Calculate
 *       </button>
 *       {premium && <p>Premium: ₹{premium.premium}</p>}
 *     </div>
 *   );
 * }
 *
 * Example 3: Compare Zones
 * function ZoneComparator() {
 *   const { comparison, loading, compare } = useZoneComparison();
 *
 *   return (
 *     <div>
 *       <button onClick={() => compare(500)}>Compare Zones</button>
 *       {comparison.map(zone => (
 *         <div key={zone.zone}>
 *           {zone.zone}: ₹{zone.premium}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
