"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AuditLogsHeader } from "./AuditLogsHeader";
import { AuditLogsFilterBar } from "./AuditLogsFilterBar";
import { AuditTimelineView } from "./AuditTimelineView";
import { AuditForensicTableView } from "./AuditForensicTableView";
import { AuditForensicDiffModal } from "./AuditForensicDiffModal";
import {
    useAuditTrails,
    useAuditLogs,
    useSingleAuditLog,
} from "@/lib/audit-logs/hooks";
import type {
    AuditQueryParams,
    AuditTrailItem,
    AuditLogItem,
} from "@/lib/audit-logs/types";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export function AuditLogsMainView() {
    const [activeView, setActiveView] = useState<"timeline" | "forensic">("timeline");
    const [filters, setFilters] = useState<AuditQueryParams>({
        page: 1,
        page_size: 50,
        sort_by: "created_at",
        sort_order: "desc",
    });

    // Modal state
    const [selectedItem, setSelectedItem] = useState<AuditTrailItem | AuditLogItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Queries
    const trailsQuery = useAuditTrails(activeView === "timeline" ? filters : {});
    const logsQuery = useAuditLogs(activeView === "forensic" ? filters : {});
    const singleLogQuery = useSingleAuditLog(selectedItem?.id);

    const activeQuery = activeView === "timeline" ? trailsQuery : logsQuery;

    const handleInspect = (item: AuditTrailItem | AuditLogItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleRefresh = () => {
        activeQuery.refetch();
    };

    const handleExport = () => {
        const itemsToExport =
            activeView === "timeline"
                ? trailsQuery.data?.items || []
                : logsQuery.data?.items || [];

        if (itemsToExport.length === 0) {
            alert("No logs available to export for the current filters.");
            return;
        }

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(itemsToExport, null, 2),
        )}`;
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", jsonString);
        downloadAnchor.setAttribute(
            "download",
            `greenledger-audit-${activeView}-${new Date().toISOString().split("T")[0]}.json`,
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    const activeModalLog: AuditLogItem | AuditTrailItem | null =
        singleLogQuery.data || selectedItem;

    return (
        <div className="space-y-6 max-w-7xl mx-auto font-sans animate-fade-up">
            {/* Page Header */}
            <AuditLogsHeader
                activeView={activeView}
                onViewChange={(view) => {
                    setActiveView(view);
                    setFilters((prev) => ({ ...prev, page: 1 }));
                }}
                onExport={handleExport}
                onRefresh={handleRefresh}
                isRefreshing={activeQuery.isFetching}
                totalCount={activeQuery.data?.total}
            />

            {/* Filter Bar */}
            <AuditLogsFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                activeView={activeView}
                totalCount={activeQuery.data?.total}
                isLoading={activeQuery.isLoading}
            />

            {/* Error Message */}
            {activeQuery.isError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center space-y-3">
                    <MaterialIcon name="error_outline" size="md" className="text-rose-600 mx-auto" />
                    <h3 className="text-sm font-bold text-rose-900">Failed to load audit records</h3>
                    <p className="text-xs text-rose-700 max-w-md mx-auto">
                        {activeQuery.error instanceof Error
                            ? activeQuery.error.message
                            : "An unexpected error occurred while contacting the tenant audit service."}
                    </p>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors">
                        Retry Loading
                    </button>
                </div>
            )}

            {/* Active View Container */}
            {!activeQuery.isError && (
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}>
                    {activeView === "timeline" ? (
                        <AuditTimelineView
                            items={trailsQuery.data?.items || []}
                            isLoading={trailsQuery.isLoading}
                            page={trailsQuery.data?.page || 1}
                            totalPages={trailsQuery.data?.total_pages || 1}
                            total={trailsQuery.data?.total || 0}
                            pageSize={trailsQuery.data?.page_size || 50}
                            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                            onInspect={handleInspect}
                        />
                    ) : (
                        <AuditForensicTableView
                            items={logsQuery.data?.items || []}
                            isLoading={logsQuery.isLoading}
                            page={logsQuery.data?.page || 1}
                            totalPages={logsQuery.data?.total_pages || 1}
                            total={logsQuery.data?.total || 0}
                            pageSize={logsQuery.data?.page_size || 50}
                            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                            onInspect={handleInspect}
                        />
                    )}
                </motion.div>
            )}

            {/* Forensic Diff & Snapshot Inspector Modal */}
            <AuditForensicDiffModal
                log={activeModalLog}
                isOpen={isModalOpen}
                isLoading={singleLogQuery.isLoading && !selectedItem}
                onClose={handleCloseModal}
            />
        </div>
    );
}
