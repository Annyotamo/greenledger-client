"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type {
    BRSRStatutoryDisclosureData,
    BRSRWaterDisclosureData,
    BRSRWaterDisclosureSaveInput,
    BRSRWasteDisclosureData,
    BRSRWasteDisclosureSaveInput,
    BRSRAirDisclosureData,
    BRSRAirDisclosureSaveInput,
    BrsrAirStackInput,
    BrsrEnergyConsumptionData,
} from "@/lib/brsr/types";
import {
    useBrsrEnergyConsumption,
    useBrsrWaterDisclosure,
    useSaveBrsrWaterDisclosure,
    useBrsrWasteDisclosure,
    useSaveBrsrWasteDisclosure,
    useBrsrAirDisclosure,
    useSaveBrsrAirDisclosure,
    useBrsrStatutoryDisclosure,
    useSaveBrsrStatutoryDisclosure,
} from "@/lib/brsr/hooks";
import { getBrsrEnergyReport } from "@/lib/brsr/api";
import type { ReportingPeriod } from "@/lib/reportingPeriods/types";

export type EnvSubSection = "energy" | "water" | "air" | "ghg" | "waste" | "ecology";

interface BrsrSectionCEnvTabProps {
    reportingPeriod: ReportingPeriod | null;
    initialSubSection?: EnvSubSection;
    onSaved?: () => void;
}

