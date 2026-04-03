/**
 * Middleware layer for API request handling
 */

import { ApiResponse } from "../types";
import {
  AppError,
  Logger,
  ValidationError,
  UnauthorizedError,
  InternalServerError,
} from "../utils";

/**
 * ============================================================================
 * ERROR HANDLER MIDDLEWARE
 * ============================================================================
 */

export class ErrorHandler {
  /**
   * Main error handler - catches and formats errors
   */
  static handle(error: any): ApiResponse {
    Logger.error("Error caught by ErrorHandler", error);

    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        timestamp: new Date(),
      };
    }

    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: {
          code: "PARSE_ERROR",
          message: "Invalid request format",
          details: { original: error.message },
        },
        timestamp: new Date(),
      };
    }

    // Generic error
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        details: process.env.NODE_ENV === "development" ? { error: error.message } : {},
      },
      timestamp: new Date(),
    };
  }

  /**
   * Wrap async route handler
   */
  static asyncHandler(
    fn: (req: any, res: any) => Promise<any>
  ): (req: any, res: any) => void {
    return (req: any, res: any) => {
      Promise.resolve(fn(req, res)).catch((error) => {
        const errorResponse = this.handle(error);
        const statusCode = this.getStatusCode(error);
        res.status(statusCode).json(errorResponse);
      });
    };
  }

  /**
   * Get HTTP status code from error
   */
  private static getStatusCode(error: any): number {
    if (error instanceof AppError) {
      return error.statusCode;
    }
    if (error instanceof SyntaxError) {
      return 400;
    }
    return 500;
  }
}

/**
 * ============================================================================
 * REQUEST LOGGER MIDDLEWARE
 * ============================================================================
 */

export class RequestLogger {
  /**
   * Log incoming requests
   */
  static logRequest(method: string, url: string, headers?: any): void {
    const timestamp = new Date().toISOString();
    Logger.info(`[REQUEST] ${method} ${url}`, {
      timestamp,
      userAgent: headers?.["user-agent"],
    });
  }

  /**
   * Log response
   */
  static logResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number
  ): void {
    const timestamp = new Date().toISOString();
    Logger.info(`[RESPONSE] ${method} ${url} - ${statusCode}`, {
      timestamp,
      duration: `${duration}ms`,
    });
  }

  /**
   * Log error
   */
  static logError(method: string, url: string, error: any): void {
    Logger.error(`[ERROR] ${method} ${url}`, {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
  }
}

/**
 * ============================================================================
 * INPUT VALIDATION MIDDLEWARE
 * ============================================================================
 */

export class RequestValidator {
  /**
   * Validate required fields in request body
   */
  static validateRequired(body: any, fields: string[]): void {
    const missing = fields.filter((field) => !body[field]);
    if (missing.length > 0) {
      throw new ValidationError("Missing required fields", {
        missing,
      });
    }
  }

  /**
   * Validate request body structure
   */
  static validateSchema(body: any, schema: Record<string, string>): void {
    const errors: Record<string, string> = {};

    for (const [field, type] of Object.entries(schema)) {
      if (body.hasOwnProperty(field)) {
        const actualType = typeof body[field];
        if (actualType !== type) {
          errors[field] = `Expected ${type}, got ${actualType}`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Validation failed", errors);
    }
  }

  /**
   * Validate numeric range
   */
  static validateNumberRange(
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): void {
    if (isNaN(value) || value < min || value > max) {
      throw new ValidationError(`${fieldName} must be between ${min} and ${max}`);
    }
  }

  /**
   * Validate enum value
   */
  static validateEnum(value: any, options: string[], fieldName: string): void {
    if (!options.includes(value)) {
      throw new ValidationError(
        `${fieldName} must be one of: ${options.join(", ")}`
      );
    }
  }
}

/**
 * ============================================================================
 * AUTHENTICATION MIDDLEWARE
 * ============================================================================
 */

export class AuthMiddleware {
  /**
   * Verify JWT token (stub - implement with actual JWT library)
   */
  static verifyToken(token: string): { userId: string; role: string } | null {
    try {
      // In production, use jsonwebtoken library
      // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      // return decoded as { userId: string; role: string };

      // Stub implementation: decode basic Bearer token
      Logger.info("Token verified (stub)", { token: token.substring(0, 20) });
      return {
        userId: "user_123",
        role: "customer",
      };
    } catch (error) {
      Logger.error("Token verification failed", error);
      return null;
    }
  }

  /**
   * Extract bearer token from header
   */
  static extractToken(authHeader?: string): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      return parts[1];
    }
    return null;
  }

  /**
   * Check authentication
   */
  static requireAuth(authHeader?: string): { userId: string; role: string } {
    const token = this.extractToken(authHeader);
    if (!token) {
      throw new UnauthorizedError("Missing or invalid authorization header");
    }

    const decoded = this.verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedError("Invalid token");
    }

    return decoded;
  }

  /**
   * Check authorization role
   */
  static requireRole(user: { role: string }, allowedRoles: string[]): void {
    if (!allowedRoles.includes(user.role)) {
      Logger.warn("Unauthorized role access attempt", { role: user.role });
      throw new Error("Insufficient permissions");
    }
  }
}

