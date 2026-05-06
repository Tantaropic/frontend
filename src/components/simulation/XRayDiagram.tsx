"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Database,
  Brain,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useSimulation } from "./SimulationContext";

const NODES = [
  { id: "bank-api", label: "Bank API", x: 100, y: 100, icon: Server },
  { id: "webhook", label: "Webhook", x: 300, y: 100, icon: Radio },
  { id: "roundup-engine", label: "Round-Up", x: 500, y: 100, icon: Zap },
  { id: "fee-engine", label: "Fee Engine", x: 700, y: 100, icon: Database },
  {
    id: "ai-emotional-engine",
    label: "Achievements",
    x: 500,
    y: 250,
    icon: Brain,
  },
  {
    id: "asset-investment",
    label: "Investment",
    x: 900,
    y: 100,
    icon: ShieldCheck,
  },
];

const CONNECTIONS = [
  { from: "bank-api", to: "webhook" },
  { from: "webhook", to: "roundup-engine" },
  { from: "roundup-engine", to: "fee-engine" },
  { from: "fee-engine", to: "asset-investment" },
  { from: "roundup-engine", to: "ai-emotional-engine" },
];

export function XRayDiagram() {
  const { currentStepId, steps } = useSimulation();

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-black/40">
      <svg
        viewBox="0 0 1000 400"
        className="w-full max-w-5xl h-auto drop-shadow-2xl"
      >
        {/* Connections */}
        {CONNECTIONS.map((conn, i) => {
          const fromNode = NODES.find((n) => n.id === conn.from)!;
          const toNode = NODES.find((n) => n.id === conn.to)!;
          const isActive = currentStepId === conn.to;

          return (
            <g key={`conn-${i}`}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="oklch(0.48 0.14 152 / 20%)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {isActive && (
                <motion.circle
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  r="6"
                  fill="#059669"
                  style={{
                    offsetPath: `path('M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}')`,
                    boxShadow: "0 0 20px #059669",
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const step = steps.find((s) => s.id === node.id);
          const isActive = currentStepId === node.id;
          const isCompleted = step?.status === "completed";
          const Icon = node.icon;

          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={30}
                fill={
                  isActive
                    ? "#059669"
                    : isCompleted
                      ? "oklch(0.48 0.14 152 / 40%)"
                      : "#1f1f23"
                }
                stroke={isActive ? "#34d399" : "#3f3f46"}
                strokeWidth="2"
                animate={isActive ? { scale: [1, 1.16, 1] } : { scale: 1 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                transition={
                  isActive
                    ? { repeat: Infinity, duration: 1 }
                    : { duration: 0.2 }
                }
              />
              <foreignObject
                x={node.x - 15}
                y={node.y - 15}
                width="30"
                height="30"
              >
                <div className="flex items-center justify-center w-full h-full text-white">
                  <Icon size={18} />
                </div>
              </foreignObject>

              <text
                x={node.x}
                y={node.y + 45}
                textAnchor="middle"
                className="text-[12px] font-bold fill-white/80 uppercase tracking-tighter"
              >
                {node.label}
              </text>

              {/* Payload Tooltip */}
              <AnimatePresence>
                {isActive && step?.payload && (
                  <motion.g
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <foreignObject
                      x={node.x - 60}
                      y={node.y - 90}
                      width="150px"
                      height="100%"
                    >
                      <div className="bg-[#18181b] border border-white/20 rounded-lg p-2 shadow-xl font-mono text-[8px] text-sukuk-green-light overflow-hidden">
                        <div className="text-[7px] text-muted-foreground mb-1 uppercase tracking-widest text-center">
                          بيانات المعالجة
                        </div>
                        <pre className="text-left" dir="ltr">
                          {JSON.stringify(step.payload, null, 2)}
                        </pre>
                      </div>
                    </foreignObject>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}
      </svg>

      {/* Floating Description */}
      <AnimatePresence>
        {currentStepId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 w-[min(92vw,720px)] -translate-x-1/2 bg-neutral-900/90 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 text-center shadow-2xl"
          >
            <h4 className="text-sukuk-green font-bold uppercase tracking-widest text-xs mb-1">
              العملية الحالية
            </h4>
            <p className="text-white text-lg font-heading">
              {steps.find((s) => s.id === currentStepId)?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
