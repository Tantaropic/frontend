import type { ZakatSummary } from "@/types";

/** Nisab threshold: approximately 85g gold × current gold price in EGP */
const NISAB_EGP = 15_000;

export const mockZakatData: ZakatSummary = {
  totalPortfolioValue: 13_000,
  totalEligibleValue: 13_000,
  zakatRate: 0.025,
  totalZakatOwed: 325,
  nisabThreshold: NISAB_EGP,
  isAboveNisab: false, // 13,000 < 15,000 — for demo we show it anyway
  breakdown: [
    {
      assetId: "asset_gold",
      assetName: "ذهب",
      totalValue: 3_120,
      eligible: true,
      heldMonths: 14,
      zakatAmount: 78,
    },
    {
      assetId: "asset_index",
      assetName: "صناديق مؤشر",
      totalValue: 9_750,
      eligible: true,
      heldMonths: 13,
      zakatAmount: 243.75,
    },
    {
      assetId: "asset_high_risk",
      assetName: "أسهم عالية المخاطر",
      totalValue: 130,
      eligible: false,
      heldMonths: 3,       // < 12 lunar months → not eligible yet
      zakatAmount: 0,
    },
  ],
};
