/**
 * Next.js API Routes for Risk & Premium Engine
 * Ready-to-use examples for integrating enhanced engines
 */

/**
 * ============================================================================
 * ROUTE 1: Analyze Single Zone
 * ============================================================================
 * File: app/api/risk-premium/analyze/route.ts
 */

export const analyzeZoneRouteExample = `
import { NextRequest, NextResponse } from "next/server";
import { RiskAndPremiumEngine } from "@/backend/engines/enhanced-risk-premium";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone") || "north";
    const coverage = parseInt(searchParams.get("coverage") || "500", 10);

    // Validate inputs
    if (!zone || coverage < 100 || coverage > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid parameters. Zone required, coverage 100-1000.",
        },
        { status: 400 }
      );
    }

    const analysis = RiskAndPremiumEngine.analyzeZone(zone, coverage);

    return NextResponse.json(
      {
        success: true,
        data: analysis,
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
`;

/**
 * ============================================================================
 * ROUTE 2: Get Risk Assessment Only
 * ============================================================================
 * File: app/api/risk/assess/route.ts
 */

export const getRiskRouteExample = `
import { NextRequest, NextResponse } from "next/server";
import { EnhancedRiskEngine } from "@/backend/engines/enhanced-risk-premium";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone") || "north";

    const riskAssessment = EnhancedRiskEngine.assessRisk(zone);

    return NextResponse.json(
      {
        success: true,
        data: {
          riskLevel: riskAssessment.riskLevel,
          riskScore: riskAssessment.riskScore,
          factors: riskAssessment.factors,
          details: riskAssessment.details,
        },
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Example Response:
 * {
 *   "success": true,
 *   "data": {
 *     "riskLevel": "MEDIUM",
 *     "riskScore": 52,
 *     "factors": {
 *       "location": 0.45,
 *       "weather": 0.55,
 *       "disruption": 0.48,
 *       "combined": 0.49
 *     },
 *     "details": {
 *       "locationName": "Delhi/NCR, Delhi",
 *       "weatherCondition": "High rain probability (30%), High temperature (35°C)",
 *       "disruptionHistory": "weather: 2.5/month (avg severity: 45); traffic: 4.0/month (avg severity: 35)",
 *       "alerts": []
 *     }
 *   }
 * }
 */
`;

/**
 * ============================================================================
 * ROUTE 3: Calculate Premium
 * ============================================================================
 * File: app/api/premium/calculate/route.ts
 */

export const calculatePremiumRouteExample = `
import { NextRequest, NextResponse } from "next/server";
import { EnhancedPremiumEngine } from "@/backend/engines/enhanced-risk-premium";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zone, coverage, weekNumber } = body;

    // Validation
    if (!zone || !coverage) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: zone, coverage",
        },
        { status: 400 }
      );
    }

    if (coverage < 100 || coverage > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "Coverage must be between 100 and 1000",
        },
        { status: 400 }
      );
    }

    const premium = EnhancedPremiumEngine.calculatePremium(
      zone,
      coverage,
      weekNumber
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          riskLevel: premium.riskLevel,
          premium: premium.premium,
          breakdown: premium.breakdown,
          factors: premium.factors,
          tier: premium.tier.name,
          weeklyAdjustment: premium.weeklyAdjustment,
        },
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Example Request:
 * POST /api/premium/calculate
 * {
 *   "zone": "north",
 *   "coverage": 500
 * }
 *
 * Example Response:
 * {
 *   "success": true,
 *   "data": {
 *     "riskLevel": "MEDIUM",
 *     "premium": 145.75,
 *     "breakdown": {
 *       "basePrice": 50,
 *       "riskAdjustment": 52.5,
 *       "coverageFactor": 15.75,
 *       "tierMultiplier": 0.95,
 *       "weeklyAdjustment": 8.2,
 *       "finalPremium": 145.75
 *     },
 *     "factors": {
 *       "weather": 0.55,
 *       "location": 0.45,
 *       "disruption": 0.48
 *     },
 *     "tier": "starter",
 *     "weeklyAdjustment": {
 *       "week": 28,
 *       "seasonalFactor": 1.05,
 *       "reason": "monsoon_active"
 *     }
 *   }
 * }
 */
`;

/**
 * ============================================================================
 * ROUTE 4: Compare All Zones
 * ============================================================================
 * File: app/api/premium/compare-zones/route.ts
 */

