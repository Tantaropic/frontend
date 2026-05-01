"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type SimulationStepStatus = "pending" | "active" | "completed";

export interface SimulationStep {
  id: string;
  label: string;
  description: string;
  status: SimulationStepStatus;
  payload?: Record<string, unknown>;
}

interface SimulationContextProps {
  isSimulating: boolean;
  isXRayMode: boolean;
  setIsXRayMode: (val: boolean) => void;
  currentStepId: string | null;
  steps: SimulationStep[];
  triggerSimulation: (onComplete?: () => void) => void;
}

const SimulationContext = createContext<SimulationContextProps | undefined>(
  undefined
);

const INITIAL_STEPS: SimulationStep[] = [
  {
    id: "bank-api",
    label: "واجهة البنك (API)",
    description: "تم رصد عملية شراء جديدة عند نقطة البيع.",
    status: "pending",
    payload: { txn_id: "TXN_7721", amount: 46.50, merchant: "Starbucks" }
  },
  {
    id: "webhook",
    label: "مستقبل البيانات",
    description: "استلام بيانات العملية المشفرة من بوابة الدفع.",
    status: "pending",
    payload: { status: "received", provider: "Stripe/Fawry" }
  },
  {
    id: "roundup-engine",
    label: "محرك التقريب",
    description: "حساب الفكة لأقرب 10 جنيهات مصرية.",
    status: "pending",
    payload: { original: 46.50, rounded: 50.00, sweep: 3.50 }
  },
  {
    id: "fee-engine",
    label: "محرك الرسوم",
    description: "خصم مصاريف التشغيل (1.5%) وتجهيز المبلغ.",
    status: "pending",
    payload: { fee: 0.05, net_investment: 3.45 }
  },
  {
    id: "ai-emotional-engine",
    label: "محرك الذكاء الاصطناعي",
    description: "تحليل نمط الإنفاق وتقديم نصيحة ذكية.",
    status: "pending",
    payload: { mood: "thrifty", nudge: "القهوة طاقة، لكن الصكوك حرية!" }
  },
  {
    id: "asset-investment",
    label: "استثمار الأصول",
    description: "شراء وحدات صكوك في السوق الثانوية.",
    status: "pending",
    payload: { units: 0.12, ticker: "EGP_SUKUK_26" }
  }
];

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isXRayMode, setIsXRayMode] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [steps, setSteps] = useState<SimulationStep[]>(INITIAL_STEPS);

  const triggerSimulation = useCallback(async (onComplete?: () => void) => {
    setIsSimulating(true);
    setCurrentStepId(null);
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "pending" })));

    // Simulation sequence
    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      const step = INITIAL_STEPS[i];
      setCurrentStepId(step.id);
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "active" } : s
        )
      );

      // Duration for each step to visualize packet travel
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "completed" } : s
        )
      );

      // Special event broadcast for widgets
      window.dispatchEvent(new CustomEvent(`simulation:${step.id}`, { 
        detail: step.payload 
      }));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSimulating(false);
    setCurrentStepId(null);
    onComplete?.();
  }, []);

  return (
    <SimulationContext.Provider
      value={{ 
        isSimulating, 
        isXRayMode, 
        setIsXRayMode, 
        currentStepId, 
        steps, 
        triggerSimulation 
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
