"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useBrsrEnergyConsumption } from "@/lib/brsr/hooks";
import { getBrsrEnergyReport } from "@/lib/brsr/api";
import { BrsrEnergyReportModal } from "@/components/brsr/BrsrEnergyReportModal";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function BrsrEnergyPage() {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [turnover, setTurnover] = useState<number | null>(null);
    const [physicalOutput, setPhysicalOutput] = useState<number | null>(null);
    const [physicalOutputUnit, setPhysicalOutputUnit] = useState<string>("");

    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);

    // Active filters used for the API query
    const [activeFilters, setActiveFilters] = useState<{
        start_date: string | null;
        end_date: string | null;
        turnover_inr: number | null;
        physical_output?: number | null;
        physical_output_tonnes?: number | null;
        physical_output_unit?: string | null;
    }>({
        start_date: "2025-04-01",
        end_date: "2026-04-30",
        turnover_inr: 1000000.00,
        physical_output: 100.00,
        physical_output_tonnes: 100.00,
        physical_output_unit: "tcs",
    });

    const { data, isPending, isError, error } = useBrsrEnergyConsumption(activeFilters);

    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Collapsed by default

    // Disabled prepopulating default filters to keep inputs empty initially
    useEffect(() => {
        // Keeps fields empty
    }, []);

    const {
        totals = {
            renewable_electricity_gj: "0",
            renewable_fuel_gj: "0",
            renewable_other_gj: "0",
            renewable_total_gj: "0",
            non_renewable_electricity_gj: "0",
            non_renewable_fuel_gj: "0",
            non_renewable_other_gj: "0",
            non_renewable_total_gj: "0",
            grand_total_gj: "0",
            energy_intensity_per_inr: null,
            energy_intensity_ppp: null,
            energy_intensity_physical: null,
            energy_intensity_physical_unit: null,
            fuel_activity_count: 0,
            electricity_activity_count: 0,
            skipped_fuel_activity_count: 0
        },
        skipped_fuel_activities = [],
        turnover_inr = null
    } = data || {};

    const handleApplyFilters = () => {
        setActiveFilters({
            start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
            end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
            turnover_inr: turnover,
            physical_output: physicalOutput,
            physical_output_tonnes: physicalOutput,
            physical_output_unit: physicalOutputUnit || undefined,
        });
    };

    const handleResetFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setTurnover(null);
        setPhysicalOutput(null);
        setPhysicalOutputUnit("");
        setActiveFilters({
            start_date: null,
            end_date: null,
            turnover_inr: null,
            physical_output: null,
            physical_output_tonnes: null,
            physical_output_unit: "",
        });
    };

    const handleDownloadReport = async (payload: {
        start_date: string;
        end_date: string;
        turnover_inr: number;
        ppp_conversion_factor?: number;
        physical_output?: number | null;
        physical_output_tonnes?: number | null;
        physical_output_unit?: string | null;
    }) => {
        const blob = await getBrsrEnergyReport(payload);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brsr-energy-report-${payload.start_date}-to-${payload.end_date}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatGj = (val: string | number | null) => {
        if (val === null || val === undefined) return "0.00";
        const num = Number(val);
        return isNaN(num) ? "0.00" : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-up">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-outline-variant pb-6">
                <div className="space-y-2">
                    <h1 className="text-headline-lg font-bold tracking-tight text-primary">
                        BRSR Energy Consumption
                    </h1>
                    <p className="text-body-md text-on-surface-variant">
                        Principle 6 (Environmental Performance) energy usage metrics and intensity audit.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "filter_alt"} size="sm" />
                        <span>{isFilterOpen ? "Hide Controls" : "Energy Controls"}</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsDownloadOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 shadow-md">
                        <MaterialIcon name="download" size="sm" />
                        <span>Download Report</span>
                    </Button>
                </div>
            </div>

            {/* Inputs & Parameters Panel */}
            {isFilterOpen && (
            <Card>
                <CardHeader tone="strip" className="py-2.5 bg-white">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="filter_alt" size="sm" className="text-primary" />
                        <span className="font-sans text-body-sm font-bold text-on-surfac">Filter Energy Consumption Parameters</span>
                    </div>
                </CardHeader>
                <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {/* Start Date Selector */}
                        <div className="space-y-1.5 relative">
                            <label className="text-xs font-semibold text-on-surface-variant block">Start Date</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsStartOpen(!isStartOpen);
                                    setIsEndOpen(false);
                                }}
                                className="w-full flex items-center justify-between gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-left font-mono text-[12px] text-on-surface hover:bg-surface-container-high transition duration-150 bg-white">
                                <span className="flex items-center gap-2">
                                    <MaterialIcon name="calendar_today" size="sm" className="text-on-surface-variant" />
                                    {startDate ? format(startDate, "yyyy-MM-dd") : "Select Start Date"}
                                </span>
                                <MaterialIcon name="arrow_drop_down" size="sm" />
                            </button>
                            {isStartOpen && (
                                <>
                                    <button
                                        type="button"
                                        className="fixed inset-0 z-10 cursor-default bg-transparent"
                                        onClick={() => setIsStartOpen(false)}
                                        aria-label="Close calendar"
                                    />
                                    <div className="absolute left-0 top-full z-20 mt-1 shadow-2xl animate-fade-up">
                                        <Calendar
                                            date={startDate}
                                            onDateChange={(date) => {
                                                setStartDate(date);
                                                setIsStartOpen(false);
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* End Date Selector */}
                        <div className="space-y-1.5 relative">
                            <label className="text-xs font-semibold text-on-surface-variant block">End Date</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEndOpen(!isEndOpen);
                                    setIsStartOpen(false);
                                }}
                                className="w-full flex items-center justify-between gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-left font-mono text-[12px] text-on-surface hover:bg-surface-container-high transition duration-150 bg-white">
                                <span className="flex items-center gap-2">
                                    <MaterialIcon name="calendar_today" size="sm" className="text-on-surface-variant" />
                                    {endDate ? format(endDate, "yyyy-MM-dd") : "Select End Date"}
                                </span>
                                <MaterialIcon name="arrow_drop_down" size="sm" />
                            </button>
                            {isEndOpen && (
                                <>
                                    <button
                                        type="button"
                                        className="fixed inset-0 z-10 cursor-default bg-transparent"
                                        onClick={() => setIsEndOpen(false)}
                                        aria-label="Close calendar"
                                    />
                                    <div className="absolute left-0 top-full z-20 mt-1 shadow-2xl animate-fade-up">
                                        <Calendar
                                            date={endDate}
                                            onDateChange={(date) => {
                                                setEndDate(date);
                                                setIsEndOpen(false);
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Turnover INR Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="filter-turnover" className="text-xs font-semibold text-on-surface-variant block">
                                Turnover (INR)
                            </label>
                            <div className="relative flex items-center">
                                <div className="pointer-events-none absolute left-3 text-on-surface-variant/60 text-[12px] font-mono">₹</div>
                                <input
                                    id="filter-turnover"
                                    type="number"
                                    placeholder="Enter turnover..."
                                    value={turnover === null ? "" : turnover}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setTurnover(val === "" ? null : Number(val));
                                    }}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-1.5 pl-8 pr-3 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                                />
                            </div>
                        </div>

                        {/* Physical Output Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="filter-physical" className="text-xs font-semibold text-on-surface-variant block">
                                Physical Output
                            </label>
                            <input
                                id="filter-physical"
                                type="number"
                                step="any"
                                placeholder="Enter physical output..."
                                value={physicalOutput === null ? "" : physicalOutput}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setPhysicalOutput(val === "" ? null : Number(val));
                                }}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-1.5 px-3 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                            />
                        </div>

                        {/* Physical Output Unit Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="filter-physical-unit" className="text-xs font-semibold text-on-surface-variant block">
                                Physical Output Unit
                            </label>
                            <input
                                id="filter-physical-unit"
                                type="text"
                                placeholder="e.g. tonnes, tcs"
                                value={physicalOutputUnit}
                                onChange={(e) => {
                                    setPhysicalOutputUnit(e.target.value);
                                }}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-1.5 px-3 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-[12px] bg-white"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 border-t border-outline-variant/60 pt-3">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleResetFilters}
                            className="py-1.5">
                            Reset
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleApplyFilters}
                            className="min-w-[100px] py-1.5">
                            Apply
                        </Button>
                    </div>
                </CardBody>
            </Card>
            )}

            {!data && !isPending && !isError ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant shadow-lg backdrop-blur-md max-w-4xl mx-auto mt-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialIcon name="info" size="lg" className="!text-[28px]" />
                    </div>
                    <h3 className="mt-4 text-headline-sm font-bold text-primary">
                        Configure BRSR Parameters
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant max-w-md mx-auto">
                        Please specify a Start Date, End Date, and Turnover in the controls panel above, then click Apply to calculate energy consumption and intensity ratios.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">Calculating energy metrics...</p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-error/20 bg-error-container/10 p-6 text-center text-error shadow-sm">
                    <MaterialIcon name="warning" className="mx-auto mb-2 text-error" />
                    <h5 className="font-bold">Computation Error</h5>
                    <p className="text-xs mt-1 text-on-surface-variant">{error instanceof Error ? error.message : "Failed to calculate energy metrics."}</p>
                </div>
            ) : (
                <>

            {/* Overall Metrics Cards Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Grand Total */}
                <Card interactive className="border-l-4 border-l-primary">
                    <CardBody className="flex justify-between items-start">
                        <div className="space-y-1.5">
                            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Grand Total Energy
                            </p>
                            <h3 className="text-headline-md font-bold text-on-surface font-mono">
                                {formatGj(totals.grand_total_gj)} <span className="text-sm font-sans font-medium text-on-surface-variant">GJ</span>
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                                Renewable + Non-Renewable
                            </p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <MaterialIcon name="bolt" size="md" />
                        </div>
                    </CardBody>
                </Card>

                {/* Renewable Total */}
                <Card interactive className="border-l-4 border-l-secondary">
                    <CardBody className="flex justify-between items-start">
                        <div className="space-y-1.5">
                            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Renewable Total
                            </p>
                            <h3 className="text-headline-md font-bold text-secondary font-mono">
                                {formatGj(totals.renewable_total_gj)} <span className="text-sm font-sans font-medium text-on-surface-variant">GJ</span>
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                                Eco-friendly power sources
                            </p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <MaterialIcon name="energy_savings_leaf" size="md" />
                        </div>
                    </CardBody>
                </Card>

                {/* Non-Renewable Total */}
                <Card interactive className="border-l-4 border-l-amber-500">
                    <CardBody className="flex justify-between items-start">
                        <div className="space-y-1.5">
                            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Non-Renewable Total
                            </p>
                            <h3 className="text-headline-md font-bold text-amber-600 font-mono">
                                {formatGj(totals.non_renewable_total_gj)} <span className="text-sm font-sans font-medium text-on-surface-variant">GJ</span>
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                                Conventional utility power
                            </p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                            <MaterialIcon name="oil_barrel" size="md" />
                        </div>
                    </CardBody>
                </Card>

                {/* Intensity */}
                <Card interactive className="border-l-4 border-l-indigo-500">
                    <CardBody className="flex justify-between items-start">
                        <div className="space-y-1.5">
                            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                Intensity / INR
                            </p>
                            <h3 className="text-headline-md font-bold text-indigo-600 font-mono">
                                {totals.energy_intensity_per_inr !== null ? (
                                    <>
                                        {Number(totals.energy_intensity_per_inr).toFixed(6)}
                                        <span className="text-[10px] font-sans font-medium text-on-surface-variant block mt-0.5">GJ / INR</span>
                                    </>
                                ) : (
                                    "N/A"
                                )}
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                                {turnover_inr !== null ? `Based on ₹${Number(turnover_inr).toLocaleString()} turnover` : "Turnover not configured"}
                            </p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                            <MaterialIcon name="analytics" size="md" />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Bifurcated Source Details */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Renewable breakdown */}
                <Card>
                    <CardHeader tone="strip">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="eco" size="sm" className="text-secondary" />
                            <span className="font-sans text-body-md font-bold text-on-surface">Renewable Sources</span>
                        </div>
                        <Badge variant="positive" size="sm">Active</Badge>
                    </CardHeader>
                    <CardBody className="space-y-4">
                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                            <span className="text-body-sm text-on-surface-variant font-medium">Renewable Electricity</span>
                            <span className="font-mono text-body-md font-bold text-on-surface">
                                {formatGj(totals.renewable_electricity_gj)} <span className="text-xs text-on-surface-variant font-sans font-normal">GJ</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                            <span className="text-body-sm text-on-surface-variant font-medium">Renewable Fuel</span>
                            <span className="font-mono text-body-md font-bold text-on-surface">
                                {formatGj(totals.renewable_fuel_gj)} <span className="text-xs text-on-surface-variant font-sans font-normal">GJ</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between pb-1">
                            <span className="text-body-sm text-on-surface-variant font-medium">Other Renewable Sources</span>
                            <span className="font-mono text-body-md font-bold text-on-surface">
                                {formatGj(totals.renewable_other_gj)} <span className="text-xs text-on-surface-variant font-sans font-normal">GJ</span>
                            </span>
                        </div>
                    </CardBody>
                </Card>

                {/* Non-renewable breakdown */}
                <Card>
                    <CardHeader tone="strip">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="factory" size="sm" className="text-amber-500" />
                            <span className="font-sans text-body-md font-bold text-on-surface">Non-Renewable Sources</span>
                        </div>
                        <Badge variant="neutral" size="sm">Standard</Badge>
                    </CardHeader>
                    <CardBody className="space-y-4">
                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                            <span className="text-body-sm text-on-surface-variant font-medium">Grid Electricity</span>
                            <span className="font-mono text-body-md font-bold text-on-surface">
                                {formatGj(totals.non_renewable_electricity_gj)} <span className="text-xs text-on-surface-variant font-sans font-normal">GJ</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                            <span className="text-body-sm text-on-surface-variant font-medium">Utility Fuel</span>
                            <span className="font-mono text-body-md font-bold text-on-surface">
                                {formatGj(totals.non_renewable_fuel_gj)} <span className="text-xs text-on-surface-variant font-sans font-normal">GJ</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between pb-1">
                            <span className="text-body-sm text-on-surface-variant font-medium">Other Non-Renewable Sources</span>
                            <span className="font-mono text-body-md font-bold text-on-surface">
                                {formatGj(totals.non_renewable_other_gj)} <span className="text-xs text-on-surface-variant font-sans font-normal">GJ</span>
                            </span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Activity Stats Summary */}
            <div className="rounded-2xl border border-outline-variant bg-surface-container/20 p-6">
                <h4 className="font-sans text-body-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <MaterialIcon name="summarize" size="sm" />
                    Accounting Activity Summary
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <MaterialIcon name="local_gas_station" size="md" />
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant">Fuel Activities</p>
                            <p className="font-mono text-body-lg font-bold text-on-surface mt-0.5">
                                {totals.fuel_activity_count}
                            </p>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <MaterialIcon name="electric_car" size="md" />
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant">Electricity Activities</p>
                            <p className="font-mono text-body-lg font-bold text-on-surface mt-0.5">
                                {totals.electricity_activity_count}
                            </p>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${totals.skipped_fuel_activity_count > 0 ? "bg-error/10 text-error" : "bg-emerald-500/10 text-emerald-500"}`}>
                            <MaterialIcon name={totals.skipped_fuel_activity_count > 0 ? "warning_amber" : "done_all"} size="md" />
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant">Skipped Fuel Activities</p>
                            <p className={`font-mono text-body-lg font-bold mt-0.5 ${totals.skipped_fuel_activity_count > 0 ? "text-error" : "text-emerald-500"}`}>
                                {totals.skipped_fuel_activity_count}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skipped Activities Audit Log */}
            <Card>
                <CardHeader tone="strip" className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="assignment_late" size="sm" className="text-error" />
                        <span className="font-sans text-body-md font-bold text-on-surface">
                            Skipped Fuel Activities Audit Log
                        </span>
                    </div>
                    <Badge variant={skipped_fuel_activities.length > 0 ? "negative" : "positive"}>
                        {skipped_fuel_activities.length} Issues Found
                    </Badge>
                </CardHeader>
                <CardBody className="!p-0">
                    {skipped_fuel_activities.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Activity ID</TableHead>
                                        <TableHead>Fuel Type</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead className="text-error">Audit/Validation Error Reason</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {skipped_fuel_activities.map((act) => (
                                        <TableRow key={act.activity_id}>
                                            <TableCell className="font-mono text-xs max-w-[150px] truncate text-on-surface-variant" title={act.activity_id}>
                                                {act.activity_id}
                                            </TableCell>
                                            <TableCell className="font-sans text-body-sm font-semibold">
                                                {act.fuel_name}
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-bold text-on-surface">
                                                {Number(act.quantity).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                            </TableCell>
                                            <TableCell className="font-sans text-xs text-on-surface-variant">
                                                {act.quantity_unit_symbol}
                                            </TableCell>
                                            <TableCell className="text-error font-medium text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <MaterialIcon name="info_outline" size="sm" className="shrink-0" />
                                                    <span>{act.reason}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-on-surface-variant flex flex-col items-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                                <MaterialIcon name="verified" size="lg" />
                            </div>
                            <h5 className="font-sans text-body-md font-bold text-on-surface mt-2">
                                Zero Skipped Activities
                            </h5>
                            <p className="text-xs text-on-surface-variant max-w-sm">
                                All fuel activities are fully compliant, verified, and accounted for in the GJ totals.
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>
            </>
            )}

            {/* Download Dialog Modal */}
            <BrsrEnergyReportModal
                isOpen={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                onDownload={handleDownloadReport}
            />
        </div>
    );
}