/**
 * ============================================================================
 * RATE LIMITING MIDDLEWARE
 * ============================================================================
 */

export class RateLimiter {
  private static requests: Map<string, number[]> = new Map();

  /**
   * Check rate limit for IP
   */
  static checkLimit(
    ip: string,
    maxRequests: number = 100,
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    const key = ip;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const timestamps = this.requests.get(key)!;
    const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

    if (validTimestamps.length >= maxRequests) {
      Logger.warn("Rate limit exceeded", { ip, requests: validTimestamps.length });
      return false;
    }

    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    return true;
  }

  /**
   * Reset rate limit for IP
   */
  static reset(ip: string): void {
    this.requests.delete(ip);
  }

  /**
   * Clear all rate limits (useful for testing)
   */
  static clearAll(): void {
    this.requests.clear();
  }
}

/**
 * ============================================================================
 * CORS MIDDLEWARE
 * ============================================================================
 */

export class CorsMiddleware {
  private static allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://yourdomain.com",
  ];

  /**
   * Check if origin is allowed
   */
  static isOriginAllowed(origin?: string): boolean {
    if (!origin) return true;
    return this.allowedOrigins.includes(origin);
  }

  /**
   * Get CORS headers
   */
  static getCorsHeaders(origin?: string): Record<string, string> {
    return {
      "Access-Control-Allow-Origin": this.isOriginAllowed(origin) ? origin || "*" : "",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };
  }
}

/**
 * ============================================================================
 * REQUEST CONTEXT MIDDLEWARE
 * ============================================================================
 */

export class RequestContext {
  static context: Map<string, any> = new Map();

  /**
   * Create context for request
   */
  static create(requestId: string, metadata: Record<string, any>): void {
    this.context.set(requestId, {
      ...metadata,
      createdAt: new Date(),
    });
  }

  /**
   * Get context
   */
  static get(requestId: string): Record<string, any> | undefined {
    return this.context.get(requestId);
  }

  /**
   * Set context value
   */
  static set(requestId: string, key: string, value: any): void {
    const ctx = this.context.get(requestId) || {};
    this.context.set(requestId, { ...ctx, [key]: value });
  }

  /**
   * Clear context
   */
  static clear(requestId: string): void {
    this.context.delete(requestId);
  }

  /**
   * Generate request ID
   */
  static generateId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

/**
 * ============================================================================
 * RESPONSE FORMATTER MIDDLEWARE
 * ============================================================================
 */

export class ResponseFormatter {
  /**
   * Format success response
   */
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      timestamp: new Date(),
    };
  }

  /**
   * Format paginated response
   */
  static paginated<T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number
  ): any {
    return {
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      timestamp: new Date(),
    };
  }

  /**
   * Format error response
   */
  static error(code: string, message: string, details?: any): ApiResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date(),
    };
  }
}
