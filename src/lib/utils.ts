import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format EGP currency in Arabic locale */
export function formatEGP(amount: number, compact = false): string {
  if (compact && amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K جنيه`;
  }
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format percentage */
export function formatPercent(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return "0%";
  return `${value > 0 ? "+" : ""}${value.toFixed(fractionDigits)}%`;
}

/** Round up to nearest multiplier */
export function roundUp(amount: number, multiplier: 1 | 5 | 10): number {
  return Math.ceil(amount / multiplier) * multiplier;
}

/** Calculate spare change from a purchase */
export function calcRoundup(amount: number, multiplier: 1 | 5 | 10): number {
  const rounded = roundUp(amount, multiplier);
  return rounded - amount;
}

/** Format relative date in Arabic */
export function formatDateAr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-EG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Calculate days remaining to a target date */
export function daysUntil(targetDate: Date | string): number {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** Calculate goal progress percentage */
export function goalProgress(current: number, target: number): number {
  return Math.min(100, Math.round((current / target) * 100));
}
