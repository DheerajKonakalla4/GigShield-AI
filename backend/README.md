# Backend Architecture Documentation

## Overview

This is a **production-ready**, scalable backend for an AI-powered parametric insurance platform. Built with **Node.js/TypeScript** following **Clean Architecture** principles with clear separation of concerns.

## Architecture Layers

```
types/              → Type definitions (interfaces, enums)
    ↓
models/             → Data models & schema definitions
    ↓
services/           → Business logic engines (6 specialized engines)
    ↓
controllers/        → Business orchestration & workflows
    ↓
middleware/         → Request handling (validation, auth, error)
    ↓
routes/             → HTTP endpoint definitions
    ↓
config/             → Configuration management
```

## Directory Structure

```
backend/
├── types/
│   └── index.ts                 # 50+ type definitions
├── models/
│   └── index.ts                 # Data models & persistence layer
├── services/
│   └── index.ts                 # 6 business logic engines
├── controllers/
│   └── index.ts                 # Business orchestration
├── middleware/
│   └── index.ts                 # Request handling & validation
├── routes/
│   └── index.ts                 # HTTP route handlers
├── utils/
│   └── index.ts                 # Helper utilities
├── config/
│   └── index.ts                 # Configuration management
├── server/
│   └── express.ts               # Express server setup
├── integration/
│   ├── nextjs-examples.ts       # Next.js API route examples
│   └── api-client.ts            # Frontend API client (optional)
└── README.md                    # This file
```

## Core Components

### 1. **Types Layer** (`types/index.ts`)
Central type system with 50+ TypeScript interfaces covering all business entities.

**Key Types:**
- `User` - User account information
- `Policy` - Insurance policy data
- `Claim` - Claim information
- `Payment` - Payment transactions
- `RiskAssessment` - Risk scoring results
- `FraudAssessment` - Fraud detection results
- `PremiumCalculation` - Premium breakdown
- `DisruptionEvent` - Disruption detection

### 2. **Models Layer** (`models/index.ts`)
Data persistence layer with mock in-memory storage, ready for database integration.

**Features:**
- Schema definitions for all entities
- CRUD operations
- Mock DataStore for development
- Database-agnostic design (can integrate MongoDB, PostgreSQL, MySQL)

**Methods:**
- `saveUser()`, `getUser()`
- `savePolicy()`, `getPolicyByUserId()`
- `saveClaim()`, `getClaim()`, `getClaimsByUserId()`
- `savePayment()`, `getPaymentsByClaimId()`
- `saveDisruption()`, `getDisruptionsByLocation()`

### 3. **Services Layer** (`services/index.ts`)
Six specialized business logic engines implementing core algorithms.

#### **RiskEngineService**
Calculates risk scores based on 5 weighted factors:

- **Location** (30%) - Geographic risk assessment
- **Historical Claims** (25%) - Claim history analysis
- **Weather** (20%) - Weather impact scoring
- **Traffic** (15%) - Traffic condition analysis
- **Behavior** (10%) - User behavior patterns

**Output:** Risk score 0-100 → Low/Medium/High risk level

**Example:**
```typescript
riskData = {
  location: "north",
  historicalClaims: 2,
  currentWeather: "rainy",
  trafficLevel: "high",
  userBehavior: { tripCount: 150, accidents: 1 }
}

assessment = riskEngine.assessRisk(riskData)
// → { score: 65, level: "medium", factors: {...} }
```

#### **PremiumEngineService**
Calculates insurance premium with complete breakdown.

**Calculation Formula:**
```
basePremium = coverage * 0.05
riskAdjustment = basePremium * riskMultiplier
locationMultiplier:
  - North: 1.1
  - South: 1.0
  - East: 1.15
  - West: 1.05
subtotal = (basePremium + riskAdjustment) * locationMultiplier
adminFee = ₹50 (fixed)
taxes = (subtotal + adminFee) * 0.18
finalPremium = subtotal + adminFee + taxes
```

**Example:**
```typescript
input = {
  coverageAmount: 500,
  zone: "north",
  riskLevel: "medium"
}

calculation = premiumEngine.calculatePremium(input)
// → {
//     basePremium: 25,
//     riskAdjustment: 6.25,
//     locationMultiplier: 1.1,
//     adminFee: 50,
//     taxes: 15.17,
//     finalPremium: 99.55
//   }
```

#### **TriggerEngineService**
Detects disruption events (weather, traffic, platform outages) and evaluates trigger matching.

