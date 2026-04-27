"use client";

import { useGsapCounter } from "@/hooks/useGsapCounter";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Microcopy displayed below the number */
  label?: string;
  labelClassName?: string;
}

/**
 * GSAP-powered counter that animates from 0 to `value`.
 * Numbers are formatted in Arabic locale (ar-EG).
 */
export function AnimatedCounter({
  value,
  duration = 1.8,
  delay = 0.3,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  label,
  labelClassName,
}: AnimatedCounterProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useGsapCounter({ target: value, duration, delay, decimals, prefix, suffix }) as any;

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span
        ref={ref}
        className={cn(
          "font-heading tabular-nums leading-none",
          className
        )}
      >
        {prefix}0{suffix}
      </span>
      {label && (
        <span className={cn("text-xs text-muted-foreground", labelClassName)}>
          {label}
        </span>
      )}
    </div>
  );
}
