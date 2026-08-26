"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import type { AuditTrailItem } from "@/lib/audit-logs/types";
import {
    formatDateTime,
    formatEventType,
    getModuleInfo,
    SEVERITY_CONFIG,
    STATUS_CONFIG,
} from "@/lib/audit-logs/formatters";

type Props = {
    items: AuditTrailItem[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    total: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onInspect: (item: AuditTrailItem) => void;
};

export function AuditTimelineView({
    items,
    isLoading,
    page,
    totalPages,
    total,
    pageSize,
    onPageChange,
    onInspect,
}: Props) {
    if (isLoading) {
        return (
            <div className="space-y-4 py-6">
                {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/4" />
                            <div className="h-3 bg-slate-100 rounded w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3 font-sans shadow-sm">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <MaterialIcon name="manage_search" size="md" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Audit Timeline Events Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No matching activity trails were recorded for the selected filter criteria or time range.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 font-sans">
            {/* Timeline Stream */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3.5 sm:before:left-4.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {items.map((item, idx) => {
                    const moduleInfo = getModuleInfo(item.module);
                    const severityConfig = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.info;
                    const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.success;

                    return (
                        <div key={item.id} className="relative group">
                            {/* Milestone Dot on connecting line */}
                            <div className={`absolute -left-[27px] sm:-left-[31px] top-4 h-4 w-4 rounded-full border-2 border-white ${severityConfig.dot} shadow-sm z-10`} />

                            {/* Card Content */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-3">
                                {/* Top Row */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold border ${moduleInfo.color}`}>
                                            <MaterialIcon name={moduleInfo.icon} size="xs" />
                                            {moduleInfo.label}
                                        </span>

                                        <span className="font-semibold text-xs text-slate-900">
                                            {formatEventType(item.event_type)}
                                        </span>

                                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${statusConfig.badge}`}>
                                            <MaterialIcon name={statusConfig.icon} size="xs" />
                                            {statusConfig.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                                        <MaterialIcon name="schedule" size="xs" />
                                        <span>{formatDateTime(item.created_at)}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                    {item.description}
                                </p>

                                {/* Bottom Metadata & Action Row */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                                    <div className="flex flex-wrap items-center gap-4 text-slate-500">
                                        <div className="flex items-center gap-1.5 font-mono">
                                            <MaterialIcon name="person" size="xs" className="text-slate-400" />
                                            <span className="font-medium text-slate-800">{item.actor_email}</span>
                                            <span className="text-[10px] text-slate-400 uppercase font-sans">({item.actor_type})</span>
                                        </div>

                                        {item.resource_type && (
                                            <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                                <MaterialIcon name="link" size="xs" className="text-slate-400" />
                                                <span className="text-slate-500">{item.resource_type}:</span>
                                                <span className="text-slate-700 truncate max-w-[140px] font-bold">
                                                    {item.resource_identifier || item.resource_id}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => onInspect(item)}
                                        className="h-7 text-xs px-3 gap-1 rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700">
                                        <MaterialIcon name="visibility" size="xs" />
                                        <span>Inspect Forensic Diff</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs text-slate-600">
                    <div>
                        Showing <span className="font-semibold text-slate-900">{(page - 1) * pageSize + 1}</span> to{" "}
                        <span className="font-semibold text-slate-900">{Math.min(page * pageSize, total)}</span> of{" "}
                        <span className="font-semibold text-slate-900">{total}</span> events
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => onPageChange(page - 1)}
                            className="h-8 px-3 text-xs gap-1">
                            <MaterialIcon name="chevron_left" size="xs" />
                            Previous
                        </Button>
                        <span className="px-3 py-1 font-mono text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg">
                            {page} / {totalPages}
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => onPageChange(page + 1)}
                            className="h-8 px-3 text-xs gap-1">
                            Next
                            <MaterialIcon name="chevron_right" size="xs" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
