"use client";

import { Transaction } from "@/types";
import { TransactionItem } from "./TransactionItem";
import { motion, AnimatePresence } from "framer-motion";

export interface TransactionGroup {
  date: string;
  transactions: Transaction[];
}

interface TransactionListProps {
  groups: TransactionGroup[];
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function TransactionList({ groups }: TransactionListProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        لا توجد معاملات بعد.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const formattedDate = new Date(group.date).toLocaleDateString("ar-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <div key={group.date}>
            <h3 className="font-heading font-medium text-muted-foreground mb-3 px-1">
              {formattedDate}
            </h3>
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              <AnimatePresence initial={false}>
                {group.transactions.map((txn) => (
                  <TransactionItem key={txn.id} transaction={txn} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
