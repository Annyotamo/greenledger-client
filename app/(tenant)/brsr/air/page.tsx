"use client";

import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { useBrsrAirDisclosure, useBrsrAirStackPresets } from "@/lib/brsr/hooks";
import { postBrsrAirReport } from "@/lib/brsr/api";
import { BrsrAirReportModal } from "@/components/brsr/BrsrAirReportModal";
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
import type {
    AttachedUnitEnum,
    BrsrAirDisclosurePayload,
    BrsrAirStackInput,
    BrsrAirReadingInput,
    BrsrAirOtherPollutantInput,
    BrsrAirGasDetailMetric,
    BrsrAirCalculatedStack,
} from "@/lib/brsr/types";

const ATTACHED_UNITS: AttachedUnitEnum[] = [
    "Sponge iron / DRI",
    "Steel melting",
    "Ferro alloy",
    "Blast furnace",
    "Sinter plant",
    "Pellet plant",
    "Coke oven",
    "Captive power",
    "Other",
];

const DEFAULT_STACK_PRESETS: Record<string, string[]> = {
    "Sponge iron / DRI": [
        "Rotary Kiln No. 1 & 2 (150 TPD each, common stack)",
        "Rotary Kiln No. 3 & 4 (150 TPD each, common stack)",
        "Cooler Discharge, Kiln 1–4",
        "TRH-5 Transfer House",
        "De-dusting System (ABC & Cooler Discharge)",
        "WHRB Boiler Stack (Attached to DRI Kiln 1 & 2)",
    ],
    "Steel melting": [
        "SMS-1 Induction (2 × 15 MT) (4 × 18 MT) Furnace",
        "SMS-1 Extension Induction (5 × 20 MT) Furnace",
        "Electric Arc Furnace (EAF) Primary Bag Filter Stack",
        "Ladelfurnace (LF) & LRF De-dusting Stack",
    ],
    "Ferro alloy": [
        "Submerged Arc Furnace No. 1 (SAF) Bag Filter Stack",
        "Submerged Arc Furnace No. 2 (SAF) Bag Filter Stack",
        "Raw Material Handling & Dosing Plant De-dusting Stack",
    ],
    "Blast furnace": [
        "Blast Furnace Stove Stack",
        "Cast House De-dusting Stack",
        "Stockhouse Bag Filter Stack",
    ],
    "Sinter plant": [
        "Sinter Strand Main Exhaust Stack (De-SOx / De-NOx ESP Stack)",
        "Sinter Cooler ESP & De-dusting Stack",
    ],
    "Pellet plant": [
        "Induration Furnace Main Exhaust Stack",
        "Grinding & Drying Plant De-dusting Stack",
    ],
    "Coke oven": [
        "Coke Oven Battery Chimney Stack",
    ],
    "Captive power": [
        "Power Plant CFBC Boiler (stack ID 3.27 m)",
        "Power Plant CFBC Boiler (stack ID 4.2 m)",
        "Power Plant AFBC Boiler",
        "Coal Crusher & Handling Plant Bag Filter Stack",
    ],
    "Other": [
        "Custom Auxiliary Industrial Stack",
    ],
};

const createCleanReading = (): BrsrAirReadingInput => ({
    sampling_date: "",
    gas_flow_rate: { value: "" as unknown as number, unit: "nm3_per_hour" },
    nox: { value: "" as unknown as number, unit: "mg_per_nm3" },
    sox: { value: "" as unknown as number, unit: "mg_per_nm3" },
    pm10: { value: "" as unknown as number, unit: "mg_per_nm3" },
    pm25: { value: "" as unknown as number, unit: "mg_per_nm3" },
    co: { value: "" as unknown as number, unit: "mg_per_nm3" },
    particulate_matter: { value: "" as unknown as number, unit: "mg_per_nm3" },
    pop: null,
    voc: null,
    hap: null,
});

const createCleanStack = (): BrsrAirStackInput => ({
    attached_unit: "Captive power",
    stack_title: "Power Plant CFBC Boiler (stack ID 3.27 m)",
    operating_hours_per_year: "" as unknown as number,
    is_nox_monitored: true,
    is_sox_monitored: true,
    is_pm10_monitored: true,
    is_pm25_monitored: true,
    is_co_monitored: true,
    is_pop_monitored: false,
    is_voc_monitored: false,
    is_hap_monitored: false,
    permitted_limits: {
        permitted_limit_nox: { value: "" as unknown as number, unit: "mg_per_nm3" },
        permitted_limit_sox: { value: "" as unknown as number, unit: "mg_per_nm3" },
        permitted_limit_pm10: { value: "" as unknown as number, unit: "mg_per_nm3" },
        permitted_limit_pm25: { value: "" as unknown as number, unit: "mg_per_nm3" },
        permitted_limit_co: { value: "" as unknown as number, unit: "mg_per_nm3" },
        permitted_limit_pm: { value: "" as unknown as number, unit: "mg_per_nm3" },
        permitted_flow_rate: { value: "" as unknown as number, unit: "nm3_per_hour" },
    },
    report_number: "",
    readings: [createCleanReading()],
});

// Demo stack matching Scenario 2 from backend specification
const DEMO_STACK_1: BrsrAirStackInput = {
    attached_unit: "Captive power",
    stack_title: "Power Plant CFBC Boiler (stack ID 3.27 m)",
    operating_hours_per_year: 7920.0,
    is_nox_monitored: true,
    is_sox_monitored: true,
    is_pm10_monitored: true,
    is_pm25_monitored: true,
    is_co_monitored: true,
    is_pop_monitored: false,
    is_voc_monitored: false,
    is_hap_monitored: false,
    permitted_limits: {
        permitted_limit_nox: { value: 400.0, unit: "mg_per_nm3" },
        permitted_limit_sox: { value: 200.0, unit: "mg_per_nm3" },
        permitted_limit_pm10: { value: 50.0, unit: "mg_per_nm3" },
        permitted_limit_pm25: { value: 30.0, unit: "mg_per_nm3" },
        permitted_limit_co: { value: 100.0, unit: "mg_per_nm3" },
        permitted_limit_pm: { value: 50.0, unit: "mg_per_nm3" },
        permitted_flow_rate: { value: 45000.0, unit: "nm3_per_hour" },
    },
    readings: [
        {
            sampling_date: "2025-05-15",
            gas_flow_rate: { value: 35000.0, unit: "nm3_per_hour" },
            nox: { value: 210.5, unit: "mg_per_nm3" },
            sox: { value: 88.3, unit: "mg_per_nm3" },
            pm10: { value: 38.0, unit: "mg_per_nm3" },
            pm25: { value: 18.2, unit: "mg_per_nm3" },
            co: { value: 45.0, unit: "mg_per_nm3" },
            particulate_matter: { value: 38.0, unit: "mg_per_nm3" },
        },
        {
            sampling_date: "2025-11-20",
            gas_flow_rate: { value: 36500.0, unit: "nm3_per_hour" },
            nox: { value: 225.0, unit: "mg_per_nm3" },
            sox: { value: 92.0, unit: "mg_per_nm3" },
            pm10: { value: 41.5, unit: "mg_per_nm3" },
            pm25: { value: 20.1, unit: "mg_per_nm3" },
            co: { value: 48.2, unit: "mg_per_nm3" },
            particulate_matter: { value: 41.5, unit: "mg_per_nm3" },
        },
    ],
};

