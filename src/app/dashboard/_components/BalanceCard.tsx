"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, TrendingUp, Zap } from "lucide-react";
import { gsap } from "gsap";

import { useSimulation } from "@/components/simulation/SimulationContext";
import { formatPercent } from "@/lib/utils";
import type { Transaction } from "@/types";

interface BalanceCardProps {
  balance: number;
  /** Cash sitting in the wallet (uninvested). */
  pendingCash?: number;
  returnRate: number;
  onSimulate: () => void;
  /** Real ledger entries from the backend; aggregates are derived from these. */
  ledger?: Transaction[];
}

// (Aggregation now uses entry.kind directly — no string set lookup.)

export function BalanceCard({
  balance,
  pendingCash = 0,
  returnRate,
  onSimulate,
  ledger = [],
}: BalanceCardProps) {
  const balanceRef = useRef<HTMLSpanElement>(null);
  const prevBalance = useRef(0);
  const { isSimulating } = useSimulation();
  const [isSparkling, setIsSparkling] = useState(false);

  useEffect(() => {
    const handleInvestment = () => {
      setIsSparkling(true);
      setTimeout(() => setIsSparkling(false), 3000);
    };

    window.addEventListener("simulation:asset-investment", handleInvestment);
    return () => window.removeEventListener("simulation:asset-investment", handleInvestment);
  }, []);

  useEffect(() => {
    if (!balanceRef.current) return;
    const from = prevBalance.current;
    prevBalance.current = balance;
    const obj = { value: from };
    gsap.to(obj, {
      value: balance,
      duration: 1.6,
      delay: from === 0 ? 0.4 : 0,
      ease: "power2.out",
      onUpdate() {
        if (balanceRef.current) {
          balanceRef.current.textContent = Math.round(obj.value).toLocaleString(
            "ar-EG",
          );
        }
      },
    });
  }, [balance]);

  // Derive real aggregates from the actual ledger.
  // We only count user-initiated *inflows* (deposits + sweeps), not the
  // downstream INVESTMENT_ALLOCATION rows the allocator emits per slice —
  // those would double-count what's already represented by the deposit/sweep.
  const stats = useMemo(() => {
    const now = new Date();
    const todayKey = now.toDateString();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;

    let today = 0;
    let month = 0;
    let totalOps = 0;
    for (const entry of ledger) {
      const isInflow =
        entry.kind === "deposit" || entry.kind === "sweep";
      if (!isInflow) continue;
      if (entry.investedAmount <= 0) continue;
      totalOps += 1;
      const d = new Date(entry.timestamp);
      if (d.toDateString() === todayKey) today += entry.investedAmount;
      if (`${d.getFullYear()}-${d.getMonth()}` === monthKey)
        month += entry.investedAmount;
    }
    return { today, month, total: totalOps };
  }, [ledger]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isSparkling ? [1, 1.05, 1] : 1
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.38 0.15 152), oklch(0.50 0.14 152) 50%, oklch(0.44 0.13 165))",
        boxShadow: isSparkling
          ? "0 30px 80px oklch(0.60 0.20 152 / 60%)"
          : "0 20px 60px oklch(0.48 0.14 152 / 35%)",
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute -top-16 -inset-e-8 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(1 0 0 / 12%), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-10 -inset-s-4 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(1 0 0 / 8%), transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Balance */}
        <p className="text-white/65 text-sm font-medium mb-1">إجمالي المحفظة</p>
        <div className="flex items-baseline gap-2 mb-1 relative">
          <motion.span
            ref={balanceRef}
            animate={isSparkling ? { color: ["#fff", "#34d399", "#fff"] } : {}}
            className="font-heading font-bold text-5xl md:text-6xl tabular-nums"
          >
            0
          </motion.span>
          <span className="text-2xl font-medium text-white/80">جنيه</span>

          {/* Sparkle effect */}
          <AnimatePresence>
            {isSparkling && (
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-6 -right-6 text-yellow-300"
              >
                <Zap size={32} className="fill-yellow-300 shadow-glow" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-300 mb-2">
          <TrendingUp size={14} />
          <span className="text-sm font-medium">
            {formatPercent(returnRate, 2)} العائد الحالي
          </span>
        </div>
        {pendingCash > 0 && (
          <div className="inline-flex items-center gap-1.5 text-amber-200 bg-amber-500/15 border border-amber-300/30 rounded-full px-3 py-1 text-xs font-medium mb-6">
            <span>⏳</span>
            <span>
              {pendingCash.toLocaleString("ar-EG")} جنيه في انتظار الاستثمار
            </span>
          </div>
        )}
        {pendingCash <= 0 && <div className="mb-6" />}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/20 mb-6">
          {[
            { label: "مُستثمر اليوم", value: `${stats.today} جنيه` },
            { label: "هذا الشهر", value: `${stats.month} جنيه` },
            { label: "إجمالي العمليات", value: `${stats.total}` },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-white/55 text-xs mb-0.5">{s.label}</p>
              <div className="relative h-6 flex items-center">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={s.value}
                    initial={{
                      opacity: 0,
                      y: 15,
                      color: "#6ee7b7",
                      scale: 1.1,
                    }}
                    animate={{ opacity: 1, y: 0, color: "#ffffff", scale: 1 }}
                    exit={{ opacity: 0, y: -15, position: "absolute" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="font-heading font-bold text-base flex items-center gap-1.5 whitespace-nowrap origin-right"
                  >
                    <span>{s.value}</span>
                    <motion.span
                      initial={{ opacity: 1, y: 0, scale: 1.5 }}
                      animate={{ opacity: 0, y: -10, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="text-emerald-300"
                    >
                      <TrendingUp size={14} />
                    </motion.span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {/* Simulate button */}
        <motion.button
          onClick={onSimulate}
          disabled={isSimulating}
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className={`flex w-full items-center justify-center gap-2 border rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
            isSimulating
            ? "bg-white/10 border-white/10 text-white/45"
            : "bg-white text-emerald-900 hover:bg-emerald-50 border-white/70 shadow-lg shadow-black/10"
          }`}
        >
          {isSimulating ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Zap size={17} className="text-amber-500" />
          )}
          <span>{isSimulating ? "جاري معالجة الشراء..." : "محاكاة عملية شراء"}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
