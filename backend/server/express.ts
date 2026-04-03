/**
 * Express Server Setup
 * Can be used to run backend as standalone Node.js server
 */

import { Config, LoggingConfig, CorsConfig, SecurityConfig } from "../config";
import {
  ErrorHandler,
  RequestLogger,
  RateLimiter,
  CorsMiddleware,
  ResponseFormatter,
} from "../middleware";
import {
  PolicyRoutes,
  ClaimRoutes,
  PremiumRoutes,
  PaymentRoutes,
  AnalyticsRoutes,
  DisputeRoutes,
  HealthRoutes,
} from "../routes";
import { Logger } from "../utils";

/**
 * ============================================================================
 * EXPRESS SERVER SETUP
 * ============================================================================
 */

export class ExpressServer {
  private static app: any;

  /**
   * Initialize Express server
   */
  static initialize(expressApp: any): void {
    this.app = expressApp;

    // Validate configuration
    Config.validate();

    Logger.info("Initializing Express server", Config.toObject());

    // Middleware setup
    this.setupMiddleware();

    // Routes setup
    this.setupRoutes();

    // Error handling
    this.setupErrorHandling();
  }

  /**
   * Setup middleware
   */
  private static setupMiddleware(): void {
    // JSON parser
    this.app.use(this.app.json?.({ limit: "10mb" }));
    this.app.use(this.app.urlencoded?.({ limit: "10mb", extended: true }));

    // CORS
    this.setupCors();

    // Rate limiting
    this.setupRateLimit();

    // Request logging
    this.setupRequestLogging();

    Logger.info("Middleware setup complete");
  }

  /**
   * Setup CORS
   */
  private static setupCors(): void {
    if (this.app.use && typeof this.app.use === "function") {
      // Express-style middleware
      this.app.use((req: any, res: any, next: any) => {
        const corsHeaders = CorsMiddleware.getCorsHeaders(req.headers.origin);
        Object.entries(corsHeaders).forEach(([key, value]) => {
          if (value) {
            res.setHeader(key, value);
          }
        });

        if (req.method === "OPTIONS") {
          res.writeHead(200);
          res.end();
        } else {
          next();
        }
      });
    }
  }

  /**
   * Setup rate limiting
   */
  private static setupRateLimit(): void {
    if (this.app.use && typeof this.app.use === "function") {
      this.app.use((req: any, res: any, next: any) => {
        const ip = req.ip || req.connection.remoteAddress;
        const allowed = RateLimiter.checkLimit(
          ip,
          Config.RATE_LIMIT_MAX_REQUESTS,
          Config.RATE_LIMIT_WINDOW_MS
        );

        if (!allowed) {
          return res.status(429).json(
            ResponseFormatter.error(
              "RATE_LIMIT_EXCEEDED",
              "Too many requests"
            )
          );
        }

        next();
      });
    }
  }

  /**
   * Setup request logging
   */
  private static setupRequestLogging(): void {
    if (this.app.use && typeof this.app.use === "function") {
      this.app.use((req: any, res: any, next: any) => {
        RequestLogger.logRequest(req.method, req.url, req.headers);
        next();
      });
    }
  }

