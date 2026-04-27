"use client";

import { motion } from "framer-motion";
import { Shield, BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskProfile } from "@/types";

const profiles = [
  {
    key: "conservative" as RiskProfile,
    label: "محافظ",
    desc: "100% صكوك — عوائد ثابتة وآمنة",
    Icon: Shield,
    returnRange: "4–7%",
    selectedBorder: "border-blue-400",
    selectedBg: "bg-blue-50",
    selectedText: "text-blue-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "balanced" as RiskProfile,
    label: "متوازن",
    desc: "60% صكوك + 40% صناديق مؤشر",
    Icon: BarChart3,
    returnRange: "7–11%",
    recommended: true,
    selectedBorder: "border-sukuk-green",
    selectedBg: "bg-sukuk-green-muted",
    selectedText: "text-sukuk-green",
    iconBg: "bg-sukuk-green-muted",
    iconColor: "text-sukuk-green",
  },
  {
    key: "growth" as RiskProfile,
    label: "نمو",
    desc: "أسهم + صناديق مؤشر — عوائد أعلى",
    Icon: TrendingUp,
    returnRange: "11–18%",
    selectedBorder: "border-purple-400",
    selectedBg: "bg-purple-50",
    selectedText: "text-purple-600",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

interface StepRiskProps {
  selected: RiskProfile | null;
  onSelect: (r: RiskProfile) => void;
  onNext: () => void;
}

export function StepRisk({ selected, onSelect, onNext }: StepRiskProps) {
  return (
    <div className="flex flex-col justify-center min-h-full px-6 py-10 max-w-lg mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">اختار ملف المخاطرة</h2>
        <p className="text-muted-foreground text-sm">ممكن تغيره في أي وقت من الإعدادات</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        {profiles.map((p, i) => {
          const isSelected = selected === p.key;
          return (
            <motion.button
              key={p.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(p.key)}
              className={cn(
                "w-full p-5 rounded-2xl border-2 text-right flex items-center gap-4 transition-all duration-250",
                isSelected ? `${p.selectedBorder} ${p.selectedBg}` : "border-border bg-white/60 hover:border-muted-foreground/40"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", isSelected ? p.iconBg : "bg-muted")}>
                <p.Icon size={22} className={cn("transition-colors duration-200", isSelected ? p.iconColor : "text-muted-foreground")} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn("font-heading font-bold text-base", isSelected ? p.selectedText : "text-foreground")}>{p.label}</span>
                  {p.recommended && (
                    <span className="text-[10px] bg-sukuk-green text-white px-2 py-0.5 rounded-full font-medium">مُوصى به</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-snug">{p.desc}</p>
              </div>

              <div className="shrink-0 text-left">
                <p className={cn("font-heading font-bold text-sm", isSelected ? p.selectedText : "text-muted-foreground")}>{p.returnRange}</p>
                <p className="text-[10px] text-muted-foreground">عائد سنوي</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={onNext}
        disabled={!selected}
        whileHover={selected ? { scale: 1.02, y: -1 } : {}}
        whileTap={selected ? { scale: 0.98 } : {}}
        className={cn(
          "w-full py-3.5 rounded-2xl font-heading font-semibold text-base transition-all duration-200",
          selected ? "bg-sukuk-green text-white" : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
        style={selected ? { boxShadow: "0 6px 24px oklch(0.48 0.14 152 / 28%)" } : {}}
      >
        التالي ←
      </motion.button>
    </div>
  );
}
