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
        "Rotary Kiln No. 3 & 4 (350 TPD each, common stack)",
        "De-dusting System (ABC & Cooler Discharge)",
        "Coal Handling Plant De-dusting",
        "Product Separation & Handling Stack",
        "WHRB Boiler Stack (Attached to DRI Kiln 1 & 2)",
        "WHRB Boiler Stack (Attached to DRI Kiln 3 & 4)",
        "AFBC Power Boiler Stack (Fines Fired)",
        "Kiln Bag Filter Vent / Stack",
        "Cooler Discharge De-dusting Bag Filter Stack",
        "Raw Material Handling Bag Filter Vent",
        "Intermediate Bin De-dusting Vent",
        "Screening & Crusher House Bag Filter Stack",
        "Magnetic Separator & Transfer Point De-dusting",
        "Iron Ore Fines Injection System Vent",
    ],
    "Steel melting": [
        "Induction Furnace Stack No. 1 & 2 (Primary Fume Extraction)",
        "Induction Furnace Secondary Fume Extraction System Stack",
        "Electric Arc Furnace (EAF) Primary Bag Filter Stack",
        "Ladelfurnace (LF) & LRF De-dusting Stack",
    ],
    "Ferro alloy": [
        "Submerged Arc Furnace No. 1 (SAF) Bag Filter Stack",
        "Submerged Arc Furnace No. 2 (SAF) Bag Filter Stack",
        "Raw Material Handling & Dosing Plant De-dusting Stack",
        "Crushing & Screening Plant Bag Filter Vent",
        "Metal Casting & Tapping Area Fume Vent",
        "Slag Processing & Metal Recovery Bag Filter Vent",
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
        "AFBC / CFBC Power Plant Main Boiler Stack",
        "Coal Crusher & Handling Plant Bag Filter Stack",
        "Ash Handling & Silo Vent Bag Filter Stack",
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
    particulate_matter: { value: "" as unknown as number, unit: "mg_per_nm3" },
    pop: null,
    voc: null,
    hap: null,
});

const createCleanStack = (): BrsrAirStackInput => ({
    attached_unit: "Sponge iron / DRI",
    stack_title: "Rotary Kiln No. 1 & 2 (150 TPD each, common stack)",
    operating_hours_per_year: "" as unknown as number,
    permitted_limits: {
        permitted_limit_nox: { value: "" as unknown as number, unit: "mg_per_nm3" },
        permitted_limit_sox: { value: "" as unknown as number, unit: "mg_per_nm3" },
        permitted_limit_pm: { value: "" as unknown as number, unit: "mg_per_nm3" },
        permitted_flow_rate: { value: "" as unknown as number, unit: "nm3_per_hour" },
    },
    report_number: "",
    is_pop_monitored: false,
    is_voc_monitored: false,
    is_hap_monitored: false,
    readings: [createCleanReading()],
});

