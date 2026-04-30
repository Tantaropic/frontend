"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Goal } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface CreateGoalModalProps {
  onAddGoal: (goal: Goal) => void;
}

export function CreateGoalModal({ onAddGoal }: CreateGoalModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !targetDate) return;

    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      title,
      emoji: "🎯", // Default emoji
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      targetDate,
      monthlyRoundup: 300, // Mock initial estimation
      color: "#2d7a4f",
    };

    onAddGoal(newGoal);
    setOpen(false);

    // Reset form
    setTitle("");
    setTargetAmount("");
    setTargetDate("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-sukuk-gold hover:bg-sukuk-gold/90 text-white gap-2 shadow-md" />
        }
      >
        <Plus className="w-4 h-4" />
        إضافة هدف
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            إضافة هدف جديد
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
            <Label htmlFor="amount">المبلغ المستهدف (جنيه)</Label>
            <Input
              id="amount"
              type="number"
              min="1000"
              placeholder="10000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">التاريخ المستهدف</Label>
            <Input
              id="date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="pt-4 sm:justify-start">
            <Button
              type="submit"
              className="w-full bg-sukuk-green hover:bg-sukuk-green-light"
            >
              حفظ الهدف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
