import type { AuditEventType, AuditSeverity, AuditStatus, AuditLog, AuditLogDisplay } from "./types";

/**
 * Map event types to Material Icons
 */
export const EVENT_TYPE_ICON_MAP: Record<AuditEventType, string> = {
    user_login_success: "login",
    user_login_failed_invalid_credentials: "lock_person",
    user_logout: "logout",
    activity_created: "add_circle",
    activity_updated: "edit",
    activity_rejected: "cancel",
    activity_verified: "verified",
    document_uploaded: "upload_file",
    facility_created: "factory",
    facility_updated: "edit_location_alt",
    facility_deleted: "delete",
};

/**
 * Map event types to human-readable labels
 */
export const EVENT_TYPE_LABEL_MAP: Record<AuditEventType, string> = {
    user_login_success: "Login Success",
    user_login_failed_invalid_credentials: "Login Failed",
    user_logout: "Logout",
    activity_created: "Activity Created",
    activity_updated: "Activity Updated",
    activity_rejected: "Activity Rejected",
    activity_verified: "Activity Verified",
    document_uploaded: "Document Uploaded",
    facility_created: "Facility Created",
    facility_updated: "Facility Updated",
    facility_deleted: "Facility Deleted",
};

/**
 * Map severity to icon color classes
 */
export const SEVERITY_COLOR_MAP: Record<AuditSeverity, { bg: string; text: string; badge: string }> = {
    info: {
        bg: "bg-tertiary-fixed/20",
        text: "text-on-tertiary-fixed-variant",
        badge: "border-tertiary-fixed/30 bg-tertiary-fixed/10 text-on-tertiary-fixed-variant",
    },
    warning: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        badge: "border-yellow-300/50 bg-yellow-100/50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    },
    error: {
        bg: "bg-error-container/30",
        text: "text-on-error-container",
        badge: "border-error-container/40 bg-error-container/20 text-on-error-container",
    },
    critical: {
        bg: "bg-error/20",
        text: "text-error",
        badge: "border-error/30 bg-error/10 text-error",
    },
};

/**
 * Get icon for status
 */
export function getStatusIcon(status: AuditStatus): string {
    return status === "success" ? "check_circle" : "error";
}

/**
 * Get badge variant for severity
 */
export function getSeverityBadgeVariant(severity: AuditSeverity) {
    const variantMap: Record<AuditSeverity, "positive" | "negative" | "neutral" | "tag"> = {
        info: "neutral",
        warning: "tag",
        error: "negative",
        critical: "negative",
    };
    return variantMap[severity];
}

/**
 * Format date to readable string (e.g., "Jun 8, 2026")
 */
export function formatDate(isoString: string): string {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
        return isoString;
    }
}

/**
 * Format time to readable string (e.g., "04:01 AM")
 */
export function formatTime(isoString: string): string {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    } catch {
        return isoString;
    }
}

/**
 * Format full datetime (e.g., "Jun 8, 2026 · 04:01 AM")
 */
export function formatDateTime(isoString: string): string {
    return `${formatDate(isoString)} · ${formatTime(isoString)}`;
}

/**
 * Map audit log to display model with formatted values
 */
export function formatAuditLogForDisplay(log: AuditLog): AuditLogDisplay {
    const icon = EVENT_TYPE_ICON_MAP[log.eventType];
    const colors = SEVERITY_COLOR_MAP[log.severity];

    return {
        ...log,
        formattedDate: formatDate(log.createdAt),
        formattedTime: formatTime(log.createdAt),
        icon,
        iconColor: colors.text,
        statusLabel: log.status === "success" ? "Success" : "Failed",
    };
}

/**
 * Get human-readable description for severity
 */
export function getSeverityLabel(severity: AuditSeverity): string {
    const labelMap: Record<AuditSeverity, string> = {
        info: "Info",
        warning: "Warning",
        error: "Error",
        critical: "Critical",
    };
    return labelMap[severity];
}

/**
 * Get category label
 */
export function getCategoryLabel(category: string): string {
    const labelMap: Record<string, string> = {
        user_action: "User Action",
        data_action: "Data Action",
        system_action: "System",
        security_action: "Security",
    };
    return labelMap[category] || category;
}
