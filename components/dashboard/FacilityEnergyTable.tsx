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
                        <h3 className="text-headline-sm font-semibold text-primary">
                            Facility Energy Summaries
                        </h3>
                        <p className="font-sans text-xs text-on-surface-variant">
                            Facility-level consumed, captive produced, & grid dependency
                        </p>
                    </div>
                </div>
                <Link
                    href="/facilities"
                    className="font-sans text-xs font-semibold text-primary hover:underline flex items-center gap-1">
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
                                <TableCell colSpan={6} className="text-center text-on-surface-variant py-8 font-sans text-xs">
                                    No facility summaries recorded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            facilities.map((fac) => {
                                const isHighDependency = fac.gridDependencyPercent > 50;
                                return (
                                    <TableRow key={fac.facilityId}>
                                        <TableCell className="font-semibold">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-primary">
                                                    {fac.facilityName}
                                                </span>
                                                <span className="font-sans text-xs text-on-surface-variant">
                                                    {fac.facilityCode}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="neutral" size="md">
                                                {fac.activityCount} logs
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="font-sans text-right font-semibold text-primary tabular-nums">
                                            {fac.consumedMwh.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </TableCell>

                                        <TableCell className="font-sans text-right text-secondary font-semibold tabular-nums">
                                            {fac.producedMwh.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </TableCell>

                                        <TableCell className="font-sans text-right text-orange-500 font-semibold tabular-nums">
                                            {fac.importedMwh.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between text-xs font-sans">
                                                    <span
                                                        className={cn(
                                                            "font-bold tabular-nums",
                                                            isHighDependency ? "text-orange-600" : "text-secondary",
                                                        )}>
                                                        {fac.gridDependencyPercent.toFixed(1)}%
                                                    </span>
                                                    <span className="text-[11px] text-on-surface-variant font-medium">
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
