"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveEmissionSources } from "./api";

export function useEmissionSources(type?: string) {
    return useQuery({
        queryKey: ["emissionSources", type],
        queryFn: () => getActiveEmissionSources(type),
    });
}
