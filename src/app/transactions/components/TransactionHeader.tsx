"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface TransactionHeaderProps {
  todayTotalInvested: number;
}

export function TransactionHeader({ todayTotalInvested }: TransactionHeaderProps) {
  return (
    <GlassCard className="p-6 mb-6">
      <div className="flex flex-col items-start gap-2">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          المُستثمر اليوم
        </h2>
        <AnimatedCounter
          value={todayTotalInvested}
          decimals={0}
          suffix=" جنيه"
          className="text-4xl font-bold text-sukuk-green"
        />
        <p className="text-sm text-muted-foreground mt-1">
          إجمالي الفكة المُستثمرة من مشترياتك اليوم
        </p>
      </div>
    </GlassCard>
  );
}
