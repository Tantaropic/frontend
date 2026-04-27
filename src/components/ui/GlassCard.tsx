"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
}

/**
 * Glassmorphism card with backdrop-blur.
 * `strong` variant uses higher opacity + stronger blur for hero elements.
 */
export function GlassCard({ children, className, strong = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        strong ? "glass-strong" : "glass",
        className
      )}
    >
      {children}
    </div>
  );
}
