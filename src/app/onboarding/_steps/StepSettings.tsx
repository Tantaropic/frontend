"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, calcRoundup } from "@/lib/utils";
import { gsap } from "gsap";

type Multiplier = 1 | 5 | 10;

interface StepSettingsProps {
  enabled: boolean;
  multiplier: Multiplier;
  onToggle: (v: boolean) => void;
  onMultiplier: (v: Multiplier) => void;
  onFinish: () => void;
}

const SAMPLE = 87;

export function StepSettings({ enabled, multiplier, onToggle, onMultiplier, onFinish }: StepSettingsProps) {
  const investedRef = useRef<HTMLSpanElement>(null);
  const prevMultiplier = useRef(multiplier);

  useEffect(() => {
    if (!investedRef.current) return;
    const from = calcRoundup(SAMPLE, prevMultiplier.current);
    const to = calcRoundup(SAMPLE, multiplier);
    prevMultiplier.current = multiplier;
    const obj = { value: from };
    gsap.to(obj, {
      value: to, duration: 0.5, ease: "power2.out",
      onUpdate() { if (investedRef.current) investedRef.current.textContent = obj.value.toFixed(0); },
    });
  }, [multiplier]);

  const invested = calcRoundup(SAMPLE, multiplier);

  return (
    <div className="flex flex-col justify-center min-h-full px-6 py-10 max-w-md mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">إعدادات التقريب</h2>
        <p className="text-muted-foreground text-sm">حدد كيف تتجمع فكتك من كل عملية شراء</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        {/* Toggle */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground text-sm">تفعيل التقريب التلقائي</p>
              <p className="text-xs text-muted-foreground mt-0.5">استثمر الفكة من كل عملية شراء</p>
            </div>
            <Switch id="roundup-toggle" checked={enabled} onCheckedChange={onToggle} />
          </GlassCard>
        </motion.div>

        {/* Multiplier */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className={cn("p-5 transition-opacity duration-300", !enabled && "opacity-40 pointer-events-none")}>
            <Label className="text-sm font-medium text-foreground mb-3 block">التقريب إلى</Label>
            <Select value={String(multiplier)} onValueChange={(v) => onMultiplier(Number(v) as Multiplier)} disabled={!enabled}>
              <SelectTrigger className="w-full h-12 rounded-xl bg-white/70 border-border text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">أقرب 1 جنيه</SelectItem>
                <SelectItem value="5">أقرب 5 جنيه</SelectItem>
                <SelectItem value="10">أقرب 10 جنيه</SelectItem>
              </SelectContent>
            </Select>
          </GlassCard>
        </motion.div>

        {/* Live preview */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className={cn("p-5 transition-opacity duration-300", !enabled && "opacity-40")}>
            <p className="text-xs text-muted-foreground mb-3">مثال حي</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">شراء بـ</span>
                <span className="font-heading font-bold text-base text-foreground">87 جنيه</span>
              </div>
              <span className="text-muted-foreground">←</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">يُستثمر</span>
                <span className="font-heading font-bold text-lg text-sukuk-green">
                  <span ref={investedRef}>{invested}</span>
                  <span> جنيه</span>
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.button
        onClick={onFinish}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl font-heading font-semibold text-lg bg-sukuk-green text-white transition-shadow duration-300"
        style={{ boxShadow: "0 8px 30px oklch(0.48 0.14 152 / 35%)" }}
      >
        ابدأ الاستثمار الآن ←
      </motion.button>
    </div>
  );
}
