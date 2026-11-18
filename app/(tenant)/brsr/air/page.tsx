"use client";

import { useState, useEffect, useMemo } from "react";
import { format, parseISO, isValid } from "date-fns";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { useFacilities } from "@/lib/facility/hooks";
import {
    useEiaAirPresets,
    useEiaAirDisclosure,
    useComputeEiaAir,
    useSaveEiaAirDisclosure,
    useExportEiaAirExcel,
} from "@/lib/eia/hooks";
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
    EIAStackInput,
    EIAReadingInput,
    EIAOtherPollutantInput,
    EIAAirEmissionsPayload,
    EIACalculatedStack,
    EIAAirEmissionsComputedData,
} from "@/lib/eia/types";

const ATTACHED_UNITS = [
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
        "Rotary Kiln No. 5 & 6 (450 TPD each, common stack)",
        "Rotary Kiln No. 7 & 8 (450 TPD each, common stack)",
        "Cooler Discharge, Kiln 1–4",
        "Cooler Discharge, Kiln 7–10",
        "Product Separator House, Kiln 1–4",
    ],
    "Steel melting": [
        "SMS-1 Induction (2 × 15 MT) (4 × 18 MT) Furnace",
        "SMS-1 Extension Induction (5 × 20 MT) Furnace",
        "SMS-2 Induction (4 × 5 MT) (2 × 8 MT) Furnace",
        "SMS-3 Induction (6 × 8 MT) (2 × 18 MT) Furnace",
    ],
    "Ferro alloy": [
        "Ferro Plant SEAF No. 1 (4.5 MVA)",
        "Ferro Plant SEAF No. 2 (4.5 MVA)",
    ],
    "Captive power": [
        "Power Plant CFBC Boiler (stack ID 3.27 m)",
        "Power Plant CFBC Boiler (stack ID 4.2 m)",
        "Power Plant AFBC Boiler",
    ],
    "Other": [
        "Custom Auxiliary Industrial Stack",
    ],
};

const createCleanReading = (): EIAReadingInput => ({
    sampling_date: format(new Date(), "yyyy-MM-dd"),
    gas_flow_rate: { value: 100000, unit: "nm3_per_hour" },
    nox: { value: 200, unit: "mg_per_nm3" },
    sox: { value: 100, unit: "mg_per_nm3" },
    pm: { value: 45, unit: "mg_per_nm3" },
    pm10: { value: 45, unit: "mg_per_nm3" },
    pm25: { value: 22, unit: "mg_per_nm3" },
    co: { value: 25, unit: "mg_per_nm3" },
    pop: { value: 0.05, unit: "mg_per_nm3" },
    voc: { value: 12.0, unit: "mg_per_nm3" },
    hap: { value: 1.5, unit: "mg_per_nm3" },
    co2_percent: 12.5,
    o2_percent: 8.0,
    custom_gases: {
        nh3: { value: 18, unit: "mg_per_nm3" },
    },
});

const createCleanStack = (): EIAStackInput => ({
    attached_unit: "Sponge iron / DRI",
    stack_title: "Rotary Kiln No. 1 & 2 (150 TPD each, common stack)",
    operating_hours_per_year: 7920,
    is_nox_monitored: true,
    is_sox_monitored: true,
    is_pm_monitored: true,
    is_pm10_monitored: true,
    is_pm25_monitored: true,
    is_co_monitored: true,
    is_pop_monitored: true,
    is_voc_monitored: true,
    is_hap_monitored: true,
    is_co2_monitored: false,
    is_o2_monitored: false,
    report_number: "",
    permitted_limits: {
        permitted_flow_rate: { value: 150000, unit: "nm3_per_hour" },
        permitted_limit_nox: { value: 400, unit: "mg_per_nm3" },
        permitted_limit_sox: { value: 200, unit: "mg_per_nm3" },
        permitted_limit_pm: { value: 50, unit: "mg_per_nm3" },
        permitted_limit_pm10: { value: 50, unit: "mg_per_nm3" },
        permitted_limit_pm25: { value: 30, unit: "mg_per_nm3" },
        permitted_limit_co: { value: 100, unit: "mg_per_nm3" },
        custom_limits: {
            nh3: { value: 25, unit: "mg_per_nm3" },
        },
    },
    readings: [createCleanReading()],
});

/**
 * Reusable Subtle & Compact Gas Scope Toggle Component
 * Sleek micro-switch design with muted neutral aesthetics to avoid visual clutter
 */
