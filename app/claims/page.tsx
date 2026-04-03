import ClaimsDashboard from "@/components/ClaimsDashboard";
import { motion } from "framer-motion";

export const metadata = {
  title: "Claims Management | Insurance Platform",
  description: "Manage and track insurance claims with real-time processing",
};

export default function ClaimsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Auto-Processing Banner */}
        <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
          <div className="text-2xl">✨</div>
          <div>
            <h3 className="font-bold text-green-900 dark:text-green-300 mb-1">
              Zero-Touch Automation
            </h3>
            <p className="text-sm text-green-800 dark:text-green-400">
              Claims are automatically triggered and approved based on real-world disruption events. 
              No manual filing required. You will receive payouts instantly when weather, pollution, or other 
              disruptions are detected in your zone.
            </p>
          </div>
        </div>
        
        <ClaimsDashboard />
      </div>
    </div>
  );
}