export const compareZonesRouteExample = `
import { NextRequest, NextResponse } from "next/server";
import { RiskAndPremiumEngine } from "@/backend/engines/enhanced-risk-premium";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coverage = parseInt(searchParams.get("coverage") || "500", 10);

    if (coverage < 100 || coverage > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "Coverage must be between 100 and 1000",
        },
        { status: 400 }
      );
    }

    const comparison = RiskAndPremiumEngine.compareAllZones(coverage);

    return NextResponse.json(
      {
        success: true,
        data: comparison.map((z) => ({
          zone: z.zone,
          riskLevel: z.risk.riskLevel,
          riskScore: z.risk.riskScore,
          premium: z.premium.premium,
          annualCost: z.annual.annualPremium,
          monthlyAverage: z.annual.monthlyPremium,
        })),
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Example Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "zone": "north",
 *       "riskLevel": "MEDIUM",
 *       "riskScore": 52,
 *       "premium": 145.75,
 *       "annualCost": 1745.50,
 *       "monthlyAverage": 145.46
 *     },
 *     {
 *       "zone": "south",
 *       "riskLevel": "HIGH",
 *       "riskScore": 68,
 *       "premium": 185.20,
 *       "annualCost": 2215.75,
 *       "monthlyAverage": 184.65
 *     },
 *     ...
 *   ]
 * }
 */
`;

/**
 * ============================================================================
 * ROUTE 5: Get Annual Premium Estimate
 * ============================================================================
 * File: app/api/premium/annual/route.ts
 */

export const getAnnualPremiumRouteExample = `
import { NextRequest, NextResponse } from "next/server";
import { EnhancedPremiumEngine } from "@/backend/engines/enhanced-risk-premium";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone") || "north";
    const coverage = parseInt(searchParams.get("coverage") || "500", 10);

    const annual = EnhancedPremiumEngine.calculateAnnualPremium(zone, coverage);

    return NextResponse.json(
      {
        success: true,
        data: {
          zone,
          coverage,
          monthlyPremium: annual.monthlyPremium,
          annualEstimate: annual.annualPremium,
          costBreakdown: {
            minMonthly: Math.round(annual.monthlyPremium * 0.85 * 100) / 100,
            avgMonthly: annual.monthlyPremium,
            maxMonthly: Math.round(annual.monthlyPremium * 1.25 * 100) / 100,
          },
        },
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
`;

/**
 * ============================================================================
 * FRONTEND USAGE EXAMPLES
 * ============================================================================
 */

export const frontendUsageExamples = `
// Example 1: Get Risk Assessment
async function getRiskAssessment(zone: string) {
  const response = await fetch(\`/api/risk/assess?zone=\${zone}\`);
  const data = await response.json();
  
  if (data.success) {
    console.log(\`\\nRisk Level: \${data.data.riskLevel}\`);
    console.log(\`Risk Score: \${data.data.riskScore}/100\`);
    console.log('Factors:', data.data.factors);
  }
}

// Example 2: Calculate Premium
async function calculatePremiumPrice(zone: string, coverage: number) {
  const response = await fetch('/api/premium/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zone, coverage })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log(\`\\nPremium: ₹\${data.data.premium}\`);
    console.log('Breakdown:', data.data.breakdown);
    console.log('Risk Factors:', data.data.factors);
  }
}

// Example 3: Compare All Zones
async function compareZones(coverage: number) {
  const response = await fetch(\`/api/premium/compare-zones?coverage=\${coverage}\`);
  const data = await response.json();
  
  if (data.success) {
    console.log('\\nZone Comparison:');
    data.data.forEach(zone => {
      console.log(\`\${zone.zone}: ₹\${zone.premium} (Risk: \${zone.riskLevel})\`);
    });
  }
}

// Example 4: Get Annual Estimate
async function getAnnualPremium(zone: string, coverage: number) {
  const response = await fetch(\`/api/premium/annual?zone=\${zone}&coverage=\${coverage}\`);
  const data = await response.json();
  
  if (data.success) {
    console.log(\`\\nAnnual Estimate: ₹\${data.data.annualEstimate}\`);
    console.log(\`Monthly Average: ₹\${data.data.monthlyPremium}\`);
    console.log('Cost Breakdown:', data.data.costBreakdown);
  }
}

// Example 5: Full Analysis
async function getFullAnalysis(zone: string, coverage: number) {
  const response = await fetch(\`/api/risk-premium/analyze?zone=\${zone}&coverage=\${coverage}\`);
  const data = await response.json();
  
  if (data.success) {
    const analysis = data.data;
    console.log(\`\\n📍 Zone: \${analysis.zone}\`);
    console.log(\`🎯 Risk Level: \${analysis.risk.riskLevel} (\${analysis.risk.riskScore}/100)\`);
    console.log(\`💰 Premium: ₹\${analysis.premium.premium}\`);
    console.log(\`📊 Annual: ₹\${analysis.annual.annualPremium}\`);
    console.log(\`💡 \${analysis.recommendation}\`);
  }
}

// Example 6: React Component Usage
function PremiumCalculator() {
  const [zone, setZone] = React.useState('north');
  const [coverage, setCoverage] = React.useState(500);
  const [premium, setPremium] = React.useState(null);
  
  const calculatePremium = async () => {
    const response = await fetch('/api/premium/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zone, coverage })
    });
    
    const data = await response.json();
    setPremium(data.success ? data.data : null);
  };
  
  return (
    <div>
      <select value={zone} onChange={(e) => setZone(e.target.value)}>
        <option>north</option>
        <option>south</option>
        <option>east</option>
        <option>west</option>
      </select>
      
      <input 
        type="number" 
        value={coverage} 
        onChange={(e) => setCoverage(Number(e.target.value))}
        min="100"
        max="1000"
      />
      
      <button onClick={calculatePremium}>Calculate Premium</button>
      
      {premium && (
        <div>
          <h3>Premium: ₹{premium.premium}</h3>
          <p>Risk Level: {premium.riskLevel}</p>
          <p>Base: ₹{premium.breakdown.basePrice}</p>
          <p>Risk Adjustment: ₹{premium.breakdown.riskAdjustment}</p>
        </div>
      )}
    </div>
  );
}
`;

