"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/types";
import { api } from "@/lib/api/sdk";
import { mapDashboard, type DashboardVm } from "@/lib/api/mappers";

interface State {
  data: DashboardVm | null;
  loading: boolean;
  error: string | null;
}

export function useDashboard(userId: string | undefined) {
  const [state, setState] = useState<State>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchOnce = useCallback(async () => {
    if (!userId) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const dto = await api.users.dashboard(userId, 100);
      setState({ data: mapDashboard(dto), loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "تعذّر تحميل البيانات";
      setState({ data: null, loading: false, error: message });
    }
  }, [userId]);

  useEffect(() => {
    // Initial fetch on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchOnce();

    // Polling fallback in case SSE drops a message. 15s keeps re-renders low
    // — SSE handles the immediate updates anyway.
    if (!userId) return;
    const id = setInterval(() => {
      void fetchOnce();
    }, 15_000);
    return () => clearInterval(id);
  }, [fetchOnce, userId]);

  return { ...state, refetch: fetchOnce };
}
