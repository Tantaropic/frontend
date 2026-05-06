"use client";

import { AppShell } from "@/components/layout/AppShell";
import { motion } from "framer-motion";
import { Bell, CalendarClock, Target } from "lucide-react";

export default function GoalsPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pt-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[68vh] flex items-center justify-center"
        >
          <div className="w-full rounded-3xl border border-border bg-white/75 p-8 md:p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sukuk-green-muted text-sukuk-green">
              <Target size={30} />
            </div>
            <p className="text-xs font-semibold text-sukuk-green mb-2">
              قريبًا
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              أهداف الادخار الذكية
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              صفحة الأهداف قيد التجهيز. هنربطها بالمحفظة، الفكة، والتنبيهات الذكية لما تكون جاهزة.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/70 p-4 text-start">
                <CalendarClock className="mb-3 h-5 w-5 text-sukuk-green" />
                <h2 className="font-heading font-semibold text-foreground">
                  خطط زمنية
                </h2>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  تقدير موعد الوصول لكل هدف حسب الفكة والاستثمار الشهري.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4 text-start">
                <Bell className="mb-3 h-5 w-5 text-sukuk-green" />
                <h2 className="font-heading font-semibold text-foreground">
                  تنبيهات الإنجاز
                </h2>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  إشعارات عند الاقتراب من الهدف أو تجاوز مرحلة جديدة.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </AppShell>
  );
}
