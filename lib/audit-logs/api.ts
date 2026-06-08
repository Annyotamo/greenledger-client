import { privateApi } from "@/lib/http/client";
import type { AuditLog, AuditLogDTO, AuditLogFilters, AuditLogsResponse, PaginationMeta } from "./types";

/**
 * Convert snake_case DTO to camelCase domain model
 */
function mapAuditLogDTO(dto: AuditLogDTO): AuditLog {
    return {
        id: dto.id,
        tenantId: dto.tenant_id,
        category: dto.category,
        eventType: dto.event_type,
        actorType: dto.actor_type,
        actorEmail: dto.actor_email,
        actorUserId: dto.actor_user_id,
        resourceType: dto.resource_type,
        resourceId: dto.resource_id,
        resourceIdentifier: dto.resource_identifier,
        status: dto.status,
        severity: dto.severity,
        description: dto.description,
        errorCode: dto.error_code,
        errorMessage: dto.error_message,
        reason: dto.reason,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
    };
}

/**
 * Build query parameters object from filters
 */
function buildQueryParams(filters: AuditLogFilters): Record<string, any> {
    const params: Record<string, any> = {};

    if (filters.category) params.category = filters.category;
    if (filters.eventType) params.event_type = filters.eventType;
    if (filters.status) params.status = filters.status;
    if (filters.severity) params.severity = filters.severity;
    if (filters.startDate) params.start_date = filters.startDate;
    if (filters.endDate) params.end_date = filters.endDate;
    if (filters.actorEmail) params.actor_email = filters.actorEmail;
    if (filters.resourceType) params.resource_type = filters.resourceType;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.page_size = filters.pageSize;

    return params;
}

/**
 * Fetch audit logs from API using configured axios instance
 */
export async function fetchAuditLogs(filters: AuditLogFilters = {}) {
    try {
        const queryParams = buildQueryParams(filters);

        const response = await privateApi.get<AuditLogsResponse>("/tenant/audit-logs", {
            params: queryParams,
        });

        const data = response.data;

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch audit logs");
        }

        return {
            items: data.data.items.map(mapAuditLogDTO),
            pagination: {
                total: data.data.total,
                page: data.data.page,
                pageSize: data.data.page_size,
                totalPages: data.data.total_pages,
            },
        };
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
    }
}

/**
 * Type-safe wrapper for useQuery hook
 */
export async function getAuditLogsQuery(filters?: AuditLogFilters) {
    return fetchAuditLogs(filters);
}
