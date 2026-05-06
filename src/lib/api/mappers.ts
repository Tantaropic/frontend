import type { Asset, Transaction } from '@/types';
import { piastersStringToEgp } from '@/lib/money';

// Loose backend shapes (we don't import prisma types into the FE)
export interface CreateProfileResponseDto {
    profile: { id: string; name: string };
    wallet: { id: string };
    user: { id: string };
}

export interface AiInsightDto {
    id: string;
  type?: string;
  title?: string | null;
  body?: string | null;
  message?: string | null;
  triggerTag?: string | null;
    highlight?: string | null;
    createdAt: string;
}

export interface AssetPositionDto {
    id: string;
    assetClass: string;
    /** Fixed-point units, scaled by ASSET_UNIT_PRECISION (1e8). */
    totalUnits: string;
    /** Weighted-average buy price per unit, in piasters. */
    averageBuyPrice: string;
}

export interface DashboardDto {
    id: string;
    name: string;
    email: string;
    riskProfile: string;
    targetGoal?: string | null;
    roundUpStep?: string | null;
    /** Top-level on the user, NOT under profile. */
    ledgerEntries?: LedgerEntryDto[];
    profile: {
        id: string;
        wallet: {
            id: string;
            fiatBalance: string;
            version: number;
            positions?: AssetPositionDto[];
        };
    }
}

export interface LedgerEntryDto {
    id: string;
    type: string;
    amount: string;
    createdAt: string;
    /** JSON-encoded metadata (merchantTag, originalAmount, roundedAmount). */
    note?: string | null;
    metadata?: Record<string, unknown> | null;
    assetClass?: string | null;
    assetUnits?: string | null;
    executionPrice?: string | null;
}

// Mappers
export interface DashboardVm {
    userId: string;
    userName: string;
    riskProfile: string;
    /** EGP — null when user hasn't set a goal. */
    targetGoalEgp: number | null;
    /** Cash sitting in the wallet only. */
    balanceEgp: number;
    /** Cash + market value of all positions. */
    totalEgp: number;
    walletVersion: number;
    ledger: Transaction[];
    positions: Asset[];
    /** Raw position data (untouched piasters/fixed-point units) for live P&L math. */
    rawPositions: AssetPositionDto[];
}

const ASSET_META: Record<string, { name: string; nameEn: string; type: Asset['type']; color: string }> = {
  GOLD:       { name: 'الذهب',         nameEn: 'Gold',          type: 'gold',       color: '#D4A017' },
  INDEX_FUND: { name: 'صندوق المؤشر',  nameEn: 'Index Fund',    type: 'index_fund', color: '#3B82F6' },
  HIGH_RISK:  { name: 'عالي المخاطر',  nameEn: 'High Risk',     type: 'high_risk',  color: '#EF4444' },
  FIAT:       { name: 'نقدي',           nameEn: 'Cash',          type: 'sukuk',      color: '#10B981' },
};

// Asset units are stored in fixed-point with this precision (mirrors backend
// ASSET_UNIT_PRECISION = 1e8). Display = raw / ASSET_UNIT_PRECISION.
const ASSET_UNIT_PRECISION = 100_000_000;

export function mapPosition(
  dto: AssetPositionDto,
  positionsValueEgp: number,
): Asset {
  const realUnits = Number(dto.totalUnits) / ASSET_UNIT_PRECISION;
  const valueEgp = piastersStringToEgp(dto.averageBuyPrice) * realUnits;
  const meta = ASSET_META[dto.assetClass] ?? {
    name: dto.assetClass,
    nameEn: dto.assetClass,
    type: 'sukuk' as const,
    color: '#6B7280',
  };
  // Allocation as a percentage of total positions (so the bars sum to 100%
  // across the invested portfolio, regardless of cash sitting in the wallet).
  const allocationPct =
    positionsValueEgp > 0 && Number.isFinite(valueEgp)
      ? (valueEgp / positionsValueEgp) * 100
      : 0;
  return {
    id: dto.id,
    name: meta.name,
    nameEn: meta.nameEn,
    type: meta.type,
    allocation: Number(allocationPct.toFixed(1)),
    value: Number.isFinite(valueEgp) ? valueEgp : 0,
    returnRate: 0,
    shariaCompliant: true,
    color: meta.color,
  };
}

export function mapDashboard(dto: DashboardDto): DashboardVm {
  const wallet = dto.profile.wallet;
  const balanceEgp = piastersStringToEgp(wallet.fiatBalance);
  const positionsRaw = wallet.positions ?? [];

  const positionsValueEgp = positionsRaw.reduce(
    (sum, p) =>
      sum +
      piastersStringToEgp(p.averageBuyPrice) *
        (Number(p.totalUnits) / ASSET_UNIT_PRECISION),
    0,
  );
  const totalValueEgp = balanceEgp + positionsValueEgp;

  return {
    userId: dto.id,
    userName: dto.name,
    riskProfile: dto.riskProfile,
    targetGoalEgp:
      dto.targetGoal && dto.targetGoal !== '0'
        ? piastersStringToEgp(dto.targetGoal)
        : null,
    balanceEgp,
    totalEgp: totalValueEgp,
    walletVersion: wallet.version,
    ledger: (dto.ledgerEntries ?? []).map(mapLedgerEntry),
    positions: positionsRaw.map((p) => mapPosition(p, positionsValueEgp)),
    rawPositions: positionsRaw,
  };
}

