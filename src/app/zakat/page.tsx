"use client";

import { AppShell } from "@/components/layout/AppShell";
import { mockZakatData } from "@/data/zakat";
import { ZakatSummaryCard } from "./components/ZakatSummaryCard";
import { AssetEligibilityTable } from "./components/AssetEligibilityTable";
import { DonateButton } from "./components/DonateButton";
import { ZakatInfoSection } from "./components/ZakatInfoSection";

export default function ZakatPage() {
  // Usually this would be fetched via SWR or React Query
  const summary = mockZakatData;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            حاسبة الزكاة
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            نحسب لك زكاتك المستحقة على محفظتك الاستثمارية بشفافية تامة لتطهير أموالك.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ZakatSummaryCard summary={summary} />
            <DonateButton amount={summary.totalZakatOwed} />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <AssetEligibilityTable breakdown={summary.breakdown} />
            <ZakatInfoSection />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
