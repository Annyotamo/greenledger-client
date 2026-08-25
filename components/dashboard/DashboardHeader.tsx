import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { DATE_RANGE_LABEL } from "@/lib/dashboard/data";

export function DashboardHeader() {
    return (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
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
