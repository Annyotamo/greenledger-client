"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveEmissionSources } from "./api";

export function useEmissionSources() {
    return useQuery({
        queryKey: ["emissionSources"],
        queryFn: getActiveEmissionSources,
    });
}
