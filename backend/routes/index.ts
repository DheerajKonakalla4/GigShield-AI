/**
 * API Routes - Express-compatible route handlers
 * These can be used directly with Express or wrapped in Next.js API routes
 */

import {
  PolicyController,
  ClaimController,
  PremiumController,
  PaymentController,
  AnalyticsController,
  DisputeController,
} from "../controllers";
import {
  ErrorHandler,
  RequestValidator,
  RequestLogger,
  AuthMiddleware,
  ResponseFormatter,
} from "../middleware";
import {
  Policy,
  Claim,
  Payment,
  DisruptionEvent,
  PlatformMetrics,
  UserAnalytics,
} from "../types";

/**
 * ============================================================================
 * POLICY ROUTES
 * ============================================================================
 */

export class PolicyRoutes {
  /**
   * POST /api/policies
   * Create a new policy
   */
  static async create(req: any): Promise<any> {
    try {
      RequestLogger.logRequest("POST", "/api/policies");

      // Validate required fields
      RequestValidator.validateRequired(req.body, [
        "userId",
        "coverageAmount",
        "zone",
      ]);

      // Validate schema
      RequestValidator.validateSchema(req.body, {
        userId: "string",
        coverageAmount: "number",
        zone: "string",
      });

      // Validate ranges
      RequestValidator.validateNumberRange(
        req.body.coverageAmount,
        100,
        1000,
        "Coverage amount"
      );

      // Validate enum
      RequestValidator.validateEnum(
        req.body.zone,
        ["north", "south", "east", "west"],
        "Zone"
      );

      // Create policy
      const policy = await PolicyController.createPolicy(req.body);

      RequestLogger.logResponse("POST", "/api/policies", 201, 0);
      return {
        status: 201,
        data: ResponseFormatter.success(policy, "Policy created successfully"),
      };
    } catch (error) {
      RequestLogger.logError("POST", "/api/policies", error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 400,
        data: errorResponse,
      };
    }
  }

