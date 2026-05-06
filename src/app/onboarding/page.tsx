"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, PieChart, Wallet } from "lucide-react";
import { FloatingOrbs } from "@/components/decorative/FloatingOrbs";
import { GeometricPattern } from "@/components/decorative/GeometricPattern";
import SplitText from "@/components/ui/SplitText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GradualBlur from "@/components/ui/GradualBlur";
import Image from "next/image";
import Magnet from "@/components/ui/Magnet";
import BorderGlow from "@/components/ui/BorderGlow";
import PixelCard from "@/components/ui/PixelCard";
import ShinyText from "@/components/ui/ShinyText";

const pills = [
  { label: "متوافق مع الشريعة", icon: "✓" },
  { label: "فكتك النهاردة ثروتك للمستقبل", icon: "💰" },
  { label: "الان بمصر وقريبًا بالخليج", icon: "🌍" },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "استثمار آمن",
    desc: "أموالك مستثمرة في أسهم إسلامية معتمدة ومدعومة بأصول حقيقية.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Zap,
    title: "تلقائية بالكامل",
    desc: "مش محتاج تفتكر تستثمر، إحنا بنقرب الفكة وبنستثمرها لك في كل عملية شراء.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: PieChart,
    title: "توزيع الأرباح",
    desc: "أرباحك بتنزل في محفظتك بشكل دوري وتقدر تتابع نموها لحظة بلحظة.",
    color: "bg-sukuk-green-muted text-sukuk-green",
  },
];