export function BrsrSectionCEnvTab({
    reportingPeriod,
    initialSubSection = "energy",
    onSaved,
}: BrsrSectionCEnvTabProps) {
    const [subSection, setSubSection] = useState<EnvSubSection>(initialSubSection);

    useEffect(() => {
        if (initialSubSection) {
            setSubSection(initialSubSection);
        }
    }, [initialSubSection]);

    const reportingPeriodId = reportingPeriod?.id || "";
    const fyLabel = reportingPeriod?.name || "FY 2024-25";
    const startDate = reportingPeriod?.periodStart || "2024-04-01";
    const endDate = reportingPeriod?.periodEnd || "2025-03-31";

    // ----------------------------------------------------
    // 1. ENERGY CONSUMPTION STATE & HOOKS
    // ----------------------------------------------------
    const [energyFilters, setEnergyFilters] = useState({
        start_date: startDate,
        end_date: endDate,
        turnover_inr: 1250000000.0,
        ppp_conversion_factor: 22.5,
        physical_output: 50000.0,
        physical_output_unit: "Metric Tonnes",
    });

    const energyQuery = useBrsrEnergyConsumption(energyFilters);
    const [isExportingExcel, setIsExportingExcel] = useState(false);

    const handleExportEnergyExcel = async () => {
        setIsExportingExcel(true);
        try {
            const blob = await getBrsrEnergyReport({
                ...energyFilters,
                start_date: energyFilters.start_date || startDate,
                end_date: energyFilters.end_date || endDate,
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `SEBI_BRSR_P6_Energy_${fyLabel.replace(/\s+/g, "_")}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export energy excel", err);
        } finally {
            setIsExportingExcel(false);
        }
    };

    // ----------------------------------------------------
    // 2. WATER DISCLOSURE STATE & HOOKS
    // ----------------------------------------------------
    const waterQuery = useBrsrWaterDisclosure(reportingPeriodId);
    const saveWaterMutation = useSaveBrsrWaterDisclosure();

    const [waterForm, setWaterForm] = useState<BRSRWaterDisclosureSaveInput>({
        reporting_period_id: reportingPeriodId,
        financial_year_label: fyLabel,
        turnover_inr: 1250000000.0,
        ppp_conversion_factor: 22.5,
        physical_output: 50000.0,
        physical_output_unit: "Metric Tonnes",
        withdrawal: {
            surface_water_kl: 15000.0,
            groundwater_kl: 25000.0,
            third_party_water_kl: 5000.0,
            seawater_desalinated_kl: 0.0,
            others_kl: 0.0,
        },
        discharge: {
            surface_water: { no_treatment_kl: 0.0, treatment_level: "Tertiary", with_treatment_kl: 8000.0 },
            groundwater: { no_treatment_kl: 0.0, treatment_level: "None", with_treatment_kl: 0.0 },
            seawater: { no_treatment_kl: 0.0, treatment_level: "None", with_treatment_kl: 0.0 },
            third_party: { no_treatment_kl: 0.0, treatment_level: "CETP", with_treatment_kl: 4000.0 },
            others: { no_treatment_kl: 0.0, treatment_level: "None", with_treatment_kl: 0.0 },
        },
        total_water_consumption_kl: 33000.0,
        status: "draft",
    });

    useEffect(() => {
        if (waterQuery.data) {
            const d = waterQuery.data;
            setWaterForm({
                reporting_period_id: reportingPeriodId,
                financial_year_label: d.financial_year_label || fyLabel,
                turnover_inr: Number(d.turnover_inr) || 1250000000.0,
                ppp_conversion_factor: d.ppp_conversion_factor || 22.5,
                physical_output: d.physical_output || 50000.0,
                physical_output_unit: d.physical_output_unit || "Metric Tonnes",
                withdrawal: d.inputs?.withdrawal || d.withdrawal || waterForm.withdrawal,
                discharge: d.inputs?.discharge || d.discharge || waterForm.discharge,
                total_water_consumption_kl:
                    d.inputs?.total_water_consumption_kl ||
                    Number(d.computed_totals?.total_water_consumption_kl) ||
                    33000.0,
                status: d.status || "draft",
            });
        }
    }, [waterQuery.data, reportingPeriodId, fyLabel]);

    // ----------------------------------------------------
    // 3. AIR STACK EMISSIONS STATE & HOOKS
    // ----------------------------------------------------
    const airQuery = useBrsrAirDisclosure(reportingPeriodId);
    const saveAirMutation = useSaveBrsrAirDisclosure();

    const [airForm, setAirForm] = useState<BRSRAirDisclosureSaveInput>({
        reporting_period_id: reportingPeriodId,
        financial_year_label: fyLabel,
        stacks: [
            {
                stack_title: "Boiler Stack #1",
                attached_unit: "Main Boiler Unit",
                operating_hours_per_year: 7200.0,
                readings: [
                    {
                        sampling_date: "2024-09-15",
                        gas_flow_rate: { unit: "Nm3/hr", value: 25000.0 },
                        nox: { unit: "mg/Nm3", value: 180.0 },
                        sox: { unit: "mg/Nm3", value: 110.0 },
                        pm: { unit: "mg/Nm3", value: 45.0 },
                        co: { unit: "mg/Nm3", value: 25.0 },
                    },
                ],
                permitted_limits: {
                    permitted_limit_nox: { unit: "mg/Nm3", value: 300.0 },
                    permitted_limit_sox: { unit: "mg/Nm3", value: 200.0 },
                    permitted_limit_pm: { unit: "mg/Nm3", value: 50.0 },
                    permitted_limit_co: { unit: "mg/Nm3", value: 100.0 },
                    permitted_flow_rate: { unit: "Nm3/hr", value: 30000.0 },
                },
            },
        ],
        status: "draft",
    });

    useEffect(() => {
        if (airQuery.data) {
            const d = airQuery.data;
            if (d.stacks && d.stacks.length > 0) {
                setAirForm({
                    reporting_period_id: reportingPeriodId,
                    financial_year_label: d.financial_year_label || fyLabel,
                    stacks: d.stacks as BrsrAirStackInput[],
                    status: d.status || "draft",
                });
            }
        }
    }, [airQuery.data, reportingPeriodId, fyLabel]);

    // ----------------------------------------------------
    // 4. WASTE DISCLOSURE STATE & HOOKS
    // ----------------------------------------------------
    const wasteQuery = useBrsrWasteDisclosure(reportingPeriodId);
    const saveWasteMutation = useSaveBrsrWasteDisclosure();

    const [wasteForm, setWasteForm] = useState<BRSRWasteDisclosureSaveInput>({
        reporting_period_id: reportingPeriodId,
        financial_year_label: fyLabel,
        turnover_inr: 1250000000.0,
        ppp_conversion_factor: 22.5,
        physical_output_tonnes: 50000.0,
        physical_output_unit: "Metric Tonnes",
        generation: {
            plastic_waste_tonne: 12.0,
            ewaste_tonne: 3.0,
            bio_medical_waste_tonne: 0.0,
            construction_and_demolition_waste_tonne: 5.0,
            battery_waste_tonne: 1.5,
            radioactive_waste_tonne: 0.0,
            other_hazardous_waste_tonne: 25.0,
            fly_ash_tonne: 0.0,
            other_non_hazardous_waste_tonne: 178.5,
        },
        recovery: {
            hazardous_waste: { recycled_tonne: 25.0, reused_tonne: 5.0, other_recovery_tonne: 0.0 },
            non_hazardous_waste: { recycled_tonne: 120.0, reused_tonne: 30.0, other_recovery_tonne: 0.0 },
        },
        disposal: {
            hazardous_waste: { incineration_tonne: 10.0, landfilling_tonne: 5.0, other_disposal_tonne: 0.0 },
            non_hazardous_waste: { incineration_tonne: 0.0, landfilling_tonne: 30.0, other_disposal_tonne: 0.0 },
        },
        status: "draft",
    });

    useEffect(() => {
        if (wasteQuery.data) {
            const d = wasteQuery.data;
            setWasteForm((prev) => ({
                ...prev,
                reporting_period_id: reportingPeriodId,
                financial_year_label: d.financial_year_label || fyLabel,
                turnover_inr: Number(d.turnover_inr) || prev.turnover_inr,
                physical_output_tonnes: Number(d.physical_output_tonnes) || prev.physical_output_tonnes,
                generation: d.inputs?.generation || prev.generation,
                recovery: d.inputs?.recovery || prev.recovery,
                disposal: d.inputs?.disposal || prev.disposal,
                status: d.status || "draft",
            }));
        }
    }, [wasteQuery.data, reportingPeriodId, fyLabel]);

    // ----------------------------------------------------
    // 5. STATUTORY DISCLOSURES (PAT, ZLD, Sensitive, EIA)
    // ----------------------------------------------------
    const statutoryQuery = useBrsrStatutoryDisclosure(reportingPeriodId);
    const saveStatutoryMutation = useSaveBrsrStatutoryDisclosure();

    const [statutoryForm, setStatutoryForm] = useState<BRSRStatutoryDisclosureData>({
        reporting_period_id: reportingPeriodId,
        financial_year_label: fyLabel,
        is_pat_designated_consumer: true,
        pat_targets_achieved: true,
        pat_remedial_action: "Achieved 105% of energy conservation targets under PAT Cycle II",
        has_zld_mechanism: true,
        zld_treatment_details: "RO + Multi Effect Evaporator (MEE) system recycling 98% of treated water",
        has_ghg_reduction_projects: true,
        ghg_reduction_details: [
            {
                project_name: "Rooftop Solar 500kW",
                project_type: "Renewable Electricity",
                implemented_year: "2024",
                reduction_tco2e: 520.0,
                investment_inr: 25000000.0,
                description: "Installed rooftop solar displacing grid electricity",
            },
        ],
        waste_management_practices: "Authorized coprocessing in cement kilns and certified recycling",
        has_operations_in_sensitive_areas: false,
        sensitive_areas_details: [],
        eia_projects: [],
        is_compliant_environmental_laws: true,
        non_compliance_details: [],
        has_water_stress_operations: false,
        water_stress_details: [],
        status: "draft",
    });

    useEffect(() => {
        if (statutoryQuery.data) {
            setStatutoryForm(statutoryQuery.data);
        }
    }, [statutoryQuery.data]);

    const [saveNotice, setSaveNotice] = useState<string | null>(null);

    const showNotice = (msg: string) => {
        setSaveNotice(msg);
        setTimeout(() => setSaveNotice(null), 3000);
        onSaved?.();
    };

    const handleSaveWater = async () => {
        try {
            await saveWaterMutation.mutateAsync({
                ...waterForm,
                reporting_period_id: reportingPeriodId,
                financial_year_label: fyLabel,
            });
            showNotice("Water disclosures saved successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveAir = async () => {
        try {
            await saveAirMutation.mutateAsync({
                ...airForm,
                reporting_period_id: reportingPeriodId,
                financial_year_label: fyLabel,
            });
            showNotice("Air stack disclosures saved successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveWaste = async () => {
        try {
            await saveWasteMutation.mutateAsync({
                ...wasteForm,
                reporting_period_id: reportingPeriodId,
                financial_year_label: fyLabel,
            });
            showNotice("Waste disclosures saved successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveStatutory = async () => {
        try {
            await saveStatutoryMutation.mutateAsync({
                ...statutoryForm,
                reporting_period_id: reportingPeriodId,
                financial_year_label: fyLabel,
            });
            showNotice("Statutory disclosures saved successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    const formatNum = (val: number | string | null | undefined, dec = 2) => {
        if (val === null || val === undefined) return "0.00";
        const n = Number(val);
        return isNaN(n) ? "0.00" : n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    };

    return (
        <div className="space-y-6">
            {/* Header Strip & Sub-navigation */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="active" size="sm">
                            SEBI Annexure II • Section C
                        </Badge>
                        <span className="font-mono text-xs text-on-surface-variant">Principle 6 Environmental Performance (pp. 19–30)</span>
                    </div>
                    <h2 className="text-xl font-bold text-primary font-display mt-1">
                        Environmental Stewardship &amp; Statutory Indicators
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    {saveNotice && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-fade-in">
                            <MaterialIcon name="check" size="xs" />
                            {saveNotice}
                        </span>
                    )}
                </div>
            </div>

            {/* Sub-section Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low p-1">
                <button
                    type="button"
                    onClick={() => setSubSection("energy")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "energy"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="bolt" size="xs" />
                    <span>⚡ Energy &amp; Intensity (E1 &amp; E2)</span>
                </button>
                <button
                    type="button"
                    onClick={() => setSubSection("water")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "water"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="water_drop" size="xs" />
                    <span>💧 Water &amp; ZLD (E3, E4, E5)</span>
                </button>
                <button
                    type="button"
                    onClick={() => setSubSection("air")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "air"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="air" size="xs" />
                    <span>💨 Air Emissions (E6)</span>
                </button>
                <button
                    type="button"
                    onClick={() => setSubSection("ghg")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "ghg"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="cloud_sync" size="xs" />
                    <span>🌍 GHG Scope 1 &amp; 2 (E7 &amp; E8)</span>
                </button>
                <button
                    type="button"
                    onClick={() => setSubSection("waste")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "waste"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="recycling" size="xs" />
                    <span>🗑️ Waste Matrix (E9 &amp; E10)</span>
                </button>
                <button
                    type="button"
                    onClick={() => setSubSection("ecology")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "ecology"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="forest" size="xs" />
                    <span>🌲 Ecology &amp; EIA (E11–E13)</span>
                </button>
            </div>

            {/* 1. ENERGY CONSUMPTION & INTENSITY */}
            {subSection === "energy" && (
                <div className="space-y-6">
                    {/* Energy Filter Bar */}
                    <Card className="bg-white p-4 shadow-2xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-on-surface">Annual Turnover (INR)</label>
                                <Input
                                    type="number"
                                    value={energyFilters.turnover_inr}
                                    onChange={(e) =>
                                        setEnergyFilters((p) => ({ ...p, turnover_inr: Number(e.target.value) || 0 }))
                                    }
                                    className="text-xs font-mono"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-on-surface">PPP Conversion Factor</label>
                                <Input
                                    type="number"
                                    value={energyFilters.ppp_conversion_factor}
                                    onChange={(e) =>
                                        setEnergyFilters((p) => ({ ...p, ppp_conversion_factor: Number(e.target.value) || 0 }))
                                    }
                                    className="text-xs font-mono"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-on-surface">Physical Output (Tonnes/Units)</label>
                                <Input
                                    type="number"
                                    value={energyFilters.physical_output}
                                    onChange={(e) =>
                                        setEnergyFilters((p) => ({ ...p, physical_output: Number(e.target.value) || 0 }))
                                    }
                                    className="text-xs font-mono"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleExportEnergyExcel}
                                    disabled={isExportingExcel}
                                    className="w-full gap-2 text-xs">
                                    <MaterialIcon name={isExportingExcel ? "sync" : "file_download"} size="sm" className={isExportingExcel ? "animate-spin" : ""} />
                                    <span>{isExportingExcel ? "Generating..." : "Download Excel"}</span>
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Energy Totals & Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Renewable Card */}
                        <Card className="bg-emerald-50/40 border-emerald-200 shadow-2xs p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-900 uppercase">Renewable Energy</span>
                                <MaterialIcon name="eco" size="sm" className="text-emerald-700" />
                            </div>
                            <div>
                                <p className="font-display text-3xl font-bold text-emerald-950 tabular-nums">
                                    {formatNum(energyQuery.data?.totals.total_renewable_energy_gj || energyQuery.data?.totals.renewable_total_gj || 0)}
                                </p>
                                <p className="font-mono text-xs text-emerald-800">Gigajoules (GJ)</p>
                            </div>
                            <div className="border-t border-emerald-200/80 pt-2 space-y-1 text-xs text-emerald-900">
                                <div className="flex justify-between">
                                    <span>Fuel from Renewable:</span>
                                    <span className="font-mono font-semibold">{formatNum(energyQuery.data?.totals.renewable_fuel_gj)} GJ</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Electricity (Green):</span>
                                    <span className="font-mono font-semibold">{formatNum(energyQuery.data?.totals.renewable_electricity_gj)} GJ</span>
                                </div>
                            </div>
                        </Card>

                        {/* Non-Renewable Card */}
                        <Card className="bg-slate-50 border-slate-200 shadow-2xs p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 uppercase">Non-Renewable Energy</span>
                                <MaterialIcon name="local_gas_station" size="sm" className="text-slate-600" />
                            </div>
                            <div>
                                <p className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                                    {formatNum(energyQuery.data?.totals.total_non_renewable_energy_gj || energyQuery.data?.totals.non_renewable_total_gj || 0)}
                                </p>
                                <p className="font-mono text-xs text-slate-600">Gigajoules (GJ)</p>
                            </div>
                            <div className="border-t border-slate-200 pt-2 space-y-1 text-xs text-slate-700">
                                <div className="flex justify-between">
                                    <span>Fuel (Fossil/Coal):</span>
                                    <span className="font-mono font-semibold">{formatNum(energyQuery.data?.totals.non_renewable_fuel_gj)} GJ</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Electricity (Grid):</span>
                                    <span className="font-mono font-semibold">{formatNum(energyQuery.data?.totals.non_renewable_electricity_gj)} GJ</span>
                                </div>
                            </div>
                        </Card>

                        {/* Grand Total & Intensity Card */}
                        <Card className="bg-primary/5 border-primary/20 shadow-2xs p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary uppercase">Total Consumption</span>
                                <MaterialIcon name="bolt" size="sm" className="text-primary" />
                            </div>
                            <div>
                                <p className="font-display text-3xl font-bold text-primary tabular-nums">
                                    {formatNum(energyQuery.data?.totals.total_energy_consumption_gj || energyQuery.data?.totals.grand_total_gj || 0)}
                                </p>
                                <p className="font-mono text-xs text-primary/80">Grand Total (GJ)</p>
                            </div>
                            <div className="border-t border-primary/20 pt-2 space-y-1 text-xs text-primary">
                                <div className="flex justify-between">
                                    <span>Per INR Crore:</span>
                                    <span className="font-mono font-bold">{formatNum(energyQuery.data?.totals.energy_intensity_per_inr_crore || 0)} GJ/Cr</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Per Physical Output:</span>
                                    <span className="font-mono font-bold">{formatNum(energyQuery.data?.totals.energy_intensity_physical || 0, 4)} GJ/T</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* 2. WATER DISCLOSURES & ZLD */}
            {subSection === "water" && (
                <div className="space-y-6">
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="water_drop" size="sm" className="text-sky-700" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    Water Withdrawal, Discharge &amp; Zero Liquid Discharge (ZLD)
                                </h3>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSaveWater}
                                disabled={saveWaterMutation.isPending}
                                className="text-xs gap-1.5 shadow-2xs">
                                <MaterialIcon name={saveWaterMutation.isPending ? "sync" : "save"} size="sm" className={saveWaterMutation.isPending ? "animate-spin" : ""} />
                                <span>{saveWaterMutation.isPending ? "Saving..." : "Save Water Disclosures"}</span>
                            </Button>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-6">
                            {/* Withdrawal Table */}
                            <div>
                                <h4 className="font-sans text-xs font-bold text-primary mb-2">1. Water Withdrawal by Source (in Kilolitres)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Surface Water (kL)</label>
                                        <Input
                                            type="number"
                                            value={waterForm.withdrawal.surface_water_kl}
                                            onChange={(e) =>
                                                setWaterForm((p) => ({
                                                    ...p,
                                                    withdrawal: { ...p.withdrawal, surface_water_kl: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Groundwater (kL)</label>
                                        <Input
                                            type="number"
                                            value={waterForm.withdrawal.groundwater_kl}
                                            onChange={(e) =>
                                                setWaterForm((p) => ({
                                                    ...p,
                                                    withdrawal: { ...p.withdrawal, groundwater_kl: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Third Party / Municipal (kL)</label>
                                        <Input
                                            type="number"
                                            value={waterForm.withdrawal.third_party_water_kl}
                                            onChange={(e) =>
                                                setWaterForm((p) => ({
                                                    ...p,
                                                    withdrawal: { ...p.withdrawal, third_party_water_kl: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Seawater / Desalinated (kL)</label>
                                        <Input
                                            type="number"
                                            value={waterForm.withdrawal.seawater_desalinated_kl}
                                            onChange={(e) =>
                                                setWaterForm((p) => ({
                                                    ...p,
                                                    withdrawal: { ...p.withdrawal, seawater_desalinated_kl: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Others (kL)</label>
                                        <Input
                                            type="number"
                                            value={waterForm.withdrawal.others_kl}
                                            onChange={(e) =>
                                                setWaterForm((p) => ({
                                                    ...p,
                                                    withdrawal: { ...p.withdrawal, others_kl: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Net Consumption & ZLD Mechanism */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-outline-variant/60 pt-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-on-surface">Total Water Consumption (kL)</label>
                                    <Input
                                        type="number"
                                        value={waterForm.total_water_consumption_kl ?? ""}
                                        onChange={(e) =>
                                            setWaterForm((p) => ({
                                                ...p,
                                                total_water_consumption_kl: e.target.value ? Number(e.target.value) : null,
                                            }))
                                        }
                                        placeholder="e.g. 33000"
                                        className="text-xs font-mono"
                                    />
                                    <p className="text-[11px] text-on-surface-variant">
                                        Computed Net Consumption = Total Withdrawal − Total Discharge
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-on-surface">
                                            Zero Liquid Discharge (ZLD) Mechanism:
                                        </label>
                                        <input
                                            type="checkbox"
                                            checked={statutoryForm.has_zld_mechanism}
                                            onChange={(e) =>
                                                setStatutoryForm((p) => ({ ...p, has_zld_mechanism: e.target.checked }))
                                            }
                                            className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                        />
                                    </div>
                                    <Input
                                        value={statutoryForm.zld_treatment_details || ""}
                                        onChange={(e) =>
                                            setStatutoryForm((p) => ({ ...p, zld_treatment_details: e.target.value }))
                                        }
                                        placeholder="Treatment details e.g. RO + Multi Effect Evaporator system"
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* 3. AIR STACK EMISSIONS */}
            {subSection === "air" && (
                <div className="space-y-6">
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="air" size="sm" className="text-teal-700" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    Stack Air Emissions Monitoring (Essential Indicator 6)
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                        setAirForm((p) => ({
                                            ...p,
                                            stacks: [
                                                ...p.stacks,
                                                {
                                                    stack_title: `Stack #${p.stacks.length + 1}`,
                                                    attached_unit: "Main Boiler Unit",
                                                    operating_hours_per_year: 7200,
                                                    readings: [
                                                        {
                                                            sampling_date: "2024-10-01",
                                                            gas_flow_rate: { unit: "Nm3/hr", value: 20000 },
                                                            nox: { unit: "mg/Nm3", value: 150 },
                                                            sox: { unit: "mg/Nm3", value: 90 },
                                                            pm: { unit: "mg/Nm3", value: 40 },
                                                            co: { unit: "mg/Nm3", value: 20 },
                                                        },
                                                    ],
                                                    permitted_limits: {
                                                        permitted_limit_nox: { unit: "mg/Nm3", value: 300 },
                                                        permitted_limit_sox: { unit: "mg/Nm3", value: 200 },
                                                        permitted_limit_pm: { unit: "mg/Nm3", value: 50 },
                                                        permitted_limit_co: { unit: "mg/Nm3", value: 100 },
                                                        permitted_flow_rate: { unit: "Nm3/hr", value: 30000 },
                                                    },
                                                },
                                            ],
                                        }))
                                    }
                                    className="text-xs gap-1">
                                    <MaterialIcon name="add" size="xs" />
                                    <span>Add Stack</span>
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleSaveAir}
                                    disabled={saveAirMutation.isPending}
                                    className="text-xs gap-1.5 shadow-2xs">
                                    <MaterialIcon name={saveAirMutation.isPending ? "sync" : "save"} size="sm" className={saveAirMutation.isPending ? "animate-spin" : ""} />
                                    <span>{saveAirMutation.isPending ? "Saving..." : "Save Air Stacks"}</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-4">
                            {airForm.stacks.map((stack, sIdx) => (
                                <div key={sIdx} className="rounded-xl border border-outline-variant p-4 space-y-4 bg-surface-container-lowest">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-outline-variant/60 pb-3">
                                        <div className="flex items-center gap-3">
                                            <MaterialIcon name="factory" size="sm" className="text-primary" />
                                            <div>
                                                <input
                                                    value={stack.stack_title}
                                                    onChange={(e) => {
                                                        const updated = [...airForm.stacks];
                                                        updated[sIdx].stack_title = e.target.value;
                                                        setAirForm((p) => ({ ...p, stacks: updated }));
                                                    }}
                                                    className="font-sans text-xs font-bold text-primary bg-transparent outline-none border-b border-transparent hover:border-outline-variant focus:border-primary"
                                                />
                                                <p className="font-mono text-[10px] text-on-surface-variant">
                                                    Attached Unit: {stack.attached_unit}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <span className="text-on-surface-variant font-medium">Operating Hrs/Yr:</span>
                                                <Input
                                                    type="number"
                                                    value={stack.operating_hours_per_year}
                                                    onChange={(e) => {
                                                        const updated = [...airForm.stacks];
                                                        updated[sIdx].operating_hours_per_year = Number(e.target.value) || 0;
                                                        setAirForm((p) => ({ ...p, stacks: updated }));
                                                    }}
                                                    className="w-24 text-xs font-mono h-8"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = airForm.stacks.filter((_, i) => i !== sIdx);
                                                    setAirForm((p) => ({ ...p, stacks: updated }));
                                                }}
                                                className="text-error hover:bg-error-container/20 p-1.5 rounded cursor-pointer">
                                                <MaterialIcon name="delete" size="xs" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Readings Summary Table */}
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-surface-container-low">
                                                    <TableHead className="text-xs font-bold text-primary">Sampling Date</TableHead>
                                                    <TableHead className="text-xs font-bold text-primary">Flow Rate (Nm3/hr)</TableHead>
                                                    <TableHead className="text-xs font-bold text-primary">NOx (mg/Nm3)</TableHead>
                                                    <TableHead className="text-xs font-bold text-primary">SOx (mg/Nm3)</TableHead>
                                                    <TableHead className="text-xs font-bold text-primary">PM (mg/Nm3)</TableHead>
                                                    <TableHead className="text-xs font-bold text-primary">CO (mg/Nm3)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {stack.readings.map((r, rIdx) => (
                                                    <TableRow key={rIdx}>
                                                        <TableCell className="font-mono text-xs">{r.sampling_date}</TableCell>
                                                        <TableCell className="font-mono text-xs font-semibold">{r.gas_flow_rate.value}</TableCell>
                                                        <TableCell className="font-mono text-xs">{r.nox?.value || 0}</TableCell>
                                                        <TableCell className="font-mono text-xs">{r.sox?.value || 0}</TableCell>
                                                        <TableCell className="font-mono text-xs">{r.pm?.value || 0}</TableCell>
                                                        <TableCell className="font-mono text-xs">{r.co?.value || 0}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* 4. GHG SCOPE 1 & 2 DISCLOSURES */}
            {subSection === "ghg" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Scope 1 Card */}
                        <Card className="bg-white shadow-2xs p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-900 uppercase">Scope 1 (Direct Emissions)</span>
                                <MaterialIcon name="factory" size="sm" className="text-emerald-700" />
                            </div>
                            <div>
                                <p className="font-display text-3xl font-bold text-primary tabular-nums">
                                    {formatNum(reportingPeriod?.scope1TotalTCo2e || 0)}
                                </p>
                                <p className="font-mono text-xs text-on-surface-variant">Metric Tonnes CO₂e</p>
                            </div>
                            <div className="border-t border-outline-variant/60 pt-2 space-y-1 text-xs text-on-surface-variant">
                                <div className="flex justify-between">
                                    <span>Stationary Combustion:</span>
                                    <span className="font-mono font-semibold">{formatNum(reportingPeriod?.scope1StationaryTCo2e || 0)} tCO₂e</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Mobile Combustion:</span>
                                    <span className="font-mono font-semibold">{formatNum(reportingPeriod?.scope1MobileTCo2e || 0)} tCO₂e</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Process Emissions:</span>
                                    <span className="font-mono font-semibold">{formatNum(reportingPeriod?.scope1ProcessTCo2e || 0)} tCO₂e</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Fugitive Emissions:</span>
                                    <span className="font-mono font-semibold">{formatNum(reportingPeriod?.scope1FugitiveTCo2e || 0)} tCO₂e</span>
                                </div>
                            </div>
                        </Card>

                        {/* Scope 2 Card */}
                        <Card className="bg-white shadow-2xs p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-teal-900 uppercase">Scope 2 (Indirect Emissions)</span>
                                <MaterialIcon name="electric_bolt" size="sm" className="text-teal-700" />
                            </div>
                            <div>
                                <p className="font-display text-3xl font-bold text-primary tabular-nums">
                                    {formatNum(reportingPeriod?.scope2LocationTCo2e || 0)}
                                </p>
                                <p className="font-mono text-xs text-on-surface-variant">Location-Based tCO₂e</p>
                            </div>
                            <div className="border-t border-outline-variant/60 pt-2 space-y-1 text-xs text-on-surface-variant">
                                <div className="flex justify-between">
                                    <span>Market-Based Total:</span>
                                    <span className="font-mono font-semibold">{formatNum(reportingPeriod?.scope2MarketTCo2e || 0)} tCO₂e</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Purchased Electricity (kWh):</span>
                                    <span className="font-mono font-semibold">{formatNum(reportingPeriod?.scope2TotalKwh || 0, 0)} kWh</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Self-Generated (Renewable):</span>
                                    <span className="font-mono font-semibold">{formatNum(reportingPeriod?.selfGeneratedKwh || 0, 0)} kWh</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* GHG Reduction Projects Table */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="energy_savings_leaf" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    Voluntary GHG Mitigation &amp; Carbon Reduction Projects
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                        setStatutoryForm((p) => ({
                                            ...p,
                                            ghg_reduction_details: [
                                                ...p.ghg_reduction_details,
                                                {
                                                    project_name: "",
                                                    project_type: "Renewable Energy",
                                                    implemented_year: "2024",
                                                    reduction_tco2e: 0,
                                                    investment_inr: 0,
                                                    description: "",
                                                },
                                            ],
                                        }))
                                    }
                                    className="text-xs gap-1">
                                    <MaterialIcon name="add" size="xs" />
                                    <span>Add Project</span>
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleSaveStatutory}
                                    disabled={saveStatutoryMutation.isPending}
                                    className="text-xs gap-1.5 shadow-2xs">
                                    <MaterialIcon name={saveStatutoryMutation.isPending ? "sync" : "save"} size="sm" className={saveStatutoryMutation.isPending ? "animate-spin" : ""} />
                                    <span>{saveStatutoryMutation.isPending ? "Saving..." : "Save GHG Projects"}</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="p-card-padding">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-surface-container-low">
                                            <TableHead className="text-xs font-bold text-primary">Project Name</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-32">Type</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-24">Year</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-32 text-right">Reduction (tCO₂e)</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-36 text-right">Capex (INR)</TableHead>
                                            <TableHead className="text-xs font-bold text-primary">Brief Description</TableHead>
                                            <TableHead className="w-12 text-center">Del</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {statutoryForm.ghg_reduction_details.map((proj, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Input
                                                        value={proj.project_name}
                                                        onChange={(e) => {
                                                            const updated = [...statutoryForm.ghg_reduction_details];
                                                            updated[idx].project_name = e.target.value;
                                                            setStatutoryForm((p) => ({ ...p, ghg_reduction_details: updated }));
                                                        }}
                                                        placeholder="Project Name"
                                                        className="text-xs font-semibold"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={proj.project_type}
                                                        onChange={(e) => {
                                                            const updated = [...statutoryForm.ghg_reduction_details];
                                                            updated[idx].project_type = e.target.value;
                                                            setStatutoryForm((p) => ({ ...p, ghg_reduction_details: updated }));
                                                        }}
                                                        className="text-xs"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={proj.implemented_year}
                                                        onChange={(e) => {
                                                            const updated = [...statutoryForm.ghg_reduction_details];
                                                            updated[idx].implemented_year = e.target.value;
                                                            setStatutoryForm((p) => ({ ...p, ghg_reduction_details: updated }));
                                                        }}
                                                        className="text-xs font-mono"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={proj.reduction_tco2e}
                                                        onChange={(e) => {
                                                            const updated = [...statutoryForm.ghg_reduction_details];
                                                            updated[idx].reduction_tco2e = Number(e.target.value) || 0;
                                                            setStatutoryForm((p) => ({ ...p, ghg_reduction_details: updated }));
                                                        }}
                                                        className="text-xs font-mono text-right"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={proj.investment_inr}
                                                        onChange={(e) => {
                                                            const updated = [...statutoryForm.ghg_reduction_details];
                                                            updated[idx].investment_inr = Number(e.target.value) || 0;
                                                            setStatutoryForm((p) => ({ ...p, ghg_reduction_details: updated }));
                                                        }}
                                                        className="text-xs font-mono text-right"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={proj.description}
                                                        onChange={(e) => {
                                                            const updated = [...statutoryForm.ghg_reduction_details];
                                                            updated[idx].description = e.target.value;
                                                            setStatutoryForm((p) => ({ ...p, ghg_reduction_details: updated }));
                                                        }}
                                                        placeholder="Description"
                                                        className="text-xs"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = statutoryForm.ghg_reduction_details.filter(
                                                                (_, i) => i !== idx,
                                                            );
                                                            setStatutoryForm((p) => ({ ...p, ghg_reduction_details: updated }));
                                                        }}
                                                        className="text-error hover:bg-error-container/20 p-1 rounded cursor-pointer">
                                                        <MaterialIcon name="delete" size="xs" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* 5. WASTE MANAGEMENT (9-CATEGORY MATRIX) */}
            {subSection === "waste" && (
                <div className="space-y-6">
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="recycling" size="sm" className="text-rose-700" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    9-Category Statutory Waste Matrix, Recovery &amp; Disposal
                                </h3>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSaveWaste}
                                disabled={saveWasteMutation.isPending}
                                className="text-xs gap-1.5 shadow-2xs">
                                <MaterialIcon name={saveWasteMutation.isPending ? "sync" : "save"} size="sm" className={saveWasteMutation.isPending ? "animate-spin" : ""} />
                                <span>{saveWasteMutation.isPending ? "Saving..." : "Save Waste Matrix"}</span>
                            </Button>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-6">
                            {/* Generation Breakdown */}
                            <div>
                                <h4 className="font-sans text-xs font-bold text-primary mb-3">
                                    1. Waste Generated by Statutory Category (in Metric Tonnes)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Plastic Waste (T)</label>
                                        <Input
                                            type="number"
                                            value={wasteForm.generation.plastic_waste_tonne}
                                            onChange={(e) =>
                                                setWasteForm((p) => ({
                                                    ...p,
                                                    generation: { ...p.generation, plastic_waste_tonne: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">E-Waste (T)</label>
                                        <Input
                                            type="number"
                                            value={wasteForm.generation.ewaste_tonne}
                                            onChange={(e) =>
                                                setWasteForm((p) => ({
                                                    ...p,
                                                    generation: { ...p.generation, ewaste_tonne: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Bio-medical Waste (T)</label>
                                        <Input
                                            type="number"
                                            value={wasteForm.generation.bio_medical_waste_tonne}
                                            onChange={(e) =>
                                                setWasteForm((p) => ({
                                                    ...p,
                                                    generation: { ...p.generation, bio_medical_waste_tonne: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">C&amp;D Waste (T)</label>
                                        <Input
                                            type="number"
                                            value={wasteForm.generation.construction_and_demolition_waste_tonne}
                                            onChange={(e) =>
                                                setWasteForm((p) => ({
                                                    ...p,
                                                    generation: {
                                                        ...p.generation,
                                                        construction_and_demolition_waste_tonne: Number(e.target.value) || 0,
                                                    },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Battery Waste (T)</label>
                                        <Input
                                            type="number"
                                            value={wasteForm.generation.battery_waste_tonne}
                                            onChange={(e) =>
                                                setWasteForm((p) => ({
                                                    ...p,
                                                    generation: { ...p.generation, battery_waste_tonne: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Other Hazardous (T)</label>
                                        <Input
                                            type="number"
                                            value={wasteForm.generation.other_hazardous_waste_tonne}
                                            onChange={(e) =>
                                                setWasteForm((p) => ({
                                                    ...p,
                                                    generation: {
                                                        ...p.generation,
                                                        other_hazardous_waste_tonne: Number(e.target.value) || 0,
                                                    },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-on-surface">Fly Ash (T)</label>
                                        <Input
                                            type="number"
                                            value={wasteForm.generation.fly_ash_tonne}
                                            onChange={(e) =>
                                                setWasteForm((p) => ({
                                                    ...p,
                                                    generation: { ...p.generation, fly_ash_tonne: Number(e.target.value) || 0 },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-on-surface">Other Non-Hazardous Waste (T)</label>
                                        <Input
                                            type="number"
                                            value={wasteForm.generation.other_non_hazardous_waste_tonne || 0}
                                            onChange={(e) =>
                                                setWasteForm((p) => ({
                                                    ...p,
                                                    generation: {
                                                        ...p.generation,
                                                        other_non_hazardous_waste_tonne: Number(e.target.value) || 0,
                                                    },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Recovery & Disposal Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-outline-variant/60 pt-4">
                                <Card className="p-4 bg-surface-container-lowest">
                                    <h5 className="font-sans text-xs font-bold text-primary mb-2">Recovery Pathways (Tonnes)</h5>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span>Hazardous Recycled:</span>
                                            <Input
                                                type="number"
                                                value={wasteForm.recovery?.hazardous_waste?.recycled_tonne || 0}
                                                onChange={(e) =>
                                                    setWasteForm((p) => ({
                                                        ...p,
                                                        recovery: {
                                                            ...p.recovery,
                                                            hazardous_waste: {
                                                                ...p.recovery?.hazardous_waste,
                                                                recycled_tonne: Number(e.target.value) || 0,
                                                            },
                                                        },
                                                    }))
                                                }
                                                className="w-28 text-xs font-mono h-8 text-right"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Non-Hazardous Recycled:</span>
                                            <Input
                                                type="number"
                                                value={wasteForm.recovery?.non_hazardous_waste?.recycled_tonne || 0}
                                                onChange={(e) =>
                                                    setWasteForm((p) => ({
                                                        ...p,
                                                        recovery: {
                                                            ...p.recovery,
                                                            non_hazardous_waste: {
                                                                ...p.recovery?.non_hazardous_waste,
                                                                recycled_tonne: Number(e.target.value) || 0,
                                                            },
                                                        },
                                                    }))
                                                }
                                                className="w-28 text-xs font-mono h-8 text-right"
                                            />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4 bg-surface-container-lowest">
                                    <h5 className="font-sans text-xs font-bold text-primary mb-2">Disposal Pathways (Tonnes)</h5>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span>Incineration (Hazardous):</span>
                                            <Input
                                                type="number"
                                                value={wasteForm.disposal?.hazardous_waste?.incineration_tonne || 0}
                                                onChange={(e) =>
                                                    setWasteForm((p) => ({
                                                        ...p,
                                                        disposal: {
                                                            ...p.disposal,
                                                            hazardous_waste: {
                                                                ...p.disposal?.hazardous_waste,
                                                                incineration_tonne: Number(e.target.value) || 0,
                                                            },
                                                        },
                                                    }))
                                                }
                                                className="w-28 text-xs font-mono h-8 text-right"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Landfilling (Non-Hazardous):</span>
                                            <Input
                                                type="number"
                                                value={wasteForm.disposal?.non_hazardous_waste?.landfilling_tonne || 0}
                                                onChange={(e) =>
                                                    setWasteForm((p) => ({
                                                        ...p,
                                                        disposal: {
                                                            ...p.disposal,
                                                            non_hazardous_waste: {
                                                                ...p.disposal?.non_hazardous_waste,
                                                                landfilling_tonne: Number(e.target.value) || 0,
                                                            },
                                                        },
                                                    }))
                                                }
                                                className="w-28 text-xs font-mono h-8 text-right"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* 6. SENSITIVE ECOLOGY, PAT & EIA PROJECTS */}
            {subSection === "ecology" && (
                <div className="space-y-6">
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="forest" size="sm" className="text-emerald-800" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    Sensitive Ecology, PAT Designated Consumer Scheme &amp; EIA Projects
                                </h3>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSaveStatutory}
                                disabled={saveStatutoryMutation.isPending}
                                className="text-xs gap-1.5 shadow-2xs">
                                <MaterialIcon name={saveStatutoryMutation.isPending ? "sync" : "save"} size="sm" className={saveStatutoryMutation.isPending ? "animate-spin" : ""} />
                                <span>{saveStatutoryMutation.isPending ? "Saving..." : "Save Ecology Disclosures"}</span>
                            </Button>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-5">
                            {/* PAT Designated Consumer Scheme */}
                            <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-primary">Perform, Achieve and Trade (PAT) Scheme</h4>
                                        <p className="text-[11px] text-on-surface-variant">Designated Consumer under Bureau of Energy Efficiency (BEE)</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={statutoryForm.is_pat_designated_consumer}
                                        onChange={(e) =>
                                            setStatutoryForm((p) => ({
                                                ...p,
                                                is_pat_designated_consumer: e.target.checked,
                                            }))
                                        }
                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                    />
                                </div>
                                {statutoryForm.is_pat_designated_consumer && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-on-surface">PAT Targets Achieved:</span>
                                            <input
                                                type="checkbox"
                                                checked={statutoryForm.pat_targets_achieved}
                                                onChange={(e) =>
                                                    setStatutoryForm((p) => ({
                                                        ...p,
                                                        pat_targets_achieved: e.target.checked,
                                                    }))
                                                }
                                                className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                            />
                                        </div>
                                        <Input
                                            value={statutoryForm.pat_remedial_action || ""}
                                            onChange={(e) =>
                                                setStatutoryForm((p) => ({
                                                    ...p,
                                                    pat_remedial_action: e.target.value,
                                                }))
                                            }
                                            placeholder="Remedial action / details"
                                            className="text-xs bg-white"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Sensitive Ecology Areas */}
                            <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-primary">Operations in Ecologically Sensitive Areas</h4>
                                        <p className="text-[11px] text-on-surface-variant">National parks, wildlife sanctuaries, eco-sensitive zones</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={statutoryForm.has_operations_in_sensitive_areas}
                                        onChange={(e) =>
                                            setStatutoryForm((p) => ({
                                                ...p,
                                                has_operations_in_sensitive_areas: e.target.checked,
                                            }))
                                        }
                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Environmental Legal Compliance */}
                            <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-primary">Compliance with Environmental Laws &amp; Directives</h4>
                                        <p className="text-[11px] text-on-surface-variant">CPCB / SPCB Water &amp; Air Acts, hazardous waste permissions</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={statutoryForm.is_compliant_environmental_laws}
                                        onChange={(e) =>
                                            setStatutoryForm((p) => ({
                                                ...p,
                                                is_compliant_environmental_laws: e.target.checked,
                                            }))
                                        }
                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
}

