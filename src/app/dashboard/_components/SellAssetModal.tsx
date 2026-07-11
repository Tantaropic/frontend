"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatEGP } from "@/lib/utils";
import { egpToPiastersString } from "@/lib/money";
import type { AssetClass } from "@/lib/api/enums";

const ASSET_UNIT_PRECISION = 100_000_000;
const SELL_REVENUE_FEE_RATE = 0.015;

export interface SellAssetOption {
  assetId: string;
  assetClass: AssetClass;
  name: string;
  color: string;
  units: number;
  totalUnits: string;
  maxAmountEgp: number;
  pricePerUnitEgp: number;
}

interface SellAssetModalProps {
  open: boolean;
  option: SellAssetOption | null;
  busy?: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    assetClass: AssetClass;
    amount?: string;
    units?: string;
  }) => void | Promise<void>;
}

type SellMode = "amount" | "units";

function formatUnits(value: number) {
  return value.toLocaleString("ar-EG", {
    maximumFractionDigits: 8,
    minimumFractionDigits: 0,
  });
}

function unitsToInternal(value: number) {
  return Math.round(value * ASSET_UNIT_PRECISION).toString();
}

export function SellAssetModal({
  open,
  option,
  busy = false,
  onClose,
  onConfirm,
}: SellAssetModalProps) {
  return (
    <AnimatePresence>
      {open && option && (
        <SellAssetPanel
          key={option.assetId}
          option={option}
          busy={busy}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      )}
    </AnimatePresence>
  );
}

function SellAssetPanel({
  option,
  busy,
  onClose,
  onConfirm,
}: {
  option: SellAssetOption;
  busy: boolean;
  onClose: () => void;
  onConfirm: SellAssetModalProps["onConfirm"];
}) {
  const [mode, setMode] = useState<SellMode>("amount");
  const [value, setValue] = useState("");

  const numericValue = Number(value);
  const estimated = useMemo(() => {
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return { amount: 0, fee: 0, netAmount: 0, units: 0 };
    }

    const amount =
      mode === "amount"
        ? numericValue
        : numericValue * option.pricePerUnitEgp;
    const fee = amount * SELL_REVENUE_FEE_RATE;

    if (mode === "amount") {
      return {
        amount,
        fee,
        netAmount: Math.max(0, amount - fee),
        units:
          option.pricePerUnitEgp > 0
            ? numericValue / option.pricePerUnitEgp
            : 0,
      };
    }

    return {
      amount,
      fee,
      netAmount: Math.max(0, amount - fee),
      units: numericValue,
    };
  }, [mode, numericValue, option]);

  const isValid =
    Number.isFinite(numericValue) &&
    numericValue > 0 &&
    (mode === "amount"
      ? numericValue <= option.maxAmountEgp + 0.01
      : numericValue <= option.units + 0.00000001);

  const handleSubmit = async () => {
    if (!isValid || busy) return;
    await onConfirm({
      assetClass: option.assetClass,
      ...(mode === "amount"
        ? { amount: egpToPiastersString(numericValue) }
        : { units: unitsToInternal(numericValue) }),
    });
  };

  const handleMax = () => {
    setValue(
      mode === "amount"
        ? option.maxAmountEgp.toFixed(2)
        : option.units.toFixed(8).replace(/0+$/, "").replace(/\.$/, ""),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
      >
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 pe-6">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  بيع {option.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  متاح {formatUnits(option.units)} وحدة، بقيمة {formatEGP(option.maxAmountEgp)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("amount");
                  setValue("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  mode === "amount"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                مبلغ
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("units");
                  setValue("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  mode === "units"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                وحدات
              </button>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="sell-value" className="text-sm font-medium">
                  {mode === "amount" ? "المبلغ بالجنيه" : "عدد الوحدات"}
                </Label>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-xs font-semibold text-sukuk-green hover:underline"
                >
                  الحد الأقصى
                </button>
              </div>
              <Input
                id="sell-value"
                type="number"
                min={0}
                max={mode === "amount" ? option.maxAmountEgp : option.units}
                step={mode === "amount" ? "0.01" : "0.00000001"}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void handleSubmit();
                }}
                autoFocus
                className="h-12 rounded-xl text-right"
              />
            </div>

            <div className="mt-4 rounded-xl border border-border bg-muted/35 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">إجمالي البيع</span>
                <span className="font-semibold text-foreground">
                  {formatEGP(estimated.amount)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-muted-foreground">رسوم البيع 1.5%</span>
                <span className="font-semibold text-amber-700">
                  −{formatEGP(estimated.fee)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-muted-foreground">الصافي للرصيد</span>
                <span className="font-semibold text-sukuk-green">
                  {formatEGP(estimated.netAmount)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-muted-foreground">الوحدات المباعة</span>
                <span className="font-semibold text-foreground">
                  {formatUnits(estimated.units)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={busy}
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isValid || busy}
                className="flex-1 bg-sukuk-green text-white hover:bg-sukuk-green-light"
              >
                {busy ? "جاري البيع..." : "تأكيد البيع"}
              </Button>
            </div>
      </motion.div>
    </motion.div>
  );
}