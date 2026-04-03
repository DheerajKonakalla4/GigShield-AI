"use client";

import { motion } from "framer-motion";

const SettingsForm = () => {
  const sections = [
    {
      title: "📋 General Settings",
      description: "System configuration and branding",
      fields: [
        { label: "System Name", placeholder: "DeliveryGuard AI", type: "text" },
        { label: "Support Email", placeholder: "support@deliveryguard.ai", type: "email" },
      ],
    },
    {
      title: "💼 Claims Configuration",
      description: "Adjust claim processing timelines",
      fields: [
        { label: "Auto-Process Delay (hours)", placeholder: "1", type: "number" },
        { label: "Approval Delay (hours)", placeholder: "24", type: "number" },
        { label: "Payment Delay (hours)", placeholder: "48", type: "number" },
      ],
    },
    {
      title: "🔔 Notifications",
      description: "Control how you receive updates",
      toggles: ["Email Alerts", "SMS Alerts", "Dashboard Notifications", "Weekly Reports"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
            ⚙️ Settings
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage system configuration and preferences
          </p>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {sections.map((section, sectionIdx) => (
            <motion.div
              key={sectionIdx}
              variants={itemVariants}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-white/20 dark:border-slate-700/50 p-8"
            >
              <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700/50">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-slate-900 dark:text-white"
                >
                  {section.title}
                </motion.h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {section.description}
                </p>
              </div>

              {/* Text Fields */}
              {section.fields && (
                <div className="space-y-5">
                  {section.fields.map((field, fieldIdx) => (
                    <motion.div
                      key={fieldIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + fieldIdx * 0.05 }}
                      className="space-y-2.5"
                    >
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {field.label}
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                        type={field.type}
                        placeholder={field.placeholder}
                        defaultValue={field.placeholder}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-all duration-300 text-sm font-medium"
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Toggles */}
              {section.toggles && (
                <div className="space-y-3">
                  {section.toggles.map((toggle, toggleIdx) => (
                    <motion.label
                      key={toggleIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + toggleIdx * 0.05 }}
                      className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all group"
                    >
                      <motion.input
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 accent-gradient-to-r accent-blue-600 cursor-pointer transition-all"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-200 font-medium transition">
                        {toggle}
                      </span>
                    </motion.label>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {/* Save Section */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between pt-4"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Changes are auto-saved to the cloud
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/30"
              >
                💾 Save Settings
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsForm;
