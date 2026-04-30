"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressBarProps {
  /** 0–100 */
  value: number;
  /** Framer Motion delay before fill animation starts */
  delay?: number;
  className?: string;
  barClassName?: string;
  /** Show percentage label at the end of the bar */
  showLabel?: boolean;
  /** Custom color override (Tailwind class or inline style) */
  color?: string;
}

/**
 * Animated progress bar that fills from 0 to `value` (0–100).
 * Uses Framer Motion scaleX animation from the start edge (RTL-aware).
 */
export function AnimatedProgressBar({
  value,
  delay = 0.4,
  className,
  barClassName,
  showLabel = true,
  color,
}: AnimatedProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("relative w-full", className)}>
      {/* Track */}
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        {/* Fill */}
        <motion.div
          className={cn(
            "h-full rounded-full origin-right",
            !color && "bg-linear-to-l from-sukuk-green to-sukuk-green-light",
            barClassName
          )}
          style={color ? { background: color } : undefined}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: clamped / 100 }}
          transition={{
            duration: 1.2,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <motion.span
          className="absolute -top-5 inset-e-0 text-xs font-medium text-sukuk-green tabular-nums"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.6, duration: 0.3 }}
        >
          {clamped}%
        </motion.span>
      )}
    </div>
  );
}
