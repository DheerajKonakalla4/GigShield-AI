# Claims Engine Integration Guide

Comprehensive guide for integrating the Claims Engine with your Insurance Platform.

## Quick Start

### 1. Access the Claims Dashboard

Navigate to `http://localhost:3000/claims` to view the premium claims management dashboard with:
- Real-time claim monitoring
- Statistics overview
- Status filtering
- Claim lifecycle management
- Auto-processing controls

### 2. Create a Claim from Trigger

```bash
# First, create a trigger
curl -X POST http://localhost:3000/api/trigger-event \
  -H "Content-Type: application/json" \
  -d '{"action":"detect"}'

# Then create a claim from the trigger
curl -X POST http://localhost:3000/api/create-claim \
  -H "Content-Type: application/json" \
  -d '{
    "source": "trigger",
    "triggerId": "trigger_id_here"
  }'
```

### 3. Auto-Process Claims

```bash
# Trigger auto-processing (CREATED → PROCESSING → APPROVED → PAID)
curl http://localhost:3000/api/create-claim
```

### 4. Integrate with React Components

```typescript
import ClaimsDashboard from "@/components/ClaimsDashboard";

export default function ClaimsPage() {
  return <ClaimsDashboard />;
}
```

---

## System Integration

### Claims ↔ Triggers Integration

Automatically create insurance claims when disruption triggers occur:

```typescript
import { getClaimsEngine } from "@/backend/engines/claims-engine";
import { getTriggerEngine } from "@/backend/engines/trigger-engine";

const claimsEngine = getClaimsEngine();
const triggerEngine = getTriggerEngine();

// Subscribe to all trigger events
triggerEngine.broker.subscribeAll((event) => {
  // Auto-create claims for critical triggers
  if (event.trigger.severity === "CRITICAL") {
    const claim = claimsEngine.createClaimFromTrigger(event.trigger);
    console.log(`Auto-created claim: ${claim.id} for trigger: ${event.trigger.id}`);
  }
});
```

### Claims ↔ Premium Integration

Adjust premiums based on claim history:

```typescript
import { getClaimsEngine } from "@/backend/engines/claims-engine";
import { getEnhancedPremiumEngine } from "@/backend/engines/enhanced-risk-premium";

export function calculateAdjustedPremium(userId: string, basePrice: number): number {
  const claimsEngine = getClaimsEngine();
  const premiumEngine = getEnhancedPremiumEngine();

  // Get paid claims for user
  const paidClaims = claimsEngine.getUserClaims(userId)
    .filter(claim => claim.status === "PAID");

  // Claim history multiplier (2% per claim)
  const claimMultiplier = 1 + (paidClaims.length * 0.02);

  // Apply to base premium
  return basePrice * claimMultiplier;
}
```

### Claims ↔ Dashboard Integration

Display claims metrics on main dashboard:

```typescript
import { useGetClaims } from "@/hooks/useClaimsEngine";

export function DashboardMetrics() {
  const { statistics } = useGetClaims();

  if (!statistics) return null;

  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard 
        label="Total Claims" 
        value={statistics.total} 
      />
      <MetricCard 
        label="Pending Claims" 
        value={statistics.pendingCount} 
      />
      <MetricCard 
        label="Total Payouts" 
        value={`₹${statistics.totalPayout}`} 
      />
      <MetricCard 
        label="Avg Payout" 
        value={`₹${statistics.averagePayout.toFixed(0)}`} 
      />
    </div>
  );
}
```

---

## Payment & Notification Integration

### Send Payment Notification

```typescript
import { getClaimsEngine } from "@/backend/engines/claims-engine";

export async function sendPaymentNotification(claimId: string) {
  const claimsEngine = getClaimsEngine();
  const claim = claimsEngine.getClaimById(claimId);

  if (!claim || claim.status !== "PAID") return;

  const message = `Your claim of ₹${claim.payoutAmount} has been paid to your account.`;
  const email = claim.user?.email;
  const phone = claim.user?.phone;

  // Send SMS
  await SMS.send({
    to: phone,
    message: `Insurance Claim Alert: ${message}. Claim ID: ${claim.id}`,
  });

  // Send Email
  await Email.send({
    to: email,
    subject: "Claim Payment Confirmation",
    body: `Your insurance claim has been processed and paid.\n\n${message}`,
  });
}
```

### Auto-Approve Claims Linked to Triggers

```typescript
export async function autoApproveTriggerClaims() {
  const claimsEngine = getClaimsEngine();
  const triggerEngine = getTriggerEngine();

  // Get all PROCESSING claims
  const processingClaims = claimsEngine.getClaimsByStatus("PROCESSING");

  processingClaims.forEach((claim) => {
    if (claim.triggerId) {
      // Check if trigger is still active
      const trigger = triggerEngine.getActiveTriggers()
        .find(t => t.id === claim.triggerId);

      if (trigger && trigger.severity === "CRITICAL") {
        // Auto-approve critical trigger-linked claims
        claimsEngine.approveClaim(claim.id, "Auto-approved for critical trigger");
      }
    }
  });
}
```

---

## Analytics & Reporting

### Generate Claims Report

