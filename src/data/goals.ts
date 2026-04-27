import type { Goal } from "@/types";

export const mockGoals: Goal[] = [
  {
    id: "goal_hajj",
    title: "صندوق الحج",
    emoji: "🕋",
    targetAmount: 80_000,
    currentAmount: 23_400,
    targetDate: "2028-03-01",
    monthlyRoundup: 320,
    color: "#2d7a4f",
  },
  {
    id: "goal_car",
    title: "سيارة جديدة",
    emoji: "🚗",
    targetAmount: 350_000,
    currentAmount: 47_800,
    targetDate: "2029-01-01",
    monthlyRoundup: 280,
    color: "#d4a017",
  },
  {
    id: "goal_emergency",
    title: "صندوق طوارئ",
    emoji: "🛡️",
    targetAmount: 30_000,
    currentAmount: 18_900,
    targetDate: "2026-12-31",
    monthlyRoundup: 450,
    color: "#3b82f6",
  },
];