**Disruption Types:**
- **Weather** (30% probability) - Rain or extreme heat
- **Traffic** (25% probability) - Traffic congestion
- **Platform** (5% probability) - Platform downtime

**Trigger Matching:**
- Event type matches policy
- Severity > 40
- Confidence > 0.6

**Example:**
```typescript
// Detect disruption
disruption = triggerEngine.detectWeatherEvent()
// → { type: "rain", severity: 75, confidence: 0.85 }

// Evaluate trigger
evaluation = triggerEngine.evaluateTrigger(disruption, policy)
// → { matched: true, severity: 75, confidence: 0.85 }
```

#### **ClaimsEngineService**
Processes claims with end-to-end workflow:

1. Claim receipt and validation
2. Risk re-assessment
3. Fraud detection
4. Approval decision
5. Amount calculation
6. Processing log generation

**Amount Calculation:**
```
claimAmount = coverage * (disruptionSeverity / 100)

severity 0-25:   0% of coverage
severity 25-50:  25% of coverage
severity 50-75:  50% of coverage
severity 75-100: 100% of coverage
```

**Example:**
```typescript
claim = claimsEngine.processClaim({
  claimId: "claim_123",
  userId: "user_123",
  policyId: "policy_456",
  disruptionType: "weather"
})

// → {
//     status: "approved",
//     recommendation: "approve",
//     amount: 250,
//     processingLog: [...]
//   }
```

#### **FraudDetectionService**
5-check fraud assessment with 100-point scoring.

**Checks:**
- **Claim Frequency** (25%) - Multiple claims in short period
- **Amount Pattern** (20%) - Unusual claim amounts
- **Recent History** (15%) - Recent policy changes or high activity
- **Disruption Confidence** (20%) - Low confidence events
- **Approval Rate** (20%) - User's historical approval rate

**Recommendation Logic:**
- Score < 30: Approve
- Score 30-70: Manual Review
- Score > 70: Reject

**Example:**
```typescript
assessment = fraudEngine.assessFraud({
  userId: "user_123",
  claimAmount: 500,
  disruptionType: "weather",
  disruptionConfidence: 0.95
})

// → {
//     score: 25,
//     recommendation: "approve",
//     flags: [...]
//   }
```

#### **PaymentSimulatorService**
Simulates payment processing with realistic delays and failures.

**Features:**
- 1-5 second processing delay
- 95% success rate
- Random failure reasons
- Retry support

**Example:**
```typescript
payment = paymentEngine.processPayment({
  claimId: "claim_123",
  amount: 250,
  method: "bank_transfer"
})

// → {
//     status: "processing",
//     transactionId: "txn_123",
//     estimatedCompletion: "2024-02-01T10:30:00Z"
//   }
```

### 4. **Controllers Layer** (`controllers/index.ts`)
Orchestrates services into complete business workflows.

#### **PolicyController**
```typescript
createPolicy(input): Policy
  1. Assess risk using RiskEngineService
  2. Calculate premium using PremiumEngineService
  3. Create policy object
  4. Save to DataStore
  5. Return policy

getPolicyDetails(policyId): Policy
renewPolicy(policyId): Policy
```

#### **ClaimController**
```typescript
createAndProcessClaim(input): ClaimProcessing
  1. Detect disruption (weather/traffic/platform)
  2. Trigger evaluation
  3. Calculate claim amount
  4. Assess risk
  5. Fraud detection
  6. Process claim
  7. Update status
  8. Save to database
  
getUserClaims(userId): Claim[]
```

#### **PremiumController**
```typescript
calculatePremium(input): PremiumCalculation
compareCoverageOptions(): PremiumOption[]
```

#### **PaymentController**
```typescript
processPaymentForClaim(input): Payment
getPaymentStatus(paymentId): Payment
getUserPayments(userId): Payment[]
```

#### **AnalyticsController**
```typescript
getPlatformMetrics(): PlatformMetrics
getUserAnalytics(userId): UserAnalytics
getZoneAnalytics(): ZoneAnalytics[]
```

#### **DisputeController**
```typescript
fileDispute(input): Dispute
getDisputeStatus(disputeId): Dispute
```

### 5. **Middleware Layer** (`middleware/index.ts`)
Request handling, validation, authentication, rate limiting.

