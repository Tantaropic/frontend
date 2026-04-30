"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlassCard } from "@/components/ui/GlassCard";

export function ZakatInfoSection() {
  return (
    <GlassCard className="p-6 mt-6 mb-8">
      <h3 className="font-heading font-semibold text-lg mb-4 text-foreground">
        معلومات تهمك عن الزكاة
      </h3>
      <Accordion className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-start">ما هو النصاب؟</AccordionTrigger>
          <AccordionContent>
            النصاب هو القدر الذي إذا بلغه المال وجبت فيه الزكاة، ويُقدر بما يعادل 85 جراماً من الذهب الخالص. يتم تحديث قيمة النصاب باستمرار بناءً على سعر الذهب الحالي.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-start">متى تجب الزكاة في الاستثمارات؟</AccordionTrigger>
          <AccordionContent>
            تجب الزكاة في الاستثمارات بعد مرور حول (سنة هجرية كاملة) على بلوغ المال للنصاب، وتُحسب بنسبة 2.5% من إجمالي قيمة الأصول. بعض الاستثمارات عالية المخاطر التي لم يمر عليها حول كامل لا تدخل في حساب الزكاة الحالي.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-start">كيف يتم حساب زكاة صناديق المؤشرات؟</AccordionTrigger>
          <AccordionContent>
            تُعامل صناديق المؤشرات معاملة عروض التجارة، وتجب الزكاة في قيمتها السوقية (رأس المال + الأرباح) بنسبة 2.5% إذا مضى عليها حول وكانت تبلغ النصاب بمفردها أو بضمها لباقي الأموال.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </GlassCard>
  );
}
