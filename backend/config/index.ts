/**
 * Configuration layer for backend environment and settings
 */

/**
 * ============================================================================
 * ENVIRONMENT CONFIGURATION
 * ============================================================================
 */

export class Config {
  // Environment
  static readonly NODE_ENV = process.env.NODE_ENV || "development";
  static readonly isDevelopment = this.NODE_ENV === "development";
  static readonly isProduction = this.NODE_ENV === "production";
  static readonly isTest = this.NODE_ENV === "test";

  // Server
  static readonly PORT = parseInt(process.env.PORT || "3001", 10);
  static readonly HOST = process.env.HOST || "localhost";

  // Database
  static readonly DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/insurance";
  static readonly DATABASE_TYPE =
    (process.env.DATABASE_TYPE as "mongodb" | "postgresql" | "mysql") ||
    "mongodb";

  // Authentication
  static readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  static readonly JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
  static readonly REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || "refresh-secret-key";
  static readonly REFRESH_TOKEN_EXPIRY =
    process.env.REFRESH_TOKEN_EXPIRY || "30d";

  // API Configuration
  static readonly API_VERSION = "v1";
  static readonly API_PREFIX = `/api/${this.API_VERSION}`;
  static readonly CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
  static readonly RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  static readonly RATE_LIMIT_MAX_REQUESTS = 100;

  // Payment Gateway
  static readonly PAYMENT_GATEWAY = process.env.PAYMENT_GATEWAY || "razorpay";
  static readonly RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
  static readonly RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "";
  static readonly STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

  // Email Configuration
  static readonly SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
  static readonly SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
  static readonly SMTP_USER = process.env.SMTP_USER || "";
  static readonly SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
  static readonly SMTP_FROM = process.env.SMTP_FROM || "noreply@insurance.com";

  // AWS Configuration (if using S3 for documents)
  static readonly AWS_REGION = process.env.AWS_REGION || "us-east-1";
  static readonly AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || "";
  static readonly AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || "";
  static readonly AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || "";

  // Logging
  static readonly LOG_LEVEL = process.env.LOG_LEVEL || "info";
  static readonly LOG_FORMAT = process.env.LOG_FORMAT || "json";

  // Business Rules
  static readonly CLAIM_PROCESSING_TIMEOUT = 48 * 60 * 60 * 1000; // 48 hours
  static readonly FRAUD_DETECTION_THRESHOLD = 70; // score > 70 = reject
  static readonly MIN_COVERAGE = 100;
  static readonly MAX_COVERAGE = 1000;

  // Feature Flags
  static readonly FEATURE_FRAUD_DETECTION = process.env.FEATURE_FRAUD_DETECTION !== "false";
  static readonly FEATURE_AUTO_APPROVAL = process.env.FEATURE_AUTO_APPROVAL === "true";
  static readonly FEATURE_WEATHER_TRIGGER = process.env.FEATURE_WEATHER_TRIGGER !== "false";
  static readonly FEATURE_TRAFFIC_TRIGGER = process.env.FEATURE_TRAFFIC_TRIGGER !== "false";

  /**
   * Validate required environment variables
   */
  static validate(): void {
    const missingEnvVars: string[] = [];

    if (!this.JWT_SECRET || this.JWT_SECRET === "your-secret-key") {
      missingEnvVars.push("JWT_SECRET");
    }

    if (this.isProduction) {
      if (!this.DATABASE_URL) missingEnvVars.push("DATABASE_URL");
      if (!this.RAZORPAY_KEY_ID && this.PAYMENT_GATEWAY === "razorpay") {
        missingEnvVars.push("RAZORPAY_KEY_ID");
      }
      if (!this.STRIPE_SECRET_KEY && this.PAYMENT_GATEWAY === "stripe") {
        missingEnvVars.push("STRIPE_SECRET_KEY");
      }
    }

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
      );
    }
  }

  /**
   * Get all config as object
   */
  static toObject(): Record<string, any> {
    return {
      NODE_ENV: this.NODE_ENV,
      PORT: this.PORT,
      HOST: this.HOST,
      DATABASE_URL: this.DATABASE_URL,
      API_PREFIX: this.API_PREFIX,
      LOG_LEVEL: this.LOG_LEVEL,
      CLAIM_PROCESSING_TIMEOUT: this.CLAIM_PROCESSING_TIMEOUT,
      FRAUD_DETECTION_THRESHOLD: this.FRAUD_DETECTION_THRESHOLD,
    };
  }
}

