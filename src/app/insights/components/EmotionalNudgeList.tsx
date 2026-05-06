"use client";

import { useState } from "react";
import { AIInsight } from "@/types";
import { InsightCard } from "./InsightCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";

interface EmotionalNudgeListProps {
  insights: AIInsight[];
}

type TabValue = "all" | "alerts" | "milestone" | "zakat";

export function EmotionalNudgeList({ insights }: EmotionalNudgeListProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const filteredInsights = insights.filter((insight) => {
    if (activeTab === "all") return true;
    if (
      activeTab === "alerts" &&
      (insight.type === "habit" || insight.type === "nudge")
    ) {
      return true;
    }
    return insight.type === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading font-bold text-xl text-foreground">
          رسائل من محفظتك
        </h2>
        <Tabs
          defaultValue="all"
          className="w-full sm:w-auto"
          onValueChange={(val) => setActiveTab(val as TabValue)}
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto bg-white/50 backdrop-blur-sm border border-border h-10">
            <TabsTrigger value="all" className="font-medium">الكل</TabsTrigger>
            <TabsTrigger value="alerts" className="font-medium">تنبيهات</TabsTrigger>
            <TabsTrigger value="milestone" className="font-medium">إنجازات</TabsTrigger>
            <TabsTrigger value="zakat" className="font-medium">زكاة</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <motion.div layout className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredInsights.length > 0 ? (
            filteredInsights.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center text-muted-foreground bg-white/30 rounded-2xl border border-dashed border-border"
            >
              لا توجد رسائل في هذا القسم حالياً.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
