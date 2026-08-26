import { privateApi } from "@/lib/http/client";
import type {
    AuditQueryParams,
    AuditTrailsResponse,
    AuditLogsResponse,
    AuditSingleTrailResponse,
    AuditSingleLogResponse,
    AuditTrailItem,
    AuditLogItem,
} from "./types";

/**
 * Filter out undefined / empty string params
 */
function cleanParams(params: AuditQueryParams): Record<string, any> {
    const cleaned: Record<string, any> = {};
    Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
            cleaned[key] = val;
        }
    });
    return cleaned;
}

/**
 * GET /api/v1/tenant/audit/trails
 * Lightweight timeline & activity feeds (who did what, when, and where).
 */
export async function fetchAuditTrails(params: AuditQueryParams = {}) {
    const cleaned = cleanParams(params);
    const response = await privateApi.get<AuditTrailsResponse>("/tenant/audit/trails", {
        params: cleaned,
    });

    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch audit trails");
    }

    return response.data.data;
}

/**
 * GET /api/v1/tenant/audit/logs
 * Deep forensic logs with before/after state diffs, ingested values & metadata.
 */
export async function fetchAuditLogs(params: AuditQueryParams = {}) {
    const cleaned = cleanParams(params);
    const response = await privateApi.get<AuditLogsResponse>("/tenant/audit/logs", {
        params: cleaned,
    });

    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch forensic audit logs");
    }

    return response.data.data;
}

/**
 * GET /api/v1/tenant/audit/trails/{audit_id}
 * Single lightweight audit event timeline item.
 */
export async function fetchSingleAuditTrail(auditId: string): Promise<AuditTrailItem> {
    const response = await privateApi.get<AuditSingleTrailResponse>(`/tenant/audit/trails/${auditId}`);
    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch audit trail detail");
    }
    return response.data.data;
}

/**
 * GET /api/v1/tenant/audit/logs/{audit_id}
 * Single forensic diff log entry with full metadata.
 */
export async function fetchSingleAuditLog(auditId: string): Promise<AuditLogItem> {
    const response = await privateApi.get<AuditSingleLogResponse>(`/tenant/audit/logs/${auditId}`);
    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch forensic audit log detail");
    }
    return response.data.data;
}
