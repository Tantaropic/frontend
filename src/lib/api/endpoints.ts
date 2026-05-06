// One source of truth for backend route paths (mounted under /api/v1).
export const endpoints = {
  profiles: {
    create: () => "/profiles",
    createRandom: () => "/profiles/create-random",
    list: () => "/profiles",
    one: (id: string) => `/profiles/${id}`,
    wallet: (id: string) => `/profiles/${id}/wallet`,
  },
  users: {
    list: () => "/users",
    one: (id: string) => `/users/${id}`,
    createForProfile: (profileId: string) => `/users/profile/${profileId}`,
    dashboard: (id: string, ledgerLimit?: number) =>
      ledgerLimit
        ? `/users/${id}/dashboard?ledgerLimit=${ledgerLimit}`
        : `/users/${id}/dashboard`,
    settings: (id: string) => `/users/${id}/settings`,
    simulateDeposit: (id: string) => `/users/${id}/simulate-deposit`,
    simulateWithdraw: (id: string) => `/users/${id}/simulate-withdraw`,
    simulateSell: (id: string) => `/users/${id}/simulate-sell`,
  },
  insights: {
    forUser: (userId: string) => `/ai-insights/${userId}`,
  },
  mockBank: {
    simulateTransaction: () => "/mock-bank/simulate-transaction",
    debit: () => "/mock-bank/debits",
    deposit: () => "/mock-bank/deposits",
  },
  mockExchange: {
    prices: (assetClass?: string) =>
      assetClass
        ? `/mock-exchange/prices?assetClass=${encodeURIComponent(assetClass)}`
        : "/mock-exchange/prices",
    buy: () => "/mock-exchange/buy",
    sell: () => "/mock-exchange/sell",
    setPrices: () => "/mock-exchange/set-prices",
  },
} as const;
