"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const banks = [
  { name: "بنك مصر",       short: "بم", color: "bg-green-600" },
  { name: "CIB",           short: "C",  color: "bg-blue-700" },
  { name: "البنك الأهلي", short: "أه", color: "bg-red-600" },
  { name: "QNB",           short: "Q",  color: "bg-purple-700" },
];

type Status = "idle" | "connecting" | "connected";

export function StepBank({ onNext }: { onNext: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  function handleConnect() {
    if (!selectedBank || status === "connecting") return;
    setStatus("connecting");
    setTimeout(() => setStatus("connected"), 2000);
  }

  return (
    <div className="flex flex-col justify-center min-h-full px-6 py-10 max-w-md mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">ربط حسابك البنكي</h2>
        <p className="text-muted-foreground text-sm">اختار بنكك عشان نتابع مشترياتك تلقائياً</p>
      </motion.div>

      {/* Bank grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {banks.map((bank, i) => (
          <motion.button
            key={bank.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => { if (status === "idle") setSelectedBank(bank.name); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "p-4 rounded-2xl flex items-center gap-3 border transition-all duration-200 text-right",
              selectedBank === bank.name
                ? "border-sukuk-green bg-sukuk-green-muted"
                : "border-border bg-white/60 hover:border-sukuk-green/40"
            )}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0", bank.color)}>
              {bank.short}
            </div>
            <span className="text-sm font-medium text-foreground">{bank.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Status card */}
      <GlassCard className="p-5 mb-4">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center shrink-0">
                <span className="text-lg">🏦</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{selectedBank ? `تم اختيار ${selectedBank}` : "اختار بنكك أولاً"}</p>
                <p className="text-xs text-muted-foreground">اضغط &quot;اربط حسابك&quot; للبدء</p>
              </div>
            </motion.div>
          )}

          {status === "connecting" && (
            <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 pulse-ring">
                <Loader2 size={18} className="text-amber-600 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">جاري الربط...</p>
                <p className="text-xs text-muted-foreground">ثانية واحدة بس</p>
              </div>
            </motion.div>
          )}

          {status === "connected" && (
            <motion.div key="connected" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                className="w-10 h-10 rounded-full bg-sukuk-green-muted flex items-center justify-center shrink-0">
                <Check size={18} className="text-sukuk-green" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-sukuk-green">تم الربط بنجاح! ✓</p>
                <p className="text-xs text-muted-foreground">{selectedBank} — ****4521</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      <p className="text-xs text-muted-foreground text-center mb-8">
        🔒 بياناتك محمية بتشفير 256-bit · قراءة فقط فقط
      </p>

      <motion.button
        onClick={status === "connected" ? onNext : handleConnect}
        disabled={status === "connecting" || (!selectedBank && status === "idle")}
        whileHover={status !== "connecting" ? { scale: 1.02, y: -1 } : {}}
        whileTap={status !== "connecting" ? { scale: 0.98 } : {}}
        className={cn(
          "w-full py-3.5 rounded-2xl font-heading font-semibold text-base transition-all duration-200",
          status === "connecting" || (!selectedBank && status === "idle")
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-sukuk-green text-white"
        )}
        style={status !== "connecting" && selectedBank ? { boxShadow: "0 6px 24px oklch(0.48 0.14 152 / 28%)" } : {}}
      >
        {status === "connected" ? "التالي ←" : status === "connecting" ? "جاري الربط..." : "اربط حسابك"}
      </motion.button>
    </div>
  );
}
