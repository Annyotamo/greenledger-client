"use client";

import { useQuery } from "@tanstack/react-query";
import {
    fetchAuditTrails,
    fetchAuditLogs,
    fetchSingleAuditTrail,
    fetchSingleAuditLog,
} from "./api";
import type { AuditQueryParams } from "./types";

export const AUDIT_KEYS = {
    allTrails: ["audit", "trails"] as const,
    trails: (params: AuditQueryParams) => ["audit", "trails", params] as const,
    trailDetail: (id: string) => ["audit", "trails", "detail", id] as const,
    allLogs: ["audit", "logs"] as const,
    logs: (params: AuditQueryParams) => ["audit", "logs", params] as const,
    logDetail: (id: string) => ["audit", "logs", "detail", id] as const,
};

export function useAuditTrails(params: AuditQueryParams = {}) {
    return useQuery({
        queryKey: AUDIT_KEYS.trails(params),
        queryFn: () => fetchAuditTrails(params),
        staleTime: 30_000,
    });
}

export function useAuditLogs(params: AuditQueryParams = {}) {
    return useQuery({
        queryKey: AUDIT_KEYS.logs(params),
        queryFn: () => fetchAuditLogs(params),
        staleTime: 30_000,
    });
}

export function useSingleAuditTrail(auditId?: string | null) {
    return useQuery({
        queryKey: AUDIT_KEYS.trailDetail(auditId || ""),
        queryFn: () => fetchSingleAuditTrail(auditId!),
        enabled: Boolean(auditId),
        staleTime: 60_000,
    });
}

export function useSingleAuditLog(auditId?: string | null) {
    return useQuery({
        queryKey: AUDIT_KEYS.logDetail(auditId || ""),
        queryFn: () => fetchSingleAuditLog(auditId!),
        enabled: Boolean(auditId),
        staleTime: 60_000,
    });
}
