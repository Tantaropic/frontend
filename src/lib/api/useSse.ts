"use client";

import { useEffect, useRef } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
// Strip the /api/v1 prefix because backend SSE routes are mounted under /api/v1 too.
const SSE_ORIGIN = BASE_URL.replace(/\/api\/v1\/?$/, "");

export interface SseMessage {
  channel: "transactions" | "wallet" | "ai-insights" | "prices";
  type: string;
  userId?: string;
  data?: unknown;
  ts: string;
}

/**
 * Subscribes to the backend SSE stream for the given user.
 * Calls `onMessage` for every event (excluding pings/heartbeats).
 *
 * Reconnects automatically on transient errors via the browser's
 * built-in EventSource retry behavior.
 */
export function useSse(
  userId: string | undefined,
  onMessage: (msg: SseMessage) => void,
) {
  // Keep the latest callback in a ref so we don't tear down the connection
  // every time the parent re-renders.
  const handlerRef = useRef(onMessage);
  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!userId || !BASE_URL) return;

    const url = `${SSE_ORIGIN}/api/v1/sse/stream?userId=${encodeURIComponent(userId)}`;
    const es = new EventSource(url);

    const handle = (ev: MessageEvent) => {
      try {
        const parsed = JSON.parse(ev.data) as SseMessage;
        if (process.env.NODE_ENV !== "production") {
          console.log("[SSE]", parsed.channel, parsed.type);
        }
        handlerRef.current(parsed);
      } catch {
        // ignore non-JSON heartbeat frames
      }
    };

    es.addEventListener("message", handle);
    es.addEventListener("error", (e) => {
      // Browser will auto-reconnect for transient errors. Log only in dev.
      if (process.env.NODE_ENV !== "production") {
        console.warn("[SSE] error", e);
      }
    });
    if (process.env.NODE_ENV !== "production") {
      console.log("[SSE] connected to", url);
    }

    return () => {
      es.removeEventListener("message", handle);
      es.close();
    };
  }, [userId]);
}
