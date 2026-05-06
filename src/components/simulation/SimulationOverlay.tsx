"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { useSimulation } from "./SimulationContext";
import { XRayDiagram } from "./XRayDiagram";

export function SimulationOverlay() {
  const { isSimulating } = useSimulation();

  if (!isSimulating) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-10000 flex items-center justify-center"
        dir="rtl"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xl" />

        {/* Header Controls */}
        <div className="absolute top-8 left-0 right-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sukuk-green flex items-center justify-center shadow-lg shadow-sukuk-green/40">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-white font-heading font-bold text-2xl tracking-tight">
                محاكاة عملية شراء
              </h2>
              <p className="text-white/40 text-xs uppercase tracking-widest font-mono">
                live transaction flow
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full h-full pt-20">
          <XRayDiagram />
        </div>

        {/* Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/scanlines.png')] bg-repeat" />
      </motion.div>
    </AnimatePresence>
  );
}
