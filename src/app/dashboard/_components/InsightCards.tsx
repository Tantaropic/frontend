"use client";

import { motion } from "framer-motion";
import { mockInsights } from "@/data/insights";
import { GlassCard } from "@/components/ui/GlassCard";

import { useEffect, useState } from "react";
import { Brain } from "lucide-react";

export function InsightCards() {
  const [isAiActive, setIsAiActive] = useState(false);

  useEffect(() => {
    const handleAi = () => {
      setIsAiActive(true);
      setTimeout(() => setIsAiActive(false), 2500);
    };
    window.addEventListener("simulation:ai-emotional-engine", handleAi);
    return () => window.removeEventListener("simulation:ai-emotional-engine", handleAi);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
          {isAiActive && <Brain className="w-4 h-4 text-purple-500 animate-bounce" />}
          رؤى ذكية
        </h3>
        <span className="text-xs text-muted-foreground">مبني على عاداتك</span>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scroll-smooth">
        {mockInsights.slice(0, 5).map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: isAiActive ? [1, 1.03, 1] : 1,
              boxShadow: isAiActive ? "0 0 20px rgba(168, 85, 247, 0.2)" : "none"
            }}
            transition={{ delay: 0.15 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="snap-start shrink-0 w-64"
          >
            <GlassCard className={`p-4 h-full border transition-colors duration-500 ${isAiActive ? "border-purple-400/50 bg-purple-50/5" : "border-border/60"}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl leading-none mt-0.5">{insight.icon}</div>
                <p className="font-heading font-semibold text-sm text-foreground leading-snug">{insight.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.body}</p>
              {insight.highlight && (
                <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full transition-colors duration-500 ${isAiActive ? "bg-purple-500 text-white" : "bg-sukuk-green-muted text-sukuk-green"}`}>
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
