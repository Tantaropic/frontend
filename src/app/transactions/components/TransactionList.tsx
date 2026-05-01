"use client";

import { useMemo } from "react";
import { Transaction } from "@/types";
import { TransactionItem } from "./TransactionItem";
import AnimatedList from "@/components/ui/AnimatedList";

export interface TransactionGroup {
  date: string;
  transactions: Transaction[];
}

interface TransactionListProps {
  groups: TransactionGroup[];
}

type FlattenedItem = 
  | { type: "header"; date: string }
  | { type: "transaction"; data: Transaction };

export function TransactionList({ groups }: TransactionListProps) {
  const flattenedItems = useMemo<FlattenedItem[]>(() => {
    const items: FlattenedItem[] = [];
    groups.forEach((group) => {
      items.push({ type: "header", date: group.date });
      group.transactions.forEach((txn) => {
        items.push({ type: "transaction", data: txn });
      });
    });
    return items;
  }, [groups]);

  if (groups.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        لا توجد معاملات بعد.
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatedList
        items={flattenedItems}
        renderItem={(item) => {
          if (item.type === "header") {
            const formattedDate = new Date(item.date).toLocaleDateString("ar-EG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            return (
              <h3 className="font-heading font-medium text-muted-foreground mb-4 mt-8 px-1 first:mt-0">
                {formattedDate}
              </h3>
            );
          }
          return (
            <div className="mb-3">
              <TransactionItem transaction={item.data} />
            </div>
          );
        }}
      />
    </div>
  );
}
