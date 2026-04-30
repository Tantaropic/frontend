"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Zap } from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

interface BalanceCardProps {
  balance: number;
  returnRate: number;
  onSimulate: () => void;
  lastSimulated?: { merchant: string; invested: number } | null;
}

export function BalanceCard({ balance, returnRate, onSimulate, lastSimulated }: BalanceCardProps) {
  const balanceRef = useRef<HTMLSpanElement>(null);
  const prevBalance = useRef(0);

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
          balanceRef.current.textContent = Math.round(obj.value).toLocaleString("ar-EG");
        }
      },
    });
  }, [balance]);

  useEffect(() => {
    if (lastSimulated) {
      toast.success(lastSimulated.merchant, {
        description: `+${lastSimulated.invested} جنيه مُستثمرة ✓`,
        duration: 3000,
      });
    }
  }, [lastSimulated]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white"
      style={{
        background: "linear-gradient(135deg, oklch(0.38 0.15 152), oklch(0.50 0.14 152) 50%, oklch(0.44 0.13 165))",
        boxShadow: "0 20px 60px oklch(0.48 0.14 152 / 35%)",
      }}
    >
      {/* Background orbs */}
      <div className="absolute -top-16 -inset-e-8 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(1 0 0 / 12%), transparent 70%)" }} />
      <div className="absolute -bottom-10 -inset-s-4 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(1 0 0 / 8%), transparent 70%)" }} />

      <div className="relative z-10">
        {/* Balance */}
        <p className="text-white/65 text-sm font-medium mb-1">إجمالي المحفظة</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span ref={balanceRef} className="font-heading font-bold text-5xl md:text-6xl tabular-nums">0</span>
          <span className="text-2xl font-medium text-white/80">جنيه</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-300 mb-6">
          <TrendingUp size={14} />
          <span className="text-sm font-medium">+{returnRate.toFixed(1)}% العائد السنوي</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/20 mb-6">
          {[
            { label: "مُستثمر اليوم", value: "18 جنيه" },
            { label: "هذا الشهر",    value: "340 جنيه" },
            { label: "إجمالي العمليات", value: "47" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-white/55 text-xs mb-0.5">{s.label}</p>
              <p className="font-heading font-bold text-base">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Simulate button */}
        <motion.button
          onClick={onSimulate}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200"
        >
          <Zap size={16} className="text-yellow-300" />
          <span>محاكاة عملية شراء</span>
        </motion.button>


      </div>
    </motion.div>
  );
}
