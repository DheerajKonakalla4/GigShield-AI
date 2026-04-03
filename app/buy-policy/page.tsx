"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
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
  Sliders,
  CheckCircle,
  AlertCircle,
  MapPin,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  Smartphone,
  ArrowRight,
} from "lucide-react";

export default function BuyPolicyPage() {
  const [coverageAmount, setCoverageAmount] = useState(500);
  const [location, setLocation] = useState("north");
  const [purchased, setPurchased] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock locations with risk multipliers
  const locations = [
    { id: "north", name: "North Zone", risk: 1.0 },
    { id: "south", name: "South Zone", risk: 0.95 },
    { id: "east", name: "East Zone", risk: 1.1 },
    { id: "west", name: "West Zone", risk: 1.05 },
  ];

  // Calculate premium dynamically
  const premium = useMemo(() => {
    const baseRate = 0.05; // 5% of coverage amount
    const locationData = locations.find((l) => l.id === location);
    const riskMultiplier = locationData?.risk || 1.0;
    const calculatedPremium = coverageAmount * baseRate * riskMultiplier;
    return Math.round(calculatedPremium * 100) / 100;
  }, [coverageAmount, location]);

  // Determine risk level
  const getRiskLevel = () => {
    if (coverageAmount < 300) return { level: "Low", color: "emerald" };
    if (coverageAmount < 600) return { level: "Medium", color: "amber" };
    return { level: "High", color: "red" };
  };

  const riskLevel = getRiskLevel();

  // Calculate savings vs market
  const marketPrice = Math.round(coverageAmount * 0.08);
  const savings = marketPrice - premium;
  const savingsPercent = Math.round((savings / marketPrice) * 100);

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

  const handleBuyNow = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPurchased(true);
    setIsProcessing(false);

    // Reset after 3 seconds
    setTimeout(() => {
      setPurchased(false);
      setCoverageAmount(500);
    }, 3000);
  };

  const getCurrentLocation = () => {
    return locations.find((l) => l.id === location);
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
          { label: "Dashboard", href: "/dashboard" },
          { label: "Policies", href: "#" },
        ]}
        rightItems={
          <Button size="sm" variant="ghost">
            Help
          </Button>
        }
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Customize Your Coverage
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose the protection level that works best for you. Real-time
              pricing with no hidden fees.
            </p>
          </motion.div>

          {/* Success Toast */}
          <AnimatePresence>
            {purchased && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
              >
                <Card variant="glass" className="border-2 border-emerald-500">
                  <CardContent className="flex items-center gap-3 p-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6 }}
                    >
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                        Policy Purchased Successfully!
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Coverage starts immediately
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
              {/* Coverage Amount Card */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Select Coverage Amount
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Slider */}
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <label className="text-sm font-semibold text-gray-900 dark:text-white">
                        Coverage
                      </label>
                      <motion.div
                        key={coverageAmount}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text"
                      >
                        ₹{coverageAmount.toLocaleString("en-IN")}
                      </motion.div>
                    </div>

                    <div className="relative">
                      <input
                        type="range"
                        min="100"
                        max="1000"
                        step="50"
                        value={coverageAmount}
                        onChange={(e) => setCoverageAmount(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                            ((coverageAmount - 100) / (1000 - 100)) * 100
                          }%, #e5e7eb ${
                            ((coverageAmount - 100) / (1000 - 100)) * 100
                          }%, #e5e7eb 100%)`,
                        }}
                      />
                    </div>

                    {/* Range labels */}
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span>₹100</span>
                      <span>₹500</span>
                      <span>₹1000</span>
                    </div>
                  </div>

                  {/* Quick preset buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[200, 400, 600, 800].map((amount) => (
                      <motion.button
                        key={amount}
                        onClick={() => setCoverageAmount(amount)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          coverageAmount === amount
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        ₹{amount}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location Selection */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    Service Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {locations.map((loc) => (
                      <motion.button
                        key={loc.id}
                        onClick={() => setLocation(loc.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          location === loc.id
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {loc.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Risk: {(loc.risk * 100).toFixed(0)}%
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        icon: <Zap className="w-5 h-5" />,
                        title: "Instant Coverage",
                        desc: "Protection starts immediately after purchase",
                      },
                      {
                        icon: <Clock className="w-5 h-5" />,
                        title: "24-Hour Payouts",
                        desc: "Claims processed and paid within 24 hours",
                      },
                      {
                        icon: <Smartphone className="w-5 h-5" />,
                        title: "Mobile First",
                        desc: "Manage everything from your smartphone",
                      },
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 text-blue-600 dark:text-blue-400 flex-shrink-0">
                          {benefit.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {benefit.title}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {benefit.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar - Summary Card */}
            <div className="lg:col-span-1">
              <motion.div
                variants={itemVariants}
                className="sticky top-24 space-y-4"
              >
                {/* Summary Card */}
                <Card variant="elevated">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Your Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Coverage Amount */}
                    <motion.div
                      className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        Coverage
                      </p>
                      <motion.p
                        key={coverageAmount}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1"
                      >
                        ₹{coverageAmount}
                      </motion.p>
                    </motion.div>

                    {/* Weekly Premium */}
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Weekly Premium
                      </p>
                      <motion.div
                        key={premium}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="space-y-2 mt-1"
                      >
                        <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                          ₹{premium}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                          <TrendingUp className="w-3 h-3" />
                          Save ₹{savings} vs market (
                          {savingsPercent}%)
                        </div>
                      </motion.div>
                    </div>

                    {/* Risk Level */}
                    <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                        Risk Level
                      </p>
                      <motion.div
                        key={riskLevel.level}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 mt-2"
                      >
                        <Badge
                          variant={
                            riskLevel.color === "emerald"
                              ? "success"
                              : riskLevel.color === "amber"
                                ? "warning"
                                : "danger"
                          }
                          size="md"
                        >
                          {riskLevel.level}
                        </Badge>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {getCurrentLocation()?.name}
                        </span>
                      </motion.div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700" />

                    {/* Total Due */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Coverage:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ₹{coverageAmount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Premium:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ₹{premium}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Total Due:
                        </span>
                        <motion.span
                          key={premium}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text"
                        >
                          ₹{premium}
                        </motion.span>
                      </div>
                    </div>

                    {/* Buy Now Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleBuyNow}
                        disabled={isProcessing}
                        variant="primary"
                        className="w-full group"
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                              }}
                            >
                              ⏳
                            </motion.span>
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Buy Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </Button>
                    </motion.div>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      By purchasing, you agree to our{" "}
                      <a href="#" className="underline hover:text-gray-700">
                        Terms & Conditions
                      </a>
                    </p>
                  </CardContent>
                </Card>

                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center space-y-2"
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Secure &amp; Encrypted</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    30-day money-back guarantee
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Social Proof */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <CardContent className="py-6">
                <div className="text-center space-y-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Trusted by 50,000+ delivery workers
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-lg"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    4.9/5 average rating based on 8,200+ reviews
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