  /**
   * Setup routes
   */
  private static setupRoutes(): void {
    const prefix = Config.API_PREFIX;

    // Policy routes
    this.post(`${prefix}/policies`, async (req: any, res: any) => {
      const result = await PolicyRoutes.create(req);
      res.status(result.status).json(result.data);
    });

    this.get(`${prefix}/policies/:id`, async (req: any, res: any) => {
      const result = await PolicyRoutes.getDetails(req, req.params.id);
      res.status(result.status).json(result.data);
    });

    this.put(`${prefix}/policies/:id/renew`, async (req: any, res: any) => {
      const result = await PolicyRoutes.renew(req, req.params.id);
      res.status(result.status).json(result.data);
    });

    // Claim routes
    this.post(`${prefix}/claims`, async (req: any, res: any) => {
      const result = await ClaimRoutes.create(req);
      res.status(result.status).json(result.data);
    });

    this.get(`${prefix}/claims/:id`, async (req: any, res: any) => {
      const result = await ClaimRoutes.getDetails(req, req.params.id);
      res.status(result.status).json(result.data);
    });

    this.get(`${prefix}/claims/user/:userId`, async (req: any, res: any) => {
      const result = await ClaimRoutes.getUserClaims(req, req.params.userId);
      res.status(result.status).json(result.data);
    });

    // Premium routes
    this.post(`${prefix}/premium/calculate`, async (req: any, res: any) => {
      const result = await PremiumRoutes.calculate(req);
      res.status(result.status).json(result.data);
    });

    this.get(`${prefix}/premium/compare`, async (req: any, res: any) => {
      const result = await PremiumRoutes.compare(req);
      res.status(result.status).json(result.data);
    });

    // Payment routes
    this.post(`${prefix}/payments`, async (req: any, res: any) => {
      const result = await PaymentRoutes.create(req);
      res.status(result.status).json(result.data);
    });

    this.get(`${prefix}/payments/:id`, async (req: any, res: any) => {
      const result = await PaymentRoutes.getStatus(req, req.params.id);
      res.status(result.status).json(result.data);
    });

    this.get(`${prefix}/payments/user/:userId`, async (req: any, res: any) => {
      const result = await PaymentRoutes.getUserPayments(req, req.params.userId);
      res.status(result.status).json(result.data);
    });

    // Analytics routes
    this.get(`${prefix}/analytics/platform`, async (req: any, res: any) => {
      const result = await AnalyticsRoutes.getPlatformMetrics(req);
      res.status(result.status).json(result.data);
    });

    this.get(`${prefix}/analytics/user/:userId`, async (req: any, res: any) => {
      const result = await AnalyticsRoutes.getUserAnalytics(req, req.params.userId);
      res.status(result.status).json(result.data);
    });

    this.get(`${prefix}/analytics/zones`, async (req: any, res: any) => {
      const result = await AnalyticsRoutes.getZoneAnalytics(req);
      res.status(result.status).json(result.data);
    });

    // Dispute routes
    this.post(`${prefix}/disputes`, async (req: any, res: any) => {
      const result = await DisputeRoutes.create(req);
      res.status(result.status).json(result.data);
    });

    this.get(`${prefix}/disputes/:id`, async (req: any, res: any) => {
      const result = await DisputeRoutes.getStatus(req, req.params.id);
      res.status(result.status).json(result.data);
    });

    // Health check
    this.get(`${prefix}/health`, async (req: any, res: any) => {
      const result = await HealthRoutes.check(req);
      res.status(result.status).json(result.data);
    });

    Logger.info("Routes setup complete", { prefix });
  }

  /**
   * Setup error handling
   */
  private static setupErrorHandling(): void {
    if (this.app.use && typeof this.app.use === "function") {
      // 404 handler
      this.app.use((req: any, res: any) => {
        res.status(404).json(
          ResponseFormatter.error(
            "NOT_FOUND",
            `Route ${req.method} ${req.url} not found`
          )
        );
      });

      // Global error handler
      this.app.use((error: any, req: any, res: any, next: any) => {
        const errorResponse = ErrorHandler.handle(error);
        const statusCode =
          error.statusCode ||
          (errorResponse.error?.code === "NOT_FOUND" ? 404 : 500);
        res.status(statusCode).json(errorResponse);
      });
    }

    Logger.info("Error handling setup complete");
  }

  /**
   * Register route handler
   */
  private static post(path: string, handler: any): void {
    if (this.app.post && typeof this.app.post === "function") {
      this.app.post(path, handler);
    }
  }

  private static get(path: string, handler: any): void {
    if (this.app.get && typeof this.app.get === "function") {
      this.app.get(path, handler);
    }
  }

  private static put(path: string, handler: any): void {
    if (this.app.put && typeof this.app.put === "function") {
      this.app.put(path, handler);
    }
  }

  private static delete(path: string, handler: any): void {
    if (this.app.delete && typeof this.app.delete === "function") {
      this.app.delete(path, handler);
    }
  }

  /**
   * Start server
   */
  static start(): void {
    if (this.app.listen && typeof this.app.listen === "function") {
      this.app.listen(Config.PORT, Config.HOST, () => {
        Logger.info(`Server running on ${Config.HOST}:${Config.PORT}`, {
          environment: Config.NODE_ENV,
          apiPrefix: Config.API_PREFIX,
        });
      });
    }
  }
}

/**
 * ============================================================================
 * STANDALONE SERVER ENTRY POINT
 * ============================================================================
 */

if (require.main === module) {
  // Create Express app (pseudo code)
  // In real implementation, use: import express from 'express';
  // const expressApp = express();

  // Initialize and start server
  // ExpressServer.initialize(expressApp);
  // ExpressServer.start();

  Logger.info("Express server setup module loaded");
}

export default ExpressServer;
