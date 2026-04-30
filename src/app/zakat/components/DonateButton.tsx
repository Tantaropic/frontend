"use client";

import { Button } from "@/components/ui/button";
import { HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";

interface DonateButtonProps {
  amount: number;
}

export function DonateButton({ amount }: DonateButtonProps) {
  const handleDonate = () => {
    toast.success("تم إخراج زكاتك بنجاح", {
      description: `تقبل الله منك. تم خصم ${amount} جنيه وتوجيهها للمصارف الشرعية.`,
      duration: 5000,
    });
  };

  return (
    <GlassCard className="p-6 text-center mt-6 border-sukuk-green/20">
      <h3 className="font-heading font-semibold text-lg mb-2">
        طهر أموالك وأخرج زكاتك
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        بضغطة زر، يمكنك إخراج زكاتك المستحقة ليتم توجيهها إلى مصارف الزكاة
        المعتمدة.
      </p>
      <Button
        onClick={handleDonate}
        size="lg"
        className="w-full sm:w-auto min-w-[200px] bg-sukuk-green hover:bg-sukuk-green-light text-white text-base shadow-md"
      >
        <HeartHandshake className="me-2 h-5 w-5" />
        إخراج الزكاة الآن
      </Button>
    </GlassCard>
  );
}