function SubtleGasToggle({
    label,
    description,
    checked,
    onChange,
    disabled = false,
}: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => {
                if (!disabled) onChange(!checked);
            }}
            className={`group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border text-left transition duration-150 cursor-pointer select-none ${
                disabled
                    ? "opacity-50 cursor-not-allowed bg-slate-50 border-outline-variant/30"
                    : checked
                    ? "bg-emerald-50/25 border-emerald-600/30 text-on-surface font-medium hover:bg-emerald-50/40"
                    : "bg-surface-container-lowest/80 border-outline-variant/40 text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-low"
            }`}>
            <div className="flex items-center gap-1.5 min-w-0">
                <span
                    className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
                        checked ? "bg-emerald-600" : "bg-outline-variant"
                    }`}
                />
                <span className={`text-[11px] font-semibold tracking-tight truncate ${checked ? "text-emerald-950" : "text-on-surface"}`}>
                    {label}
                </span>
                {description && (
                    <span className="text-[10px] text-on-surface-variant/70 font-normal truncate hidden sm:inline">
                        ({description})
                    </span>
                )}
            </div>

            {/* Micro switch */}
            <span
                className={`relative inline-flex h-3.5 w-6 shrink-0 rounded-full border border-transparent transition-colors duration-150 ease-in-out ${
                    checked ? "bg-emerald-600" : "bg-slate-300"
                }`}>
                <span
                    className={`pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out mt-[1px] ml-[1px] ${
                        checked ? "translate-x-2.5" : "translate-x-0"
                    }`}
                />
            </span>
        </button>
    );
}

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

export default function EiaAirEmissionsPage() {
    // 1. Reporting Periods & Facilities
    const { data: periods = [] } = useReportingPeriods();
    const { data: facilities = [] } = useFacilities();

    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
    const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");

    useEffect(() => {
        if (!selectedPeriodId && periods.length > 0) {
            const openPeriod = periods.find((p) => p.periodStatus === "open") || periods[0];
            setSelectedPeriodId(openPeriod.id);
        }
    }, [periods, selectedPeriodId]);

    const activePeriod = useMemo(() => {
        return periods.find((p) => p.id === selectedPeriodId) || periods[0] || null;
    }, [periods, selectedPeriodId]);

    const fyLabel = activePeriod?.name || "FY 2024-25";

    // 2. Fetch Presets and Disclosure
    const { data: presetsData } = useEiaAirPresets();
    const {
        data: savedDisclosure,
        isLoading: isLoadingSaved,
    } = useEiaAirDisclosure(selectedPeriodId, selectedFacilityId || null);

    // 3. Mutation Hooks
    const computeMutation = useComputeEiaAir();
    const saveMutation = useSaveEiaAirDisclosure();
    const exportMutation = useExportEiaAirExcel();

    // 4. Form State
    const [stacks, setStacks] = useState<EIAStackInput[]>([createCleanStack()]);
    const [others, setOthers] = useState<EIAOtherPollutantInput[]>([]);
    const [computedResult, setComputedResult] = useState<EIAAirEmissionsComputedData | null>(null);

    const [isConfigOpen, setIsConfigOpen] = useState(true);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [expandedStackLog, setExpandedStackLog] = useState<number | null>(0);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

    const categoriesList = presetsData?.categories || ATTACHED_UNITS;

    // Hydrate form from saved disclosure when loaded
    useEffect(() => {
        if (savedDisclosure && savedDisclosure.stacks && savedDisclosure.stacks.length > 0) {
            const mappedStacks: EIAStackInput[] = savedDisclosure.stacks.map((s) => ({
                attached_unit: s.attached_unit || "Sponge iron / DRI",
                stack_title: s.stack_title || "Industrial Stack",
                operating_hours_per_year: s.operating_hours_per_year || 0,
                permitted_limits: s.permitted_limits || {
                    permitted_flow_rate: { value: 150000, unit: "nm3_per_hour" },
                    permitted_limit_nox: { value: 400, unit: "mg_per_nm3" },
                    permitted_limit_sox: { value: 200, unit: "mg_per_nm3" },
                    permitted_limit_pm: { value: 50, unit: "mg_per_nm3" },
                    permitted_limit_pm10: { value: 50, unit: "mg_per_nm3" },
                    permitted_limit_pm25: { value: 30, unit: "mg_per_nm3" },
                    permitted_limit_co: { value: 100, unit: "mg_per_nm3" },
                    custom_limits: {},
                },
                readings: (s.readings && s.readings.length > 0) ? s.readings : [createCleanReading()],
                is_nox_monitored: s.is_nox_monitored ?? true,
                is_sox_monitored: s.is_sox_monitored ?? true,
                is_pm_monitored: s.is_pm_monitored ?? true,
                is_pm10_monitored: s.is_pm10_monitored ?? true,
                is_pm25_monitored: s.is_pm25_monitored ?? true,
                is_co_monitored: s.is_co_monitored ?? true,
                is_pop_monitored: !!s.is_pop_monitored,
                is_voc_monitored: !!s.is_voc_monitored,
                is_hap_monitored: !!s.is_hap_monitored,
                is_co2_monitored: !!s.is_co2_monitored,
                is_o2_monitored: !!s.is_o2_monitored,
                report_number: s.report_number || "",
            }));
            setStacks(mappedStacks);
            setComputedResult(savedDisclosure);
        }
    }, [savedDisclosure]);

    // Helpers to parse values to null when empty, preventing skewing of arithmetic averages
    const toPollutantOrNull = (val: any) => {
        if (val === undefined || val === null || val === "" || isNaN(Number(val))) {
            return null;
        }
        return { value: Number(val), unit: "mg_per_nm3" as const };
    };

    const toPercentOrNull = (val: any) => {
        if (val === undefined || val === null || val === "" || isNaN(Number(val))) {
            return null;
        }
        return Number(val);
    };

    // Build Payload Helper (Conforms to Endpoint 2, 4 & 5 contracts)
    // Toggles govern inclusion: only monitored gases are sent in permitted_limits and readings!
    const buildPayload = (): EIAAirEmissionsPayload => ({
        reporting_period_id: selectedPeriodId || undefined,
        financial_year_label: fyLabel,
        facility_id: selectedFacilityId || null,
        stacks: stacks.map((s, idx) => {
            const isNox = true;
            const isSox = true;
            const isPm = true;
            const isPm10 = !!s.is_pm10_monitored;
            const isPm25 = !!s.is_pm25_monitored;
            const isCo = !!s.is_co_monitored;
            const isPop = !!s.is_pop_monitored;
            const isVoc = !!s.is_voc_monitored;
            const isHap = !!s.is_hap_monitored;
            const isCo2 = !!s.is_co2_monitored;
            const isO2 = !!s.is_o2_monitored;

            return {
                attached_unit: s.attached_unit || "Other",
                stack_title: s.stack_title || `Industrial Stack #${idx + 1}`,
                operating_hours_per_year: Number(s.operating_hours_per_year) || 0,
                report_number: s.report_number || null,
                is_nox_monitored: isNox,
                is_sox_monitored: isSox,
                is_pm_monitored: isPm,
                is_pm10_monitored: isPm10,
                is_pm25_monitored: isPm25,
                is_co_monitored: isCo,
                is_pop_monitored: isPop,
                is_voc_monitored: isVoc,
                is_hap_monitored: isHap,
                is_co2_monitored: isCo2,
                is_o2_monitored: isO2,
                permitted_limits: {
                    permitted_flow_rate: {
                        value: Number(s.permitted_limits?.permitted_flow_rate?.value) || 0,
                        unit: "nm3_per_hour",
                    },
                    ...(isNox ? {
                        permitted_limit_nox: {
                            value: Number(s.permitted_limits?.permitted_limit_nox?.value) || 0,
                            unit: "mg_per_nm3",
                        },
                    } : {}),
                    ...(isSox ? {
                        permitted_limit_sox: {
                            value: Number(s.permitted_limits?.permitted_limit_sox?.value) || 0,
                            unit: "mg_per_nm3",
                        },
                    } : {}),
                    ...(isPm ? {
                        permitted_limit_pm: {
                            value: Number(s.permitted_limits?.permitted_limit_pm?.value ?? s.permitted_limits?.permitted_limit_pm10?.value) || 0,
                            unit: "mg_per_nm3",
                        },
                    } : {}),
                    ...(isPm10 && s.permitted_limits?.permitted_limit_pm10?.value !== undefined && s.permitted_limits?.permitted_limit_pm10?.value !== "" ? {
                        permitted_limit_pm10: {
                            value: Number(s.permitted_limits.permitted_limit_pm10.value),
                            unit: "mg_per_nm3",
                        },
                    } : {}),
                    ...(isPm25 && s.permitted_limits?.permitted_limit_pm25?.value !== undefined && s.permitted_limits?.permitted_limit_pm25?.value !== "" ? {
                        permitted_limit_pm25: {
                            value: Number(s.permitted_limits.permitted_limit_pm25.value),
                            unit: "mg_per_nm3",
                        },
                    } : {}),
                    ...(isCo && s.permitted_limits?.permitted_limit_co?.value !== undefined && s.permitted_limits?.permitted_limit_co?.value !== "" ? {
                        permitted_limit_co: {
                            value: Number(s.permitted_limits.permitted_limit_co.value),
                            unit: "mg_per_nm3",
                        },
                    } : {}),
                    custom_limits: s.permitted_limits?.custom_limits || {},
                },
                readings: s.readings.map((r) => {
                    const readingObj: EIAReadingInput = {
                        sampling_date: r.sampling_date || format(new Date(), "yyyy-MM-dd"),
                        gas_flow_rate: {
                            value: Number(r.gas_flow_rate?.value) || 0,
                            unit: "nm3_per_hour",
                        },
                    };

                    if (isNox) {
                        const nox = toPollutantOrNull(r.nox?.value);
                        if (nox !== null) readingObj.nox = nox;
                    }

                    if (isSox) {
                        const sox = toPollutantOrNull(r.sox?.value);
                        if (sox !== null) readingObj.sox = sox;
                    }

                    if (isPm) {
                        const pm = toPollutantOrNull(r.pm?.value ?? r.particulate_matter?.value);
                        if (pm !== null) readingObj.pm = pm;
                    }

                    if (isPm10) {
                        const pm10 = toPollutantOrNull(r.pm10?.value);
                        if (pm10 !== null) readingObj.pm10 = pm10;
                    }

                    if (isPm25) {
                        const pm25 = toPollutantOrNull(r.pm25?.value);
                        if (pm25 !== null) readingObj.pm25 = pm25;
                    }

                    if (isCo) {
                        const co = toPollutantOrNull(r.co?.value);
                        if (co !== null) readingObj.co = co;
                    }

                    if (isPop) {
                        const pop = toPollutantOrNull(r.pop?.value);
                        if (pop !== null) readingObj.pop = pop;
                    }

                    if (isVoc) {
                        const voc = toPollutantOrNull(r.voc?.value);
                        if (voc !== null) readingObj.voc = voc;
                    }

                    if (isHap) {
                        const hap = toPollutantOrNull(r.hap?.value);
                        if (hap !== null) readingObj.hap = hap;
                    }

                    if (isCo2) {
                        const co2 = toPercentOrNull(r.co2_percent);
                        if (co2 !== null) readingObj.co2_percent = co2;
                    }

                    if (isO2) {
                        const o2 = toPercentOrNull(r.o2_percent);
                        if (o2 !== null) readingObj.o2_percent = o2;
                    }

                    // Dynamic custom gases
                    if (r.custom_gases && Object.keys(r.custom_gases).length > 0) {
                        const cleanCustomGases: Record<string, any> = {};
                        for (const [gasName, gasVal] of Object.entries(r.custom_gases)) {
                            const parsed = toPollutantOrNull((gasVal as any)?.value ?? gasVal);
                            if (parsed !== null) cleanCustomGases[gasName] = parsed;
                        }
                        if (Object.keys(cleanCustomGases).length > 0) {
                            readingObj.custom_gases = cleanCustomGases;
                        }
                    }

                    return readingObj;
                }),
            };
        }),
        others: others
            .filter((o) => o.label.trim() !== "")
            .map((o) => ({ label: o.label, quantity: Number(o.quantity) || 0 })),
    });

    // Compute / Preview Metrics
    const handleCompute = async () => {
        const payload = buildPayload();
        try {
            const res = await computeMutation.mutateAsync(payload);
            // Merge form stack readings and scope flags into computed stacks so they never get lost in audit views
            const mergedResult = {
                ...res,
                stacks: (res.stacks || []).map((cs, idx) => ({
                    ...cs,
                    readings: stacks[idx]?.readings || cs.readings || [],
                    permitted_limits: stacks[idx]?.permitted_limits || cs.permitted_limits,
                    is_nox_monitored: stacks[idx]?.is_nox_monitored,
                    is_sox_monitored: stacks[idx]?.is_sox_monitored,
                    is_pm_monitored: stacks[idx]?.is_pm_monitored,
                    is_pm10_monitored: stacks[idx]?.is_pm10_monitored,
                    is_pm25_monitored: stacks[idx]?.is_pm25_monitored,
                    is_co_monitored: stacks[idx]?.is_co_monitored,
                    is_pop_monitored: stacks[idx]?.is_pop_monitored,
                    is_voc_monitored: stacks[idx]?.is_voc_monitored,
                    is_hap_monitored: stacks[idx]?.is_hap_monitored,
                    is_co2_monitored: stacks[idx]?.is_co2_monitored,
                    is_o2_monitored: stacks[idx]?.is_o2_monitored,
                })),
            };
            setComputedResult(mergedResult);
        } catch (err) {
            console.error("Compute error:", err);
        }
    };

    // Save Disclosure
    const handleSave = async () => {
        const payload = buildPayload();
        try {
            const res = await saveMutation.mutateAsync(payload);
            const mergedResult = {
                ...res,
                stacks: (res.stacks || []).map((cs, idx) => ({
                    ...cs,
                    readings: stacks[idx]?.readings || cs.readings || [],
                    permitted_limits: stacks[idx]?.permitted_limits || cs.permitted_limits,
                    is_nox_monitored: stacks[idx]?.is_nox_monitored,
                    is_sox_monitored: stacks[idx]?.is_sox_monitored,
                    is_pm_monitored: stacks[idx]?.is_pm_monitored,
                    is_pm10_monitored: stacks[idx]?.is_pm10_monitored,
                    is_pm25_monitored: stacks[idx]?.is_pm25_monitored,
                    is_co_monitored: stacks[idx]?.is_co_monitored,
                    is_pop_monitored: stacks[idx]?.is_pop_monitored,
                    is_voc_monitored: stacks[idx]?.is_voc_monitored,
                    is_hap_monitored: stacks[idx]?.is_hap_monitored,
                    is_co2_monitored: stacks[idx]?.is_co2_monitored,
                    is_o2_monitored: stacks[idx]?.is_o2_monitored,
                })),
            };
            setComputedResult(mergedResult);
            setSaveSuccessMsg("EIA Stack Air Emissions disclosure saved successfully.");
            setTimeout(() => setSaveSuccessMsg(null), 4000);
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    // Export Excel
    const handleDownloadExcel = async () => {
        const payload = buildPayload();
        try {
            const blob = await exportMutation.mutateAsync(payload);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `EIA_Stack_Air_Emissions_${fyLabel.replace(/\s+/g, "_")}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setIsDownloadOpen(false);
        } catch (err) {
            console.error("Excel export error:", err);
        }
    };

    // Stack Handlers
    const handleAddStack = () => {
        setStacks((prev) => [...prev, createCleanStack()]);
    };

    const handleRemoveStack = (idx: number) => {
        setStacks((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleUpdateStackField = (stackIdx: number, field: string, value: any) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = JSON.parse(JSON.stringify(next[stackIdx]));

            const keys = field.split(".");
            let curr: any = stack;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!curr[keys[i]]) curr[keys[i]] = {};
                curr = curr[keys[i]];
            }
            curr[keys[keys.length - 1]] = value;

            next[stackIdx] = stack;
            return next;
        });
    };

    // Reading Handlers
    const handleAddReading = (stackIdx: number) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = { ...next[stackIdx] };
            stack.readings = [...stack.readings, createCleanReading()];
            next[stackIdx] = stack;
            return next;
        });
    };

    const handleRemoveReading = (stackIdx: number, readingIdx: number) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = { ...next[stackIdx] };
            if (stack.readings.length > 1) {
                stack.readings = stack.readings.filter((_, i) => i !== readingIdx);
            }
            next[stackIdx] = stack;
            return next;
        });
    };

    const handleUpdateReadingField = (
        stackIdx: number,
        readingIdx: number,
        field: string,
        value: any
    ) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = { ...next[stackIdx] };
            const readings = [...stack.readings];
            const reading = { ...readings[readingIdx] };

            if (field.includes(".")) {
                const [parent, child] = field.split(".");
                (reading as any)[parent] = {
                    ...(reading as any)[parent],
                    [child]: value,
                };
            } else {
                (reading as any)[field] = value;
            }

            readings[readingIdx] = reading;
            stack.readings = readings;
            next[stackIdx] = stack;
            return next;
        });
    };

    // Custom Gas Limits Handlers
    const handleAddCustomGas = (stackIdx: number, gasName: string) => {
        if (!gasName.trim()) return;
        const key = gasName.trim().toLowerCase();
        setStacks((prev) => {
            const next = [...prev];
            const stack = JSON.parse(JSON.stringify(next[stackIdx]));
            if (!stack.permitted_limits) stack.permitted_limits = {};
            if (!stack.permitted_limits.custom_limits) stack.permitted_limits.custom_limits = {};
            stack.permitted_limits.custom_limits[key] = { value: 25, unit: "mg_per_nm3" };

            // Add to all readings of this stack
            stack.readings = stack.readings.map((r: EIAReadingInput) => ({
                ...r,
                custom_gases: {
                    ...(r.custom_gases || {}),
                    [key]: { value: 15, unit: "mg_per_nm3" },
                },
            }));

            next[stackIdx] = stack;
            return next;
        });
    };

    const handleRemoveCustomGas = (stackIdx: number, gasKey: string) => {
        setStacks((prev) => {
            const next = [...prev];
            const stack = JSON.parse(JSON.stringify(next[stackIdx]));
            if (stack.permitted_limits?.custom_limits) {
                delete stack.permitted_limits.custom_limits[gasKey];
            }
            stack.readings = stack.readings.map((r: EIAReadingInput) => {
                const updated = { ...(r.custom_gases || {}) };
                delete updated[gasKey];
                return { ...r, custom_gases: updated };
            });
            next[stackIdx] = stack;
            return next;
        });
    };

    // Number Formatter Helper
    const formatNum = (val: string | number | null | undefined, defaultDecimals = 2) => {
        if (val === null || val === undefined || val === "") return "0.00";
        const num = Number(val);
        if (isNaN(num)) return "0.00";
        if (num === 0) return "0.00";

        const absNum = Math.abs(num);
        let maxDecimals = defaultDecimals;
        if (absNum < 1 && absNum > 0) maxDecimals = Math.max(defaultDecimals, 4);
        if (absNum < 0.0001 && absNum > 0) maxDecimals = Math.max(defaultDecimals, 6);

        return num.toLocaleString("en-US", {
            minimumFractionDigits: Math.min(defaultDecimals, maxDecimals),
            maximumFractionDigits: maxDecimals,
        });
    };

    // Computed Summary Views (Supports both on-the-fly and database-loaded payloads)
    const displayData = computedResult || savedDisclosure;
    const plantTotals = displayData?.plant_totals || displayData?.computed_totals?.plant_totals;
    const calculatedStacks: EIACalculatedStack[] = displayData?.stacks || displayData?.computed_totals?.stacks || [];

    const plantExceedancesCount = plantTotals?.plant_total_exceedances_by_pollutant || {};
    const hasAnyExceedance = Object.values(plantExceedancesCount).some((c: any) => Number(c) > 0);

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 animate-fade-up">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b border-outline-variant pb-6">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="tag" size="md" className="bg-emerald-600/10 text-emerald-800 border-emerald-600/20 font-bold">
                            EIA / NIPL Operational Module
                        </Badge>
                    </div>

                    <h1 className="text-headline-md font-bold tracking-tight text-primary font-display">
                        EIA / NIPL Industrial Stack Air Emissions
                    </h1>
                </div>

                {/* Header Action Bar */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Facility Selector (Optional) */}
                    {facilities.length > 0 && (
                        <div className="flex items-center gap-1.5 bg-white border border-outline-variant rounded-lg px-2.5 py-1.5 shadow-2xs">
                            <MaterialIcon name="domain" size="sm" className="text-on-surface-variant" />
                            <select
                                value={selectedFacilityId}
                                onChange={(e) => setSelectedFacilityId(e.target.value)}
                                className="bg-transparent text-xs font-medium text-on-surface focus:outline-none cursor-pointer">
                                <option value="">All Facilities / Unassigned</option>
                                {facilities.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Period Selector */}
                    <div className="flex items-center gap-1.5 bg-white border border-outline-variant rounded-lg px-2.5 py-1.5 shadow-2xs">
                        <MaterialIcon name="calendar_month" size="sm" className="text-primary" />
                        <select
                            value={selectedPeriodId}
                            onChange={(e) => setSelectedPeriodId(e.target.value)}
                            className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer">
                            {periods.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button
                        variant="secondary"
                        size="md"
                        onClick={handleAddStack}
                        className="flex items-center gap-1.5 text-xs font-semibold">
                        <MaterialIcon name="add" size="sm" />
                        <span>Add New Stack</span>
                    </Button>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleCompute}
                        disabled={computeMutation.isPending}
                        className="flex items-center gap-1.5 text-xs font-bold shadow-sm">
                        {computeMutation.isPending ? (
                            <>
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <span>Computing...</span>
                            </>
                        ) : (
                            <>
                                <MaterialIcon name="refresh" size="sm" />
                                <span>Compute Metrics</span>
                            </>
                        )}
                    </Button>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm">
                        {saveMutation.isPending ? (
                            <>
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <MaterialIcon name="save" size="sm" />
                                <span>Save Draft</span>
                            </>
                        )}
                    </Button>

                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setIsDownloadOpen(true)}
                        className="flex items-center gap-1.5 text-xs font-semibold">
                        <MaterialIcon name="download" size="sm" />
                        <span>Export Excel</span>
                    </Button>
                </div>
            </div>

            {/* Notification / Alert Banners */}
            {saveSuccessMsg && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in shadow-xs">
                    <MaterialIcon name="check_circle" size="sm" className="text-emerald-700" />
                    <span>{saveSuccessMsg}</span>
                </div>
            )}

            {hasAnyExceedance && (
                <div className="rounded-xl border border-error/30 bg-error-container/15 p-4 text-xs text-error flex items-start gap-2.5 animate-fade-in shadow-xs">
                    <MaterialIcon name="warning" size="sm" className="text-error shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold">Statutory Limit Exceedance Detected:</span> One or more stack sampling readings exceed permitted limits. Review the highlighted cells and logs below.
                    </div>
                </div>
            )}

            {/* Configuration & Inputs Panel */}
            {isConfigOpen && (
                <Card className="shadow-md border-outline-variant/80">
                    <CardHeader tone="strip" className="py-3 px-5 bg-white flex items-center justify-between border-b border-outline-variant/60">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="tune" size="sm" className="text-primary" />
                            <span className="font-sans text-body-sm font-bold text-on-surface">
                                Industrial Stack &amp; Criteria Sampling Configuration ({stacks.length} Stack{stacks.length > 1 ? "s" : ""})
                            </span>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleAddStack}
                            className="flex items-center gap-1 text-xs px-3 py-1 font-semibold">
                            <MaterialIcon name="add" size="sm" />
                            <span>Add Stack</span>
                        </Button>
                    </CardHeader>
                    <CardBody className="p-5 space-y-6">
                        {stacks.map((stack, stackIdx) => {
                            const currentUnit = stack.attached_unit || "Sponge iron / DRI";
                            const presetsForUnit = presetsData?.presets?.[currentUnit] || DEFAULT_STACK_PRESETS[currentUnit] || [];
                            const customGasesList = Object.keys(stack.permitted_limits?.custom_limits || {});

                            // Monitored Flags: Core criteria (NOx, SOx, PM) are mandatory statutory pollutants
                            const isNox = true;
                            const isSox = true;
                            const isPm = true;
                            const isPm10 = !!stack.is_pm10_monitored;
                            const isPm25 = !!stack.is_pm25_monitored;
                            const isCo = !!stack.is_co_monitored;
                            const isPop = !!stack.is_pop_monitored;
                            const isVoc = !!stack.is_voc_monitored;
                            const isHap = !!stack.is_hap_monitored;
                            const isCo2 = !!stack.is_co2_monitored;
                            const isO2 = !!stack.is_o2_monitored;

                            return (
                                <div
                                    key={stackIdx}
                                    className={`space-y-6 ${stackIdx > 0 ? "pt-8 border-t border-outline-variant/60" : ""}`}>
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
                                                    Unit: {currentUnit} • {stack.operating_hours_per_year} hrs/yr
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {stacks.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveStack(stackIdx)}
                                                    className="text-error hover:text-error/80 text-xs flex items-center gap-1 font-semibold transition px-2 py-1 rounded hover:bg-error/10 cursor-pointer">
                                                    <MaterialIcon name="delete" size="sm" />
                                                    <span>Delete Stack</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 1: Metadata (Attached Unit, Stack Title, Operating Hours) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-low/50 p-3.5 rounded-xl border border-outline-variant/40">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface-variant block">
                                                Attached Industrial Unit <span className="text-error">*</span>
                                            </label>
                                            <select
                                                value={currentUnit}
                                                onChange={(e) => {
                                                    const newUnit = e.target.value;
                                                    handleUpdateStackField(stackIdx, "attached_unit", newUnit);
                                                    const pList = presetsData?.presets?.[newUnit] || DEFAULT_STACK_PRESETS[newUnit] || [];
                                                    handleUpdateStackField(stackIdx, "stack_title", pList[0] || "");
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
                                                Stack Title / Preset Autocomplete <span className="text-error">*</span>
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
                                                        <option value="__custom__">+ Custom Title...</option>
                                                    </select>
                                                    {(!presetsForUnit.includes(stack.stack_title) || stack.attached_unit === "Other") && (
                                                        <input
                                                            type="text"
                                                            placeholder="Enter custom stack title..."
                                                            value={stack.stack_title || ""}
                                                            onChange={(e) => handleUpdateStackField(stackIdx, "stack_title", e.target.value)}
                                                            className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-sans text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs animate-fade-in"
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Primary Bag Filter Stack"
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

                                    {/* Row 2: OPTIONAL MONITORED GASES & PARAMETERS (Subtle & Compact 4-Column Grid) */}
                                    <div className="space-y-2 border-t border-outline-variant/30 pt-3">
                                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                                            <div className="flex items-center gap-1.5 text-on-surface-variant">
                                                <MaterialIcon name="tune" size="sm" className="!text-[15px] text-primary" />
                                                <span className="text-[11px] font-semibold tracking-wider text-on-surface uppercase">
                                                    Optional Monitored Pollutants &amp; Flue Gas Parameters
                                                </span>
                                                <span className="text-[10px] text-on-surface-variant/70 font-normal hidden sm:inline">
                                                    • Core criteria NOx, SOx &amp; PM are mandatory &amp; always monitored
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-on-surface-variant/70 font-mono">
                                                {[isPm10, isPm25, isCo, isPop, isVoc, isHap, isCo2, isO2].filter(Boolean).length}/8 optional active
                                            </span>
                                        </div>

                                        {/* 4 x 2 Sleek, Compact & Subtle Switch Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            <SubtleGasToggle
                                                label="PM₁₀"
                                                description="Respirable Dust"
                                                checked={isPm10}
                                                onChange={(val) => handleUpdateStackField(stackIdx, "is_pm10_monitored", val)}
                                            />
                                            <SubtleGasToggle
                                                label="PM₂.₅"
                                                description="Fine Particulate"
                                                checked={isPm25}
                                                onChange={(val) => handleUpdateStackField(stackIdx, "is_pm25_monitored", val)}
                                            />
                                            <SubtleGasToggle
                                                label="CO"
                                                description="Carbon Monoxide"
                                                checked={isCo}
                                                onChange={(val) => handleUpdateStackField(stackIdx, "is_co_monitored", val)}
                                            />
                                            <SubtleGasToggle
                                                label="POP"
                                                description="Persistent Organic"
                                                checked={isPop}
                                                onChange={(val) => handleUpdateStackField(stackIdx, "is_pop_monitored", val)}
                                            />
                                            <SubtleGasToggle
                                                label="VOC"
                                                description="Volatile Organic"
                                                checked={isVoc}
                                                onChange={(val) => handleUpdateStackField(stackIdx, "is_voc_monitored", val)}
                                            />
                                            <SubtleGasToggle
                                                label="HAP"
                                                description="Hazardous Pollutants"
                                                checked={isHap}
                                                onChange={(val) => handleUpdateStackField(stackIdx, "is_hap_monitored", val)}
                                            />
                                            <SubtleGasToggle
                                                label="CO₂ %"
                                                description="Flue Gas Vol %"
                                                checked={isCo2}
                                                onChange={(val) => handleUpdateStackField(stackIdx, "is_co2_monitored", val)}
                                            />
                                            <SubtleGasToggle
                                                label="O₂ %"
                                                description="Flue Gas Vol %"
                                                checked={isO2}
                                                onChange={(val) => handleUpdateStackField(stackIdx, "is_o2_monitored", val)}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3: PERMITTED REGULATORY LIMITS (4-Column Grid, Dynamic Based on Toggles) */}
                                    <div className="space-y-3 border-t border-outline-variant/40 pt-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <MaterialIcon name="verified" size="sm" className="text-primary" />
                                                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                                                    Permitted Regulatory Limits (Specified Once Per Stack)
                                                </span>
                                            </div>
                                            {/* Add Custom Gas Input */}
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    id={`custom-gas-input-${stackIdx}`}
                                                    type="text"
                                                    placeholder="Gas name (e.g. nh3, hf, cl2)"
                                                    className="h-7 rounded border border-outline-variant bg-white px-2 text-[11px] font-mono text-on-surface"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            const input = e.currentTarget;
                                                            handleAddCustomGas(stackIdx, input.value);
                                                            input.value = "";
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => {
                                                        const el = document.getElementById(`custom-gas-input-${stackIdx}`) as HTMLInputElement | null;
                                                        if (el && el.value) {
                                                            handleAddCustomGas(stackIdx, el.value);
                                                            el.value = "";
                                                        }
                                                    }}
                                                    className="h-7 px-2 text-[10px] font-semibold">
                                                    + Add Custom Limit
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                            {/* Always shown: Permitted Flow Rate */}
                                            <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                <label className="text-[10px] font-bold text-slate-700 block uppercase">
                                                    Permitted Flow (Nm³/h) <span className="text-error">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    placeholder="150000"
                                                    value={stack.permitted_limits?.permitted_flow_rate?.value || ""}
                                                    onChange={(e) =>
                                                        handleUpdateStackField(stackIdx, "permitted_limits.permitted_flow_rate.value", e.target.value)
                                                    }
                                                    className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Shown only when NOx is monitored */}
                                            {isNox && (
                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-blue-700 block uppercase">
                                                        NOx Limit (mg/Nm³) <span className="text-error">*</span>
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
                                            )}

                                            {/* Shown only when SOx is monitored */}
                                            {isSox && (
                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-amber-700 block uppercase">
                                                        SOx Limit (mg/Nm³) <span className="text-error">*</span>
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
                                            )}

                                            {/* Shown only when PM is monitored */}
                                            {isPm && (
                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-emerald-700 block uppercase">
                                                        PM / SPM Limit (mg/Nm³) <span className="text-error">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="50"
                                                        value={stack.permitted_limits?.permitted_limit_pm?.value || ""}
                                                        onChange={(e) => {
                                                            handleUpdateStackField(stackIdx, "permitted_limits.permitted_limit_pm.value", e.target.value);
                                                        }}
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                            )}

                                            {/* Shown only when PM10 is monitored */}
                                            {isPm10 && (
                                                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-outline-variant/40">
                                                    <label className="text-[10px] font-bold text-emerald-800 block uppercase">
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
                                            )}

                                            {/* Shown only when PM2.5 is monitored */}
                                            {isPm25 && (
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
                                            )}

                                            {/* Shown only when CO is monitored */}
                                            {isCo && (
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
                                            )}

                                            {/* Custom Gases Limit Inputs */}
                                            {customGasesList.map((gasKey) => (
                                                <div key={gasKey} className="space-y-1 bg-white p-2.5 rounded-lg border border-indigo-200 relative">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-bold text-indigo-700 uppercase">
                                                            {gasKey} Limit (mg/Nm³)
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveCustomGas(stackIdx, gasKey)}
                                                            className="text-error hover:text-error/80 text-[10px] cursor-pointer">
                                                            ×
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="25"
                                                        value={stack.permitted_limits?.custom_limits?.[gasKey]?.value || ""}
                                                        onChange={(e) => {
                                                            setStacks((prev) => {
                                                                const next = [...prev];
                                                                const s = JSON.parse(JSON.stringify(next[stackIdx]));
                                                                s.permitted_limits.custom_limits[gasKey].value = e.target.value;
                                                                next[stackIdx] = s;
                                                                return next;
                                                            });
                                                        }}
                                                        className="w-full h-8 rounded border border-outline-variant bg-white px-2 py-0.5 font-mono text-xs font-semibold text-indigo-900 focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Row 4: OPERATIONAL SAMPLING READINGS LOG (Dynamic 4-Column Grid) */}
                                    <div className="space-y-3 border-t border-outline-variant/40 pt-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <MaterialIcon name="science" size="sm" className="text-secondary" />
                                                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                                                    Operational Sampling Readings Log ({stack.readings.length} Reading{stack.readings.length > 1 ? "s" : ""})
                                                </span>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleAddReading(stackIdx)}
                                                className="flex items-center gap-1 text-[11px] px-2.5 py-1 font-semibold">
                                                <MaterialIcon name="add" size="sm" />
                                                <span>Add Reading Row</span>
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {stack.readings.map((reading, readingIdx) => {
                                                // In-Row Live Exceedance Check against Stack Permitted Limits
                                                const pLimits = stack.permitted_limits;
                                                const noxVal = isNox && reading.nox?.value !== undefined && reading.nox?.value !== "" ? Number(reading.nox.value) : null;
                                                const noxLimit = pLimits?.permitted_limit_nox?.value ? Number(pLimits.permitted_limit_nox.value) : null;
                                                const isNoxExceeded = noxVal !== null && noxLimit !== null && noxVal > noxLimit;

                                                const soxVal = isSox && reading.sox?.value !== undefined && reading.sox?.value !== "" ? Number(reading.sox.value) : null;
                                                const soxLimit = pLimits?.permitted_limit_sox?.value ? Number(pLimits.permitted_limit_sox.value) : null;
                                                const isSoxExceeded = soxVal !== null && soxLimit !== null && soxVal > soxLimit;

                                                const pmVal = isPm && reading.pm?.value !== undefined && reading.pm?.value !== "" ? Number(reading.pm.value) : null;
                                                const pmLimit = pLimits?.permitted_limit_pm?.value ? Number(pLimits.permitted_limit_pm.value) : null;
                                                const isPmExceeded = pmVal !== null && pmLimit !== null && pmVal > pmLimit;

                                                const pm10Val = isPm10 && reading.pm10?.value !== undefined && reading.pm10?.value !== "" ? Number(reading.pm10.value) : null;
                                                const pm10Limit = pLimits?.permitted_limit_pm10?.value ? Number(pLimits.permitted_limit_pm10.value) : null;
                                                const isPm10Exceeded = pm10Val !== null && pm10Limit !== null && pm10Val > pm10Limit;

                                                const pm25Val = isPm25 && reading.pm25?.value !== undefined && reading.pm25?.value !== "" ? Number(reading.pm25.value) : null;
                                                const pm25Limit = pLimits?.permitted_limit_pm25?.value ? Number(pLimits.permitted_limit_pm25.value) : null;
                                                const isPm25Exceeded = pm25Val !== null && pm25Limit !== null && pm25Val > pm25Limit;

                                                const coVal = isCo && reading.co?.value !== undefined && reading.co?.value !== "" ? Number(reading.co.value) : null;
                                                const coLimit = pLimits?.permitted_limit_co?.value ? Number(pLimits.permitted_limit_co.value) : null;
                                                const isCoExceeded = coVal !== null && coLimit !== null && coVal > coLimit;

                                                const flowVal = reading.gas_flow_rate?.value !== undefined && reading.gas_flow_rate?.value !== "" ? Number(reading.gas_flow_rate.value) : null;
                                                const flowLimit = pLimits?.permitted_flow_rate?.value ? Number(pLimits.permitted_flow_rate.value) : null;
                                                const isFlowExceeded = flowVal !== null && flowLimit !== null && flowVal > flowLimit;

                                                const hasRowExceedance = isNoxExceeded || isSoxExceeded || isPmExceeded || isPm10Exceeded || isPm25Exceeded || isCoExceeded || isFlowExceeded;

                                                return (
                                                    <div
                                                        key={readingIdx}
                                                        className={`rounded-xl border p-3.5 space-y-3 transition shadow-2xs ${
                                                            hasRowExceedance ? "border-error/40 bg-error-container/5" : "border-outline-variant/50 bg-white"
                                                        }`}>
                                                        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-[11px] font-bold text-on-surface-variant flex items-center gap-1.5">
                                                                    <span className="h-2 w-2 rounded-full bg-secondary" />
                                                                    Reading Row #{readingIdx + 1}
                                                                </span>
                                                                {hasRowExceedance && (
                                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-error bg-error/10 px-2 py-0.5 rounded">
                                                                        <MaterialIcon name="warning" size="sm" className="!text-[12px]" />
                                                                        Limit Exceeded
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {stack.readings.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveReading(stackIdx, readingIdx)}
                                                                    className="text-error hover:text-error/80 text-[11px] flex items-center gap-1 font-medium transition cursor-pointer">
                                                                    <MaterialIcon name="close" size="sm" />
                                                                    <span>Remove Row</span>
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Dynamic 4-Column Grid of Monitored Gases for this Reading */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                                            {/* Date & Flow Rate (Always Monitored) */}
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-on-surface-variant block">
                                                                    Date <span className="text-error">*</span>
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
                                                                    Flow (Nm³/h) <span className="text-error">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="100000"
                                                                    value={reading.gas_flow_rate?.value || ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateReadingField(stackIdx, readingIdx, "gas_flow_rate.value", e.target.value)
                                                                    }
                                                                    className={`w-full h-8.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold focus:ring-1 focus:ring-primary shadow-2xs ${
                                                                        isFlowExceeded ? "border-error bg-error/10 text-error font-bold" : "border-outline-variant bg-white text-on-surface"
                                                                    }`}
                                                                />
                                                            </div>

                                                            {/* NOx (Shown only if monitored) */}
                                                            {isNox && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-blue-700 block">
                                                                        NOx (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="200"
                                                                        value={reading.nox?.value ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "nox.value", e.target.value)
                                                                        }
                                                                        className={`w-full h-8.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold focus:ring-1 focus:ring-primary shadow-2xs ${
                                                                            isNoxExceeded ? "border-error bg-error/10 text-error font-bold" : "border-outline-variant bg-white text-on-surface"
                                                                        }`}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* SOx (Shown only if monitored) */}
                                                            {isSox && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-amber-700 block">
                                                                        SOx (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="100"
                                                                        value={reading.sox?.value ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "sox.value", e.target.value)
                                                                        }
                                                                        className={`w-full h-8.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold focus:ring-1 focus:ring-primary shadow-2xs ${
                                                                            isSoxExceeded ? "border-error bg-error/10 text-error font-bold" : "border-outline-variant bg-white text-on-surface"
                                                                        }`}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* PM / SPM (Shown only if monitored) */}
                                                            {isPm && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-emerald-700 block">
                                                                        PM / SPM (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="45"
                                                                        value={reading.pm?.value ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "pm.value", e.target.value)
                                                                        }
                                                                        className={`w-full h-8.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold focus:ring-1 focus:ring-primary shadow-2xs ${
                                                                            isPmExceeded ? "border-error bg-error/10 text-error font-bold" : "border-outline-variant bg-white text-on-surface"
                                                                        }`}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* PM10 (Shown only if monitored) */}
                                                            {isPm10 && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-emerald-800 block">
                                                                        PM₁₀ (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="45"
                                                                        value={reading.pm10?.value ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "pm10.value", e.target.value)
                                                                        }
                                                                        className={`w-full h-8.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold focus:ring-1 focus:ring-primary shadow-2xs ${
                                                                            isPm10Exceeded ? "border-error bg-error/10 text-error font-bold" : "border-outline-variant bg-white text-on-surface"
                                                                        }`}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* PM2.5 (Shown only if monitored) */}
                                                            {isPm25 && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-teal-700 block">
                                                                        PM₂.₅ (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="22"
                                                                        value={reading.pm25?.value ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "pm25.value", e.target.value)
                                                                        }
                                                                        className={`w-full h-8.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold focus:ring-1 focus:ring-primary shadow-2xs ${
                                                                            isPm25Exceeded ? "border-error bg-error/10 text-error font-bold" : "border-outline-variant bg-white text-on-surface"
                                                                        }`}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* CO (Shown only if monitored) */}
                                                            {isCo && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-purple-700 block">
                                                                        CO (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="25"
                                                                        value={reading.co?.value ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "co.value", e.target.value)
                                                                        }
                                                                        className={`w-full h-8.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold focus:ring-1 focus:ring-primary shadow-2xs ${
                                                                            isCoExceeded ? "border-error bg-error/10 text-error font-bold" : "border-outline-variant bg-white text-on-surface"
                                                                        }`}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* POP (Shown only if monitored) */}
                                                            {isPop && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-slate-700 block">
                                                                        POP (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="0.05"
                                                                        value={reading.pop?.value ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "pop.value", e.target.value)
                                                                        }
                                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* VOC (Shown only if monitored) */}
                                                            {isVoc && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-slate-700 block">
                                                                        VOC (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="12.0"
                                                                        value={reading.voc?.value ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "voc.value", e.target.value)
                                                                        }
                                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* HAP (Shown only if monitored) */}
                                                            {isHap && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-slate-700 block">
                                                                        HAP (mg/Nm³)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="1.5"
                                                                        value={reading.hap?.value ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "hap.value", e.target.value)
                                                                        }
                                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* CO2 % (Shown only if monitored) */}
                                                            {isCo2 && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-slate-700 block">
                                                                        CO₂ in Flue Gas (Vol %)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="12.5"
                                                                        value={reading.co2_percent ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "co2_percent", e.target.value)
                                                                        }
                                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* O2 % (Shown only if monitored) */}
                                                            {isO2 && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-semibold text-slate-700 block">
                                                                        O₂ in Flue Gas (Vol %)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="8.0"
                                                                        value={reading.o2_percent ?? ""}
                                                                        onChange={(e) =>
                                                                            handleUpdateReadingField(stackIdx, readingIdx, "o2_percent", e.target.value)
                                                                        }
                                                                        className="w-full h-8.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-mono text-xs font-semibold text-on-surface"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Custom Gas Readings (e.g. NH3, HF, etc.) */}
                                                            {customGasesList.map((gasKey) => {
                                                                const customVal = reading.custom_gases?.[gasKey]?.value !== undefined && reading.custom_gases?.[gasKey]?.value !== ""
                                                                    ? Number(reading.custom_gases[gasKey].value)
                                                                    : null;
                                                                const customLimit = pLimits?.custom_limits?.[gasKey]?.value
                                                                    ? Number(pLimits.custom_limits[gasKey].value)
                                                                    : null;
                                                                const isCustomExceeded = customVal !== null && customLimit !== null && customVal > customLimit;

                                                                return (
                                                                    <div key={gasKey} className="space-y-1">
                                                                        <label className="text-[10px] font-semibold text-indigo-700 block uppercase">
                                                                            {gasKey} (mg/Nm³)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="any"
                                                                            placeholder="18"
                                                                            value={reading.custom_gases?.[gasKey]?.value ?? ""}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                setStacks((prev) => {
                                                                                    const next = [...prev];
                                                                                    const s = JSON.parse(JSON.stringify(next[stackIdx]));
                                                                                    if (!s.readings[readingIdx].custom_gases) {
                                                                                        s.readings[readingIdx].custom_gases = {};
                                                                                    }
                                                                                    s.readings[readingIdx].custom_gases[gasKey] = {
                                                                                        value: val,
                                                                                        unit: "mg_per_nm3",
                                                                                    };
                                                                                    next[stackIdx] = s;
                                                                                    return next;
                                                                                });
                                                                            }}
                                                                            className={`w-full h-8.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold ${
                                                                                isCustomExceeded ? "border-error bg-error/10 text-error font-bold" : "border-indigo-200 bg-white text-indigo-900"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Document Upload Section */}
                                    <div className="pt-2">
                                        <BrsrDocumentUploadSection
                                            title={`Stack #${stackIdx + 1} (${stack.stack_title}) Lab Test Report & Calibration Certificate`}
                                            reportNumber={stack.report_number || ""}
                                            onReportNumberChange={(val) => handleUpdateStackField(stackIdx, "report_number", val)}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Actions Inside Config Card */}
                        <div className="flex justify-end gap-2.5 border-t border-outline-variant/60 pt-4">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => {
                                    setStacks([createCleanStack()]);
                                    setOthers([]);
                                }}
                                className="px-4 py-2 text-xs font-semibold">
                                Reset Form
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleCompute}
                                disabled={computeMutation.isPending}
                                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold shadow-md">
                                <MaterialIcon name="refresh" size="sm" />
                                Compute Stack Metrics
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Loading Indicator */}
            {(isLoadingSaved || computeMutation.isPending) && (
                <div className="flex h-36 flex-col items-center justify-center gap-2">
                    <div className="h-7 w-7 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
                    <p className="font-mono text-xs text-on-surface-variant animate-pulse">
                        Calculating stack flow rates and mass emission totals...
                    </p>
                </div>
            )}

            {/* Computed Results Dashboard */}
            {displayData && (
                <div className="space-y-6 animate-fade-in">
                    {/* Plant Overview Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* 1. Total NOx */}
                        <Card interactive className="border-l-4 border-l-blue-500 shadow-xs">
                            <CardBody className="p-4 flex flex-col justify-between h-full">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Plant Total NOx
                                    </span>
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                        <MaterialIcon name="cloud" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1 font-mono">
                                        <span className="text-headline-sm font-bold text-primary">
                                            {formatNum(plantTotals?.plant_total_annual_emissions_tonnes_year?.nox)}
                                        </span>
                                        <span className="text-[11px] font-sans text-on-surface-variant">t/yr</span>
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                        Avg Conc: {formatNum(plantTotals?.plant_pooled_average_concentration_mg_nm3?.nox)} mg/Nm³
                                    </p>
                                    <p className="text-[10px] text-blue-700 font-mono">
                                        Rate: {formatNum(plantTotals?.plant_combined_hourly_rate_kg_hr?.nox)} kg/hr
                                    </p>
                                    {plantExceedancesCount?.nox ? (
                                        <span className="text-[10px] text-error font-bold block mt-1">
                                            ⚠️ {plantExceedancesCount.nox} Exceedance(s)
                                        </span>
                                    ) : null}
                                </div>
                            </CardBody>
                        </Card>

                        {/* 2. Total SOx */}
                        <Card interactive className="border-l-4 border-l-amber-500 shadow-xs">
                            <CardBody className="p-4 flex flex-col justify-between h-full">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Plant Total SOx
                                    </span>
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                        <MaterialIcon name="air" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1 font-mono">
                                        <span className="text-headline-sm font-bold text-amber-700">
                                            {formatNum(plantTotals?.plant_total_annual_emissions_tonnes_year?.sox)}
                                        </span>
                                        <span className="text-[11px] font-sans text-on-surface-variant">t/yr</span>
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                        Avg Conc: {formatNum(plantTotals?.plant_pooled_average_concentration_mg_nm3?.sox)} mg/Nm³
                                    </p>
                                    <p className="text-[10px] text-amber-700 font-mono">
                                        Rate: {formatNum(plantTotals?.plant_combined_hourly_rate_kg_hr?.sox)} kg/hr
                                    </p>
                                    {plantExceedancesCount?.sox ? (
                                        <span className="text-[10px] text-error font-bold block mt-1">
                                            ⚠️ {plantExceedancesCount.sox} Exceedance(s)
                                        </span>
                                    ) : null}
                                </div>
                            </CardBody>
                        </Card>

                        {/* 3. Total PM / SPM */}
                        <Card interactive className="border-l-4 border-l-emerald-600 shadow-xs">
                            <CardBody className="p-4 flex flex-col justify-between h-full">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        PM / SPM
                                    </span>
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                        <MaterialIcon name="grain" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1 font-mono">
                                        <span className="text-headline-sm font-bold text-emerald-700">
                                            {formatNum(plantTotals?.plant_total_annual_emissions_tonnes_year?.pm ?? plantTotals?.plant_total_annual_emissions_tonnes_year?.pm10)}
                                        </span>
                                        <span className="text-[11px] font-sans text-on-surface-variant">t/yr</span>
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                        Avg Conc: {formatNum(plantTotals?.plant_pooled_average_concentration_mg_nm3?.pm ?? plantTotals?.plant_pooled_average_concentration_mg_nm3?.pm10)} mg/Nm³
                                    </p>
                                    <p className="text-[10px] text-emerald-700 font-mono">
                                        Rate: {formatNum(plantTotals?.plant_combined_hourly_rate_kg_hr?.pm ?? plantTotals?.plant_combined_hourly_rate_kg_hr?.pm10)} kg/hr
                                    </p>
                                    {(plantExceedancesCount?.pm || plantExceedancesCount?.pm10) ? (
                                        <span className="text-[10px] text-error font-bold block mt-1">
                                            ⚠️ {(plantExceedancesCount.pm || 0) + (plantExceedancesCount.pm10 || 0)} Exceedance(s)
                                        </span>
                                    ) : null}
                                </div>
                            </CardBody>
                        </Card>

                        {/* 4. Total CO */}
                        <Card interactive className="border-l-4 border-l-purple-500 shadow-xs">
                            <CardBody className="p-4 flex flex-col justify-between h-full">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Carbon Monoxide (CO)
                                    </span>
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                                        <MaterialIcon name="speed" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1 font-mono">
                                        <span className="text-headline-sm font-bold text-purple-700">
                                            {formatNum(plantTotals?.plant_total_annual_emissions_tonnes_year?.co)}
                                        </span>
                                        <span className="text-[11px] font-sans text-on-surface-variant">t/yr</span>
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                        Avg Conc: {formatNum(plantTotals?.plant_pooled_average_concentration_mg_nm3?.co)} mg/Nm³
                                    </p>
                                    <p className="text-[10px] text-purple-700 font-mono">
                                        Rate: {formatNum(plantTotals?.plant_combined_hourly_rate_kg_hr?.co)} kg/hr
                                    </p>
                                    {plantExceedancesCount?.co ? (
                                        <span className="text-[10px] text-error font-bold block mt-1">
                                            ⚠️ {plantExceedancesCount.co} Exceedance(s)
                                        </span>
                                    ) : null}
                                </div>
                            </CardBody>
                        </Card>

                        {/* 5. Total Stacks & Operating Hours */}
                        <Card interactive className="border-l-4 border-l-slate-600 shadow-xs">
                            <CardBody className="p-4 flex flex-col justify-between h-full">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Stacks &amp; Hours
                                    </span>
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-500/10 text-slate-700">
                                        <MaterialIcon name="precision_manufacturing" size="sm" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1 font-mono">
                                        <span className="text-headline-sm font-bold text-slate-800">
                                            {plantTotals?.total_stacks_monitored || calculatedStacks.length}
                                        </span>
                                        <span className="text-[11px] font-sans text-on-surface-variant">stacks</span>
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                                        Operating Hours: {formatNum(plantTotals?.total_operating_hours, 0)} hrs/yr
                                    </p>
                                    <p className="text-[10px] text-emerald-700 font-mono">
                                        Status: {hasAnyExceedance ? "Exceedance Alert" : "Normal Operation"}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Stack-by-Stack Air Emissions Breakdown Table */}
                    <Card>
                        <CardHeader tone="flat" className="flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <MaterialIcon name="precision_manufacturing" size="sm" className="text-primary" />
                                <div>
                                    <h3 className="text-headline-sm font-semibold text-primary">
                                        Stack-by-Stack Air Emissions Breakdown ({calculatedStacks.length})
                                    </h3>
                                    <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                                        Hourly mass emission rates (kg/hr) &amp; annual totals (t/yr) computed per industrial emission stack
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
                                            <TableHead className="text-right text-emerald-700">PM (t/yr)</TableHead>
                                            <TableHead className="text-right text-purple-700">CO (t/yr)</TableHead>
                                            <TableHead className="text-center">Avg Flow (Nm³/h)</TableHead>
                                            <TableHead className="text-center">Hourly Rates (kg/hr)</TableHead>
                                            <TableHead className="text-center">Compliance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {calculatedStacks.map((res, idx) => {
                                            const exceedances = res.exceedances_count || {};
                                            const hasExceedance = Object.values(exceedances).some((v) => v > 0);
                                            const isExpanded = expandedStackLog === idx;

                                            return (
                                                <TableRow key={idx} className={hasExceedance ? "bg-error-container/5" : ""}>
                                                    <TableCell className="font-sans font-bold text-primary text-xs">
                                                        <div>{res.stack_title}</div>
                                                        <div className="font-mono text-[10px] text-on-surface-variant font-normal">
                                                            {res.operating_hours_per_year} hrs/yr
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
                                                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2 cursor-pointer">
                                                            <span>{res.readings_count || res.readings?.length || 0} reading(s)</span>
                                                            <MaterialIcon name={isExpanded ? "expand_less" : "expand_more"} size="sm" className="!text-[14px]" />
                                                        </button>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs text-blue-700">
                                                        {formatNum(res.annual_emissions_tonnes_year?.nox)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs text-amber-700">
                                                        {formatNum(res.annual_emissions_tonnes_year?.sox)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs text-emerald-700">
                                                        {formatNum(res.annual_emissions_tonnes_year?.pm ?? res.annual_emissions_tonnes_year?.pm10)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-xs text-purple-700">
                                                        {formatNum(res.annual_emissions_tonnes_year?.co)}
                                                    </TableCell>
                                                    <TableCell className="text-center font-mono text-xs">
                                                        {formatNum(res.average_flow_rate_nm3_hr, 0)}
                                                    </TableCell>
                                                    <TableCell className="text-center font-mono text-[10px] text-on-surface-variant">
                                                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-left">
                                                            <span>NOx: {formatNum(res.average_hourly_emission_kg_hr?.nox)}</span>
                                                            <span>SOx: {formatNum(res.average_hourly_emission_kg_hr?.sox)}</span>
                                                            <span>PM: {formatNum(res.average_hourly_emission_kg_hr?.pm ?? res.average_hourly_emission_kg_hr?.pm10)}</span>
                                                            <span>CO: {formatNum(res.average_hourly_emission_kg_hr?.co)}</span>
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

                    {/* Expanded Sampling Readings Audit Log */}
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
                                                <TableHead className="text-right text-xs">PM (mg/Nm³)</TableHead>
                                                <TableHead className="text-right text-xs">CO (mg/Nm³)</TableHead>
                                                <TableHead className="text-center text-xs">Calculated Rates (kg/hr)</TableHead>
                                                <TableHead className="text-center text-xs">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(calculatedStacks[expandedStackLog].calculated_readings || []).map((reading, rIdx) => {
                                                const exceedances = reading.exceedances || {};
                                                const isExceeded = Object.values(exceedances).some((v) => v === true);
                                                const rates = reading.hourly_emission_kg_hr || {};

                                                // Resolve input reading from active stacks state or calculated stack
                                                const inputReading =
                                                    stacks[expandedStackLog]?.readings?.[rIdx] ||
                                                    calculatedStacks[expandedStackLog]?.readings?.[rIdx];
                                                const flow = reading.gas_flow_rate_nm3_hr || Number(inputReading?.gas_flow_rate?.value) || 0;

                                                // Fallback: if concentration not directly in inputReading, derive from rate and flow: (rate_kg_hr * 1e6) / flow_nm3_hr
                                                const resolveConc = (inputVal: any, rateKgHr: number | undefined) => {
                                                    if (inputVal !== undefined && inputVal !== null && inputVal !== "") {
                                                        const n = Number(inputVal);
                                                        if (!isNaN(n)) return n;
                                                    }
                                                    if (rateKgHr !== undefined && rateKgHr !== null && flow > 0) {
                                                        return (Number(rateKgHr) * 1000000) / flow;
                                                    }
                                                    return null;
                                                };

                                                const noxVal = resolveConc(inputReading?.nox?.value, rates.nox);
                                                const soxVal = resolveConc(inputReading?.sox?.value, rates.sox);
                                                const pmVal = resolveConc(
                                                    inputReading?.pm?.value ?? inputReading?.pm10?.value ?? inputReading?.particulate_matter?.value,
                                                    rates.pm ?? rates.pm10
                                                );
                                                const coVal = resolveConc(inputReading?.co?.value, rates.co);

                                                return (
                                                    <TableRow key={rIdx} className={isExceeded ? "bg-error-container/10" : ""}>
                                                        <TableCell className="font-mono text-xs font-semibold">
                                                            {reading.sampling_date}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-xs">
                                                            {formatNum(reading.gas_flow_rate_nm3_hr, 0)}
                                                        </TableCell>
                                                        <TableCell className={`text-right font-mono text-xs ${exceedances.nox ? "text-error font-bold" : ""}`}>
                                                            {noxVal !== null ? formatNum(noxVal) : "—"}
                                                        </TableCell>
                                                        <TableCell className={`text-right font-mono text-xs ${exceedances.sox ? "text-error font-bold" : ""}`}>
                                                            {soxVal !== null ? formatNum(soxVal) : "—"}
                                                        </TableCell>
                                                        <TableCell className={`text-right font-mono text-xs ${exceedances.pm || exceedances.pm10 ? "text-error font-bold" : ""}`}>
                                                            {pmVal !== null ? formatNum(pmVal) : "—"}
                                                        </TableCell>
                                                        <TableCell className={`text-right font-mono text-xs ${exceedances.co ? "text-error font-bold" : ""}`}>
                                                            {coVal !== null ? formatNum(coVal) : "—"}
                                                        </TableCell>
                                                        <TableCell className="text-center font-mono text-[10px] text-on-surface-variant">
                                                            <div className="flex flex-wrap justify-center gap-1.5">
                                                                {rates.nox !== undefined && <span>NOx: {formatNum(rates.nox)}</span>}
                                                                {rates.sox !== undefined && <span>SOx: {formatNum(rates.sox)}</span>}
                                                                {(rates.pm !== undefined || rates.pm10 !== undefined) && (
                                                                    <span>PM: {formatNum(rates.pm ?? rates.pm10)}</span>
                                                                )}
                                                                {rates.co !== undefined && <span>CO: {formatNum(rates.co)}</span>}
                                                                {Object.entries(rates)
                                                                    .filter(([k]) => !["nox", "sox", "pm", "pm10", "co"].includes(k.toLowerCase()))
                                                                    .map(([k, v]) => (
                                                                        <span key={k}>{k.toUpperCase()}: {formatNum(v)}</span>
                                                                    ))}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {isExceeded ? (
                                                                <span className="inline-flex items-center gap-1 rounded bg-error/15 px-2 py-0.5 text-[10px] font-bold text-error">
                                                                    <MaterialIcon name="error" size="sm" className="!text-[12px]" />
                                                                    Exceeded
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
                </div>
            )}

            {/* Excel Download Modal */}
            <BrsrAirReportModal
                isOpen={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                payload={buildPayload()}
                onDownload={handleDownloadExcel}
            />
        </div>
    );
}
