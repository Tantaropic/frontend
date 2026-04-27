"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface UseGsapCounterOptions {
  target: number;
  duration?: number;   // seconds
  delay?: number;      // seconds
  decimals?: number;
  prefix?: string;
  suffix?: string;
  onUpdate?: (value: number) => void;
}

/**
 * GSAP-powered counter hook.
 * Returns a ref to attach to any element; its textContent will animate.
 */
export function useGsapCounter({
  target,
  duration = 1.8,
  delay = 0.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  onUpdate,
}: UseGsapCounterOptions) {
  const elementRef = useRef<HTMLElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const obj = { value: 0 };

    tweenRef.current = gsap.to(obj, {
      value: target,
      duration,
      delay,
      ease: "power2.out",
      onUpdate() {
        const formatted = obj.value.toFixed(decimals);
        el.textContent = `${prefix}${Number(formatted).toLocaleString("ar-EG")}${suffix}`;
        onUpdate?.(obj.value);
      },
      onComplete() {
        el.textContent = `${prefix}${target.toLocaleString("ar-EG")}${suffix}`;
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [target, duration, delay, decimals, prefix, suffix, onUpdate]);

  return elementRef;
}
