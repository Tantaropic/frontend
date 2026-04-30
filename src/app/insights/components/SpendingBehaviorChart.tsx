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

const data = [
  { name: "مطاعم", amount: 2450, color: "var(--chart-1)" },
  { name: "سوبرماركت", amount: 1800, color: "var(--chart-2)" },
  { name: "مواصلات", amount: 850, color: "var(--chart-3)" },
  { name: "تسوق", amount: 1200, color: "var(--chart-4)" },
  { name: "صحة", amount: 400, color: "var(--chart-5)" },
];

export function SpendingBehaviorChart() {
  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h3 className="font-heading font-bold text-lg text-foreground">
          تحليل الإنفاق الشهري
        </h3>
        <p className="text-sm text-muted-foreground">
          نظرة على عاداتك الشرائية لتحديد فرص توفير وفكة أكثر.
        </p>
      </div>

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
              formatter={(value: any) => [`${value || 0} جنيه`, "الإنفاق"]}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
