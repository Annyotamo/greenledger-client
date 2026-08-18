"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { SCOPE3_CATEGORIES, Scope3Category } from "@/lib/scope3/data";
import { Scope3Navbar } from "./Scope3Navbar";
import { cn } from "@/lib/utils/cn";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";

interface Scope3CategoryViewProps {
    slug: string;
}

export function Scope3CategoryView({ slug }: Scope3CategoryViewProps) {
    const category: Scope3Category =
        SCOPE3_CATEGORIES.find((c) => c.slug === slug) || SCOPE3_CATEGORIES[0];

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 pb-12">
            {/* Top Fixed Scope 3 Navbar */}
            <Scope3Navbar />

            {/* Breadcrumb & Navigation */}
            <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
                <Link href="/scope-3" className="hover:text-primary transition-colors">
                    Scope 3 Overview
                </Link>
                <span>/</span>
                <span className="text-secondary font-semibold">{category.code}: {category.name}</span>
            </div>

            {/* Category Banner Card */}
            <Card className="p-6 border-outline-variant/60 bg-surface-container-lowest">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-on-secondary font-mono text-xs font-bold">
                                {category.id}
                            </span>
                            <span className="rounded bg-surface-container-high px-2.5 py-1 font-mono text-xs font-bold text-secondary uppercase tracking-wider">
                                {category.code} • {category.type.toUpperCase()}
                            </span>
                            <span
                                className={cn(
                                    "rounded px-2.5 py-1 font-mono text-xs font-bold uppercase",
                                    category.status === "Verified" || category.status === "Audited"
                                        ? "bg-secondary-container text-on-secondary-container"
                                        : "bg-surface-container-high text-on-surface-variant",
                                )}>
                                {category.status}
                            </span>
                        </div>

                        <h1 className="text-headline-md font-bold text-primary tracking-tight">
                            {category.name}
                        </h1>

                        <p className="font-mono text-xs text-on-surface-variant max-w-3xl leading-relaxed">
                            {category.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="secondary" size="md" className="gap-2">
                            <MaterialIcon name="tune" size="sm" />
                            <span>Emission Factors</span>
                        </Button>
                        <Button variant="primary" size="md" className="gap-2">
                            <MaterialIcon name="add" size="sm" />
                            <span>Log Activity Record</span>
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5 border-outline-variant/60">
                    <span className="font-mono text-xs font-semibold uppercase text-on-surface-variant">Category Emissions</span>
                    <p className="font-mono text-headline-md font-bold text-primary mt-1">
                        {category.emissionsTco2e.toLocaleString()} <span className="text-xs font-normal">tCO2e</span>
                    </p>
                    <p className="font-mono text-[11px] text-on-surface-variant mt-1">
                        {category.sharePercent}% of total Scope 3
                    </p>
                </Card>

                <Card className="p-5 border-outline-variant/60">
                    <span className="font-mono text-xs font-semibold uppercase text-on-surface-variant">Mapped Activity Spend</span>
                    <p className="font-mono text-headline-md font-bold text-primary mt-1">
                        ${(category.spendUsd / 1000000).toFixed(2)}M
                    </p>
                    <p className="font-mono text-[11px] text-on-surface-variant mt-1">
                        USD Procurement / Activity
                    </p>
                </Card>

                <Card className="p-5 border-outline-variant/60">
                    <span className="font-mono text-xs font-semibold uppercase text-on-surface-variant">Calculation Methodology</span>
                    <p className="font-mono text-headline-sm font-bold text-secondary mt-1">
                        {category.methodology}
                    </p>
                    <p className="font-mono text-[11px] text-on-surface-variant mt-1">
                        GHG Protocol Compliant
                    </p>
                </Card>

                <Card className="p-5 border-outline-variant/60">
                    <span className="font-mono text-xs font-semibold uppercase text-on-surface-variant">Data Quality & Completeness</span>
                    <p className="font-mono text-headline-md font-bold text-primary mt-1">
                        {category.dataCoveragePercent}%
                    </p>
                    <p className="font-mono text-[11px] text-on-surface-variant mt-1">
                        Verified Data Coverage
                    </p>
                </Card>
            </div>

            {/* Dummy Detailed Activity Table */}
            <Card className="p-6 border-outline-variant/60">
                <CardHeader className="px-0 pt-0 pb-4 border-b border-outline-variant/40 flex flex-row items-center justify-between">
                    <h3 className="text-headline-sm font-bold text-primary flex items-center gap-2">
                        <MaterialIcon name="table_chart" className="text-secondary" />
                        Activity Logs for {category.name}
                    </h3>
                    <span className="font-mono text-xs text-on-surface-variant">Recent Records</span>
                </CardHeader>
                <CardBody className="px-0 pt-4 pb-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant/60 text-on-surface-variant uppercase text-[11px]">
                                    <th className="py-2.5 px-3">Date</th>
                                    <th className="py-2.5 px-3">Activity / Vendor Source</th>
                                    <th className="py-2.5 px-3">Quantity / Spend</th>
                                    <th className="py-2.5 px-3">Emission Factor</th>
                                    <th className="py-2.5 px-3 text-right">Calculated tCO2e</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/30">
                                <tr>
                                    <td className="py-3 px-3">2026-08-12</td>
                                    <td className="py-3 px-3 font-bold text-primary">Primary Logistics Hub A</td>
                                    <td className="py-3 px-3">$420,000 USD</td>
                                    <td className="py-3 px-3">0.45 kgCO2e/$</td>
                                    <td className="py-3 px-3 text-right font-bold text-secondary">189.0 tCO2e</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-3">2026-08-04</td>
                                    <td className="py-3 px-3 font-bold text-primary">Consolidated Freight Operations</td>
                                    <td className="py-3 px-3">$850,000 USD</td>
                                    <td className="py-3 px-3">0.62 kgCO2e/$</td>
                                    <td className="py-3 px-3 text-right font-bold text-secondary">527.0 tCO2e</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-3">2026-07-28</td>
                                    <td className="py-3 px-3 font-bold text-primary">Tier-1 Material Processing</td>
                                    <td className="py-3 px-3">1,400 Metric Tons</td>
                                    <td className="py-3 px-3">1.25 tCO2e/Ton</td>
                                    <td className="py-3 px-3 text-right font-bold text-secondary">1,750.0 tCO2e</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            <AiAssistantFAB />
        </div>
    );
}