```typescript
export function generateClaimsReport(startDate: Date, endDate: Date) {
  const claimsEngine = getClaimsEngine();
  const allClaims = claimsEngine.getAllClaims()
    .filter(c => c.createdAt >= startDate && c.createdAt <= endDate);

  return {
    period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    totalClaims: allClaims.length,
    approved: allClaims.filter(c => c.status === "APPROVED").length,
    paid: allClaims.filter(c => c.status === "PAID").length,
    rejected: allClaims.filter(c => c.status === "REJECTED").length,
    totalPayout: allClaims.reduce((sum, c) => sum + c.payoutAmount, 0),
    averagePayout: allClaims.length > 0 
      ? allClaims.reduce((sum, c) => sum + c.payoutAmount, 0) / allClaims.length 
      : 0,
    byZone: Object.fromEntries(
      Object.entries(
        allClaims.reduce((acc, c) => ({
          ...acc,
          [c.zone]: (acc[c.zone] || 0) + 1,
        }), {})
      )
    ),
    byReason: Object.fromEntries(
      Object.entries(
        allClaims.reduce((acc, c) => ({
          ...acc,
          [c.reason]: (acc[c.reason] || 0) + 1,
        }), {})
      )
    ),
  };
}
```

### Export Claims to CSV

```typescript
import { exportClaimsToCSV } from "@/backend/engines/claims-utils";

export async function downloadClaimsReport() {
  const claimsEngine = getClaimsEngine();
  const claims = claimsEngine.getAllClaims();
  
  const csv = exportClaimsToCSV(claims);
  
  // Create download link
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `claims_${new Date().toISOString()}.csv`;
  link.click();
}
```

---

## Advanced Configurations

### Customize Processing Timeline

```typescript
// backend/engines/claims-engine.ts
export const PAYOUT_CONFIGURATION = {
  PROCESSING_TIME: {
    AUTO_PROCESS: 3600000,    // 1 hour
    AUTO_APPROVE: 86400000,   // 24 hours
    AUTO_PAY: 172800000,      // 48 hours
  },
  // Change to:
  PROCESSING_TIME: {
    AUTO_PROCESS: 1800000,    // 30 minutes
    AUTO_APPROVE: 3600000,    // 1 hour
    AUTO_PAY: 7200000,        // 2 hours
  },
};
```

### Customize Risk Multipliers

```typescript
export const PAYOUT_CONFIGURATION = {
  RISK_MULTIPLIERS: {
    LOW: 0.8,      // 80% of coverage
    MEDIUM: 1.0,   // 100% of coverage
    HIGH: 1.2,     // 120% of coverage
    CRITICAL: 1.5, // 150% of coverage
  },
  // Change to:
  RISK_MULTIPLIERS: {
    LOW: 0.6,
    MEDIUM: 0.9,
    HIGH: 1.3,
    CRITICAL: 2.0,
  },
};
```

### Add Custom Claim Reasons

```typescript
// Define new claim reason
export type ClaimReason = 
  | "RAIN_DISRUPTION"
  | "HEAT_DISRUPTION"
  | "AQI_DISRUPTION"
  | "FLOOD_DISRUPTION"
  | "CURFEW_DISRUPTION"
  | "EXTREME_WEATHER_DISRUPTION"
  | "MANUAL_CLAIM"
  | "DELIVERY_DELAY"      // New: Custom reason
  | "SERVICE_UNAVAILABLE" // New: Custom reason
;
```

---

## Testing Checklist

- [ ] Create claim from trigger
- [ ] Create manual claim
- [ ] Approve a claim
- [ ] Pay a claim
- [ ] Reject a claim
- [ ] Filter claims by status
- [ ] Filter claims by zone
- [ ] View claim statistics
- [ ] Auto-process claims
- [ ] Export claims to CSV
- [ ] View dashboard metrics

---

## Troubleshooting

### Claims Not Creating from Triggers

```typescript
// Check trigger is active
const triggers = triggerEngine.getActiveTriggers();
console.log("Active triggers:", triggers.length);

// Manually create claim
const claim = claimsEngine.createClaimFromTrigger(triggers[0]);
console.log("Created claim:", claim.id);
```

### Auto-Processing Not Working

```typescript
// Manually run auto-processing
const results = claimsEngine.autoProcessClaims();
console.log("Auto-process results:", results);
// { processed: 5, approved: 3, paid: 2 }
```

### Claims Not Appearing in Dashboard

```typescript
// Check if claims exist
const allClaims = claimsEngine.getAllClaims();
console.log("Total claims:", allClaims.length);

// Check API endpoint
fetch("/api/claims")
  .then(r => r.json())
  .then(data => console.log("API claims:", data.data.count));
```

---

## File Structure

```
insurance-platform/
├── backend/engines/
│   ├── claims-engine.ts          # Core engine
│   └── claims-utils.ts           # Utility functions
├── app/api/
│   ├── claims/route.ts           # GET /api/claims, POST /api/claims
│   └── create-claim/route.ts     # POST /api/create-claim, GET /api/create-claim
├── hooks/
│   └── useClaimsEngine.ts        # React hooks (7 hooks)
├── components/
│   └── ClaimsDashboard.tsx       # Premium UI component
├── app/claims/
│   └── page.tsx                  # Claims page
├── CLAIMS_ENGINE.md              # API documentation
└── CLAIMS_INTEGRATION.md         # This file
```

---

## Performance Tips

1. **Use Pagination**: For large datasets
2. **Cache Statistics**: Compute only when needed
3. **Batch Auto-Processing**: Run once per minute
4. **Index by User**: For faster lookups
5. **Archive Old Claims**: Move paid claims to archive

---

## Next Steps

1. ✅ Claims Engine implemented
2. → Integrate with payment gateway
3. → Add SMS/Email notifications
4. → Create mobile app support
5. → Build analytics dashboard
6. → Add fraud detection

---

**Last Updated**: March 19, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅

For questions or issues, refer to [CLAIMS_ENGINE.md](./CLAIMS_ENGINE.md)
