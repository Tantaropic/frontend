import { useMemo } from "react";
import type { Asset, ZakatBreakdown, ZakatSummary } from "@/types";
import type { DashboardVm } from "@/lib/api/mappers";

const NISAB_THRESHOLD_EGP = 15_000;
const ZAKAT_RATE = 0.025;

const ASSET_LABELS: Record<Asset["type"], string> = {
  gold: "ذهب",
  index_fund: "صناديق مؤشر",
  high_risk: "أسهم عالية المخاطر",
  sukuk: "صكوك",
};

/**
 * Derive a Zakat summary from the user's real wallet data.
 * - Cash balance is treated as a single "Cash" entry.
 * - Each position is one breakdown row with its current value.
 * - Eligibility is computed from `heldMonths` (>= 12 lunar months ≈ 12 months).
 *   Until backend exposes a position's age, we mark all positions held >= 1 month
 *   as eligible only when the wallet is above نصاب.
 */
export function useZakat(dashboard: DashboardVm | null): ZakatSummary {
  return useMemo(() => {
    const balance = dashboard?.balanceEgp ?? 0;
    const positions = dashboard?.positions ?? [];

    const positionsValue = positions.reduce((sum, p) => sum + p.value, 0);
    const totalPortfolioValue = balance + positionsValue;

    const isAboveNisab = totalPortfolioValue >= NISAB_THRESHOLD_EGP;

    // Cash row
    const cashRow: ZakatBreakdown = {
      assetId: "cash",
      assetName: "الرصيد النقدي",
      totalValue: balance,
      eligible: isAboveNisab && balance > 0,
      heldMonths: 12, // cash has no holding period
      zakatAmount:
        isAboveNisab && balance > 0 ? Math.round(balance * ZAKAT_RATE) : 0,
    };

    // Position rows
    const positionRows: ZakatBreakdown[] = positions.map((p) => {
      // Backend doesn't yet expose position age; treat positions as eligible
      // for the Zakat estimate when above nisab. Highlighted in the UI as
      // "تقدير" rather than the final fatwa.
      const eligible = isAboveNisab && p.value > 0;
      return {
        assetId: p.id,
        assetName: ASSET_LABELS[p.type] ?? p.name,
        totalValue: p.value,
        eligible,
        heldMonths: 0,
        zakatAmount: eligible ? Math.round(p.value * ZAKAT_RATE) : 0,
      };
    });

    const breakdown = [cashRow, ...positionRows];
    const totalEligibleValue = breakdown
      .filter((b) => b.eligible)
      .reduce((sum, b) => sum + b.totalValue, 0);
    const totalZakatOwed = breakdown.reduce((sum, b) => sum + b.zakatAmount, 0);

    return {
      totalPortfolioValue,
      totalEligibleValue,
      zakatRate: ZAKAT_RATE,
      totalZakatOwed,
      breakdown,
      nisabThreshold: NISAB_THRESHOLD_EGP,
      isAboveNisab,
    };
  }, [dashboard]);
}
