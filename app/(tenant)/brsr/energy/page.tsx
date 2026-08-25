"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useBrsrEnergyConsumption } from "@/lib/brsr/hooks";
import { getBrsrEnergyReport } from "@/lib/brsr/api";
import { BrsrEnergyReportModal } from "@/components/brsr/BrsrEnergyReportModal";
import { BrsrDocumentUploadSection } from "@/components/brsr/BrsrDocumentUploadSection";
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
        turnover_inr: 1000000.0,
        physical_output: 100.0,
        physical_output_tonnes: 100.0,
        physical_output_unit: "tcs",
    });

    const { data, isPending, isError, error } = useBrsrEnergyConsumption(activeFilters);

    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        // Keep inputs ready
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
            skipped_fuel_activity_count: 0,
        },
        skipped_fuel_activities = [],
        turnover_inr = null,
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
        a.download = `brsr-energy-report-${payload.start_date || "start"}-to-${payload.end_date || "end"}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatGj = (val: string | number | null | undefined) => {
        if (val === null || val === undefined) return "0.00";
        const num = Number(val);
        return isNaN(num) ? "0.00" : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatMwhFromGj = (val: string | number | null | undefined) => {
        if (val === null || val === undefined) return "0.00";
        const num = Number(val) * 0.277778; // 1 GJ = 0.277778 MWh
        return isNaN(num) ? "0.00" : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const grandTotalGj = Number(totals.grand_total_gj) || 0;
    const renewableTotalGj = Number(totals.renewable_total_gj) || 0;
    const nonRenewableTotalGj = Number(totals.non_renewable_total_gj) || 0;

    const renewableShare = grandTotalGj > 0 ? (renewableTotalGj / grandTotalGj) * 100 : 0;
    const nonRenewableShare = grandTotalGj > 0 ? (nonRenewableTotalGj / grandTotalGj) * 100 : 0;

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-up">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-outline-variant pb-6">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Badge variant="active" size="md">
                            SEBI BRSR • Principle 6
                        </Badge>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="font-semibold text-slate-700">GRI:</span>
                            <span>Corresponds to GRI 302-1 (consumption) &amp; 302-3 (intensity) — now GRI 103-2 &amp; 103-4 (Energy 2025)</span>
                        </span>
                    </div>
                    <h1 className="text-headline-md font-bold tracking-tight text-primary">
                        BRSR Energy Consumption Disclosure
                    </h1>
                    <p className="text-sm text-on-surface-variant">
                        Principle 6 renewable & non-renewable energy consumption accounting in Gigajoules (GJ) & intensity metrics.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "tune"} size="sm" />
                        <span>{isFilterOpen ? "Hide Controls" : "Energy Controls"}</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsDownloadOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 shadow-md">
                        <MaterialIcon name="download" size="sm" />
                        <span>Download</span>
                    </Button>
                </div>
            </div>

            {/* Inputs & Parameters Panel */}
            {isFilterOpen && (
                <Card>
                    <CardHeader tone="strip" className="py-2.5 bg-white">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="tune" size="sm" className="text-primary" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                Energy Consumption Parametric Controls
                            </span>
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
                                    className="w-full flex items-center justify-between gap-2 rounded-lg border border-outline-variant bg-white px-3 py-2 text-left font-mono text-[12px] text-on-surface hover:bg-surface-container-high transition duration-150">
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
                                    className="w-full flex items-center justify-between gap-2 rounded-lg border border-outline-variant bg-white px-3 py-2 text-left font-mono text-[12px] text-on-surface hover:bg-surface-container-high transition duration-150">
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
                                <label className="text-xs font-semibold text-on-surface-variant block">Turnover (INR)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1000000"
                                    value={turnover !== null ? turnover : ""}
                                    onChange={(e) => setTurnover(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                />
                            </div>

                            {/* Physical Output Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant block">Physical Output</label>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 100"
                                    value={physicalOutput !== null ? physicalOutput : ""}
                                    onChange={(e) => setPhysicalOutput(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                />
                            </div>

                            {/* Output Unit Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant block">Physical Output Unit</label>
                                <input
                                    type="text"
                                    placeholder="e.g. tonnes, tcs"
                                    value={physicalOutputUnit}
                                    onChange={(e) => setPhysicalOutputUnit(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-[12px]"
                                />
                            </div>
                        </div>

                        {/* Document Upload & Verification Source Section */}
                        <BrsrDocumentUploadSection />

                        <div className="flex justify-end gap-2 border-t border-outline-variant/60 pt-3">
                            <Button variant="secondary" size="md" onClick={handleResetFilters} disabled={isPending}>
                                Reset
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleApplyFilters}
                                disabled={isPending}
                                className="flex items-center gap-2">
                                <MaterialIcon name="refresh" size="sm" />
                                Generate Consumption Metrics
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Content Loading State */}
            {!data && !isPending && !isError ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant shadow-lg backdrop-blur-md max-w-4xl mx-auto mt-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialIcon name="info" size="lg" className="!text-[28px]" />
                    </div>
                    <h3 className="mt-4 text-headline-sm font-bold text-primary">
                        Select Parameters to Calculate BRSR Energy Disclosure
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant max-w-md mx-auto">
                        Please select a date range and input turnover or physical output in the controls panel above, then click Generate Consumption Metrics.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">Calculating BRSR energy accounting totals...</p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-error/20 bg-error-container/10 p-6 text-center text-error">
                    <MaterialIcon name="warning" className="mx-auto mb-2" />
                    <h5 className="font-bold">Computation Error</h5>
                    <p className="text-xs mt-1 text-on-surface-variant">{error instanceof Error ? error.message : "Failed to calculate energy consumption disclosure."}</p>
                </div>
            ) : (
                <>
                    {/* 4-Card Overview Metrics Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Grand Total Energy */}
                        <Card interactive className="border-l-4 border-l-primary">
                            <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Grand Total Energy
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <MaterialIcon name="bolt" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1.5 font-mono">
                                        <span className="text-headline-md font-bold text-primary">
                                            {formatGj(totals.grand_total_gj)}
                                        </span>
                                        <span className="text-xs font-sans text-on-surface-variant">GJ</span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                        ≈ {formatMwhFromGj(totals.grand_total_gj)} MWh
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* 2. Renewable Total */}
                        <Card interactive className="border-l-4 border-l-secondary">
                            <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Renewable Energy Total
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                        <MaterialIcon name="eco" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1.5 font-mono">
                                        <span className="text-headline-md font-bold text-secondary">
                                            {formatGj(totals.renewable_total_gj)}
                                        </span>
                                        <span className="text-xs font-sans text-on-surface-variant">GJ</span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant mt-1">
                                        {renewableShare.toFixed(1)}% Renewable Share
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* 3. Non-Renewable Total */}
                        <Card interactive className="border-l-4 border-l-amber-500">
                            <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Non-Renewable Total
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                        <MaterialIcon name="factory" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1.5 font-mono">
                                        <span className="text-headline-md font-bold text-amber-600">
                                            {formatGj(totals.non_renewable_total_gj)}
                                        </span>
                                        <span className="text-xs font-sans text-on-surface-variant">GJ</span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant mt-1">
                                        {nonRenewableShare.toFixed(1)}% Non-Renewable Share
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* 4. Energy Intensity */}
                        <Card interactive className="border-l-4 border-l-indigo-500">
                            <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Energy Intensity / INR
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                                        <MaterialIcon name="analytics" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-headline-md font-bold text-indigo-600">
                                        {totals.energy_intensity_per_inr !== null && totals.energy_intensity_per_inr !== undefined
                                            ? Number(totals.energy_intensity_per_inr).toFixed(8)
                                            : "N/A"}
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant mt-1">
                                        GJ per ₹{Number(turnover_inr).toLocaleString()} turnover
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Energy Source Breakdown Cards (Renewable vs Non-Renewable) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Renewable Energy Card */}
                        <Card>
                            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="eco" size="sm" className="text-secondary" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Renewable Energy Sources (A)
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Electricity, fuel & other renewable energy (GJ)
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="positive" size="sm">
                                    {renewableShare.toFixed(1)}% Share
                                </Badge>
                            </CardHeader>
                            <CardBody className="p-card-padding space-y-4">
                                <EnergySourceRow
                                    label="Renewable Electricity Consumed"
                                    val={totals.renewable_electricity_gj}
                                    total={grandTotalGj}
                                    color="var(--gl-secondary)"
                                />
                                <EnergySourceRow
                                    label="Renewable Fuel Consumed"
                                    val={totals.renewable_fuel_gj}
                                    total={grandTotalGj}
                                    color="#10b981"
                                />
                                <EnergySourceRow
                                    label="Other Renewable Sources"
                                    val={totals.renewable_other_gj}
                                    total={grandTotalGj}
                                    color="#059669"
                                />

                                <div className="flex items-center justify-between rounded-lg border border-secondary/20 bg-secondary/10 p-3.5 mt-2">
                                    <span className="text-sm font-bold text-secondary">
                                        Total Renewable Energy (A)
                                    </span>
                                    <span className="font-mono text-base font-bold text-secondary">
                                        {formatGj(totals.renewable_total_gj)}{" "}
                                        <span className="text-xs font-sans font-normal">GJ</span>
                                    </span>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Non-Renewable Energy Card */}
                        <Card>
                            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="factory" size="sm" className="text-amber-500" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Non-Renewable Energy Sources (B)
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Grid import, fossil fuels & other non-renewable energy (GJ)
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="neutral" size="sm">
                                    {nonRenewableShare.toFixed(1)}% Share
                                </Badge>
                            </CardHeader>
                            <CardBody className="p-card-padding space-y-4">
                                <EnergySourceRow
                                    label="Non-Renewable Electricity (Grid)"
                                    val={totals.non_renewable_electricity_gj}
                                    total={grandTotalGj}
                                    color="#fb923c"
                                />
                                <EnergySourceRow
                                    label="Non-Renewable Fuel (Fossil/Coal)"
                                    val={totals.non_renewable_fuel_gj}
                                    total={grandTotalGj}
                                    color="#f59e0b"
                                />
                                <EnergySourceRow
                                    label="Other Non-Renewable Sources"
                                    val={totals.non_renewable_other_gj}
                                    total={grandTotalGj}
                                    color="#d97706"
                                />

                                <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 mt-2">
                                    <span className="text-sm font-bold text-amber-900">
                                        Total Non-Renewable Energy (B)
                                    </span>
                                    <span className="font-mono text-base font-bold text-amber-900">
                                        {formatGj(totals.non_renewable_total_gj)}{" "}
                                        <span className="text-xs font-sans font-normal">GJ</span>
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Renewable Transition Mass Balance Bar */}
                    <Card>
                        <CardHeader tone="flat">
                            <div className="flex items-center gap-2.5">
                                <MaterialIcon name="energy_savings_leaf" size="sm" className="text-secondary" />
                                <div>
                                    <h3 className="text-headline-sm font-semibold text-primary">
                                        Energy Mix & Transition Split
                                    </h3>
                                    <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                        Proportion of Renewable vs Non-Renewable Energy in Grand Total ({formatGj(totals.grand_total_gj)} GJ)
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-4">
                            <div className="flex items-center justify-between font-mono text-[11px] text-on-surface-variant">
                                <span>Renewable Share: {renewableShare.toFixed(1)}%</span>
                                <span>Non-Renewable Share: {nonRenewableShare.toFixed(1)}%</span>
                            </div>
                            <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                                <div
                                    className="h-full bg-secondary transition-all duration-700"
                                    style={{ width: `${renewableShare}%` }}
                                    title={`Renewable: ${formatGj(totals.renewable_total_gj)} GJ`}
                                />
                                <div
                                    className="h-full bg-amber-500 transition-all duration-700"
                                    style={{ width: `${nonRenewableShare}%` }}
                                    title={`Non-Renewable: ${formatGj(totals.non_renewable_total_gj)} GJ`}
                                />
                            </div>
                            <div className="flex items-center justify-end gap-4 text-[11px] font-mono">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-sm bg-secondary" />
                                    <span className="text-on-surface-variant">Renewable Energy</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                                    <span className="text-on-surface-variant">Non-Renewable Energy</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Accounting Activity Summary */}
                    <div className="rounded-2xl border border-outline-variant bg-surface-container/20 p-6">
                        <h4 className="font-sans text-body-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <MaterialIcon name="summarize" size="sm" />
                            BRSR Accounting Activity Summary
                        </h4>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <MaterialIcon name="local_gas_station" size="md" />
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant">Fuel Activities Logged</p>
                                    <p className="font-mono text-body-lg font-bold text-on-surface mt-0.5">
                                        {totals.fuel_activity_count}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <MaterialIcon name="electric_bolt" size="md" />
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant">Electricity Activities Logged</p>
                                    <p className="font-mono text-body-lg font-bold text-on-surface mt-0.5">
                                        {totals.electricity_activity_count}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${totals.skipped_fuel_activity_count > 0 ? "bg-error/10 text-error" : "bg-emerald-500/10 text-emerald-500"}`}>
                                    <MaterialIcon
                                        name={totals.skipped_fuel_activity_count > 0 ? "warning_amber" : "done_all"}
                                        size="md"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant">Skipped Fuel Activities</p>
                                    <p
                                        className={`font-mono text-body-lg font-bold mt-0.5 ${totals.skipped_fuel_activity_count > 0 ? "text-error" : "text-emerald-500"}`}>
                                        {totals.skipped_fuel_activity_count}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skipped Activities Audit Log Table */}
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
                                                    <TableCell
                                                        className="font-mono text-xs max-w-[150px] truncate text-on-surface-variant"
                                                        title={act.activity_id}>
                                                        {act.activity_id}
                                                    </TableCell>
                                                    <TableCell className="font-sans text-body-sm font-semibold">
                                                        {act.fuel_name}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-on-surface">
                                                        {Number(act.quantity).toLocaleString("en-US", { maximumFractionDigits: 4 })}
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

function EnergySourceRow({
    label,
    val,
    total,
    color,
}: {
    label: string;
    val: string | number;
    total: number;
    color: string;
}) {
    const num = Number(val) || 0;
    const share = total > 0 ? (num / total) * 100 : 0;
    const mwh = num * 0.277778;

    return (
        <div className="space-y-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 transition-colors hover:border-outline-variant">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">{label}</span>
                <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-sm font-bold text-primary">
                        {num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">GJ</span>
                    <span className="text-[10px] text-on-surface-variant/70">({mwh.toFixed(1)} MWh)</span>
                    <span className="ml-1 rounded bg-surface-container-high px-1.5 py-0.5 text-[9px] font-bold text-on-surface">
                        {share.toFixed(1)}%
                    </span>
                </div>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${Math.min(Math.max(share, 0), 100)}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
        </div>
    );
}
