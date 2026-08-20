"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TravelActivityEntry } from "@/lib/scope3/travel/types";
import { cn } from "@/lib/utils/cn";

interface Category6TableProps {
    entries: TravelActivityEntry[];
    isLoading: boolean;
    onViewDetail: (entry: TravelActivityEntry) => void;
    onEdit: (entry: TravelActivityEntry) => void;
    onAmend: (entry: TravelActivityEntry) => void;
    onSubmitEntry: (id: string) => void;
    onVerifyEntry: (id: string) => void;
    onRejectEntry: (entry: TravelActivityEntry) => void;
    onDeleteEntry: (id: string) => void;
}

export function Category6Table({
    entries,
    isLoading,
    onViewDetail,
    onEdit,
    onAmend,
    onSubmitEntry,
    onVerifyEntry,
    onRejectEntry,
    onDeleteEntry,
}: Category6TableProps) {
    const [openActionId, setOpenActionId] = useState<string | null>(null);

    return (
        <Card className="overflow-hidden border-outline-variant/60">
            <div className="overflow-x-auto bg-white">
                <Table className="w-full table-auto">
                    <TableHeader>
                        <TableRow className="bg-surface-container-low border-b border-outline-variant/60 font-mono text-xs text-on-surface-variant">
                            <TableHead className="py-3 px-4">Period & Date Range</TableHead>
                            <TableHead className="py-3 px-4">Journey Title & Description</TableHead>
                            <TableHead className="py-3 px-4">Transport Modes & Trips</TableHead>
                            <TableHead className="py-3 px-4">Total Distance</TableHead>
                            <TableHead className="py-3 px-4">Travel Emissions</TableHead>
                            <TableHead className="py-3 px-4">Status</TableHead>
                            <TableHead className="py-3 px-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center font-mono text-xs text-on-surface-variant">
                                    Loading Business Travel records...
                                </TableCell>
                            </TableRow>
                        ) : entries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center font-mono text-xs text-on-surface-variant">
                                    No Business Travel journeys logged yet. Click &quot;Log Business Travel Journey&quot; to begin.
                                </TableCell>
                            </TableRow>
                        ) : (
                            entries.map((entry) => {
                                const isMenuOpen = openActionId === entry.id;
                                const hasAir = entry.trips.some((t) => t.transportMode === "AIR");
                                const hasLand = entry.trips.some((t) => t.transportMode === "LAND");
                                const hasSea = entry.trips.some((t) => t.transportMode === "SEA");

                                return (
                                    <TableRow
                                        key={entry.id}
                                        className="hover:bg-surface-container-high/50 transition-colors font-mono text-xs border-b border-outline-variant/30">
                                        <TableCell className="py-3 px-4">
                                            <div className="font-bold text-primary">{entry.reportingPeriodName}</div>
                                            <div className="text-[11px] text-on-surface-variant">
                                                {entry.startDate ? format(new Date(entry.startDate), "MMM d") : ""} -{" "}
                                                {entry.endDate ? format(new Date(entry.endDate), "MMM d, yyyy") : ""}
                                            </div>
                                            {entry.facilityName && (
                                                <span className="inline-block mt-1 rounded bg-surface-container-high px-1.5 py-0.2 text-[10px] text-on-surface-variant">
                                                    {entry.facilityName}
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="py-3 px-4">
                                            <div className="font-bold text-primary">{entry.title}</div>
                                            {entry.description && (
                                                <div className="text-[10px] text-on-surface-variant truncate max-w-xs">
                                                    {entry.description}
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell className="py-3 px-4">
                                            <div className="flex items-center gap-1.5 font-bold text-primary">
                                                {hasAir && (
                                                    <span className="flex items-center gap-1 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] text-sky-700 border border-sky-200">
                                                        <MaterialIcon name="flight" size="xs" /> Flight
                                                    </span>
                                                )}
                                                {hasLand && (
                                                    <span className="flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700 border border-emerald-200">
                                                        <MaterialIcon name="directions_car" size="xs" /> Land
                                                    </span>
                                                )}
                                                {hasSea && (
                                                    <span className="flex items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700 border border-indigo-200">
                                                        <MaterialIcon name="directions_boat" size="xs" /> Sea
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-on-surface-variant mt-1">
                                                {entry.trips.length} itemized trip segment{entry.trips.length === 1 ? "" : "s"}
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-3 px-4">
                                            <div className="font-bold text-primary">
                                                {entry.totalDistanceKm.toLocaleString(undefined, { minimumFractionDigits: 1 })} km
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-3 px-4">
                                            <div className="font-bold text-secondary">
                                                {entry.totalTCo2e.toFixed(4)} tCO₂e
                                            </div>
                                            <div className="text-[10px] text-on-surface-variant">
                                                {entry.totalKgCo2e.toLocaleString()} kgCO₂e
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-3 px-4">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                                    entry.status === "verified"
                                                        ? "bg-secondary-container text-on-secondary-container"
                                                        : entry.status === "submitted"
                                                          ? "bg-surface-container-high text-primary border border-outline-variant"
                                                          : entry.status === "rejected"
                                                            ? "bg-error-container text-on-error-container"
                                                            : "bg-surface-container-high text-on-surface-variant",
                                                )}>
                                                <MaterialIcon
                                                    name={
                                                        entry.status === "verified"
                                                            ? "verified"
                                                            : entry.status === "submitted"
                                                              ? "send"
                                                              : entry.status === "rejected"
                                                                ? "error_outline"
                                                                : "edit_note"
                                                    }
                                                    size="xs"
                                                />
                                                {entry.status}
                                            </span>
                                        </TableCell>

                                        <TableCell className="py-3 px-4 text-right relative">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => onViewDetail(entry)}
                                                    className="h-7 px-2 text-[11px]">
                                                    <MaterialIcon name="visibility" size="xs" />
                                                    <span>Details</span>
                                                </Button>

                                                <button
                                                    type="button"
                                                    onClick={() => setOpenActionId(isMenuOpen ? null : entry.id)}
                                                    className="flex h-7 w-7 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high">
                                                    <MaterialIcon name="more_vert" size="xs" />
                                                </button>
                                            </div>

                                            {isMenuOpen && (
                                                <div
                                                    onMouseLeave={() => setOpenActionId(null)}
                                                    className="absolute right-4 top-10 z-30 w-44 rounded-xl border border-outline-variant/80 bg-surface-container-lowest p-1.5 shadow-xl text-left font-mono text-xs">
                                                    {entry.status === "draft" && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenActionId(null);
                                                                    onSubmitEntry(entry.id);
                                                                }}
                                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-primary hover:bg-surface-container-high">
                                                                <MaterialIcon name="send" size="xs" className="text-secondary" />
                                                                <span>Submit for Review</span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenActionId(null);
                                                                    onEdit(entry);
                                                                }}
                                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-primary hover:bg-surface-container-high">
                                                                <MaterialIcon name="edit" size="xs" />
                                                                <span>Edit Draft</span>
                                                            </button>
                                                        </>
                                                    )}

                                                    {entry.status === "submitted" && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenActionId(null);
                                                                    onVerifyEntry(entry.id);
                                                                }}
                                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-secondary hover:bg-secondary-container/20 font-bold">
                                                                <MaterialIcon name="check_circle" size="xs" />
                                                                <span>Verify Journey</span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenActionId(null);
                                                                    onRejectEntry(entry);
                                                                }}
                                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-error hover:bg-error-container/20">
                                                                <MaterialIcon name="cancel" size="xs" />
                                                                <span>Reject Journey</span>
                                                            </button>
                                                        </>
                                                    )}

                                                    {entry.status === "verified" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenActionId(null);
                                                                onAmend(entry);
                                                            }}
                                                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-secondary hover:bg-secondary/10 font-semibold">
                                                            <MaterialIcon name="history_edu" size="xs" />
                                                            <span>Amend Journey</span>
                                                        </button>
                                                    )}

                                                    {entry.status === "rejected" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenActionId(null);
                                                                onEdit(entry);
                                                            }}
                                                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-primary hover:bg-surface-container-high">
                                                            <MaterialIcon name="edit" size="xs" />
                                                            <span>Edit & Resubmit</span>
                                                        </button>
                                                    )}

                                                    {(entry.status === "draft" || entry.status === "rejected") && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenActionId(null);
                                                                onDeleteEntry(entry.id);
                                                            }}
                                                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-error hover:bg-error-container/20 border-t border-outline-variant/30 mt-1 pt-1.5">
                                                            <MaterialIcon name="delete" size="xs" />
                                                            <span>Delete Entry</span>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
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
