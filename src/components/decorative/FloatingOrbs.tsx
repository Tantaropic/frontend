"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 400, top: "-10%", right: "-5%", color: "oklch(0.48 0.14 152 / 22%)", delay: 0, duration: 9 },
  { size: 280, top: "40%", left: "-8%", color: "oklch(0.72 0.12 85 / 18%)", delay: 2, duration: 7 },
  { size: 200, top: "65%", right: "10%", color: "oklch(0.48 0.14 152 / 12%)", delay: 4, duration: 11 },
];

export function FloatingOrbs() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
          }}
          animate={{ y: [0, -24, 0], scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