const TYPE_LABELS: Record<string, string> = {
  ROUNDUP: 'فكّة عملية',
  USER_DEPOSIT: 'إيداع',
  USER_WITHDRAWAL: 'سحب',
  INVESTMENT_ALLOCATION: 'استثمار',
  INVESTMENT_REDEMPTION: 'تسييل',
  FUND_FEE: 'رسوم صندوق',
  PROFIT_FEE: 'رسوم أرباح',
};

const ASSET_LABELS_AR: Record<string, string> = {
  GOLD: 'ذهب',
  INDEX_FUND: 'صندوق مؤشر',
  HIGH_RISK: 'أسهم عالية المخاطر',
  FIAT: 'نقدي',
};

export function mapLedgerEntry(dto: LedgerEntryDto): Transaction {
  // Backend encodes JSON metadata in `note` (RoundUpEngine writes
  // `{ originalAmount, roundedAmount, merchantTag }`). Older rows or other
  // ledger types may store plain text — fall back gracefully.
  let parsedNote: {
    feeType?: string;
    merchantName?: string;
    merchantTag?: string;
    originalAmount?: string;
    roundedAmount?: string;
  } = {};
  if (dto.note) {
    try {
      parsedNote = JSON.parse(dto.note);
    } catch {
      // not JSON — ignore
    }
  }
  const meta = { ...parsedNote, ...((dto.metadata ?? {}) as typeof parsedNote) };

  const investedEgp = Math.abs(piastersStringToEgp(dto.amount));
  const originalEgp = meta.originalAmount
    ? piastersStringToEgp(meta.originalAmount)
    : investedEgp;
  const roundedEgp = meta.roundedAmount
    ? piastersStringToEgp(meta.roundedAmount)
    : originalEgp + investedEgp;

  const tag = meta.merchantTag?.toUpperCase() ?? '';
  const MERCHANT_ICONS: Record<string, string> = {
    STARBUCKS: '☕', MCDONALDS: '🍔', UBER: '🚗', CARREFOUR: '🛒',
    PIZZAHUT: '🍕', NOON: '📦', VODAFONE: '📱',
    coffee_shop: '☕', restaurant: '🍽️', grocery: '🛒', gas_station: '⛽',
    pharmacy: '💊', clothing: '👕', electronics: '💻', online_shopping: '📦',
    food_delivery: '🍕', ride_share: '🚗', fast_food: '🍔', entertainment: '🎬', gym: '🏋️',
  };

  // For investment-allocation rows, surface the asset name + a 📊 icon so
  // "أحدث الاستثمارات" reads naturally.
  let merchantName = meta.merchantName ?? meta.merchantTag ?? TYPE_LABELS[dto.type] ?? 'عملية';
  let merchantIcon = MERCHANT_ICONS[tag] ?? '💳';
  let kind: Transaction['kind'] = 'other';
  if (dto.type === 'INVESTMENT_ALLOCATION' && dto.assetClass) {
    merchantName = `شراء ${ASSET_LABELS_AR[dto.assetClass] ?? dto.assetClass}`;
    merchantIcon = '📊';
    kind = 'buy';
  } else if (dto.type === 'INVESTMENT_ALLOCATION') {
    merchantName = 'استثمار';
    merchantIcon = '📊';
    kind = 'buy';
  } else if (dto.type === 'USER_DEPOSIT') {
    merchantName = 'إيداع رصيد';
    merchantIcon = '➕';
    kind = 'deposit';
  } else if (dto.type === 'USER_WITHDRAWAL') {
    merchantName = 'سحب رصيد';
    merchantIcon = '↙';
    kind = 'withdrawal';
  } else if (dto.type === 'INVESTMENT_REDEMPTION') {
    merchantName = dto.assetClass
      ? `بيع ${ASSET_LABELS_AR[dto.assetClass] ?? dto.assetClass}`
      : 'بيع أصل';
    merchantIcon = '↗';
    kind = 'sell';
  } else if (dto.type === 'FUND_FEE' || dto.type === 'PROFIT_FEE') {
    merchantName =
      meta.feeType === 'DEPOSIT_FEE'
        ? 'رسوم الإيداع'
        : meta.feeType === 'SELL_REVENUE_FEE'
          ? 'رسوم البيع'
          : 'رسوم الخدمة';
    merchantIcon = '📝';
    kind = 'fee';
  } else if (dto.type === 'ROUNDUP') {
    kind = 'sweep';
  }

  return {
    id: dto.id,
    merchantName,
    merchantNameEn: meta.merchantTag ?? dto.type,
    merchantCategory: dto.type,
    merchantIcon,
    amount: originalEgp,
    roundedAmount: roundedEgp,
    investedAmount: investedEgp,
    timestamp: dto.createdAt,
    status: 'invested',
    kind,
  };
}