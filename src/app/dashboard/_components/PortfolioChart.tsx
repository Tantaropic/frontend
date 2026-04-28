"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { mockAssets } from "@/data/assets";
import { SukukBadge } from "@/components/ui/SukukBadge";
import { formatEGP, formatPercent } from "@/lib/utils";

const chartData = mockAssets.map((a) => ({
  name: a.name,
  value: a.value,
  allocation: a.allocation,
  color: a.color,
  returnRate: a.returnRate,
  nameEn: a.nameEn,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-strong rounded-xl p-3 text-sm shadow-lg min-w-[130px]">
      <p className="font-heading font-semibold text-foreground mb-1">{d.name}</p>
      <p className="text-muted-foreground text-xs">{d.allocation}% من المحفظة</p>
      <p className="text-sukuk-green font-bold text-sm mt-1">{formatEGP(d.value)}</p>
      <p className="text-xs text-muted-foreground">{formatPercent(d.returnRate)} سنوياً</p>
    </div>
  );
}

export function PortfolioChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl p-5 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-foreground">توزيع المحفظة</h3>
        <SukukBadge variant="sharia">شريعة ✓</SukukBadge>
      </div>

      {/* Pie chart */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Asset list */}
      <div className="space-y-3 mt-4">
        {mockAssets.map((asset, i) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: asset.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground truncate">{asset.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: asset.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: asset.allocation / 100 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{asset.allocation}%</span>
              </div>
            </div>
            <div className="text-left shrink-0">
              <p className="text-sm font-heading font-semibold text-foreground">{formatEGP(asset.value, true)}</p>
              <p className="text-xs text-sukuk-green">{formatPercent(asset.returnRate)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
