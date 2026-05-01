"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type SimulationStepStatus = "pending" | "active" | "completed";

export interface SimulationStep {
  id: string;
  label: string;
  description: string;
  status: SimulationStepStatus;
  icon?: string;
}

interface SimulationContextProps {
  isSimulating: boolean;
  currentStepIndex: number;
  steps: SimulationStep[];
  triggerSimulation: (onComplete: () => void) => void;
}

const SimulationContext = createContext<SimulationContextProps | undefined>(
  undefined
);

const INITIAL_STEPS: SimulationStep[] = [
  {
    id: "price-feed",
    label: "Price Feed Service",
    description: "جاري مزامنة الأسعار من Mock Bank API...",
    status: "pending",
    icon: "📡",
  },
  {
    id: "fee-engine",
    label: "Fee Engine",
    description: "احتساب رسوم (1.5%) وتوزيع أرباح المحفظة...",
    status: "pending",
    icon: "⚙️",
  },
  {
    id: "ai-engine",
    label: "AI Engine",
    description: "تحليل الأداء عبر Azure OpenAI وتوليد الأفكار...",
    status: "pending",
    icon: "🧠",
  },
  {
    id: "sse-broadcast",
    label: "SSE Broadcast",
    description: "تحديث واجهة المستثمر بالبيانات الجديدة...",
    status: "pending",
    icon: "🚀",
  },
];

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<SimulationStep[]>(INITIAL_STEPS);

  const triggerSimulation = useCallback(async (onComplete: () => void) => {
    setIsSimulating(true);
    setCurrentStepIndex(0);
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "pending" })));

    // Simulation loop
    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      setCurrentStepIndex(i);
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "active" } : s
        )
      );

      // Wait for each step
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "completed" } : s
        )
      );
    }

    // Final short pause before finishing
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setIsSimulating(false);
    onComplete();
  }, []);

  return (
    <SimulationContext.Provider
      value={{ isSimulating, currentStepIndex, steps, triggerSimulation }}
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
