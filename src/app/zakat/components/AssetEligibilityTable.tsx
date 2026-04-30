"use client";

import { ZakatBreakdown } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetEligibilityTableProps {
  breakdown: ZakatBreakdown[];
}

export function AssetEligibilityTable({ breakdown }: AssetEligibilityTableProps) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start">
          <thead className="bg-white/40 border-b border-sukuk-warm-gray text-muted-foreground font-heading">
            <tr>
              <th className="px-4 py-3 font-medium">الأصل</th>
              <th className="px-4 py-3 font-medium">القيمة</th>
              <th className="px-4 py-3 font-medium">مدة الحول (أشهر)</th>
              <th className="px-4 py-3 font-medium text-center">مستحق</th>
              <th className="px-4 py-3 font-medium text-end">مقدار الزكاة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sukuk-warm-gray/50">
            {breakdown.map((item) => (
              <tr key={item.assetId} className="hover:bg-white/20 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">
                  {item.assetName}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {item.totalValue.toLocaleString()} ج.م
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {item.heldMonths}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    {item.eligible ? (
                      <CheckCircle2 className="h-5 w-5 text-sukuk-green" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground/50" />
                    )}
                  </div>
                </td>
                <td className={cn(
                  "px-4 py-3 text-end tabular-nums font-medium",
                  item.zakatAmount > 0 ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.zakatAmount > 0 ? `${item.zakatAmount.toLocaleString()} ج.م` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
