"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenantProfile } from "./api";
import type { TenantProfile } from "./types";

export function useTenantProfile() {
    return useQuery<TenantProfile, Error>({
        queryKey: ["tenant-profile"],
        queryFn: getTenantProfile,
    });
}
