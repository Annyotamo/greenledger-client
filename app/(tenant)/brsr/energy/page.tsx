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

    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);

    // Active filters used for the API query
    const [activeFilters, setActiveFilters] = useState<{
        startDate: string | null;
        endDate: string | null;
        turnover: number | null;
    }>({
        startDate: null,
        endDate: null,
        turnover: null,
    });

    const { data, isPending, isError, error } = useBrsrEnergyConsumption(
        activeFilters.startDate,
        activeFilters.endDate,
        activeFilters.turnover,
    );

    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Prepopulate default filters when data is first fetched
    useEffect(() => {
        if (data && !activeFilters.startDate && !activeFilters.endDate) {
            const start = new Date(data.reporting_period.period_start);
            const end = new Date(data.reporting_period.period_end);
            setStartDate(start);
            setEndDate(end);
            if (data.turnover_inr !== null) {
                setTurnover(data.turnover_inr);
            }
            setActiveFilters({
                startDate: data.reporting_period.period_start,
                endDate: data.reporting_period.period_end,
                turnover: data.turnover_inr,
            });
        }
    }, [data, activeFilters.startDate, activeFilters.endDate]);

    if (isPending) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
                <p className="font-mono text-label-md text-on-surface-variant animate-pulse">
                    Loading BRSR energy data...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto mt-12 animate-fade-up">
                <div className="rounded-2xl border border-error/20 bg-error-container/10 p-8 text-center text-error shadow-lg backdrop-blur-md">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
                        <MaterialIcon name="error" size="lg" className="!text-[28px]" />
                    </div>
                    <h3 className="mt-4 text-headline-sm font-bold text-primary">
                        Failed to Load BRSR Metrics
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant">
                        {error instanceof Error ? error.message : "An unexpected server error occurred."}
                    </p>
                    <div className="mt-6 flex justify-center">
                        <Button
                            variant="primary"
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2">
                            <MaterialIcon name="refresh" size="sm" />
                            Retry Loading
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const {
        reporting_period,
        totals,
        skipped_fuel_activities,
        generated_at,
        turnover_inr,
    } = data;

    const handleApplyFilters = () => {
        setActiveFilters({
            startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
            endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
            turnover: turnover,
        });
    };

    const handleResetFilters = () => {
        if (data) {
            const start = new Date(data.reporting_period.period_start);
            const end = new Date(data.reporting_period.period_end);
            setStartDate(start);
            setEndDate(end);
            setTurnover(data.turnover_inr);
            setActiveFilters({
                startDate: data.reporting_period.period_start,
                endDate: data.reporting_period.period_end,
                turnover: data.turnover_inr,
            });
        }
    };

    const handleDownloadReport = async (startDateStr: string, endDateStr: string, turnoverVal: number) => {
        const blob = await getBrsrEnergyReport(startDateStr, endDateStr, turnoverVal);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brsr-energy-report-${startDateStr}-to-${endDateStr}.xlsx`;
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
                <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-4 items-end">
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

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleApplyFilters}
                            className="flex-1 py-1.5">
                            Apply
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleResetFilters}
                            className="py-1.5">
                            Reset
                        </Button>
                    </div>
                </CardBody>
            </Card>
            )}

            {/* Reporting Period Summary Bar */}
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container/30 text-on-secondary-container">
                        <MaterialIcon name="calendar_month" size="lg" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-sans text-body-lg font-bold text-on-surface">
                                {reporting_period.name}
                            </span>
                            <Badge variant={reporting_period.period_status === "open" ? "active" : "neutral"} size="sm">
                                {reporting_period.period_status}
                            </Badge>
                        </div>
                        <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                            Period: {format(new Date(reporting_period.period_start), "MMM d, yyyy")} – {format(new Date(reporting_period.period_end), "MMM d, yyyy")}
                        </p>
                    </div>
                </div>
                <div className="text-left md:text-right font-mono text-[11px] text-on-surface-variant opacity-80">
                    <p>Reporting Year: {reporting_period.reporting_year}</p>
                    <p className="mt-0.5">Generated: {format(new Date(generated_at), "PPpp")}</p>
                </div>
            </div>

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
                            <h3 className="text-headline-md font-bold text-amber-600 dark:text-amber-500 font-mono">
                                {formatGj(totals.non_renewable_total_gj)} <span className="text-sm font-sans font-medium text-on-surface-variant">GJ</span>
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                                Conventional utility power
                            </p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500">
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
                            <h3 className="text-headline-md font-bold text-indigo-600 dark:text-indigo-400 font-mono">
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
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
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

            {/* Download Dialog Modal */}
            <BrsrEnergyReportModal
                isOpen={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                onDownload={handleDownloadReport}
            />
        </div>
    );
}
