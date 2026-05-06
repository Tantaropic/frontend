"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmountModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  defaultValue?: number;
  busy?: boolean;
  onConfirm: (amount: number) => void | Promise<void>;
  onClose: () => void;
}

export function AmountModal({
  open,
  title,
  description,
  confirmLabel,
  defaultValue = 100,
  busy = false,
  onConfirm,
  onClose,
}: AmountModalProps) {
  const [value, setValue] = useState<string>(String(defaultValue));

  useEffect(() => {
    if (open) setValue(String(defaultValue));
  }, [open, defaultValue]);

  const amount = Number(value);
  const isValid = Number.isFinite(amount) && amount > 0;

  const handleSubmit = async () => {
    if (!isValid || busy) return;
    await onConfirm(amount);
  };

  return (
    <AnimatePresence>
      {open && (
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
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-background rounded-2xl border border-border shadow-2xl p-6 relative"
          >
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute top-3 left-3 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>

            <h2 className="font-heading font-bold text-lg text-foreground mb-1">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-muted-foreground mb-4">{description}</p>
            )}

            <div className="space-y-2 mb-6">
              <Label htmlFor="amount" className="text-sm font-medium">
                المبلغ بالجنيه
              </Label>
              <Input
                id="amount"
                type="number"
                min={1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSubmit();
                }}
                autoFocus
                className="text-right h-12 rounded-xl"
              />
            </div>

            <div className="flex gap-2">
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
                className="flex-1 bg-sukuk-green hover:bg-sukuk-green-light text-white"
              >
                {busy ? "جاري التنفيذ..." : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
