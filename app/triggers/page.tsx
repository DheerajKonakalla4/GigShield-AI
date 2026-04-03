import TriggerDashboard from "@/components/TriggerDashboard";

export const metadata = {
  title: "Trigger Engine - Real-time Disruption Detection",
  description:
    "Monitor and manage real-time disruption triggers with advanced analytics",
};

export default function TriggerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <TriggerDashboard />
      </div>
    </main>
  );
}
