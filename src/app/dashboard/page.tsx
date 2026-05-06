"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Download, FastForward, PauseCircle, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { BalanceCard } from "./_components/BalanceCard";
import { PortfolioChart } from "./_components/PortfolioChart";
import { InsightCards } from "./_components/InsightCards";
import { toast } from "sonner";
import { GoalProgressWidget } from "./_components/GoalProgressWidget";
import { RecentSweepsWidget } from "./_components/RecentSweepsWidget";
import { ProjectedGrowthWidget } from "./_components/ProjectedGrowthWidget";
import { useSimulation } from "@/components/simulation/SimulationContext";
import { useIdentity } from "@/components/providers/IdentityProvider";
import { useDashboard } from "./_hooks/useDashboard";
import { useInsights } from "./_hooks/useInsights";
import { AmountModal } from "@/components/ui/AmountModal";
import {
  SellAssetModal,
  type SellAssetOption,
} from "./_components/SellAssetModal";
import { useSse } from "@/lib/api/useSse";
import { useApi } from "@/lib/api/useApi";
import { api } from "@/lib/api/sdk";
import { ApiError } from "@/lib/api/types";
import { AssetClass } from "@/lib/api/enums";
import { egpToPiastersString, piastersStringToEgp } from "@/lib/money";
import type { Asset } from "@/types";

const DEMO_PRICE_BASELINES = [
  { assetClass: AssetClass.GOLD, pricePerUnit: 260_00 },
  { assetClass: AssetClass.INDEX_FUND, pricePerUnit: 72_00 },
  { assetClass: AssetClass.HIGH_RISK, pricePerUnit: 38_00 },
] as const;

const ASSET_UNIT_PRECISION = 100_000_000;

