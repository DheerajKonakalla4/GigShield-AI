"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface UserWithPremium {
  id: string;
  name: string;
  zone: string;
  coverage: string;
  status: string;
  joined: string;
  weeklyPremium?: string;
  riskLevel?: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState<UserWithPremium[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data with premium calculations
    const mockUsers: UserWithPremium[] = [
      { 
        id: "U001", 
        name: "Rajesh Kumar", 
        zone: "North", 
        coverage: "₹500", 
        status: "Active", 
        joined: "Jan 15, 2026",
        weeklyPremium: "₹40",
        riskLevel: "HIGH"
      },
      { 
        id: "U002", 
        name: "Priya Singh", 
        zone: "South", 
        coverage: "₹600", 
        status: "Active", 
        joined: "Feb 3, 2026",
        weeklyPremium: "₹25",
        riskLevel: "MEDIUM"
      },
      { 
        id: "U003", 
        name: "Amit Patel", 
        zone: "East", 
        coverage: "₹800", 
        status: "Active", 
        joined: "Jan 28, 2026",
        weeklyPremium: "₹40",
        riskLevel: "HIGH"
      },
      { 
        id: "U004", 
        name: "Neha Verma", 
        zone: "West", 
        coverage: "₹700", 
        status: "Inactive", 
        joined: "Feb 10, 2026",
        weeklyPremium: "₹25",
        riskLevel: "MEDIUM"
      },
      { 
        id: "U005", 
        name: "Vikram Sharma", 
        zone: "North", 
        coverage: "₹550", 
        status: "Active", 
        joined: "Feb 1, 2026",
        weeklyPremium: "₹40",
        riskLevel: "HIGH"
      },
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const getRiskColor = (risk?: string) => {
    switch(risk) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
              👥 Users
            </h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
            >
              {users.length} Total
            </motion.div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Manage and view all registered users with their dynamic premiums
          </p>
        </motion.div>

        {/* Table Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-white/20 dark:border-slate-700/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700/50 dark:to-slate-800/30 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Coverage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Weekly Premium
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {users.map((user, idx) => (
                  <motion.tr
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    className="transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 group cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-slate-900 dark:text-white font-semibold">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-semibold">
                      <motion.div
                        whileHover={{ paddingLeft: 8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {user.name}
                      </motion.div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-semibold transition-all"
                      >
                        {user.zone}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {user.coverage}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {user.weeklyPremium}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${getRiskColor(user.riskLevel)}`}
                      >
                        {user.riskLevel}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          user.status === "Active"
                            ? "bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-900/20 text-green-800 dark:text-green-300"
                            : "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/40 dark:to-gray-800/20 text-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {user.status === "Active" ? "🟢" : "⚫"} {user.status}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {user.joined}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/30 dark:to-slate-900/30 border-t border-slate-200 dark:border-slate-700/50 px-6 py-4 flex items-center justify-between"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing {users.length} users
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              💰 Avg Premium: ₹{Math.round(users.reduce((sum, u) => sum + (parseInt(u.weeklyPremium?.replace(/₹/g, '') || '0')), 0) / users.length)}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default UsersTable;
