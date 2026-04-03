# Claims Engine Documentation

Complete API and integration guide for the Insurance Platform Claims Processing System.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Claim Lifecycle](#claim-lifecycle)
- [API Endpoints](#api-endpoints)
- [React Hooks](#react-hooks)
- [Payout Calculation](#payout-calculation)
- [Examples](#examples)
- [Integration Guide](#integration-guide)

---

## Overview

The Claims Engine automates the entire lifecycle of insurance claims from creation through payment. It features:

- **Automatic Claim Creation**: Claims triggered automatically from disruption events
- **Intelligent Payout Calculation**: Based on coverage, duration, and risk level
- **Claim Lifecycle Management**: CREATED → PROCESSING → APPROVED → PAID
- **Real-time Processing**: Auto-process claims based on configurable timelines
- **User History Tracking**: Complete claim history per policy holder
- **Premium UI Dashboard**: Real-time monitoring and management

### Key Features

✅ Auto-create claims from trigger events
✅ Payout = coverage × disruption_factor × risk_multiplier
✅ 5-status lifecycle with automatic transitions
✅ User claim history storage
✅ Auto-processing with configurable timelines (1h, 24h, 48h)
✅ Structured JSON API responses
✅ Type-safe React integration

---

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────┐
│            Claims Engine System                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┐        ┌──────────────────┐  │
│  │ Trigger Event    │ ─────→ │ ClaimsEngine     │  │
│  │ (from Triggers)  │        │ .createFromTrig()│  │
│  └──────────────────┘        └──────────────────┘  │
│                                       │              │
│                                       ↓              │
│  ┌──────────────────┐        ┌──────────────────┐  │
│  │ API Routes       │ ←───→  │ Claim Storage    │  │
│  │ /api/claims      │        │ (In-memory Map)  │  │
│  │ /api/create-claim│        │                  │  │
│  └──────────────────┘        └──────────────────┘  │
│         ↑                             ↑              │
│         └─────────────┬───────────────┘              │
│                       │                             │
│  ┌───────────────────────────────────────────────┐  │
│  │ React Components                              │  │
│  │ - ClaimsDashboard                            │  │
│  │ - ClaimCard                                  │  │
│  │ - StatisticsOverview                         │  │
│  └───────────────────────────────────────────────┘  │
│                       ↑                             │
│  ┌────────────────────────────────────────├──────┐  │
│  │ React Hooks                                  │  │
│  │ - useGetClaims                              │  │
│  │ - useCreateClaimFromTrigger                 │  │
│  │ - useApproveClaim                           │  │
│  │ - useAutoRefreshClaims                      │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Data Models

**Claim Object**
```typescript
{
  id: string;                    // Unique claim ID
  userId: string;                // Policy holder ID
  triggerId?: string;            // Trigger that created claim
  status: ClaimStatus;           // CREATED|PROCESSING|APPROVED|PAID|REJECTED
  reason: ClaimReason;           // Reason for claim
  zone: string;                  // Affected zone
  
  // Coverage & Risk
  coverageAmount: number;        // Policy coverage in ₹
  disruptionDuration: number;    // Duration in hours
  riskLevel: string;             // LOW|MEDIUM|HIGH|CRITICAL
  
  // Payout Calculation
  disruptionFactor: number;      // 0-1 based on duration
  riskMultiplier: number;        // 1-2 based on risk
  payoutAmount: number;          // Calculated payout
  
  // Timeline
  createdAt: Date;
  processingStartedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  
  // Status History
  statusHistory: StatusChange[];
}
```

---

## Claim Lifecycle

### State Diagram

```
    ┌─────────┐
    │ CREATED │
    └────┬────┘
         │
         ▼ (Auto 1h)
    ┌───────────┐
    │PROCESSING │◄─────────────┐
    └────┬──────┘              │
         │                     │Manual Reject
         ├──(Auto 24h)──►┌─────────┐
         │               │APPROVED │
         │               └────┬────┘
         │                    │ (Auto 48h)
         │                    ▼
         │               ┌──────┐
         │               │ PAID │
         │               └──────┘
         │
         └─(Reject)──► ┌─────────┐
                       │REJECTED │
                       └─────────┘
```

### Timeline Configuration

```javascript
PAYOUT_CONFIGURATION.PROCESSING_TIME = {
  AUTO_PROCESS: 3600000,    // 1 hour (CREATED → PROCESSING)
  AUTO_APPROVE: 86400000,   // 24 hours (PROCESSING → APPROVED)
  AUTO_PAY: 172800000,      // 48 hours (APPROVED → PAID)
};
```

---

## Payout Calculation

### Formula

```
payout = coverage_amount × disruption_factor × risk_multiplier
```

### Disruption Factor (Duration-based)

| Duration | Factor | Example Coverage | Payout |
|----------|--------|------------------|--------|
| < 2 hrs | 0.25 | ₹1000 | ₹250 |
| 2-6 hrs | 0.50 | ₹1000 | ₹500 |
| 6-12 hrs | 0.75 | ₹1000 | ₹750 |
| > 12 hrs | 1.00 | ₹1000 | ₹1000 |

### Risk Multiplier (Risk Level-based)

| Risk Level | Multiplier | Example Coverage | Payout |
|------------|-----------|------------------|--------|
| LOW | 0.8x | ₹1000 | ₹800 |
| MEDIUM | 1.0x | ₹1000 | ₹1000 |
| HIGH | 1.2x | ₹1000 | ₹1200 |
| CRITICAL | 1.5x | ₹1000 | ₹1500 |

### Complete Example

```
Coverage: ₹600
Duration: 8 hours → Disruption Factor: 0.75
Risk Level: HIGH → Risk Multiplier: 1.2x

Payout = 600 × 0.75 × 1.2 = ₹540
Max Limit = 600 × 0.8 = ₹480 (applied)
Final Payout = ₹480
```

---

## API Endpoints

### POST /api/create-claim

**Create a new insurance claim**

**Request (Trigger-based)**
```bash
curl -X POST http://localhost:3000/api/create-claim \
  -H "Content-Type: application/json" \
  -d '{
    "source": "trigger",
    "triggerId": "trigger_abc123",
    "userId": "user_001"
  }'
```

**Request (Manual)**
```bash
curl -X POST http://localhost:3000/api/create-claim \
  -H "Content-Type: application/json" \
  -d '{
    "source": "manual",
    "userId": "user_001",
    "coverageAmount": 500,
    "disruptionDuration": 6.5,
    "riskLevel": "HIGH",
    "description": "Service disruption on March 19"
  }'
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "claim": {
      "id": "claim_1710901234_xyz789",
      "userId": "user_001",
      "userName": "Rajesh Kumar",
      "userEmail": "rajesh@example.com",
      "triggerId": "trigger_abc123",
      "status": "CREATED",
      "reason": "RAIN_DISRUPTION",
      "zone": "north",
      "coverageAmount": 500,
      "disruptionDuration": 6.2,
      "riskLevel": "HIGH",
      "disruptionFactor": 0.75,
      "riskMultiplier": 1.2,
      "payoutAmount": 450,
      "description": "Heavy rainfall detected",
      "createdAt": "2026-03-19T10:30:00.000Z"
    },
    "message": "Claim claim_1710901234_xyz789 created successfully"
  }
}
```

### GET /api/claims

**Retrieve claims with filtering**

**Request**
```bash
# Get all claims
curl http://localhost:3000/api/claims

# Filter by user
curl "http://localhost:3000/api/claims?userId=user_001"

# Filter by status
curl "http://localhost:3000/api/claims?status=APPROVED"

# Filter by zone
curl "http://localhost:3000/api/claims?zone=north"

# Include full history
curl "http://localhost:3000/api/claims?history=true"
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "claims": [
      {
        "id": "claim_1710901234_xyz789",
        "userId": "user_001",
        "userName": "Rajesh Kumar",
        "status": "APPROVED",
        "reason": "RAIN_DISRUPTION",
        "zone": "north",
        "coverageAmount": 500,
        "disruptionDuration": 6.2,
        "riskLevel": "HIGH",
        "disruptionFactor": 0.75,
        "riskMultiplier": 1.2,
        "payoutAmount": 450,
        "createdAt": "2026-03-19T10:30:00.000Z",
        "approvedAt": "2026-03-19T11:45:00.000Z",
        "statusHistory": [
          {
            "status": "CREATED",
            "timestamp": "2026-03-19T10:30:00.000Z",
            "notes": "Claim auto-created from RAIN_ALERT"
          },
          {
            "status": "PROCESSING",
            "timestamp": "2026-03-19T11:30:00.000Z",
            "notes": "Auto-processed"
          },
          {
            "status": "APPROVED",
            "timestamp": "2026-03-19T11:45:00.000Z",
            "notes": "Cost review approved"
          }
        ]
      }
    ],
    "count": 1,
    "statistics": {
      "total": 42,
      "byStatus": {
        "CREATED": 2,
        "PROCESSING": 5,
        "APPROVED": 8,
        "PAID": 25,
        "REJECTED": 2
      },
      "byZone": {
        "north": 12,
        "south": 15,
        "east": 8,
        "west": 7
      },
      "totalPayout": 18500,
      "averagePayout": 440.48,
      "pendingCount": 7,
      "approvedCount": 8,
      "paidCount": 25
    }
  }
}
```

### POST /api/claims

**Manage claim status**

**Approve a Claim**
```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "claimId": "claim_1710901234_xyz789",
    "notes": "Verified and approved"
  }'
```

**Pay a Claim**
```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "action": "pay",
    "claimId": "claim_1710901234_xyz789",
    "notes": "Payment transferred to account"
  }'
```

**Reject a Claim**
```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reject",
    "claimId": "claim_1710901234_xyz789",
    "reason": "Coverage exclusion applies"
  }'
```

**Response (200 OK)**
```json
{
  "success": true,
  "action": "approve",
  "data": {
    "id": "claim_1710901234_xyz789",
    "userId": "user_001",
    "userName": "Rajesh Kumar",
    "status": "APPROVED",
    "reason": "RAIN_DISRUPTION",
    "zone": "north",
    "payoutAmount": 450,
    "createdAt": "2026-03-19T10:30:00.000Z",
    "statusHistory": [
      {
        "status": "CREATED",
        "timestamp": "2026-03-19T10:30:00.000Z"
      },
      {
        "status": "PROCESSING",
        "timestamp": "2026-03-19T11:30:00.000Z"
      },
      {
        "status": "APPROVED",
        "timestamp": "2026-03-19T12:00:00.000Z"
      }
    ]
  }
}
```

### GET /api/create-claim

**Trigger auto-processing of pending claims**

**Request**
```bash
curl http://localhost:3000/api/create-claim
```

**Response (200 OK)**
```json
{
  "success": true,
  "action": "auto-process",
  "data": {
    "processed": 5,
    "approved": 3,
    "paid": 2,
    "statistics": {
      "total": 42,
      "pendingCount": 7,
      "approvedCount": 8,
      "paidCount": 25,
      "totalPayout": 18500,
      "averagePayout": 440.48
    }
  }
}
```

---

## React Hooks

### useGetClaims

Fetch claims with optional filtering

```typescript
const { claims, statistics, loading, error, refetch } = useGetClaims({
  userId: "user_001",
  status: "APPROVED",
  zone: "north"
});

return (
  <div>
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}
    <div>
      {claims.map((claim) => (
        <div key={claim.id}>{claim.reason}</div>
      ))}
    </div>
  </div>
);
```

### useCreateClaimFromTrigger

Create a claim from a trigger event

```typescript
const { createClaim, loading, error } = useCreateClaimFromTrigger();

const handleCreateClaim = async () => {
  const claim = await createClaim("trigger_123", "user_001");
  if (claim) {
    console.log("Created claim:", claim.id);
  }
};

return (
  <button onClick={handleCreateClaim} disabled={loading}>
    {loading ? "Creating..." : "Create Claim"}
  </button>
);
```

### useApproveClaim

Approve a pending claim

```typescript
const { approveClaim, loading, error } = useApproveClaim();

const handleApprove = async (claimId: string) => {
  const updated = await approveClaim(claimId, "Approved by admin");
  if (updated) {
    console.log("Claim approved:", updated.status);
  }
};
```

### usePayClaim

Pay an approved claim

```typescript
const { payClaim, loading, error } = usePayClaim();

const handlePay = async (claimId: string) => {
  const updated = await payClaim(claimId, "Paid to account");
  if (updated) {
    console.log("Claim paid:", updated.status);
  }
};
```

### useAutoRefreshClaims

Auto-refresh claims with polling

```typescript
// Refresh every 10 seconds
const { claims, statistics, loading } = useAutoRefreshClaims(10000, "user_001");

useEffect(() => {
  // Auto-updates every 10 seconds
}, [claims]);
```

### useAutoProcessClaims

Trigger auto-processing of pending claims

```typescript
const { autoProcess, loading, error } = useAutoProcessClaims();

const handleAutoProcess = async () => {
  const result = await autoProcess();
  if (result) {
    console.log(`Processed: ${result.processed}, Approved: ${result.approved}`);
  }
};
```

---

## Examples

### Example 1: Basic Claim Management

```typescript
import { useGetClaims, useApproveClaim, usePayClaim } from "@/hooks/useClaimsEngine";

export function ClaimManager() {
  const { claims, statistics } = useGetClaims();
  const { approveClaim } = useApproveClaim();
  const { payClaim } = usePayClaim();

  const processingClaims = claims.filter((c) => c.status === "PROCESSING");

  return (
    <div>
      <h2>Pending Claims: {processingClaims.length}</h2>
      {processingClaims.map((claim) => (
        <div key={claim.id}>
          <p>{claim.userName} - ₹{claim.payoutAmount}</p>
          <button onClick={() => approveClaim(claim.id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Auto-Processing Dashboard

```typescript
import { useAutoProcessClaims } from "@/hooks/useClaimsEngine";

export function AutoProcessDashboard() {
  const { autoProcess, loading } = useAutoProcessClaims();

  const handleProcessAll = async () => {
    const results = await autoProcess();
    console.log(`
      Processed: ${results.processed}
      Approved: ${results.approved}
      Paid: ${results.paid}
    `);
  };

  return (
    <button onClick={handleProcessAll} disabled={loading}>
      {loading ? "Processing..." : "Auto-Process Claims"}
    </button>
  );
}
```

### Example 3: Integration with Trigger System

```typescript
import { getTriggerEngine } from "@/backend/engines/trigger-engine";
import { getClaimsEngine } from "@/backend/engines/claims-engine";

// Auto-create claims from triggers
export async function syncTriggersToClaimsfunction syncTriggersToClaimsAPI() {
  const triggerEngine = getTriggerEngine();
  const claimsEngine = getClaimsEngine();

  // Get active triggers
  const triggers = triggerEngine.getActiveTriggers();

  // Create claims for each trigger
  triggers.forEach((trigger) => {
    const claim = claimsEngine.createClaimFromTrigger(trigger);
    console.log(`Created claim ${claim.id} for trigger ${trigger.id}`);
  });
}
```

---

## Integration Guide

### 1. Setup Claims Engine

```typescript
import { initializeClaimsEngine } from "@/backend/engines/claims-engine";

// Initialize on app startup
const claimsEngine = initializeClaimsEngine();
```

### 2. Create Claims Component

```typescript
import ClaimsDashboard from "@/components/ClaimsDashboard";

export default function ClaimsPage() {
  return (
    <div className="p-8">
      <ClaimsDashboard />
    </div>
  );
}
```

### 3. Handle Claim Events

```typescript
import { getTriggerEngine } from "@/backend/engines/trigger-engine";

const triggerEngine = getTriggerEngine();

// Subscribe to trigger events
triggerEngine.broker.subscribeAll((event) => {
  if (event.trigger.severity === "CRITICAL") {
    // Auto-create claims for critical triggers
    createClaimFromTrigger(event.trigger);
  }
});
```

### 4. Premium Adjustment Based on Claims

```typescript
export function adjustPremiumForClaims(userId: string, basePremium: number) {
  const claims = getClaimsEngine().getUserClaims(userId);
  const paidCount = claims.filter((c) => c.status === "PAID").length;
  
  // Increase premium by 2% per claim
  const multiplier = 1 + (paidCount * 0.02);
  return basePremium * multiplier;
}
```

---

## Best Practices

1. **Auto-Processing**: Let the system auto-process claims automatically
2. **Monitoring**: Track statistics for performance metrics
3. **User Alerts**: Notify users of claim status changes
4. **Customization**: Modify thresholds as needed
5. **Integration**: Connect with trigger, premium, and dashboard systems
6. **Testing**: Always test with mock data first

---

## Future Enhancements

- [ ] Database persistence (PostgreSQL)
- [ ] Real payment gateway integration
- [ ] SMS/Email notifications
- [ ] Mobile app claims tracking
- [ ] Advanced fraud detection
- [ ] Batch processing optimization
- [ ] API rate limiting
- [ ] Claims analytics dashboard
- [ ] Integration with real insurance APIs
- [ ] Machine learning for payout prediction

---

**Last Updated**: March 19, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
