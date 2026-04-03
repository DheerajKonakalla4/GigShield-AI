# Trigger Engine - Integration Guide

## Quick Start

### 1. Basic Usage

#### Initialize Engine
```typescript
import { getTriggerEngine, initializeTriggerEngine } from '@/backend/engines/trigger-engine';

// Initialize on app start
initializeTriggerEngine();

// Get engine instance
const { detectionEngine, eventBroker } = getTriggerEngine();
```

#### Detect Triggers
```typescript
// Get current triggers
const activeTriggers = detectionEngine.getActiveTriggers();

// Detect new triggers from data sources
const newTriggers = await detectionEngine.detectTriggers();
newTriggers.forEach(trigger => {
  detectionEngine.activateTrigger(trigger);
});
```

#### Subscribe to Events
```typescript
// Listen for trigger activation
detectionEngine.onTriggerActivated((trigger) => {
  console.log(`New trigger: ${trigger.type}`);
  // Send notification to users
  notifyUsers(trigger);
});

// Listen for trigger resolution
detectionEngine.onTriggerResolved((trigger) => {
  console.log(`Trigger resolved: ${trigger.type}`);
});
```

### 2. React Component Usage

#### Display Active Triggers
```typescript
import TriggerDashboard from '@/components/TriggerDashboard';

export function HomePage() {
  return <TriggerDashboard />;
}
```

#### Custom Trigger Monitoring
```typescript
import { useAutoRefreshTriggers } from '@/hooks/useTriggerEngine';

export function TriggerMonitor() {
  const { triggers, statistics, refetch } = useAutoRefreshTriggers(5000);

  return (
    <div>
      <h2>Active Triggers: {triggers.length}</h2>
      <p>Affected Users: {statistics?.affectedUsers}</p>
      
      {triggers.map(trigger => (
        <div key={trigger.id}>
          <p>{trigger.type}: {trigger.reason}</p>
          <p>Zone: {trigger.zone}</p>
          <p>Severity: {trigger.severity}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. API Integration

#### Detect Triggers via API
```bash
curl -X POST http://localhost:3000/api/trigger-event \
  -H "Content-Type: application/json" \
  -d '{"action": "detect"}'
```

#### Simulate Trigger
```bash
curl -X POST http://localhost:3000/api/trigger-event \
  -H "Content-Type: application/json" \
  -d '{
    "action": "activate",
    "type": "RAIN_ALERT",
    "zoneOverride": "north",
    "severity": "HIGH"
  }'
```

## Integration with Insurance Platform

### 1. Premium Adjustment Based on Triggers

When a trigger is activated, adjust premiums:

```typescript
import { getTriggerEngine } from '@/backend/engines/trigger-engine';
import { EnhancedPremiumEngine } from '@/backend/engines/enhanced-risk-premium';

function adjustPremiumForTrigger(zone: string, triggerId: string) {
  const { detectionEngine } = getTriggerEngine();
  const trigger = detectionEngine.getActiveTriggers().find(t => t.id === triggerId);

  if (!trigger) return;

  // Increase premiums during active triggers
  const triggerMultiplier: { [key: string]: number } = {
    'RAIN_ALERT': 1.15,
    'HEAT_ALERT': 1.20,
    'AQI_ALERT': 1.25,
    'FLOOD_ALERT': 1.50,
    'CURFEW_ALERT': 1.10,
    'EXTREME_WEATHER': 1.60,
  };

  const multiplier = triggerMultiplier[trigger.type] || 1.0;

  // Calculate adjusted premium
  const basePremium = EnhancedPremiumEngine.calculatePremium(zone, 500);
  const adjustedPremium = basePremium.premium * multiplier;

  return {
    basePremium: basePremium.premium,
    adjustedPremium,
    triggerAdjustment: adjustedPremium - basePremium.premium,
    reason: `Adjusted due to active ${trigger.type}`,
  };
}
```

### 2. Claims Processing Enhancement

Use triggers to auto-process claims:

```typescript
interface ClaimWithTrigger {
  claimId: string;
  zone: string;
  eventDate: Date;
  claimAmount: number;
  description: string;
}