const STEPS = [
  {
    number: "01",
    title: "اربط حسابك البنكي",
    desc: "وصل كارتك البنكي بأمان تام للبدء في تتبع عمليات الشراء.",
    image: "/images/step_link_bank_1777641063190.png",
  },
  {
    number: "02",
    title: "اشتري كالعادة",
    desc: "مارس حياتك الطبيعية، اشتري قهوتك أو اطلب أوبر، وإحنا هنتولى الباقي.",
    image: "/images/step_coffee_roundup_ar_1777641077714.png",
  },
  {
    number: "03",
    title: "شوف فكتك بتكبر",
    desc: "كل عملية شراء بتتقرب لأقرب 10 جنيه، والفرق بيتحول لاستثمار ذكي.",
    image: "/images/step_wallet_sukuk_1777641091791.png",
  },
];

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-hero-gradient overflow-x-hidden">
      <FloatingOrbs />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <GeometricPattern />
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
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

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-heading font-bold text-5xl md:text-7xl text-foreground leading-tight mb-6"
          >
            فلوسك بتكبر
            <br />
            <span className="text-gradient-green">من غير ما تحس</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-muted-foreground text-xl leading-relaxed mb-12 max-w-lg"
          >
            كل عملية شراء بتقربك لهدفك — استثمر فكتك تلقائياً في إستثمارات
            إسلامية متوافقة مع الشريعة
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {pills.map((p) => (
              <div
                key={p.label}
                className="glass flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
              >
                <span>{p.icon}</span>
                <ShinyText
                  text={p.label}
                  color="oklch(0.45 0.05 152)"
                  shineColor="oklch(0.98 0.02 152)"
                  speed={3}
                />
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Magnet padding={50} magnetStrength={5}>
              <motion.button
                onClick={() => router.push("/dashboard")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group cursor-pointer flex items-center gap-4 px-12 py-5 bg-sukuk-green text-white rounded-2xl font-heading font-bold text-2xl shadow-xl shadow-sukuk-green/20"
              >
                <span>ابدأ رحلتك الآن</span>
                <ArrowRight
                  size={24}
                  className="rotate-180 group-hover:-translate-x-1 transition-transform"
                />
              </motion.button>
            </Magnet>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-muted-foreground/40"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">
            اكتشف المزيد
          </span>
          <div className="w-px h-12 bg-linear-to-b from-muted-foreground/40 to-transparent" />
        </motion.div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="relative py-32 px-6 max-w-5xl mx-auto">
        <GradualBlur preset="top" strength={3} />

        <SplitText
          text="مين إحنا؟"
          className="text-right mb-12 text-sukuk-green text-5xl font-heading font-bold"
          splitType="words"
          textAlign="right"
        />

        <ScrollReveal containerClassName="text-right">
          فكة هي أول منصة مصرية بتهدف لتبسيط الاستثمار لكل الناس. إحنا بنؤمن إن
          القرش الأبيض بينفع في اليوم الأسود، وعشان كدة صممنا نظام بيحول فكة
          مشترياتك اليومية لاستثمارات ذكية بتنمو معاك كل يوم. هدفنا هو بناء جيل
          واعي مالياً ومستقر اقتصادياً بأبسط الطرق الممكنة.
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-24 items-center">
          <div className="space-y-6 text-right">
            <h3 className="text-3xl font-heading font-bold text-foreground">
              رؤيتنا للمستقبل
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              بنطمح نكون الشريك المالي الأول لكل شاب في الوطن العربي، ونوفر حلول
              استثمارية متوافقة مع الشريعة الإسلامية بتكنولوجيا عالمية.
            </p>
          </div>
          <div className="relative aspect-video rounded-3xl bg-sukuk-green/5 border border-sukuk-green/10 overflow-hidden shadow-2xl">
            <Image
              src="/images/vision_growth_egypt_1777641049012.png"
              alt="Vision Growth Egypt"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* 3. FEATURES */}
      <section className="relative py-32 bg-white/30 backdrop-blur-sm border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <SplitText
            text="ليه تختار فكة؟"
            className="text-center mb-20 text-4xl md:text-5xl font-heading font-bold"
            splitType="words"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass p-8 rounded-3xl border border-border/50 hover:border-sukuk-green/30 transition-colors"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6`}
                >
                  <f.icon size={28} />
                </div>
                <h4 className="text-xl font-heading font-bold mb-4">
                  {f.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="relative py-32 px-6 max-w-5xl mx-auto">
        <SplitText
          text="إزاي تبدأ؟"
          className="text-center mb-24 text-4xl md:text-5xl font-heading font-bold"
          splitType="words"
        />

        <div className="space-y-32 relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 right-[27px] md:right-1/2 w-0.5 bg-sukuk-green/10 -z-10" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="flex-1 w-full">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-border/50">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="w-14 h-14 rounded-full bg-sukuk-green text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-sukuk-green/30 z-10 shrink-0">
                {s.number}
              </div>

              <div className="flex-1 text-right w-full">
                <h4 className="text-3xl font-heading font-bold mb-4">
                  {s.title}
                </h4>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="relative py-40 px-6 overflow-hidden">
        <GradualBlur preset="bottom" strength={5} />

        <div className="max-w-4xl mx-auto">
          <BorderGlow
            borderRadius={40}
            glowRadius={50}
            glowIntensity={1.2}
            // backgroundColor="transparent"
            className="w-full"
          >
            <PixelCard
              variant="green"
              className="w-full py-10 px-4 md:px-8 text-center border-none rounded-[40px]"
            >
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-2xl mb-10 rotate-3 hover:rotate-0 transition-transform"
                >
                  <Wallet className="text-sukuk-green" size={40} />
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 text-foreground">
                  جاهز تبني ثروتك؟
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-xl mx-auto leading-relaxed">
                  انضم لآلاف المصريين اللي بدأوا رحلة الاستثمار الذكي مع فكة.
                </p>

                <Magnet padding={50} magnetStrength={5}>
                  <motion.button
                    onClick={() => router.push("/dashboard")}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-20 py-6 cursor-pointer bg-sukuk-green text-white rounded-3xl font-heading font-bold text-3xl shadow-2xl shadow-sukuk-green/40 hover:shadow-sukuk-green/60 transition-all"
                  >
                    سجل الآن مجاناً
                  </motion.button>
                </Magnet>
              </div>
            </PixelCard>
          </BorderGlow>
        </div>
      </section>

      <footer className="py-12 border-t border-border/50 text-center text-muted-foreground text-sm">
        <p>© 2026 فكة. جميع الحقوق محفوظة. مرخص من هيئة الرقابة المالية.</p>
      </footer>
    </div>
  );
}
