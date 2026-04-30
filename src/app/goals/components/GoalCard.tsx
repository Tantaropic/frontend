"use client";

import { Goal } from "@/types";
import { AnimatedProgressBar } from "@/components/ui/AnimatedProgressBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, Variants } from "framer-motion";

interface GoalCardProps {
  goal: Goal;
  index: number;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function GoalCard({ goal, index }: GoalCardProps) {
  const percentage = Math.min(
    100,
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
  );

  // Calculate days remaining from today
  const today = new Date();
  const targetDate = new Date(goal.targetDate);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate projected reach date based on monthly roundup
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const monthsToReach = Math.ceil(remainingAmount / goal.monthlyRoundup);
  const projectedDate = new Date();
  projectedDate.setMonth(projectedDate.getMonth() + monthsToReach);

  const projectedMonthYear = projectedDate.toLocaleDateString("ar-EG", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6 relative overflow-hidden group">
        <div className="absolute top-0 inset-e-0 p-6 opacity-10 text-6xl pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
          {goal.emoji}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white shadow-sm text-2xl">
                {goal.emoji}
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground">
                {goal.title}
              </h3>
            </div>
            {diffDays > 0 && (
              <span className="text-xs font-medium text-sukuk-green bg-sukuk-green/10 px-3 py-1.5 rounded-full">
                باقي {diffDays} يوم
              </span>
            )}
          </div>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">التقدم</span>
            <span
              className="font-bold tabular-nums"
              style={{ color: goal.color }}
            >
              {goal.currentAmount.toLocaleString()} من{" "}
              {goal.targetAmount.toLocaleString()} جنيه
            </span>
          </div>

          <AnimatedProgressBar
            value={percentage}
            delay={0.2 + index * 0.1}
            color={goal.color}
            showLabel={false}
            className="mb-4"
          />

          <div className="flex justify-between items-center text-xs mt-4 pt-4 border-t border-sukuk-warm-gray/60">
            <span className="text-muted-foreground">
              بالمعدل الحالي هتوصل في:
            </span>
            <span className="font-bold text-foreground">
              {projectedMonthYear}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