function processClaimWithTrigger(claim: ClaimWithTrigger) {
  const { detectionEngine } = getTriggerEngine();
  const zoneHistory = detectionEngine.getTriggerHistory().filter(
    t => t.zone === claim.zone && 
    t.activatedAt <= claim.eventDate
  );

  // Check if claim aligns with historical triggers
  const alignedTriggers = zoneHistory.filter(trigger => {
    // If claim date is within 24 hours after trigger
    const hoursDiff = (claim.eventDate.getTime() - trigger.activatedAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff >= 0 && hoursDiff <= 24;
  });

  if (alignedTriggers.length > 0) {
    return {
      autoApprove: true,
      priority: 'HIGH',
      supportingTriggers: alignedTriggers,
      reason: `Claim aligns with ${alignedTriggers.length} trigger(s)`,
    };
  }

  return {
    autoApprove: false,
    priority: 'NORMAL',
  };
}
```

### 3. User Notification System

Integrate with notification service:

```typescript
import { getTriggerEngine } from '@/backend/engines/trigger-engine';

export function setupTriggerNotifications() {
  const { detectionEngine, eventBroker } = getTriggerEngine();

  // Subscribe to all trigger events
  eventBroker.subscribeAll(async (event) => {
    const { trigger, affectedZones, recommendedActions } = event;

    // Notify affected users
    const affectedUsers = await getUsersByZones(affectedZones);

    for (const user of affectedUsers) {
      await notificationService.send({
        userId: user.id,
        type: 'trigger_alert',
        title: `Alert: ${trigger.type}`,
        message: trigger.reason,
        actions: recommendedActions,
        priority: trigger.severity === 'CRITICAL' ? 'high' : 'normal',
      });
    }

    // Log to analytics
    await analyticsService.log({
      event: 'trigger_activated',
      triggerType: trigger.type,
      zone: trigger.zone,
      affectedUsers: trigger.affectedUsers,
      severity: trigger.severity,
    });
  });
}
```

### 4. Dynamic Risk Assessment

Update risk scores based on active triggers:

```typescript
function getRiskScoreWithActiveTriggers(zone: string): number {
  const { detectionEngine } = getTriggerEngine();
  const baseRiskScore = 50; // Example base score

  const activeTriggers = detectionEngine.getTriggersByZone(zone);

  const triggerImpact: { [key: string]: number } = {
    'RAIN_ALERT': 5,
    'HEAT_ALERT': 8,
    'AQI_ALERT': 10,
    'FLOOD_ALERT': 25,
    'CURFEW_ALERT': 3,
    'EXTREME_WEATHER': 20,
  };

  const totalImpact = activeTriggers.reduce((sum, trigger) => {
    return sum + (triggerImpact[trigger.type] || 0);
  }, 0);

  const riskScore = Math.min(baseRiskScore + totalImpact, 100);

  return riskScore;
}
```

### 5. Integration with Dashboard

Update main dashboard with trigger information:

```typescript
// In your main dashboard page
import TriggerDashboard from '@/components/TriggerDashboard';
import Dashboard from '@/components/Dashboard';

export function MainDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Dashboard />
      </div>
      <div className="lg:col-span-1">
        <TriggerDashboard />
      </div>
    </div>
  );
}
```

## Advanced Features

### 1. Custom Trigger Rules

```typescript
interface TriggerRule {
  name: string;
  condition: (data: any) => boolean;
  action: (data: any) => void;
  severity: TriggerSeverity;
}

