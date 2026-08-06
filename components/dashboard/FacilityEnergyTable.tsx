"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ParsedFacilityEnergySummary } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";

type FacilityEnergyTableProps = {
    facilities: ParsedFacilityEnergySummary[];
};

export function FacilityEnergyTable({ facilities }: FacilityEnergyTableProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader tone="flat" className="flex-wrap justify-between gap-4">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="apartment" size="sm" className="text-primary" />
                    <div>
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Facility Energy Summaries
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                            Facility-level consumed, captive produced, & grid dependency
                        </p>
                    </div>
                </div>
                <Link
                    href="/facilities"
                    className="font-mono text-[11px] font-bold text-on-tertiary-container hover:underline flex items-center gap-1">
                    <span>Manage Facilities</span>
                    <MaterialIcon name="arrow_forward" size="sm" />
                </Link>
            </CardHeader>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Facility</TableHead>
                            <TableHead>Activities</TableHead>
                            <TableHead className="text-right">Consumed (MWh)</TableHead>
                            <TableHead className="text-right">Captive (MWh)</TableHead>
                            <TableHead className="text-right">Grid Import (MWh)</TableHead>
                            <TableHead className="w-48">Grid Dependency</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {facilities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-on-surface-variant py-8 font-mono">
                                    No facility summaries recorded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            facilities.map((fac) => {
                                const isHighDependency = fac.gridDependencyPercent > 50;
                                return (
                                    <TableRow key={fac.facilityId}>
                                        <TableCell className="font-bold">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-primary">
                                                    {fac.facilityName}
                                                </span>
                                                <span className="font-mono text-[11px] text-on-surface-variant">
                                                    {fac.facilityCode}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="neutral" size="md">
                                                {fac.activityCount} logs
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="font-mono text-right font-bold text-primary">
                                            {fac.consumedMwh.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </TableCell>

                                        <TableCell className="font-mono text-right text-secondary font-semibold">
                                            {fac.producedMwh.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </TableCell>

                                        <TableCell className="font-mono text-right text-orange-500 font-semibold">
                                            {fac.importedMwh.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span
                                                        className={cn(
                                                            "font-mono font-bold",
                                                            isHighDependency ? "text-orange-600" : "text-secondary",
                                                        )}>
                                                        {fac.gridDependencyPercent.toFixed(1)}%
                                                    </span>
                                                    <span className="font-mono text-[9px] text-on-surface-variant">
                                                        {isHighDependency ? "High Grid" : "Self Reliant"}
                                                    </span>
                                                </div>
                                                <ProgressBar
                                                    percent={fac.gridDependencyPercent}
                                                    className={isHighDependency ? "bg-orange-500" : "bg-secondary"}
                                                    trackClassName="h-1.5"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