/**
 * ============================================================================
 * SERVICE CONFIGURATION
 * ============================================================================
 */

export class ServiceConfig {
  /**
   * Risk Engine Configuration
   */
  static readonly RISK_ENGINE = {
    WEIGHTS: {
      LOCATION: 0.3,
      HISTORICAL_CLAIMS: 0.25,
      WEATHER: 0.2,
      TRAFFIC: 0.15,
      BEHAVIOR: 0.1,
    },
    THRESHOLDS: {
      LOW_RISK: 33,
      MEDIUM_RISK: 66,
      HIGH_RISK: 100,
    },
  };

  /**
   * Premium Engine Configuration
   */
  static readonly PREMIUM_ENGINE = {
    BASE_PERCENTAGE: 0.05, // 5% of coverage
    ADMIN_FEE: 50,
    GST_RATE: 0.18,
    RISK_ADJUSTMENTS: {
      LOW: 0.1, // 10% markup
      MEDIUM: 0.25, // 25% markup
      HIGH: 0.5, // 50% markup
    },
    ZONE_MULTIPLIERS: {
      NORTH: 1.1,
      SOUTH: 1.0,
      EAST: 1.15,
      WEST: 1.05,
    },
  };

  /**
   * Fraud Detection Configuration
   */
  static readonly FRAUD_DETECTION = {
    WEIGHTS: {
      CLAIM_FREQUENCY: 0.25,
      AMOUNT_PATTERN: 0.2,
      RECENT_HISTORY: 0.15,
      DISRUPTION_CONFIDENCE: 0.2,
      APPROVAL_RATE: 0.2,
    },
    THRESHOLDS: {
      APPROVE: 30,
      MANUAL_REVIEW: 70,
      REJECT: 100,
    },
    MAX_CLAIMS_PER_MONTH: 3,
    CLAIM_AMOUNT_VARIANCE_THRESHOLD: 0.5,
  };

  /**
   * Claims Engine Configuration
   */
  static readonly CLAIMS_ENGINE = {
    PROCESSING_STEPS: 4,
    DEFAULT_APPROVAL_RATE: 0.85,
    MANUAL_REVIEW_PERCENTAGE: 0.1,
    AUTO_APPROVAL_ENABLED: false,
  };

  /**
   * Trigger Engine Configuration
   */
  static readonly TRIGGER_ENGINE = {
    WEATHER: {
      RAIN_PROBABILITY: 0.3,
      HEAT_PROBABILITY: 0.2,
      MIN_CONFIDENCE: 0.6,
    },
    TRAFFIC: {
      JAM_PROBABILITY: 0.25,
      MIN_SEVERITY: 40,
    },
    PLATFORM: {
      DOWNTIME_PROBABILITY: 0.05,
      MIN_OUTAGE_DURATION_SECONDS: 300,
    },
  };

  /**
   * Payment Simulator Configuration
   */
  static readonly PAYMENT_SIMULATOR = {
    SUCCESS_RATE: 0.95,
    MIN_DELAY_MS: 1000,
    MAX_DELAY_MS: 5000,
    RETRY_ATTEMPTS: 3,
  };
}

/**
 * ============================================================================
 * DATABASE CONFIGURATION
 * ============================================================================
 */

