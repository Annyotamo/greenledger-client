"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { AuditTrailItem } from "@/lib/audit-logs/types";
import {
    formatDateTime,
    formatEventType,
    getModuleInfo,
    SEVERITY_CONFIG,
    STATUS_CONFIG,
} from "@/lib/audit-logs/formatters";
import { cn } from "@/lib/utils/cn";

type AuditLogTimelineItemProps = {
    log: AuditTrailItem;
    isLast?: boolean;
    onInspect?: (log: AuditTrailItem) => void;
};

export function AuditLogTimelineItem({ log, isLast = false, onInspect }: AuditLogTimelineItemProps) {
    const moduleInfo = getModuleInfo(log.module);
    const severityConfig = SEVERITY_CONFIG[log.severity] || SEVERITY_CONFIG.info;
    const statusConfig = STATUS_CONFIG[log.status] || STATUS_CONFIG.success;

    return (
        <div className="flex gap-6 pb-8 relative group last:pb-0 font-sans">
            {/* Timeline line */}
            {!isLast && (
                <div className="absolute left-6 top-10 bottom-0 w-px bg-slate-200 transition-colors group-hover:bg-emerald-500/50" />
            )}

            {/* Timeline circle icon */}
            <div
                className={cn(
                    "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-all duration-200 group-hover:scale-110 group-hover:shadow-md",
                    severityConfig.badge,
                )}>
                <MaterialIcon name={moduleInfo.icon} size="sm" className="font-bold text-slate-700" />
            </div>

            {/* Content card */}
            <div className="flex-1 pt-1 min-w-0">
                <div
                    onClick={() => onInspect?.(log)}
                    className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border ${moduleInfo.color}`}>
                                <MaterialIcon name={moduleInfo.icon} size="xs" />
                                {moduleInfo.label}
                            </span>
                            <h4 className="font-semibold text-slate-900 text-xs">{formatEventType(log.event_type)}</h4>
                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${statusConfig.badge}`}>
                                <MaterialIcon name={statusConfig.icon} size="xs" />
                                <span>{statusConfig.label}</span>
                            </span>
                        </div>

                        <div className="text-slate-400 text-xs font-mono">
                            {formatDateTime(log.created_at)}
                        </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pt-2.5">{log.description}</p>

                    <div className="flex items-center justify-between pt-3 text-xs text-slate-500 font-mono">
                        <div>Actor: <span className="font-semibold text-slate-800">{log.actor_email}</span></div>
                        {log.resource_type && (
                            <div className="text-[11px]">
                                {log.resource_type}: <span className="font-semibold">{log.resource_identifier || log.resource_id}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