/**
 * ============================================================================
 * CURL EXAMPLES FOR TESTING
 * ============================================================================
 */

export const curlExamples = `
# Test 1: Get Risk Assessment
curl "http://localhost:3000/api/risk/assess?zone=north"

# Test 2: Calculate Premium (POST)
curl -X POST http://localhost:3000/api/premium/calculate \\
  -H "Content-Type: application/json" \\
  -d '{
    "zone": "south",
    "coverage": 500
  }'

# Test 3: Compare All Zones
curl "http://localhost:3000/api/premium/compare-zones?coverage=600"

# Test 4: Get Annual Premium
curl "http://localhost:3000/api/premium/annual?zone=east&coverage=400"

# Test 5: Full Analysis
curl "http://localhost:3000/api/risk-premium/analyze?zone=west&coverage=700"
`;

/**
 * ============================================================================
 * SETUP INSTRUCTIONS
 * ============================================================================
 */

export const setupInstructions = `
## Setup Instructions

### 1. Create the Route Files

Create these files in your Next.js project:

\`\`\`
app/api/
├── risk/
│   └── assess/route.ts
├── premium/
│   ├── calculate/route.ts
│   ├── compare-zones/route.ts
│   └── annual/route.ts
└── risk-premium/
    └── analyze/route.ts
\`\`\`

### 2. Copy the Engine Files

Copy to your backend directory:
- backend/engines/enhanced-risk-premium.ts
- backend/engines/examples.ts

### 3. Update tsconfig.json

Add path alias:
\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "@/backend/*": ["./backend/*"]
    }
  }
}
\`\`\`

### 4. Copy Route Examples

Use the route examples provided above for each file.

### 5. Test the API

Run development server:
\`\`\`bash
npm run dev
\`\`\`

Test endpoints using curl or Postman (see CURL examples above)

### 6. Use in React Components

Import the API client and use in React components (see Frontend examples)

## API Endpoints Summary

- GET /api/risk/assess?zone=<zone>
- POST /api/premium/calculate
- GET /api/premium/compare-zones?coverage=<amount>
- GET /api/premium/annual?zone=<zone>&coverage=<amount>
- GET /api/risk-premium/analyze?zone=<zone>&coverage=<amount>
`;

export default {
  analyzeZoneRouteExample,
  getRiskRouteExample,
  calculatePremiumRouteExample,
  compareZonesRouteExample,
  getAnnualPremiumRouteExample,
  frontendUsageExamples,
  curlExamples,
  setupInstructions,
};
