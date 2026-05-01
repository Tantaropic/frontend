"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { formatEGP } from "@/lib/utils";
import { Calculator } from "lucide-react";

export function ProjectedGrowthWidget() {
  // State for daily investment (slider) - matches the 'round-up' mental model
  const [dailySavings, setDailySavings] = useState(50);

  // Assumptions
  const annualReturnRate = 0.113; // 11.3% historical return
  const currentBalance = 13000;

  // Standard compound interest formula: A = P(1+r/n)^(nt) + PMT * (((1+r/n)^(nt) - 1) / (r/n))
  // n = 12 (monthly compound), t = years
  const calculateFutureValue = (years: number) => {
    const r = annualReturnRate;
    const n = 12;
    const t = years;
    const P = currentBalance;
    const PMT = dailySavings * 30.42; // Convert daily to monthly (average days)

    const principalGrowth = P * Math.pow(1 + r / n, n * t);
    const contributionGrowth =
      PMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));

    return Math.round(principalGrowth + contributionGrowth);
  };

  const projections = [
    { years: 5, label: "5 سنوات", value: calculateFutureValue(5) },
    { years: 10, label: "10 سنوات", value: calculateFutureValue(10) },
    { years: 20, label: "20 سنة", value: calculateFutureValue(20) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-sukuk-green" />
        <div>
          <h3 className="font-heading font-bold text-base text-foreground">
            حاسبة النمو المستقبلية
          </h3>
          <p className="text-xs text-muted-foreground">
            اكتشف قوة الفائدة التراكمية مع الوقت.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <label className="text-sm font-semibold text-foreground">
            متوسط "الفكة" اليومي
          </label>
          <div className="text-right">
            <span className="text-lg font-bold text-sukuk-green bg-sukuk-green/10 px-3 py-1 rounded-lg tabular-nums">
              {formatEGP(dailySavings)}
            </span>
            <p className="text-[10px] text-muted-foreground mt-1">
              (~{formatEGP(dailySavings * 30.42)} شهرياً)
            </p>
          </div>
        </div>

        <Slider
          defaultValue={[50]}
          max={500}
          min={5}
          step={5}
          value={[dailySavings]}
          onValueChange={(vals: number | readonly number[]) => {
            const raw = Array.isArray(vals) ? vals[0] : vals;
            const num = Number(raw);
            setDailySavings(!isNaN(num) ? num : 50);
          }}
          className="w-full cursor-grab active:cursor-grabbing"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground px-1">
          <span>5 ج</span>
          <span>500 ج</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {projections.map((proj, i) => (
          <motion.div
            key={proj.years}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="bg-white/50 border border-border rounded-xl p-3 text-center flex flex-col justify-center items-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-sukuk-green/5 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300 -z-10" />
            <p className="text-xs text-muted-foreground mb-1">{proj.label}</p>
            <p className="font-heading font-bold text-sm sm:text-base text-foreground tabular-nums">
              {formatEGP(proj.value)}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground text-center mt-4 opacity-70">
        *هذه أرقام تقديرية مبنية على متوسط عائد تاريخي 11.3% للصكوك السيادية.
      </p>
    </motion.div>
  );
}