export default function DashboardPage() {
  const { identity, bootstrapping, bootstrapError } = useIdentity();
  const { data, loading, error, refetch } = useDashboard(identity?.userId);
  const insights = useInsights(identity?.userId);

  const [timeTraveling, setTimeTraveling] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selling, setSelling] = useState(false);
  const [sellAssetId, setSellAssetId] = useState<string | null>(null);
  const lastPriceRefreshRef = useRef(0);
  const applyingDemoPricesRef = useRef(false);
  const { triggerSimulation } = useSimulation();

  const userName = data?.userName ?? "—";

  // Live prices for P&L calculation — poll every 10s as a fallback in case SSE drops.
  const livePrices = useApi(() => api.mockExchange.prices(), [], true, 10_000);
  const refetchPrices = livePrices.refetch;

  useEffect(() => {
    if (!identity?.userId || applyingDemoPricesRef.current) return;
    const prices = livePrices.data?.prices;
    if (!prices?.length) return;

    const pricesAlreadyLowered = DEMO_PRICE_BASELINES.every((baseline) => {
      const quote = prices.find((p) => p.assetClass === baseline.assetClass);
      if (!quote) return false;
      return Number(quote.pricePerUnit) <= baseline.pricePerUnit * 1.1;
    });
    if (pricesAlreadyLowered) return;

    applyingDemoPricesRef.current = true;
    void Promise.all(
      DEMO_PRICE_BASELINES.map((price) => api.mockExchange.setPrices(price)),
    )
      .then(() => refetchPrices())
      .finally(() => {
        applyingDemoPricesRef.current = false;
      });
  }, [identity?.userId, livePrices.data?.prices, refetchPrices]);

  // Enrich positions with current market value + per-asset return rate from live prices.
  const enrichedPositions = useMemo(() => {
    const raw = data?.rawPositions ?? [];
    const base = data?.positions ?? [];
    const prices = livePrices.data?.prices ?? [];
    if (raw.length === 0) return base;
    const priceMap = new Map<string, string>(
      prices.map((p) => [p.assetClass, p.pricePerUnit]),
    );
    // Recompute market values per asset using live prices (the chart slices
    // should reflect current value, not cost basis).
    const updated = base.map((asset, i) => {
      const rawPos = raw[i];
      if (!rawPos) return asset;
      const realUnits = Number(rawPos.totalUnits) / 100_000_000;
      const livePrice = priceMap.get(rawPos.assetClass);
      if (!livePrice) return asset;
      const marketValue = piastersStringToEgp(livePrice) * realUnits;
      const costBasis = piastersStringToEgp(rawPos.averageBuyPrice) * realUnits;
      const returnRate =
        costBasis > 0 ? ((marketValue - costBasis) / costBasis) * 100 : 0;
      return { ...asset, value: marketValue, returnRate };
    });
    // Recompute allocation against the new total
    const total = updated.reduce((sum, a) => sum + a.value, 0);
    return updated.map((a) => ({
      ...a,
      allocation:
        total > 0 ? Number(((a.value / total) * 100).toFixed(1)) : 0,
    }));
  }, [data?.rawPositions, data?.positions, livePrices.data]);

  const livePortfolioValue = useMemo(
    () => enrichedPositions.reduce((sum, asset) => sum + asset.value, 0),
    [enrichedPositions],
  );

  const sellOptions = useMemo<SellAssetOption[]>(() => {
    const raw = data?.rawPositions ?? [];
    const prices = livePrices.data?.prices ?? [];
    const priceMap = new Map<string, string>(
      prices.map((price) => [price.assetClass, price.pricePerUnit]),
    );

    const options: SellAssetOption[] = [];

    for (const rawPosition of raw) {
      const assetClass = rawPosition.assetClass as AssetClass;
      if (assetClass === AssetClass.FIAT) continue;

      const units = Number(rawPosition.totalUnits) / ASSET_UNIT_PRECISION;
      if (!Number.isFinite(units) || units <= 0) continue;

      const asset = enrichedPositions.find(
        (candidate) => candidate.id === rawPosition.id,
      );
      const pricePerUnit =
        priceMap.get(rawPosition.assetClass) ?? rawPosition.averageBuyPrice;
      const pricePerUnitEgp = piastersStringToEgp(pricePerUnit);
      if (!Number.isFinite(pricePerUnitEgp) || pricePerUnitEgp <= 0) {
        continue;
      }
      const maxProceedsPiasters =
        (BigInt(rawPosition.totalUnits) * BigInt(pricePerUnit)) /
        BigInt(ASSET_UNIT_PRECISION);

      options.push({
        assetId: rawPosition.id,
        assetClass,
        name: asset?.name ?? rawPosition.assetClass,
        color: asset?.color ?? "#10B981",
        units,
        totalUnits: rawPosition.totalUnits,
        maxAmountEgp: piastersStringToEgp(maxProceedsPiasters.toString()),
        pricePerUnitEgp,
      });
    }

    return options;
  }, [data?.rawPositions, enrichedPositions, livePrices.data?.prices]);

  const selectedSellOption =
    sellOptions.find((option) => option.assetId === sellAssetId) ?? null;

  const balance = data ? (data.balanceEgp ?? 0) + livePortfolioValue : 0;

  // Compute real-time return rate: (currentValue - costBasis) / costBasis * 100
  // Falls back to 0 when there are no positions yet.
  const returnRate = useMemo(() => {
    const raw = data?.rawPositions ?? [];
    const prices = livePrices.data?.prices ?? [];
    if (raw.length === 0 || prices.length === 0) return 0;

    const priceMap = new Map<string, string>(
      prices.map((p) => [p.assetClass, p.pricePerUnit]),
    );
    let costBasis = 0;
    let currentValue = 0;
    for (const pos of raw) {
      const realUnits = Number(pos.totalUnits) / 100_000_000;
      const cost = piastersStringToEgp(pos.averageBuyPrice) * realUnits;
      const livePrice = priceMap.get(pos.assetClass);
      if (!livePrice) continue;
      const market = piastersStringToEgp(livePrice) * realUnits;
      costBasis += cost;
      currentValue += market;
    }
    if (costBasis <= 0) return 0;
    return ((currentValue - costBasis) / costBasis) * 100;
  }, [data?.rawPositions, livePrices.data]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refetch(), insights.refetch()]);
  }, [refetch, insights]);

  // Real-time updates: refetch dashboard on wallet/transaction events,
  // refresh live prices on price events, and toast immediately on AI insights.
  useSse(identity?.userId, (msg) => {
    if (msg.channel === "wallet" || msg.channel === "transactions") {
      void refetch();
    }
    if (msg.channel === "prices") {
      const now = Date.now();
      if (now - lastPriceRefreshRef.current > 750) {
        lastPriceRefreshRef.current = now;
        void livePrices.refetch();
      }
    }
    if (msg.channel === "ai-insights") {
      void insights.refetch();
      const data = msg.data as { message?: string } | undefined;
      if (data?.message) {
        toast("رؤية جديدة", {
          description: data.message,
          icon: "💡",
          duration: 5000,
        });
      }
    }
  });

  const handleSimulate = useCallback(() => {
    triggerSimulation(async () => {
      await refreshAll();
    });
  }, [triggerSimulation, refreshAll]);

  const handleDeposit = useCallback(
    async (amount: number) => {
      if (!identity?.userId || depositing) return;
      setDepositing(true);
      try {
        await api.users.simulateDeposit(identity.userId, {
          amount: Number(egpToPiastersString(amount)),
        });
        toast.success("تم الإيداع بنجاح");
        setDepositOpen(false);
        await refreshAll();
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "فشل الإيداع";
        toast.error(msg);
      } finally {
        setDepositing(false);
      }
    },
    [identity, depositing, refreshAll],
  );

  const handleWithdraw = useCallback(
    async (amount: number) => {
      if (!identity?.userId || withdrawing) return;
      setWithdrawing(true);
      try {
        await api.users.simulateWithdraw(identity.userId, {
          amount: Number(egpToPiastersString(amount)),
        });
        toast.success("تم السحب بنجاح");
        setWithdrawOpen(false);
        await refreshAll();
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "فشل السحب";
        toast.error(msg);
      } finally {
        setWithdrawing(false);
      }
    },
    [identity, withdrawing, refreshAll],
  );

  const openSellModal = useCallback((asset: Asset) => {
    setSellAssetId(asset.id);
  }, []);

  const handleSell = useCallback(
    async (payload: {
      assetClass: AssetClass;
      amount?: string;
      units?: string;
    }) => {
      if (!identity?.userId || selling) return;
      setSelling(true);
      try {
        await api.users.simulateSell(identity.userId, payload);
        toast.success("تم البيع وإضافة المبلغ للرصيد المتاح");
        setSellAssetId(null);
        await Promise.all([refreshAll(), refetchPrices()]);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "فشل البيع";
        toast.error(msg);
      } finally {
        setSelling(false);
      }
    },
    [identity, selling, refreshAll, refetchPrices],
  );

  const handleTimeTravel = useCallback(() => {
    if (timeTraveling) return;
    setTimeTraveling(true);
    toast("تقدم سنة كاملة!", {
      description: "محاكاة محلية لعرض الأسعار الجديدة (لا يؤثر على الخادم)",
      icon: "📈",
      duration: 2500,
    });
    setTimeout(() => setTimeTraveling(false), 2500);
  }, [timeTraveling]);

  return (
    <AppShell>
      <div className="relative z-10 px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-muted-foreground text-sm">مرحباً بك 👋</p>
            <h1 className="font-heading font-bold text-xl text-foreground">
              {bootstrapping ? "جاري تهيئة حسابك..." : userName}
            </h1>
            {bootstrapError && (
              <p className="text-xs text-red-600 mt-1">{bootstrapError}</p>
            )}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          {/* Time-travel button */}
          <motion.button
            onClick={handleTimeTravel}
            disabled={timeTraveling}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 glass border border-border px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <FastForward
              size={14}
              className={timeTraveling ? "text-sukuk-green animate-pulse" : ""}
            />
            <span>{timeTraveling ? "جاري التقدم..." : "تقدم سنة ⚡"}</span>
          </motion.button>
        </motion.div>

        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          pendingCash={data?.balanceEgp ?? 0}
          returnRate={returnRate}
          onSimulate={handleSimulate}
          ledger={data?.ledger}
        />

        {loading && !data && (
          <p className="text-center text-xs text-muted-foreground">
            جاري التحميل...
          </p>
        )}

        {/* Chart + Quick Actions & Goals grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Portfolio Chart — takes 2/3 */}
          <div className="md:col-span-2">
            <PortfolioChart
              assets={enrichedPositions}
              prices={livePrices.data?.prices}
              pricesLoading={livePrices.loading}
              pricesError={livePrices.error}
              onSellAsset={openSellModal}
              sellDisabled={!identity?.userId || selling}
              sellingAssetId={selling ? sellAssetId : null}
            />
          </div>

          {/* Quick Actions & Goals — takes 1/3 */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl p-5 flex flex-col gap-3"
            >
              <h3 className="font-heading font-bold text-base text-foreground mb-1">
                إجراءات سريعة
              </h3>
              <motion.button
                onClick={() => setDepositOpen(true)}
                disabled={depositing || !identity?.userId}
                whileHover={{ scale: 1.03, x: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold bg-sukuk-green-muted text-sukuk-green border-sukuk-green/20 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                <span>{depositing ? "جاري الإيداع..." : "إضافة رصيد"}</span>
              </motion.button>
              <motion.button
                onClick={() => setWithdrawOpen(true)}
                disabled={withdrawing || !identity?.userId}
                whileHover={{ scale: 1.03, x: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold bg-white text-foreground border-border transition-all duration-150 hover:border-sukuk-green/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                <span>{withdrawing ? "جاري السحب..." : "سحب"}</span>
              </motion.button>
              <button
                disabled
                className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold bg-muted/50 text-muted-foreground border-border opacity-60 cursor-not-allowed"
              >
                <PauseCircle size={16} />
                <span>إيقاف مؤقت</span>
              </button>

              {/* Sharia badge */}
              <div className="mt-auto pt-4 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  🕌 100% متوافق مع الشريعة
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  معتمد من هيئة الفتوى
                </p>
              </div>
            </motion.div>

            <GoalProgressWidget
              current={balance}
              target={data?.targetGoalEgp ?? null}
            />
          </div>
        </div>

        {/* Growth & Recent Sweeps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectedGrowthWidget currentBalance={balance} />
          <RecentSweepsWidget ledger={data?.ledger} />
        </div>

        {/* Insight Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <InsightCards insights={insights.data} loading={insights.loading} />
        </motion.div>
      </div>

      <AmountModal
        open={depositOpen}
        title="إضافة رصيد"
        description="أدخل المبلغ اللي عايز تضيفه لمحفظتك. يتم خصم رسوم إيداع 0.5%."
        confirmLabel="تأكيد الإيداع"
        defaultValue={100}
        busy={depositing}
        onConfirm={handleDeposit}
        onClose={() => setDepositOpen(false)}
      />
      <AmountModal
        open={withdrawOpen}
        title="سحب رصيد"
        description="أدخل المبلغ اللي عايز تسحبه من الرصيد المتاح."
        confirmLabel="تأكيد السحب"
        defaultValue={Math.max(50, Math.floor(data?.balanceEgp ?? 50))}
        busy={withdrawing}
        onConfirm={handleWithdraw}
        onClose={() => setWithdrawOpen(false)}
      />
      <SellAssetModal
        open={!!selectedSellOption}
        option={selectedSellOption}
        busy={selling}
        onConfirm={handleSell}
        onClose={() => {
          if (!selling) setSellAssetId(null);
        }}
      />
    </AppShell>
  );
}
