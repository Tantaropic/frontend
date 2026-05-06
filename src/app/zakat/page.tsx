"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ZakatSummaryCard } from "./components/ZakatSummaryCard";
import { AssetEligibilityTable } from "./components/AssetEligibilityTable";
import { DonateButton } from "./components/DonateButton";
import { ZakatInfoSection } from "./components/ZakatInfoSection";
import { useIdentity } from "@/components/providers/IdentityProvider";
import { useDashboard } from "@/app/dashboard/_hooks/useDashboard";
import { useZakat } from "./_hooks/useZakat";

export default function ZakatPage() {
  const { identity } = useIdentity();
  const { data, loading, error } = useDashboard(identity?.userId);
  const summary = useZakat(data);

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
          {loading && (
            <p className="text-xs text-muted-foreground mt-2">
              جاري التحميل...
            </p>
          )}
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          {!summary.isAboveNisab && (
            <p className="text-xs text-amber-600 mt-2">
              محفظتك لسه تحت النصاب — لا تجب عليك الزكاة حالياً.
            </p>
          )}
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
