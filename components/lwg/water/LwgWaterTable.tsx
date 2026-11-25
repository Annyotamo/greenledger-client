// components/lwg/water/LwgWaterTable.tsx
"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useDeleteLwgWater, useLwgDepartments, useLwgWater } from "@/lib/lwg/hooks";
import {
    LWG_WATER_SOURCE_LABELS,
    type LwgWater,
    type LwgWaterSource,
} from "@/lib/lwg/types";
import { formatMonthDisplay } from "@/lib/lwg/utils";
import { cn } from "@/lib/utils/cn";
import { LwgWaterDrawer } from "./LwgWaterDrawer";

interface LwgWaterTableProps {
    initialMonth?: string;
}

export function LwgWaterTable({ initialMonth }: LwgWaterTableProps) {
    const { data: records = [], isLoading, isError, error } = useLwgWater();
    const { data: departments = [] } = useLwgDepartments();
    const deleteMutation = useDeleteLwgWater();

    const [selectedRecord, setSelectedRecord] = useState<LwgWater | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [sourceFilter, setSourceFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "fresh" | "recycled">("all");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter records
    const filteredRecords = records.filter((r) => {
        if (sourceFilter !== "all" && r.source !== sourceFilter) return false;
        if (typeFilter === "fresh" && !r.isFreshWater) return false;
        if (typeFilter === "recycled" && !r.isRecycled) return false;
        return true;
    });

    // Summary calculations
    const totalM3 = records.reduce((acc, r) => acc + (r.volumeM3 || 0), 0);
    const freshM3 = records
        .filter((r) => r.isFreshWater)
        .reduce((acc, r) => acc + (r.volumeM3 || 0), 0);
    const recycledM3 = records
        .filter((r) => r.isRecycled)
        .reduce((acc, r) => acc + (r.volumeM3 || 0), 0);
    const recyclingPercent = totalM3 > 0 ? (recycledM3 / totalM3) * 100 : 0;

    const handleOpenCreate = () => {
        setSelectedRecord(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (rec: LwgWater) => {
        setSelectedRecord(rec);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await deleteMutation.mutateAsync(id);
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("Failed to delete water record", err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-5">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3.5 sm:p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Total Water Intake (m³)
                    </span>
                    <p className="font-mono text-2xl font-bold text-primary mt-1 tabular-nums">
                        {totalM3.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        {(totalM3 * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} Litres
                    </p>
                </div>

                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3.5 sm:p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Fresh Water Intake (m³)
                    </span>
                    <p className="font-mono text-2xl font-bold text-cyan-800 mt-1 tabular-nums">
                        {freshM3.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        Borewell, municipal, tanker
                    </p>
                </div>

                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3.5 sm:p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Recycled Water Share
                    </span>
                    <p className="font-mono text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
                        {recyclingPercent.toFixed(1)}%
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        {recycledM3.toFixed(1)} m³ from ETP / CETP
                    </p>
                </div>

                <div className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-3.5 sm:p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Logged Water Records
                    </span>
                    <p className="font-mono text-2xl font-bold text-primary mt-1 tabular-nums">
                        {records.length}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        Flow meters & recycled logs
                    </p>
                </div>
            </div>

            {/* Master Table Card */}
            <Card className="overflow-hidden">
                <CardHeader bordered tone="strip">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                                <MaterialIcon name="water_drop" size="xs" />
                            </div>
                            <div>
                                <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                    Monthly Water Consumption Master Log (Section 11)
                                </h3>
                                <p className="font-sans text-xs text-on-surface-variant">
                                    Borewell extraction, municipal supply, and recycled wastewater balances.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Fresh / Recycled Toggle */}
                            <div className="flex items-center rounded-lg border border-outline-variant bg-surface p-0.5 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setTypeFilter("all")}
                                    className={cn(
                                        "px-2.5 py-1 rounded-md font-medium transition-colors",
                                        typeFilter === "all"
                                            ? "bg-surface-container-high text-primary shadow-2xs font-semibold"
                                            : "text-on-surface-variant hover:text-primary",
                                    )}>
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTypeFilter("fresh")}
                                    className={cn(
                                        "px-2.5 py-1 rounded-md font-medium transition-colors",
                                        typeFilter === "fresh"
                                            ? "bg-surface-container-high text-primary shadow-2xs font-semibold"
                                            : "text-on-surface-variant hover:text-primary",
                                    )}>
                                    Fresh Water
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTypeFilter("recycled")}
                                    className={cn(
                                        "px-2.5 py-1 rounded-md font-medium transition-colors",
                                        typeFilter === "recycled"
                                            ? "bg-surface-container-high text-primary shadow-2xs font-semibold"
                                            : "text-on-surface-variant hover:text-primary",
                                    )}>
                                    Recycled ({recyclingPercent.toFixed(0)}%)
                                </button>
                            </div>

                            {/* Source Filter */}
                            <select
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                                className="rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 font-sans text-xs text-primary focus:outline-none focus:ring-1 focus:ring-cyan-600">
                                <option value="all">All Sources ({records.length})</option>
                                <option value="borewell">Groundwater / Borewell</option>
                                <option value="municipal_supply">Municipal Supply</option>
                                <option value="tanker">Private Tanker</option>
                                <option value="rainwater_harvested">Rainwater</option>
                                <option value="recycled_own_etp">Recycled (Own ETP)</option>
                                <option value="recycled_cetp">Recycled (CETP)</option>
                            </select>

                            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                                <MaterialIcon name="add" size="xs" />
                                <span>Log Water Intake</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-0">
                    {/* Error message */}
                    {isError && (
                        <div className="m-4 flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 p-3 text-xs text-error">
                            <MaterialIcon name="error" size="xs" className="mt-0.5 shrink-0" />
                            <span>Failed to load water records: {error?.message}</span>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant/60 bg-surface-container-low text-on-surface-variant font-semibold">
                                    <th className="py-3 px-4">Audit Month</th>
                                    <th className="py-3 px-4">Water Source</th>
                                    <th className="py-3 px-4">Classification</th>
                                    <th className="py-3 px-4 text-right">Volume (m³)</th>
                                    <th className="py-3 px-4 text-right">Volume (Litres)</th>
                                    <th className="py-3 px-4">Meter Device ID</th>
                                    <th className="py-3 px-4">Department Allocation</th>
                                    <th className="py-3 px-4 text-center">Meter Photo</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40">
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            <td className="py-3.5 px-4"><div className="h-4 w-20 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4"><div className="h-4 w-28 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4"><div className="h-4 w-20 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-14 rounded bg-surface-container-high ml-auto" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-16 rounded bg-surface-container-high ml-auto" /></td>
                                            <td className="py-3.5 px-4"><div className="h-4 w-24 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4"><div className="h-4 w-24 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4 text-center"><div className="h-4 w-12 rounded bg-surface-container-high mx-auto" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-12 rounded bg-surface-container-high ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-on-surface-variant">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <MaterialIcon name="water_drop" size="lg" className="text-on-surface-variant/40" />
                                                <p className="font-semibold text-primary">No water records found</p>
                                                <p className="text-xs text-on-surface-variant max-w-sm">
                                                    Log your monthly flow meters, borewell extraction, and treated recycling logs.
                                                </p>
                                                <Button variant="secondary" size="sm" onClick={handleOpenCreate} className="mt-2">
                                                    <MaterialIcon name="add" size="xs" />
                                                    Log First Water Month
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
                                            <td className="py-3 px-4 font-semibold text-primary">
                                                {LWG_WATER_SOURCE_LABELS[rec.source] || rec.source}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                                                        rec.isRecycled
                                                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                            : "bg-cyan-50 text-cyan-800 border border-cyan-200",
                                                    )}>
                                                    {rec.isRecycled ? "Recycled" : "Fresh Water"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-bold text-primary tabular-nums">
                                                {rec.volumeM3.toFixed(1)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-on-surface-variant tabular-nums">
                                                {(rec.volumeM3 * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-xs text-primary">
                                                {rec.meterId || <span className="text-on-surface-variant/50">—</span>}
                                            </td>
                                            <td className="py-3 px-4 text-on-surface-variant">
                                                {rec.departmentName || "Whole Site"}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {rec.meterPhotoFileKey ? (
                                                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                                                        <MaterialIcon name="photo_camera" size="xs" />
                                                        Attached
                                                    </span>
                                                ) : rec.source === "borewell" ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-error">
                                                        <MaterialIcon name="error" size="xs" />
                                                        Missing Photo
                                                    </span>
                                                ) : (
                                                    <span className="text-on-surface-variant/50">—</span>
                                                )}
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
                                        <td className="py-3 px-4 font-display">Total Water Balance</td>
                                        <td colSpan={2} className="py-3 px-4 text-on-surface-variant font-normal">
                                            {filteredRecords.length} records ({recyclingPercent.toFixed(1)}% Recycled)
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono tabular-nums text-cyan-900 text-sm">
                                            {totalM3.toFixed(1)} m³
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono tabular-nums text-on-surface-variant">
                                            {(totalM3 * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} L
                                        </td>
                                        <td colSpan={4} className="py-3 px-4 text-right text-on-surface-variant text-[11px]">
                                            LWG Section 11 Total
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Water Upsert Drawer */}
            <LwgWaterDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedRecord(null);
                }}
                initialMonth={initialMonth}
                waterRecord={selectedRecord}
            />
        </div>
    );
}
