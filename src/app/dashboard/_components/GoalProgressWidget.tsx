"use client";

import { motion } from "framer-motion";
import { mockGoals } from "@/data/goals";
import { Target, ChevronLeft } from "lucide-react";
import Link from "next/link";

export function GoalProgressWidget() {
  const topGoal = mockGoals[0];
  const progress = Math.min((topGoal.currentAmount / topGoal.targetAmount) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl p-5 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
          <Target className="w-4 h-4 text-sukuk-green" />
          هدفك الحالي
        </h3>
        <Link href="/goals" className="text-xs font-semibold text-sukuk-green hover:underline flex items-center">
          عرض الكل
          <ChevronLeft className="w-3 h-3 ms-1" />
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">{topGoal.emoji}</div>
        <div>
          <p className="font-heading font-semibold text-sm">{topGoal.title}</p>
          <p className="text-xs text-muted-foreground">
            الباقي {(topGoal.targetAmount - topGoal.currentAmount).toLocaleString()} ج
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between text-xs font-medium mb-1.5">
          <span className="text-sukuk-green">{progress.toFixed(1)}%</span>
          <span className="text-muted-foreground">الهدف: {topGoal.targetAmount.toLocaleString()}</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: topGoal.color, originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
