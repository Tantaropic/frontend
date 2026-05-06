"use client";

import { useCallback, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Flag,
  Target,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { useIdentity } from "@/components/providers/IdentityProvider";
import { api } from "@/lib/api/sdk";
import { ApiError } from "@/lib/api/types";
import { egpToPiastersString } from "@/lib/money";
import { formatEGP } from "@/lib/utils";
import { useSse } from "@/lib/api/useSse";
import type { Goal } from "@/types";
import {
  CreateGoalModal,
  type CreateGoalFormInput,
} from "./components/CreateGoalModal";
import { GoalCard } from "./components/GoalCard";
import { useGoals } from "./_hooks/useGoals";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white/72 p-4 shadow-sm backdrop-blur-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sukuk-green-muted text-sukuk-green">
        {icon}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-lg font-bold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}

export default function GoalsPage() {
  const { identity, bootstrapping, bootstrapError } = useIdentity();
  const userId = identity?.userId;
  const { goals, loading, error, refetch } = useGoals(userId);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useSse(userId, (message) => {
    if (message.channel === "wallet" || message.channel === "transactions") {
      void refetch();
    }
  });

  const summary = useMemo(() => {
    const visibleGoals = goals.filter((goal) => goal.status !== "ARCHIVED");
    const totalTarget = visibleGoals.reduce(
      (sum, goal) => sum + goal.targetAmount,
      0,
    );
    const totalCurrent = visibleGoals.reduce(
      (sum, goal) => sum + goal.currentAmount,
      0,
    );
    const completedCount = visibleGoals.filter(
      (goal) =>
        goal.status === "COMPLETED" || (goal.progressPercent ?? 0) >= 100,
    ).length;
    const overallProgress =
      totalTarget > 0 ? Math.min(100, (totalCurrent / totalTarget) * 100) : 0;

    return {
      visibleGoals,
      totalTarget,
      totalCurrent,
      completedCount,
      overallProgress,
    };
  }, [goals]);

  const handleCreateGoal = useCallback(
    async (input: CreateGoalFormInput) => {
      if (!userId) return;
      setCreating(true);
      try {
        await api.goals.create(userId, {
          title: input.title,
          emoji: input.emoji,
          targetAmount: egpToPiastersString(input.targetAmountEgp),
          targetDate: input.targetDate || undefined,
          monthlyRoundup:
            input.monthlyRoundupEgp && input.monthlyRoundupEgp > 0
              ? egpToPiastersString(input.monthlyRoundupEgp)
              : undefined,
          color: input.color,
        });
        toast.success("تم حفظ الهدف");
        await refetch();
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "فشل حفظ الهدف";
        toast.error(message);
        throw err;
      } finally {
        setCreating(false);
      }
    },
    [userId, refetch],
  );

  const handleDeleteGoal = useCallback(
    async (goal: Goal) => {
      if (!userId || deletingId) return;
      const confirmed = window.confirm(`حذف هدف ${goal.title}؟`);
      if (!confirmed) return;

      setDeletingId(goal.id);
      try {
        await api.goals.delete(userId, goal.id);
        toast.success("تم حذف الهدف");
        await refetch();
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "فشل حذف الهدف";
        toast.error(message);
      } finally {
        setDeletingId(null);
      }
    },
    [deletingId, userId, refetch],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6 p-4 pt-8 md:p-6 lg:p-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-2 text-xs font-semibold text-sukuk-green">
              الأهداف
            </p>
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              خطتك الجاية من محفظتك الفعلية
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              كل هدف هنا محسوب من رصيدك واستثماراتك الموجودة في الباك اند.
            </p>
          </div>
          <CreateGoalModal
            onCreate={handleCreateGoal}
            busy={creating}
            disabled={!userId || bootstrapping}
          />
        </motion.header>

        {(bootstrapError || error) && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>{bootstrapError ?? error}</span>
          </div>
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryTile
            icon={<Target className="h-4 w-4" />}
            label="إجمالي المستهدف"
            value={formatEGP(summary.totalTarget)}
          />
          <SummaryTile
            icon={<WalletCards className="h-4 w-4" />}
            label="مخصص للأهداف"
            value={formatEGP(summary.totalCurrent)}
          />
          <SummaryTile
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="أهداف مكتملة"
            value={`${summary.completedCount.toLocaleString("ar-EG")} / ${summary.visibleGoals.length.toLocaleString("ar-EG")}`}
          />
        </section>

        {summary.totalTarget > 0 && (
          <section className="rounded-2xl border border-border bg-white/72 p-4 shadow-sm backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">تقدم كل الأهداف</span>
              <span className="tabular-nums text-sukuk-green">
                {summary.overallProgress.toFixed(1)}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full origin-right rounded-full bg-sukuk-green"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: summary.overallProgress / 100 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </section>
        )}

        {loading && goals.length === 0 && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 rounded-2xl border border-border bg-white/65 p-5 shadow-sm"
              >
                <div className="shimmer h-10 w-32 rounded-xl bg-muted" />
                <div className="shimmer mt-8 h-3 w-full rounded-full bg-muted" />
                <div className="mt-8 grid grid-cols-3 gap-2">
                  <div className="shimmer h-16 rounded-xl bg-muted" />
                  <div className="shimmer h-16 rounded-xl bg-muted" />
                  <div className="shimmer h-16 rounded-xl bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && summary.visibleGoals.length === 0 && (
          <section className="rounded-2xl border border-dashed border-sukuk-green/35 bg-white/68 p-8 text-center shadow-sm backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sukuk-green-muted text-sukuk-green">
              <Flag className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              ابدأ بأول هدف
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
              الهدف الأول هيظهر كمان في لوحة التحكم كهدف الادخار الأساسي.
            </p>
          </section>
        )}

        {summary.visibleGoals.length > 0 && (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          >
            {summary.visibleGoals.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                index={index}
                deleting={deletingId === goal.id}
                onDelete={handleDeleteGoal}
              />
            ))}
          </motion.section>
        )}
      </div>
    </AppShell>
  );
}
