/**
 * Comprehensive type definitions for the parametric insurance platform
 * Centralized types for type safety across the backend
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export type RiskLevel = "low" | "medium" | "high";
export type ClaimStatus = "triggered" | "processing" | "approved" | "rejected" | "paid";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed";
export type DisruptionType = "rain" | "heat" | "traffic" | "platform_down" | "other";

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  location: Location;
  joinedAt: Date;
  activePolicy?: Policy;
  kycVerified: boolean;
  riskScore: number;
}

export interface Location {
  zone: string;
  latitude: number;
  longitude: number;
  riskMultiplier: number;
}

// ============================================================================
// POLICY TYPES
// ============================================================================

export interface Policy {
  id: string;
  userId: string;
  coverageAmount: number;
  weeklyPremium: number;
  riskLevel: RiskLevel;
  status: "active" | "expired" | "cancelled";
  startDate: Date;
  endDate: Date;
  triggers: DisruptionType[];
  createdAt: Date;
}

export interface PolicyInput {
  userId: string;
  coverageAmount: number;
  location: Location;
  triggers: DisruptionType[];
}

// ============================================================================
// RISK ENGINE TYPES
// ============================================================================

export interface RiskAssessment {
  userId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  timestamp: Date;
}

export interface RiskFactor {
  name: string;
  weight: number; // 0-1
  contribution: number; // risk score contribution
  description: string;
}

export interface RiskData {
  location: Location;
  historicalClaims: number;
  weatherPattern: string;
  trafficPattern: string;
  userBehavior: string;
}

// ============================================================================
// PREMIUM ENGINE TYPES
// ============================================================================

export interface PremiumCalculation {
  basePremium: number;
  riskAdjustment: number;
  locationMultiplier: number;
  finalPremium: number;
  breakdown: PremiumBreakdown;
}

export interface PremiumBreakdown {
  baseRate: number; // percentage of coverage
  riskMarkup: number; // amount
  locationFactor: number; // multiplier
  adminFee: number;
  taxes: number;
}

export interface PremiumInput {
  coverageAmount: number;
  riskLevel: RiskLevel;
  location: Location;
  triggers: DisruptionType[];
}

// ============================================================================
// TRIGGER ENGINE TYPES
// ============================================================================

export interface DisruptionEvent {
  id: string;
  type: DisruptionType;
  severity: number; // 0-100
  location: Location;
  startTime: Date;
  endTime?: Date;
  description: string;
  confidence: number; // 0-1
  dataSource: string;
}

export interface TriggerEvaluation {
  policyId: string;
  disruption: DisruptionEvent;
  triggersPolicy: boolean;
  reason: string;
  confidence: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
}

export interface TrafficData {
  congestionLevel: number; // 0-100
  averageSpeed: number;
  incidentCount: number;
  delayAverage: number;
}

export interface PlatformStatus {
  appStatus: "up" | "degraded" | "down";
  estimatedDowntime: number;
  affectedAreas: string[];
}

// ============================================================================
// CLAIMS ENGINE TYPES
// ============================================================================

export interface Claim {
  id: string;
  policyId: string;
  userId: string;
  claimAmount: number;
  status: ClaimStatus;
  triggerType: DisruptionType;
  triggerData: Record<string, any>;
  createdAt: Date;
  processedAt?: Date;
  triggeredAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  failureReason?: string;
}

export interface ClaimProcessing {
  claimId: string;
  userId: string;
  policyId: string;
  disruption: DisruptionEvent;
  riskAssessment: RiskAssessment;
  fraudScore: number;
  recommendation: "approve" | "reject" | "manual_review";
  processingLog: ProcessingStep[];
}

export interface ProcessingStep {
  step: string;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
  details?: string;
}

// ============================================================================
// FRAUD DETECTION TYPES
// ============================================================================

export interface FraudAssessment {
  claimId: string;
  fraudScore: number; // 0-100, higher = more suspicious
  riskLevel: "low" | "medium" | "high";
  flags: FraudFlag[];
  recommendation: "approve" | "reject" | "manual_review";
  timestamp: Date;
}

export interface FraudFlag {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  weight: number; // contribution to fraud score
}

export interface UserBehaviorAnalysis {
  userId: string;
  claimsPerMonth: number;
  claimApprovalRate: number;
  averageClaimAmount: number;
  suspiciousPatterns: string[];
  lastClaimDate: Date;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface Payment {
  id: string;
  claimId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  processedAt?: Date;
  completedAt?: Date;
  failureReason?: string;
  transactionId?: string;
}

export interface PaymentSimulation {
  amount: number;
  method: string;
  simulatedTime: number; // milliseconds
  successRate: number; // 0-1
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  totalClaims: number;
  claimsThisMonth: number;
  totalPayouts: number;
  paidOutThisMonth: number;
  averageClaimAmount: number;
  approvalRate: number;
  timestamp: Date;
}

export interface UserAnalytics {
  userId: string;
  claimHistory: Claim[];
  avgClaimAmount: number;
  claimFrequency: number;
  approvalRate: number;
  fraudRiskScore: number;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface SystemEvent {
  id: string;
  type: string;
  source: string;
  data: Record<string, any>;
  timestamp: Date;
  severity: "info" | "warning" | "error";
}