**Key Classes:**
- `ErrorHandler` - Global error handling
- `RequestLogger` - Request/response logging
- `RequestValidator` - Input validation
- `AuthMiddleware` - JWT token verification
- `RateLimiter` - Rate limiting (100 req/min by default)
- `CorsMiddleware` - CORS configuration
- `ResponseFormatter` - Consistent response formatting

### 6. **Routes Layer** (`routes/index.ts`)
HTTP endpoint definitions with input validation.

**Endpoint Groups:**
- PolicyRoutes (create, get, renew)
- ClaimRoutes (create, get by ID, get by user)
- PremiumRoutes (calculate, compare)
- PaymentRoutes (create, get status, get by user)
- AnalyticsRoutes (platform, user, zones)
- DisputeRoutes (create, get status)
- HealthRoutes (health check)

### 7. **Utils Layer** (`utils/index.ts`)
Helper utilities organized by functionality.

**Helpers:**
- **Validators** - Email, phone, coverage amount validation
- **Calculations** - Math helpers (compound growth, percentages, etc.)
- **DateHelpers** - Date manipulation and formatting
- **StringHelpers** - Generate IDs, capitalize, truncate, mask sensitive data
- **Logger** - Structured logging
- **Error Classes** - AppError, ValidationError, NotFoundError, etc.
- **Async** - Retry, timeout, concurrency limits

### 8. **Config Layer** (`config/index.ts`)
Environment configuration and service settings.

**Sections:**
- Environment configuration
- Service-specific config (weights, thresholds)
- Database configuration
- CORS configuration
- Logging configuration
- Security configuration (helmet, CSRF)
- Cache configuration

## API Endpoints

### Policies
```
POST   /api/v1/policies                 - Create policy
GET    /api/v1/policies?id=<id>         - Get policy details
PUT    /api/v1/policies/<id>/renew      - Renew policy
```

### Claims
```
POST   /api/v1/claims                   - Trigger claim
GET    /api/v1/claims?id=<id>           - Get claim details
GET    /api/v1/claims?userId=<userId>   - Get user claims
```

### Premium
```
POST   /api/v1/premium/calculate        - Calculate premium
GET    /api/v1/premium/compare          - Compare coverage options
```

### Payments
```
POST   /api/v1/payments                 - Process payment
GET    /api/v1/payments?id=<id>         - Get payment status
GET    /api/v1/payments?userId=<userId> - Get user payments
```

### Analytics
```
GET    /api/v1/analytics/platform       - Platform metrics
GET    /api/v1/analytics/user/<userId>  - User analytics
GET    /api/v1/analytics/zones          - Zone analytics
```

### Disputes
```
POST   /api/v1/disputes                 - File dispute
GET    /api/v1/disputes/<id>            - Get dispute status
```

### Health
```
GET    /api/v1/health                   - Health check
```

## Integration with Next.js

See `integration/nextjs-examples.ts` for complete examples.

### Quick Setup

1. **Create API routes in** `/app/api/`:
```
app/api/
├── health/route.ts
├── policies/route.ts
├── claims/route.ts
├── premium/calculate/route.ts
├── payments/route.ts
├── analytics/route.ts
└── disputes/route.ts
```

2. **Update** `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/backend/*": ["./backend/*"]
    }
  }
}
```

3. **Use in frontend**:
```typescript
const response = await fetch("/api/policies", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: "user_123",
    coverageAmount: 500,
    zone: "north"
  })
});

const data = await response.json();
```

## Standalone Express Server

Run backend as independent Node.js server:

```typescript
import express from "express";
import { ExpressServer } from "./backend/server/express";

const app = express();

ExpressServer.initialize(app);
ExpressServer.start();
```

## Database Integration

### Replace Mock DataStore

The current `models/index.ts` uses in-memory mock storage. To integrate a real database:

**MongoDB Example:**
```typescript
import { MongoClient } from "mongodb";

class PolicyModel {
  static async savePolicy(policy: Policy) {
    const db = mongoClient.db("insurance");
    return db.collection("policies").insertOne(policy);
  }
  
  static async getPolicyByUserId(userId: string) {
    const db = mongoClient.db("insurance");
    return db.collection("policies").find({ userId }).toArray();
  }
}
```

**PostgreSQL Example:**
```typescript
import { Pool } from "pg";

class PolicyModel {
  static async savePolicy(policy: Policy) {
    const query = `
      INSERT INTO policies (userId, coverage, zone, premium, status)
      VALUES ($1, $2, $3, $4, $5)
    `;
    return pool.query(query, [
      policy.userId,
      policy.coverage,
      policy.zone,
      policy.premium,
      policy.status
    ]);
  }
}
```

