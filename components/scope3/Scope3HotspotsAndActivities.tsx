"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VENDOR_HOTSPOTS, SCOPE3_RECENT_ACTIVITIES } from "@/lib/scope3/data";
import { cn } from "@/lib/utils/cn";

const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 },
};

export function Scope3HotspotsAndActivities() {
    return (
        <div className="grid grid-cols-12 gap-6 items-stretch">
            {/* Left 7 cols: Top Supplier / Activity Hotspots */}
            <div className="col-span-12 lg:col-span-7">
                <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full shadow-2xs">
                    {/* Header Strip */}
                    <div className="px-card-padding py-3.5 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest">
                        <div className="flex items-center gap-2.5">
                            <MaterialIcon name="warning" size="sm" className="text-amber-600 text-[20px]" />
                            <div>
                                <h3 className="font-display text-headline-sm font-bold text-primary tracking-tight">
                                    Value Chain Emission Hotspots
                                </h3>
                                <p className="font-sans text-[11px] font-medium tracking-tight text-on-surface-variant">
                                    High-impact Tier-1 suppliers and key logistics vectors
                                </p>
                            </div>
                        </div>
                        <span className="font-sans text-[11px] font-semibold uppercase tracking-wider bg-surface-container-high text-primary px-2.5 py-1 rounded">
                            Top 5 Drivers
                        </span>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-surface-container-low border-b border-outline-variant">
                                    <TableHead className="font-sans text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                                        Supplier / Entity
                                    </TableHead>
                                    <TableHead className="font-sans text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                                        Category Scope
                                    </TableHead>
                                    <TableHead className="text-right font-sans text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                                        Annual Spend
                                    </TableHead>
                                    <TableHead className="text-right font-sans text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                                        Emissions
                                    </TableHead>
                                    <TableHead className="text-center font-sans text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                                        Audit Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {VENDOR_HOTSPOTS.map((vendor) => (
                                    <TableRow key={vendor.id} className="hover:bg-surface-container-low/40 transition-colors border-b border-outline-variant/30">
                                        <TableCell>
                                            <div className="font-sans font-semibold text-primary text-xs">
                                                {vendor.vendorName}
                                            </div>
                                            <div className="font-sans text-[11px] text-on-surface-variant">
                                                Intensity: <span className="tabular-nums font-medium">{vendor.intensity}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-sans text-[12px] font-semibold text-primary">
                                                {vendor.category}
                                            </span>
                                            <div className="font-sans text-[11px] text-on-surface-variant">
                                                {vendor.dataQuality}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-display text-xs font-bold text-primary tabular-nums">
                                            {vendor.spend}
                                        </TableCell>
                                        <TableCell className="text-right font-display text-xs font-bold text-emerald-800 tabular-nums">
                                            {vendor.emissions}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span
                                                className={cn(
                                                    "inline-block rounded px-2 py-0.5 font-sans text-[10px] font-semibold uppercase border tracking-tight",
                                                    vendor.status === "High Impact"
                                                        ? "bg-error-container/40 text-on-error-container border-error-container"
                                                        : vendor.status === "Action Required"
                                                        ? "bg-amber-50 text-amber-800 border-amber-200"
                                                        : "bg-emerald-50 text-emerald-800 border-emerald-200",
                                                )}>
                                                {vendor.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Right 5 cols: Scope 3 Recent Activities Feed */}
            <div className="col-span-12 lg:col-span-5">
                <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-2xs">
                    {/* Header Strip */}
                    <div className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3.5 bg-surface-container-lowest">
                        <div className="flex items-center gap-2.5">
                            <MaterialIcon name="history" size="sm" className="text-primary text-[20px]" />
                            <div>
                                <h3 className="font-display text-headline-sm font-bold text-primary uppercase tracking-tight">
                                    Recent Scope 3 Activities
                                </h3>
                                <p className="font-sans text-[11px] font-medium tracking-tight text-on-surface-variant">
                                    Live audit ledger & data entry feed
                                </p>
                            </div>
                        </div>
                        <span className="font-sans text-[11px] font-semibold uppercase tracking-wider bg-surface-container-high text-primary px-2.5 py-1 rounded">
                            {SCOPE3_RECENT_ACTIVITIES.length} Logs
                        </span>
                    </div>

                    {/* Timeline list */}
                    <div className="relative flex-1 min-h-0 overflow-y-auto p-card-padding space-y-3.5 max-h-[360px] custom-scrollbar">
                        <motion.div className="relative space-y-3.5" variants={listVariants} initial="hidden" animate="show">
                            {SCOPE3_RECENT_ACTIVITIES.map((item) => (
                                <motion.div key={item.id} variants={itemVariants} className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-surface-container-lowest shadow-2xs mt-0.5",
                                            item.iconBgClassName,
                                        )}>
                                        <MaterialIcon
                                            name={item.icon}
                                            size="xs"
                                            className={cn("font-bold !text-[14px]", item.iconColorClassName)}
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="font-sans text-[10px] font-bold uppercase bg-surface-container-high text-primary px-1.5 py-0.5 rounded tracking-tight">
                                                {item.categoryCode}
                                            </span>
                                            <span className="font-sans text-[11px] text-on-surface-variant">{item.timeAgo}</span>
                                        </div>
                                        <p className="font-sans text-[12px] font-semibold text-on-surface truncate leading-snug">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center justify-between text-[11px] font-sans text-on-surface-variant">
                                            <span className="truncate pr-2">{item.subtitle}</span>
                                            <span className="font-display font-bold text-emerald-800 shrink-0 tabular-nums">{item.tco2e}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
