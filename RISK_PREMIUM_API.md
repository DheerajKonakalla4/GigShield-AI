# Risk & Premium Engine API Documentation

## Overview

The Risk & Premium Engine is a comprehensive backend system for calculating insurance premiums based on location-based risk factors, weather conditions, and historical disruption data. This API provides risk assessment, premium calculation, zone comparison, and annual cost estimation.

## Architecture

### Backend Structure

```
backend/
├── engines/
│   ├── enhanced-risk-premium.ts    # Core Risk & Premium Engine
│   ├── examples.ts                 # Usage examples
│   └── api-integration.ts          # Integration guide

app/api/
├── risk/
│   └── assess/route.ts             # Risk assessment endpoint
├── premium/
│   ├── calculate/route.ts          # Premium calculation endpoint
│   ├── compare-zones/route.ts      # Zone comparison endpoint
│   └── annual/route.ts             # Annual premium estimate endpoint
└── risk-premium/
    └── analyze/route.ts            # Combined analysis endpoint

hooks/
└── usePremiumEngine.ts             # React hooks for API integration
```

## Core Concepts

### Risk Calculation

Risk is calculated using a 3-factor weighted model:

```
Risk Score = (LocationRisk × 0.35) + (WeatherRisk × 0.35) + (DisruptionRisk × 0.30)

Risk Levels:
- LOW:      0-25
- MEDIUM:   25-50
- HIGH:     50-75
- CRITICAL: 75-100
```

**Risk Factors:**

1. **Location Risk (35%)**
   - Zone tier multiplier
   - Disruption frequency
   - Based on: north, south, east, west zones

2. **Weather Risk (35%)**
   - Rain probability (0-1)
   - Heat index normalized (0-100)
   - Alert factor for extreme weather

3. **Disruption Risk (30%)**
   - Historical frequency per month
   - Disruption severity (0-100)
   - Trend (increasing/decreasing)
   - Recency (days since last disruption)

### Premium Calculation

Premium is calculated using multiple components:

```
Premium = BasePrice + RiskAdjustment + CoverageFactor + WeeklyAdjustment

Where:
- BasePrice: Tier-dependent (₹50-300)
- RiskAdjustment: (RiskScore/50) × BasePrice × RiskMultiplier
- CoverageFactor: BasePrice × 0.3 × NormalizedCoverageRatio
- TierMultiplier: 0.85-1.0 (higher tier = bigger discount)
- WeeklyAdjustment: Seasonal factor (0.8-1.25)
```

### Pricing Tiers

| Tier | Base Premium | Coverage Range | Multiplier | Features |
|------|--------------|----------------|-----------|----------|
| Starter | ₹50 | ₹100-300 | 1.0x | Basic coverage |
| Pro | ₹100 | ₹300-600 | 0.95x | Enhanced protection |
| Premium | ₹200 | ₹600-800 | 0.9x | Priority support |
| Enterprise | ₹300 | ₹800-1000 | 0.85x | 24/7 support |

### Seasonal Adjustments

52-week seasonal model with realistic patterns:

```
Jan-Feb:     0.85 (Winter low)
Mar-Apr:     0.95-1.15 (Spring peak)
May:         1.2 (Pre-monsoon heat)
Jun-Aug:     1.15-1.25 (Monsoon active, peak July)
Sep:         1.0-1.05 (Post-monsoon)
Oct-Nov:     0.85-0.9 (Autumn dip)
Dec:         0.85 (Year-end low)
```

## API Endpoints

### 1. Risk Assessment

**Endpoint:** `GET /api/risk/assess?zone=<zone>`

Get risk assessment for a specific zone.

**Query Parameters:**
- `zone` (string, required): north | south | east | west

**Response:**
```json
{
  "success": true,
  "data": {
    "zone": "north",
    "riskLevel": "MEDIUM",
    "riskScore": 52,
    "factors": {
      "weather": 0.35,
      "location": 0.45,
      "disruption": 0.48,
      "combined": 0.43
    },
    "details": {
      "locationName": "Delhi/NCR, Delhi",
      "weatherCondition": "High rain probability (30%), High temperature (35°C)",
      "disruptionHistory": "weather: 2.5/month; traffic: 4.0/month",
      "alerts": []
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Examples:**
```bash
# cURL
curl "http://localhost:3000/api/risk/assess?zone=north"

# JavaScript
fetch('/api/risk/assess?zone=north')
  .then(res => res.json())
  .then(data => console.log(data.data))
