/**
 * Next.js API Route Integration Examples
 * Shows how to integrate backend controllers with Next.js App Router
 * Place these files in /app/api/ directory
 */

/**
 * ============================================================================
 * EXAMPLE: app/api/policies/route.ts
 * ============================================================================
 * 
 * This example shows how to handle policy creation & retrieval
 */
export const examplePoliciesRoute = `
import { NextRequest, NextResponse } from "next/server";
import { PolicyRoutes } from "@/backend/routes";
import { ErrorHandler } from "@/backend/middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await PolicyRoutes.create({ body });
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Missing policy ID" },
        { status: 400 }
      );
    }

    const result = await PolicyRoutes.getDetails({ body: {} }, id);
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
`;

/**
 * ============================================================================
 * EXAMPLE: app/api/claims/route.ts
 * ============================================================================
 */
export const exampleClaimsRoute = `
import { NextRequest, NextResponse } from "next/server";
import { ClaimRoutes } from "@/backend/routes";
import { ErrorHandler } from "@/backend/middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await ClaimRoutes.create({ body });
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (userId) {
      const result = await ClaimRoutes.getUserClaims({}, userId);
      return NextResponse.json(result.data, { status: result.status });
    }

    if (id) {
      const result = await ClaimRoutes.getDetails({}, id);
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
`;

/**
 * ============================================================================
 * EXAMPLE: app/api/premium/calculate/route.ts
 * ============================================================================
 */
export const examplePremiumRoute = `
import { NextRequest, NextResponse } from "next/server";
import { PremiumRoutes } from "@/backend/routes";
import { ErrorHandler } from "@/backend/middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await PremiumRoutes.calculate({ body });
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const result = await PremiumRoutes.compare({});
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
`;

/**
 * ============================================================================
 * EXAMPLE: app/api/payments/route.ts
 * ============================================================================
 */
export const examplePaymentsRoute = `
import { NextRequest, NextResponse } from "next/server";
import { PaymentRoutes } from "@/backend/routes";
import { ErrorHandler } from "@/backend/middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await PaymentRoutes.create({ body });
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (userId) {
      const result = await PaymentRoutes.getUserPayments({}, userId);
      return NextResponse.json(result.data, { status: result.status });
    }

    if (id) {
      const result = await PaymentRoutes.getStatus({}, id);
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
`;

/**
 * ============================================================================
 * EXAMPLE: app/api/analytics/route.ts
 * ============================================================================
 */
export const exampleAnalyticsRoute = `
import { NextRequest, NextResponse } from "next/server";
import { AnalyticsRoutes } from "@/backend/routes";
import { ErrorHandler } from "@/backend/middleware";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const userId = searchParams.get("userId");

    if (type === "platform") {
      const result = await AnalyticsRoutes.getPlatformMetrics({});
      return NextResponse.json(result.data, { status: result.status });
    }

    if (type === "user" && userId) {
      const result = await AnalyticsRoutes.getUserAnalytics({}, userId);
      return NextResponse.json(result.data, { status: result.status });
    }

    if (type === "zones") {
      const result = await AnalyticsRoutes.getZoneAnalytics({});
      return NextResponse.json(result.data, { status: result.status });
    }

    return NextResponse.json(
      { error: "Invalid analytics type" },
      { status: 400 }
    );
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
`;

/**
 * ============================================================================
 * EXAMPLE: app/api/disputes/route.ts
 * ============================================================================
 */
export const exampleDisputesRoute = `
import { NextRequest, NextResponse } from "next/server";
import { DisputeRoutes } from "@/backend/routes";
import { ErrorHandler } from "@/backend/middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await DisputeRoutes.create({ body });
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing dispute ID" },
        { status: 400 }
      );
    }

    const result = await DisputeRoutes.getStatus({}, id);
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
`;

/**
 * ============================================================================
 * EXAMPLE: app/api/health/route.ts
 * ============================================================================
 */
export const exampleHealthRoute = `
import { NextRequest, NextResponse } from "next/server";
import { HealthRoutes } from "@/backend/routes";

export async function GET(request: NextRequest) {
  try {
    const result = await HealthRoutes.check({});
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Health check failed" },
      { status: 500 }
    );
  }
}
`;

/**
 * ============================================================================
 * HOW TO USE THESE EXAMPLES
 * ============================================================================
 * 
 * Step 1: Create the route files in your Next.js app:
 * 
 * app/api/
 * ├── health/route.ts
 * ├── policies/route.ts
 * ├── claims/route.ts
 * ├── premium/
 * │   └── calculate/route.ts
 * ├── payments/route.ts
 * ├── analytics/route.ts
 * └── disputes/route.ts
 * 
 * Step 2: Copy the example code from above into each route file
 * 
 * Step 3: Update tsconfig.json to include backend paths:
 * {
 *   "compilerOptions": {
 *     "paths": {
 *       "@/backend/*": ["./backend/*"]
 *     }
 *   }
 * }
 * 
 * Step 4: Use the API routes in your frontend components:
 * 
 * // In a React component:
 * const response = await fetch("/api/policies", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({
 *     userId: "user_123",
 *     coverageAmount: 500,
 *     zone: "north"
 *   })
 * });
 * 
 * const data = await response.json();
 * console.log(data);
 * 
 * 
 * API ENDPOINTS REFERENCE
 * ============================================================================
 * 
 * POLICIES:
 * POST   /api/policies                  - Create new policy
 * GET    /api/policies?id=<id>          - Get policy details
 * PUT    /api/policies/<id>/renew       - Renew policy
 * 
 * CLAIMS:
 * POST   /api/claims                    - Trigger claim
 * GET    /api/claims?id=<id>            - Get claim details
 * GET    /api/claims?userId=<userId>    - Get user claims
 * 
 * PREMIUM:
 * POST   /api/premium/calculate         - Calculate premium
 * GET    /api/premium/calculate?type=compare - Compare options
 * 
 * PAYMENTS:
 * POST   /api/payments                  - Process payment
 * GET    /api/payments?id=<id>          - Get payment status
 * GET    /api/payments?userId=<userId>  - Get user payments
 * 
 * ANALYTICS:
 * GET    /api/analytics?type=platform   - Platform metrics
 * GET    /api/analytics?type=user&userId=<userId> - User analytics
 * GET    /api/analytics?type=zones      - Zone analytics
 * 
 * DISPUTES:
 * POST   /api/disputes                  - File dispute
 * GET    /api/disputes?id=<id>          - Get dispute status
 * 
 * HEALTH:
 * GET    /api/health                    - API health check
 * 
 */

/**
 * ============================================================================
 * SAMPLE FRONTEND USAGE
 * ============================================================================
 */

export const sampleFrontendUsage = `
// Example: Create a policy from frontend component
async function createPolicy(coverageAmount: number, zone: string) {
  try {
    const response = await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "user_123",
        coverageAmount,
        zone,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Policy created:", data.data);
      // Show success message
    } else {
      console.error("Error:", data.error.message);
      // Show error message
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Example: Get premium calculation
async function calculatePremium(coverageAmount: number, zone: string) {
  const response = await fetch("/api/premium/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      coverageAmount,
      zone,
      riskLevel: "medium",
    }),
  });

  const data = await response.json();
  return data.data;
}

// Example: Trigger a claim
async function triggerClaim(policyId: string, disruptionType: string) {
  const response = await fetch("/api/claims", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "user_123",
      policyId,
      disruptionType,
    }),
  });

  const data = await response.json();
  return data.data;
}

// Example: Get platform analytics
async function getPlatformMetrics() {
  const response = await fetch("/api/analytics?type=platform");
  const data = await response.json();
  return data.data;
}
`;
