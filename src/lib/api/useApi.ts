"use client";

import { useCallback, useEffect, useState } from "react";
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

  const run = useCallback(async () => {
    if (!enabled) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await query();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "تعذّر تنفيذ الطلب";
      setState({ data: null, loading: false, error: message });
    }
    // query is intentionally re-derived from deps by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  useEffect(() => {
    void run();
    if (!pollMs || !enabled) return;
    const id = setInterval(() => {
      void run();
    }, pollMs);
    return () => clearInterval(id);
  }, [run, pollMs, enabled]);

  return { ...state, refetch: run };
}
