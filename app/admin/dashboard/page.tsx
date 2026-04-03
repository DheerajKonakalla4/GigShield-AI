import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Insurance Platform Dashboard",
  description: "Complete parametric insurance platform with real-time trigger detection",
};

export default function AdminDashboard() {
  const features = [
    {
      title: "📊 Risk & Premium Engine",
      description: "Calculate insurance premiums based on location risk factors",
      href: "/admin/premium",
      color: "from-blue-500 to-cyan-500",
      stats: [
        { label: "Zones", value: "4", sublabel: "north, south, east, west" },
        { label: "Pricing Tiers", value: "4", sublabel: "starter to enterprise" },
        { label: "Factors", value: "3", sublabel: "weather, location, disruption" },
      ],
    },
    {
      title: "🚨 Trigger Engine",
      description: "Real-time disruption detection and impact tracking",
      href: "/triggers",
      color: "from-red-500 to-orange-500",
      stats: [
        { label: "Trigger Types", value: "6", sublabel: "rain, heat, AQI, flood, curfew" },
        { label: "Active System", value: "24/7", sublabel: "continuous monitoring" },
        { label: "Users Tracked", value: "196K", sublabel: "across 4 zones" },
      ],
    },
    {
      title: "💰 Buy Policy",
      description: "Customer-facing policy purchase interface",
      href: "/buy-policy",
      color: "from-green-500 to-emerald-500",
      stats: [
        { label: "Coverage", value: "₹100-1000", sublabel: "flexible amounts" },
        { label: "Coverage Types", value: "5+", sublabel: "comprehensive" },
        { label: "Checkout", value: "Fast", sublabel: "<2 minutes" },
      ],
    },
    {
      title: "🏥 Claims",
      description: "Manage and track insurance claims",
      href: "/claims",
      color: "from-purple-500 to-pink-500",
      stats: [
        { label: "Processing", value: "Auto", sublabel: "trigger-based approval" },
        { label: "Payouts", value: "100%", sublabel: "instant settlement" },
        { label: "Status", value: "Real-time", sublabel: "live updates" },
      ],
    },
    {
      title: "📈 Dashboard",
      description: "Analytics and performance metrics",
      href: "/dashboard",
      color: "from-indigo-500 to-blue-500",
      stats: [
        { label: "Metrics", value: "50+", sublabel: "comprehensive analytics" },
        { label: "Updates", value: "Real-time", sublabel: "live data" },
        { label: "Charts", value: "15+", sublabel: "interactive visualizations" },
      ],
    },
    {
      title: "🛍️ Design System",
      description: "Premium UI components and design tokens",
      href: "/design-system",
      color: "from-yellow-500 to-orange-500",
      stats: [
        { label: "Components", value: "50+", sublabel: "production-ready" },
        { label: "Variants", value: "100+", sublabel: "flexible options" },
        { label: "Dark Mode", value: "Full", sublabel: "complete support" },
      ],
    },
  ];

  const apis = [
    {
      title: "Premium Calculator API",
      methods: ["POST /api/premium/calculate", "GET /api/premium/compare-zones", "GET /api/premium/annual"],
      doc: "/RISK_PREMIUM_API.md",
    },
    {
      title: "Trigger Event API",
      methods: ["POST /api/trigger-event", "GET /api/trigger-event"],
      doc: "/TRIGGER_ENGINE.md",
    },
    {
      title: "Risk Assessment API",
      methods: ["GET /api/risk/assess", "GET /api/risk-premium/analyze"],
      doc: "/RISK_PREMIUM_API.md",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Insurance Platform Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive parametric insurance system with real-time disruption detection,
            smart pricing, and instant claims processing
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">6</div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Trigger Types</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">4</div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Pricing Tiers</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              196K
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Users Tracked</p>
          </div>
        </div>

        {/* Main Features */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Link key={idx} href={feature.href}>
                <div className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  {/* Header */}
                  <div
                    className={`h-24 bg-gradient-to-r ${feature.color} p-4 flex items-center justify-between`}
                  >
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-200 dark:border-gray-700">
                      {feature.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {stat.label}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-600">
                            {stat.sublabel}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full group"
                      variant="outline"
                    >
                      Access →
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">API Endpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apis.map((api, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-3"
              >
                <h3 className="font-bold text-gray-900 dark:text-white">{api.title}</h3>
                <div className="space-y-1">
                  {api.methods.map((method, i) => (
                    <code
                      key={i}
                      className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-800 dark:text-gray-200 font-mono"
                    >
                      {method}
                    </code>
                  ))}
                </div>
                <Link href={api.doc}>
                  <Button size="sm" variant="ghost" className="w-full">
                    View Documentation →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Key Technologies */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold mb-6">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Next.js 16", desc: "App Router" },
              { name: "TypeScript", desc: "Type Safety" },
              { name: "Tailwind CSS", desc: "Styling" },
              { name: "Framer Motion", desc: "Animations" },
              { name: "shadcn/ui", desc: "Components" },
              { name: "Recharts", desc: "Analytics" },
              { name: "EventEmitter", desc: "Pub/Sub" },
              { name: "Mock Data", desc: "Simulation" },
            ].map((tech, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-800"
              >
                <div className="font-bold text-gray-900 dark:text-white">
                  {tech.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Links */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Risk & Premium Engine",
                file: "RISK_PREMIUM_API.md",
                desc: "Complete premium calculation system with risk assessment",
              },
              {
                title: "Trigger Engine",
                file: "TRIGGER_ENGINE.md",
                desc: "Real-time disruption detection and event system",
              },
              {
                title: "Integration Guide",
                file: "TRIGGER_INTEGRATION.md",
                desc: "How to integrate triggers with insurance platform",
              },
              {
                title: "Project Instructions",
                file: "copilot-instructions.md",
                desc: "Development guidelines and best practices",
              },
            ].map((doc, idx) => (
              <a
                key={idx}
                href={`/${doc.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  📄 {doc.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{doc.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700 text-center space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Version:</strong> 1.0.0 | <strong>Status:</strong> Production Ready
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: March 2026 | Built with Next.js 16, TypeScript, Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}
