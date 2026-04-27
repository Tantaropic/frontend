import type { Asset } from "@/types";

/** 24/75/1 allocation as specified in core-features.md */
export const mockAssets: Asset[] = [
  {
    id: "asset_gold",
    name: "ذهب",
    nameEn: "Gold",
    type: "gold",
    allocation: 24,
    value: 3_120,
    returnRate: 8.4,
    shariaCompliant: true,
    color: "#d4a017",
  },
  {
    id: "asset_index",
    name: "صناديق مؤشر",
    nameEn: "Index Funds",
    type: "index_fund",
    allocation: 75,
    value: 9_750,
    returnRate: 12.1,
    shariaCompliant: true,
    color: "#2d7a4f",
  },
  {
    id: "asset_high_risk",
    name: "أسهم عالية المخاطر",
    nameEn: "High-Risk Stocks",
    type: "high_risk",
    allocation: 1,
    value: 130,
    returnRate: 22.5,
    shariaCompliant: true,
    color: "#7c5cfc",
  },
];

export const totalPortfolioValue = mockAssets.reduce((sum, a) => sum + a.value, 0);
export const totalReturnRate = 11.3; // weighted average
