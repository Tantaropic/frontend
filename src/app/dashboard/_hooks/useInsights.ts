"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/types";
import { api } from "@/lib/api/sdk";
import type { AiInsightDto } from "@/lib/api/mappers";
import type { AIInsight } from "@/types";

function mapInsight(dto: AiInsightDto): AIInsight {
  const message = dto.body ?? dto.message ?? "";
  const triggerTag = dto.triggerTag ?? "";
  const isMilestone = triggerTag.startsWith("milestone_");
  const firstBreak = message.search(/[.!?\n؟]/);
  const title =
    dto.title ??
    (isMilestone
      ? "إنجاز جديد في المحفظة"
      : firstBreak > 0
        ? message.slice(0, firstBreak + 1).trim()
        : "رؤية ذكية");
  const body =
    firstBreak > 0 && firstBreak + 1 < message.length
      ? message.slice(firstBreak + 1).trim()
      : message;
  const milestoneAmount = isMilestone
    ? triggerTag.replace("milestone_", "")
    : null;

  return {
    id: dto.id,
    type: isMilestone ? "milestone" : ((dto.type as AIInsight["type"]) ?? "nudge"),
    icon: isMilestone ? "🏆" : "💡",
    title,
    body,
    highlight: dto.highlight ?? (milestoneAmount ? `${milestoneAmount} جنيه` : undefined),
    timestamp: dto.createdAt,
  };
}

interface State {
  data: AIInsight[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches AI insights for the user. SSE drives toast notifications;
 * this hook is purely the data source for the cards strip.
 */
export function useInsights(userId: string | undefined) {
  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!userId) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const dtos = await api.insights.forUser(userId);
      const next = dtos.map(mapInsight);
      setState({ data: next, loading: false, error: null });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "تعذّر تحميل الرؤى";
      setState({ data: [], loading: false, error: msg });
    }
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch();
  }, [refetch]);

  return { ...state, refetch };
}
