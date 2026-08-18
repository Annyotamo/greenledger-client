"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import {
    SCOPE3_CATEGORIES,
    SCOPE3_SUMMARY,
    SCOPE3_TREND_DATA,
    VENDOR_HOTSPOTS,
    Scope3Category,
    Scope3ViewMode,
} from "@/lib/scope3/data";
import { Scope3Navbar } from "./Scope3Navbar";
import { cn } from "@/lib/utils/cn";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
};

export function Scope3DashboardView() {
    const [viewMode, setViewMode] = useState<Scope3ViewMode>("operational");
    const [filterScope, setFilterScope] = useState<"all" | "upstream" | "downstream">("all");
    const [activeGroupFilter, setActiveGroupFilter] = useState<string>("all");

    const filteredCategories = SCOPE3_CATEGORIES.filter((cat) => {
        if (filterScope !== "all" && cat.type !== filterScope) return false;
        if (activeGroupFilter !== "all" && cat.view1Group !== activeGroupFilter) return false;
        return true;
    });

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 pb-12">
            {/* Sticky Scope 3 Top Navbar */}
            <Scope3Navbar currentViewMode={viewMode} onViewModeChange={(mode) => setViewMode(mode)} />

            {/* Scope 3 Banner Header */}
            <Card className="overflow-hidden border-outline-variant/60 p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-on-secondary font-mono text-xs font-bold">
                                3
                            </span>
                            <span className="font-mono text-xs font-semibold text-secondary uppercase tracking-wider">
                                Value Chain GHG Accounting
                            </span>
                        </div>
                        <h1 className="text-headline-md font-bold text-primary tracking-tight">
                            Scope 3 Emissions Dashboard
                        </h1>
                        <p className="font-mono text-xs text-on-surface-variant max-w-2xl">
                            Comprehensive reporting across all 15 upstream and downstream categories under the GHG Protocol Value Chain Standard.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="secondary" size="md" className="gap-2">
                            <MaterialIcon name="download" size="sm" />
                            <span>Export Scope 3 Data</span>
                        </Button>
                        <Button variant="primary" size="md" className="gap-2">
                            <MaterialIcon name="post_add" size="sm" />
                            <span>Log Activity Data</span>
                        </Button>
                    </div>
                </div>

                {/* Progress Bar: Upstream vs Downstream */}
                <div className="mt-6 border-t border-outline-variant/40 pt-4">
                    <div className="flex items-center justify-between font-mono text-xs font-medium text-primary mb-1.5">
                        <span className="flex items-center gap-1.5 text-secondary font-bold">
                            <MaterialIcon name="arrow_circle_up" size="sm" />
                            Upstream (Supply Chain): {SCOPE3_SUMMARY.upstreamEmissionsTco2e.toLocaleString()} tCO2e ({SCOPE3_SUMMARY.upstreamSharePercent}%)
                        </span>
                        <span className="flex items-center gap-1.5 text-tertiary-container font-bold">
                            <MaterialIcon name="arrow_circle_down" size="sm" />
                            Downstream (Product & Market): {SCOPE3_SUMMARY.downstreamEmissionsTco2e.toLocaleString()} tCO2e ({SCOPE3_SUMMARY.downstreamSharePercent}%)
                        </span>
                    </div>

                    <div className="h-3 w-full rounded-full bg-surface-container-high overflow-hidden flex shadow-inner">
                        <div
                            style={{ width: `${SCOPE3_SUMMARY.upstreamSharePercent}%` }}
                            className="h-full bg-secondary transition-all duration-500"
                            title={`Upstream: ${SCOPE3_SUMMARY.upstreamSharePercent}%`}
                        />
                        <div
                            style={{ width: `${SCOPE3_SUMMARY.downstreamSharePercent}%` }}
                            className="h-full bg-tertiary-container transition-all duration-500"
                            title={`Downstream: ${SCOPE3_SUMMARY.downstreamSharePercent}%`}
                        />
                    </div>
                </div>
            </Card>

            {/* 4 Key Metric KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5 border-outline-variant/60">
                    <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider">Total Scope 3 Footprint</span>
                        <MaterialIcon name="hub" className="text-secondary" />
                    </div>
                    <div className="mt-2 space-y-1">
                        <p className="font-mono text-headline-md font-bold text-primary">
                            {SCOPE3_SUMMARY.totalEmissionsTco2e.toLocaleString()} <span className="text-xs font-normal">tCO2e</span>
                        </p>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="text-error font-semibold flex items-center">
                                <MaterialIcon name="trending_up" size="sm" /> +{SCOPE3_SUMMARY.yoyChangePercent}%
                            </span>
                            <span className="text-on-surface-variant">vs previous period</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-5 border-outline-variant/60">
                    <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider">Upstream Supply Chain</span>
                        <MaterialIcon name="local_shipping" className="text-secondary" />
                    </div>
                    <div className="mt-2 space-y-1">
                        <p className="font-mono text-headline-md font-bold text-primary">
                            {SCOPE3_SUMMARY.upstreamEmissionsTco2e.toLocaleString()} <span className="text-xs font-normal">tCO2e</span>
                        </p>
                        <p className="font-mono text-[11px] text-on-surface-variant">
                            8 Categories tracked (Cat 1–8)
                        </p>
                    </div>
                </Card>

                <Card className="p-5 border-outline-variant/60">
                    <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider">Downstream Product Use</span>
                        <MaterialIcon name="recycling" className="text-tertiary" />
                    </div>
                    <div className="mt-2 space-y-1">
                        <p className="font-mono text-headline-md font-bold text-primary">
                            {SCOPE3_SUMMARY.downstreamEmissionsTco2e.toLocaleString()} <span className="text-xs font-normal">tCO2e</span>
                        </p>
                        <p className="font-mono text-[11px] text-on-surface-variant">
                            7 Categories tracked (Cat 9–15)
                        </p>
                    </div>
                </Card>

                <Card className="p-5 border-outline-variant/60">
                    <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider">Data Coverage & Verified Spend</span>
                        <MaterialIcon name="verified" className="text-secondary" />
                    </div>
                    <div className="mt-2 space-y-1">
                        <p className="font-mono text-headline-md font-bold text-primary">
                            {SCOPE3_SUMMARY.overallCoveragePercent}%
                        </p>
                        <p className="font-mono text-[11px] text-on-surface-variant">
                            ${(SCOPE3_SUMMARY.verifiedSpendUsd / 1000000).toFixed(1)}M Spend mapped
                        </p>
                    </div>
                </Card>
            </div>

            {/* Scope 3 Filter Control Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/50 pb-3">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary uppercase">Categories:</span>
                    <div className="flex items-center rounded-lg bg-surface-container-high p-1">
                        <button
                            type="button"
                            onClick={() => setFilterScope("all")}
                            className={cn(
                                "rounded-md px-3 py-1 font-mono text-xs font-semibold transition-colors",
                                filterScope === "all" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant",
                            )}>
                            All 15
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterScope("upstream")}
                            className={cn(
                                "rounded-md px-3 py-1 font-mono text-xs font-semibold transition-colors",
                                filterScope === "upstream" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant",
                            )}>
                            Upstream (Cat 1–8)
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterScope("downstream")}
                            className={cn(
                                "rounded-md px-3 py-1 font-mono text-xs font-semibold transition-colors",
                                filterScope === "downstream" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant",
                            )}>
                            Downstream (Cat 9–15)
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-on-surface-variant">Group:</span>
                    <select
                        value={activeGroupFilter}
                        onChange={(e) => setActiveGroupFilter(e.target.value)}
                        className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-mono text-xs font-medium text-primary">
                        <option value="all">All Groups</option>
                        <option value="Corporate & Operations">Corporate & Operations</option>
                        <option value="Supply Chain & Goods">Supply Chain & Goods</option>
                        <option value="Product Lifecycle">Product Lifecycle</option>
                        <option value="Business Model">Business Model</option>
                    </select>
                </div>
            </div>

            {/* All 15 Category Cards Matrix */}
            <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={gridVariants}
                initial="hidden"
                animate="show">
                {filteredCategories.map((cat) => (
                    <motion.div key={cat.id} variants={itemVariants}>
                        <CategoryCard category={cat} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts & Vendor Hotspot Table Grid */}
            <div className="grid grid-cols-12 gap-6 items-stretch pt-4">
                {/* 12-Month Emission Trend Chart */}
                <div className="col-span-12 lg:col-span-7">
                    <Card className="h-full p-6 border-outline-variant/60">
                        <CardHeader className="px-0 pt-0 pb-4 border-b border-outline-variant/40 flex flex-row items-center justify-between">
                            <h3 className="text-headline-sm font-bold text-primary flex items-center gap-2">
                                <MaterialIcon name="show_chart" className="text-secondary" />
                                Scope 3 Monthly Emission Trend
                            </h3>
                            <span className="font-mono text-xs text-on-surface-variant">tCO2e / Month</span>
                        </CardHeader>
                        <CardBody className="px-0 pt-4 pb-0 space-y-4">
                            <div className="h-64 flex items-end gap-2 pt-6">
                                {SCOPE3_TREND_DATA.map((d) => (
                                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div className="w-full bg-surface-container-high rounded-t-md overflow-hidden flex flex-col justify-end h-48 relative">
                                            <div
                                                style={{ height: `${(d.downstream / 4000) * 100}%` }}
                                                className="w-full bg-tertiary-container transition-all group-hover:opacity-90"
                                            />
                                            <div
                                                style={{ height: `${(d.upstream / 4000) * 100}%` }}
                                                className="w-full bg-secondary transition-all group-hover:opacity-90"
                                            />
                                        </div>
                                        <span className="font-mono text-[11px] text-on-surface-variant font-medium">
                                            {d.month}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-6 font-mono text-xs font-semibold pt-2 border-t border-outline-variant/30">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-3 w-3 rounded-sm bg-secondary" /> Upstream Supply Chain
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-3 w-3 rounded-sm bg-tertiary-container" /> Downstream Product Use
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Hotspot Vendors Table */}
                <div className="col-span-12 lg:col-span-5">
                    <Card className="h-full p-6 border-outline-variant/60">
                        <CardHeader className="px-0 pt-0 pb-4 border-b border-outline-variant/40 flex flex-row items-center justify-between">
                            <h3 className="text-headline-sm font-bold text-primary flex items-center gap-2">
                                <MaterialIcon name="warning" className="text-error" />
                                High Emission Hotspots
                            </h3>
                            <span className="font-mono text-xs text-on-surface-variant">Top Tier Vendors</span>
                        </CardHeader>
                        <CardBody className="px-0 pt-3 pb-0">
                            <div className="space-y-3">
                                {VENDOR_HOTSPOTS.map((vendor) => (
                                    <div
                                        key={vendor.id}
                                        className="flex items-center justify-between rounded-lg bg-surface-container-low p-3 border border-outline-variant/30 hover:border-outline-variant transition-colors">
                                        <div className="space-y-0.5 min-w-0 pr-2">
                                            <p className="font-mono text-xs font-bold text-primary truncate">
                                                {vendor.vendorName}
                                            </p>
                                            <p className="text-[11px] text-on-surface-variant truncate">
                                                {vendor.category} • {vendor.spend}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-mono text-xs font-bold text-secondary">
                                                {vendor.emissions}
                                            </p>
                                            <span
                                                className={cn(
                                                    "inline-block rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase",
                                                    vendor.status === "High Impact"
                                                        ? "bg-error-container text-on-error-container"
                                                        : vendor.status === "Action Required"
                                                          ? "bg-secondary-container text-on-secondary-container"
                                                          : "bg-surface-container-high text-on-surface-variant",
                                                )}>
                                                {vendor.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <AiAssistantFAB />
        </div>
    );
}

function CategoryCard({ category }: { category: Scope3Category }) {
    return (
        <Card className="h-full border-outline-variant/60 hover:border-secondary transition-all duration-200 group">
            <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-primary font-mono text-xs font-bold group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                                {category.id}
                            </span>
                            <div>
                                <span className="font-mono text-[10px] font-bold text-secondary uppercase tracking-wider">
                                    {category.code} • {category.type}
                                </span>
                                <h3 className="font-mono text-xs font-bold text-primary line-clamp-1 group-hover:text-secondary transition-colors">
                                    {category.name}
                                </h3>
                            </div>
                        </div>
                        <MaterialIcon name={category.icon} className="text-on-surface-variant group-hover:text-secondary transition-colors" />
                    </div>

                    <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                        {category.description}
                    </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-outline-variant/30">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <p className="font-mono text-headline-sm font-bold text-primary">
                                {category.emissionsTco2e.toLocaleString()} <span className="text-xs font-normal">tCO2e</span>
                            </p>
                            <p className="font-mono text-[10px] text-on-surface-variant">
                                {category.sharePercent}% of Total Scope 3
                            </p>
                        </div>
                        <span
                            className={cn(
                                "flex items-center font-mono text-[11px] font-bold",
                                category.trendDirection === "up"
                                    ? "text-error"
                                    : category.trendDirection === "down"
                                      ? "text-secondary"
                                      : "text-on-surface-variant",
                            )}>
                            {category.trendDirection === "up" ? "▲ +" : category.trendDirection === "down" ? "▼ " : "— "}
                            {category.trendPercent}%
                        </span>
                    </div>

                    {/* Method Badge & Action Link */}
                    <div className="flex items-center justify-between pt-1">
                        <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] font-semibold text-on-surface-variant">
                            {category.methodology}
                        </span>

                        <Link
                            href={`/scope-3/${category.slug}`}
                            className="flex items-center gap-1 font-mono text-xs font-semibold text-secondary hover:underline">
                            <span>Details</span>
                            <MaterialIcon name="arrow_forward" size="sm" />
                        </Link>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
