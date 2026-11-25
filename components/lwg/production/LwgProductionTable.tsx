// components/lwg/production/LwgProductionTable.tsx
"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useDeleteLwgProduction, useLwgProduction, useLwgProfile } from "@/lib/lwg/hooks";
import {
    LWG_INPUT_MATERIAL_LABELS,
    LWG_STAGE_LABELS,
    type LwgProduction,
    type LwgStage,
} from "@/lib/lwg/types";
import { formatMonthDisplay } from "@/lib/lwg/utils";
import { cn } from "@/lib/utils/cn";
import { LwgProductionDrawer } from "./LwgProductionDrawer";

interface LwgProductionTableProps {
    initialMonth?: string;
}

export function LwgProductionTable({ initialMonth }: LwgProductionTableProps) {
    const { data: profile } = useLwgProfile();
    const { data: records = [], isLoading, isError, error } = useLwgProduction();
    const deleteMutation = useDeleteLwgProduction();

    const [selectedRecord, setSelectedRecord] = useState<LwgProduction | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [stageFilter, setStageFilter] = useState<string>("all");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter records
    const filteredRecords = records.filter((r) => {
        if (stageFilter !== "all" && r.stage !== stageFilter) return false;
        return true;
    });

    // Summary calculations
    const totalTonnes = records.reduce((acc, r) => acc + (r.inputQuantityTonnes || 0), 0);
    const totalM2 = records.reduce((acc, r) => acc + (r.outputQuantityM2 || 0), 0);
    const totalSqft = records.reduce((acc, r) => acc + (r.outputQuantitySqft || 0), 0);

    const handleOpenCreate = () => {
        setSelectedRecord(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (rec: LwgProduction) => {
        setSelectedRecord(rec);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await deleteMutation.mutateAsync(id);
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("Failed to delete production entry", err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-5">
            {/* Top KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3.5 sm:p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Total 24M Normalized Area (m²)
                    </span>
                    <p className="font-mono text-2xl font-bold text-primary mt-1 tabular-nums">
                        {totalM2.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        Protocol Issue 7 Audit Metric
                    </p>
                </div>

                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3.5 sm:p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Total 24M Output (sq ft)
                    </span>
                    <p className="font-mono text-2xl font-bold text-primary mt-1 tabular-nums">
                        {totalSqft.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        Commercial Trade Unit
                    </p>
                </div>

                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3.5 sm:p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Raw Material Input (Tonnes)
                    </span>
                    <p className="font-mono text-2xl font-bold text-primary mt-1 tabular-nums">
                        {totalTonnes.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        Hides, wet blue, crust input
                    </p>
                </div>

                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3.5 sm:p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Logged Audit Records
                    </span>
                    <p className="font-mono text-2xl font-bold text-primary mt-1 tabular-nums">
                        {records.length} / 24
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        {records.length >= 24 ? "100% 24M Complete" : `${24 - records.length} months remaining`}
                    </p>
                </div>
            </div>

            {/* Master Table Card */}
            <Card className="overflow-hidden">
                <CardHeader bordered tone="strip">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                                <MaterialIcon name="table_chart" size="xs" />
                            </div>
                            <div>
                                <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                    24-Month Production Master Log (Section 5)
                                </h3>
                                <p className="font-sans text-xs text-on-surface-variant">
                                    Historical material throughput and area denominators.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Stage filter */}
                            <select
                                value={stageFilter}
                                onChange={(e) => setStageFilter(e.target.value)}
                                className="rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 font-sans text-xs text-primary focus:outline-none focus:ring-1 focus:ring-blue-600">
                                <option value="all">All Stages ({records.length})</option>
                                <option value="stage_1_raw_to_wetblue">Stage 1 (Beamhouse)</option>
                                <option value="stage_2_wetblue_to_crust">Stage 2 (Re-tanning)</option>
                                <option value="stage_3_crust_to_finish">Stage 3 (Finishing)</option>
                            </select>

                            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                                <MaterialIcon name="add" size="xs" />
                                <span>Log Month Entry</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-0">
                    {/* Error message */}
                    {isError && (
                        <div className="m-4 flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 p-3 text-xs text-error">
                            <MaterialIcon name="error" size="xs" className="mt-0.5 shrink-0" />
                            <span>Failed to load production records: {error?.message}</span>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant/60 bg-surface-container-low text-on-surface-variant font-semibold">
                                    <th className="py-3 px-4">Audit Month</th>
                                    <th className="py-3 px-4">Stage</th>
                                    <th className="py-3 px-4">Input Material</th>
                                    <th className="py-3 px-4 text-right">Input (Tonnes)</th>
                                    <th className="py-3 px-4 text-right">Output (m²)</th>
                                    <th className="py-3 px-4 text-right">Output (sq ft)</th>
                                    <th className="py-3 px-4 text-right">Sold Area</th>
                                    <th className="py-3 px-4">Notes</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40">
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            <td className="py-3.5 px-4"><div className="h-4 w-20 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4"><div className="h-4 w-28 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4"><div className="h-4 w-24 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-14 rounded bg-surface-container-high ml-auto" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-16 rounded bg-surface-container-high ml-auto" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-16 rounded bg-surface-container-high ml-auto" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-12 rounded bg-surface-container-high ml-auto" /></td>
                                            <td className="py-3.5 px-4"><div className="h-4 w-32 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-12 rounded bg-surface-container-high ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-on-surface-variant">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <MaterialIcon name="inventory" size="lg" className="text-on-surface-variant/40" />
                                                <p className="font-semibold text-primary">No production entries logged yet</p>
                                                <p className="text-xs text-on-surface-variant max-w-sm">
                                                    Log your monthly production throughput or use Bulk Excel Ingest to import all 24 months.
                                                </p>
                                                <Button variant="secondary" size="sm" onClick={handleOpenCreate} className="mt-2">
                                                    <MaterialIcon name="add" size="xs" />
                                                    Log First Month
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecords.map((rec) => (
                                        <tr key={rec.id} className="hover:bg-surface-container-lowest/70 transition-colors">
                                            <td className="py-3 px-4 font-mono font-bold text-primary">
                                                {formatMonthDisplay(rec.month)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex rounded-md bg-blue-50 text-blue-800 border border-blue-200/60 px-2 py-0.5 text-[11px] font-medium">
                                                    {LWG_STAGE_LABELS[rec.stage] || rec.stage}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-on-surface-variant">
                                                {LWG_INPUT_MATERIAL_LABELS[rec.inputMaterial] || rec.inputMaterial}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-semibold text-primary tabular-nums">
                                                {rec.inputQuantityTonnes.toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-bold text-primary tabular-nums">
                                                {rec.outputQuantityM2.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-on-surface-variant tabular-nums">
                                                {rec.outputQuantitySqft.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-on-surface-variant tabular-nums">
                                                {rec.soldAtStageM2 > 0
                                                    ? rec.soldAtStageM2.toLocaleString(undefined, { maximumFractionDigits: 1 })
                                                    : "—"}
                                            </td>
                                            <td className="py-3 px-4 text-on-surface-variant max-w-xs truncate">
                                                {rec.notes || "—"}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {confirmDeleteId === rec.id ? (
                                                    <div className="flex items-center justify-end gap-1.5 animate-fade-in">
                                                        <span className="text-[11px] text-error font-medium">Delete?</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(rec.id)}
                                                            disabled={deletingId === rec.id}
                                                            className="rounded px-2 py-1 text-[11px] font-bold bg-error text-white hover:bg-error/90 transition-colors">
                                                            {deletingId === rec.id ? "..." : "Yes"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="rounded px-2 py-1 text-[11px] font-medium bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors">
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEdit(rec)}
                                                            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                                                            title="Edit record">
                                                            <MaterialIcon name="edit" size="xs" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmDeleteId(rec.id)}
                                                            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                                                            title="Delete record">
                                                            <MaterialIcon name="delete" size="xs" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {filteredRecords.length > 0 && (
                                <tfoot>
                                    <tr className="border-t-2 border-outline-variant bg-surface-container-low font-bold text-primary">
                                        <td className="py-3 px-4 font-display">Total Sum</td>
                                        <td colSpan={2} className="py-3 px-4 text-on-surface-variant font-normal">
                                            {filteredRecords.length} records
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                                            {totalTonnes.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-800">
                                            {totalM2.toLocaleString(undefined, { maximumFractionDigits: 1 })} m²
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                                            {totalSqft.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft
                                        </td>
                                        <td colSpan={3} className="py-3 px-4 text-right text-on-surface-variant text-[11px]">
                                            Production Denominator Baseline
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Production Upsert Drawer / Modal */}
            <LwgProductionDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedRecord(null);
                }}
                initialMonth={initialMonth}
                productionRecord={selectedRecord}
            />
        </div>
    );
}
