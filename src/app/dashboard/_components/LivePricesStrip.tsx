"use client";

import type { AssetPriceDto } from "@/lib/api/sdk";
import { piastersStringToEgp } from "@/lib/money";
import { cn, formatEGP } from "@/lib/utils";

const ASSET_LABELS: Record<string, string> = {
  GOLD: "الذهب",
  INDEX_FUND: "صندوق المؤشر",
  HIGH_RISK: "عالي المخاطر",
  FIAT: "نقدي",
};

/**
 * Live mock-exchange prices from the dashboard's shared price feed.
 */
interface LivePricesStripProps {
  prices?: AssetPriceDto[];
  loading?: boolean;
  error?: string | null;
  layout?: "horizontal" | "vertical";
}

export function LivePricesStrip({
  prices = [],
  loading = false,
  error = null,
  layout = "horizontal",
}: LivePricesStripProps) {
  if (loading && !prices.length) {
    return (
      <p className="text-xs text-muted-foreground">جاري تحميل الأسعار…</p>
    );
  }
  if (error) {
    return <p className="text-xs text-red-600">{error}</p>;
  }
  if (!prices.length) return null;

  return (
    <div
      className={cn(
        layout === "vertical"
          ? "grid grid-cols-1 gap-2"
          : "flex flex-wrap gap-2",
      )}
    >
      {prices.map((p) => (
        <div
          key={p.assetClass}
          className={cn(
            "px-3 py-1 rounded-full bg-muted/50 text-xs flex items-center gap-2 border border-border",
            layout === "vertical" && "justify-between rounded-lg py-2",
          )}
        >
          <span className="text-muted-foreground">
            {ASSET_LABELS[p.assetClass] ?? p.assetClass}
          </span>
          <span className="font-semibold text-foreground">
            {formatEGP(piastersStringToEgp(p.pricePerUnit))}
          </span>
        </div>
      ))}
    </div>
  );
}
