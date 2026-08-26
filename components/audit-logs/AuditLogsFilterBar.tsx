"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import type { AuditQueryParams } from "@/lib/audit-logs/types";
import {
    MODULE_OPTIONS,
    CATEGORY_OPTIONS,
    SEVERITY_OPTIONS,
    STATUS_OPTIONS,
} from "@/lib/audit-logs/formatters";

type Props = {
    filters: AuditQueryParams;
    onFiltersChange: (newFilters: AuditQueryParams) => void;
    activeView: "timeline" | "forensic";
    totalCount?: number;
    isLoading?: boolean;
};

export function AuditLogsFilterBar({
    filters,
    onFiltersChange,
    activeView,
    totalCount,
    isLoading = false,
}: Props) {
    const [searchInput, setSearchInput] = useState(filters.search || "");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== (filters.search || "")) {
                onFiltersChange({ ...filters, search: searchInput || undefined, page: 1 });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleSelectChange = (key: keyof AuditQueryParams, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value || undefined,
            page: 1,
        });
    };

    const handleToggleHasChanges = () => {
        onFiltersChange({
            ...filters,
            has_changes: filters.has_changes ? undefined : true,
            page: 1,
        });
    };

    const handleClearAll = () => {
        setSearchInput("");
        onFiltersChange({ page: 1, page_size: filters.page_size || 50 });
    };

    const activeFilterCount = Object.entries(filters).filter(
        ([key, val]) => !["page", "page_size", "sort_by", "sort_order"].includes(key) && val !== undefined && val !== "",
    ).length;

    return (
        <div className="space-y-3 font-sans">
            {/* Primary Search & Controls Strip */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <MaterialIcon
                        name="search"
                        size="sm"
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by actor email, event description, resource ID..."
                        className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans"
                    />
                    {searchInput && (
                        <button
                            onClick={() => setSearchInput("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <MaterialIcon name="close" size="xs" />
                        </button>
                    )}
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Module Filter */}
                    <select
                        value={filters.module || ""}
                        onChange={(e) => handleSelectChange("module", e.target.value)}
                        className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                        {MODULE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Severity Filter */}
                    <select
                        value={filters.severity || ""}
                        onChange={(e) => handleSelectChange("severity", e.target.value)}
                        className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                        {SEVERITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Has Changes Only Toggle (Forensic View) */}
                    {activeView === "forensic" && (
                        <button
                            type="button"
                            onClick={handleToggleHasChanges}
                            className={`h-9 px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                                filters.has_changes
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}>
                            <MaterialIcon
                                name={filters.has_changes ? "check_box" : "check_box_outline_blank"}
                                size="xs"
                                className={filters.has_changes ? "text-emerald-600" : "text-slate-400"}
                            />
                            <span>Has Changes Diff</span>
                        </button>
                    )}

                    {/* Advanced Filters Toggle Button */}
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsAdvancedOpen((prev) => !prev)}
                        className={`h-9 text-xs gap-1.5 px-3 rounded-xl border ${
                            isAdvancedOpen || activeFilterCount > 0
                                ? "bg-slate-100 border-slate-300 text-slate-900 font-semibold"
                                : "text-slate-600 border-slate-200"
                        }`}>
                        <MaterialIcon name="tune" size="xs" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="ml-0.5 rounded-full bg-emerald-600 text-white px-1.5 py-0.2 text-[10px] font-mono">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Advanced Filters Collapsible Drawer */}
            {isAdvancedOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-fade-up">
                    {/* Category Filter */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 block">Category</label>
                        <select
                            value={filters.category || ""}
                            onChange={(e) => handleSelectChange("category", e.target.value)}
                            className="w-full h-8.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500">
                            {CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 block">Execution Status</label>
                        <select
                            value={filters.status || ""}
                            onChange={(e) => handleSelectChange("status", e.target.value)}
                            className="w-full h-8.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500">
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 block">From Date</label>
                        <input
                            type="date"
                            value={filters.start_date ? filters.start_date.split("T")[0] : ""}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    start_date: e.target.value ? `${e.target.value}T00:00:00Z` : undefined,
                                    page: 1,
                                })
                            }
                            className="w-full h-8.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* End Date */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 block">To Date</label>
                        <input
                            type="date"
                            value={filters.end_date ? filters.end_date.split("T")[0] : ""}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    end_date: e.target.value ? `${e.target.value}T23:59:59Z` : undefined,
                                    page: 1,
                                })
                            }
                            className="w-full h-8.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>
            )}

            {/* Active Filters Pill Row */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Active Filters:
                    </span>

                    {filters.search && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            Search: &quot;{filters.search}&quot;
                            <button onClick={() => setSearchInput("")} className="hover:text-rose-600">
                                <MaterialIcon name="close" size="xs" />
                            </button>
                        </span>
                    )}

                    {filters.module && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            Module: {filters.module}
                            <button onClick={() => handleSelectChange("module", "")} className="hover:text-rose-600">
                                <MaterialIcon name="close" size="xs" />
                            </button>
                        </span>
                    )}

                    {filters.severity && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            Severity: {filters.severity}
                            <button onClick={() => handleSelectChange("severity", "")} className="hover:text-rose-600">
                                <MaterialIcon name="close" size="xs" />
                            </button>
                        </span>
                    )}

                    {filters.status && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            Status: {filters.status}
                            <button onClick={() => handleSelectChange("status", "")} className="hover:text-rose-600">
                                <MaterialIcon name="close" size="xs" />
                            </button>
                        </span>
                    )}

                    {filters.has_changes && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px] font-semibold">
                            With Diffs Only
                            <button onClick={handleToggleHasChanges} className="hover:text-rose-600">
                                <MaterialIcon name="close" size="xs" />
                            </button>
                        </span>
                    )}

                    {filters.start_date && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            From: {filters.start_date.split("T")[0]}
                            <button
                                onClick={() => onFiltersChange({ ...filters, start_date: undefined, page: 1 })}
                                className="hover:text-rose-600">
                                <MaterialIcon name="close" size="xs" />
                            </button>
                        </span>
                    )}

                    {filters.end_date && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            To: {filters.end_date.split("T")[0]}
                            <button
                                onClick={() => onFiltersChange({ ...filters, end_date: undefined, page: 1 })}
                                className="hover:text-rose-600">
                                <MaterialIcon name="close" size="xs" />
                            </button>
                        </span>
                    )}

                    <button
                        onClick={handleClearAll}
                        className="text-[11px] text-rose-600 hover:text-rose-800 hover:underline font-semibold ml-1">
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
    );
}
