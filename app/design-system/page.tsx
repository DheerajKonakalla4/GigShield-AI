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
  Navbar,
} from "@/components/design-system";
import { Heart, Search, Mail, Clock } from "lucide-react";

export default function DesignSystem() {
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState("");

  const handleValidateEmail = () => {
    if (!email) {
      setInputError("Email is required");
    } else if (!email.includes("@")) {
      setInputError("Please enter a valid email");
    } else {
      setInputError("");
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

  return (
    <>
      <Navbar
        logoText="Design System"
        logo={<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600" />}
        items={[
          { label: "Components", href: "#components", active: true },
          { label: "Examples", href: "#examples" },
          { label: "Docs", href: "#docs" },
        ]}
        rightItems={
          <Button size="sm" variant="primary">
            Get Started
          </Button>
        }
        transparent
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-6 pt-8"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Premium{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Design System
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Stripe/Uber quality components built with Tailwind CSS, shadcn/ui,
            and Framer Motion. Production-ready and fully customizable.
          </motion.p>
        </motion.section>

        {/* Buttons Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Buttons
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Multiple variants with hover effects and animations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Main Actions</CardTitle>
                <CardDescription>
                  Primary, secondary, and ghost variants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="primary" className="w-full">
                    Primary Button
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Secondary Button
                  </Button>
                  <Button variant="ghost" className="w-full">
                    Ghost Button
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>With Icons</CardTitle>
                <CardDescription>
                  Buttons with leading and trailing icons
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full"
                    icon={<Heart className="w-4 h-4" />}
                  >
                    Like
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    icon={<Mail className="w-4 h-4" />}
                  >
                    Email
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    icon={<Clock className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Sizes</CardTitle>
                <CardDescription>
                  Small, medium, large, and extra-large
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2 flex-wrap">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Status Variants</CardTitle>
                <CardDescription>
                  Success, danger, and other states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="success" className="w-full">
                  Success
                </Button>
                <Button variant="danger" className="w-full">
                  Danger
                </Button>
                <Button isLoading className="w-full">
                  Loading
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Cards Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cards
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Glass, gradient, and elevated card styles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Classic card style</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clean and simple card with subtle shadows.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Glassmorphism</CardTitle>
                <CardDescription>Modern frosted glass effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beautiful backdrop blur and transparency.
                </p>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Gradient Card</CardTitle>
                <CardDescription>Subtle gradient background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Elegant gradient with enhanced depth.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card variant="elevated" className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Revenue
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total revenue this month
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  $24,500
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  +12% from last month
                </p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Badges Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Badges
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Status indicators and labels.
            </p>
          </motion.div>

          <Card variant="glass">
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-3">
                <Badge variant="active" dot>
                  Active
                </Badge>
                <Badge variant="inactive" dot>
                  Inactive
                </Badge>
                <Badge variant="pending" dot>
                  Pending
                </Badge>
                <Badge variant="success" dot>
                  Paid
                </Badge>
                <Badge variant="danger" dot>
                  High Risk
                </Badge>
                <Badge variant="warning" dot>
                  Warning
                </Badge>
                <Badge variant="info" dot>
                  Info
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="active"
                  icon={<Heart className="w-3 h-3" />}
                  size="lg"
                >
                  Favorited
                </Badge>
                <Badge
                  variant="pending"
                  icon={<Clock className="w-3 h-3" />}
                  size="lg"
                >
                  In Progress
                </Badge>
                <Badge variant="success" size="lg">
                  Completed
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Inputs Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Inputs
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Clean and modern input fields.
            </p>
          </motion.div>

          <Card variant="glass">
            <CardContent className="space-y-6 pt-0">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (inputError) setInputError("");
                }}
                error={inputError}
              />

              <Input
                label="Search"
                placeholder="Search products..."
                icon={<Search className="w-4 h-4" />}
              />

              <Input
                label="Disabled Input"
                placeholder="This field is disabled"
                disabled
              />

              <Input
                label="With Hint"
                placeholder="Your password"
                type="password"
                hint="Minimum 8 characters required"
              />

              <div className="flex gap-2 pt-4">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleValidateEmail}
                >
                  Validate
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setEmail("");
                    setInputError("");
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Integration Example */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Example
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              All components working together in a dashboard card.
            </p>
          </motion.div>

          <Card variant="glass" className="p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-32" />
            <CardContent className="relative -mt-16 pb-6">
              <Card variant="elevated" className="p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Premium Account
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Your account status and recent activity
                    </p>
                  </div>
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      1,234
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      API Calls
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      98%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Uptime
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      45ms
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Latency
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <Input
                    label="Update your email"
                    placeholder="new@example.com"
                    type="email"
                    icon={<Mail className="w-4 h-4" />}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="ghost" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </Card>
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="text-center py-12 border-t border-gray-200 dark:border-gray-800"
        >
          <motion.p
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-400"
          >
            Design System • Built with Next.js, Tailwind CSS & Framer Motion
          </motion.p>
        </motion.div>
      </main>
    </>
  );
}
