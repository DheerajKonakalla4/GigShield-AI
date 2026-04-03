/**
 * Frontend API Client
 * Centralized HTTP client for all backend API calls
 * 
 * Usage in React components:
 * import { apiClient } from "@/backend/integration/api-client";
 * 
 * const policy = await apiClient.policies.create({
 *   userId: "user_123",
 *   coverageAmount: 500,
 *   zone: "north"
 * });
 */

import React from "react";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

/**
 * ============================================================================
 * API CLIENT CLASS
 * ============================================================================
 */

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const config: RequestInit = {
      method: options.method,
      headers,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "API Error");
      }

      return data.data || data;
    } catch (error) {
      console.error(`API Error [${options.method} ${endpoint}]`, error);
      throw error;
    }
  }

  /**
   * Set authorization token
   */
  setToken(token: string): void {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Clear authorization token
   */
  clearToken(): void {
    delete this.defaultHeaders["Authorization"];
  }

  /**
   * ============================================================================
   * POLICY ENDPOINTS
   * ============================================================================
   */

  policies = {
    /**
     * Create a new policy
     * POST /api/policies
     */
    create: async (data: {
      userId: string;
      coverageAmount: number;
      zone: string;
    }): Promise<{ id: string; status: string; coverageAmount: number }> => {
      return this.request("/policies", {
        method: "POST",
        body: data,
      });
    },

    /**
     * Get policy details
     * GET /api/policies?id=<id>
     */
    getById: async (id: string): Promise<{ id: string; status: string; coverageAmount: number }> => {
      return this.request(`/policies?id=${id}`, {
        method: "GET",
      });
    },

    /**
     * Renew policy
     * PUT /api/policies/:id/renew
     */
    renew: async (id: string): Promise<{ id: string; status: string }> => {
      return this.request(`/policies/${id}/renew`, {
        method: "PUT",
      });
    },
  };

  /**
   * ============================================================================
   * CLAIM ENDPOINTS
   * ============================================================================
   */

  claims = {
    /**
     * Trigger a claim
     * POST /api/claims
     */
    create: async (data: {
      userId: string;
      policyId: string;
      disruptionType: string;
    }): Promise<{ claim: { id: string; status: string }; processing: { recommendation: string; amount: number } }> => {
      return this.request("/claims", {
        method: "POST",
        body: data,
      });
    },

    /**
     * Get claim details
     * GET /api/claims?id=<id>
     */
    getById: async (id: string): Promise<{ id: string; status: string }> => {
      return this.request(`/claims?id=${id}`, {
        method: "GET",
      });
    },

    /**
     * Get user's claims
     * GET /api/claims?userId=<userId>
     */
    getByUserId: async (userId: string): Promise<Array<{ id: string; status: string }>> => {
      return this.request(`/claims?userId=${userId}`, {
        method: "GET",
      });
    },
  };

  /**
   * ============================================================================
   * PREMIUM ENDPOINTS
   * ============================================================================
   */

  premium = {
    /**
     * Calculate premium
     * POST /api/premium/calculate
     */
    calculate: async (data: {
      coverageAmount: number;
      zone: string;
      riskLevel: string;
    }): Promise<{ basePremium: number; finalPremium: number; savings: number }> => {
      return this.request("/premium/calculate", {
        method: "POST",
        body: data,
      });
    },

    /**
     * Compare coverage options
     * GET /api/premium/compare
     */
    compare: async (): Promise<Array<{ coverage: number; premium: number }>> => {
      return this.request("/premium/compare", {
        method: "GET",
      });
    },
  };

  /**
   * ============================================================================
   * PAYMENT ENDPOINTS
   * ============================================================================
   */

  payments = {
    /**
     * Process payment
     * POST /api/payments
     */
    create: async (data: {
      claimId: string;
      amount: number;
      method?: string;
    }): Promise<{ transactionId: string; status: string; amount: number }> => {
      return this.request("/payments", {
        method: "POST",
        body: data,
      });
    },

    /**
     * Get payment status
     * GET /api/payments?id=<id>
     */
    getById: async (id: string): Promise<{ transactionId: string; status: string; amount: number }> => {
      return this.request(`/payments?id=${id}`, {
        method: "GET",
      });
    },

    /**
     * Get user's payments
     * GET /api/payments?userId=<userId>
     */
    getByUserId: async (userId: string): Promise<Array<{ transactionId: string; status: string; amount: number }>> => {
      return this.request(`/payments?userId=${userId}`, {
        method: "GET",
      });
    },
  };

  /**
   * ============================================================================
   * ANALYTICS ENDPOINTS
   * ============================================================================
   */

  analytics = {
    /**
     * Get platform metrics
     * GET /api/analytics?type=platform
     */
    getPlatformMetrics: async (): Promise<{ activeUsers: number; totalClaims: number; totalPayouts: number; approvalRate: number }> => {
      return this.request("/analytics?type=platform", {
        method: "GET",
      });
    },

    /**
     * Get user analytics
     * GET /api/analytics?type=user&userId=<userId>
     */
    getUserAnalytics: async (userId: string): Promise<{ claims: number; payouts: number; premium: number }> => {
      return this.request(`/analytics?type=user&userId=${userId}`, {
        method: "GET",
      });
    },

    /**
     * Get zone analytics
     * GET /api/analytics?type=zones
     */
    getZoneAnalytics: async (): Promise<Array<{ zone: string; users: number; claims: number; payouts: number }>> => {
      return this.request("/analytics?type=zones", {
        method: "GET",
      });
    },
  };

  /**
   * ============================================================================
   * DISPUTE ENDPOINTS
   * ============================================================================
   */

  disputes = {
    /**
     * File a dispute
     * POST /api/disputes
     */
    create: async (data: {
      claimId: string;
      reason: string;
    }): Promise<{ id: string; status: string }> => {
      return this.request("/disputes", {
        method: "POST",
        body: data,
      });
    },

    /**
     * Get dispute status
     * GET /api/disputes?id=<id>
     */
    getById: async (id: string): Promise<{ id: string; status: string }> => {
      return this.request(`/disputes?id=${id}`, {
        method: "GET",
      });
    },
  };

  /**
   * ============================================================================
   * HEALTH ENDPOINT
   * ============================================================================
   */

  health = {
    /**
     * Check API health
     * GET /api/health
     */
    check: async (): Promise<{ status: string; uptime: number; timestamp: string }> => {
      return this.request("/health", {
        method: "GET",
      });
    },
  };
}

