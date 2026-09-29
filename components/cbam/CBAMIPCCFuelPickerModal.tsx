"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCbamIpccFuels } from "@/lib/cbam/hooks";
import type { CBAMIPCCFuel } from "@/lib/cbam/types";

interface CBAMIPCCFuelPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectFuel: (fuel: CBAMIPCCFuel) => void;
}

export function CBAMIPCCFuelPickerModal({ isOpen, onClose, onSelectFuel }: CBAMIPCCFuelPickerModalProps) {
    const [search, setSearch] = useState("");
    const { data: fuels = [], isLoading } = useCbamIpccFuels();

    const filteredFuels = useMemo(() => {
        if (!search) return fuels;
        const q = search.toLowerCase();
        return fuels.filter(
            (f) =>
                f.fuel_name.toLowerCase().includes(q) ||
                f.unit_symbol.toLowerCase().includes(q) ||
                f.unit_name.toLowerCase().includes(q),
        );
    }, [fuels, search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                            <MaterialIcon name="local_gas_station" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold text-slate-900">
                                Select Standard IPCC Combustion Fuel
                            </h3>
                            <p className="font-sans text-xs text-slate-500">
                                Default EU CBAM fallback emission factors for combustion fuels.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-slate-200 bg-white">
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
                            placeholder="Search IPCC fuel name (e.g. anthracite, natural gas, diesel, coal, coke)..."
                            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 font-sans text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Fuels Table Container */}
                <div className="flex-1 overflow-y-auto max-h-[50vh] p-4">
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        Fuel Name
                                    </TableHead>
                                    <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        Unit
                                    </TableHead>
                                    <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                                        Default Factor (t CO₂/unit)
                                    </TableHead>
                                    <TableHead className="w-24 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 font-sans text-xs text-slate-500">
                                            Loading IPCC fuels catalog...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredFuels.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 font-sans text-xs text-slate-500">
                                            No IPCC fuels found matching &ldquo;{search}&rdquo;
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFuels.map((fuel) => (
                                        <TableRow
                                            key={fuel.id}
                                            className="hover:bg-slate-50/80 font-sans text-xs transition-colors">
                                            <TableCell className="font-semibold text-slate-900">
                                                {fuel.fuel_name}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                                    {fuel.unit_symbol}
                                                </span>{" "}
                                                <span className="text-slate-400">({fuel.unit_name})</span>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-slate-900 tabular-nums">
                                                {fuel.default_ef_tco2_per_unit.toFixed(5)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        onSelectFuel(fuel);
                                                        onClose();
                                                    }}
                                                    className="font-sans text-xs font-semibold text-emerald-800 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                                                    Select
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 bg-slate-50/50">
                    <span className="font-sans text-xs text-slate-500 tabular-nums">
                        Showing {filteredFuels.length} IPCC fuels
                    </span>
                    <Button variant="secondary" size="sm" onClick={onClose} className="font-sans text-xs">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
