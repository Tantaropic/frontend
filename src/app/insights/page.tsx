"use client";

import { AppShell } from "@/components/layout/AppShell";
import { SpendingBehaviorChart } from "./components/SpendingBehaviorChart";
import { EmotionalNudgeList } from "./components/EmotionalNudgeList";
import { motion } from "framer-motion";
import { useIdentity } from "@/components/providers/IdentityProvider";
import { useInsights } from "@/app/dashboard/_hooks/useInsights";
import { useDashboard } from "@/app/dashboard/_hooks/useDashboard";

export default function InsightsPage() {
  const { identity } = useIdentity();
  const insights = useInsights(identity?.userId);
  const dashboard = useDashboard(identity?.userId);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pt-8 space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            المحلل المالي
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            تابع إنجازات محفظتك والتنبيهات الذكية المرتبطة بفكتك.
          </p>
        </div>

        {insights.error && (
          <p className="text-sm text-red-600">{insights.error}</p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SpendingBehaviorChart ledger={dashboard.data?.ledger} />
        </motion.div>

        <EmotionalNudgeList insights={insights.data} />
      </div>
    </AppShell>
  );
}
