"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { AuditLogItem } from "@/lib/audit-logs/types";
import {
    formatDateTime,
    formatEventType,
    getModuleInfo,
    SEVERITY_CONFIG,
    STATUS_CONFIG,
} from "@/lib/audit-logs/formatters";

type Props = {
    items: AuditLogItem[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    total: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onInspect: (item: AuditLogItem) => void;
};

export function AuditForensicTableView({
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="h-12 bg-slate-100/70 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3 font-sans shadow-sm">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <MaterialIcon name="find_in_page" size="md" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Forensic Audit Logs Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No matching forensic audit logs or field diffs were found for the selected query filters.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 font-sans">
            {/* Table Container */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-xs text-slate-700 py-3.5 pl-6">Timestamp</TableHead>
                            <TableHead className="font-semibold text-xs text-slate-700">Module &amp; Event</TableHead>
                            <TableHead className="font-semibold text-xs text-slate-700">Description &amp; Resource</TableHead>
                            <TableHead className="font-semibold text-xs text-slate-700">Actor</TableHead>
                            <TableHead className="font-semibold text-xs text-slate-700">Status</TableHead>
                            <TableHead className="font-semibold text-xs text-slate-700">Diff State</TableHead>
                            <TableHead className="font-semibold text-xs text-slate-700 text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100">
                        {items.map((log) => {
                            const moduleInfo = getModuleInfo(log.module);
                            const severityConfig = SEVERITY_CONFIG[log.severity] || SEVERITY_CONFIG.info;
                            const statusConfig = STATUS_CONFIG[log.status] || STATUS_CONFIG.success;

                            const changes = log.changes || {};
                            const changeKeys = Object.keys(changes);
                            const hasChanges = changeKeys.length > 0;

                            return (
                                <TableRow
                                    key={log.id}
                                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                                    onClick={() => onInspect(log)}>
                                    {/* Timestamp */}
                                    <TableCell className="pl-6 py-3.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                                        {formatDateTime(log.created_at)}
                                    </TableCell>

                                    {/* Module & Event */}
                                    <TableCell className="py-3.5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border ${moduleInfo.color}`}>
                                                    <MaterialIcon name={moduleInfo.icon} size="xs" />
                                                    {moduleInfo.label}
                                                </span>
                                            </div>
                                            <div className="font-bold text-xs text-slate-900">
                                                {formatEventType(log.event_type)}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Description & Resource */}
                                    <TableCell className="py-3.5 max-w-xs">
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-800 line-clamp-1">{log.description}</p>
                                            {log.resource_type && (
                                                <div className="font-mono text-[11px] text-slate-400 truncate">
                                                    ID: {log.resource_identifier || log.resource_id}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Actor */}
                                    <TableCell className="py-3.5 whitespace-nowrap">
                                        <div className="space-y-0.5 font-mono text-xs">
                                            <div className="font-medium text-slate-900">{log.actor_email}</div>
                                            <div className="text-[10px] text-slate-400 uppercase font-sans">
                                                Type: {log.actor_type}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Status & Severity */}
                                    <TableCell className="py-3.5 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border w-fit ${statusConfig.badge}`}>
                                                <MaterialIcon name={statusConfig.icon} size="xs" />
                                                {statusConfig.label}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${severityConfig.dot}`} />
                                                {log.severity}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Diff State */}
                                    <TableCell className="py-3.5 whitespace-nowrap">
                                        {hasChanges ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold">
                                                <MaterialIcon name="compare_arrows" size="xs" />
                                                {changeKeys.length} {changeKeys.length === 1 ? "Field Changed" : "Fields Changed"}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs font-mono">—</span>
                                        )}
                                    </TableCell>

                                    {/* Action */}
                                    <TableCell className="pr-6 py-3.5 text-right whitespace-nowrap">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onInspect(log);
                                            }}
                                            className="h-7 text-xs px-2.5 gap-1 rounded-lg border-slate-200 hover:bg-slate-100 text-slate-700">
                                            <MaterialIcon name="visibility" size="xs" />
                                            <span>Inspect</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-600">
                    <div>
                        Showing <span className="font-semibold text-slate-900">{(page - 1) * pageSize + 1}</span> to{" "}
                        <span className="font-semibold text-slate-900">{Math.min(page * pageSize, total)}</span> of{" "}
                        <span className="font-semibold text-slate-900">{total}</span> forensic logs
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
