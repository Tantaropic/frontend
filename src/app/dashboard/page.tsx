"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowDownToLine, PauseCircle, FastForward } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { BalanceCard } from "./_components/BalanceCard";
import { PortfolioChart } from "./_components/PortfolioChart";
import { InsightCards } from "./_components/InsightCards";
import { totalReturnRate } from "@/data/assets";
import { toast } from "sonner";
import { GoalProgressWidget } from "./_components/GoalProgressWidget";
import { RecentSweepsWidget } from "./_components/RecentSweepsWidget";
import { ProjectedGrowthWidget } from "./_components/ProjectedGrowthWidget";

// Mock purchases for simulate button
const MOCK_PURCHASES = [
  { merchant: "ماكدونالدز 🍔", invested: 3 },
  { merchant: "ستار باكس ☕", invested: 5 },
  { merchant: "أوبر 🚗", invested: 2 },
  { merchant: "كارفور 🛒", invested: 8 },
  { merchant: "بيتزا هت 🍕", invested: 3 },
];

const QUICK_ACTIONS = [
  {
    icon: Plus,
    label: "إضافة",
    color: "bg-sukuk-green-muted text-sukuk-green border-sukuk-green/20",
  },
  {
    icon: ArrowDownToLine,
    label: "سحب",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    icon: PauseCircle,
    label: "إيقاف مؤقت",
    color: "bg-muted text-muted-foreground border-border",
  },
];

export default function DashboardPage() {
  const [balance, setBalance] = useState(13_000);
  const [returnRate, setReturnRate] = useState(totalReturnRate);
  const [purchaseIdx, setPurchaseIdx] = useState(0);
  const [lastSimulated, setLastSimulated] = useState<{
    merchant: string;
    invested: number;
  } | null>(null);
  const [timeTraveling, setTimeTraveling] = useState(false);

  const handleSimulate = useCallback(() => {
    const purchase = MOCK_PURCHASES[purchaseIdx % MOCK_PURCHASES.length];
    setBalance((b) => b + purchase.invested);
    setLastSimulated(purchase);
    setPurchaseIdx((i) => i + 1);
    // Auto-clear toast after 3s
    setTimeout(() => setLastSimulated(null), 3000);
  }, [purchaseIdx]);

  const handleTimeTravel = useCallback(() => {
    if (timeTraveling) return;
    setTimeTraveling(true);
    toast("تقدم سنة كاملة!", {
      description: "جاري احتساب نمو المحفظة...",
      icon: "📈",
      duration: 2500,
    });
    // Simulate 1 year of 11.3% growth
    setBalance((b) => Math.round(b * (1 + totalReturnRate / 100)));
    setReturnRate((r) => +(r * 1.05).toFixed(1)); // compound slightly
    setTimeout(() => setTimeTraveling(false), 2500);
  }, [timeTraveling]);

  return (
    <AppShell>
      <div className="relative z-10 px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-muted-foreground text-sm">مرحباً بك 👋</p>
            <h1 className="font-heading font-bold text-xl text-foreground">
              محمد أحمد
            </h1>
          </div>

          {/* Time-travel button */}
          <motion.button
            onClick={handleTimeTravel}
            disabled={timeTraveling}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 glass border border-border px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <FastForward
              size={14}
              className={timeTraveling ? "text-sukuk-green animate-pulse" : ""}
            />
            <span>{timeTraveling ? "جاري التقدم..." : "تقدم سنة ⚡"}</span>
          </motion.button>
        </motion.div>

        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          returnRate={returnRate}
          onSimulate={handleSimulate}
          lastSimulated={lastSimulated}
        />

        {/* Chart + Quick Actions & Goals grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Portfolio Chart — takes 2/3 */}
          <div className="md:col-span-2">
            <PortfolioChart />
          </div>

          {/* Quick Actions & Goals — takes 1/3 */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl p-5 flex flex-col gap-3"
            >
              <h3 className="font-heading font-bold text-base text-foreground mb-1">
                إجراءات سريعة
              </h3>
              {QUICK_ACTIONS.map(({ icon: Icon, label, color }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.03, x: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-150 ${color}`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </motion.button>
              ))}

              {/* Sharia badge */}
              <div className="mt-auto pt-4 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  🕌 100% متوافق مع الشريعة
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  معتمد من هيئة الفتوى
                </p>
              </div>
            </motion.div>

            <GoalProgressWidget />
          </div>
        </div>

        {/* Growth & Recent Sweeps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectedGrowthWidget />
          <RecentSweepsWidget />
        </div>

        {/* Insight Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <InsightCards />
        </motion.div>


      </div>
    </AppShell>
  );
}
