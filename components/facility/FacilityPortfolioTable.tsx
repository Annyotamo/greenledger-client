"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Facility } from "@/lib/facility/types";

type FacilityPortfolioTableProps = {
    facilities: Facility[];
    isLoading: boolean;
    isError: boolean;
};

const statusMap: Record<string, { label: string; variant: "positive" | "negative" | "neutral" }> = {
    active: { label: "Operational", variant: "positive" },
    inactive: { label: "Inactive", variant: "negative" },
};

function calculateDataQuality(facility: Facility): number {
    const scopeCount = Number(facility.scope1Enabled) + Number(facility.scope2Enabled) + Number(facility.scope3Enabled);
    return Math.round((scopeCount / 3) * 100);
}

export function FacilityPortfolioTable({ facilities, isLoading, isError }: FacilityPortfolioTableProps) {
    return (
        <Card className="overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center justify-between gap-4 border-b border-outline-variant bg-surface p-4">
                <div>
                    <h3 className="text-headline-sm font-semibold text-primary">Portfolio Inventory</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded hover:bg-surface-container-high transition-colors text-on-surface-variant">
                        <MaterialIcon name="download" size="sm" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-surface-container-high transition-colors text-on-surface-variant">
                        <MaterialIcon name="more_vert" size="sm" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow className="bg-surface-container-low border-b border-outline-variant">
                            <TableHead className="py-3 px-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                                Facility Name/ID
                            </TableHead>
                            <TableHead className="py-3 px-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                                Type
                            </TableHead>
                            <TableHead className="py-3 px-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                                Location
                            </TableHead>
                            <TableHead className="py-3 px-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                                Ownership
                            </TableHead>
                            <TableHead className="py-3 px-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                                Status
                            </TableHead>
                            <TableHead className="py-3 px-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                                Data Quality
                            </TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 px-4 text-center text-on-surface-variant" colSpan={7}>
                                    Loading facilities...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 px-4 text-center text-error" colSpan={7}>
                                    Unable to load facilities. Refresh to try again.
                                </TableCell>
                            </TableRow>
                        ) : facilities.length === 0 ? (
                            <TableRow className="border-none">
                                <TableCell className="py-12 px-4 text-center text-on-surface-variant" colSpan={7}>
                                    No facilities available yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            facilities.map((facility) => {
                                const status = statusMap[facility.facilityStatus.toLowerCase()] ?? {
                                    label: facility.facilityStatus,
                                    variant: "neutral" as const,
                                };
                                const quality = calculateDataQuality(facility);

                                return (
                                    <TableRow
                                        key={facility.id}
                                        className="hover:bg-surface-container-lowest transition-colors group border-b border-outline-variant">
                                        <TableCell className="py-3 px-4">
                                            <div className="font-semibold text-body-md text-primary">
                                                {facility.name}
                                            </div>
                                            <div className="text-xs text-on-surface-variant">
                                                {facility.facilityCode}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[11px] font-medium rounded">
                                                {facility.facilityType}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <div className="flex items-center gap-1.5 text-body-md">
                                                <MaterialIcon name="location_on" size="xs" className="text-outline" />
                                                <span>
                                                    {facility.city}, {facility.state}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 px-4 text-body-md capitalize">
                                            {facility.ownershipType}
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        status.variant === "positive"
                                                            ? "bg-secondary"
                                                            : status.variant === "negative"
                                                              ? "bg-error"
                                                              : "bg-outline-variant"
                                                    }`}
                                                />
                                                <span className="text-body-md font-medium">{status.label}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${
                                                            quality >= 80
                                                                ? "bg-secondary"
                                                                : quality >= 60
                                                                  ? "bg-secondary-container"
                                                                  : "bg-error"
                                                        }`}
                                                        style={{ width: `${quality}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-label-md text-secondary">
                                                    {quality}%{" "}
                                                    {quality >= 90
                                                        ? "(Verified)"
                                                        : quality >= 80
                                                          ? "(High)"
                                                          : quality >= 60
                                                            ? "(Good)"
                                                            : "(Low)"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 px-4 text-right">
                                            <button className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-primary transition-all p-1">
                                                <MaterialIcon name="chevron_right" size="sm" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col gap-4 border-t border-outline-variant bg-surface p-4 md:flex-row md:items-center md:justify-between">
                <p className="text-label-md text-on-surface-variant">
                    Showing 1-{Math.min(10, facilities.length)} of {facilities.length} facilities
                </p>
                <div className="flex items-center gap-2">
                    <button
                        className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30"
                        disabled>
                        <MaterialIcon name="chevron_left" size="sm" />
                    </button>
                    <div className="flex items-center gap-1">
                        <span className="px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded">1</span>
                        <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer rounded">
                            2
                        </button>
                        <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer rounded">
                            3
                        </button>
                        <span className="px-3 py-1 text-xs font-medium text-on-surface-variant">...</span>
                        <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer rounded">
                            15
                        </button>
                    </div>
                    <button className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant">
                        <MaterialIcon name="chevron_right" size="sm" />
                    </button>
                </div>
            </div>
        </Card>
    );
}
