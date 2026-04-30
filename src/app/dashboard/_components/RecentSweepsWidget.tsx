"use client";

import { motion } from "framer-motion";
import { mockTransactions } from "@/data/transactions";
import { Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { formatEGP } from "@/lib/utils";

export function RecentSweepsWidget() {
  // Get latest 3 transactions that actually invested something
  const recentSweeps = mockTransactions
    .filter((t) => t.investedAmount > 0)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl p-5 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-sukuk-green" />
          أحدث الاستثمارات
        </h3>
        <Link href="/transactions" className="text-xs font-semibold text-sukuk-green hover:underline flex items-center">
          سجل العمليات
          <ChevronLeft className="w-3 h-3 ms-1" />
        </Link>
      </div>

      <div className="space-y-3 flex-1">
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
              <span className="text-xs font-bold text-sukuk-green bg-sukuk-green/10 px-2 py-1 rounded-md">
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
