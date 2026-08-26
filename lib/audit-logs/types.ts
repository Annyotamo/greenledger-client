/**
 * GreenLedger Tenant Audit System Types
 * Aligned with backend endpoints:
 * - GET /api/v1/tenant/audit/trails (Timeline View)
 * - GET /api/v1/tenant/audit/logs (Forensic Diff & Ingestion View)
 */

export type AuditCategory =
    | "auth"
    | "data_action"
    | "system_event"
    | "compliance"
    | "security"
    | string;

export type AuditStatus = "success" | "failure" | "partial" | "pending";
export type AuditSeverity = "info" | "warning" | "critical";
export type AuditActorType = "user" | "system" | "admin" | string;

export interface AuditTrailItem {
    id: string;
    tenant_id: string;
    category: AuditCategory;
    event_type: string;
    module: string;
    actor_type: AuditActorType;
    actor_email: string;
    actor_user_id: string;
    resource_type: string | null;
    resource_id: string | null;
    resource_identifier: string | null;
    status: AuditStatus;
    severity: AuditSeverity;
    description: string;
    reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface FieldChange {
    old: any;
    new: any;
}

export interface AuditLogItem extends AuditTrailItem {
    old_values?: Record<string, any> | null;
    new_values?: Record<string, any> | null;
    changes?: Record<string, FieldChange> | null;
    metadata_json?: Record<string, any> | null;
    error_code?: string | null;
    error_message?: string | null;
}

export interface AuditPaginationMeta {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface AuditTrailsResponse {
    success: boolean;
    message: string;
    data: {
        items: AuditTrailItem[];
        total: number;
        page: number;
        page_size: number;
        total_pages: number;
    };
}

export interface AuditLogsResponse {
    success: boolean;
    message: string;
    data: {
        items: AuditLogItem[];
        total: number;
        page: number;
        page_size: number;
        total_pages: number;
    };
}

export interface AuditSingleTrailResponse {
    success: boolean;
    message: string;
    data: AuditTrailItem;
}

export interface AuditSingleLogResponse {
    success: boolean;
    message: string;
    data: AuditLogItem;
}

export interface AuditQueryParams {
    module?: string;
    category?: string;
    event_type?: string;
    has_changes?: boolean;
    error_code?: string;
    actor_email?: string;
    actor_user_id?: string;
    actor_type?: string;
    resource_type?: string;
    resource_id?: string;
    status?: string;
    severity?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: "desc" | "asc";
}

// Backward-compatibility aliases for legacy imports
export type AuditLog = AuditLogItem;
export type AuditLogFilters = AuditQueryParams;
