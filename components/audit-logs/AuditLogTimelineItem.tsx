"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import type { AuditLog } from "@/lib/audit-logs/types";
import {
    EVENT_TYPE_ICON_MAP,
    EVENT_TYPE_LABEL_MAP,
    SEVERITY_COLOR_MAP,
    formatDateTime,
    getStatusIcon,
    getSeverityLabel,
    getCategoryLabel,
} from "@/lib/audit-logs/formatters";
import { cn } from "@/lib/utils/cn";

type AuditLogTimelineItemProps = {
    log: AuditLog;
    isLast?: boolean;
};

export function AuditLogTimelineItem({ log, isLast = false }: AuditLogTimelineItemProps) {
    const severityColors = SEVERITY_COLOR_MAP[log.severity];
    const eventLabel = EVENT_TYPE_LABEL_MAP[log.eventType];
    const eventIcon = EVENT_TYPE_ICON_MAP[log.eventType];
    const statusIcon = getStatusIcon(log.status);

    const isSuccess = log.status === "success";
    const iconBg = isSuccess
        ? "bg-secondary-container/30 border-secondary-container/50"
        : "bg-error-container/30 border-error-container/50";

    const iconColor = isSuccess ? "text-secondary" : "text-error";

    return (
        <div className="flex gap-6 pb-8 relative group last:pb-0">
            {/* Timeline line */}
            {!isLast && (
                <div className="absolute left-6 top-10 bottom-0 w-px bg-outline-variant transition-colors group-hover:bg-primary/50" />
            )}

            {/* Timeline circle icon */}
            <div
                className={cn(
                    "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-surface-container-lowest transition-all duration-200 group-hover:scale-110 group-hover:shadow-md",
                    iconBg,
                )}>
                <MaterialIcon name={eventIcon} size="sm" className={cn("font-bold", iconColor)} />
            </div>

            {/* Content card */}
            <div className="flex-1 pt-1 min-w-0">
                <div
                    className={cn(
                        "rounded-lg border transition-all duration-200 group-hover:shadow-md",
                        isSuccess
                            ? "bg-surface-container-lowest border-outline-variant/50 hover:border-outline-variant"
                            : "bg-error-container/10 border-error-container/30 hover:border-error-container/50",
                    )}>
                    {/* Header with event name and status */}
                    <div className="px-card-padding pt-card-padding pb-2 border-b border-outline-variant/30">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="font-semibold text-on-surface text-sm">{eventLabel}</h4>

                            {/* Status badge */}
                            <Badge
                                variant={isSuccess ? "positive" : "negative"}
                                size="sm"
                                className="flex items-center gap-1 w-fit">
                                <MaterialIcon name={statusIcon} size="sm" />
                                <span className="text-[10px]">{log.status === "success" ? "Success" : "Failed"}</span>
                            </Badge>

                            {/* Severity badge */}
                            <div
                                className={cn(
                                    "inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase w-fit",
                                    severityColors.badge,
                                )}>
                                <MaterialIcon
                                    name={log.severity === "error" || log.severity === "critical" ? "warning" : "info"}
                                    size="sm"
                                />
                                <span>{getSeverityLabel(log.severity)}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-[13px] text-on-surface leading-relaxed">{log.description}</p>
                    </div>

                    {/* Details section */}
                    <div className="px-card-padding py-card-padding flex flex-col gap-3">
                        {/* Actor and Timestamp */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[12px]">
                            <div className="flex items-center gap-1 font-mono text-on-surface-variant">
                                <MaterialIcon name="person" size="sm" />
                                <span className="font-semibold text-on-surface">{log.actorEmail}</span>
                            </div>
                            <div className="hidden sm:block text-on-surface-variant/50">·</div>
                            <div className="flex items-center gap-1 font-mono text-on-surface-variant">
                                <MaterialIcon name="schedule" size="sm" />
                                <span>{formatDateTime(log.createdAt)}</span>
                            </div>
                        </div>

                        {/* Resource information */}
                        {log.resourceIdentifier && (
                            <div className="flex flex-col gap-1 text-[12px] bg-surface-container-lowest/50 p-2 rounded border border-outline-variant/30">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="inventory_2" size="sm" className="text-on-surface-variant/60" />
                                    <span className="font-mono font-medium text-on-surface">
                                        {log.resourceIdentifier}
                                    </span>
                                </div>
                                {log.resourceType && (
                                    <span className="text-[11px] text-on-surface-variant ml-6">
                                        Type: {log.resourceType}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Category and ID */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <Badge variant="tag">{getCategoryLabel(log.category)}</Badge>
                            <span className="text-on-surface-variant/60 font-mono">ID: {log.id.slice(0, 8)}</span>
                        </div>

                        {/* Error message if failure */}
                        {log.status === "failure" && log.errorMessage && (
                            <div className="mt-2 p-2 rounded bg-error-container/20 border border-error-container/40">
                                <p className="text-[11px] text-error font-mono">{log.errorMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
