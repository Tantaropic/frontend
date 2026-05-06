"use client";

import { Goal } from "@/types";
import { AnimatedProgressBar } from "@/components/ui/AnimatedProgressBar";
import { Button } from "@/components/ui/button";
import { formatEGP } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Trash2,
  TrendingUp,
} from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  index: number;
  deleting?: boolean;
  onDelete?: (goal: Goal) => void;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function formatGoalDate(value: Goal["targetDate"]) {
  if (!value) return null;
  const targetDate = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(targetDate.getTime())) return null;
  return targetDate.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysUntilGoal(value: Goal["targetDate"]) {
  if (!value) return null;
  const targetDate = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(targetDate.getTime())) return null;
  const diffTime = targetDate.getTime() - Date.now();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function GoalCard({ goal, index, deleting, onDelete }: GoalCardProps) {
  const percentage = Math.min(
    100,
    Math.max(
      0,
      goal.progressPercent ??
        (goal.targetAmount > 0
          ? (goal.currentAmount / goal.targetAmount) * 100
          : 0),
    ),
  );

  const remainingAmount =
    goal.remainingAmount ?? Math.max(0, goal.targetAmount - goal.currentAmount);
  const daysRemaining = daysUntilGoal(goal.targetDate);
  const formattedDate = formatGoalDate(goal.targetDate);
  const isComplete = goal.status === "COMPLETED" || percentage >= 100;
  const monthlyRoundup = Math.max(0, goal.monthlyRoundup);
  const monthsToReach =
    remainingAmount > 0 && monthlyRoundup > 0
      ? Math.ceil(remainingAmount / monthlyRoundup)
      : null;

  const projectedDate = monthsToReach ? new Date() : null;
  if (projectedDate && monthsToReach !== null) {
    projectedDate.setMonth(projectedDate.getMonth() + monthsToReach);
  }
  const projectedMonthYear = projectedDate?.toLocaleDateString("ar-EG", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div variants={itemVariants}>
      <article className="group relative overflow-hidden rounded-2xl border border-border bg-white/72 p-5 shadow-sm backdrop-blur-sm transition-colors hover:border-sukuk-green/25">
        <div className="pointer-events-none absolute top-0 inset-e-0 p-6 text-6xl opacity-10 transition-transform duration-500 group-hover:scale-110">
          {goal.emoji}
        </div>

        <div className="relative z-10">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                {goal.emoji}
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-heading text-lg font-semibold text-foreground">
                  {goal.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  {isComplete ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-sukuk-green" />
                  ) : (
                    <Clock3 className="h-3.5 w-3.5 text-sukuk-gold" />
                  )}
                  <span>{isComplete ? "مكتمل" : "نشط"}</span>
                </p>
              </div>
            </div>
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(goal)}
                disabled={deleting}
                title="حذف الهدف"
                aria-label={`حذف ${goal.title}`}
              >
                <Trash2 />
              </Button>
            )}
          </div>

          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-muted-foreground">التقدم</span>
            <span
              className="font-bold tabular-nums text-foreground"
              style={{ color: goal.color }}
            >
              {formatEGP(goal.currentAmount)}
            </span>
          </div>

          <AnimatedProgressBar
            value={percentage}
            delay={0.2 + index * 0.1}
            color={goal.color}
            showLabel={false}
            className="mb-3"
          />

          <div className="mb-4 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold tabular-nums text-sukuk-green">
              {percentage.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">
              الهدف {formatEGP(goal.targetAmount)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-border pt-4 text-xs sm:grid-cols-3">
            <div className="rounded-xl bg-background/65 p-3">
              <p className="text-muted-foreground">المتبقي</p>
              <p className="mt-1 font-bold tabular-nums text-foreground">
                {formatEGP(remainingAmount)}
              </p>
            </div>
            <div className="rounded-xl bg-background/65 p-3">
              <p className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                آخر 30 يوم
              </p>
              <p className="mt-1 font-bold tabular-nums text-foreground">
                {formatEGP(monthlyRoundup)}
              </p>
            </div>
            <div className="rounded-xl bg-background/65 p-3">
              <p className="flex items-center gap-1 text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" />
                الموعد
              </p>
              <p className="mt-1 font-bold text-foreground">
                {formattedDate ??
                  (projectedMonthYear ? projectedMonthYear : "غير محدد")}
              </p>
            </div>
          </div>

          {daysRemaining !== null && daysRemaining > 0 && !isComplete && (
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              باقي {daysRemaining.toLocaleString("ar-EG")} يوم على الموعد المحدد
            </p>
          )}
        </div>
      </article>
    </motion.div>
  );
}
