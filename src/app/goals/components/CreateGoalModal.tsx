"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CreateGoalFormInput {
  title: string;
  emoji: string;
  targetAmountEgp: number;
  targetDate?: string | null;
  monthlyRoundupEgp?: number;
  color: string;
}

interface CreateGoalModalProps {
  onCreate: (goal: CreateGoalFormInput) => Promise<void> | void;
  busy?: boolean;
  disabled?: boolean;
}

const EMOJI_OPTIONS = ["🎯", "🕋", "🚗", "🏠", "🛡️", "✈️"];
const COLOR_OPTIONS = ["#2d7a4f", "#d4a017", "#3b82f6", "#8b5cf6"];

export function CreateGoalModal({
  onCreate,
  busy = false,
  disabled = false,
}: CreateGoalModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [monthlyRoundup, setMonthlyRoundup] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTitle("");
    setTargetAmount("");
    setTargetDate("");
    setMonthlyRoundup("");
    setEmoji(EMOJI_OPTIONS[0]);
    setColor(COLOR_OPTIONS[0]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmountEgp = Number(targetAmount);
    const monthlyRoundupEgp = monthlyRoundup ? Number(monthlyRoundup) : 0;

    if (title.trim().length < 2) {
      setError("اكتب اسم هدف واضح");
      return;
    }
    if (!Number.isFinite(targetAmountEgp) || targetAmountEgp <= 0) {
      setError("المبلغ المستهدف لازم يكون أكبر من صفر");
      return;
    }
    if (!Number.isFinite(monthlyRoundupEgp) || monthlyRoundupEgp < 0) {
      setError("معدل آخر 30 يوم لازم يكون صفر أو أكثر");
      return;
    }

    try {
      await onCreate({
        title: title.trim(),
        emoji,
        targetAmountEgp,
        targetDate: targetDate || null,
        monthlyRoundupEgp,
        color,
      });
    } catch {
      return;
    }

    setOpen(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (busy) return;
        setOpen(nextOpen);
        if (!nextOpen) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button
            className="h-10 gap-2 bg-sukuk-green px-4 text-white shadow-sm hover:bg-sukuk-green-light"
            disabled={disabled}
          />
        }
      >
        <Plus className="w-4 h-4" />
        إضافة هدف
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            إضافة هدف جديد
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">اسم الهدف</Label>
            <Input
              id="title"
              placeholder="مثال: سيارة جديدة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>رمز الهدف</Label>
            <div className="grid grid-cols-6 gap-2" role="radiogroup">
              {EMOJI_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={emoji === option}
                  onClick={() => setEmoji(option)}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-xl border bg-background text-xl transition-colors",
                    emoji === option
                      ? "border-sukuk-green bg-sukuk-green-muted"
                      : "border-border hover:border-sukuk-green/35",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ المستهدف (جنيه)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="10000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyRoundup">معدل آخر 30 يوم (اختياري)</Label>
            <Input
              id="monthlyRoundup"
              type="number"
              min="0"
              step="0.01"
              placeholder="300"
              value={monthlyRoundup}
              onChange={(e) => setMonthlyRoundup(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">التاريخ المستهدف</Label>
            <Input
              id="date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>لون التقدم</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={`اختيار اللون ${option}`}
                  onClick={() => setColor(option)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
                  style={{ background: option }}
                >
                  {color === option && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <DialogFooter className="pt-4 sm:justify-start">
            <Button
              type="submit"
              disabled={busy}
              className="h-10 w-full bg-sukuk-green hover:bg-sukuk-green-light"
            >
              {busy ? "جاري الحفظ..." : "حفظ الهدف"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
