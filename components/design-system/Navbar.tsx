"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoText?: string;
  items?: Array<{
    label: string;
    href: string;
    active?: boolean;
    icon?: React.ReactNode;
  }>;
  rightItems?: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo,
      logoText = "Dashboard",
      items = [],
      rightItems,
      sticky = true,
      transparent = false,
      ...props
    },
    ref
  ) => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navClasses = transparent
      ? isScrolled
        ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm border-b border-gray-200/20 dark:border-gray-800/20"
        : "bg-transparent"
      : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm";

    return (
      <motion.nav
        ref={ref}
        className={cn(
          "z-50 transition-all duration-300",
          sticky && "sticky top-0",
          navClasses,
          className
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {logo && <div className="flex items-center">{logo}</div>}
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {logoText}
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {items.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2",
                    item.active
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  )}
                  whileHover={{ x: 2 }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                  {item.active && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Right Items */}
            <div className="flex items-center gap-4">
              {rightItems}
              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileOpen(!mobileOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-6 h-6 text-gray-900 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            className="md:hidden overflow-hidden"
            animate={{
              height: mobileOpen ? "auto" : 0,
              opacity: mobileOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {items.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className={cn(
                    "block px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    item.active
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  )}
                  whileHover={{ x: 4 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.nav>
    );
  }
);

Navbar.displayName = "Navbar";

export { Navbar };
