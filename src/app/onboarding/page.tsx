"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { FloatingOrbs } from "@/components/decorative/FloatingOrbs";
import { GeometricPattern } from "@/components/decorative/GeometricPattern";
import { StepHero } from "./_steps/StepHero";
import { StepSignup } from "./_steps/StepSignup";
import { StepBank } from "./_steps/StepBank";
import { StepRisk } from "./_steps/StepRisk";
import { StepSettings } from "./_steps/StepSettings";
import type { RiskProfile } from "@/types";

// ─── Step dots ────────────────────────────────────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i + 1 === current ? 24 : 8,
            backgroundColor: i + 1 <= current ? "oklch(0.48 0.14 152)" : "oklch(0.88 0.008 95)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

// ─── Step variants ─────────────────────────────────────────────────────────────
const variants = {
  enter: { opacity: 0, y: 20, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.97 },
};

const TOTAL = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [risk, setRisk] = useState<RiskProfile | null>(null);
  const [roundupEnabled, setRoundupEnabled] = useState(true);
  const [multiplier, setMultiplier] = useState<1 | 5 | 10>(5);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL));
  const back = () => setStep((s) => Math.max(s - 1, 1));
  const finish = () => router.push("/dashboard");

  const updateForm = (field: "name" | "email" | "phone", value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-hero-gradient">
      {/* Decorative background */}
      <FloatingOrbs />
      <GeometricPattern />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        {/* Back button */}
        <motion.button
          onClick={back}
          animate={{ opacity: step > 1 ? 1 : 0, pointerEvents: step > 1 ? "auto" : "none" }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          aria-label="رجوع"
        >
          <ChevronRight size={18} />
          <span>رجوع</span>
        </motion.button>

        {/* Step counter */}
        <AnimatePresence mode="wait">
          {step > 1 && (
            <motion.p
              key={step}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-xs text-muted-foreground font-medium"
            >
              خطوة {step} من {TOTAL}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Brand wordmark */}
        <p className="font-heading font-bold text-sm text-sukuk-green">صكوك سويب</p>
      </header>

      {/* Progress dots (steps 2–5) */}
      <AnimatePresence>
        {step > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-10 px-6 pt-2 pb-1"
          >
            <StepDots current={step} total={TOTAL} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content */}
      <main className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            {step === 1 && <StepHero onNext={next} />}
            {step === 2 && <StepSignup formData={formData} onChange={updateForm} onNext={next} />}
            {step === 3 && <StepBank onNext={next} />}
            {step === 4 && <StepRisk selected={risk} onSelect={setRisk} onNext={next} />}
            {step === 5 && (
              <StepSettings
                enabled={roundupEnabled}
                multiplier={multiplier}
                onToggle={setRoundupEnabled}
                onMultiplier={setMultiplier}
                onFinish={finish}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
