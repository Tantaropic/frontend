"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/types";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic hook for any SDK call.
 *
 * @example
 *   const { data, loading, error, refetch } = useApi(() => api.mockExchange.prices());
 *
 * Pass `enabled = false` to defer fetching (e.g. while waiting for an id).
 * Pass `pollMs` to auto-refetch on an interval (e.g. live prices).
 */
export function useApi<T>(
  query: () => Promise<T>,
  deps: React.DependencyList = [],
  enabled = true,
  pollMs?: number,
) {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: false,
    error: null,
  });
  const queryRef = useRef(query);
  const depsKey = deps.map((dep) => String(dep)).join("\u001f");

  useEffect(() => {
    queryRef.current = query;
  });

  const run = useCallback(async () => {
    if (!enabled) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await queryRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "تعذّر تنفيذ الطلب";
      setState({ data: null, loading: false, error: message });
    }
  }, [enabled]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void run();
    });

    if (!pollMs || !enabled) {
      return () => {
        cancelled = true;
      };
    }

    const id = setInterval(() => {
      void run();
    }, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [run, pollMs, enabled, depsKey]);

  return { ...state, refetch: run };
}
