"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FloatingOrbs } from "@/components/decorative/FloatingOrbs";
import { GeometricPattern } from "@/components/decorative/GeometricPattern";

const pills = [
  { label: "متوافق مع الشريعة", icon: "✓" },
  { label: "فكتك النهاردة ثروتك للمستقبل", icon: "💰" },
  { label: "الان بمصر وقريبًا بالخليج", icon: "🌍" },
];

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-hero-gradient">
      <FloatingOrbs />
      <GeometricPattern />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-20 h-20 rounded-3xl bg-sukuk-green flex items-center justify-center mb-8"
          style={{ boxShadow: "0 12px 40px oklch(0.48 0.14 152 / 35%)" }}
        >
          <span className="text-white font-heading font-bold text-3xl">
            فكة
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-muted-foreground text-lg leading-relaxed mb-10"
        >
          كل عملية شراء بتقربك لهدفك — استثمر فكتك تلقائياً في صكوك إسلامية
          متوافقة مع الشريعة
        </motion.p>

        {/* Pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-wrap gap-3 justify-center mb-10"
        >
          {pills.map((p) => (
            <div
              key={p.label}
              className="glass flex items-center gap-2 px-4 py-2 rounded-full text-sm text-muted-foreground"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <motion.button
            onClick={() => router.push("/dashboard")}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-10 py-4 bg-sukuk-green text-white rounded-2xl font-heading font-semibold text-xl"
            style={{ boxShadow: "0 10px 40px oklch(0.48 0.14 152 / 40%)" }}
          >
            <span>ابدأ الآن</span>
            <ArrowRight size={22} className="rotate-180" />
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          لا حاجة لبطاقة ائتمان · مجاني للتجربة
        </motion.p>
      </div>
    </div>
  );
}
