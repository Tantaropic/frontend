"use client";

import { motion } from "framer-motion";
import { Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { formatEGP } from "@/lib/utils";
import type { Transaction } from "@/types";

import { useEffect, useState } from "react";

interface RecentSweepsWidgetProps {
  ledger?: Transaction[];
}

export function RecentSweepsWidget({ ledger = [] }: RecentSweepsWidgetProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const handleRoundup = () => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000);
    };
    window.addEventListener("simulation:roundup-engine", handleRoundup);
    return () => window.removeEventListener("simulation:roundup-engine", handleRoundup);
  }, []);

  // Latest 3 user-facing entries (sweep / deposit / buy). Hide internal fees.
  const recentSweeps = ledger
    .filter(
      (t) =>
        t.investedAmount > 0 &&
        (t.kind === "sweep" ||
          t.kind === "buy" ||
          t.kind === "deposit" ||
          t.kind === "sell"),
    )
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isPulsing ? [1, 1.02, 1] : 1,
        borderColor: isPulsing ? "rgba(5, 150, 105, 0.5)" : "rgba(0, 0, 0, 0.1)"
      }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className={`bg-white/70 backdrop-blur-sm border rounded-2xl p-5 flex flex-col h-full transition-colors duration-300 ${isPulsing ? "ring-2 ring-sukuk-green/20 shadow-lg" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
          <Clock className={`w-4 h-4 transition-colors ${isPulsing ? "text-sukuk-green" : "text-muted-foreground"}`} />
          أحدث الاستثمارات
        </h3>
        <Link href="/transactions" className="text-xs font-semibold text-sukuk-green hover:underline flex items-center">
          سجل العمليات
          <ChevronLeft className="w-3 h-3 ms-1" />
        </Link>
      </div>

      <div className="space-y-3 flex-1 relative">
        {recentSweeps.map((sweep, i) => (
          <motion.div
            key={sweep.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center justify-between p-2 hover:bg-white/40 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sukuk-cream flex items-center justify-center text-lg border border-border">
                {sweep.merchantIcon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-none mb-1">
                  {sweep.merchantName}
                </p>
                <p className="text-[10px] text-muted-foreground leading-none">
                  {new Date(sweep.timestamp).toLocaleDateString("ar-EG", { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
            <div className="text-end">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors ${isPulsing && i === 0 ? "bg-sukuk-green text-white" : "text-sukuk-green bg-sukuk-green/10"}`}>
                +{formatEGP(sweep.investedAmount)}
              </span>
            </div>
          </motion.div>
        ))}
        {recentSweeps.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">
            لا توجد استثمارات حديثة.
          </div>
        )}
      </div>
    </motion.div>
  );
}
