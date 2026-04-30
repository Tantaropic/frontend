"use client";

import { AppShell } from "@/components/layout/AppShell";
import { mockInsights } from "@/data/insights";
import { SpendingBehaviorChart } from "./components/SpendingBehaviorChart";
import { EmotionalNudgeList } from "./components/EmotionalNudgeList";
import { motion } from "framer-motion";

export default function InsightsPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pt-8 space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            المحلل المالي
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            اكتشف عاداتك الشرائية وتأثير فكتك على مستقبلك المالي.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SpendingBehaviorChart />
        </motion.div>

        <EmotionalNudgeList insights={mockInsights} />
      </div>
    </AppShell>
  );
}