const DEMO_OTHERS: BrsrAirOtherPollutantInput[] = [
    {
        label: "Lead (Pb)",
        quantity: 0.05,
    },
];

const INITIAL_DEMO_STACKS: BrsrAirStackInput[] = [DEMO_STACK_1];

function DatePickerInput({
    value,
    onChange,
    placeholder = "Select Date",
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const parsedDate = value ? parseISO(value) : null;
    const validDate = parsedDate && isValid(parsedDate) ? parsedDate : null;

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex h-8.5 items-center justify-between gap-2 rounded-lg border border-outline-variant bg-white px-2.5 py-1 text-left font-mono text-[12px] text-on-surface hover:bg-surface-container-high transition duration-150 shadow-xs">
                <span className="flex items-center gap-1.5">
                    <MaterialIcon name="calendar_today" size="sm" className="text-on-surface-variant shrink-0 !text-[15px]" />
                    {validDate ? (
                        format(validDate, "yyyy-MM-dd")
                    ) : (
                        <span className="text-on-surface-variant/50 font-sans text-[12px]">{placeholder}</span>
                    )}
                </span>
                <MaterialIcon name="arrow_drop_down" size="sm" className="text-on-surface-variant shrink-0" />
            </button>
            {isOpen && (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-10 cursor-default bg-transparent"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close calendar"
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 shadow-2xl animate-fade-up">
                        <Calendar
                            date={validDate}
                            onDateChange={(d) => {
                                onChange(format(d, "yyyy-MM-dd"));
                                setIsOpen(false);
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default function BrsrAirPage() {
    // Form Input States
    const [fyLabel, setFyLabel] = useState("FY 2025-26");
    const [stacks, setStacks] = useState<BrsrAirStackInput[]>(INITIAL_DEMO_STACKS);
    const [others, setOthers] = useState<BrsrAirOtherPollutantInput[]>(DEMO_OTHERS);

    // Active payload for React Query backend calls
    const [activePayload, setActivePayload] = useState<BrsrAirDisclosurePayload>({
        financial_year_label: "FY 2025-26",
        stacks: INITIAL_DEMO_STACKS,
        others: DEMO_OTHERS,
    });

    const { data, isPending, isError, error } = useBrsrAirDisclosure(activePayload);
    const { data: presetsData } = useBrsrAirStackPresets();

    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedStackLog, setExpandedStackLog] = useState<number | null>(0);

    const categoriesList = presetsData?.categories || presetsData?.attached_units || ATTACHED_UNITS;

    // Stack Handlers
    const handleAddStack = () => {
        setStacks((prev) => [...prev, createCleanStack()]);
    };

    const handleRemoveStack = (stackIndex: number) => {
        setStacks((prev) => prev.filter((_, i) => i !== stackIndex));
    };

    const handleUpdateStackField = (stackIndex: number, field: string, value: any) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = JSON.parse(JSON.stringify(next[stackIndex]));

            const keys = field.split(".");
            let curr: any = stack;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!curr[keys[i]]) {
                    curr[keys[i]] = {};
                }
                curr = curr[keys[i]];
            }
            curr[keys[keys.length - 1]] = value;

            // Auto-sync legacy fields
            if (field === "permitted_limits.permitted_limit_pm10.value") {
                if (!stack.permitted_limits) stack.permitted_limits = {};
                if (!stack.permitted_limits.permitted_limit_pm) {
                    stack.permitted_limits.permitted_limit_pm = { value, unit: "mg_per_nm3" };
                } else {
                    stack.permitted_limits.permitted_limit_pm.value = value;
                }
            }

            next[stackIndex] = stack;
            return next;
        });
    };

    // Stack Readings Handlers
    const handleAddReading = (stackIndex: number) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = { ...next[stackIndex] };
            stack.readings = [...stack.readings, createCleanReading()];
            next[stackIndex] = stack;
            return next;
        });
    };

    const handleRemoveReading = (stackIndex: number, readingIndex: number) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = { ...next[stackIndex] };
            if (stack.readings.length > 1) {
                stack.readings = stack.readings.filter((_, i) => i !== readingIndex);
            }
            next[stackIndex] = stack;
            return next;
        });
    };

    const handleUpdateReadingField = (
        stackIndex: number,
        readingIndex: number,
        field: string,
        value: any
    ) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = { ...next[stackIndex] };
            const readings = [...stack.readings];
            const reading = { ...readings[readingIndex] };

            if (field.includes(".")) {
                const [parent, child] = field.split(".");
                (reading as any)[parent] = {
                    ...(reading as any)[parent],
                    [child]: value,
                };
            } else {
                (reading as any)[field] = value;
            }

            // Sync pm10 with legacy particulate_matter
            if (field === "pm10.value") {
                (reading as any).particulate_matter = { value, unit: "mg_per_nm3" };
            }

            readings[readingIndex] = reading;
            stack.readings = readings;
            next[stackIndex] = stack;
            return next;
        });
    };

    // Custom Pollutants Handlers
    const handleAddOtherPollutant = () => {
        setOthers((prev) => [...prev, { label: "", quantity: "" as unknown as number }]);
    };

    const handleRemoveOtherPollutant = (index: number) => {
        setOthers((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateOtherPollutant = (index: number, field: "label" | "quantity", value: any) => {
        setOthers((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    // Generate API Payload
    const handleGenerate = () => {
        setActivePayload({
            financial_year_label: fyLabel || "FY 2025-26",
            stacks: stacks.map((s, idx) => ({
                attached_unit: s.attached_unit || "Captive power",
                stack_title: s.stack_title || `Industrial Stack #${idx + 1}`,
                operating_hours_per_year: Number(s.operating_hours_per_year) || 0,
                is_nox_monitored: s.is_nox_monitored ?? true,
                is_sox_monitored: s.is_sox_monitored ?? true,
                is_pm10_monitored: s.is_pm10_monitored ?? true,
                is_pm25_monitored: s.is_pm25_monitored ?? true,
                is_co_monitored: s.is_co_monitored ?? true,
                is_pop_monitored: !!s.is_pop_monitored,
                is_voc_monitored: !!s.is_voc_monitored,
                is_hap_monitored: !!s.is_hap_monitored,
                report_number: s.report_number || null,
                permitted_limits: {
                    permitted_limit_nox: {
                        value: Number(s.permitted_limits?.permitted_limit_nox?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    permitted_limit_sox: {
                        value: Number(s.permitted_limits?.permitted_limit_sox?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    permitted_limit_pm10: {
                        value: Number(s.permitted_limits?.permitted_limit_pm10?.value ?? s.permitted_limits?.permitted_limit_pm?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    permitted_limit_pm25: {
                        value: Number(s.permitted_limits?.permitted_limit_pm25?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    permitted_limit_co: {
                        value: Number(s.permitted_limits?.permitted_limit_co?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    permitted_flow_rate: {
                        value: Number(s.permitted_limits?.permitted_flow_rate?.value) || 0,
                        unit: "nm3_per_hour",
                    },
                },
                readings: s.readings.map((r) => {
                    const pm10Val = r.pm10?.value !== undefined && r.pm10?.value !== null && (r.pm10?.value as any) !== ""
                        ? Number(r.pm10.value)
                        : (r.particulate_matter?.value !== undefined && (r.particulate_matter?.value as any) !== "" ? Number(r.particulate_matter.value) : 0);

                    return {
                        sampling_date: r.sampling_date || format(new Date(), "yyyy-MM-dd"),
                        gas_flow_rate: {
                            value: Number(r.gas_flow_rate?.value) || 0,
                            unit: "nm3_per_hour",
                        },
                        nox: {
                            value: r.nox?.value !== undefined && r.nox?.value !== null && (r.nox?.value as any) !== ""
                                ? Number(r.nox.value)
                                : 0,
                            unit: "mg_per_nm3",
                        },
                        sox: {
                            value: r.sox?.value !== undefined && r.sox?.value !== null && (r.sox?.value as any) !== ""
                                ? Number(r.sox.value)
                                : 0,
                            unit: "mg_per_nm3",
                        },
                        pm10: {
                            value: pm10Val,
                            unit: "mg_per_nm3",
                        },
                        pm25: {
                            value: r.pm25?.value !== undefined && r.pm25?.value !== null && (r.pm25?.value as any) !== ""
                                ? Number(r.pm25.value)
                                : 0,
                            unit: "mg_per_nm3",
                        },
                        co: {
                            value: r.co?.value !== undefined && r.co?.value !== null && (r.co?.value as any) !== ""
                                ? Number(r.co.value)
                                : 0,
                            unit: "mg_per_nm3",
                        },
                        pop: s.is_pop_monitored && r.pop?.value !== undefined && r.pop?.value !== null && (r.pop?.value as any) !== ""
                            ? { value: Number(r.pop.value) || 0, unit: "mg_per_nm3" }
                            : null,
                        voc: s.is_voc_monitored && r.voc?.value !== undefined && r.voc?.value !== null && (r.voc?.value as any) !== ""
                            ? { value: Number(r.voc.value) || 0, unit: "mg_per_nm3" }
                            : null,
                        hap: s.is_hap_monitored && r.hap?.value !== undefined && r.hap?.value !== null && (r.hap?.value as any) !== ""
                            ? { value: Number(r.hap.value) || 0, unit: "mg_per_nm3" }
                            : null,
                    };
                }),
            })),
            others: others
                .filter((o) => o.label.trim() !== "")
                .map((o) => ({ label: o.label, quantity: Number(o.quantity) || 0 })),
        });
    };

    // Reset Form
    const handleReset = () => {
        setFyLabel("");
        setStacks([createCleanStack()]);
        setOthers([]);
        setActivePayload({
            financial_year_label: "",
            stacks: [],
            others: [],
        });
    };

    const handleDownloadReport = async (payload: BrsrAirDisclosurePayload) => {
        const blob = await postBrsrAirReport(payload);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brsr-air-disclosure-report-${(payload.financial_year_label || "2025").replace(/\s+/g, "_")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatNum = (val: string | number | null | undefined, defaultDecimals = 2) => {
        if (val === null || val === undefined || val === "") return "0.00";
        const num = Number(val);
        if (isNaN(num)) return "0.00";
        if (num === 0) return "0.00";

        const absNum = Math.abs(num);
        let maxDecimals = defaultDecimals;

        if (absNum < 1 && absNum > 0) {
            maxDecimals = Math.max(defaultDecimals, 4);
        }
        if (absNum < 0.0001 && absNum > 0) {
            maxDecimals = Math.max(defaultDecimals, 6);
        }

        return num.toLocaleString("en-US", {
            minimumFractionDigits: Math.min(defaultDecimals, maxDecimals),
            maximumFractionDigits: maxDecimals,
        });
    };

    // Derived Response Totals
    const plantTotals = data?.plant_total_per_pollutant || data?.totals?.plant_total_per_pollutant;
    const plantAvgs = data?.plant_average_concentration || data?.totals?.plant_average_concentration;
    const plantCombinedHourly = data?.plant_combined_hourly_rate || data?.totals?.plant_combined_hourly_rate;
    const plantGasDetails = data?.plant_gas_details || data?.totals?.plant_gas_details;
    const calculatedStacks: BrsrAirCalculatedStack[] = data?.stacks || data?.totals?.stacks || data?.totals?.stack_results || [];
    const totalExceedances = data?.total_exceedances_by_pollutant || data?.totals?.total_exceedances_by_pollutant;

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
                            <span>Corresponds to GRI 305-7 (Air Emissions)</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-500/20">
                            <MaterialIcon name="check_circle" size="sm" className="!text-[13px]" />
                            Criteria Pollutants Segregated (PM₁₀, PM₂.₅, CO)
                        </span>
                    </div>
                    <h1 className="text-headline-md font-bold tracking-tight text-primary">
                        BRSR Principle 6 Air Emissions
                    </h1>
                    <p className="text-sm text-on-surface-variant">
                        Industrial stack sampling readings log, permitted limits, hourly mass emission rates (kg/hr), statutory exceedance tracking, and annual totals (tonnes/year).
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "tune"} size="sm" />
                        <span>{isFilterOpen ? "Hide Configuration" : "Configure Stacks"}</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsDownloadOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 shadow-md">
                        <MaterialIcon name="download" size="sm" />
                        <span>Download Excel Report</span>
                    </Button>
                </div>
            </div>

            {/* Configuration & Inputs Panel */}
            {isFilterOpen && (
                <Card className="shadow-md border-outline-variant/80">
                    <CardHeader tone="strip" className="py-3 px-5 bg-white flex items-center justify-between border-b border-outline-variant/60">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="tune" size="sm" className="text-primary" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                Industrial Stack &amp; Criteria Sampling Configuration
                            </span>
                        </div>
                        <Badge variant="neutral" size="sm" className="font-medium px-2.5 py-0.5 text-xs">
                            {stacks.length} Stack(s) Configured
                        </Badge>
                    </CardHeader>
                    <CardBody className="p-5 space-y-6">
                        {/* Financial Year Info */}
                        <div className="border-b border-outline-variant/60 pb-4">
                            <div className="max-w-xs space-y-1">
                                <label htmlFor="fy-label" className="text-xs font-semibold text-on-surface-variant block">
                                    Financial Year Label <span className="text-error">*</span>
                                </label>
                                <input
                                    id="fy-label"
                                    type="text"
                                    placeholder="e.g. FY 2025-26"
                                    value={fyLabel}
                                    onChange={(e) => setFyLabel(e.target.value)}
                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 font-sans text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                                />
                            </div>
                        </div>

                        {/* Stack Input Records */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                    Industrial Stacks &amp; Sampling Readings ({stacks.length} Stack{stacks.length > 1 ? "s" : ""})
                                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleAddStack}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-semibold">
                                    <MaterialIcon name="add" size="sm" />
                                    <span>Add New Stack</span>
                                </Button>
                            </div>

                            {stacks.map((stack, stackIdx) => {
                                const currentUnit = stack.attached_unit || "Captive power";
                                const presetsForUnit = presetsData?.presets?.[currentUnit] || DEFAULT_STACK_PRESETS[currentUnit] || [];

                                return (
                                    <div
                                        key={stackIdx}
                                        className="rounded-2xl border border-outline-variant/80 bg-surface-container-lowest p-5 space-y-5 shadow-sm">
                                        {/* Stack Top Header */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/40 pb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold shadow-xs border border-emerald-200">
                                                    {stackIdx + 1}
                                                </span>
                                                <div>
                                                    <h4 className="font-sans text-sm font-bold text-on-surface">
                                                        {stack.stack_title || `Industrial Stack #${stackIdx + 1}`}
                                                    </h4>
                                                    <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                                                        Attached Unit: {currentUnit}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {stacks.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveStack(stackIdx)}
                                                        className="text-error hover:text-error/80 text-xs flex items-center gap-1 font-semibold transition px-2 py-1 rounded hover:bg-error/10">
                                                        <MaterialIcon name="delete" size="sm" />
                                                        <span>Delete Stack</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Attached Unit, Stack Title & Operating Hours */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-low/50 p-3.5 rounded-xl border border-outline-variant/40">
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                    Attached Industrial Unit <span className="text-error">*</span>
                                                </label>
                                                <select
                                                    value={currentUnit}
                                                    onChange={(e) => {
                                                        const newUnit = e.target.value as AttachedUnitEnum;
                                                        handleUpdateStackField(stackIdx, "attached_unit", newUnit);
                                                        const pList = presetsData?.presets?.[newUnit] || DEFAULT_STACK_PRESETS[newUnit] || [];
                                                        const defaultVal = pList[0] || "";
                                                        handleUpdateStackField(stackIdx, "stack_title", defaultVal);
                                                    }}
                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs">
                                                    {categoriesList.map((unit) => (
                                                        <option key={unit} value={unit}>
                                                            {unit}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                    Stack Title / Identifier <span className="text-error">*</span>
                                                </label>
                                                {presetsForUnit.length > 0 ? (
                                                    <div className="space-y-1">
                                                        <select
                                                            value={presetsForUnit.includes(stack.stack_title) ? stack.stack_title : "__custom__"}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val === "__custom__") {
                                                                    handleUpdateStackField(stackIdx, "stack_title", "");
                                                                } else {
                                                                    handleUpdateStackField(stackIdx, "stack_title", val);
                                                                }
                                                            }}
                                                            className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs">
                                                            {presetsForUnit.map((preset) => (
                                                                <option key={preset} value={preset}>
                                                                    {preset}
                                                                </option>
                                                            ))}
                                                            <option value="__custom__">+ Custom Entry...</option>
                                                        </select>
                                                        {(!presetsForUnit.includes(stack.stack_title) || stack.attached_unit === "Other") && (
                                                            <input
                                                                type="text"
                                                                placeholder="Enter custom stack identifier..."
                                                                value={stack.stack_title || ""}
                                                                onChange={(e) => handleUpdateStackField(stackIdx, "stack_title", e.target.value)}
                                                                className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs animate-fade-in"
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Power Plant CFBC Boiler (stack ID 3.27 m)"
                                                        value={stack.stack_title || ""}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "stack_title", e.target.value)}
                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                    Operating Hours per Year (hrs/yr) <span className="text-error">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    placeholder="e.g. 7920"
                                                    value={stack.operating_hours_per_year || ""}
                                                    onChange={(e) => handleUpdateStackField(stackIdx, "operating_hours_per_year", e.target.value)}
                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Permitted Limits Section (NOx, SOx, PM10, PM2.5, CO, Flow) */}
                                        <div className="space-y-3 border-t border-outline-variant/40 pt-3">
                                            <div className="flex items-center gap-2">
                                                <MaterialIcon name="verified" size="sm" className="text-secondary" />
                                                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                                                    Stack Statutory Permitted Emission Limits (Specified Once Per Stack)
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-blue-700 block uppercase">
                                                        NOx Limit (mg/Nm³)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="400"
                                                        value={stack.permitted_limits?.permitted_limit_nox?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_limit_nox.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>

                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-amber-700 block uppercase">
                                                        SOx Limit (mg/Nm³)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="200"
                                                        value={stack.permitted_limits?.permitted_limit_sox?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_limit_sox.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>

                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-emerald-700 block uppercase">
                                                        PM₁₀ Limit (mg/Nm³)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="50"
                                                        value={stack.permitted_limits?.permitted_limit_pm10?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_limit_pm10.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>

                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-teal-700 block uppercase">
                                                        PM₂.₅ Limit (mg/Nm³)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="30"
                                                        value={stack.permitted_limits?.permitted_limit_pm25?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_limit_pm25.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>

                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-purple-700 block uppercase">
                                                        CO Limit (mg/Nm³)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="100"
                                                        value={stack.permitted_limits?.permitted_limit_co?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_limit_co.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>

                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-on-surface-variant block uppercase">
                                                        Permitted Flow (Nm³/h)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="45000"
                                                        value={stack.permitted_limits?.permitted_flow_rate?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_flow_rate.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Criteria & Optional Monitoring Flags */}
                                        <div className="space-y-2 border-t border-outline-variant/40 pt-3">
                                            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                                                Monitored Pollutants Configuration
                                            </span>
                                            <div className="flex flex-wrap items-center gap-4 bg-surface-container-low/40 p-3 rounded-lg border border-outline-variant/30">
                                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-blue-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={stack.is_nox_monitored ?? true}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_nox_monitored", e.target.checked)}
                                                        className="h-3.5 w-3.5 rounded border-outline-variant text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span>NOx</span>
                                                </label>

                                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-amber-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={stack.is_sox_monitored ?? true}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_sox_monitored", e.target.checked)}
                                                        className="h-3.5 w-3.5 rounded border-outline-variant text-amber-600 focus:ring-amber-500"
                                                    />
                                                    <span>SOx</span>
                                                </label>

                                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-emerald-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={stack.is_pm10_monitored ?? true}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_pm10_monitored", e.target.checked)}
                                                        className="h-3.5 w-3.5 rounded border-outline-variant text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <span>PM₁₀</span>
                                                </label>

                                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-teal-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={stack.is_pm25_monitored ?? true}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_pm25_monitored", e.target.checked)}
                                                        className="h-3.5 w-3.5 rounded border-outline-variant text-teal-600 focus:ring-teal-500"
                                                    />
                                                    <span>PM₂.₅</span>
                                                </label>

                                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-purple-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={stack.is_co_monitored ?? true}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_co_monitored", e.target.checked)}
                                                        className="h-3.5 w-3.5 rounded border-outline-variant text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span>CO (Carbon Monoxide)</span>
                                                </label>

                                                <div className="h-4 w-px bg-outline-variant/60 mx-1" />

                                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-on-surface">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!stack.is_pop_monitored}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_pop_monitored", e.target.checked)}
                                                        className="h-3.5 w-3.5 rounded border-outline-variant text-primary focus:ring-primary"
                                                    />
                                                    <span>POP</span>
                                                </label>

                                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-on-surface">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!stack.is_voc_monitored}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_voc_monitored", e.target.checked)}
                                                        className="h-3.5 w-3.5 rounded border-outline-variant text-primary focus:ring-primary"
                                                    />
                                                    <span>VOC</span>
                                                </label>

                                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-on-surface">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!stack.is_hap_monitored}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_hap_monitored", e.target.checked)}
                                                        className="h-3.5 w-3.5 rounded border-outline-variant text-primary focus:ring-primary"
                                                    />
                                                    <span>HAP</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Sampling Readings Log Section */}
                                        <div className="space-y-3 border-t border-outline-variant/40 pt-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MaterialIcon name="science" size="sm" className="text-secondary" />
                                                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                                                        Sampling Readings Log ({stack.readings.length} Reading{stack.readings.length > 1 ? "s" : ""})
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleAddReading(stackIdx)}
                                                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 font-semibold">
                                                    <MaterialIcon name="add" size="sm" />
                                                    <span>Add Sampling Reading</span>
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {stack.readings.map((reading, readingIdx) => (
                                                    <div
                                                        key={readingIdx}
                                                        className="rounded-xl border border-outline-variant/50 bg-white p-3.5 space-y-3 shadow-2xs">
                                                        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                                                            <span className="font-mono text-[11px] font-bold text-on-surface-variant flex items-center gap-1.5">
                                                                <span className="h-2 w-2 rounded-full bg-secondary" />
                                                                Reading #{readingIdx + 1}
                                                            </span>
                                                            {stack.readings.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveReading(stackIdx, readingIdx)}
                                                                    className="text-error hover:text-error/80 text-[11px] flex items-center gap-1 font-medium transition">
                                                                    <MaterialIcon name="close" size="sm" />
                                                                    <span>Remove</span>
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                                                            <div className="space-y-1 col-span-2 sm:col-span-1">
                                                                <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                    Sampling Date <span className="text-error">*</span>
                                                                </label>
                                                                <DatePickerInput
                                                                    value={reading.sampling_date}
                                                                    onChange={(val) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "sampling_date", val)
                                                                    }
                                                                    placeholder="YYYY-MM-DD"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                    Gas Flow (Nm³/h) <span className="text-error">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="35000"
                                                                    value={reading.gas_flow_rate?.value || ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "gas_flow_rate.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-blue-700 block">
                                                                    NOx (mg/Nm³)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="210.5"
                                                                    value={reading.nox?.value || ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "nox.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-amber-700 block">
                                                                    SOx (mg/Nm³)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="88.3"
                                                                    value={reading.sox?.value || ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "sox.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-emerald-700 block">
                                                                    PM₁₀ (mg/Nm³)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="38.0"
                                                                    value={reading.pm10?.value ?? reading.particulate_matter?.value ?? ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "pm10.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-teal-700 block">
                                                                    PM₂.₅ (mg/Nm³)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="18.2"
                                                                    value={reading.pm25?.value ?? ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "pm25.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-purple-700 block">
                                                                    CO (mg/Nm³)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="45.0"
                                                                    value={reading.co?.value ?? ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "co.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Optional Pollutants Row */}
                                                        {(stack.is_pop_monitored || stack.is_voc_monitored || stack.is_hap_monitored) && (
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-outline-variant/30">
                                                                {stack.is_pop_monitored && (
                                                                    <div className="space-y-1">
                                                                        <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                            POP (mg/Nm³)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="any"
                                                                            placeholder="0.002"
                                                                            value={reading.pop?.value ?? ""}
                                                                            onChange={(e) =>
                                                                                handleUpdateReadingField(
                                                                                    stackIdx,
                                                                                    readingIdx,
                                                                                    "pop",
                                                                                    e.target.value !== ""
                                                                                        ? { value: e.target.value, unit: "mg_per_nm3" }
                                                                                        : null
                                                                                )
                                                                            }
                                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                        />
                                                                    </div>
                                                                )}

                                                                {stack.is_voc_monitored && (
                                                                    <div className="space-y-1">
                                                                        <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                            VOC (mg/Nm³)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="any"
                                                                            placeholder="1.5"
                                                                            value={reading.voc?.value ?? ""}
                                                                            onChange={(e) =>
                                                                                handleUpdateReadingField(
                                                                                    stackIdx,
                                                                                    readingIdx,
                                                                                    "voc",
                                                                                    e.target.value !== ""
                                                                                        ? { value: e.target.value, unit: "mg_per_nm3" }
                                                                                        : null
                                                                                )
                                                                            }
                                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                        />
                                                                    </div>
                                                                )}

                                                                {stack.is_hap_monitored && (
                                                                    <div className="space-y-1">
                                                                        <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                            HAP (mg/Nm³)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="any"
                                                                            placeholder="0.08"
                                                                            value={reading.hap?.value ?? ""}
                                                                            onChange={(e) =>
                                                                                handleUpdateReadingField(
                                                                                    stackIdx,
                                                                                    readingIdx,
                                                                                    "hap",
                                                                                    e.target.value !== ""
                                                                                        ? { value: e.target.value, unit: "mg_per_nm3" }
                                                                                        : null
                                                                                )
                                                                            }
                                                                            className="w-full h-8 rounded border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Per-Stack Source Document & Verification Section */}
                                        <div className="pt-2">
                                            <BrsrDocumentUploadSection
                                                title={`Stack #${stackIdx + 1} (${stack.stack_title || "Industrial Stack"}) Source Document & Verification`}
                                                reportNumber={stack.report_number || ""}
                                                onReportNumberChange={(val) => handleUpdateStackField(stackIdx, "report_number", val)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Custom Other Air Parameters Section */}
                        <div className="border-t border-outline-variant/60 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                    Additional Custom Air Parameters (Optional)
                                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleAddOtherPollutant}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1 font-semibold">
                                    <MaterialIcon name="add" size="sm" />
                                    <span>Add Custom Parameter</span>
                                </Button>
                            </div>

                            {others.length > 0 && (
                                <div className="space-y-2">
                                    {others.map((other, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                placeholder="Pollutant Name / Label (e.g. Lead (Pb))"
                                                value={other.label}
                                                onChange={(e) => handleUpdateOtherPollutant(idx, "label", e.target.value)}
                                                className="w-1/2 h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                                            />
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="Quantity (tonnes/year)"
                                                value={other.quantity || ""}
                                                onChange={(e) => handleUpdateOtherPollutant(idx, "quantity", e.target.value)}
                                                className="w-1/3 h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 font-mono text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOtherPollutant(idx)}
                                                className="text-error hover:text-error/80 p-1.5 rounded-lg hover:bg-error/10 transition">
                                                <MaterialIcon name="close" size="sm" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-2.5 border-t border-outline-variant/60 pt-4">
                            <Button variant="secondary" size="md" onClick={handleReset} disabled={isPending} className="px-4 py-2 text-xs font-semibold">
                                Reset Form
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleGenerate}
                                disabled={isPending}
                                className="flex items-center gap-2 px-5 py-2 text-xs font-bold shadow-md">
                                <MaterialIcon name="refresh" size="sm" />
                                Compute Air Disclosure Totals
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Loading & Error States */}
            {!data && !isPending && !isError ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant shadow-lg backdrop-blur-md max-w-4xl mx-auto mt-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialIcon name="info" size="lg" className="!text-[28px]" />
                    </div>
                    <h3 className="mt-4 text-headline-sm font-bold text-primary">
                        Configure Stack Sampling Parameters
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant max-w-md mx-auto">
                        Please enter stack gas flow rates and criteria pollutant sampling readings in the configuration panel above, then click Compute Air Disclosure Totals.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">Computing multi-tier air disclosure metrics...</p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-error/20 bg-error-container/10 p-6 text-center text-error">
                    <MaterialIcon name="warning" className="mx-auto mb-2" />
                    <h5 className="font-bold">Computation Error</h5>
                    <p className="text-xs mt-1 text-on-surface-variant">{error instanceof Error ? error.message : "Failed to calculate air disclosure."}</p>
                </div>
            ) : (
                data && (
                    <>
                        {/* 5-Card Overview Metrics Grid (NOx, SOx, PM10, PM2.5, CO) */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                            {/* 1. Total NOx */}
                            <Card interactive className="border-l-4 border-l-blue-500 shadow-xs">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Plant NOx
                                        </span>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                            <MaterialIcon name="cloud" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1 font-mono">
                                            <span className="text-headline-sm font-bold text-primary">
                                                {formatNum(plantTotals?.nox)}
                                            </span>
                                            <span className="text-[11px] font-sans text-on-surface-variant">t/yr</span>
                                        </div>
                                        <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.nox)} mg/Nm³
                                        </p>
                                        <p className="text-[10px] text-blue-700 font-mono">
                                            Rate: {formatNum(plantCombinedHourly?.nox)} kg/hr
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 2. Total SOx */}
                            <Card interactive className="border-l-4 border-l-amber-500 shadow-xs">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Plant SOx
                                        </span>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                            <MaterialIcon name="air" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1 font-mono">
                                            <span className="text-headline-sm font-bold text-amber-700">
                                                {formatNum(plantTotals?.sox)}
                                            </span>
                                            <span className="text-[11px] font-sans text-on-surface-variant">t/yr</span>
                                        </div>
                                        <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.sox)} mg/Nm³
                                        </p>
                                        <p className="text-[10px] text-amber-700 font-mono">
                                            Rate: {formatNum(plantCombinedHourly?.sox)} kg/hr
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 3. Total PM10 */}
                            <Card interactive className="border-l-4 border-l-emerald-600 shadow-xs">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            PM₁₀ (Coarse)
                                        </span>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                            <MaterialIcon name="grain" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1 font-mono">
                                            <span className="text-headline-sm font-bold text-emerald-700">
                                                {formatNum(plantTotals?.pm10 ?? plantTotals?.particulate_matter)}
                                            </span>
                                            <span className="text-[11px] font-sans text-on-surface-variant">t/yr</span>
                                        </div>
                                        <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.pm10 ?? plantAvgs?.particulate_matter)} mg/Nm³
                                        </p>
                                        <p className="text-[10px] text-emerald-700 font-mono">
                                            Rate: {formatNum(plantCombinedHourly?.pm10 ?? plantCombinedHourly?.particulate_matter)} kg/hr
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 4. Total PM2.5 */}
                            <Card interactive className="border-l-4 border-l-teal-500 shadow-xs">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            PM₂.₅ (Fine)
                                        </span>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
                                            <MaterialIcon name="filter_vintage" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1 font-mono">
                                            <span className="text-headline-sm font-bold text-teal-700">
                                                {formatNum(plantTotals?.pm25)}
                                            </span>
                                            <span className="text-[11px] font-sans text-on-surface-variant">t/yr</span>
                                        </div>
                                        <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.pm25)} mg/Nm³
                                        </p>
                                        <p className="text-[10px] text-teal-700 font-mono">
                                            Rate: {formatNum(plantCombinedHourly?.pm25)} kg/hr
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 5. Total CO */}
                            <Card interactive className="border-l-4 border-l-purple-500 shadow-xs">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            CO (Monoxide)
                                        </span>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                                            <MaterialIcon name="speed" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1 font-mono">
                                            <span className="text-headline-sm font-bold text-purple-700">
                                                {formatNum(plantTotals?.co)}
                                            </span>
                                            <span className="text-[11px] font-sans text-on-surface-variant">t/yr</span>
                                        </div>
                                        <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.co)} mg/Nm³
                                        </p>
                                        <p className="text-[10px] text-purple-700 font-mono">
                                            Rate: {formatNum(plantCombinedHourly?.co)} kg/hr
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Plant-Wide Dedicated Per-Gas Breakdown Cards */}
                        {plantGasDetails && Object.keys(plantGasDetails).length > 0 && (
                            <Card>
                                <CardHeader tone="flat" className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MaterialIcon name="assessment" size="sm" className="text-primary" />
                                        <div>
                                            <h3 className="text-headline-sm font-semibold text-primary">
                                                Criteria &amp; Monitored Gas Disclosures
                                            </h3>
                                            <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                                Detailed parameters disclosing average concentrations (mg/Nm³), hourly mass emission rates (kg/hr), and annual totals
                                            </p>
                                        </div>
                                    </div>
                                    {totalExceedances && Object.values(totalExceedances).some((c) => c > 0) ? (
                                        <Badge variant="negative" size="md" className="flex items-center gap-1 font-bold">
                                            <MaterialIcon name="warning" size="sm" className="!text-[14px]" />
                                            Statutory Exceedance Detected
                                        </Badge>
                                    ) : (
                                        <Badge variant="active" size="md" className="flex items-center gap-1">
                                            <MaterialIcon name="check_circle" size="sm" className="!text-[14px]" />
                                            All Monitored Gases In Compliance
                                        </Badge>
                                    )}
                                </CardHeader>
                                <CardBody className="p-card-padding">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {Object.entries(plantGasDetails).map(([gasKey, gas]: [string, BrsrAirGasDetailMetric]) => {
                                            const isExceeding = gas.is_exceeding_permitted_limit || (gas.exceedances_count && gas.exceedances_count > 0);

                                            return (
                                                <div
                                                    key={gasKey}
                                                    className={`rounded-xl border p-4 space-y-3 transition shadow-2xs ${
                                                        isExceeding
                                                            ? "border-error/40 bg-error-container/10"
                                                            : "border-outline-variant/60 bg-white"
                                                    }`}>
                                                    <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                                                        <span className="font-sans font-bold text-xs text-primary truncate" title={gas.pollutant_name}>
                                                            {gas.pollutant_name}
                                                        </span>
                                                        {isExceeding ? (
                                                            <Badge variant="negative" size="sm" className="flex items-center gap-1 font-semibold">
                                                                <MaterialIcon name="warning" size="sm" className="!text-[11px]" />
                                                                Exceeded
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                                                OK
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1.5 font-mono text-[11px]">
                                                        <div className="flex justify-between">
                                                            <span className="text-on-surface-variant">Annual Total:</span>
                                                            <span className="font-bold text-primary">
                                                                {formatNum(gas.annual_emission_tonnes_per_year)} t/yr
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-on-surface-variant">Hourly Rate:</span>
                                                            <span className="font-semibold text-on-surface">
                                                                {formatNum(gas.emission_rate_kg_per_hour)} kg/hr
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-on-surface-variant">Avg Conc:</span>
                                                            <span className="font-semibold text-on-surface">
                                                                {formatNum(gas.average_concentration_mg_per_nm3)} mg/Nm³
                                                            </span>
                                                        </div>
                                                        {gas.exceedances_count !== undefined && (
                                                            <div className="flex justify-between pt-1 border-t border-outline-variant/20">
                                                                <span className="text-on-surface-variant">Exceedances:</span>
                                                                <span className={`font-bold ${gas.exceedances_count > 0 ? "text-error" : "text-emerald-700"}`}>
                                                                    {gas.exceedances_count}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* Stack Results Audit Table */}
                        <Card>
                            <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <MaterialIcon name="precision_manufacturing" size="sm" className="text-primary" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Stack-by-Stack Air Emissions Breakdown ({calculatedStacks.length})
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Hourly mass rates (kg/hr) &amp; annual totals (t/yr) computed per industrial emission stack
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="active" size="md">
                                    {calculatedStacks.length} Stack Disclosure{calculatedStacks.length > 1 ? "s" : ""}
                                </Badge>
                            </CardHeader>
                            <CardBody className="!p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Stack Identifier</TableHead>
                                                <TableHead>Attached Unit</TableHead>
                                                <TableHead className="text-center">Readings</TableHead>
                                                <TableHead className="text-right text-blue-700">NOx (t/yr)</TableHead>
                                                <TableHead className="text-right text-amber-700">SOx (t/yr)</TableHead>
                                                <TableHead className="text-right text-emerald-700">PM₁₀ (t/yr)</TableHead>
                                                <TableHead className="text-right text-teal-700">PM₂.₅ (t/yr)</TableHead>
                                                <TableHead className="text-right text-purple-700">CO (t/yr)</TableHead>
                                                <TableHead className="text-center">Hourly Rates (kg/hr)</TableHead>
                                                <TableHead className="text-center">Compliance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {calculatedStacks.map((res, idx) => {
                                                const hasExceedance = res.is_exceeding_any_limit || Object.values(res.exceedances_count_by_pollutant || {}).some((v) => v > 0);
                                                const isExpanded = expandedStackLog === idx;

                                                return (
                                                    <TableRow key={idx} className={hasExceedance ? "bg-error-container/5" : ""}>
                                                        <TableCell className="font-sans font-bold text-primary text-xs">
                                                            <div>{res.stack_title}</div>
                                                            <div className="font-mono text-[10px] text-on-surface-variant font-normal">
                                                                {res.operating_hours_per_year} hrs/yr {res.report_number ? `• ${res.report_number}` : ""}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-sans text-xs">
                                                            <Badge variant="neutral" size="sm">
                                                                {res.attached_unit}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center font-mono text-xs">
                                                            <button
                                                                type="button"
                                                                onClick={() => setExpandedStackLog(isExpanded ? null : idx)}
                                                                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2">
                                                                <span>{res.readings_count ?? res.total_readings ?? res.readings?.length ?? 0} reading(s)</span>
                                                                <MaterialIcon name={isExpanded ? "expand_less" : "expand_more"} size="sm" className="!text-[14px]" />
                                                            </button>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono font-bold text-xs text-blue-700">
                                                            {formatNum(res.annual_emission_tonnes_per_year?.nox ?? res.emission_per_year?.nox)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono font-bold text-xs text-amber-700">
                                                            {formatNum(res.annual_emission_tonnes_per_year?.sox ?? res.emission_per_year?.sox)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono font-bold text-xs text-emerald-700">
                                                            {formatNum(res.annual_emission_tonnes_per_year?.pm10 ?? res.annual_emission_tonnes_per_year?.particulate_matter ?? res.emission_per_year?.pm10)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono font-bold text-xs text-teal-700">
                                                            {formatNum(res.annual_emission_tonnes_per_year?.pm25 ?? res.emission_per_year?.pm25)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono font-bold text-xs text-purple-700">
                                                            {formatNum(res.annual_emission_tonnes_per_year?.co ?? res.emission_per_year?.co)}
                                                        </TableCell>
                                                        <TableCell className="text-center font-mono text-[10px] text-on-surface-variant">
                                                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-left">
                                                                <span>NOx: {formatNum(res.emission_rate_kg_per_hour?.nox ?? res.emission_per_hour?.nox)}</span>
                                                                <span>SOx: {formatNum(res.emission_rate_kg_per_hour?.sox ?? res.emission_per_hour?.sox)}</span>
                                                                <span>PM₁₀: {formatNum(res.emission_rate_kg_per_hour?.pm10 ?? res.emission_rate_kg_per_hour?.particulate_matter)}</span>
                                                                <span>PM₂.₅: {formatNum(res.emission_rate_kg_per_hour?.pm25)}</span>
                                                                <span>CO: {formatNum(res.emission_rate_kg_per_hour?.co)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {hasExceedance ? (
                                                                <Badge variant="negative" size="sm" className="font-semibold">
                                                                    Exceedance
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="active" size="sm">
                                                                    Compliant
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Expanded Sampling Readings Log Audit View */}
                        {expandedStackLog !== null && calculatedStacks[expandedStackLog] && (
                            <Card className="border-emerald-500/40 shadow-md animate-fade-in">
                                <CardHeader tone="flat" className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MaterialIcon name="list_alt" size="sm" className="text-emerald-700" />
                                        <div>
                                            <h4 className="text-body-sm font-bold text-primary">
                                                Sampling Log Readings Audit: {calculatedStacks[expandedStackLog].stack_title}
                                            </h4>
                                            <p className="font-mono text-[10px] text-on-surface-variant">
                                                Individual sampling points showing flow rate, concentrations, calculated mass emission rates (kg/hr), and statutory compliance status
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setExpandedStackLog(null)}
                                        className="text-xs">
                                        Close Log
                                    </Button>
                                </CardHeader>
                                <CardBody className="!p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-surface-container-low/50">
                                                    <TableHead className="text-xs">Sampling Date</TableHead>
                                                    <TableHead className="text-right text-xs">Gas Flow (Nm³/h)</TableHead>
                                                    <TableHead className="text-right text-xs">NOx (mg/Nm³)</TableHead>
                                                    <TableHead className="text-right text-xs">SOx (mg/Nm³)</TableHead>
                                                    <TableHead className="text-right text-xs">PM₁₀ (mg/Nm³)</TableHead>
                                                    <TableHead className="text-right text-xs">PM₂.₅ (mg/Nm³)</TableHead>
                                                    <TableHead className="text-right text-xs">CO (mg/Nm³)</TableHead>
                                                    <TableHead className="text-center text-xs">Calculated Rates (kg/hr)</TableHead>
                                                    <TableHead className="text-center text-xs">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(calculatedStacks[expandedStackLog].readings || []).map((reading, rIdx) => {
                                                    const comp = reading.compliance;
                                                    const calc = reading.calculated_rates;
                                                    const isExceeded = comp && Object.values(comp).some((v) => v === true);

                                                    return (
                                                        <TableRow key={rIdx} className={isExceeded ? "bg-error-container/10" : ""}>
                                                            <TableCell className="font-mono text-xs font-semibold">
                                                                {reading.sampling_date}
                                                            </TableCell>
                                                            <TableCell className="text-right font-mono text-xs">
                                                                {formatNum(reading.gas_flow_rate?.value, 0)}
                                                            </TableCell>
                                                            <TableCell className={`text-right font-mono text-xs ${comp?.nox_exceeded ? "text-error font-bold" : ""}`}>
                                                                {formatNum(reading.nox?.value)}
                                                            </TableCell>
                                                            <TableCell className={`text-right font-mono text-xs ${comp?.sox_exceeded ? "text-error font-bold" : ""}`}>
                                                                {formatNum(reading.sox?.value)}
                                                            </TableCell>
                                                            <TableCell className={`text-right font-mono text-xs ${comp?.pm10_exceeded || comp?.pm_exceeded ? "text-error font-bold" : ""}`}>
                                                                {formatNum(reading.pm10?.value ?? reading.particulate_matter?.value)}
                                                            </TableCell>
                                                            <TableCell className={`text-right font-mono text-xs ${comp?.pm25_exceeded ? "text-error font-bold" : ""}`}>
                                                                {formatNum(reading.pm25?.value)}
                                                            </TableCell>
                                                            <TableCell className={`text-right font-mono text-xs ${comp?.co_exceeded ? "text-error font-bold" : ""}`}>
                                                                {formatNum(reading.co?.value)}
                                                            </TableCell>
                                                            <TableCell className="text-center font-mono text-[10px] text-on-surface-variant">
                                                                {calc ? (
                                                                    <div className="flex flex-wrap justify-center gap-1.5">
                                                                        <span>NOx: {formatNum(calc.nox_kg_per_hr)}</span>
                                                                        <span>SOx: {formatNum(calc.sox_kg_per_hr)}</span>
                                                                        <span>PM₁₀: {formatNum(calc.pm10_kg_per_hr ?? calc.pm_kg_per_hr)}</span>
                                                                        <span>PM₂.₅: {formatNum(calc.pm25_kg_per_hr)}</span>
                                                                        <span>CO: {formatNum(calc.co_kg_per_hr)}</span>
                                                                    </div>
                                                                ) : (
                                                                    "—"
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {isExceeded ? (
                                                                    <span className="inline-flex items-center gap-1 rounded bg-error/15 px-2 py-0.5 text-[10px] font-bold text-error">
                                                                        <MaterialIcon name="error" size="sm" className="!text-[12px]" />
                                                                        Limit Exceeded
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                                                                        <MaterialIcon name="check" size="sm" className="!text-[12px]" />
                                                                        Normal
                                                                    </span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* Plant Average Concentrations & Criteria Summary */}
                        <Card>
                            <CardHeader tone="flat">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="analytics" size="sm" className="text-primary" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Plant Average Concentrations &amp; Annual Mass Totals Summary
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Aggregated arithmetic concentrations (mg/Nm³) &amp; cumulative annual criteria air pollutant disclosures (t/yr)
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="p-card-padding">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-blue-700 block">NOx</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.nox)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.nox)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-amber-700 block">SOx</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.sox)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.sox)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-emerald-700 block">PM₁₀</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.pm10 ?? plantTotals?.particulate_matter)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.pm10 ?? plantAvgs?.particulate_matter)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-teal-700 block">PM₂.₅</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.pm25)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.pm25)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-purple-700 block">CO</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.co)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.co)} mg/Nm³
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )
            )}

            {/* Excel Report Download Modal */}
            <BrsrAirReportModal
                isOpen={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                payload={activePayload}
                onDownload={handleDownloadReport}
            />
        </div>
    );
}
