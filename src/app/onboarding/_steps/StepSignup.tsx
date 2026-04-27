"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface StepSignupProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onNext: () => void;
}

const fields = [
  { key: "name" as const,  label: "الاسم الكامل",       placeholder: "محمد أحمد",        type: "text" },
  { key: "email" as const, label: "البريد الإلكتروني",   placeholder: "you@example.com",  type: "email" },
  { key: "phone" as const, label: "رقم الهاتف",          placeholder: "01012345678",       type: "tel" },
];

export function StepSignup({ formData, onChange, onNext }: StepSignupProps) {
  const isValid = formData.name.trim() && formData.email.trim() && formData.phone.trim();

  return (
    <div className="flex flex-col justify-center min-h-full px-6 py-10 max-w-md mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">أنشئ حسابك</h2>
        <p className="text-muted-foreground text-sm">خطوة بسيطة وتبدأ رحلة الاستثمار</p>
      </motion.div>

      <GlassCard className="p-6 space-y-5 mb-4">
        {fields.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="space-y-2"
          >
            <Label htmlFor={f.key} className="text-sm font-medium">{f.label}</Label>
            <Input
              id={f.key}
              type={f.type}
              placeholder={f.placeholder}
              value={formData[f.key]}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="text-right bg-white/70 rounded-xl h-12 border-border focus-visible:ring-sukuk-green/30"
            />
          </motion.div>
        ))}
      </GlassCard>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center text-sm text-muted-foreground mb-8">
        لديك حساب؟{" "}
        <button className="text-sukuk-green font-medium hover:underline underline-offset-2">سجّل دخولك</button>
      </motion.p>

      <motion.button
        onClick={onNext}
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.02, y: -1 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
        className={cn(
          "w-full py-3.5 rounded-2xl font-heading font-semibold text-base transition-all duration-200",
          isValid
            ? "bg-sukuk-green text-white"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
        style={isValid ? { boxShadow: "0 6px 24px oklch(0.48 0.14 152 / 28%)" } : {}}
      >
        التالي ←
      </motion.button>
    </div>
  );
}