const customRules: TriggerRule[] = [
  {
    name: 'Combined Weather Alert',
    condition: (data) => data.rainfall > 20 && data.temperature > 35,
    action: (data) => notifyUsers('Dangerous weather combination'),
    severity: 'CRITICAL',
  },
];
```

### 2. Trigger Analytics

```typescript
function getTriggerAnalytics(startDate: Date, endDate: Date) {
  const { detectionEngine } = getTriggerEngine();
  const history = detectionEngine.getTriggerHistory();

  const filtered = history.filter(
    t => t.createdAt >= startDate && t.createdAt <= endDate
  );

  return {
    totalTriggers: filtered.length,
    byType: groupBy(filtered, 'type'),
    byZone: groupBy(filtered, 'zone'),
    bySeverity: groupBy(filtered, 'severity'),
    averageResolutionTime: calculateAvgResolutionTime(filtered),
    mostAffectedZone: getMostAffectedZone(filtered),
    peakActivationTime: getPeakTime(filtered),
  };
}
```

### 3. Predictive Triggers

```typescript
function predictFutureTriggers(zone: string, daysAhead: number = 7) {
  const { detectionEngine } = getTriggerEngine();
  const history = detectionEngine.getTriggerHistory();

  const recentTriggers = history
    .filter(t => t.zone === zone)
    .slice(-30); // Last 30 triggers

  // Simple pattern detection
  const triggerFrequency = recentTriggers.length / 30;
  const commonTypes = groupBy(recentTriggers, 'type');

  return {
    predictedFrequency: triggerFrequency * daysAhead,
    likelyTypes: Object.entries(commonTypes).sort(([, a], [, b]) => b.length - a.length).map(([type]) => type),
    riskLevel: triggerFrequency > 0.5 ? 'HIGH' : 'MEDIUM',
  };
}
```

## Navigation

- **Trigger Dashboard:** http://localhost:3000/triggers
- **API Documentation:** Check TRIGGER_ENGINE.md
- **Risk & Premium Engine:** http://localhost:3000/api/premium/calculate
- **Admin Panel:** (To be implemented)

## File Structure

```
backend/engines/
├── trigger-engine.ts         # Core engine
├── trigger-utils.ts          # Utility functions
└── enhanced-risk-premium.ts  # Risk & premium engine

app/api/
└── trigger-event/route.ts    # API endpoint

hooks/
└── useTriggerEngine.ts       # React hooks

components/
└── TriggerDashboard.tsx      # UI component

app/
└── triggers/page.tsx         # Dashboard page
```

## Performance Optimization

### Caching
```typescript
const triggerCache = new Map();
const CACHE_TTL = 5000; // 5 seconds

function getCachedTriggers(zone?: string) {
  const cacheKey = `triggers_${zone || 'all'}`;
  
  if (triggerCache.has(cacheKey)) {
    return triggerCache.get(cacheKey);
  }

  const triggers = getTriggerEngine().detectionEngine.getActiveTriggers();
  triggerCache.set(cacheKey, triggers);

  setTimeout(() => triggerCache.delete(cacheKey), CACHE_TTL);

  return triggers;
}
```

### Pagination
```typescript
function paginateTriggers(triggers: Trigger[], page: number = 1, pageSize: number = 20) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: triggers.slice(start, end),
    pagination: {
      page,
      pageSize,
      total: triggers.length,
      pages: Math.ceil(triggers.length / pageSize),
    },
  };
}
```

## Troubleshooting

### No Triggers Detected
- Check that external data simulator is working
- Verify threshold values in TRIGGER_THRESHOLDS
- Check console for errors

### Triggers Not Resolving
- Ensure resolve action uses correct triggerId
- Check that trigger exists in active list
- Verify isActive flag is being updated

### Performance Issues
- Check trigger history size (should be <100)
- Verify event emitter listeners aren't memory leaking
- Consider implementing caching

## Next Steps

1. ✅ Core trigger engine built
2. ✅ API endpoints implemented
3. ✅ React UI components created
4. ⏳ Database integration (optional)
5. ⏳ Real API data sources (optional)
6. ⏳ Push notifications (optional)
7. ⏳ Advanced analytics (optional)

---

**Last Updated:** March 2026  
**Version:** 1.0.0
