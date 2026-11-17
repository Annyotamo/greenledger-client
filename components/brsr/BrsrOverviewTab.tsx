"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import type { BRSRConsolidatedDashboardData } from "@/lib/brsr/types";
import type { BrsrSectionKey } from "./BrsrFilingRail";

interface BrsrOverviewTabProps {
    dashboardData: BRSRConsolidatedDashboardData | null;
    isLoading: boolean;
    onNavigateSection: (section: BrsrSectionKey) => void;
    onExportPdf: () => void;
}

export function BrsrOverviewTab({
    dashboardData,
    isLoading,
    onNavigateSection,
    onExportPdf,
}: BrsrOverviewTabProps) {
    const {
        section_a_completed = false,
        section_b_completed = false,
        section_c_completed = false,
        principle_6_totals = {
            energy_consumption_gj: 0,
            water_consumption_kl: 0,
            waste_generated_tonne: 0,
            scope1_tco2e: 0,
            scope2_tco2e: 0,
        },
    } = dashboardData || {};

    const completedCount = [
        section_a_completed,
        section_b_completed,
        section_c_completed,
    ].filter(Boolean).length;
    const readinessScore = Math.round((completedCount / 3) * 100);

    const formatNumber = (num: number | undefined | null, decimals = 1) => {
        if (num === null || num === undefined || isNaN(num)) return "0.0";
        return num.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    };

    return (
        <div className="space-y-6">
            {/* Top Statutory Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white shadow-md">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                                <MaterialIcon name="verified" size="xs" />
                                Official SEBI Circular Compliance
                            </span>
                            <span className="font-mono text-xs text-slate-300">
                                BRSR Annexure II • 41 Statutory Pages
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight font-display sm:text-3xl text-white">
                            Statutory Filing Engine &amp; Executive Overview
                        </h2>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            GreenLedger compiles, cross-verifies, and formats all non-financial and sustainability metrics conforming to SEBI BRSR guidelines. Fuel and electricity logs automatically power Principle 6 emissions and energy intensity formulas.
                        </p>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
                        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/15 text-center min-w-[160px]">
                            <p className="font-sans text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">
                                Filing Readiness Score
                            </p>
                            <p className="font-display text-4xl font-extrabold text-white tabular-nums my-1">
                                {isLoading ? "..." : `${readinessScore}%`}
                            </p>
                            <p className="font-mono text-[10px] text-slate-300">
                                {completedCount} of 3 Statutory Blocks Validated
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onExportPdf}
                            className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-semibold text-xs border-0 shadow-sm gap-2 w-full justify-center">
                            <MaterialIcon name="picture_as_pdf" size="sm" />
                            <span>Download 41-Page Packet</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Principle 6 Environmental Totals KPI Grid */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Principle 6 Environmental Performance Snapshot
                    </h3>
                    <span className="font-mono text-[11px] text-on-surface-variant/80">
                        Auto-aggregated from tenant activities &amp; statutory modules
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {/* Energy */}
                    <Card interactive className="p-4 bg-white shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-semibold text-on-surface-variant">Total Energy</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                                <MaterialIcon name="bolt" size="sm" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="font-display text-2xl font-bold text-primary tabular-nums">
                                {isLoading ? "..." : formatNumber(principle_6_totals.energy_consumption_gj)}
                            </p>
                            <p className="font-mono text-[11px] text-on-surface-variant">Gigajoules (GJ)</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigateSection("env-energy")}
                            className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            <span>View Breakdown</span>
                            <MaterialIcon name="arrow_forward" size="xs" />
                        </button>
                    </Card>

                    {/* Water */}
                    <Card interactive className="p-4 bg-white shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-semibold text-on-surface-variant">Water Consumed</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                                <MaterialIcon name="water_drop" size="sm" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="font-display text-2xl font-bold text-primary tabular-nums">
                                {isLoading ? "..." : formatNumber(principle_6_totals.water_consumption_kl)}
                            </p>
                            <p className="font-mono text-[11px] text-on-surface-variant">Kilolitres (kL)</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigateSection("env-water")}
                            className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            <span>View Disclosures</span>
                            <MaterialIcon name="arrow_forward" size="xs" />
                        </button>
                    </Card>

                    {/* Waste */}
                    <Card interactive className="p-4 bg-white shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-semibold text-on-surface-variant">Waste Generated</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                                <MaterialIcon name="delete_outline" size="sm" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="font-display text-2xl font-bold text-primary tabular-nums">
                                {isLoading ? "..." : formatNumber(principle_6_totals.waste_generated_tonne)}
                            </p>
                            <p className="font-mono text-[11px] text-on-surface-variant">Metric Tonnes</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigateSection("env-waste")}
                            className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            <span>View 9-Cat Matrix</span>
                            <MaterialIcon name="arrow_forward" size="xs" />
                        </button>
                    </Card>

                    {/* Scope 1 */}
                    <Card interactive className="p-4 bg-white shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-semibold text-on-surface-variant">Scope 1 (Direct)</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                <MaterialIcon name="factory" size="sm" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="font-display text-2xl font-bold text-primary tabular-nums">
                                {isLoading ? "..." : formatNumber(principle_6_totals.scope1_tco2e)}
                            </p>
                            <p className="font-mono text-[11px] text-on-surface-variant">tCO₂e</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigateSection("env-ghg")}
                            className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            <span>Scope 1 Details</span>
                            <MaterialIcon name="arrow_forward" size="xs" />
                        </button>
                    </Card>

                    {/* Scope 2 */}
                    <Card interactive className="p-4 bg-white shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-semibold text-on-surface-variant">Scope 2 (Electricity)</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                                <MaterialIcon name="electric_bolt" size="sm" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="font-display text-2xl font-bold text-primary tabular-nums">
                                {isLoading ? "..." : formatNumber(principle_6_totals.scope2_tco2e)}
                            </p>
                            <p className="font-mono text-[11px] text-on-surface-variant">tCO₂e (Grid)</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigateSection("env-ghg")}
                            className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            <span>Scope 2 Details</span>
                            <MaterialIcon name="arrow_forward" size="xs" />
                        </button>
                    </Card>
                </div>
            </div>

            {/* 4 Statutory Sections Status Cards */}
            <div>
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                    Statutory Framework Completion Pillars
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Section A Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5 bg-surface-container-lowest">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <MaterialIcon name="apartment" size="sm" />
                                </div>
                                <div>
                                    <h4 className="font-sans text-sm font-bold text-primary">
                                        Section A: General Disclosures
                                    </h4>
                                    <p className="font-mono text-[10px] text-on-surface-variant">Pages 1 to 14 • Mandatory SEBI Structure</p>
                                </div>
                            </div>
                            <Badge variant={section_a_completed ? "active" : "neutral"} size="sm">
                                {section_a_completed ? "Completed" : "In Progress"}
                            </Badge>
                        </CardHeader>
                        <CardBody className="p-5 space-y-4">
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Covers basic corporate information, operations footprint (plants &amp; offices), product turnover, workforce demographics (gender representation, differently abled), CSR applicability, and stakeholder grievance redressal.
                            </p>
                            <div className="grid grid-cols-3 gap-2 border-t border-outline-variant/60 pt-3">
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Entity &amp; Ops</span>
                                    <p className="text-xs font-bold text-primary">Disclosed</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Workforce</span>
                                    <p className="text-xs font-bold text-primary">Aggregated</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">CSR &amp; Grievance</span>
                                    <p className="text-xs font-bold text-primary">Recorded</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onNavigateSection("section-a-entity")}
                                className="w-full justify-between text-xs font-medium">
                                <span>Edit Section A Disclosures</span>
                                <MaterialIcon name="arrow_forward" size="sm" />
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Section B Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5 bg-surface-container-lowest">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                                    <MaterialIcon name="rule" size="sm" />
                                </div>
                                <div>
                                    <h4 className="font-sans text-sm font-bold text-primary">
                                        Section B: Management &amp; Process
                                    </h4>
                                    <p className="font-mono text-[10px] text-on-surface-variant">Pages 15 to 18 • Governance &amp; Oversight</p>
                                </div>
                            </div>
                            <Badge variant={section_b_completed ? "active" : "neutral"} size="sm">
                                {section_b_completed ? "Completed" : "In Progress"}
                            </Badge>
                        </CardHeader>
                        <CardBody className="p-5 space-y-4">
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Formulates the mandatory 9-principle NGRBC policy matrix (P1 through P9), Director statement, Board oversight cadences, ESG commitments &amp; goals, ISO certifications, and independent evaluation assurance.
                            </p>
                            <div className="grid grid-cols-3 gap-2 border-t border-outline-variant/60 pt-3">
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Policy Matrix</span>
                                    <p className="text-xs font-bold text-primary">9 Principles</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Board Oversight</span>
                                    <p className="text-xs font-bold text-primary">Documented</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Assurance</span>
                                    <p className="text-xs font-bold text-primary">ISO / Standards</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onNavigateSection("section-b-policy")}
                                className="w-full justify-between text-xs font-medium">
                                <span>Edit Section B Policies</span>
                                <MaterialIcon name="arrow_forward" size="sm" />
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Section C Environmental Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5 bg-surface-container-lowest">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                                    <MaterialIcon name="eco" size="sm" />
                                </div>
                                <div>
                                    <h4 className="font-sans text-sm font-bold text-primary">
                                        Section C: Environmental (Principle 6)
                                    </h4>
                                    <p className="font-mono text-[10px] text-on-surface-variant">Pages 19 to 30 • Essential Indicators 1 to 13</p>
                                </div>
                            </div>
                            <Badge variant={section_c_completed ? "active" : "neutral"} size="sm">
                                {section_c_completed ? "Completed" : "In Progress"}
                            </Badge>
                        </CardHeader>
                        <CardBody className="p-5 space-y-4">
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Mandatory disclosures on energy consumption &amp; intensity, water withdrawal/consumption/discharge, zero liquid discharge (ZLD), stack air emissions (NOx, SOx, PM, CO), 9-category waste matrix, and sensitive ecology/EIA.
                            </p>
                            <div className="grid grid-cols-3 gap-2 border-t border-outline-variant/60 pt-3">
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Energy &amp; GHG</span>
                                    <p className="text-xs font-bold text-primary">Scope 1/2 Logged</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Water &amp; Waste</span>
                                    <p className="text-xs font-bold text-primary">ZLD &amp; 9-Cats</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Air &amp; Ecology</span>
                                    <p className="text-xs font-bold text-primary">Stacks / EIA</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onNavigateSection("env-energy")}
                                className="w-full justify-between text-xs font-medium">
                                <span>Configure Environmental Disclosures</span>
                                <MaterialIcon name="arrow_forward" size="sm" />
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Section C Social & Governance Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5 bg-surface-container-lowest">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-800">
                                    <MaterialIcon name="balance" size="sm" />
                                </div>
                                <div>
                                    <h4 className="font-sans text-sm font-bold text-primary">
                                        Section C: Social &amp; Governance
                                    </h4>
                                    <p className="font-mono text-[10px] text-on-surface-variant">Pages 31 to 41 • Principles 1 to 5, 7, 8, 9</p>
                                </div>
                            </div>
                            <Badge variant={section_c_completed ? "active" : "neutral"} size="sm">
                                {section_c_completed ? "Completed" : "In Progress"}
                            </Badge>
                        </CardHeader>
                        <CardBody className="p-5 space-y-4">
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Covers anti-bribery &amp; corruption (P1), LCA &amp; EPR plans (P2), employee health &amp; safety LTIFR (P3), stakeholder engagement (P4), human rights (P5), public policy (P7), inclusive growth &amp; MSME (P8), and cybersecurity (P9).
                            </p>
                            <div className="grid grid-cols-3 gap-2 border-t border-outline-variant/60 pt-3">
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Workforce &amp; HR</span>
                                    <p className="text-xs font-bold text-primary">P3 &amp; P5 Audited</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">Ethics &amp; LCA</span>
                                    <p className="text-xs font-bold text-primary">P1 &amp; P2 Verified</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">MSME &amp; Cyber</span>
                                    <p className="text-xs font-bold text-primary">P8 &amp; P9 Secured</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onNavigateSection("sg-p1")}
                                className="w-full justify-between text-xs font-medium">
                                <span>Configure Social &amp; Governance</span>
                                <MaterialIcon name="arrow_forward" size="sm" />
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

