"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { AuditLogItem } from "./AuditLogItem";
import { AuditLogsFilters } from "./AuditLogsFilters";
import type { AuditLog, AuditLogFilters } from "@/lib/audit-logs/types";
import { fetchAuditLogs } from "@/lib/audit-logs/api";
import { cn } from "@/lib/utils/cn";
import { useEffect } from "react";

type AuditLogsViewProps = {
    initialLogs?: AuditLog[];
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 4 },
    show: { opacity: 1, y: 0 },
};

export function AuditLogsView({ initialLogs = [] }: AuditLogsViewProps) {
    const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<AuditLogFilters>({ pageSize: 50 });
    const [pagination, setPagination] = useState({ total: initialLogs.length, page: 1, pageSize: 50, totalPages: 1 });

    // Fetch logs when filters change
    const loadAuditLogs = useCallback(async (filtersToApply: AuditLogFilters) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchAuditLogs(filtersToApply);
            setLogs(result.items);
            setPagination(result.pagination);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load audit logs";
            setError(errorMessage);
            console.error("Error loading audit logs:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        if (initialLogs.length === 0) {
            loadAuditLogs(filters);
        }
    }, []);

    const handleFiltersChange = useCallback(
        (newFilters: AuditLogFilters) => {
            const mergedFilters = { ...filters, ...newFilters, page: 1, pageSize: 50 };
            setFilters(mergedFilters);
            loadAuditLogs(mergedFilters);
        },
        [filters, loadAuditLogs],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            const newFilters = { ...filters, page };
            setFilters(newFilters);
            loadAuditLogs(newFilters);
        },
        [filters, loadAuditLogs],
    );

    const shouldShowPagination = pagination.totalPages > 1;

    return (
        <motion.div
            className="relative mx-auto max-w-full space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show">
            {/* Header Section */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h2 className="text-headline-lg font-bold tracking-tight text-primary">Audit Logs</h2>
                    <p className="text-body-md text-on-surface-variant">System activity and user action history</p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants}>
                <AuditLogsFilters onFiltersChange={handleFiltersChange} isLoading={isLoading} />
            </motion.div>

            {/* Error State */}
            {error && (
                <motion.div
                    variants={itemVariants}
                    className="rounded-lg border border-error-container bg-error-container/10 p-4 text-error flex items-start gap-3">
                    <MaterialIcon name="error" size="lg" className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm">Failed to load audit logs</p>
                        <p className="text-[12px] text-error/80 mt-1">{error}</p>
                    </div>
                </motion.div>
            )}

            {/* Loading State */}
            {isLoading && !error && (
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center py-12 rounded-lg border border-outline-variant bg-surface-container-lowest">
                    <div className="flex flex-col items-center gap-3">
                        <MaterialIcon
                            name="hourglass_empty"
                            size="lg"
                            className="text-on-surface-variant animate-spin"
                        />
                        <p className="text-[12px] font-mono text-on-surface-variant">Loading audit logs...</p>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && logs.length === 0 && !error && (
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center py-16 rounded-lg border border-outline-variant border-dashed bg-surface-container-lowest">
                    <div className="flex flex-col items-center gap-3">
                        <MaterialIcon name="inbox" size="lg" className="text-on-surface-variant/50" />
                        <div className="text-center">
                            <p className="text-[12px] font-mono font-semibold text-on-surface">No audit logs found</p>
                            <p className="text-[11px] text-on-surface-variant mt-1">
                                Try adjusting your filters or check back later
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Data Table */}
            {!isLoading && logs.length > 0 && (
                <motion.div variants={itemVariants}>
                    <Card className="flex flex-col overflow-hidden">
                        <CardHeader tone="flat" bordered>
                            <div className="flex items-center gap-2.5">
                                <MaterialIcon name="history" size="sm" className="text-primary" />
                                <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                                    Audit Trail ({pagination.total} total)
                                </h3>
                            </div>
                            <div className="text-[11px] font-mono text-on-surface-variant">
                                Page {pagination.page} of {pagination.totalPages}
                            </div>
                        </CardHeader>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                                        <TableHead>Event & Description</TableHead>
                                        <TableHead className="whitespace-nowrap">Category</TableHead>
                                        <TableHead>Actor</TableHead>
                                        <TableHead>Resource</TableHead>
                                        <TableHead>Status & Severity</TableHead>
                                        <TableHead>Error</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => (
                                        <AuditLogItem key={log.id} log={log} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        {shouldShowPagination && (
                            <CardBody className="border-t border-outline-variant bg-surface-container-lowest/50 flex items-center justify-between">
                                <div className="text-[11px] font-mono text-on-surface-variant">
                                    Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
                                    {pagination.total}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1 || isLoading}
                                        className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-mono border border-outline-variant bg-surface-container-lowest rounded hover:bg-surface-container-low transition-colors disabled:opacity-60">
                                        <MaterialIcon name="chevron_left" size="sm" />
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            let pageNum = pagination.page - 2 + i;
                                            if (pageNum < 1) pageNum = 1;
                                            if (pageNum > pagination.totalPages) pageNum = pagination.totalPages;
                                            return pageNum;
                                        })
                                            .filter((v, i, arr) => arr.indexOf(v) === i)
                                            .map((pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    disabled={isLoading}
                                                    className={cn(
                                                        "w-7 h-7 text-[10px] font-mono rounded border transition-colors",
                                                        pagination.page === pageNum
                                                            ? "bg-primary text-white border-primary font-bold"
                                                            : "border-outline-variant hover:bg-surface-container-low",
                                                    )}>
                                                    {pageNum}
                                                </button>
                                            ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages || isLoading}
                                        className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-mono border border-outline-variant bg-surface-container-lowest rounded hover:bg-surface-container-low transition-colors disabled:opacity-60">
                                        Next
                                        <MaterialIcon name="chevron_right" size="sm" />
                                    </button>
                                </div>
                            </CardBody>
                        )}
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
}
