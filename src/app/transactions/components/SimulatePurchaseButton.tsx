"use client";

import { useSimulation } from "@/components/simulation/SimulationContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, Zap } from "lucide-react";

interface SimulatePurchaseButtonProps {
  onSimulate: () => void;
}

export function SimulatePurchaseButton({ onSimulate }: SimulatePurchaseButtonProps) {
  const { isSimulating } = useSimulation();

  return (
    <div className="mb-6">
      <Button
        onClick={onSimulate}
        disabled={isSimulating}
        className={`w-full font-medium shadow-md transition-all active:scale-[0.98] ${
          isSimulating 
          ? "bg-muted text-muted-foreground cursor-not-allowed" 
          : "bg-sukuk-green hover:bg-sukuk-green-light text-white"
        }`}
        size="lg"
      >
        {isSimulating ? (
          <>
            <Zap className="me-2 h-5 w-5 animate-pulse text-yellow-400 fill-yellow-400" />
            جاري المحاكاة...
          </>
        ) : (
          <>
            <PlusCircle className="me-2 h-5 w-5" />
            محاكاة عملية شراء
          </>
        )}
      </Button>
    </div>
  );
}
