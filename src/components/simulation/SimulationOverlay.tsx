"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CircleDashed, Server, Database, Brain, Radio } from "lucide-react";
import { useSimulation } from "./SimulationContext";

export function SimulationOverlay() {
  const { isSimulating, steps, currentStepIndex } = useSimulation();

  if (!isSimulating) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-10000 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-md glass border border-border/50 rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Progress header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sukuk-green/10 flex items-center justify-center border border-sukuk-green/20">
                <Server size={20} className="text-sukuk-green" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-foreground">
                  محاكاة النظام (Server)
                </h2>
                <p className="text-xs text-muted-foreground">
                  جاري معالجة الطلب عبر البنية التحتية...
                </p>
              </div>
            </div>
            
            <div className="text-xs font-mono font-bold text-sukuk-green bg-sukuk-green/5 px-2 py-1 rounded-md">
              {Math.round(((currentStepIndex + 0.5) / steps.length) * 100)}%
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-4 relative">
            {/* Connection line */}
            <div className="absolute top-4 bottom-4 right-[19px] w-0.5 bg-muted-foreground/10" />

            {steps.map((step) => {
              const Icon = getIconForStep(step.id);
              const isActive = step.status === "active";
              const isCompleted = step.status === "completed";

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0.5, x: 10 }}
                  animate={{ 
                    opacity: isActive || isCompleted ? 1 : 0.4,
                    x: isActive ? 0 : 0
                  }}
                  className="flex items-start gap-4 relative z-10"
                >
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive ? "bg-sukuk-green border-sukuk-green shadow-[0_0_15px_oklch(0.48_0.14_152/40%)]" : 
                    isCompleted ? "bg-sukuk-green/20 border-sukuk-green/50" : 
                    "bg-background border-border"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 size={18} className="text-sukuk-green" />
                    ) : isActive ? (
                      <CircleDashed size={18} className="text-white animate-spin" />
                    ) : (
                      <Icon size={18} className="text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <h3 className={`text-sm font-bold transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </h3>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-muted-foreground mt-1 leading-relaxed"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer visual */}
          <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground/60 uppercase tracking-wider font-mono">
            <span>Server Location: MENA-EAST-1</span>
            <span>Uptime: 99.99%</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getIconForStep(id: string) {
  switch (id) {
    case "price-feed": return Radio;
    case "fee-engine": return Database;
    case "ai-engine": return Brain;
    case "sse-broadcast": return Radio;
    default: return Server;
  }
}
