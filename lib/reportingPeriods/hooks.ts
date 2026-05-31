"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReportingPeriod, getReportingPeriods } from "./api";
import type { CreateReportingPeriodPayload, ReportingPeriod } from "./types";

export function useReportingPeriods() {
    return useQuery<ReportingPeriod[], Error>({
        queryKey: ["reporting-periods"],
        queryFn: getReportingPeriods,
    });
}

export function useCreateReportingPeriod() {
    const queryClient = useQueryClient();

    return useMutation<ReportingPeriod, Error, CreateReportingPeriodPayload>({
        mutationFn: createReportingPeriod,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reporting-periods"] }),
    });
}
