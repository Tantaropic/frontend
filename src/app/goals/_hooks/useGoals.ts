"use client";

import { useMemo } from "react";
import { api } from "@/lib/api/sdk";
import { useApi } from "@/lib/api/useApi";
import { mapGoals } from "@/lib/api/mappers";

export function useGoals(userId: string | undefined) {
  const result = useApi(
    () => api.goals.list(userId as string),
    [userId],
    Boolean(userId),
  );

  const goals = useMemo(
    () => (result.data ? mapGoals(result.data) : []),
    [result.data],
  );

  return { ...result, goals };
}
