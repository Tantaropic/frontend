/**
 * Shared TypeScript types for SukukSweep
 */

// ─── Domain Entities ──────────────────────────────────────────────────────────

export type RiskProfile = "conservative" | "balanced" | "growth";

export type TransactionStatus = "pending" | "invested";

/** What kind of activity this entry represents (drives FE labelling). */
export type TransactionKind =
  | "sweep"        // round-up from a purchase
  | "deposit"      // user added cash
  | "withdrawal"   // user withdrew cash
  | "buy"          // investment allocation
  | "sell"         // investment redemption
  | "fee"          // platform fee
  | "other";

export interface Transaction {
  id: string;
  merchantName: string;         // Arabic merchant name
  merchantNameEn: string;       // English fallback
  merchantCategory: string;     // e.g. "مطاعم", "مواصلات"
  merchantIcon: string;         // emoji or icon key
  amount: number;               // original purchase amount (EGP)
  roundedAmount: number;        // next round number
  investedAmount: number;       // roundedAmount - amount
  timestamp: Date | string;
  status: TransactionStatus;
  kind?: TransactionKind;
}

export interface Asset {
  id: string;
  name: string;                 // Arabic name
  nameEn: string;
  type: "gold" | "index_fund" | "high_risk" | "sukuk";
  allocation: number;           // percentage 0–100
  value: number;                // EGP value
  returnRate: number;           // annual return % (positive/negative)
  shariaCompliant: boolean;
  color: string;                // hex color for charts
}

export interface Goal {
  id: string;
  title: string;                // Arabic goal name
  emoji: string;
  targetAmount: number;         // EGP
  currentAmount: number;        // EGP
  targetDate: Date | string;
  monthlyRoundup: number;       // estimated EGP/month from round-ups
  color: string;                // accent color for progress bar
}

export interface AIInsight {
  id: string;
  type: "habit" | "milestone" | "nudge" | "zakat";
  icon: string;                 // emoji
  title: string;                // Arabic headline
  body: string;                 // Arabic message body
  highlight?: string;           // bolded number or key phrase
  timestamp: Date | string;
}

export interface ZakatBreakdown {
  assetId: string;
  assetName: string;
  totalValue: number;
  eligible: boolean;
  heldMonths: number;           // must be >= 12 lunar months
  zakatAmount: number;          // 0 if not eligible
}

export interface ZakatSummary {
  totalPortfolioValue: number;
  totalEligibleValue: number;
  zakatRate: number;            // 0.025
  totalZakatOwed: number;
  breakdown: ZakatBreakdown[];
  nisabThreshold: number;       // current nisab in EGP
  isAboveNisab: boolean;
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export interface RiskProfileOption {
  key: RiskProfile;
  labelAr: string;
  descAr: string;
  icon: string;
  returnRange: string;          // e.g. "4–7%"
  allocation: {
    sukuk: number;
    indexFund: number;
    highRisk: number;
  };
}

export interface RoundupSetting {
  enabled: boolean;
  multiplier: 1 | 5 | 10;      // round to nearest X EGP
}

export interface DailyInvestmentSummary {
  date: string;
  totalPurchases: number;
  totalInvested: number;
  transactionCount: number;
}
