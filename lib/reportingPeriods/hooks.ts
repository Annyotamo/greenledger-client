"use client";

import { useQuery } from "@tanstack/react-query";
import { getReportingPeriods } from "./api";

export function useReportingPeriods() {
    return useQuery({
        queryKey: ["reportingPeriods"],
        queryFn: getReportingPeriods,
    });
}
