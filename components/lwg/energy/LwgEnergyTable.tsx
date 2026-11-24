// components/lwg/energy/LwgEnergyTable.tsx
"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useDeleteLwgEnergy, useLwgDepartments, useLwgEnergy } from "@/lib/lwg/hooks";
import {
    LWG_ENERGY_SOURCE_LABELS,
    type LwgEnergy,
    type LwgEnergySource,
} from "@/lib/lwg/types";
import { formatMonthDisplay } from "@/lib/lwg/utils";
import { cn } from "@/lib/utils/cn";
import { LwgEnergyDrawer } from "./LwgEnergyDrawer";

interface LwgEnergyTableProps {
    initialMonth?: string;
}

export function LwgEnergyTable({ initialMonth }: LwgEnergyTableProps) {
    const { data: records = [], isLoading, isError, error } = useLwgEnergy();
    const { data: departments = [] } = useLwgDepartments();
    const deleteMutation = useDeleteLwgEnergy();

    const [selectedRecord, setSelectedRecord] = useState<LwgEnergy | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [sourceFilter, setSourceFilter] = useState<string>("all");
    const [deptFilter, setDeptFilter] = useState<string>("all");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter records
    const filteredRecords = records.filter((r) => {
        if (sourceFilter !== "all" && r.source !== sourceFilter) return false;
        if (deptFilter !== "all") {
            if (deptFilter === "whole_site" && r.departmentId !== null) return false;
            if (deptFilter !== "whole_site" && r.departmentId !== deptFilter) return false;
        }
        return true;
    });

    // Summary calculations
    const totalGj = records.reduce((acc, r) => acc + (r.energyGj || 0), 0);
    const renewableGj = records
        .filter((r) => r.isRenewable)
        .reduce((acc, r) => acc + (r.energyGj || 0), 0);
    const fossilGj = totalGj - renewableGj;
    const renewablePercent = totalGj > 0 ? (renewableGj / totalGj) * 100 : 0;

    const handleOpenCreate = () => {
        setSelectedRecord(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (rec: LwgEnergy) => {
        setSelectedRecord(rec);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await deleteMutation.mutateAsync(id);
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("Failed to delete energy entry", err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-5">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-outline-variant bg-surface p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Total Energy Consumption (GJ)
                    </span>
                    <p className="font-mono text-2xl font-bold text-primary mt-1 tabular-nums">
                        {totalGj.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        Across all electricity & fuels
                    </p>
                </div>

                <div className="rounded-2xl border border-outline-variant bg-surface p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Renewable Energy Share
                    </span>
                    <p className="font-mono text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
                        {renewablePercent.toFixed(1)}%
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        {renewableGj.toFixed(1)} GJ clean power
                    </p>
                </div>

                <div className="rounded-2xl border border-outline-variant bg-surface p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Fossil Fuel Energy (GJ)
                    </span>
                    <p className="font-mono text-2xl font-bold text-amber-800 mt-1 tabular-nums">
                        {fossilGj.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        Grid, diesel, furnace oil, PNG
                    </p>
                </div>

                <div className="rounded-2xl border border-outline-variant bg-surface p-4 shadow-2xs">
                    <span className="font-sans text-[11px] font-medium text-on-surface-variant">
                        Logged Energy Records
                    </span>
                    <p className="font-mono text-2xl font-bold text-primary mt-1 tabular-nums">
                        {records.length}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant/70 mt-0.5">
                        Monthly meters & challans
                    </p>
                </div>
            </div>

            {/* Master Table Card */}
            <Card className="overflow-hidden">
                <CardHeader bordered tone="strip">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                                <MaterialIcon name="bolt" size="xs" />
                            </div>
                            <div>
                                <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                    Monthly Energy Consumption Master Log (Section 10)
                                </h3>
                                <p className="font-sans text-xs text-on-surface-variant">
                                    Fuel, electricity, and on-site renewables normalized to Gigajoules (GJ).
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Source Filter */}
                            <select
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                                className="rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 font-sans text-xs text-primary focus:outline-none focus:ring-1 focus:ring-amber-600">
                                <option value="all">All Sources ({records.length})</option>
                                <option value="grid_electricity">Grid Electricity</option>
                                <option value="diesel_hsd">Diesel (HSD)</option>
                                <option value="natural_gas_png">Natural Gas (PNG)</option>
                                <option value="lpg">LPG</option>
                                <option value="solar_onsite">Solar PV</option>
                                <option value="purchased_renewable_electricity">Renewable (PPA)</option>
                                <option value="furnace_oil">Furnace Oil</option>
                                <option value="coal">Coal</option>
                                <option value="biomass_or_briquettes">Biomass</option>
                            </select>

                            {/* Department Filter */}
                            <select
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                                className="rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 font-sans text-xs text-primary focus:outline-none focus:ring-1 focus:ring-amber-600">
                                <option value="all">All Allocations</option>
                                <option value="whole_site">Whole Site</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>

                            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                                <MaterialIcon name="add" size="xs" />
                                <span>Log Energy Entry</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-0">
                    {/* Error message */}
                    {isError && (
                        <div className="m-4 flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 p-3 text-xs text-error">
                            <MaterialIcon name="error" size="xs" className="mt-0.5 shrink-0" />
                            <span>Failed to load energy records: {error?.message}</span>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant/60 bg-surface-container-low text-on-surface-variant font-semibold">
                                    <th className="py-3 px-4">Audit Month</th>
                                    <th className="py-3 px-4">Energy Source</th>
                                    <th className="py-3 px-4">Classification</th>
                                    <th className="py-3 px-4 text-right">Quantity</th>
                                    <th className="py-3 px-4">Unit</th>
                                    <th className="py-3 px-4 text-right">Energy (GJ)</th>
                                    <th className="py-3 px-4">Department Allocation</th>
                                    <th className="py-3 px-4 text-center">Proof Attached</th>
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
                                            <td className="py-3.5 px-4"><div className="h-4 w-10 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-14 rounded bg-surface-container-high ml-auto" /></td>
                                            <td className="py-3.5 px-4"><div className="h-4 w-24 rounded bg-surface-container-high" /></td>
                                            <td className="py-3.5 px-4 text-center"><div className="h-4 w-12 rounded bg-surface-container-high mx-auto" /></td>
                                            <td className="py-3.5 px-4 text-right"><div className="h-4 w-12 rounded bg-surface-container-high ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-on-surface-variant">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <MaterialIcon name="bolt" size="lg" className="text-on-surface-variant/40" />
                                                <p className="font-semibold text-primary">No energy records found</p>
                                                <p className="text-xs text-on-surface-variant max-w-sm">
                                                    Log your monthly electricity utility bills and fossil fuels or bulk ingest via Excel.
                                                </p>
                                                <Button variant="secondary" size="sm" onClick={handleOpenCreate} className="mt-2">
                                                    <MaterialIcon name="add" size="xs" />
                                                    Log First Energy Month
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
                                                {LWG_ENERGY_SOURCE_LABELS[rec.source] || rec.source}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                                                        rec.isRenewable
                                                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                            : "bg-surface-container-high text-on-surface-variant",
                                                    )}>
                                                    {rec.isRenewable ? "Renewable" : "Fossil Grid"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-semibold text-primary tabular-nums">
                                                {rec.quantity.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-on-surface-variant uppercase text-[11px]">
                                                {rec.unit}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-bold text-amber-900 tabular-nums">
                                                {rec.energyGj.toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4 text-on-surface-variant">
                                                {rec.departmentName || "Whole Site"}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {rec.billProofFileKey ? (
                                                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                                                        <MaterialIcon name="task_alt" size="xs" />
                                                        Yes
                                                    </span>
                                                ) : rec.source === "purchased_renewable_electricity" ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-error">
                                                        <MaterialIcon name="error" size="xs" />
                                                        Missing
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
                                        <td className="py-3 px-4 font-display">Total Site Energy</td>
                                        <td colSpan={4} className="py-3 px-4 text-on-surface-variant font-normal">
                                            {filteredRecords.length} records ({renewablePercent.toFixed(1)}% Renewable)
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-950 text-sm">
                                            {totalGj.toFixed(2)} GJ
                                        </td>
                                        <td colSpan={3} className="py-3 px-4 text-right text-on-surface-variant text-[11px]">
                                            LWG Section 10 Total
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Energy Upsert Drawer */}
            <LwgEnergyDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedRecord(null);
                }}
                initialMonth={initialMonth}
                energyRecord={selectedRecord}
            />
        </div>
    );
}
