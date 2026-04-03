/**
 * Claims Engine React Hooks
 * File: hooks/useClaimsEngine.ts
 *
 * Custom hooks for managing insurance claims in React components
 */

import { useState, useCallback, useEffect } from "react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ClaimStatus = "CREATED" | "PROCESSING" | "APPROVED" | "PAID" | "REJECTED" | "CANCELLED";

export interface Claim {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  triggerId?: string;
  status: ClaimStatus;
  reason: string;
  zone: string;
  coverageAmount: number;
  disruptionDuration: number;
  riskLevel: string;
  disruptionFactor: number;
  riskMultiplier: number;
  payoutAmount: number;
  description: string;
  rejectionReason?: string;
  createdAt: string;
  processingStartedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  statusHistory?: Array<{
    status: ClaimStatus;
    timestamp: string;
    notes?: string;
  }>;
  // Phase 2 manual claims & automation fields
  isAutoProcessed?: boolean;
  triggerType?: string;
  dailyIncome?: number;
  lostHours?: number;
  processedAt?: string;
  fraudFlags?: string[];
}

export interface ClaimStatistics {
  total: number;
  byStatus: { [key: string]: number };
  byZone: { [key: string]: number };
  byReason: { [key: string]: number };
  totalPayout: number;
  averagePayout: number;
  pendingCount: number;
  approvedCount: number;
  paidCount: number;
}

export interface ClaimsResponse {
  success: boolean;
  data: {
    claims: Claim[];
    count: number;
    statistics: ClaimStatistics;
  };
}

// ============================================================================
// HOOK: GET ALL CLAIMS
// ============================================================================

export function useGetClaims(filters?: { userId?: string; status?: ClaimStatus; zone?: string }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [statistics, setStatistics] = useState<ClaimStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.userId) params.append("userId", filters.userId);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.zone) params.append("zone", filters.zone);
      params.append("history", "false");

      const response = await fetch(`/api/claims?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch claims");

      const data: ClaimsResponse = await response.json();
      setClaims(data.data.claims);
      setStatistics(data.data.statistics);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return {
    claims,
    statistics,
    loading,
    error,
    refetch: fetchClaims,
  };
}

// ============================================================================
// HOOK: GET CLAIMS WITH HISTORY
// ============================================================================

export function useGetClaimsWithHistory(filters?: { userId?: string; status?: ClaimStatus }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.userId) params.append("userId", filters.userId);
      if (filters?.status) params.append("status", filters.status);
      params.append("history", "true");

      const response = await fetch(`/api/claims?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch claims");

      const data: ClaimsResponse = await response.json();
      setClaims(data.data.claims);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return {
    claims,
    loading,
    error,
    refetch: fetchClaims,
  };
}

// ============================================================================
// HOOK: CREATE CLAIM FROM TRIGGER
// ============================================================================

export function useCreateClaimFromTrigger() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClaim = useCallback(async (triggerId: string, userId?: string): Promise<Claim | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/create-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "trigger",
          triggerId,
          ...(userId && { userId }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create claim");
      }

      const data = await response.json();
      return data.data.claim;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createClaim, loading, error };
}

// ============================================================================
// HOOK: CREATE MANUAL CLAIM (NEW FORM-BASED)
// ============================================================================

export interface ManualClaimFormData {
  userId: string;
  eventType: string;
  zone: string;
  dateOfIncident: string;
  lostHours: number;
  description?: string;
}

export function useSubmitManualClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const submitClaim = useCallback(
    async (formData: ManualClaimFormData): Promise<Claim | null> => {
      try {
        setLoading(true);
        setError(null);
        setWarnings([]);

        const response = await fetch("/api/submit-manual-claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to submit claim");
          if (data.warnings && data.warnings.length > 0) {
            setWarnings(data.warnings);
          }
          return null;
        }

        if (data.warnings && data.warnings.length > 0) {
          setWarnings(data.warnings);
        }

        return data.data.claim;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { submitClaim, loading, error, warnings };
}

// ============================================================================
// HOOK: CREATE MANUAL CLAIM (LEGACY)
// ============================================================================

export function useCreateManualClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createManualClaim = useCallback(
    async (
      userId: string,
      coverageAmount: number,
      disruptionDuration: number,
      riskLevel: string,
      description?: string
    ): Promise<Claim | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/create-claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "manual",
            userId,
            coverageAmount,
            disruptionDuration,
            riskLevel,
            description,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create claim");
        }

        const data = await response.json();
        return data.data.claim;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createManualClaim, loading, error };
}

// ============================================================================
// HOOK: APPROVE CLAIM
// ============================================================================

export function useApproveClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveClaim = useCallback(async (claimId: string, notes?: string): Promise<Claim | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          claimId,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve claim");
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { approveClaim, loading, error };
}

// ============================================================================
// HOOK: PAY CLAIM
// ============================================================================

export function usePayClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payClaim = useCallback(async (claimId: string, notes?: string): Promise<Claim | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pay",
          claimId,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to pay claim");
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { payClaim, loading, error };
}

// ============================================================================
// HOOK: REJECT CLAIM
// ============================================================================

export function useRejectClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectClaim = useCallback(async (claimId: string, reason: string): Promise<Claim | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          claimId,
          reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject claim");
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { rejectClaim, loading, error };
}

// ============================================================================
// HOOK: AUTO-REFRESH CLAIMS
// ============================================================================

export function useAutoRefreshClaims(interval: number = 10000, userId?: string) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [statistics, setStatistics] = useState<ClaimStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClaims = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      params.append("history", "false");

      const response = await fetch(`/api/claims?${params.toString()}`);
      if (response.ok) {
        const data: ClaimsResponse = await response.json();
        setClaims(data.data.claims);
        setStatistics(data.data.statistics);
      }
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Initial fetch
    fetchClaims();

    // Set up interval
    const intervalId = setInterval(fetchClaims, interval);

    return () => clearInterval(intervalId);
  }, [interval, userId, fetchClaims]);

  return {
    claims,
    statistics,
    loading,
    refetch: fetchClaims,
  };
}

// ============================================================================
// HOOK: GET CLAIMS BY STATUS
// ============================================================================

export function useClaimsByStatus(status: ClaimStatus) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/claims?status=${status}`);
        if (!response.ok) throw new Error("Failed to fetch claims");

        const data: ClaimsResponse = await response.json();
        setClaims(data.data.claims);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [status]);

  return { claims, loading, error };
}

// ============================================================================
// HOOK: AUTO-PROCESS CLAIMS
// ============================================================================

export function useAutoProcessClaims() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoProcess = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/create-claim", {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to auto-process claims");

      const data = await response.json();
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { autoProcess, loading, error };
}
