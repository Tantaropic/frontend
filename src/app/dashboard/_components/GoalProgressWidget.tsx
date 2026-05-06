"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { formatEGP } from "@/lib/utils";

interface GoalProgressWidgetProps {
  /** EGP amount currently saved (wallet balance). */
  current: number;
  /** EGP target the user set; null when unset. */
  target: number | null;
}

export function GoalProgressWidget({ current, target }: GoalProgressWidgetProps) {
  const hasGoal = target !== null && target > 0;
  const progress = hasGoal ? Math.min((current / target) * 100, 100) : 0;

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
          هدف الادخار
        </h3>
      </div>

      {!hasGoal ? (
        <p className="text-sm text-muted-foreground">
          لم تحدد هدفًا بعد. اضبط هدفك من الإعدادات.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">🎯</div>
            <div>
              <p className="font-heading font-semibold text-sm">
                الباقي {formatEGP(Math.max(0, target - current))}
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-sukuk-green">{progress.toFixed(1)}%</span>
              <span className="text-muted-foreground">
                الهدف: {formatEGP(target)}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-sukuk-green"
                style={{ originX: 1 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
