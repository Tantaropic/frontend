"use client";

import { Transaction } from "@/types";
import { motion, Variants } from "framer-motion";
import { formatEGP } from "@/lib/utils";

interface TransactionItemProps {
  transaction: Transaction;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function renderTags(t: Transaction) {
  switch (t.kind) {
    case "deposit":
      return (
        <>
          <span className="font-bold text-sukuk-green text-sm tabular-nums bg-sukuk-green/10 px-2 py-1 rounded-md">
            +{formatEGP(t.investedAmount)}
          </span>
          <span className="text-[10px] font-semibold text-sukuk-green bg-sukuk-green/10 px-2 py-0.5 rounded-full">
            ✓ إيداع ناجح
          </span>
        </>
      );
    case "buy":
      return (
        <>
          <span className="font-bold text-blue-700 text-sm tabular-nums bg-blue-50 px-2 py-1 rounded-md">
            −{formatEGP(t.investedAmount)}
          </span>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
            📊 تم الشراء
          </span>
        </>
      );
    case "fee":
      return (
        <>
          <span className="font-bold text-amber-700 text-sm tabular-nums bg-amber-50 px-2 py-1 rounded-md">
            −{formatEGP(t.investedAmount)}
          </span>
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            رسوم
          </span>
        </>
      );
    case "withdrawal":
      return (
        <>
          <span className="font-bold text-red-700 text-sm tabular-nums bg-red-50 px-2 py-1 rounded-md">
            −{formatEGP(t.investedAmount)}
          </span>
          <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
            سحب ناجح
          </span>
        </>
      );
    case "sell":
      return (
        <>
          <span className="font-bold text-emerald-700 text-sm tabular-nums bg-emerald-50 px-2 py-1 rounded-md">
            +{formatEGP(t.investedAmount)}
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            تم البيع
          </span>
        </>
      );
    case "sweep":
    default:
      return (
        <>
          <span className="font-bold text-sukuk-green text-sm tabular-nums bg-sukuk-green/10 px-2 py-1 rounded-md">
            +{formatEGP(t.investedAmount)}
          </span>
          <span className="text-[10px] font-semibold text-sukuk-green bg-sukuk-green/10 px-2 py-0.5 rounded-full">
            🪙 فكّة مستثمرة
          </span>
        </>
      );
  }
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const subtitle =
    transaction.kind === "sweep" && transaction.amount > 0
      ? `شراء بـ ${formatEGP(transaction.amount)}`
      : transaction.kind === "deposit"
        ? "من حسابك البنكي"
        : transaction.kind === "withdrawal"
          ? "إلى حسابك البنكي"
        : transaction.kind === "sell"
          ? "إلى رصيدك المتاح"
        : transaction.kind === "buy"
          ? "من رصيدك المتاح"
          : transaction.kind === "fee"
            ? "رسوم تشغيل"
            : `${transaction.amount} جنيه`;

  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-between p-4 bg-white/50 hover:bg-white/80 transition-colors rounded-xl border border-sukuk-warm-gray mb-3"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sukuk-cream text-2xl shadow-sm border border-sukuk-warm-gray/50">
          {transaction.merchantIcon}
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-semibold text-foreground">
            {transaction.merchantName}
          </span>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">{renderTags(transaction)}</div>
    </motion.div>
  );
}
