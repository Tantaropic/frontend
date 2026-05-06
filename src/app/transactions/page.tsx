"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TransactionHeader } from "./components/TransactionHeader";
import { SimulatePurchaseButton } from "./components/SimulatePurchaseButton";
import { TransactionList } from "./components/TransactionList";
import { DailySummaryCard } from "./components/DailySummaryCard";
import { useSimulation } from "@/components/simulation/SimulationContext";
import { useIdentity } from "@/components/providers/IdentityProvider";
import { useDashboard } from "@/app/dashboard/_hooks/useDashboard";
import { useSse } from "@/lib/api/useSse";

export default function TransactionsPage() {
  const { identity } = useIdentity();
  const { data, loading, error, refetch } = useDashboard(identity?.userId);
  const { triggerSimulation } = useSimulation();

  // Real-time refresh on any wallet/transactions event.
  useSse(identity?.userId, (msg) => {
    if (msg.channel === "wallet" || msg.channel === "transactions") {
      void refetch();
    }
  });

  const transactions = useMemo(() => data?.ledger ?? [], [data?.ledger]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};
    for (const txn of transactions) {
      const dateKey = new Date(txn.timestamp).toISOString().split("T")[0];
      (groups[dateKey] ??= []).push(txn);
    }
    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => ({ date, transactions: groups[date] }));
  }, [transactions]);

  const handleSimulatePurchase = () => {
    triggerSimulation(async () => {
      await refetch();
    });
  };

  const today = new Date().toDateString();
  // Match the dashboard's BalanceCard logic: only inflows count as "مستثمر اليوم".
  // Investment-allocation rows would double-count what the deposit/sweep already represents.
  const todays = transactions.filter((t) => {
    if (new Date(t.timestamp).toDateString() !== today) return false;
    return t.kind === "deposit" || t.kind === "sweep";
  });
  const totalInvestedToday = todays.reduce((sum, t) => sum + t.investedAmount, 0);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 pt-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-6">
          المعاملات
        </h1>

        <TransactionHeader todayTotalInvested={totalInvestedToday} />

        <SimulatePurchaseButton onSimulate={handleSimulatePurchase} />

        <DailySummaryCard
          date={new Date().toISOString()}
          totalPurchases={todays.length}
          totalInvested={totalInvestedToday}
          transactionCount={todays.length}
        />

        {loading && (
          <p className="text-sm text-muted-foreground mt-4">جاري التحميل...</p>
        )}
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <TransactionList groups={groupedTransactions} />
      </div>
    </AppShell>
  );
}
