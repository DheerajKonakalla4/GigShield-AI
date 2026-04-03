"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
} from "@/components/design-system";
import {
  TrendingUp,
  Users,
  Activity,
  Mail,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

/**
 * Example Dashboard Component
 *
 * This showcase demonstrates how to build a complete dashboard page
 * using the design system components with animations.
 *
 * Features demonstrated:
 * - Card variants (glass, gradient, elevated)
 * - Button variants and sizes
 * - Badge status indicators
 * - Input fields with validation
 * - Layout with responsive grid
 * - Framer Motion animations
 * - Dark mode support
 */

export function ExampleDashboard() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      setEmailError("Email is required");
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
      console.log("Subscribed:", email);
    }
  };

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

  const metrics = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12.5%",
      trend: "up",
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: "Revenue",
      value: "$48,392",
      change: "+8.2%",
      trend: "up",
      icon: <TrendingUp className="w-8 h-8" />,
    },
    {
      title: "Active Sessions",
      value: "3,847",
      change: "-2.4%",
      trend: "down",
      icon: <Activity className="w-8 h-8" />,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your application metrics and performance
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card variant="glass" hover>
              <CardContent className="flex items-start justify-between pt-0">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {metric.value}
                  </p>
                  <Badge
                    variant={metric.trend === "up" ? "success" : "warning"}
                    size="sm"
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div className="text-blue-500 dark:text-blue-400 opacity-20">
                  {metric.icon}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <motion.div variants={itemVariants}>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest events from your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "John Doe", action: "Signed up", time: "2 hours ago" },
                {
                  user: "Jane Smith",
                  action: "Updated profile",
                  time: "4 hours ago",
                },
                {
                  user: "Bob Johnson",
                  action: "Made a purchase",
                  time: "6 hours ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.user}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Newsletter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Subscribe Newsletter</CardTitle>
              <CardDescription>
                Get weekly insights and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Email Address"
                placeholder="your@email.com"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                error={emailError}
              />
              <Button
                variant="primary"
                className="w-full"
                onClick={handleSubscribe}
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>
                This month vs last month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Conversion Rate
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    animate={{ width: "68%" }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  68% (+5% from last month)
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Customer Satisfaction
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                    animate={{ width: "92%" }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  92% (+3% from last month)
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Section */}
      <motion.div variants={itemVariants}>
        <Card variant="default" className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-transparent">
          <CardContent className="flex items-center justify-between py-8 pt-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Ready to explore more?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check out our design system showcase
              </p>
            </div>
            <a href="/design-system">
              <Button variant="primary" size="lg">
                View Components
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
