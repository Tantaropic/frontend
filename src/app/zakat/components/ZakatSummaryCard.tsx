"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ZakatSummary } from "@/types";

interface ZakatSummaryCardProps {
  summary: ZakatSummary;
}

export function ZakatSummaryCard({ summary }: ZakatSummaryCardProps) {
  return (
    <GlassCard className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-muted-foreground mb-2">
        إجمالي الزكاة المستحقة عليك
      </p>

      <AnimatedCounter
        value={summary.totalZakatOwed}
        className="text-5xl font-bold text-sukuk-green mb-4"
        suffix=" جنيه"
        duration={2}
      />

      <div className="flex items-center gap-2 bg-sukuk-cream px-4 py-2 rounded-full text-sm font-medium border border-sukuk-warm-gray">
        <span>نسبة الزكاة المطبقة:</span>
        <span className="text-foreground font-bold tabular-nums">
          {(summary.zakatRate * 100).toFixed(1)}%
        </span>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        الحد الأدنى للنصاب:{" "}
        <span className="tabular-nums font-semibold">
          {summary.nisabThreshold.toLocaleString()}
        </span>{" "}
        جنيه
      </p>
    </GlassCard>
  );
}
