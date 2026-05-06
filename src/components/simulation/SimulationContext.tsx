"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ApiError } from "@/lib/api/types";
import { api } from "@/lib/api/sdk";
import { useIdentity } from "@/components/providers/IdentityProvider";

export type SimulationStepStatus = "pending" | "active" | "completed" | "failed";

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
  triggerSimulation: (onComplete?: () => void | Promise<void>) => void;
}

const SimulationContext = createContext<SimulationContextProps | undefined>(
  undefined
);

const SIMULATION_SCENARIOS = [
  { merchantTag: "coffee_shop", merchant: "مقهى وسط البلد", amount: 47, asset: "GOLD", note: "الفكة الصغيرة بدأت إنجاز جديد" },
  { merchantTag: "grocery", merchant: "سوبرماركت العائلة", amount: 183, asset: "INDEX_FUND", note: "التسوق اليومي قربك خطوة" },
  { merchantTag: "ride_share", merchant: "رحلة مواصلات", amount: 92, asset: "HIGH_RISK", note: "المشاوير كمان بتبني محفظتك" },
  { merchantTag: "pharmacy", merchant: "صيدلية الحي", amount: 126, asset: "GOLD", note: "مصروف ضروري وفكة مفيدة" },
  { merchantTag: "food_delivery", merchant: "طلب أكل", amount: 214, asset: "INDEX_FUND", note: "طلب سريع وفكة أذكى" },
  { merchantTag: "online_shopping", merchant: "تسوق أونلاين", amount: 338, asset: "HIGH_RISK", note: "الشراء اتحول لفرصة" },
] as const;

function pickScenario() {
  return SIMULATION_SCENARIOS[
    Math.floor(Math.random() * SIMULATION_SCENARIOS.length)
  ];
}

function buildSteps(scenario: (typeof SIMULATION_SCENARIOS)[number]): SimulationStep[] {
  const rounded = Math.ceil(scenario.amount / 10) * 10;
  const sweep = rounded - scenario.amount;
  const fee = Number((sweep * 0.015).toFixed(2));
  const net = Number(Math.max(0, sweep - fee).toFixed(2));
  const units = Number((net / 100).toFixed(4));

  return [
    {
      id: "bank-api",
      label: "واجهة البنك",
      description: `عملية شراء جديدة من ${scenario.merchant}.`,
      status: "pending",
      payload: { amount: scenario.amount, merchant: scenario.merchantTag },
    },
    {
      id: "webhook",
      label: "مستقبل البيانات",
      description: "استلام العملية وربطها بالمستخدم الحالي.",
      status: "pending",
      payload: { status: "received", merchant: scenario.merchant },
    },
    {
      id: "roundup-engine",
      label: "محرك التقريب",
      description: `تقريب ${scenario.amount} إلى ${rounded} جنيه.`,
      status: "pending",
      payload: { original: scenario.amount, rounded, sweep },
    },
    {
      id: "fee-engine",
      label: "محرك الرسوم",
      description: "تجهيز صافي الفكة للاستثمار.",
      status: "pending",
      payload: { fee, net_investment: net },
    },
    {
      id: "ai-emotional-engine",
      label: "محرك الإنجازات",
      description: "تسجيل أثر العملية على إنجازات المحفظة.",
      status: "pending",
      payload: { achievement: scenario.note },
    },
    {
      id: "asset-investment",
      label: "استثمار الأصول",
      description: "توزيع صافي الفكة على الأصول المتاحة.",
      status: "pending",
      payload: { units, asset: scenario.asset },
    },
  ];
}

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isXRayMode, setIsXRayMode] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [steps, setSteps] = useState<SimulationStep[]>(() =>
    buildSteps(SIMULATION_SCENARIOS[0]),
  );
  const { identity } = useIdentity();

  const triggerSimulation = useCallback(async (onComplete?: () => void | Promise<void>) => {
    const activeSteps = buildSteps(pickScenario());
    setIsSimulating(true);
    setCurrentStepId(null);
    setSteps(activeSteps.map((s) => ({ ...s, status: "pending" })));

    // Fire the real backend call in parallel with the UI animation.
    // Pass the real userId so the webhook hits an existing record.
    const backendCall = api.mockBank
      .simulateTransaction(
        identity?.userId
          ? {
              userId: identity.userId,
              amount: activeSteps[0].payload?.amount as number,
              merchantTag: activeSteps[0].payload?.merchant as string,
            }
          : {},
      )
      .catch((err: unknown) => err);

    let backendFailed: Error | null = null;

    // Simulation sequence
    for (let i = 0; i < activeSteps.length; i++) {
      const step = activeSteps[i];
      setCurrentStepId(step.id);
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "active" } : s
        )
      );

      // Duration for each step to visualize packet travel
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // On the final step, await the backend result so failures show up.
      if (i === activeSteps.length - 1) {
        const result = await backendCall;
        if (result instanceof Error) {
          backendFailed =
            result instanceof ApiError ? result : new Error(String(result));
        }
      }

      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i
            ? {
                ...s,
                status:
                  backendFailed && i === activeSteps.length - 1
                    ? "failed"
                    : "completed",
              }
            : s
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
    if (!backendFailed) onComplete?.();
  }, [identity?.userId]);

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
