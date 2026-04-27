"use client";

/**
 * Islamic geometric pattern — CSS background, 3.5% opacity.
 * Used as a decorative overlay on hero sections and page backgrounds.
 */
export function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`geometric-pattern ${className}`}
    />
  );
}
