// Mirrors enums in backend/prisma/schema.prisma.
// Keep in sync manually — these are wire constants the backend validates against.

export const RiskProfile = {
  DEFAULT: "DEFAULT",
  CONSERVATIVE: "CONSERVATIVE",
  AGGRESSIVE: "AGGRESSIVE",
} as const;
export type RiskProfile = (typeof RiskProfile)[keyof typeof RiskProfile];

export const AssetClass = {
  FIAT: "FIAT",
  GOLD: "GOLD",
  INDEX_FUND: "INDEX_FUND",
  HIGH_RISK: "HIGH_RISK",
} as const;
export type AssetClass = (typeof AssetClass)[keyof typeof AssetClass];

export const Currency = {
  EGP: "EGP",
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

export const LedgerEntryType = {
  ROUNDUP: "ROUNDUP",
  USER_DEPOSIT: "USER_DEPOSIT",
  USER_WITHDRAWAL: "USER_WITHDRAWAL",
  INVESTMENT_ALLOCATION: "INVESTMENT_ALLOCATION",
  INVESTMENT_REDEMPTION: "INVESTMENT_REDEMPTION",
  FUND_FEE: "FUND_FEE",
  PROFIT_FEE: "PROFIT_FEE",
} as const;
export type LedgerEntryType =
  (typeof LedgerEntryType)[keyof typeof LedgerEntryType];

// Backend MerchantTag (see src/common/interfaces/bank-provider.interface.ts).
export type MerchantTag = string;
