"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface SimulatePurchaseButtonProps {
  onSimulate: () => void;
}

export function SimulatePurchaseButton({ onSimulate }: SimulatePurchaseButtonProps) {
  return (
    <div className="mb-6">
      <Button
        onClick={onSimulate}
        className="w-full bg-sukuk-green hover:bg-sukuk-green-light text-white font-medium shadow-md transition-all active:scale-[0.98]"
        size="lg"
      >
        <PlusCircle className="me-2 h-5 w-5" />
        محاكاة عملية شراء
      </Button>
    </div>
  );
}
