import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { AuditLog } from "@/lib/audit-logs/types";
import {
    EVENT_TYPE_LABEL_MAP,
    SEVERITY_COLOR_MAP,
    formatDateTime,
    getStatusIcon,
    getSeverityBadgeVariant,
    getSeverityLabel,
    getCategoryLabel,
} from "@/lib/audit-logs/formatters";
import { cn } from "@/lib/utils/cn";

type AuditLogItemProps = {
    log: AuditLog;
};

export function AuditLogItem({ log }: AuditLogItemProps) {
    const severityColors = SEVERITY_COLOR_MAP[log.severity];
    const severityVariant = getSeverityBadgeVariant(log.severity);
    const statusIcon = getStatusIcon(log.status);
    const eventLabel = EVENT_TYPE_LABEL_MAP[log.eventType];

    return (
        <TableRow className={cn("hover:bg-surface-container transition-colors")}>
            {/* Timestamp */}
            <TableCell className="font-mono text-[11px] whitespace-nowrap">
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-on-surface">{formatDateTime(log.createdAt)}</span>
                    <span className="text-[10px] text-on-surface-variant">{log.id.slice(0, 8)}</span>
                </div>
            </TableCell>

            {/* Event Type & Description */}
            <TableCell>
                <div className="flex flex-col gap-1 max-w-sm">
                    <span className="font-semibold text-on-surface">{eventLabel}</span>
                    <span className="text-[11px] text-on-surface-variant line-clamp-2">{log.description}</span>
                </div>
            </TableCell>

            {/* Category */}
            <TableCell className="text-[11px]">
                <Badge variant="tag">{getCategoryLabel(log.category)}</Badge>
            </TableCell>

            {/* Actor */}
            <TableCell className="font-mono text-[11px]">
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-on-surface">{log.actorEmail}</span>
                    <span className="text-[10px] text-on-surface-variant capitalize">{log.actorType}</span>
                </div>
            </TableCell>

            {/* Resource */}
            <TableCell className="text-[11px] text-on-surface-variant font-mono">
                {log.resourceIdentifier ? (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-on-surface">{log.resourceIdentifier}</span>
                        {log.resourceType && (
                            <span className="text-[10px] text-on-surface-variant">{log.resourceType}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-on-surface-variant/60">—</span>
                )}
            </TableCell>

            {/* Status & Severity */}
            <TableCell>
                <div className="flex items-center gap-2">
                    {/* Status badge */}
                    <Badge
                        variant={log.status === "success" ? "positive" : "negative"}
                        size="md"
                        className="flex items-center gap-1">
                        <MaterialIcon name={statusIcon} size="sm" />
                        <span className="capitalize">{log.status}</span>
                    </Badge>

                    {/* Severity badge */}
                    <div
                        className={cn(
                            "inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase",
                            severityColors.badge,
                        )}>
                        <MaterialIcon
                            name={log.severity === "error" || log.severity === "critical" ? "warning" : "info"}
                            size="sm"
                        />
                        <span>{getSeverityLabel(log.severity)}</span>
                    </div>
                </div>
            </TableCell>

            {/* Error Message (if failure) */}
            <TableCell className="text-[10px] text-on-surface-variant">
                {log.status === "failure" && log.errorMessage ? (
                    <span className="line-clamp-2 text-error">{log.errorMessage}</span>
                ) : (
                    <span className="text-on-surface-variant/60">—</span>
                )}
            </TableCell>
        </TableRow>
    );
}
