"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function StepHero({ onNext }: { onNext: () => void }) {
  const pills = [
    { label: "متوافق مع الشريعة", icon: "✓" },
    { label: "من 50 جنيه فأكتر", icon: "💰" },
    { label: "مصر والخليج", icon: "🌍" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-6 py-16">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-20 h-20 rounded-3xl bg-sukuk-green flex items-center justify-center mb-8 shadow-lg"
        style={{ boxShadow: "0 12px 40px oklch(0.48 0.14 152 / 30%)" }}
      >
        <span className="text-white font-heading font-bold text-3xl">ص</span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading font-bold text-4xl md:text-5xl text-foreground leading-tight mb-4"
      >
        فلوسك بتكبر
        <br />
        <span className="text-gradient-green">من غير ما تحس</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-muted-foreground text-lg max-w-sm leading-relaxed mb-10"
      >
        كل عملية شراء بتقربك لهدفك — استثمر فكتتك تلقائياً في صكوك إسلامية متوافقة مع الشريعة
      </motion.p>

      {/* Pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="flex flex-wrap gap-3 justify-center mb-10"
      >
        {pills.map((p) => (
          <div key={p.label} className="glass flex items-center gap-2 px-4 py-2 rounded-full text-sm text-muted-foreground">
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 px-8 py-4 bg-sukuk-green text-white rounded-2xl font-heading font-semibold text-lg transition-shadow duration-300"
          style={{ boxShadow: "0 8px 30px oklch(0.48 0.14 152 / 35%)" }}
        >
          <span>ابدأ رحلتك</span>
          <ArrowRight size={20} className="rotate-180" />
        </motion.button>
      </motion.div>
    </div>
  );
}
