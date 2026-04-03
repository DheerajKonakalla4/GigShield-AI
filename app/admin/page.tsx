"use client";

import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Navbar,
} from "@/components/design-system";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Map,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data for claims over time
  const claimsOverTimeData = [
    { date: "Mon", claims: 24, approved: 18, paid: 16 },
    { date: "Tue", claims: 34, approved: 28, paid: 24 },
    { date: "Wed", claims: 28, approved: 22, paid: 19 },
    { date: "Thu", claims: 41, approved: 35, paid: 32 },
    { date: "Fri", claims: 52, approved: 44, paid: 38 },
    { date: "Sat", claims: 38, approved: 32, paid: 28 },
    { date: "Sun", claims: 29, approved: 24, paid: 21 },
  ];

  // Mock data for risk zones
  const riskZonesData = [
    { name: "North Zone", value: 35, color: "#ef4444" },
    { name: "South Zone", value: 25, color: "#f59e0b" },
    { name: "East Zone", value: 28, color: "#eab308" },
    { name: "West Zone", value: 12, color: "#22c55e" },
  ];

  // Mock recent claims data
  const recentClaims = [
    {
      id: "CLM-001",
      user: "Raj Kumar",
      amount: 450,
      trigger: "Heavy Rain",
      date: "Mar 19, 2026",
      status: "paid",
    },
    {
      id: "CLM-002",
      user: "Priya Singh",
      amount: 320,
      trigger: "Traffic Jam",
      date: "Mar 19, 2026",
      status: "approved",
    },
    {
      id: "CLM-003",
      user: "Amit Patel",
      amount: 280,
      trigger: "Extreme Heat",
      date: "Mar 18, 2026",
      status: "processing",
    },
    {
      id: "CLM-004",
      user: "Neha Verma",
      amount: 380,
      trigger: "Platform Down",
      date: "Mar 18, 2026",
      status: "paid",
    },
    {
      id: "CLM-005",
      user: "Ravi Gupta",
      amount: 150,
      trigger: "Weather Alert",
      date: "Mar 17, 2026",
      status: "paid",
    },
  ];

  // Mock high-risk areas data
  const highRiskAreas = [
    {
      zone: "North Zone",
      riskLevel: "High",
      activeUsers: 2340,
      claimsThisMonth: 156,
      avgClaimAmount: 385,
      trend: "up",
    },
    {
      zone: "East Zone",
      riskLevel: "High",
      activeUsers: 1890,
      claimsThisMonth: 124,
      avgClaimAmount: 325,
      trend: "stable",
    },
    {
      zone: "South Zone",
      riskLevel: "Medium",
      activeUsers: 1560,
      claimsThisMonth: 78,
      avgClaimAmount: 295,
      trend: "down",
    },
    {
      zone: "West Zone",
      riskLevel: "Low",
      activeUsers: 890,
      claimsThisMonth: 32,
      avgClaimAmount: 210,
      trend: "stable",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
      case "approved":
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300";
      case "processing":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300";
      case "Medium":
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300";
      case "Low":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
      default:
        return "";
    }
  };

  return (
    <>
      <Navbar
        logoText="DeliveryGuard AI"
        logo={
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
            ⚡
          </div>
        }
        items={[
          { label: "Dashboard", href: "#" },
          { label: "Users", href: "#" },
          { label: "Claims", href: "#" },
        ]}
        rightItems={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary">
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              Settings
            </Button>
          </div>
        }
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real-time insights into platform performance and user activity
            </p>
          </motion.div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Users */}
            <motion.div variants={itemVariants}>
              <Card variant="glass" hover>
                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Badge variant="info" size="sm">
                      Active
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <motion.h3
                      key="users"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1"
                    >
                      8,467
                    </motion.h3>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    +12% this month
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total Claims */}
            <motion.div variants={itemVariants}>
              <Card variant="glass" hover>
                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Badge variant="warning" size="sm">
                      This Month
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Claims Triggered
                    </p>
                    <motion.h3
                      key="claims"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1"
                    >
                      1,243
                    </motion.h3>
                  </div>
                  <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    +8% vs last month
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total Payouts */}
            <motion.div variants={itemVariants}>
              <Card variant="gradient">
                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <Badge variant="success" size="sm">
                      Paid Out
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Payouts
                    </p>
                    <motion.h3
                      key="payouts"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1"
                    >
                      ₹38.2L
                    </motion.h3>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Across 1,150 claims
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Claims Over Time */}
            <motion.div variants={itemVariants}>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Claims Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={claimsOverTimeData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="currentColor"
                        opacity={0.1}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="currentColor"
                        opacity={0.6}
                        fontSize={12}
                      />
                      <YAxis
                        stroke="currentColor"
                        opacity={0.6}
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #1e293b",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="claims"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ fill: "#8b5cf6", r: 4 }}
                        name="Total Claims"
                      />
                      <Line
                        type="monotone"
                        dataKey="approved"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6", r: 4 }}
                        name="Approved"
                      />
                      <Line
                        type="monotone"
                        dataKey="paid"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: "#10b981", r: 4 }}
                        name="Paid"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Zones Distribution */}
            <motion.div variants={itemVariants}>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Risk Zones Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskZonesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} (${value}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskZonesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #1e293b",
                          borderRadius: "8px",
                        }}
                        formatter={(value: any) => `${value}%`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Claims Table */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Claims</CardTitle>
                  <Button size="sm" variant="secondary">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Claim ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          User
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Trigger Type
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentClaims.map((claim, index) => (
                        <motion.tr
                          key={claim.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                            {claim.id}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {claim.user}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              ₹{claim.amount}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {claim.trigger}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {claim.date}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                claim.status
                              )}`}
                            >
                              {claim.status.charAt(0).toUpperCase() +
                                claim.status.slice(1)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* High-Risk Areas Table */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    High-Risk Areas
                  </CardTitle>
                  <Button size="sm" variant="secondary">
                    Manage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Zone
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Risk Level
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Active Users
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Claims (This Month)
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Avg Claim Amount
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {highRiskAreas.map((area, index) => (
                        <motion.tr
                          key={area.zone}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                            {area.zone}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskLevelColor(
                                area.riskLevel
                              )}`}
                            >
                              {area.riskLevel}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                            {area.activeUsers.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {area.claimsThisMonth}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              ₹{area.avgClaimAmount}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              {area.trend === "up" && (
                                <>
                                  <TrendingUp className="w-4 h-4 text-red-600" />
                                  <span className="text-red-600 font-semibold">
                                    Up
                                  </span>
                                </>
                              )}
                              {area.trend === "down" && (
                                <>
                                  <TrendingUp className="w-4 h-4 text-emerald-600 rotate-180" />
                                  <span className="text-emerald-600 font-semibold">
                                    Down
                                  </span>
                                </>
                              )}
                              {area.trend === "stable" && (
                                <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                  Stable
                                </span>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Card variant="elevated">
              <CardContent className="pt-0 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  System Health
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      API Status
                    </span>
                    <Badge variant="success" size="sm">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Database
                    </span>
                    <Badge variant="success" size="sm">
                      Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent className="pt-0 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Button variant="secondary" size="sm" className="w-full">
                    View All Users
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
