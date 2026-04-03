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
  Shield,
  Zap,
  CheckCircle,
  TrendingUp,
  Clock,
  Smartphone,
  ChevronRight,
  Check,
  ArrowRight,
} from "lucide-react";

export default function InsuranceLanding() {
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
      transition: { duration: 0.6 },
    },
  };

  const features = [
    {
      title: "AI Risk Pricing",
      description:
        "Smart algorithms analyze real-time data to calculate fair premiums based on actual risk",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Instant Payouts",
      description:
        "Get claimed amounts within 24 hours, directly to your bank account",
      icon: <Zap className="w-8 h-8" />,
      color:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Zero Claims Hassle",
      description:
        "No paperwork, no lengthy verification. Automatic payouts when disruptions occur",
      icon: <CheckCircle className="w-8 h-8" />,
      color:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Mobile First",
      description:
        "Manage your coverage and claims directly from your smartphone",
      icon: <Smartphone className="w-8 h-8" />,
      color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Buy Weekly Plan",
      description:
        "Choose your coverage level based on your delivery pattern. Flexible plans starting at just $4.99/week.",
      highlights: [
        "Choose coverage level",
        "Flexible payment options",
        "Cancel anytime",
      ],
    },
    {
      number: "02",
      title: "System Monitors Disruptions",
      description:
        "Our AI continuously monitors weather, traffic, and platform disruptions in your area. Real-time protection 24/7.",
      highlights: [
        "Real-time monitoring",
        "Weather tracking",
        "Platform status alerts",
      ],
    },
    {
      number: "03",
      title: "Automatic Payout",
      description:
        "When disruptions occur, verified earnings are automatically deposited to your account. No claims needed.",
      highlights: ["Automatic processing", "24-hour deposits", "No paperwork"],
    },
  ];

  const testimonials = [
    {
      name: "Marcus J.",
      role: "DoorDash Courier",
      quote:
        "Got paid for rain disruptions I wouldn't have noticed otherwise. This is a game-changer for gig workers.",
      avatar: "M",
    },
    {
      name: "Sarah L.",
      role: "Instacart Shopper",
      quote:
        "Finally have peace of mind. When bad weather hits, I know I'm covered without any stress.",
      avatar: "S",
    },
    {
      name: "James K.",
      role: "Uber Eats Driver",
      quote:
        "The automatic payouts are incredible. I don't have to worry about anything.",
      avatar: "J",
    },
  ];

  return (
    <>
      <Navbar
        logoText="DeliveryGuard AI"
        logo={
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
        }
        items={[
          { label: "Features", href: "#features" },
          { label: "How It Works", href: "#how-it-works" },
          { label: "Pricing", href: "#pricing" },
        ]}
        rightItems={
          <Button size="sm" variant="primary">
            Get Started
          </Button>
        }
        transparent
      />

      <main className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Animated background gradients */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                y: [0, 100, 0],
                x: [0, 50, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                y: [0, -100, 0],
                x: [0, -50, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                y: [0, 50, 0],
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <Badge variant="info" dot size="lg">
                🚀 Trusted by 50K+ Delivery Workers
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
                Protect Your Income,{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Rain or Shine
                </span>
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              AI-powered insurance platform that pays automatically when you
              can't deliver due to disruptions. No claims. No hassle. Just
              protection.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" variant="primary" className="group">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="secondary">
                Learn More
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 pt-8 max-w-md mx-auto"
            >
              {[
                { label: "Avg Payout", value: "$247" },
                { label: "Processing", value: "24hrs" },
                { label: "Satisfaction", value: "98%" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          id="features"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <Badge variant="purple" size="lg">
              Why Choose DeliveryGuard AI
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Insurance Reimagined for Delivery Workers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We understand the gig economy. Our AI-powered approach means
              better coverage at lower costs.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card variant="glass" hover>
                  <CardContent className="pt-0">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-xl ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          id="how-it-works"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <Badge variant="success" size="lg">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Three Simple Steps to Protection
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  variant={index === 1 ? "gradient" : "glass"}
                  className={index === 1 ? "ring-2 ring-blue-500" : ""}
                >
                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      {/* Step Number and Title */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-6xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {step.number}
                          </p>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-3">
                        {step.highlights.map((highlight, hIndex) => (
                          <motion.div
                            key={hIndex}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50"
                            whileHover={{ x: 4 }}
                          >
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {highlight}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-4">
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ChevronRight className="w-8 h-8 text-gray-400 rotate-90" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          id="pricing"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <Badge variant="secondary" size="lg">
              Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Coverage That Fits Your Schedule
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple, predictable pricing. No hidden fees. Cancel anytime.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Weekend Plan",
                price: "$4.99",
                period: "/week",
                desc: "Friday to Sunday",
                features: [
                  "Friday-Sunday coverage",
                  "Up to $500 payout",
                  "Weather monitoring",
                  "Mobile app access",
                ],
              },
              {
                name: "Full-Time Plan",
                price: "$12.99",
                period: "/week",
                desc: "7 days a week",
                highlighted: true,
                features: [
                  "Full week coverage",
                  "Up to $1,000 payout",
                  "Priority payouts",
                  "Weather + traffic monitoring",
                  "24/7 support",
                ],
              },
              {
                name: "Premium Plan",
                price: "$19.99",
                period: "/week",
                desc: "Maximum protection",
                features: [
                  "Unlimited coverage",
                  "Up to $2,000 payout",
                  "Priority + instant payouts",
                  "All monitoring features",
                  "VIP support",
                  "Bonus coverage",
                ],
              },
            ].map((plan, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  variant={plan.highlighted ? "elevated" : "glass"}
                  className={
                    plan.highlighted ? "ring-2 ring-blue-500 transform md:scale-105" : ""
                  }
                >
                  <CardHeader>
                    {plan.highlighted && (
                      <Badge variant="success" className="w-fit mb-2">
                        Most Popular
                      </Badge>
                    )}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.desc}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <span className="text-4xl font-bold">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.period}
                      </span>
                    </div>

                    <Button
                      variant={plan.highlighted ? "primary" : "secondary"}
                      className="w-full"
                    >
                      Get Started
                    </Button>

                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {plan.features.map((feature, fIndex) => (
                        <motion.div
                          key={fIndex}
                          className="flex items-center gap-3"
                          whileHover={{ x: 4 }}
                        >
                          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <Badge variant="info" size="lg">
              Real Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Trusted by Delivery Workers Nationwide
            </h2>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card variant="gradient">
                  <CardContent className="pt-0 space-y-4">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <span className="text-yellow-400">★</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-lg text-gray-900 dark:text-white italic">
                      "{testimonial.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
        >
          <Card variant="gradient" className="p-8 md:p-12 text-center space-y-6 border-2 border-blue-500/50">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            >
              Ready to Protect Your Income?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              Join thousands of delivery workers who are already protected.
              Start today and get your first week at 50% off.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Button size="lg" variant="primary">
                Claim Your Discount
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="secondary">
                Schedule a Call
              </Button>
            </motion.div>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    DeliveryGuard AI
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Insurance reimagined for the gig economy.
                </p>
              </motion.div>

              {/* Links */}
              {[
                {
                  title: "Product",
                  links: ["Features", "Pricing", "Security"],
                },
                {
                  title: "Company",
                  links: ["About", "Blog", "Careers"],
                },
                {
                  title: "Legal",
                  links: ["Terms", "Privacy", "Contact"],
                },
              ].map((section, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.links.map((link, lIndex) => (
                      <li key={lIndex}>
                        <a
                          href="#"
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Bottom */}
            <motion.div
              variants={itemVariants}
              className="border-t border-gray-200 dark:border-gray-800 pt-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  © 2026 DeliveryGuard AI. All rights reserved.
                </p>
                <div className="flex gap-6">
                  {["Twitter", "LinkedIn", "Facebook"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.footer>
      </main>
    </>
  );
}
