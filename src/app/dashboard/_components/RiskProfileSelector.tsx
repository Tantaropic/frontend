"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api/sdk";
import { RiskProfile } from "@/lib/api/enums";
import { ApiError } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface RiskProfileSelectorProps {
  userId: string;
  current: string;
  onUpdated?: () => void | Promise<void>;
}

const OPTIONS: Array<{ value: RiskProfile; labelAr: string; icon: string }> = [
  { value: RiskProfile.CONSERVATIVE, labelAr: "محافظ", icon: "🛡️" },
  { value: RiskProfile.DEFAULT, labelAr: "متوازن", icon: "⚖️" },
  { value: RiskProfile.AGGRESSIVE, labelAr: "نمو", icon: "🚀" },
];

export function RiskProfileSelector({
  userId,
  current,
  onUpdated,
}: RiskProfileSelectorProps) {
  const [pending, setPending] = useState<RiskProfile | null>(null);

  const update = async (next: RiskProfile) => {
    if (next === current || pending) return;
    setPending(next);
    try {
      await api.users.updateSettings(userId, { riskProfile: next });
      toast.success("تم تحديث ملف المخاطر");
      await onUpdated?.();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "تعذّر التحديث";
      toast.error(msg);
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">ملف المخاطر:</span>
      {OPTIONS.map((opt) => {
        const active = opt.value === current;
        const isPending = pending === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => update(opt.value)}
            disabled={isPending}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
              active
                ? "bg-sukuk-green text-white border-sukuk-green"
                : "bg-white/70 text-muted-foreground border-border hover:text-foreground",
              isPending && "opacity-60 cursor-wait",
            )}
          >
            <span className="mr-1">{opt.icon}</span>
            {opt.labelAr}
          </button>
        );
      })}
    </div>
  );
}
