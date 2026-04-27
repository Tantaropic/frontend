"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  /** Delay before entrance animation (seconds) */
  delay?: number;
  /** If false, disables hover lift effect */
  hoverable?: boolean;
}

/**
 * Base animated card with Framer Motion entrance + hover lift.
 * Wraps any content. Use `glass` or `glass-strong` className for glassmorphism.
 */
export function AnimatedCard({
  children,
  className,
  delay = 0,
  hoverable = true,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        hoverable
          ? {
              y: -4,
              boxShadow:
                "0 12px 40px oklch(0.48 0.14 152 / 15%), 0 4px 12px oklch(0 0 0 / 8%)",
              transition: { duration: 0.25, ease: "easeOut" },
            }
          : undefined
      }
      className={cn(
        "rounded-2xl bg-white border border-border p-5",
        "shadow-sm transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