// Demo stack payload for default initial dashboard view
const DEMO_STACK_1: BrsrAirStackInput = {
    attached_unit: "Sponge iron / DRI",
    stack_title: "Rotary Kiln No. 1 & 2 (150 TPD each, common stack)",
    operating_hours_per_year: 7200,
    permitted_limits: {
        permitted_limit_nox: { value: 300, unit: "mg_per_nm3" },
        permitted_limit_sox: { value: 200, unit: "mg_per_nm3" },
        permitted_limit_pm: { value: 50, unit: "mg_per_nm3" },
        permitted_flow_rate: { value: 50000, unit: "nm3_per_hour" },
    },
    report_number: "TR-2025-STACK-01",
    is_pop_monitored: true,
    is_voc_monitored: false,
    is_hap_monitored: false,
    readings: [
        {
            sampling_date: "2024-10-15",
            gas_flow_rate: { value: 45000, unit: "nm3_per_hour" },
            nox: { value: 180, unit: "mg_per_nm3" },
            sox: { value: 110, unit: "mg_per_nm3" },
            particulate_matter: { value: 30, unit: "mg_per_nm3" },
            pop: { value: 0.012, unit: "mg_per_nm3" },
            voc: null,
            hap: null,
        },
        {
            sampling_date: "2024-12-20",
            gas_flow_rate: { value: 47000, unit: "nm3_per_hour" },
            nox: { value: 190, unit: "mg_per_nm3" },
            sox: { value: 130, unit: "mg_per_nm3" },
            particulate_matter: { value: 34, unit: "mg_per_nm3" },
            pop: { value: 0.014, unit: "mg_per_nm3" },
            voc: null,
            hap: null,
        },
    ],
};

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
                className="w-full flex h-8.5 items-center justify-between gap-2 rounded-lg border border-outline-variant bg-white px-2.5 py-1 text-left font-mono text-[12px] text-on-surface hover:bg-surface-container-high transition duration-150 shadow-sm">
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
    const [fyLabel, setFyLabel] = useState("");

    // Dynamic Stacks Input State
    const [stacks, setStacks] = useState<BrsrAirStackInput[]>([createCleanStack()]);

    // Dynamic Custom Pollutants State
    const [others, setOthers] = useState<BrsrAirOtherPollutantInput[]>([]);

    // Active payload for React Query backend calls initialized with demonstration data
    const [activePayload, setActivePayload] = useState<BrsrAirDisclosurePayload>({
        financial_year_label: "FY 2024-25",
        stacks: [DEMO_STACK_1],
        others: [{ label: "Carbon Monoxide (CO)", quantity: 14.2 }],
    });

    const { data, isPending, isError, error } = useBrsrAirDisclosure(activePayload);
    const { data: presetsData } = useBrsrAirStackPresets();

    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const unitOptions = presetsData?.attached_units || ATTACHED_UNITS;

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
            financial_year_label: fyLabel || "FY 2024-25",
            stacks: stacks.map((s, idx) => ({
                attached_unit: s.attached_unit || "Sponge iron / DRI",
                stack_title: s.stack_title || `Industrial Stack #${idx + 1}`,
                operating_hours_per_year: Number(s.operating_hours_per_year) || 0,
                permitted_limits: {
                    permitted_limit_nox: {
                        value: Number(s.permitted_limits?.permitted_limit_nox?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    permitted_limit_sox: {
                        value: Number(s.permitted_limits?.permitted_limit_sox?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    permitted_limit_pm: {
                        value: Number(s.permitted_limits?.permitted_limit_pm?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    permitted_flow_rate: {
                        value: Number(s.permitted_limits?.permitted_flow_rate?.value) || 0,
                        unit: "nm3_per_hour",
                    },
                },
                report_number: s.report_number || null,
                is_pop_monitored: !!s.is_pop_monitored,
                is_voc_monitored: !!s.is_voc_monitored,
                is_hap_monitored: !!s.is_hap_monitored,
                readings: s.readings.map((r) => ({
                    sampling_date: r.sampling_date || format(new Date(), "yyyy-MM-dd"),
                    gas_flow_rate: {
                        value: Number(r.gas_flow_rate?.value) || 0,
                        unit: "nm3_per_hour",
                    },
                    nox: {
                        value: Number(r.nox?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    sox: {
                        value: Number(r.sox?.value) || 0,
                        unit: "mg_per_nm3",
                    },
                    particulate_matter: {
                        value: Number(r.particulate_matter?.value) || 0,
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
                })),
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
        a.download = `brsr-air-disclosure-report-${(payload.financial_year_label || "2024").replace(/\s+/g, "_")}.xlsx`;
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

    const totals = data?.totals;
    const plantTotals = totals?.plant_total_per_pollutant;
    const plantAvgs = totals?.plant_average_concentration;
    const plantGasDetails = totals?.plant_gas_details;
    const calculatedStacks = totals?.stacks || totals?.stack_results || [];

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-up">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-outline-variant pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="active" size="md">
                            SEBI BRSR • Principle 6
                        </Badge>
                        <span className="font-mono text-xs text-on-surface-variant">
                            {data?.financial_year_label || "FY 2024-25"}
                        </span>
                    </div>
                    <h1 className="text-headline-md font-bold tracking-tight text-primary">
                        BRSR Air Emissions & EIA dust load (NIPL)
                    </h1>
                    <p className="text-sm text-on-surface-variant">
                        Stack sampling readings log, single stack permitted limits, hourly emission rates (kg/hr), annual totals (tonnes/yr), and per-gas compliance checks.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5">
                        <MaterialIcon name={isFilterOpen ? "filter_alt_off" : "tune"} size="sm" />
                        <span>{isFilterOpen ? "Hide Controls" : "Configure"}</span>
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
                <Card className="shadow-md border-outline-variant/80">
                    <CardHeader tone="strip" className="py-2.5 px-5 bg-white flex items-center justify-between border-b border-outline-variant/60">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="tune" size="sm" className="text-primary" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                Industrial Stack & Sampling Readings Input Configuration
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
                                    Financial Year Reporting Label <span className="text-error">*</span>
                                </label>
                                <input
                                    id="fy-label"
                                    type="text"
                                    placeholder="e.g. FY 2024-25"
                                    value={fyLabel}
                                    onChange={(e) => setFyLabel(e.target.value)}
                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 font-sans text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Stack Input Records */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                    Industrial Stack Config & Readings ({stacks.length} Stack{stacks.length > 1 ? "s" : ""})
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
                                const currentUnit = stack.attached_unit || "Sponge iron / DRI";
                                const presetsForUnit = presetsData?.presets?.[currentUnit] || DEFAULT_STACK_PRESETS[currentUnit] || [];

                                return (
                                    <div
                                        key={stackIdx}
                                        className="rounded-2xl border border-outline-variant/80 bg-surface-container-lowest p-5 space-y-5 shadow-sm">
                                        {/* Stack Top Header */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/40 pb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-600 font-mono text-xs font-bold shadow-sm border border-outline-variant/40">
                                                    {stackIdx + 1}
                                                </span>
                                                <div>
                                                    <h4 className="font-sans text-sm font-bold text-on-surface">
                                                        {stack.stack_title || `Industrial Stack #${stackIdx + 1}`}
                                                    </h4>
                                                    <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                                                        Unit: {currentUnit}
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

                                        {/* Attached Industrial Unit, Stack Title & Operating Hours */}
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
                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm">
                                                    {unitOptions.map((unit) => (
                                                        <option key={unit} value={unit}>
                                                            {unit}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                    Stack Title / Name <span className="text-error">*</span>
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
                                                            className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm">
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
                                                                placeholder="Enter custom stack title..."
                                                                value={stack.stack_title || ""}
                                                                onChange={(e) => handleUpdateStackField(stackIdx, "stack_title", e.target.value)}
                                                                className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm animate-fade-in"
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Rotary Kiln No. 1 Stack"
                                                        value={stack.stack_title || ""}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "stack_title", e.target.value)}
                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                    Operating Hours per Year (hrs/yr) <span className="text-error">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 7200"
                                                    value={stack.operating_hours_per_year || ""}
                                                    onChange={(e) => handleUpdateStackField(stackIdx, "operating_hours_per_year", e.target.value)}
                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Permitted Limits Section (Entered ONCE Per Stack) */}
                                        <div className="space-y-3 border-t border-outline-variant/40 pt-3">
                                            <div className="flex items-center gap-2">
                                                <MaterialIcon name="verified" size="sm" className="text-secondary" />
                                                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                                                    Stack Permitted Emission Limits (Specified Once Per Stack)
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-on-surface-variant block uppercase">
                                                        NOx Limit (mg/Nm³)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="e.g. 300"
                                                        value={stack.permitted_limits?.permitted_limit_nox?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_limit_nox.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>

                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-on-surface-variant block uppercase">
                                                        SOx Limit (mg/Nm³)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="e.g. 200"
                                                        value={stack.permitted_limits?.permitted_limit_sox?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_limit_sox.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>

                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-on-surface-variant block uppercase">
                                                        PM Limit (mg/Nm³)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="e.g. 50"
                                                        value={stack.permitted_limits?.permitted_limit_pm?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_limit_pm.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>

                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-on-surface-variant block uppercase">
                                                        Permitted Flow (Nm³/hr)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="e.g. 50000"
                                                        value={stack.permitted_limits?.permitted_flow_rate?.value || ""}
                                                        onChange={(e) =>
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_flow_rate.value", e.target.value)
                                                        }
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Optional Pollutant Monitoring Toggles */}
                                        <div className="space-y-2 border-t border-outline-variant/40 pt-3">
                                            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                                                Optional Pollutant Monitoring Flags
                                            </span>
                                            <div className="flex flex-wrap items-center gap-6 bg-surface-container-low/40 p-3 rounded-lg border border-outline-variant/30">
                                                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-on-surface">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!stack.is_pop_monitored}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_pop_monitored", e.target.checked)}
                                                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                                                    />
                                                    <span>Monitor POP (Persistent Organic Pollutants)</span>
                                                </label>

                                                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-on-surface">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!stack.is_voc_monitored}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_voc_monitored", e.target.checked)}
                                                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                                                    />
                                                    <span>Monitor VOC (Volatile Organic Compounds)</span>
                                                </label>

                                                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-on-surface">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!stack.is_hap_monitored}
                                                        onChange={(e) => handleUpdateStackField(stackIdx, "is_hap_monitored", e.target.checked)}
                                                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                                                    />
                                                    <span>Monitor HAP (Hazardous Air Pollutants)</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Multiple Sampling Readings Section per Stack */}
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
                                                                    <span>Remove Reading</span>
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                                            <div className="space-y-1">
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
                                                                    Gas Flow Rate (Nm³/hr) <span className="text-error">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="e.g. 45000"
                                                                    value={reading.gas_flow_rate?.value || ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "gas_flow_rate.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                    NOx Concentration (mg/Nm³) <span className="text-error">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="e.g. 180"
                                                                    value={reading.nox?.value || ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "nox.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                    SOx Concentration (mg/Nm³) <span className="text-error">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="e.g. 110"
                                                                    value={reading.sox?.value || ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "sox.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                    PM Concentration (mg/Nm³) <span className="text-error">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="e.g. 30"
                                                                    value={reading.particulate_matter?.value || ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "particulate_matter.value", e.target.value)
                                                                    }
                                                                    className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                />
                                                            </div>

                                                            {stack.is_pop_monitored && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                        POP (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
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
                                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
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
                                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
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
                                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary shadow-2xs"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Per-Stack Source Document & Verification Section */}
                                        <div className="pt-2">
                                            <BrsrDocumentUploadSection
                                                title={`Stack #${stackIdx + 1} Source Document & Verification`}
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
                                                placeholder="Pollutant Name / Label (e.g. Carbon Monoxide)"
                                                value={other.label}
                                                onChange={(e) => handleUpdateOtherPollutant(idx, "label", e.target.value)}
                                                className="w-1/2 h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            />
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="Quantity (tonnes)"
                                                value={other.quantity || ""}
                                                onChange={(e) => handleUpdateOtherPollutant(idx, "quantity", e.target.value)}
                                                className="w-1/3 h-8.5 rounded-lg border border-outline-variant bg-white px-3 py-1 font-mono text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
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
                        Please enter stack gas flow rates and sampling readings in the control panel above, then click Compute Air Disclosure Totals.
                    </p>
                </div>
            ) : isPending ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="font-mono text-label-md text-on-surface-variant animate-pulse">Calculating stack air emissions totals...</p>
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
                        {/* 4-Card Overview Metrics Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* 1. Total NOx */}
                            <Card interactive className="border-l-4 border-l-blue-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Plant NOx Annual Emission
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                            <MaterialIcon name="cloud" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-primary">
                                                {formatNum(plantTotals?.nox)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes/yr</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.nox)} mg/Nm³
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 2. Total SOx */}
                            <Card interactive className="border-l-4 border-l-amber-500">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Plant SOx Annual Emission
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                            <MaterialIcon name="air" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-amber-600">
                                                {formatNum(plantTotals?.sox)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes/yr</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.sox)} mg/Nm³
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 3. Total PM */}
                            <Card interactive className="border-l-4 border-l-secondary">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Particulate Matter (PM)
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                            <MaterialIcon name="grain" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-secondary">
                                                {formatNum(plantTotals?.particulate_matter)}
                                            </span>
                                            <span className="text-xs font-sans text-on-surface-variant">tonnes/yr</span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                            Avg: {formatNum(plantAvgs?.particulate_matter)} mg/Nm³
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 4. Optional Pollutant Monitoring Disclosures Summary */}
                            <Card interactive className="border-l-4 border-l-primary">
                                <CardBody className="flex flex-col justify-between h-full p-card-padding">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Optional Air Disclosures
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <MaterialIcon name="verified_user" size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-1.5 font-mono">
                                            <span className="text-headline-md font-bold text-primary">
                                                {((Number(plantTotals?.pop) || 0) + (Number(plantTotals?.voc) || 0) + (Number(plantTotals?.hap) || 0)) > 0
                                                    ? formatNum(
                                                        (Number(plantTotals?.pop) || 0) +
                                                        (Number(plantTotals?.voc) || 0) +
                                                        (Number(plantTotals?.hap) || 0)
                                                      )
                                                    : <span className="text-on-surface-variant/40">—</span>}
                                            </span>
                                            {((Number(plantTotals?.pop) || 0) + (Number(plantTotals?.voc) || 0) + (Number(plantTotals?.hap) || 0)) > 0 && (
                                                <span className="text-xs font-sans text-on-surface-variant">tonnes/yr</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                                            Monitored: POP ({(totals?.optional_pollutant_disclosures?.pop_monitored_stacks_count || 0) > 0 ? totals?.optional_pollutant_disclosures?.pop_monitored_stacks_count : "-"}), VOC ({(totals?.optional_pollutant_disclosures?.voc_monitored_stacks_count || 0) > 0 ? totals?.optional_pollutant_disclosures?.voc_monitored_stacks_count : "-"}), HAP ({(totals?.optional_pollutant_disclosures?.hap_monitored_stacks_count || 0) > 0 ? totals?.optional_pollutant_disclosures?.hap_monitored_stacks_count : "-"})
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Plant-Wide Dedicated Per-Gas Breakdown Metrics Cards */}
                        {plantGasDetails && Object.keys(plantGasDetails).length > 0 && (
                            <Card>
                                <CardHeader tone="flat" className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MaterialIcon name="assessment" size="sm" className="text-primary" />
                                        <div>
                                            <h3 className="text-headline-sm font-semibold text-primary">
                                                Plant-Wide Dedicated Per-Gas Metrics
                                            </h3>
                                            <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                                Detailed breakdown exposing hourly emission rates (kg/hr), gas flow rates, permitted limits, and compliance status
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody className="p-card-padding">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(plantGasDetails).map(([gasKey, gas]: [string, BrsrAirGasDetailMetric]) => {
                                            const isOptionalGas = ["pop", "voc", "hap"].includes(gasKey.toLowerCase());
                                            const hasValue = (v: number | null | undefined) => v !== null && v !== undefined && Number(v) > 0;
                                            const isGasMeasured = gas.is_monitored && (!isOptionalGas || hasValue(gas.annual_emission_tonnes_per_year) || hasValue(gas.average_concentration_mg_per_nm3));

                                            return (
                                                <div
                                                    key={gasKey}
                                                    className={`rounded-xl border p-4 space-y-3 ${
                                                        gas.is_exceeding_permitted_limit
                                                            ? "border-error/40 bg-error-container/10"
                                                            : "border-outline-variant/60 bg-white"
                                                    }`}>
                                                    <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                                                        <span className="font-sans font-bold text-sm text-primary">
                                                            {gas.pollutant_name}
                                                        </span>
                                                        {gas.is_exceeding_permitted_limit ? (
                                                            <Badge variant="negative" size="sm" className="flex items-center gap-1">
                                                                <MaterialIcon name="warning" size="sm" className="!text-[12px]" />
                                                                Exceeding Limit
                                                            </Badge>
                                                        ) : isGasMeasured ? (
                                                            <Badge variant="positive" size="sm" className="flex items-center gap-1">
                                                                <MaterialIcon name="check_circle" size="sm" className="!text-[12px]" />
                                                                Compliant
                                                            </Badge>
                                                        ) : null}
                                                    </div>

                                                    <div className="space-y-1.5 font-mono text-[12px]">
                                                        <div className="flex justify-between">
                                                            <span className="text-on-surface-variant">Hourly Rate:</span>
                                                            <span className="font-bold text-primary">
                                                                {isOptionalGas && !hasValue(gas.emission_rate_kg_per_hour)
                                                                    ? <span className="text-on-surface-variant/40">—</span>
                                                                    : `${formatNum(gas.emission_rate_kg_per_hour)} kg/hr`}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-on-surface-variant">Annual Total:</span>
                                                            <span className="font-bold text-primary">
                                                                {isOptionalGas && !hasValue(gas.annual_emission_tonnes_per_year)
                                                                    ? <span className="text-on-surface-variant/40">—</span>
                                                                    : `${formatNum(gas.annual_emission_tonnes_per_year)} t/yr`}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-on-surface-variant">Avg Concentration:</span>
                                                            <span className="font-bold text-on-surface">
                                                                {isOptionalGas && !hasValue(gas.average_concentration_mg_per_nm3)
                                                                    ? <span className="text-on-surface-variant/40">—</span>
                                                                    : `${formatNum(gas.average_concentration_mg_per_nm3)} mg/Nm³`}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-on-surface-variant">Permitted Limit:</span>
                                                            <span className="font-bold text-on-surface-variant">
                                                                {gas.permitted_limit_mg_per_nm3 ? `${formatNum(gas.permitted_limit_mg_per_nm3)} mg/Nm³` : "N/A"}
                                                            </span>
                                                        </div>
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
                                            Hourly emission rates (kg/hr) & annual emission totals (tonnes/year) per industrial stack
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="active" size="md">
                                    {calculatedStacks.length} Stack Results
                                </Badge>
                            </CardHeader>
                            <CardBody className="!p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Stack Title / Name</TableHead>
                                                <TableHead>Attached Unit</TableHead>
                                                <TableHead className="text-center">Readings Log</TableHead>
                                                <TableHead className="text-right">NOx (t/yr)</TableHead>
                                                <TableHead className="text-right">SOx (t/yr)</TableHead>
                                                <TableHead className="text-right">PM (t/yr)</TableHead>
                                                <TableHead className="text-right">POP (t/yr)</TableHead>
                                                <TableHead className="text-right">VOC (t/yr)</TableHead>
                                                <TableHead className="text-right">HAP (t/yr)</TableHead>
                                                <TableHead className="text-center">Hourly Emission Rate</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {calculatedStacks.map((res, idx) => (
                                                <TableRow key={idx}>
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
                                                        <Badge variant="active" size="sm">
                                                            {res.total_readings ?? res.readings?.length ?? 1} reading(s)
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs">
                                                        {formatNum(res.emission_per_year?.nox)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs text-amber-700">
                                                        {formatNum(res.emission_per_year?.sox)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs text-secondary">
                                                        {formatNum(res.emission_per_year?.particulate_matter)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-xs">
                                                        {res.is_pop_monitored && res.emission_per_year?.pop && Number(res.emission_per_year?.pop) > 0 ? formatNum(res.emission_per_year?.pop) : <span className="text-on-surface-variant/40">—</span>}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-xs">
                                                        {res.is_voc_monitored && res.emission_per_year?.voc && Number(res.emission_per_year?.voc) > 0 ? formatNum(res.emission_per_year?.voc) : <span className="text-on-surface-variant/40">—</span>}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-xs">
                                                        {res.is_hap_monitored && res.emission_per_year?.hap && Number(res.emission_per_year?.hap) > 0 ? formatNum(res.emission_per_year?.hap) : <span className="text-on-surface-variant/40">—</span>}
                                                    </TableCell>
                                                    <TableCell className="text-center font-mono text-[11px] text-on-surface-variant">
                                                        <div title="NOx Hourly Emission Rate in kg/hr">
                                                            NOx: {formatNum(res.emission_per_hour?.nox)} kg/h
                                                        </div>
                                                        <div title="SOx Hourly Emission Rate in kg/hr" className="text-[10px]">
                                                            SOx: {formatNum(res.emission_per_hour?.sox)} kg/h
                                                        </div>
                                                        <div title="PM Hourly Emission Rate in kg/hr" className="text-[10px]">
                                                            PM: {formatNum(res.emission_per_hour?.particulate_matter)} kg/h
                                                        </div>
                                                        {res.is_pop_monitored && res.emission_per_hour?.pop && Number(res.emission_per_hour?.pop) > 0 && (
                                                            <div title="POP Hourly Emission Rate in kg/hr" className="text-[10px]">
                                                                POP: {formatNum(res.emission_per_hour?.pop)} kg/h
                                                            </div>
                                                        )}
                                                        {res.is_voc_monitored && res.emission_per_hour?.voc && Number(res.emission_per_hour?.voc) > 0 && (
                                                            <div title="VOC Hourly Emission Rate in kg/hr" className="text-[10px]">
                                                                VOC: {formatNum(res.emission_per_hour?.voc)} kg/h
                                                            </div>
                                                        )}
                                                        {res.is_hap_monitored && res.emission_per_hour?.hap && Number(res.emission_per_hour?.hap) > 0 && (
                                                            <div title="HAP Hourly Emission Rate in kg/hr" className="text-[10px]">
                                                                HAP: {formatNum(res.emission_per_hour?.hap)} kg/h
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Plant Average Concentrations Summary Card */}
                        <Card>
                            <CardHeader tone="flat">
                                <div className="flex items-center gap-2">
                                    <MaterialIcon name="analytics" size="sm" className="text-primary" />
                                    <div>
                                        <h3 className="text-headline-sm font-semibold text-primary">
                                            Plant Average Concentrations & Total Summary
                                        </h3>
                                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                            Plant average concentrations (mg/Nm³) & annual pollutant totals (tonnes/year)
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="p-card-padding">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-primary block">NOx</span>
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
                                        <span className="text-[11px] font-bold text-secondary block">PM</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {formatNum(plantTotals?.particulate_matter)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {formatNum(plantAvgs?.particulate_matter)} mg/Nm³
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-on-surface-variant block">POP</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {totals?.optional_pollutant_disclosures?.total_pop_tonnes_per_year && Number(totals.optional_pollutant_disclosures.total_pop_tonnes_per_year) > 0
                                                ? <>{formatNum(totals.optional_pollutant_disclosures.total_pop_tonnes_per_year)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span></>
                                                : plantTotals?.pop && Number(plantTotals.pop) > 0
                                                ? <>{formatNum(plantTotals.pop)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span></>
                                                : <span className="text-on-surface-variant/40">—</span>}
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {totals?.optional_pollutant_disclosures?.average_pop_mg_per_nm3 && Number(totals.optional_pollutant_disclosures.average_pop_mg_per_nm3) > 0
                                                ? `${formatNum(totals.optional_pollutant_disclosures.average_pop_mg_per_nm3)} mg/Nm³`
                                                : plantAvgs?.pop && Number(plantAvgs.pop) > 0
                                                ? `${formatNum(plantAvgs.pop)} mg/Nm³`
                                                : <span className="text-on-surface-variant/40">—</span>}
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-on-surface-variant block">VOC</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {totals?.optional_pollutant_disclosures?.total_voc_tonnes_per_year && Number(totals.optional_pollutant_disclosures.total_voc_tonnes_per_year) > 0
                                                ? <>{formatNum(totals.optional_pollutant_disclosures.total_voc_tonnes_per_year)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span></>
                                                : plantTotals?.voc && Number(plantTotals.voc) > 0
                                                ? <>{formatNum(plantTotals.voc)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span></>
                                                : <span className="text-on-surface-variant/40">—</span>}
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {totals?.optional_pollutant_disclosures?.average_voc_mg_per_nm3 && Number(totals.optional_pollutant_disclosures.average_voc_mg_per_nm3) > 0
                                                ? `${formatNum(totals.optional_pollutant_disclosures.average_voc_mg_per_nm3)} mg/Nm³`
                                                : plantAvgs?.voc && Number(plantAvgs.voc) > 0
                                                ? `${formatNum(plantAvgs.voc)} mg/Nm³`
                                                : <span className="text-on-surface-variant/40">—</span>}
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 space-y-1">
                                        <span className="text-[11px] font-bold text-on-surface-variant block">HAP</span>
                                        <span className="font-mono text-sm font-bold text-on-surface block">
                                            {totals?.optional_pollutant_disclosures?.total_hap_tonnes_per_year && Number(totals.optional_pollutant_disclosures.total_hap_tonnes_per_year) > 0
                                                ? <>{formatNum(totals.optional_pollutant_disclosures.total_hap_tonnes_per_year)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span></>
                                                : plantTotals?.hap && Number(plantTotals.hap) > 0
                                                ? <>{formatNum(plantTotals.hap)} <span className="text-[10px] font-sans text-on-surface-variant">t/yr</span></>
                                                : <span className="text-on-surface-variant/40">—</span>}
                                        </span>
                                        <span className="font-mono text-[10px] text-on-surface-variant block">
                                            {totals?.optional_pollutant_disclosures?.average_hap_mg_per_nm3 && Number(totals.optional_pollutant_disclosures.average_hap_mg_per_nm3) > 0
                                                ? `${formatNum(totals.optional_pollutant_disclosures.average_hap_mg_per_nm3)} mg/Nm³`
                                                : plantAvgs?.hap && Number(plantAvgs.hap) > 0
                                                ? `${formatNum(plantAvgs.hap)} mg/Nm³`
                                                : <span className="text-on-surface-variant/40">—</span>}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )
            )}

            {/* Report Download Modal */}
            <BrsrAirReportModal
                isOpen={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                payload={activePayload}
                onDownload={handleDownloadReport}
            />
        </div>
    );
}
