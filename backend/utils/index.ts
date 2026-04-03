/**
 * Utility functions and helpers
 */

import { ApiResponse } from "../types";

/**
 * ============================================================================
 * API RESPONSE HELPERS
 * ============================================================================
 */

/**
 * Success response formatter
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date(),
  };
}

/**
 * Error response formatter
 */
export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, any>
): ApiResponse {
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

/**
 * ============================================================================
 * VALIDATION HELPERS
 * ============================================================================
 */

export class Validators {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  }

  static isValidCoverageAmount(amount: number): boolean {
    return amount >= 100 && amount <= 1000;
  }

  static isValidLocation(zone: string): boolean {
    return ["north", "south", "east", "west"].includes(zone.toLowerCase());
  }

  static isValidRiskLevel(level: string): boolean {
    return ["low", "medium", "high"].includes(level.toLowerCase());
  }

  static isValidClaimStatus(status: string): boolean {
    return ["triggered", "processing", "approved", "rejected", "paid"].includes(status);
  }
}

/**
 * ============================================================================
 * CALCULATION HELPERS
 * ============================================================================
 */

export class Calculations {
  /**
   * Calculate interest/compound growth
   */
  static calculateCompoundGrowth(
    principal: number,
    rate: number,
    time: number,
    compounds: number = 12
  ): number {
    return principal * Math.pow(1 + rate / compounds, compounds * time);
  }

  /**
   * Calculate percentage
   */
  static getPercentage(value: number, total: number): number {
    return (value / total) * 100;
  }

  /**
   * Calculate probability
   */
  static weightedAverage(values: number[], weights: number[]): number {
    const sumWeights = weights.reduce((a, b) => a + b, 0);
    const weighted = values.reduce((sum, val, i) => sum + val * weights[i], 0);
    return weighted / sumWeights;
  }

  /**
   * Calculate standard deviation
   */
  static standardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  }
}

/**
 * ============================================================================
 * DATE/TIME HELPERS
 * ============================================================================
 */

export class DateHelpers {
  /**
   * Add days to a date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Get days between dates
   */
  static daysBetween(from: Date, to: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((to.getTime() - from.getTime()) / oneDay);
  }

  /**
   * Check if date is within range
   */
  static isWithinRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  /**
   * Get week number of year
   */
  static getWeekNumber(date: Date): number {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDay.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
  }

  /**
   * Format date as ISO string
   */
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Format date as readable string
   */
  static toReadableString(date: Date): string {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
}

/**
 * ============================================================================
 * STRING HELPERS
 * ============================================================================
 */

export class StringHelpers {
  /**
   * Generate unique ID
   */
  static generateId(prefix?: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
  }

  /**
   * Capitalize first letter
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Truncate string
   */
  static truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + "..." : str;
  }

  /**
   * Hash string (simple, not cryptographic)
   */
  static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Mask sensitive data
   */
  static maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    const masked = local.substring(0, 2) + "*".repeat(local.length - 2);
    return `${masked}@${domain}`;
  }

  static maskPhone(phone: string): string {
    return phone.substring(0, 5) + "*".repeat(phone.length - 5);
  }
}

/**
 * ============================================================================
 * LOGGING HELPERS
 * ============================================================================
 */

export class Logger {
  static log(level: "info" | "warn" | "error", message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case "info":
        console.log(logMessage, data || "");
        break;
      case "warn":
        console.warn(logMessage, data || "");
        break;
      case "error":
        console.error(logMessage, data || "");
        break;
    }
  }

  static info(message: string, data?: any): void {
    this.log("info", message, data);
  }

  static warn(message: string, data?: any): void {
    this.log("warn", message, data);
  }

  static error(message: string, data?: any): void {
    this.log("error", message, data);
  }
}

/**
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 */

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super("VALIDATION_ERROR", message, 400, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super("UNAUTHORIZED", message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super("FORBIDDEN", message, 403);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super("CONFLICT", message, 409);
    this.name = "ConflictError";
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super("INTERNAL_ERROR", message, 500);
    this.name = "InternalServerError";
  }
}

/**
 * ============================================================================
 * ASYNC HELPERS
 * ============================================================================
 */

export class Async {
  /**
   * Retry function until success
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
    throw new Error("Max retries exceeded");
  }

  /**
   * Timeout promise
   */
  static withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeoutMs)
      ),
    ]);
  }

  /**
   * Execute multiple promises with concurrency limit
   */
  static async pLimit<T>(
    promises: Promise<T>[],
    limit: number
  ): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < promises.length; i += limit) {
      const batch = promises.slice(i, i + limit);
      results.push(...(await Promise.all(batch)));
    }
    return results;
  }
}

/**
 * ============================================================================
 * OBJECT HELPERS
 * ============================================================================
 */

export class ObjectHelpers {
  /**
   * Deep clone object
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Merge objects
   */
  static merge<T extends object>(target: T, source: Partial<T>): T {
    return { ...target, ...source };
  }

  /**
   * Pick specific keys from object
   */
  static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result: any = {};
    keys.forEach((key) => {
      result[key] = obj[key];
    });
    return result;
  }

  /**
   * Omit specific keys from object
   */
  static omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = ObjectHelpers.deepClone(obj);
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  }
}
