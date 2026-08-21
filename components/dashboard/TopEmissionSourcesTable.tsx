"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TopEmissionSourceItem } from "@/lib/dashboard/types";

type TopEmissionSourcesTableProps = {
    sources: TopEmissionSourceItem[];
};

export function TopEmissionSourcesTable({ sources }: TopEmissionSourcesTableProps) {
    if (!sources || sources.length === 0) {
        return (
            <div className="bg-white border border-outline-variant rounded-lg p-card-padding h-full flex items-center justify-center text-center text-on-surface-variant font-mono text-xs">
                No top emission sources data available.
            </div>
        );
    }

    const getScopeBadgeStyle = (scope: string) => {
        if (scope.includes("1")) return "bg-orange-50 text-orange-700 border-orange-200";
        if (scope.includes("2")) return "bg-blue-50 text-blue-700 border-blue-200";
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    };

    return (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full shadow-2xs">
            {/* Header Strip */}
            <div className="px-card-padding py-4 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="military_tech" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-primary uppercase tracking-tight">
                            Top Emission Sources Across All Scopes
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                            Ranked drivers by contribution
                        </p>
                    </div>
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-primary px-2.5 py-1 rounded">
                    Top {sources.length} Drivers
                </span>
            </div>

            <div className="overflow-x-auto flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-surface-container-low border-b border-outline-variant">
                            <TableHead className="w-14 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Rank</TableHead>
                            <TableHead className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Emission Source</TableHead>
                            <TableHead className="text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Scope</TableHead>
                            <TableHead className="text-right font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Emissions (tCO2e)</TableHead>
                            <TableHead className="text-right font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Share (%)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sources.map((item) => (
                            <TableRow key={item.rank} className="hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/30">
                                <TableCell className="text-center font-mono font-bold text-xs">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface-container text-primary font-bold text-[11px]">
                                        {item.rank}
                                    </span>
                                </TableCell>
                                <TableCell className="font-sans font-bold text-primary text-xs">
                                    {item.sourceName}
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className={`inline-block font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getScopeBadgeStyle(item.scopeName)}`}>
                                        {item.scopeName}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-mono font-bold text-xs text-primary">
                                    {item.tco2e.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO2e
                                </TableCell>
                                <TableCell className="text-right font-mono text-xs font-semibold text-on-surface-variant">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden hidden sm:block">
                                            <div
                                                className="bg-primary h-full rounded-full"
                                                style={{ width: `${Math.min(100, Math.max(0, item.sharePct))}%` }}
                                            />
                                        </div>
                                        <span>{item.sharePct.toFixed(1)}%</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
