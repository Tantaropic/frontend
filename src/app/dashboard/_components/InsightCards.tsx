"use client";

import { motion } from "framer-motion";
import { mockInsights } from "@/data/insights";
import { GlassCard } from "@/components/ui/GlassCard";

export function InsightCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-foreground">رؤى ذكية</h3>
        <span className="text-xs text-muted-foreground">مبني على عاداتك</span>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scroll-smooth">
        {mockInsights.slice(0, 5).map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="snap-start shrink-0 w-64"
          >
            <GlassCard className="p-4 h-full border border-border/60">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl leading-none mt-0.5">{insight.icon}</div>
                <p className="font-heading font-semibold text-sm text-foreground leading-snug">{insight.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.body}</p>
              {insight.highlight && (
                <div className="inline-block bg-sukuk-green-muted text-sukuk-green text-xs font-bold px-2.5 py-1 rounded-full">
                  {insight.highlight}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
