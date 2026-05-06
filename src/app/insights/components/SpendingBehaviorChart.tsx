"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Transaction } from "@/types";

interface SpendingBehaviorChartProps {
  ledger?: Transaction[];
}

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const CATEGORY_LABELS: Record<string, string> = {
  STARBUCKS: "كافيه",
  MCDONALDS: "مطاعم",
  PIZZAHUT: "مطاعم",
  UBER: "مواصلات",
  CARREFOUR: "سوبرماركت",
  NOON: "تسوق",
  VODAFONE: "اتصالات",
  PHARMACY: "صحة",
};

export function SpendingBehaviorChart({ ledger = [] }: SpendingBehaviorChartProps) {
  // Aggregate invested round-up by inferred category. The ledger only carries
  // round-ups, not original purchase amounts — so we display invested fكة
  // per category (which is what the user actually controls).
  const totals: Record<string, number> = {};
  for (const t of ledger) {
    if (t.investedAmount <= 0) continue;
    const tag = (t.merchantNameEn || "").toUpperCase();
    const label = CATEGORY_LABELS[tag] ?? "أخرى";
    totals[label] = (totals[label] ?? 0) + t.investedAmount;
  }

  const data = Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .map(([name, amount], idx) => ({
      name,
      amount,
      color: PALETTE[idx % PALETTE.length],
    }));

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h3 className="font-heading font-bold text-lg text-foreground">
          فكتك المستثمرة حسب الفئة
        </h3>
        <p className="text-sm text-muted-foreground">
          توزيع إجمالي الفكة المُستثمَرة من مشترياتك حسب نوع التاجر.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
          لسه ما فيش بيانات. حاكي عملية شراء أولاً.
        </div>
      ) : (
        <div className="h-[300px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickFormatter={(value) => `${value} ج`}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`${value || 0} جنيه`, "الفكة المستثمرة"]}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