export class DatabaseConfig {
  /**
   * Get database connection options
   */
  static getConnectionOptions(): Record<string, any> {
    switch (Config.DATABASE_TYPE) {
      case "mongodb":
        return {
          type: "mongodb",
          url: Config.DATABASE_URL,
          synchronize: !Config.isProduction,
          logging: Config.isDevelopment,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };

      case "postgresql":
        return {
          type: "postgres",
          url: Config.DATABASE_URL,
          synchronize: !Config.isProduction,
          logging: Config.isDevelopment,
          ssl: Config.isProduction,
        };

      case "mysql":
        return {
          type: "mysql",
          url: Config.DATABASE_URL,
          synchronize: !Config.isProduction,
          logging: Config.isDevelopment,
        };

      default:
        return {};
    }
  }

  /**
   * Get database pool configuration
   */
  static getPoolConfig(): Record<string, any> {
    return {
      min: Config.isProduction ? 10 : 2,
      max: Config.isProduction ? 20 : 5,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    };
  }
}

/**
 * ============================================================================
 * CORS CONFIGURATION
 * ============================================================================
 */

export class CorsConfig {
  static getOptions(): Record<string, any> {
    const origins = Config.CORS_ORIGIN.split(",").map((o) => o.trim());

    return {
      origin: origins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      exposedHeaders: ["X-Total-Count", "X-Page-Count"],
      maxAge: 86400, // 24 hours
    };
  }
}

/**
 * ============================================================================
 * LOGGING CONFIGURATION
 * ============================================================================
 */

export class LoggingConfig {
  /**
   * Get logging options
   */
  static getOptions(): Record<string, any> {
    return {
      level: Config.LOG_LEVEL,
      format: Config.LOG_FORMAT,
      timestamp: true,
      colorize: Config.isDevelopment,
      handleExceptions: true,
      exitOnError: !Config.isDevelopment,
    };
  }

  /**
   * Get transports configuration
   */
  static getTransports(): any[] {
    const transports = [];

    // Console transport for development
    if (Config.isDevelopment) {
      transports.push({
        type: "console",
        colorize: true,
        timestamp: true,
      });
    }

    // File transports for all environments
    if (Config.isProduction || Config.isDevelopment) {
      transports.push(
        {
          type: "file",
          filename: "logs/app.log",
          maxSize: 5242880, // 5MB
          maxFiles: 5,
        },
        {
          type: "file",
          filename: "logs/error.log",
          level: "error",
          maxSize: 5242880,
          maxFiles: 5,
        }
      );
    }

    return transports;
  }
}

/**
 * ============================================================================
 * SECURITY CONFIGURATION
 * ============================================================================
 */

export class SecurityConfig {
  /**
   * Get helmet options (security headers)
   */
  static getHelmetOptions(): Record<string, any> {
    return {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: "deny",
      },
      xssFilter: true,
    };
  }

  /**
   * Get CSRF options
   */
  static getCsrfOptions(): Record<string, any> {
    return {
      cookie: {
        httpOnly: true,
        secure: Config.isProduction,
        sameSite: "strict",
      },
      headerFieldName: "X-CSRF-Token",
    };
  }

  /**
   * Get password validation rules
   */
  static getPasswordRules(): Record<string, any> {
    return {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    };
  }
}

/**
 * ============================================================================
 * CACHE CONFIGURATION
 * ============================================================================
 */

export class CacheConfig {
  static readonly REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
  static readonly CACHE_TTL = parseInt(process.env.CACHE_TTL || "3600", 10); // 1 hour
  static readonly ENABLE_CACHE = process.env.ENABLE_CACHE !== "false";

  /**
   * Get cache options
   */
  static getOptions(): Record<string, any> {
    return {
      host: "localhost",
      port: 6379,
      ttl: this.CACHE_TTL,
      isGlobal: true,
    };
  }

  /**
   * Get cache keys prefix
   */
  static getKeyPrefix(module: string): string {
    return `${module}:`;
  }
}