```

---

### 2. Premium Calculation

**Endpoint:** `POST /api/premium/calculate`

Calculate premium for a given zone and coverage amount.

**Request Body:**
```json
{
  "zone": "north",
  "coverage": 500,
  "weekNumber": 28
}
```

**Parameters:**
- `zone` (string, required): north | south | east | west
- `coverage` (number, required): 100-1000
- `weekNumber` (number, optional): 1-52 (defaults to current week)

**Response:**
```json
{
  "success": true,
  "data": {
    "zone": "north",
    "coverage": 500,
    "riskLevel": "MEDIUM",
    "premium": 145.75,
    "breakdown": {
      "basePrice": 50,
      "riskAdjustment": 52.5,
      "coverageFactor": 15.75,
      "tierMultiplier": 0.95,
      "weeklyAdjustment": 8.2,
      "finalPremium": 145.75
    },
    "factors": {
      "weather": 0.35,
      "location": 0.45,
      "disruption": 0.48
    },
    "tier": {
      "name": "starter",
      "basePremium": 50,
      "coverageRange": { "min": 100, "max": 300 },
      "riskMultiplier": 1.0
    },
    "weeklyAdjustment": {
      "week": 28,
      "seasonalFactor": 1.05,
      "reason": "monsoon_active"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Examples:**
```bash
# cURL
curl -X POST http://localhost:3000/api/premium/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "north",
    "coverage": 500
  }'

# JavaScript
const response = await fetch('/api/premium/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    zone: 'north',
    coverage: 500
  })
});
const data = await response.json();
```

---

### 3. Compare Zones

**Endpoint:** `GET /api/premium/compare-zones?coverage=<amount>`

Compare premium prices across all zones.

**Query Parameters:**
- `coverage` (number, required): 100-1000

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "zone": "west",
      "riskLevel": "MEDIUM",
      "riskScore": 48,
      "premium": 120.5,
      "monthlyAverage": 120.5,
      "annualCost": 1446,
      "factors": {
        "weather": 0.3,
        "location": 0.42,
        "disruption": 0.38
      },
      "recommendation": "✅ LOWEST PRICE & GOOD RISK"
    },
    {
      "rank": 2,
      "zone": "north",
      "riskLevel": "MEDIUM",
      "riskScore": 52,
      "premium": 145.75,
      "monthlyAverage": 145.75,
      "annualCost": 1749,
      "factors": {
        "weather": 0.35,
        "location": 0.45,
        "disruption": 0.48
      },
      "recommendation": "✅ MID-RANGE OPTION"
    }
  ],
  "statistics": {
    "coverage": 500,
    "lowestZone": "west",
    "highestZone": "south",
    "priceRange": "₹120.5 - ₹185.2",
    "average": "₹150.25",
    "savingsRange": "₹0 - ₹64.7 (vs highest)"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Examples:**
```bash
# cURL
curl "http://localhost:3000/api/premium/compare-zones?coverage=500"

# JavaScript
fetch('/api/premium/compare-zones?coverage=500')
  .then(res => res.json())
  .then(data => data.data.forEach(zone => 
    console.log(`${zone.zone}: ₹${zone.premium}`)
  ))
```

---

### 4. Annual Premium

**Endpoint:** `GET /api/premium/annual?zone=<zone>&coverage=<amount>`

Get annual premium estimate with seasonal breakdown.

**Query Parameters:**
- `zone` (string, required): north | south | east | west
- `coverage` (number, required): 100-1000

**Response:**
```json
{
  "success": true,
  "data": {
    "zone": "north",
    "coverage": 500,
    "premium": {
      "monthlyAverage": 145.75,
      "annualEstimate": 1749
    },
    "costBreakdown": {
      "minimumMonthly": "₹123.88 (winter low, ~0.85x)",
      "averageMonthly": "₹145.75",
      "maximumMonthly": "₹182.19 (monsoon peak, ~1.25x)",
      "range": "₹123.88 - ₹182.19"
    },
    "seasonalBreakdown": {
      "winter": {
        "name": "Winter (Dec-Feb)",
        "weeks": "1-8, 52",
        "factor": "0.85",
        "cost": 30.9
      },
      "summer": {
        "name": "Summer Peak (Jun-Aug)",
        "weeks": "22-34",
        "factor": "1.15-1.25",
        "cost": "167.61 - 182.19"
      }
    },
    "estimatedCosts": {
      "perMonth": 145.75,
      "perQuarter": 437.25,
      "perYear": 1749
    },
    "paymentOptions": [
      {
        "frequency": "Monthly",
        "amount": 145.75,
        "total": 1749,
        "frequency_id": "monthly"
      },
      {
        "frequency": "Quarterly (3 months)",
        "amount": 437.25,
        "total": 1749,
        "frequency_id": "quarterly"
      },
      {
        "frequency": "Annual (Upfront)",
        "amount": 1749,
        "total": 1749,
        "frequency_id": "annual",
        "discount": "10% savings vs monthly"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Examples:**
```bash
# cURL
curl "http://localhost:3000/api/premium/annual?zone=north&coverage=500"

# JavaScript
fetch('/api/premium/annual?zone=north&coverage=500')
  .then(res => res.json())
  .then(data => {
    const { monthlyAverage, annualEstimate } = data.data.premium;
    console.log(`Monthly: ₹${monthlyAverage}`);
    console.log(`Annual: ₹${annualEstimate}`);
  })
```

---

### 5. Complete Analysis

**Endpoint:** `GET /api/risk-premium/analyze?zone=<zone>&coverage=<amount>`

Get complete combined analysis of risk and premium.

**Query Parameters:**
- `zone` (string, required): north | south | east | west
- `coverage` (number, required): 100-1000

**Response:**
```json
{
  "success": true,
  "data": {
    "zone": "north",
    "coverage": 500,
    "risk": {
      "level": "MEDIUM",
      "score": 52,
      "factors": {
        "weather": 0.35,
        "location": 0.45,
        "disruption": 0.48,
        "combined": 0.43
      },
      "details": {
        "locationName": "Delhi/NCR, Delhi",
        "weatherCondition": "High rain probability (30%), High temperature (35°C)",
        "disruptionHistory": "weather: 2.5/month; traffic: 4.0/month",
        "alerts": []
      }
    },
    "premium": {
      "amount": 145.75,
      "breakdown": {
        "basePrice": 50,
        "riskAdjustment": 52.5,
        "coverageFactor": 15.75,
        "tierMultiplier": 0.95,
        "weeklyAdjustment": 8.2,
        "finalPremium": 145.75
      },
      "tier": {
        "name": "starter",
        "basePremium": 50,
        "coverageRange": { "min": 100, "max": 300 }
      },
      "seasonalFactor": {
        "week": 28,
        "factor": 1.05,
        "season": "monsoon_active"
      }
    },
    "annual": {
      "monthlyAverage": 145.75,
      "annualEstimate": 1749,
      "estimatedCost": "₹1,749/year"
    },
    "recommendation": "✅ MEDIUM RISK: Fair rate for the coverage level",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Examples:**
```bash
# cURL
curl "http://localhost:3000/api/risk-premium/analyze?zone=north&coverage=500"

# JavaScript
fetch('/api/risk-premium/analyze?zone=north&coverage=500')
  .then(res => res.json())
  .then(data => {
    const { risk, premium, annual } = data.data;
    console.log(`Risk: ${risk.level} (${risk.score}/100)`);
    console.log(`Premium: ₹${premium.amount}`);
    console.log(`Annual: ₹${annual.annualEstimate}`);
    console.log(`Recommendation: ${data.data.recommendation}`);
  })
```

---

## React Hooks Integration

### Available Hooks

#### useRiskAssessment()
```javascript
import { useRiskAssessment } from '@/hooks/usePremiumEngine';

function MyComponent() {
  const { risk, loading, error, assess } = useRiskAssessment();
  
  return (
    <div>
      <button onClick={() => assess('north')}>Assess Risk</button>
      {loading && <p>Loading...</p>}
      {risk && <p>Risk Level: {risk.riskLevel}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

#### usePremiumCalculator()
```javascript
import { usePremiumCalculator } from '@/hooks/usePremiumEngine';

function Calculator() {
  const { premium, loading, calculate } = usePremiumCalculator();
  
  const handleCalculate = async () => {
    await calculate('north', 500);
  };
  
  return (
    <div>
      <button onClick={handleCalculate}>Calculate</button>
      {premium && <p>Premium: ₹{premium.premium}</p>}
    </div>
  );
}
```

#### useZoneComparison()
```javascript
import { useZoneComparison } from '@/hooks/usePremiumEngine';

function Comparison() {
  const { comparison, loading, compare } = useZoneComparison();
  
  return (
    <div>
      <button onClick={() => compare(500)}>Compare</button>
      {comparison.map(zone => (
        <div key={zone.zone}>
          {zone.zone}: ₹{zone.premium}
        </div>
      ))}
    </div>
  );
}
```

#### useAnnualPremium()
```javascript
import { useAnnualPremium } from '@/hooks/usePremiumEngine';

function Annual() {
  const { annual, loading, calculate } = useAnnualPremium();
  
  return (
    <div>
      <button onClick={() => calculate('north', 500)}>Get Annual</button>
      {annual && <p>Annual: ₹{annual.premium.annualEstimate}</p>}
    </div>
  );
}
```

#### useRiskPremiumAnalysis()
```javascript
import { useRiskPremiumAnalysis } from '@/hooks/usePremiumEngine';

function Analysis() {
  const { analysis, loading, analyze } = useRiskPremiumAnalysis();
  
  return (
    <div>
      <button onClick={() => analyze('north', 500)}>Analyze</button>
      {analysis && (
        <>
          <p>Risk: {analysis.risk.level}</p>
          <p>Premium: ₹{analysis.premium.amount}</p>
          <p>{analysis.recommendation}</p>
        </>
      )}
    </div>
  );
}
```

---

## Error Handling

All endpoints return structured error responses:

```json
{
  "success": false,
  "error": "Invalid zone. Must be one of: north, south, east, west"
}
```

**Common Errors:**

| Error | Status | Solution |
|-------|--------|----------|
| Missing required parameter | 400 | Add missing query/body parameter |
| Invalid zone | 400 | Use one of: north, south, east, west |
| Invalid coverage | 400 | Coverage must be 100-1000 |
| Server error | 500 | Check backend logs |

---

## Setup Instructions

### 1. File Structure

Ensure all files are in their correct locations:

```
project/
├── backend/engines/
│   ├── enhanced-risk-premium.ts
│   └── examples.ts
├── app/api/
│   ├── risk/assess/route.ts
│   ├── premium/calculate/route.ts
│   ├── premium/compare-zones/route.ts
│   ├── premium/annual/route.ts
│   └── risk-premium/analyze/route.ts
└── hooks/
    └── usePremiumEngine.ts
```

### 2. Configuration

Update `tsconfig.json` to include path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/backend/*": ["./backend/*"],
      "@/hooks/*": ["./hooks/*"]
    }
  }
}
```

### 3. Development

```bash
# Start development server
npm run dev

# Server will run on http://localhost:3000
```

### 4. Testing

Use provided cURL examples or Postman collection:

```bash
# Test risk assessment
curl "http://localhost:3000/api/risk/assess?zone=north"

# Test premium calculation
curl -X POST http://localhost:3000/api/premium/calculate \
  -H "Content-Type: application/json" \
  -d '{"zone": "north", "coverage": 500}'

# Test zone comparison
curl "http://localhost:3000/api/premium/compare-zones?coverage=500"

# Test annual premium
curl "http://localhost:3000/api/premium/annual?zone=north&coverage=500"

# Test full analysis
curl "http://localhost:3000/api/risk-premium/analyze?zone=north&coverage=500"
```

---

## Data Models

### Zones

```typescript
type Zone = "north" | "south" | "east" | "west";

// Zone Details:
// - north: Delhi/NCR, Delhi - MEDIUM risk (6.5 disruptions/month)
// - south: Bangalore/Chennai - HIGH risk (9.0 disruptions/month)
// - east: Kolkata/Guwahati - HIGH risk (8.0 disruptions/month)
// - west: Mumbai/Pune - MEDIUM risk (4.5 disruptions/month)
```

### Risk Levels

```typescript
type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Score Ranges:
// LOW:      0-25 (Excellent conditions)
// MEDIUM:   25-50 (Acceptable risk)
// HIGH:     50-75 (Elevated risk)
// CRITICAL: 75-100 (Severe risk)
```

### Pricing Tiers

```typescript
type PricingTier = "starter" | "pro" | "premium" | "enterprise";

// Tier Details (see table above)
```

---

## Performance Considerations

- All calculations are synchronous and return instantly
- No database queries required (mock data in memory)
- Response times: <10ms per request
- Suitable for real-time calculations

---

## Future Enhancements

1. **Database Integration**
   - Store disruption history in database
   - Track historical premiums
   - User preferences

2. **Real-time Weather Integration**
   - OpenWeatherMap API
   - Real-time risk adjustments
   - Weather alerts

3. **Analytics**
   - Premium trends
   - User risk profiles
   - Claims analysis

4. **Customization**
   - Custom pricing tiers
   - Configurable risk weights
   - Zone-specific adjustments

---

## Support

For issues or questions:

1. Check the examples in `backend/engines/examples.ts`
2. Review the integration guide in `backend/engines/api-integration.ts`
3. Check React hook types in `hooks/usePremiumEngine.ts`
4. Review this documentation

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Status:** Production Ready