// Create singleton instance
export const apiClient = new ApiClient();

/**
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 */

export const apiUsageExamples = {
  /**
   * Create a policy
   */
  createPolicy: async () => {
    const policy = await apiClient.policies.create({
      userId: "user_123",
      coverageAmount: 500,
      zone: "north",
    });

    console.log("Policy created:", policy);
    return policy;
  },

  /**
   * Calculate premium before purchase
   */
  calculatePremium: async () => {
    const calculation = await apiClient.premium.calculate({
      coverageAmount: 500,
      zone: "north",
      riskLevel: "medium",
    });

    console.log("Premium calculation:", {
      basePremium: calculation.basePremium,
      finalPremium: calculation.finalPremium,
      savings: calculation.savings,
    });

    return calculation;
  },

  /**
   * Trigger a claim
   */
  triggerClaim: async () => {
    const result = await apiClient.claims.create({
      userId: "user_123",
      policyId: "policy_456",
      disruptionType: "weather",
    });

    console.log("Claim triggered:", {
      claimId: result.claim.id,
      status: result.claim.status,
      approval: result.processing.recommendation,
      amount: result.processing.amount,
    });

    return result;
  },

  /**
   * Get user claims
   */
  getUserClaims: async (userId: string) => {
    const claims = await apiClient.claims.getByUserId(userId);

    console.log("User claims:", claims);
    return claims;
  },

  /**
   * Process payment for claim
   */
  processPayment: async (claimId: string, amount: number) => {
    const payment = await apiClient.payments.create({
      claimId,
      amount,
      method: "bank_transfer",
    });

    console.log("Payment initiated:", {
      transactionId: payment.transactionId,
      status: payment.status,
      amount: payment.amount,
    });

    return payment;
  },

  /**
   * Get platform analytics
   */
  getPlatformMetrics: async () => {
    const metrics = await apiClient.analytics.getPlatformMetrics();

    console.log("Platform metrics:", {
      activeUsers: metrics.activeUsers,
      totalClaims: metrics.totalClaims,
      totalPayouts: metrics.totalPayouts,
      approvalRate: metrics.approvalRate,
    });

    return metrics;
  },

  /**
   * Compare coverage options
   */
  compareOptions: async () => {
    const options = await apiClient.premium.compare();

    console.log("Available coverage options:");
    options.forEach((option: any) => {
      console.log(`  ₹${option.coverage}: ₹${option.premium}/month`);
    });

    return options;
  },

  /**
   * File a dispute
   */
  fileDispute: async (claimId: string) => {
    const dispute = await apiClient.disputes.create({
      claimId,
      reason: "Claim amount seems too low",
    });

    console.log("Dispute filed:", {
      disputeId: dispute.id,
      status: dispute.status,
    });

    return dispute;
  },

  /**
   * Check API health
   */
  checkHealth: async () => {
    const health = await apiClient.health.check();

    console.log("API Status:", {
      status: health.status,
      uptime: `${Math.floor(health.uptime)}s`,
      timestamp: health.timestamp,
    });

    return health;
  },
};

/**
 * ============================================================================
 * REACT HOOK EXAMPLES
 * ============================================================================
 */

export const reactHookExamples = {
  /**
   * Hook to create a policy
   */
  useCreatePolicy: () => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const createPolicy = async (data: any) => {
      setLoading(true);
      setError(null);

      try {
        const policy = await apiClient.policies.create(data);
        setLoading(false);
        return policy;
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    };

    return { createPolicy, loading, error };
  },

  /**
   * Hook to fetch user claims
   */
  useUserClaims: (userId: string) => {
    const [claims, setClaims] = React.useState<Array<{ id: string; status: string }>>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
      const fetchClaims = async () => {
        try {
          const data = await apiClient.claims.getByUserId(userId);
          setClaims(data);
          setError(null);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchClaims();
    }, [userId]);

    return { claims, loading, error };
  },
};

export default apiClient;

// Note: Uncomment React import when using in React environment
// import React from "react";
