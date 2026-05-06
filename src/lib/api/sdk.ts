// Typed wrappers for every backend route the FE may call.
// Internal endpoints (bank webhook) are intentionally excluded.

import { apiFetch } from "./client";
import { endpoints } from "./endpoints";
import type {
  AssetClass,
  Currency,
  MerchantTag,
  RiskProfile,
} from "./enums";
import type {
  AiInsightDto,
  CreateProfileResponseDto,
  DashboardDto,
} from "./mappers";

// ── Profiles ────────────────────────────────────────────────────────────────

export interface CreateProfileRequest {
  profileName: string;
  email: string;
  userName: string;
}

export const profilesApi = {
  create: (body: CreateProfileRequest) =>
    apiFetch<CreateProfileResponseDto>(endpoints.profiles.create(), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  createRandom: (overrides: Partial<CreateProfileRequest> = {}) =>
    apiFetch<CreateProfileResponseDto>(endpoints.profiles.createRandom(), {
      method: "POST",
      body: JSON.stringify(overrides),
    }),

  list: () => apiFetch<unknown[]>(endpoints.profiles.list()),

  one: (id: string) => apiFetch<unknown>(endpoints.profiles.one(id)),

  wallet: (id: string) => apiFetch<unknown>(endpoints.profiles.wallet(id)),
};

// ── Users ───────────────────────────────────────────────────────────────────

export interface CreateUserForProfileRequest {
  email: string;
  name: string;
  riskProfile?: RiskProfile;
}

export interface UpdateUserSettingsRequest {
  riskProfile?: RiskProfile;
  /** EGP piasters as a numeric string (BigInt-safe). */
  targetGoal?: string;
  /** EGP piasters as a numeric string (BigInt-safe). */
  roundUpStep?: string;
}

export interface SimulateDepositRequest {
  /** EGP piasters as a number — backend wraps to BigInt. */
  amount: number;
}

export interface SimulateWithdrawRequest {
  amount: number;
}

export interface SimulateSellRequest {
  assetClass: AssetClass;
  units?: number | string;
  amount?: number | string;
}

export interface SimulateSellResponse {
  wallet: unknown;
  trade: TradeResponse;
  grossProceeds: string;
  fee: string;
  proceeds: string;
}

export const usersApi = {
  list: () => apiFetch<unknown[]>(endpoints.users.list()),

  one: (id: string) => apiFetch<unknown>(endpoints.users.one(id)),

  createForProfile: (
    profileId: string,
    body: Partial<CreateUserForProfileRequest>,
  ) =>
    apiFetch<unknown>(endpoints.users.createForProfile(profileId), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  dashboard: (id: string, ledgerLimit?: number) =>
    apiFetch<DashboardDto>(endpoints.users.dashboard(id, ledgerLimit)),

  updateSettings: (id: string, body: UpdateUserSettingsRequest) =>
    apiFetch<unknown>(endpoints.users.settings(id), {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  simulateDeposit: (id: string, body: SimulateDepositRequest) =>
    apiFetch<unknown>(endpoints.users.simulateDeposit(id), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  simulateWithdraw: (id: string, body: SimulateWithdrawRequest) =>
    apiFetch<unknown>(endpoints.users.simulateWithdraw(id), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  simulateSell: (id: string, body: SimulateSellRequest) =>
    apiFetch<SimulateSellResponse>(endpoints.users.simulateSell(id), {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ── AI Insights ─────────────────────────────────────────────────────────────

export const insightsApi = {
  forUser: (userId: string) =>
    apiFetch<AiInsightDto[]>(endpoints.insights.forUser(userId)),
};

// ── Mock Bank ───────────────────────────────────────────────────────────────

export interface SimulateTransactionRequest {
  userId?: string;
  /** Piasters; backend converts to BigInt. */
  amount?: number | string;
  currency?: Currency;
  merchantTag?: MerchantTag;
  idempotencyKey?: string;
}

export interface FundTransferRequest {
  userId: string;
  amount: number | string;
  currency: Currency;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
  accountId?: string;
}

export const mockBankApi = {
  simulateTransaction: (body: SimulateTransactionRequest = {}) =>
    apiFetch<unknown>(endpoints.mockBank.simulateTransaction(), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  debit: (body: FundTransferRequest) =>
    apiFetch<unknown>(endpoints.mockBank.debit(), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deposit: (body: FundTransferRequest) =>
    apiFetch<unknown>(endpoints.mockBank.deposit(), {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ── Mock Exchange ───────────────────────────────────────────────────────────

export interface AssetPriceDto {
  assetClass: AssetClass;
  /** Piasters as a string. */
  pricePerUnit: string;
  currency: Currency;
  updatedAt: string;
}

export interface PriceQuoteResponse {
  prices: AssetPriceDto[];
}

export interface BuyAssetRequest {
  assetClass: AssetClass;
  amount: number | string;
  currency: Currency;
  idempotencyKey: string;
}

export interface SellAssetRequest {
  assetClass: AssetClass;
  units: number | string;
  idempotencyKey: string;
}

export interface TradeResponse {
  success: boolean;
  tradeId: string;
  assetClass: AssetClass;
  /** Piasters as string. */
  units: string;
  executionPrice: string;
  totalAmount: string;
}

export interface SetPricesRequest {
  assetClass: AssetClass;
  pricePerUnit: number | string;
}

export const mockExchangeApi = {
  prices: (assetClass?: AssetClass) =>
    apiFetch<PriceQuoteResponse>(endpoints.mockExchange.prices(assetClass)),

  buy: (body: BuyAssetRequest) =>
    apiFetch<TradeResponse>(endpoints.mockExchange.buy(), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  sell: (body: SellAssetRequest) =>
    apiFetch<TradeResponse>(endpoints.mockExchange.sell(), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  setPrices: (body: SetPricesRequest) =>
    apiFetch<{ success: boolean }>(endpoints.mockExchange.setPrices(), {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ── Aggregate ───────────────────────────────────────────────────────────────

export const api = {
  profiles: profilesApi,
  users: usersApi,
  insights: insightsApi,
  mockBank: mockBankApi,
  mockExchange: mockExchangeApi,
};
