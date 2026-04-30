"use client";

import { AIInsight } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, Variants } from "framer-motion";

interface InsightCardProps {
  insight: AIInsight;
  index: number;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export function InsightCard({ insight, index }: InsightCardProps) {
  const formattedDate = new Date(insight.timestamp).toLocaleDateString("ar-EG", {
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard className="p-5 relative overflow-hidden group hover:border-sukuk-green/30 transition-colors">
        <div className="absolute top-0 inset-e-0 p-4 opacity-[0.03] text-7xl pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
          {insight.icon}
        </div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-white shadow-sm text-2xl border border-sukuk-warm-gray/50">
            {insight.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-heading font-bold text-base text-foreground">
                {insight.title}
              </h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formattedDate}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.body}
            </p>
            
            {insight.highlight && (
              <div className="mt-3 inline-block px-3 py-1 bg-sukuk-green/10 text-sukuk-green font-semibold rounded-lg text-sm tabular-nums">
                {insight.highlight}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
