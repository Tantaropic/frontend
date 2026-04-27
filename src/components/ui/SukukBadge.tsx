"use client";

import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/types";

type BadgeVariant = "invested" | "pending" | "sharia" | "gold" | "info";

interface SukukBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  invested:
    "bg-sukuk-green-muted text-sukuk-green border border-sukuk-green/20 font-medium",
  pending:
    "bg-amber-50 text-amber-700 border border-amber-200 font-medium",
  sharia:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium",
  gold:
    "bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium",
  info:
    "bg-blue-50 text-blue-700 border border-blue-200 font-medium",
};

/**
 * Pill-shaped badge used throughout the app.
 * Variants: invested (green) / pending (amber) / sharia / gold / info
 */
export function SukukBadge({ variant = "info", children, className }: SukukBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Convenience badge that maps TransactionStatus to the correct variant */
export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <SukukBadge variant={status === "invested" ? "invested" : "pending"}>
      {status === "invested" ? "✓ مُستثمر" : "⏳ معلق"}
    </SukukBadge>
  );
}
