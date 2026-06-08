"use client";

import { useCallback, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { AuditLogFilters } from "@/lib/audit-logs/types";

type AuditLogsFiltersProps = {
    onFiltersChange: (filters: AuditLogFilters) => void;
    isLoading?: boolean;
};

export function AuditLogsFilters({ onFiltersChange, isLoading = false }: AuditLogsFiltersProps) {
    const [filters, setFilters] = useState<AuditLogFilters>({});

    const handleDateRangeChange = useCallback(
        (field: "startDate" | "endDate", value: string) => {
            const newFilters = { ...filters, [field]: value || undefined };
            setFilters(newFilters);
            onFiltersChange(newFilters);
        },
        [filters, onFiltersChange],
    );

    const handleActorEmailChange = useCallback(
        (value: string) => {
            const newFilters = { ...filters, actorEmail: value || undefined };
            setFilters(newFilters);
            onFiltersChange(newFilters);
        },
        [filters, onFiltersChange],
    );

    const handleStatusChange = useCallback(
        (value: string) => {
            const newFilters = { ...filters, status: (value || undefined) as any };
            setFilters(newFilters);
            onFiltersChange(newFilters);
        },
        [filters, onFiltersChange],
    );

    const handleSeverityChange = useCallback(
        (value: string) => {
            const newFilters = { ...filters, severity: (value || undefined) as any };
            setFilters(newFilters);
            onFiltersChange(newFilters);
        },
        [filters, onFiltersChange],
    );

    const handleClearFilters = useCallback(() => {
        setFilters({});
        onFiltersChange({});
    }, [onFiltersChange]);

    const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

    return (
        <div className="flex flex-col gap-4 p-card-padding bg-surface-bright border-b border-outline-variant">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Date From */}
                    <div className="relative flex items-center">
                        <MaterialIcon
                            name="calendar_today"
                            size="sm"
                            className="absolute left-3 text-outline pointer-events-none"
                        />
                        <input
                            type="date"
                            placeholder="From date"
                            disabled={isLoading}
                            value={filters.startDate || ""}
                            onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
                            className="pl-10 pr-3 py-2 bg-white border border-outline-variant rounded-lg text-[12px] font-mono focus:outline-none focus:border-primary disabled:opacity-60"
                        />
                    </div>

                    {/* Date To */}
                    <div className="relative flex items-center">
                        <MaterialIcon
                            name="calendar_today"
                            size="sm"
                            className="absolute left-3 text-outline pointer-events-none"
                        />
                        <input
                            type="date"
                            placeholder="To date"
                            disabled={isLoading}
                            value={filters.endDate || ""}
                            onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
                            className="pl-10 pr-3 py-2 bg-white border border-outline-variant rounded-lg text-[12px] font-mono focus:outline-none focus:border-primary disabled:opacity-60"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        disabled={isLoading}
                        value={filters.status || ""}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="px-3 py-2 bg-white border border-outline-variant rounded-lg text-[12px] font-mono focus:outline-none focus:border-primary disabled:opacity-60 appearance-none cursor-pointer">
                        <option value="">All Status</option>
                        <option value="success">Success</option>
                        <option value="failure">Failure</option>
                    </select>

                    {/* Severity Filter */}
                    <select
                        disabled={isLoading}
                        value={filters.severity || ""}
                        onChange={(e) => handleSeverityChange(e.target.value)}
                        className="px-3 py-2 bg-white border border-outline-variant rounded-lg text-[12px] font-mono focus:outline-none focus:border-primary disabled:opacity-60 appearance-none cursor-pointer">
                        <option value="">All Severity</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                        <option value="critical">Critical</option>
                    </select>

                    {/* Actor Email Filter */}
                    <div className="relative flex items-center">
                        <MaterialIcon
                            name="person"
                            size="sm"
                            className="absolute left-3 text-outline pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Actor email"
                            disabled={isLoading}
                            value={filters.actorEmail || ""}
                            onChange={(e) => handleActorEmailChange(e.target.value)}
                            className="pl-10 pr-3 py-2 bg-white border border-outline-variant rounded-lg text-[12px] font-mono focus:outline-none focus:border-primary disabled:opacity-60 w-48"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-mono text-on-surface-variant border border-outline-variant bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-60">
                            <MaterialIcon name="close" size="sm" />
                            Clear Filters
                        </button>
                    )}

                    <button
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-mono font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60">
                        <MaterialIcon name="download" size="sm" />
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
}
