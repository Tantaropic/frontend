"use client";

import { Transaction } from "@/types";
import { StatusBadge } from "@/components/ui/SukukBadge";
import { motion, Variants } from "framer-motion";

interface TransactionItemProps {
  transaction: Transaction;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function TransactionItem({ transaction }: TransactionItemProps) {
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
          <span className="text-sm text-muted-foreground tabular-nums">
            {transaction.amount} جنيه
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="font-bold text-sukuk-green text-sm tabular-nums bg-sukuk-green/10 px-2 py-1 rounded-md">
          +{transaction.investedAmount} جنيه مُستثمر
        </span>
        <StatusBadge status={transaction.status} />
      </div>
    </motion.div>
  );
}
