"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CBAMProductionProcess } from "@/lib/cbam/types";

interface CBAMProcessesSummaryTableProps {
    processes: CBAMProductionProcess[];
}

export function CBAMProcessesSummaryTable({ processes }: CBAMProcessesSummaryTableProps) {
    if (!processes || processes.length === 0) {
        return (
            <Card className="p-6 border-outline-variant/60">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="precision_manufacturing" size="sm" className="text-blue-700" />
                        <h3 className="font-display text-sm font-bold text-slate-900">
                            Production Processes (P1..P10)
                        </h3>
                    </div>
                    <Link href="/tenant-cbam/installation">
                        <Button variant="secondary" size="sm" className="font-sans text-xs">
                            Add Process
                        </Button>
                    </Link>
                </div>
                <p className="font-sans text-xs text-slate-500 text-center py-6">
                    No production processes defined yet. Configure up to 10 processes (P1..P10) with boundary modes in Sheet A_InstData.
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-5 border-outline-variant/60 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-3">
                <div className="flex items-center gap-2">
                    <MaterialIcon name="precision_manufacturing" size="sm" className="text-blue-700" />
                    <div>
                        <h3 className="font-display text-sm font-bold text-slate-900">
                            Production Processes (P1..P10)
                        </h3>
                        <p className="font-sans text-[11px] text-slate-500">
                            System boundaries, target categories, and precursor inclusions.
                        </p>
                    </div>
                </div>

                <Link href="/tenant-cbam/installation">
                    <Button variant="secondary" size="sm" className="gap-1 font-sans text-xs font-semibold">
                        <MaterialIcon name="tune" size="xs" />
                        <span>Manage Processes</span>
                    </Button>
                </Link>
            </div>

            <div className="overflow-x-auto rounded-lg border border-outline-variant/40">
                <Table>
                    <TableHeader className="bg-surface-container-low">
                        <TableRow>
                            <TableHead className="w-16 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                ID
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Process Name
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Target Category
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Boundary Mode
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Precursors
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processes.map((proc, idx) => (
                            <TableRow key={proc.id || `proc-${idx}`} className="hover:bg-surface-container-low/50">
                                <TableCell className="font-sans font-bold text-xs text-slate-900 tabular-nums">
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                                        {proc.process_id || `P${idx + 1}`}
                                    </span>
                                </TableCell>
                                <TableCell className="font-sans font-semibold text-xs text-slate-900">
                                    {proc.name}
                                </TableCell>
                                <TableCell className="font-sans text-xs text-slate-700">
                                    {proc.target_category_name || proc.target_category_id}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center rounded-md px-2 py-0.5 font-sans text-[11px] font-bold ${
                                            proc.boundary_mode === "DIRECT"
                                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                : "bg-purple-50 text-purple-800 border border-purple-200"
                                        }`}>
                                        {proc.boundary_mode === "DIRECT" ? "Direct Boundary" : "With Precursors"}
                                    </span>
                                </TableCell>
                                <TableCell className="font-sans text-xs text-slate-500 tabular-nums">
                                    {proc.included_precursor_ids?.length ?? 0} Precursor(s)
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
