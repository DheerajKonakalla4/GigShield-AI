"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle, Users, Zap, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const metrics = [
    {
      icon: Users,
      label: "Active Users",
      value: "2,548",
      change: "+12.5%",
      gradient: "from-blue-600 to-blue-400",
    },
    {
      icon: BarChart3,
      label: "Total Claims",
      value: "1,284",
      change: "+8.2%",
      gradient: "from-purple-600 to-purple-400",
    },
    {
      icon: TrendingUp,
      label: "Payouts",
      value: "₹15.4L",
      change: "+23.1%",
      gradient: "from-emerald-600 to-emerald-400",
    },
    {
      icon: Zap,
      label: "Avg Premium",
      value: "₹4,250",
      change: "-2.3%",
      gradient: "from-orange-600 to-orange-400",
    },
  ];

  const zones = [
    { zone: "North", users: 652, claims: 312, payouts: "₹4.2L" },
    { zone: "South", users: 548, claims: 268, payouts: "₹3.8L" },
    { zone: "East", users: 724, claims: 421, payouts: "₹5.2L" },
    { zone: "West", users: 624, claims: 283, payouts: "₹2.2L" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
            📊 Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Real-time insurance platform analytics
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {metrics.map((metric, idx) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20 relative overflow-hidden group"
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.gradient} flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        metric.change.startsWith("+")
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {metric.change}
                    </motion.span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">
                    {metric.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Zone Coverage Table */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-white/20 dark:border-slate-700/50 overflow-hidden"
        >
          <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span>📍</span>
              Coverage by Zone
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700/50 dark:to-slate-800/30 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Active Users
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Claims
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Payouts
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {zones.map((z, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-300 group"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                      {z.zone}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {z.users.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {z.claims}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                      {z.payouts}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        className="inline-block px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold"
                      >
                        🟢 Active
                      </motion.span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Event Summary Cards */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="mt-12 mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span>⚡</span>
            Recent Disruption Events
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Rain Event */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl p-5 border border-blue-200 dark:border-blue-800 shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">🌧️ Rain in North Zone</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Rainfall: 82mm detected</p>
                </div>
                <span className="inline-block px-2.5 py-1 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 rounded text-xs font-bold">
                  HIGH
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">12</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Claims</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">₹4.8K</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Payout</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">8.7K</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Affected</p>
                </div>
              </div>
            </motion.div>

            {/* Pollution Event */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 rounded-xl p-5 border border-red-200 dark:border-red-800 shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">💨 Pollution in East Zone</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">AQI: 425 (Severe)</p>
                </div>
                <span className="inline-block px-2.5 py-1 bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-200 rounded text-xs font-bold">
                  CRITICAL
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-red-200 dark:border-red-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-900 dark:text-red-200">9</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Claims</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-900 dark:text-red-200">₹3.2K</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Payout</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-900 dark:text-red-200">12.4K</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Affected</p>
                </div>
              </div>
            </motion.div>

            {/* Heatwave Event */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-xl p-5 border border-orange-200 dark:border-orange-800 shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">🔥 Heatwave in West Zone</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Temperature: 48°C</p>
                </div>
                <span className="inline-block px-2.5 py-1 bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-200 rounded text-xs font-bold">
                  HIGH
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-orange-200 dark:border-orange-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">5</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Claims</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">₹1.9K</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Payout</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">4.2K</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Affected</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { emoji: "🎯", title: "Quick Actions", items: ["View Claims", "Export Data", "Generate Report"] },
            { emoji: "⚠️", title: "Alerts", items: ["3 pending claims", "2 overdue approvals", "1 system notice"] },
            { emoji: "📈", title: "This Week", items: ["420 new users", "3.2L in payouts", "89% approval rate"] },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {card.emoji} {card.title}
              </h3>
              <ul className="space-y-2">
                {card.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 + i * 0.05 }}
                    className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
