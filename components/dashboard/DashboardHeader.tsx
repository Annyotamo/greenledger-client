import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { DATE_RANGE_LABEL } from "@/lib/dashboard/data";

export function DashboardHeader() {
    return (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="font-semibold text-slate-700">GRI:</span>
                        <span>Corresponds to GRI 305-1, 305-2 &amp; 305-4 — now GRI 102-5, 102-6 &amp; 102-8 (Climate Change 2025)</span>
                    </span>
                </div>
                <h2 className="text-headline-lg font-bold tracking-tight text-primary">Dashboard Overview</h2>
                <p className="text-body-md text-on-surface-variant">Real-time environmental performance monitoring</p>
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-mono text-label-md text-on-surface transition-colors hover:bg-surface-container-high">
                    <MaterialIcon name="calendar_today" size="sm" />
                    {DATE_RANGE_LABEL}
                </button>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-mono text-label-md text-on-surface transition-colors hover:bg-surface-container-high">
                    <MaterialIcon name="file_download" size="sm" />
                    Export
                </button>
            </div>
        </div>
    );
}
