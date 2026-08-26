import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { AuditLogItem as AuditLogItemType } from "@/lib/audit-logs/types";
import {
    formatDateTime,
    formatEventType,
    getModuleInfo,
    SEVERITY_CONFIG,
    STATUS_CONFIG,
} from "@/lib/audit-logs/formatters";
import { cn } from "@/lib/utils/cn";

type AuditLogItemProps = {
    log: AuditLogItemType;
    onInspect?: (log: AuditLogItemType) => void;
};

export function AuditLogItem({ log, onInspect }: AuditLogItemProps) {
    const moduleInfo = getModuleInfo(log.module);
    const severityConfig = SEVERITY_CONFIG[log.severity] || SEVERITY_CONFIG.info;
    const statusConfig = STATUS_CONFIG[log.status] || STATUS_CONFIG.success;

    return (
        <TableRow
            className={cn("hover:bg-slate-50 transition-colors cursor-pointer")}
            onClick={() => onInspect?.(log)}>
            {/* Timestamp */}
            <TableCell className="font-mono text-[11px] whitespace-nowrap">
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-slate-800">{formatDateTime(log.created_at)}</span>
                    <span className="text-[10px] text-slate-400">{log.id.slice(0, 8)}</span>
                </div>
            </TableCell>

            {/* Event Type & Description */}
            <TableCell>
                <div className="flex flex-col gap-1 max-w-sm">
                    <span className="font-semibold text-slate-900 text-xs">{formatEventType(log.event_type)}</span>
                    <span className="text-[11px] text-slate-600 line-clamp-2">{log.description}</span>
                </div>
            </TableCell>

            {/* Module */}
            <TableCell className="text-[11px]">
                <Badge variant="tag">{moduleInfo.label}</Badge>
            </TableCell>

            {/* Actor */}
            <TableCell className="font-mono text-[11px]">
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-slate-800">{log.actor_email}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{log.actor_type}</span>
                </div>
            </TableCell>

            {/* Resource */}
            <TableCell className="text-[11px] text-slate-600 font-mono">
                {log.resource_identifier || log.resource_id ? (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-slate-800">{log.resource_identifier || log.resource_id}</span>
                        {log.resource_type && (
                            <span className="text-[10px] text-slate-400">{log.resource_type}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-slate-400">—</span>
                )}
            </TableCell>

            {/* Status & Severity */}
            <TableCell>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${statusConfig.badge}`}>
                        <MaterialIcon name={statusConfig.icon} size="xs" />
                        <span>{statusConfig.label}</span>
                    </span>

                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${severityConfig.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${severityConfig.dot}`} />
                        <span>{log.severity}</span>
                    </span>
                </div>
            </TableCell>

            {/* Error Message (if failure) */}
            <TableCell className="text-[10px] text-slate-500 font-mono">
                {log.status === "failure" && (log.error_message || log.reason) ? (
                    <span className="text-rose-600 line-clamp-1">{log.error_message || log.reason}</span>
                ) : (
                    "—"
                )}
            </TableCell>
        </TableRow>
    );
}
