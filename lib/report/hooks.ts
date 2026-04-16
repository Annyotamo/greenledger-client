"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getScope1Reports, ingestScope1Emission } from "@/lib/report/api";
import type { Scope1IngestRequest } from "@/types/report";

export function useScope1ReportsQuery() {
    return useQuery({
        queryKey: ["reports", "scope1"],
        queryFn: getScope1Reports,
        staleTime: 60_000,
    });
}

export function useIngestScope1EmissionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Scope1IngestRequest) => ingestScope1Emission(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports", "scope1"] });
        },
    });
}
