"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface DailySummaryCardProps {
  date: string;
  totalPurchases: number;
  totalInvested: number;
  transactionCount: number;
}

export function DailySummaryCard({
  date,
  totalPurchases,
  totalInvested,
  transactionCount,
}: DailySummaryCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Simple date formatter
  const formattedDate = new Date(date).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <GlassCard className="mb-6 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/40 hover:bg-white/60 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-sukuk-cream text-sukuk-green">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-heading font-medium text-foreground">
              ملخص اليوم
            </span>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-sukuk-green tabular-nums">
              +{totalInvested} جنيه
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {transactionCount} عمليات
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 bg-white/20 border-t border-sukuk-warm-gray/50 flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">إجمالي المشتريات</span>
            <span className="font-bold tabular-nums">{totalPurchases} جنيه</span>
          </div>
          <div className="w-px bg-sukuk-warm-gray/50" />
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">إجمالي الفكة</span>
            <span className="font-bold text-sukuk-green tabular-nums">
              +{totalInvested} جنيه
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
