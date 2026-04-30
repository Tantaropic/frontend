"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { mockTransactions, mockDailySummaries } from "@/data/transactions";
import { Transaction } from "@/types";
import { TransactionHeader } from "./components/TransactionHeader";
import { SimulatePurchaseButton } from "./components/SimulatePurchaseButton";
import { TransactionList, TransactionGroup } from "./components/TransactionList";
import { DailySummaryCard } from "./components/DailySummaryCard";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  // Group transactions by date (timestamp's date part)
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    transactions.forEach((txn) => {
      // Extract YYYY-MM-DD
      const dateKey = new Date(txn.timestamp).toISOString().split("T")[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(txn);
    });

    // Convert to array and sort by date descending
    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => ({
        date,
        transactions: groups[date], // already in order of insertion if prepended
      }));
  }, [transactions]);

  const handleSimulatePurchase = () => {
    const amount = Math.floor(Math.random() * 500) + 50;
    const roundedAmount = Math.ceil(amount / 10) * 10;
    const investedAmount = roundedAmount - amount;

    const newTxn: Transaction = {
      id: `sim_${Date.now()}`,
      merchantName: "عملية شراء تجريبية",
      merchantNameEn: "Simulated Purchase",
      merchantCategory: "أخرى",
      merchantIcon: "🛍️",
      amount,
      roundedAmount,
      investedAmount,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    setTransactions((prev) => [newTxn, ...prev]);
  };

  // Get today's summary (from mock data, or derived)
  // For the sake of the demo, we'll use the first one from mockDailySummaries
  // and maybe update its invested amount based on simulations.
  const todaySummary = mockDailySummaries[0];
  const totalInvestedToday = 
    todaySummary.totalInvested + 
    transactions.filter(t => t.id.startsWith("sim_")).reduce((sum, t) => sum + t.investedAmount, 0);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 pt-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-6">
          المعاملات
        </h1>

        <TransactionHeader todayTotalInvested={totalInvestedToday} />
        
        <SimulatePurchaseButton onSimulate={handleSimulatePurchase} />

        <DailySummaryCard 
          date={todaySummary.date}
          totalPurchases={todaySummary.totalPurchases}
          totalInvested={totalInvestedToday}
          transactionCount={todaySummary.transactionCount + transactions.filter(t => t.id.startsWith("sim_")).length}
        />

        <TransactionList groups={groupedTransactions} />
      </div>
    </AppShell>
  );
}