  /**
   * GET /api/policies/:id
   * Get policy details
   */
  static async getDetails(req: any, policyId: string): Promise<any> {
    try {
      RequestLogger.logRequest("GET", `/api/policies/${policyId}`);

      const userId = req.user?.id || req.body?.userId;
      const policy = await PolicyController.getPolicyDetails(policyId, userId);

      if (!policy) {
        return {
          status: 404,
          data: ResponseFormatter.error(
            "NOT_FOUND",
            "Policy not found"
          ),
        };
      }

      RequestLogger.logResponse("GET", `/api/policies/${policyId}`, 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(policy),
      };
    } catch (error) {
      RequestLogger.logError("GET", `/api/policies/${policyId}`, error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }

  /**
   * PUT /api/policies/:id/renew
   * Renew a policy
   */
  static async renew(req: any, policyId: string): Promise<any> {
    try {
      RequestLogger.logRequest("PUT", `/api/policies/${policyId}/renew`);

      const policy = await PolicyController.renewPolicy(policyId);

      RequestLogger.logResponse("PUT", `/api/policies/${policyId}/renew`, 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(policy, "Policy renewed successfully"),
      };
    } catch (error) {
      RequestLogger.logError("PUT", `/api/policies/${policyId}/renew`, error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }
}

/**
 * ============================================================================
 * CLAIM ROUTES
 * ============================================================================
 */

export class ClaimRoutes {
  /**
   * POST /api/claims
   * Trigger a claim
   */
  static async create(req: any): Promise<any> {
    try {
      RequestLogger.logRequest("POST", "/api/claims");

      // Validate required fields
      RequestValidator.validateRequired(req.body, [
        "userId",
        "policyId",
        "disruptionType",
        "coverageAmount",
      ]);

      // Create and process claim
      const { userId, policyId, disruptionType, coverageAmount } = req.body;
      const result = await ClaimController.createAndProcessClaim(
        userId,
        policyId,
        coverageAmount,
        disruptionType
      );

      RequestLogger.logResponse("POST", "/api/claims", 201, 0);
      return {
        status: 201,
        data: ResponseFormatter.success(
          result,
          "Claim created and processed"
        ),
      };
    } catch (error) {
      RequestLogger.logError("POST", "/api/claims", error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 400,
        data: errorResponse,
      };
    }
  }

  /**
   * GET /api/claims/:id
   * Get claim details
   */
  static async getDetails(req: any, claimId: string): Promise<any> {
    try {
      RequestLogger.logRequest("GET", `/api/claims/${claimId}`);

      const claim = await ClaimController.getClaimDetails(claimId);

      if (!claim) {
        return {
          status: 404,
          data: ResponseFormatter.error(
            "NOT_FOUND",
            "Claim not found"
          ),
        };
      }

      RequestLogger.logResponse("GET", `/api/claims/${claimId}`, 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(claim),
      };
    } catch (error) {
      RequestLogger.logError("GET", `/api/claims/${claimId}`, error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }

  /**
   * GET /api/claims/user/:userId
   * Get user's claims
   */
  static async getUserClaims(req: any, userId: string): Promise<any> {
    try {
      RequestLogger.logRequest("GET", `/api/claims/user/${userId}`);

      const claims = await ClaimController.getUserClaims(userId);

      RequestLogger.logResponse("GET", `/api/claims/user/${userId}`, 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(claims),
      };
    } catch (error) {
      RequestLogger.logError("GET", `/api/claims/user/${userId}`, error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }
}

/**
 * ============================================================================
 * PREMIUM ROUTES
 * ============================================================================
 */

export class PremiumRoutes {
  /**
   * POST /api/premium/calculate
   * Calculate premium
   */
  static async calculate(req: any): Promise<any> {
    try {
      RequestLogger.logRequest("POST", "/api/premium/calculate");

      // Validate required fields
      RequestValidator.validateRequired(req.body, [
        "coverageAmount",
        "zone",
        "riskLevel",
      ]);

      const premium = await PremiumController.calculatePremium(req.body);

      RequestLogger.logResponse("POST", "/api/premium/calculate", 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(premium),
      };
    } catch (error) {
      RequestLogger.logError("POST", "/api/premium/calculate", error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 400,
        data: errorResponse,
      };
    }
  }

  /**
   * GET /api/premium/compare
   * Compare coverage options
   */
  static async compare(req: any): Promise<any> {
    try {
      RequestLogger.logRequest("GET", "/api/premium/compare");

      const options = await PremiumController.compareCoverageOptions();

      RequestLogger.logResponse("GET", "/api/premium/compare", 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(options),
      };
    } catch (error) {
      RequestLogger.logError("GET", "/api/premium/compare", error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }
}

/**
 * ============================================================================
 * PAYMENT ROUTES
 * ============================================================================
 */

export class PaymentRoutes {
  /**
   * POST /api/payments
   * Process payment for claim
   */
  static async create(req: any): Promise<any> {
    try {
      RequestLogger.logRequest("POST", "/api/payments");

      // Validate required fields
      RequestValidator.validateRequired(req.body, ["claimId", "amount"]);

      const payment = await PaymentController.processPaymentForClaim(req.body);

      RequestLogger.logResponse("POST", "/api/payments", 201, 0);
      return {
        status: 201,
        data: ResponseFormatter.success(
          payment,
          "Payment processed"
        ),
      };
    } catch (error) {
      RequestLogger.logError("POST", "/api/payments", error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 400,
        data: errorResponse,
      };
    }
  }

  /**
   * GET /api/payments/:id
   * Get payment status
   */
  static async getStatus(req: any, paymentId: string): Promise<any> {
    try {
      RequestLogger.logRequest("GET", `/api/payments/${paymentId}`);

      const payment = await PaymentController.getPaymentStatus(paymentId);

      if (!payment) {
        return {
          status: 404,
          data: ResponseFormatter.error(
            "NOT_FOUND",
            "Payment not found"
          ),
        };
      }

      RequestLogger.logResponse("GET", `/api/payments/${paymentId}`, 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(payment),
      };
    } catch (error) {
      RequestLogger.logError("GET", `/api/payments/${paymentId}`, error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }

  /**
   * GET /api/payments/user/:userId
   * Get user's payments
   */
  static async getUserPayments(req: any, userId: string): Promise<any> {
    try {
      RequestLogger.logRequest("GET", `/api/payments/user/${userId}`);

      const payments = await PaymentController.getUserPayments(userId);

      RequestLogger.logResponse("GET", `/api/payments/user/${userId}`, 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(payments),
      };
    } catch (error) {
      RequestLogger.logError("GET", `/api/payments/user/${userId}`, error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }
}

/**
 * ============================================================================
 * ANALYTICS ROUTES
 * ============================================================================
 */

export class AnalyticsRoutes {
  /**
   * GET /api/analytics/platform
   * Get platform metrics
   */
  static async getPlatformMetrics(req: any): Promise<any> {
    try {
      RequestLogger.logRequest("GET", "/api/analytics/platform");

      const metrics = await AnalyticsController.getPlatformMetrics();

      RequestLogger.logResponse("GET", "/api/analytics/platform", 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(metrics),
      };
    } catch (error) {
      RequestLogger.logError("GET", "/api/analytics/platform", error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }

  /**
   * GET /api/analytics/user/:userId
   * Get user analytics
   */
  static async getUserAnalytics(req: any, userId: string): Promise<any> {
    try {
      RequestLogger.logRequest("GET", `/api/analytics/user/${userId}`);

      const analytics = await AnalyticsController.getUserAnalytics(userId);

      RequestLogger.logResponse("GET", `/api/analytics/user/${userId}`, 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(analytics),
      };
    } catch (error) {
      RequestLogger.logError("GET", `/api/analytics/user/${userId}`, error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }

  /**
   * GET /api/analytics/zones
   * Get zone analytics
   */
  static async getZoneAnalytics(req: any): Promise<any> {
    try {
      RequestLogger.logRequest("GET", "/api/analytics/zones");

      const analytics = await AnalyticsController.getZoneAnalytics();

      RequestLogger.logResponse("GET", "/api/analytics/zones", 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(analytics),
      };
    } catch (error) {
      RequestLogger.logError("GET", "/api/analytics/zones", error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }
}

/**
 * ============================================================================
 * DISPUTE ROUTES
 * ============================================================================
 */

export class DisputeRoutes {
  /**
   * POST /api/disputes
   * File a dispute
   */
  static async create(req: any): Promise<any> {
    try {
      RequestLogger.logRequest("POST", "/api/disputes");

      // Validate required fields
      RequestValidator.validateRequired(req.body, [
        "claimId",
        "reason",
      ]);

      const dispute = await DisputeController.fileDispute(req.body);

      RequestLogger.logResponse("POST", "/api/disputes", 201, 0);
      return {
        status: 201,
        data: ResponseFormatter.success(
          dispute,
          "Dispute filed successfully"
        ),
      };
    } catch (error) {
      RequestLogger.logError("POST", "/api/disputes", error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 400,
        data: errorResponse,
      };
    }
  }

  /**
   * GET /api/disputes/:id
   * Get dispute status
   */
  static async getStatus(req: any, disputeId: string): Promise<any> {
    try {
      RequestLogger.logRequest("GET", `/api/disputes/${disputeId}`);

      const dispute = await DisputeController.getDisputeStatus(disputeId);

      if (!dispute) {
        return {
          status: 404,
          data: ResponseFormatter.error(
            "NOT_FOUND",
            "Dispute not found"
          ),
        };
      }

      RequestLogger.logResponse("GET", `/api/disputes/${disputeId}`, 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(dispute),
      };
    } catch (error) {
      RequestLogger.logError("GET", `/api/disputes/${disputeId}`, error);
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }
}

/**
 * ============================================================================
 * HEALTH CHECK ROUTE
 * ============================================================================
 */

export class HealthRoutes {
  /**
   * GET /api/health
   * API health check
   */
  static async check(req: any): Promise<any> {
    try {
      RequestLogger.logRequest("GET", "/api/health");

      RequestLogger.logResponse("GET", "/api/health", 200, 0);
      return {
        status: 200,
        data: ResponseFormatter.success(
          {
            status: "healthy",
            timestamp: new Date(),
            uptime: process.uptime?.() || 0,
          }
        ),
      };
    } catch (error) {
      const errorResponse = ErrorHandler.handle(error);
      return {
        status: 500,
        data: errorResponse,
      };
    }
  }
}
