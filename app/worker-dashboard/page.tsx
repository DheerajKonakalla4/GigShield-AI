"use client";

import { motion } from "framer-motion";
import { AlertCircle, TrendingUp, Shield, Calendar, PieChart, Zap } from "lucide-react";
import { Badge, Button } from "@/components/design-system";
import { useEffect, useState } from "react";

interface WorkerData {
  userId: string;
  name: string;
  zone: string;
  activeCoverage: number;
  weeklyPremium: number;
  monthlyPremium: number;
  coveragePerDay: number;
  lastPayoutAmount: number;
  lastPayoutDate: string;
  riskLevel: string;
  activeClaims: number;
  totalPayoutsReceived: number;
  policyStatus: string;
}

interface RiskAlert {
  id: string;
  zone: string;
  type: string;
  severity: string;
  description: string;
  affectedUsers: number;
  timestamp: string;
}

export default function WorkerDashboard() {
  const [workerData, setWorkerData] = useState<WorkerData | null>(null);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock worker data - in production this would come from user context
  const mockWorkerData: WorkerData = {
    userId: "user_001",
    name: "Rajesh Kumar",
    zone: "north",
    activeCoverage: 500,
    weeklyPremium: 40, // HIGH risk zone
    monthlyPremium: 173,
    coveragePerDay: 71.4,
    lastPayoutAmount: 2850,
    lastPayoutDate: "2024-03-15",
    riskLevel: "HIGH",
    activeClaims: 2,
    totalPayoutsReceived: 8550,
    policyStatus: "active",
  };

  const mockRiskAlerts: RiskAlert[] = [
    {
      id: "alert_001",
      zone: "north",
      type: "RAIN_ALERT",
      severity: "HIGH",
      description: "Heavy rainfall detected (82mm)",
      affectedUsers: 8742,
      timestamp: "2024-03-20T14:30:00Z",
    },
    {
      id: "alert_002",
      zone: "north",
      type: "EXTREME_WEATHER",
      severity: "MEDIUM",
      description: "Wind speed elevated to 45 km/h",
      affectedUsers: 6500,
      timestamp: "2024-03-20T12:00:00Z",
    },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setWorkerData(mockWorkerData);
      setRiskAlerts(mockRiskAlerts);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!workerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">No worker data available</p>
        </div>
      </div>
    );
  }

  const riskLevelColors = {
    LOW: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  const severityColors: Record<string, string> = {
    LOW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    CRITICAL: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">
            👷 Worker Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Your parametric insurance coverage at a glance
          </p>
        </motion.div>

        {/* Worker Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-white/20 dark:border-slate-700/50 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Info */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {workerData.name}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">📍 Zone:</span>
                  <span className="font-semibold text-slate-900 dark:text-white capitalize">
                    {workerData.zone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">🛡️ Status:</span>
                  <Badge
                    variant="success"
                    className="capitalize"
                  >
                    {workerData.policyStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">⚠️ Risk Level:</span>
                  <Badge
                    variant="warning"
                    className={`capitalize ${riskLevelColors[workerData.riskLevel as keyof typeof riskLevelColors]}`}
                  >
                    {workerData.riskLevel}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
              >
                <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">
                  Total Payouts
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                  ₹{workerData.totalPayoutsReceived.toLocaleString()}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 rounded-lg p-4 border border-green-200 dark:border-green-800"
              >
                <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
                  Active Claims
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-200">
                  {workerData.activeClaims}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Coverage Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Coverage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-white/20 dark:border-slate-700/50 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Active Coverage</h3>
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              ₹{workerData.activeCoverage}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Full protection enabled
            </p>
          </motion.div>

          {/* Weekly Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-white/20 dark:border-slate-700/50 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Weekly Premium</h3>
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              ₹{workerData.weeklyPremium}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Monthly: ₹{Math.round(workerData.monthlyPremium)}
            </p>
          </motion.div>

          {/* Coverage Per Day */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-white/20 dark:border-slate-700/50 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Coverage/Day</h3>
              <PieChart className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              ₹{Math.round(workerData.coveragePerDay)}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Daily distribution
            </p>
          </motion.div>

          {/* Last Payout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-white/20 dark:border-slate-700/50 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Last Payout</h3>
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              ₹{workerData.lastPayoutAmount}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {new Date(workerData.lastPayoutDate).toLocaleDateString()}
            </p>
          </motion.div>
        </div>

        {/* Active Risk Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-white/20 dark:border-slate-700/50 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Active Risk Alerts
            </h2>
          </div>

          {riskAlerts.length > 0 ? (
            <div className="space-y-3">
              {riskAlerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl">
                    {alert.type === "RAIN_ALERT"
                      ? "🌧️"
                      : alert.type === "HEAT_ALERT"
                      ? "🔥"
                      : alert.type === "AQI_ALERT"
                      ? "💨"
                      : "⛈️"}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {alert.type.replace("_", " ")}
                      </h4>
                      <Badge
                        variant="info"
                        className={`text-xs font-semibold ${severityColors[alert.severity]}`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                      <span>👥 {alert.affectedUsers.toLocaleString()} affected</span>
                      <span>🕐 {new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    View Claim
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">No active alerts at the moment</p>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-wrap gap-3 justify-center sm:justify-start"
        >
          <Button
            className="gap-2"
            variant="outline"
          >
            📋 View Claims History
          </Button>
          <Button
            className="gap-2"
            variant="outline"
          >
            ⚙️ Policy Settings
          </Button>
          <Button
            className="gap-2"
            variant="outline"
          >
            💬 Contact Support
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
