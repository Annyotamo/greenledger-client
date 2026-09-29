"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CBAMSourceStream, CBAMStreamMethod } from "@/lib/cbam/types";

interface CBAMSourceStreamsTableProps {
    streams: CBAMSourceStream[];
    isLoading?: boolean;
    onAddStream: () => void;
    onEditStream: (stream: CBAMSourceStream) => void;
    onDeleteStream: (streamId: string) => void;
}

export function CBAMSourceStreamsTable({
    streams,
    isLoading,
    onAddStream,
    onEditStream,
    onDeleteStream,
}: CBAMSourceStreamsTableProps) {
    const [search, setSearch] = useState("");
    const [methodFilter, setMethodFilter] = useState<string>("");

    const filteredStreams = useMemo(() => {
        return streams.filter((stream) => {
            if (methodFilter && stream.method !== methodFilter) return false;
            if (search) {
                const query = search.toLowerCase();
                const matchName = stream.name.toLowerCase().includes(query);
                const matchIpcc = (stream.ipcc_fuel_name || "").toLowerCase().includes(query);
                if (!matchName && !matchIpcc) return false;
            }
            return true;
        });
    }, [streams, search, methodFilter]);

    // Totals of currently visible streams
    const visibleTotals = useMemo(() => {
        let fossilCo2 = 0;
        let bioCo2 = 0;
        let fossilTj = 0;
        let bioTj = 0;

        filteredStreams.forEach((s) => {
            fossilCo2 += s.fossil_co2_emissions || 0;
            bioCo2 += s.biomass_co2_emissions || 0;
            fossilTj += s.energy_content_fossil_tj || 0;
            bioTj += s.energy_content_bio_tj || 0;
        });

        return { fossilCo2, bioCo2, fossilTj, bioTj, totalCo2: fossilCo2 + bioCo2 };
    }, [filteredStreams]);

    return (
        <Card className="p-5 border-outline-variant/60 shadow-sm space-y-4">
            {/* Table Header & Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="tune" size="sm" className="text-emerald-700" />
                        <h3 className="font-display text-base font-bold text-slate-900">
                            Source Streams & Emissions Accounting (Sheet B_EmInst)
                        </h3>
                        <span className="rounded bg-emerald-100 text-emerald-900 px-2 py-0.5 font-sans text-xs font-bold tabular-nums">
                            {streams.length} / 75 Slots
                        </span>
                    </div>
                    <p className="font-sans text-xs text-slate-500 mt-0.5">
                        Deterministic EU CBAM emission calculations across Combustion and Mass Balance carbon streams.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAddStream}
                        className="gap-1.5 font-sans text-xs font-semibold">
                        <MaterialIcon name="add" size="xs" />
                        <span>Add Source Stream</span>
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 font-sans text-xs pt-1">
                <div className="sm:col-span-2">
                    <div className="relative">
                        <MaterialIcon
                            name="search"
                            size="sm"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[16px]"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by stream name or fuel..."
                            className="w-full rounded-lg border border-outline-variant bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div>
                    <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="">All Methodologies</option>
                        <option value="Combustion">Combustion Fuels</option>
                        <option value="Mass balance">Mass Balance (Carbon)</option>
                    </select>
                </div>
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto rounded-lg border border-outline-variant/40">
                <Table>
                    <TableHeader className="bg-surface-container-low">
                        <TableRow>
                            <TableHead className="w-12 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Slot
                            </TableHead>
                            <TableHead className="w-28 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Method
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Stream Name
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                                Activity Data
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Technical Parameters
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                                Fossil CO₂ (t)
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                                Biomass CO₂ (t)
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                                Energy (TJ)
                            </TableHead>
                            <TableHead className="w-20 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-12 font-sans text-xs text-slate-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span>Loading CBAM source streams...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredStreams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-12 font-sans text-xs text-slate-500">
                                    <div className="space-y-2">
                                        <MaterialIcon name="tune" size="lg" className="text-slate-300 mx-auto" />
                                        <p className="font-medium text-slate-700">No source streams match your filters</p>
                                        <p className="text-[11px] text-slate-400">
                                            Click &ldquo;Add Source Stream&rdquo; to configure combustion fuels or mass balance inputs/outputs.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStreams.map((stream) => {
                                const isCombustion = stream.method === "Combustion";
                                const isNegative = stream.activity_data < 0;

                                return (
                                    <TableRow key={stream.id} className="hover:bg-surface-container-low/50 font-sans text-xs">
                                        <TableCell className="font-bold text-slate-900 tabular-nums">
                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                                                #{stream.slot_number}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-sans text-[10px] font-bold ${
                                                    isCombustion
                                                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                                                        : "bg-amber-50 text-amber-900 border border-amber-200"
                                                }`}>
                                                <MaterialIcon
                                                    name={isCombustion ? "local_fire_department" : "balance"}
                                                    size="xs"
                                                    className="!text-[12px]"
                                                />
                                                {stream.method}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-slate-900">{stream.name}</div>
                                            {stream.ipcc_fuel_name && (
                                                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <span className="font-medium text-emerald-700">IPCC:</span> {stream.ipcc_fuel_name}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            <span
                                                className={`font-semibold ${
                                                    isNegative ? "text-amber-800 font-bold" : "text-slate-900"
                                                }`}>
                                                {stream.activity_data.toLocaleString("en-US", {
                                                    minimumFractionDigits: 1,
                                                    maximumFractionDigits: 3,
                                                })}
                                            </span>{" "}
                                            <span className="text-[11px] text-slate-500">{stream.activity_unit}</span>
                                        </TableCell>
                                        <TableCell>
                                            {isCombustion ? (
                                                <div className="space-y-0.5 text-[11px] text-slate-600">
                                                    {stream.ncv !== null && stream.ncv !== undefined && (
                                                        <span className="tabular-nums mr-2">NCV: {stream.ncv} GJ/t</span>
                                                    )}
                                                    {stream.emission_factor !== null && stream.emission_factor !== undefined && (
                                                        <span className="tabular-nums">
                                                            EF: {stream.emission_factor} {stream.emission_factor_unit}
                                                        </span>
                                                    )}
                                                    {stream.biomass_fraction > 0 && (
                                                        <span className="ml-2 text-emerald-700 font-medium tabular-nums">
                                                            Bio: {stream.biomass_fraction}%
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-0.5 text-[11px] text-slate-600">
                                                    <span className="tabular-nums">
                                                        Carbon Content: {(stream.carbon_content ?? 0) * 100}%
                                                    </span>
                                                    <span className="ml-2 text-slate-400 tabular-nums">(Factor 3.664)</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-slate-900 tabular-nums">
                                            {stream.fossil_co2_emissions.toLocaleString("en-US", {
                                                minimumFractionDigits: 1,
                                                maximumFractionDigits: 2,
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right text-emerald-700 font-semibold tabular-nums">
                                            {stream.biomass_co2_emissions > 0
                                                ? stream.biomass_co2_emissions.toLocaleString("en-US", {
                                                      minimumFractionDigits: 1,
                                                      maximumFractionDigits: 2,
                                                  })
                                                : "—"}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-700 tabular-nums">
                                            {stream.energy_content_fossil_tj > 0
                                                ? stream.energy_content_fossil_tj.toLocaleString("en-US", {
                                                      minimumFractionDigits: 1,
                                                      maximumFractionDigits: 2,
                                                  })
                                                : "—"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onEditStream(stream)}
                                                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                                    title="Edit Stream">
                                                    <MaterialIcon name="edit" size="xs" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteStream(stream.id)}
                                                    className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                                    title="Delete Stream">
                                                    <MaterialIcon name="delete" size="xs" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Table Footer Summary Row */}
            {filteredStreams.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-surface-container-low/70 p-3 border border-outline-variant/30 font-sans text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Total Direct Stream Emissions:</span>
                        <span className="font-display text-sm font-bold text-emerald-800 tabular-nums">
                            {visibleTotals.totalCo2.toLocaleString("en-US", {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 2,
                            })}{" "}
                            t CO₂
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-600">
                        <span>
                            Fossil: <strong className="tabular-nums text-slate-900">{visibleTotals.fossilCo2.toLocaleString("en-US", { maximumFractionDigits: 1 })} t</strong>
                        </span>
                        <span>
                            Biomass: <strong className="tabular-nums text-emerald-700">{visibleTotals.bioCo2.toLocaleString("en-US", { maximumFractionDigits: 1 })} t</strong>
                        </span>
                        <span>
                            Energy: <strong className="tabular-nums text-blue-900">{(visibleTotals.fossilTj + visibleTotals.bioTj).toLocaleString("en-US", { maximumFractionDigits: 1 })} TJ</strong>
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );
}