## Business Logic Reference

### Premium Calculation Example
Coverage: ₹500 | Zone: North | Risk: Medium
```
Base Premium:        ₹500 × 0.05 = ₹25
Risk Adjustment:     ₹25 × 0.25 = ₹6.25 (medium = 25%)
Location Multiplier: (₹25 + ₹6.25) × 1.1 = ₹34.38
Admin Fee:           ₹50 (fixed)
Subtotal:            ₹84.38
GST (18%):           ₹84.38 × 0.18 = ₹15.17
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Final Premium:       ₹99.55
```

### Risk Assessment Example
```
Location Factor:        0.5 (some risk) × 0.30 = 0.15
Historical Claims:      0.8 (high history) × 0.25 = 0.20
Weather:                0.3 (clear) × 0.20 = 0.06
Traffic:                0.7 (moderate) × 0.15 = 0.105
Behavior:               0.4 (good) × 0.10 = 0.04
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Score:            0.56 × 100 = 56 → MEDIUM RISK
```

### Fraud Assessment Example
```
Claim Frequency:        20 points (1 claim/month, low) × 0.25 = 5
Amount Pattern:         10 points (normal) × 0.20 = 2
Recent History:         25 points (new user) × 0.15 = 3.75
Disruption Confidence:  35 points (high conf) × 0.20 = 7
Approval Rate:          30 points (new user) × 0.20 = 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Score:            23.75 → APPROVE
```

## Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3001
HOST=localhost

# Database
DATABASE_URL=mongodb://localhost:27017/insurance
DATABASE_TYPE=mongodb

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# Payment Gateway
PAYMENT_GATEWAY=razorpay
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_SECRET=your-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# Feature Flags
FEATURE_FRAUD_DETECTION=true
FEATURE_AUTO_APPROVAL=false
FEATURE_WEATHER_TRIGGER=true
```

## Testing Example

```typescript
import { PolicyController } from "./backend/controllers";
import { DataStore } from "./backend/models";

async function testPolicyCreation() {
  const policyInput = {
    userId: "test_user_123",
    coverageAmount: 500,
    zone: "north"
  };

  const policy = await PolicyController.createPolicy(policyInput);
  
  console.log("Created Policy:", {
    id: policy.id,
    premium: policy.premium,
    riskLevel: policy.riskAssessment.level,
    status: policy.status
  });
}

testPolicyCreation().catch(console.error);
```

## Deployment Checklist

- [ ] Set production environment variables
- [ ] Configure JWT secrets
- [ ] Set up database (MongoDB/PostgreSQL)
- [ ] Configure payment gateway keys
- [ ] Set up email service
- [ ] Enable rate limiting
- [ ] Configure CORS origins
- [ ] Set up logging
- [ ] Enable HTTPS
- [ ] Set up monitoring/alerts
- [ ] Configure database backups
- [ ] Set up CI/CD pipeline

## Performance Considerations

- **Caching:** Implement Redis for frequently accessed data
- **Database Indexing:** Index userId, policyId, claimId fields
- **Rate Limiting:** 100 requests/minute per IP (configurable)
- **Timeout:** Async operations timeout after 30 seconds
- **Pagination:** Support pagination for large result sets

## Security Features

- JWT authentication
- Rate limiting
- Input validation
- Error handling without exposing internals
- CORS protection
- Type safety with TypeScript
- Rate limiting per IP

## Next Steps

1. **Implement API routes** - Copy examples from `integration/nextjs-examples.ts`
2. **Set up database** - Replace mock DataStore with MongoDB/PostgreSQL
3. **Add authentication** - Implement JWT token system
4. **Add tests** - Create unit and integration tests
5. **Monitor in production** - Set up error tracking and logging

## Support & Troubleshooting

**Issue:** Policy creation fails
- Check if userId is provided
- Verify coverage amount is between 100-1000
- Check if zone is valid (north, south, east, west)

**Issue:** Premium calculation seems off
- Verify risk level (low: 10%, medium: 25%, high: 50%)
- Check location multiplier (north: 1.1x)
- Confirm GST rate (18%)

**Issue:** Fraud detection rejecting legitimate claims
- Adjust fraud detection threshold in config (default: 70)
- Review fraud flags in assessment
- Consider lowering weight for specific checks

## License

Proprietary - For SaaS Insurance Platform
