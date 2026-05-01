"use client";

import { AnimatePresence, motion } from "framer-motion";
import PixelBlast from "@/components/ui/PixelBlast";
import MagicRings from "@/components/ui/MagicRings";
import { useGlobalLoader } from "./GlobalLoaderContext";

export function GlobalLoader() {
  const { isLoading } = useGlobalLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-9999 bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Pixel Blast (Bottom Layer) */}
          <div className="absolute inset-0 w-full h-full z-0">
            <PixelBlast
              variant="circle"
              pixelSize={6}
              color="#059669" // emerald-600 to match the previous rings
              patternScale={5}
              patternDensity={1.5}
              pixelSizeJitter={0.5}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.6}
              edgeFade={0.25}
              transparent
            />
          </div>

          {/* Magic Rings (Middle Layer) */}
          <div className="absolute inset-0 w-full h-full opacity-60 z-10 pointer-events-none">
            <MagicRings
              color="#059669" // emerald-600
              colorTwo="#34d399" // emerald-400
              ringCount={6}
              speed={1.5}
              opacity={1}
              blur={2}
              noiseAmount={0.2}
              hoverScale={1.1}
            />
          </div>

          {/* Central Logo (Top Layer) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-20 w-24 h-24 rounded-3xl bg-sukuk-green flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 60px oklch(0.48 0.14 152 / 60%)" }}
          >
            <span className="text-white font-heading font-bold text-4xl">
              فكة
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
