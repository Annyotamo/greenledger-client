"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
    activeView: "timeline" | "forensic";
    onViewChange: (view: "timeline" | "forensic") => void;
    onExport: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
    totalCount?: number;
};

export function AuditLogsHeader({
    activeView,
    onViewChange,
    onExport,
    onRefresh,
    isRefreshing = false,
    totalCount,
}: Props) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-outline-variant pb-6 font-sans">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="active" size="md">
                        Enterprise Governance • Immutable Audit
                    </Badge>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>Real-Time Ingestion Logs</span>
                    </span>
                </div>
                <h1 className="text-headline-md font-bold tracking-tight text-primary">
                    Audit Logs &amp; Activity Trails
                </h1>
                <p className="text-sm text-on-surface-variant max-w-2xl">
                    Comprehensive chronological record of system events, Scope 1–3 activity submissions, user authentications, and forensic state diffs.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* View Switcher Tabs */}
                <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
                    <button
                        type="button"
                        onClick={() => onViewChange("timeline")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeView === "timeline"
                                ? "bg-white text-emerald-800 shadow-sm font-bold"
                                : "text-slate-600 hover:text-slate-900"
                        }`}>
                        <MaterialIcon name="timeline" size="xs" />
                        <span>Timeline Feed</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onViewChange("forensic")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeView === "forensic"
                                ? "bg-white text-emerald-800 shadow-sm font-bold"
                                : "text-slate-600 hover:text-slate-900"
                        }`}>
                        <MaterialIcon name="table_chart" size="xs" />
                        <span>Forensic Diffs</span>
                    </button>
                </div>

                {/* Refresh */}
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={isRefreshing}
                    onClick={onRefresh}
                    className="h-9 px-3 text-xs gap-1.5 rounded-xl border-slate-200 shadow-sm">
                    <MaterialIcon
                        name="refresh"
                        size="xs"
                        className={isRefreshing ? "animate-spin text-emerald-600" : "text-slate-600"}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                </Button>

                {/* Export */}
                <Button
                    variant="primary"
                    size="sm"
                    onClick={onExport}
                    className="h-9 px-4 text-xs gap-1.5 rounded-xl shadow-md">
                    <MaterialIcon name="download" size="xs" />
                    <span>Export Logs</span>
                </Button>
            </div>
        </div>
    );
}
