/**
 * Audit Log Types
 * Mapped from API response and domain models
 */

export type AuditCategory = "user_action" | "data_action" | "system_action" | "security_action";
export type AuditEventType =
    | "user_login_success"
    | "user_login_failed_invalid_credentials"
    | "user_logout"
    | "activity_created"
    | "activity_updated"
    | "activity_rejected"
    | "activity_verified"
    | "document_uploaded"
    | "facility_created"
    | "facility_updated"
    | "facility_deleted";

export type AuditStatus = "success" | "failure";
export type AuditSeverity = "info" | "warning" | "error" | "critical";
export type AuditActorType = "user" | "system" | "api";

/**
 * API Response DTO (snake_case from backend)
 */
export interface AuditLogDTO {
    id: string;
    tenant_id: string;
    category: AuditCategory;
    event_type: AuditEventType;
    actor_type: AuditActorType;
    actor_email: string;
    actor_user_id: string;
    resource_type: string | null;
    resource_id: string | null;
    resource_identifier: string | null;
    status: AuditStatus;
    severity: AuditSeverity;
    description: string;
    error_code: string | null;
    error_message: string | null;
    reason: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Domain Model (camelCase)
 */
export interface AuditLog {
    id: string;
    tenantId: string;
    category: AuditCategory;
    eventType: AuditEventType;
    actorType: AuditActorType;
    actorEmail: string;
    actorUserId: string;
    resourceType: string | null;
    resourceId: string | null;
    resourceIdentifier: string | null;
    status: AuditStatus;
    severity: AuditSeverity;
    description: string;
    errorCode: string | null;
    errorMessage: string | null;
    reason: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Pagination metadata DTO (snake_case from backend)
 */
export interface PaginationMetaDTO {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

/**
 * Pagination metadata (camelCase for frontend/domain model)
 */
export interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

/**
 * API Response wrapper
 */
export interface AuditLogsResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: {
        items: AuditLogDTO[];
    } & PaginationMetaDTO;
    error: string | null;
    method: string;
    path: string;
    timestamp: string;
}

/**
 * Filter parameters for API request
 */
export interface AuditLogFilters {
    category?: AuditCategory;
    eventType?: AuditEventType;
    status?: AuditStatus;
    severity?: AuditSeverity;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    actorEmail?: string;
    resourceType?: string;
    page?: number;
    pageSize?: number;
}

/**
 * Extended type for UI display with formatted values
 */
export interface AuditLogDisplay extends AuditLog {
    formattedDate: string;
    formattedTime: string;
    icon: string;
    iconColor: string;
    statusLabel: string;
}
