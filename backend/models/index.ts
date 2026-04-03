/**
 * Data models and schemas for database persistence
 * Compatible with MongoDB, PostgreSQL, or other databases
 */

import {
  User,
  Policy,
  Claim,
  Payment,
  RiskAssessment,
  DisruptionEvent,
  FraudAssessment,
} from "../types";

/**
 * Base model with common fields
 */
export interface BaseModel {
  _id?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * User Schema
 */
export interface UserModel extends BaseModel, User {}

export const UserSchema = {
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    zone: String,
    latitude: Number,
    longitude: Number,
    riskMultiplier: Number,
  },
  activePolicy: { type: String }, // Policy ID
  kycVerified: { type: Boolean, default: false },
  riskScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
};

/**
 * Policy Schema
 */
export interface PolicyModel extends BaseModel, Policy {}

export const PolicySchema = {
  userId: { type: String, required: true, index: true },
  coverageAmount: { type: Number, required: true },
  weeklyPremium: { type: Number, required: true },
  riskLevel: { type: String, enum: ["low", "medium", "high"] },
  status: { type: String, enum: ["active", "expired", "cancelled"] },
  startDate: Date,
  endDate: Date,
  triggers: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
};

/**
 * Claim Schema
 */
export interface ClaimModel extends BaseModel, Claim {}

export const ClaimSchema = {
  policyId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  claimAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["triggered", "processing", "approved", "rejected", "paid"],
  },
  triggerType: String,
  triggerData: {},
  createdAt: { type: Date, default: Date.now },
  triggeredAt: Date,
  processedAt: Date,
  approvedAt: Date,
  paidAt: Date,
  failureReason: String,
  updatedAt: { type: Date, default: Date.now },
};

/**
 * Payment Schema
 */
export interface PaymentModel extends BaseModel, Payment {}

export const PaymentSchema = {
  claimId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
  },
  paymentMethod: String,
  processedAt: Date,
  completedAt: Date,
  failureReason: String,
  transactionId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
};

/**
 * Risk Assessment Schema
 */
export interface RiskAssessmentModel extends BaseModel, RiskAssessment {}

export const RiskAssessmentSchema = {
  userId: { type: String, required: true, index: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ["low", "medium", "high"] },
  factors: [
    {
      name: String,
      weight: Number,
      contribution: Number,
      description: String,
    },
  ],
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
};

/**
 * Fraud Assessment Schema
 */
export interface FraudAssessmentModel extends BaseModel, FraudAssessment {}

export const FraudAssessmentSchema = {
  claimId: { type: String, required: true, index: true },
  fraudScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ["low", "medium", "high"] },
  flags: [
    {
      type: String,
      severity: String,
      description: String,
      weight: Number,
    },
  ],
  recommendation: { type: String, enum: ["approve", "reject", "manual_review"] },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
};

/**
 * Disruption Event Schema
 */
export interface DisruptionEventModel extends BaseModel, DisruptionEvent {}

export const DisruptionEventSchema = {
  type: {
    type: String,
    enum: ["rain", "heat", "traffic", "platform_down", "other"],
  },
  severity: { type: Number, min: 0, max: 100 },
  location: {
    zone: String,
    latitude: Number,
    longitude: Number,
  },
  startTime: Date,
  endTime: Date,
  description: String,
  confidence: { type: Number, min: 0, max: 1 },
  dataSource: String,
  createdAt: { type: Date, default: Date.now },
};

/**
 * Mock database store (for development/testing)
 * Replace with actual database implementation
 */
export class DataStore {
  private users: Map<string, UserModel> = new Map();
  private policies: Map<string, PolicyModel> = new Map();
  private claims: Map<string, ClaimModel> = new Map();
  private payments: Map<string, PaymentModel> = new Map();
  private riskAssessments: Map<string, RiskAssessmentModel> = new Map();
  private fraudAssessments: Map<string, FraudAssessmentModel> = new Map();
  private disruptions: Map<string, DisruptionEventModel> = new Map();

  // User operations
  async saveUser(user: UserModel): Promise<UserModel> {
    this.users.set(user.id || user._id || "", user);
    return user;
  }

  async getUser(id: string): Promise<UserModel | null> {
    return this.users.get(id) || null;
  }

  // Policy operations
  async savePolicy(policy: PolicyModel): Promise<PolicyModel> {
    this.policies.set(policy.id || policy._id || "", policy);
    return policy;
  }

  async getPolicyByUserId(userId: string): Promise<PolicyModel | null> {
    for (const policy of this.policies.values()) {
      if (policy.userId === userId && policy.status === "active") {
        return policy;
      }
    }
    return null;
  }

  // Claim operations
  async saveClaim(claim: ClaimModel): Promise<ClaimModel> {
    this.claims.set(claim.id || claim._id || "", claim);
    return claim;
  }

  async getClaim(id: string): Promise<ClaimModel | null> {
    return this.claims.get(id) || null;
  }

  async getClaimsByUserId(userId: string): Promise<ClaimModel[]> {
    const userClaims: ClaimModel[] = [];
    for (const claim of this.claims.values()) {
      if (claim.userId === userId) {
        userClaims.push(claim);
      }
    }
    return userClaims;
  }

  // Payment operations
  async savePayment(payment: PaymentModel): Promise<PaymentModel> {
    this.payments.set(payment.id || payment._id || "", payment);
    return payment;
  }

  async getPaymentsByClaimId(claimId: string): Promise<PaymentModel[]> {
    const claimPayments: PaymentModel[] = [];
    for (const payment of this.payments.values()) {
      if (payment.claimId === claimId) {
        claimPayments.push(payment);
      }
    }
    return claimPayments;
  }

  // Disruption operations
  async saveDisruption(
    disruption: DisruptionEventModel
  ): Promise<DisruptionEventModel> {
    this.disruptions.set(disruption.id || disruption._id || "", disruption);
    return disruption;
  }

  async getDisruptionsByLocation(zone: string): Promise<DisruptionEventModel[]> {
    const disruptionList: DisruptionEventModel[] = [];
    for (const disruption of this.disruptions.values()) {
      if (disruption.location.zone === zone) {
        disruptionList.push(disruption);
      }
    }
    return disruptionList;
  }
}

// Global data store instance
export const dataStore = new DataStore();
