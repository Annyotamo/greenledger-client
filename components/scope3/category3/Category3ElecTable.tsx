"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ElectricityTdActivityEntry } from "@/lib/scope3/category3/types";
import { cn } from "@/lib/utils/cn";
import { Scope3DocumentManagerModal } from "@/components/scope3/documents/Scope3DocumentManagerModal";

interface Category3ElecTableProps {
    entries: ElectricityTdActivityEntry[];
    isLoading: boolean;
    onViewDetail: (entry: ElectricityTdActivityEntry) => void;
    onEdit: (entry: ElectricityTdActivityEntry) => void;
    onAmend: (entry: ElectricityTdActivityEntry) => void;
    onSubmitEntry: (id: string) => void;
    onVerifyEntry: (id: string) => void;
    onRejectEntry: (entry: ElectricityTdActivityEntry) => void;
    onDeleteEntry: (id: string) => void;
}

export function Category3ElecTable({
    entries,
    isLoading,
    onViewDetail,
    onEdit,
    onAmend,
    onSubmitEntry,
    onVerifyEntry,
    onRejectEntry,
    onDeleteEntry,
}: Category3ElecTableProps) {
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [documentsEntry, setDocumentsEntry] = useState<ElectricityTdActivityEntry | null>(null);

    return (
        <>
            <Card className="overflow-hidden border-outline-variant/60">
                <div className="overflow-x-auto bg-white">
                    <Table className="w-full table-auto">
                        <TableHeader>
                            <TableRow className="bg-surface-container-low border-b border-outline-variant/60 font-sans text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <TableHead className="py-3 px-4">Period &amp; Date</TableHead>
                                <TableHead className="py-3 px-4">Grid Electricity Consumed</TableHead>
                                <TableHead className="py-3 px-4">Grid Factor &amp; T&amp;D Loss Rate</TableHead>
                                <TableHead className="py-3 px-4">Calculated T&amp;D Loss Emissions</TableHead>
                                <TableHead className="py-3 px-4">Status</TableHead>
                                <TableHead className="py-3 px-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-12 text-center font-sans text-sm text-on-surface-variant">
                                        Loading Electricity T&amp;D Losses activity records...
                                    </TableCell>
                                </TableRow>
                            ) : entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-12 text-center font-sans text-sm text-on-surface-variant">
                                        No electricity T&amp;D loss records found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entries.map((entry) => {
                                    const isMenuOpen = openActionId === entry.id;
                                    const formattedDate = entry.activityDate
                                        ? format(new Date(entry.activityDate), "MMM d, yyyy")
                                        : "N/A";

                                    return (
                                        <TableRow key={entry.id} className="hover:bg-surface-container-lowest transition-colors border-b border-outline-variant/40">
                                            {/* Period & Date */}
                                            <TableCell className="py-3 px-4">
                                                <div className="font-semibold text-primary font-sans text-xs">{entry.reportingPeriod}</div>
                                                <div className="font-sans text-[11px] text-on-surface-variant">{formattedDate}</div>
                                                {entry.facilityName && (
                                                    <div className="font-sans text-[10px] text-on-surface-variant/80 mt-0.5">
                                                        Facility: {entry.facilityName}
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Electricity Consumed */}
                                            <TableCell className="py-3 px-4">
                                                <div className="font-bold text-primary font-sans text-xs tabular-nums">
                                                    {entry.electricityConsumedKwh.toLocaleString()} kWh
                                                </div>
                                                <div className="font-sans text-[10px] text-on-surface-variant tabular-nums">
                                                    {(entry.electricityConsumedKwh / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 })} MWh
                                                </div>
                                            </TableCell>

                                            {/* Grid Factor & T&D Loss Rate */}
                                            <TableCell className="py-3 px-4">
                                                <div className="font-semibold text-primary font-sans text-xs tabular-nums">
                                                    {(entry.tdLossRate * 100).toFixed(1)}% T&amp;D Loss Rate
                                                </div>
                                                <div className="font-sans text-[10px] text-on-surface-variant tabular-nums">
                                                    Grid Factor: {entry.gridKgCo2ePerKwh.toFixed(4)} kg/kWh
                                                </div>
                                            </TableCell>

                                            {/* Calculated Emissions */}
                                            <TableCell className="py-3 px-4">
                                                <div className="font-bold text-primary font-display text-sm tabular-nums">
                                                    {entry.calculatedTCo2e.toFixed(4)} <span className="text-[11px] font-sans font-normal">tCO₂e</span>
                                                </div>
                                                <div className="font-sans text-[10px] text-on-surface-variant tabular-nums">
                                                    {entry.calculatedKgCo2e.toLocaleString(undefined, { maximumFractionDigits: 2 })} kgCO₂e
                                                </div>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className="py-3 px-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-sans",
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

                                            {/* Actions */}
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

                                                {/* Action Popover Menu */}
                                                {isMenuOpen && (
                                                    <div
                                                        onMouseLeave={() => setOpenActionId(null)}
                                                        className="absolute right-4 top-10 z-30 w-48 rounded-xl border border-outline-variant/80 bg-surface-container-lowest p-1.5 shadow-xl text-left font-sans text-xs">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenActionId(null);
                                                                setDocumentsEntry(entry);
                                                            }}
                                                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-primary hover:bg-surface-container-high font-medium">
                                                            <MaterialIcon name="attach_file" size="xs" className="text-secondary" />
                                                            <span>Evidence &amp; Documents</span>
                                                        </button>

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
                                                                    <span>Verify Entry</span>
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setOpenActionId(null);
                                                                        onRejectEntry(entry);
                                                                    }}
                                                                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-error hover:bg-error-container/20">
                                                                    <MaterialIcon name="cancel" size="xs" />
                                                                    <span>Reject Entry</span>
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
                                                                <span>Amend Record</span>
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
                                                                <span>Edit &amp; Resubmit</span>
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

            <Scope3DocumentManagerModal
                isOpen={Boolean(documentsEntry)}
                onClose={() => setDocumentsEntry(null)}
                category="category_3"
                activityId={documentsEntry?.id ?? null}
                activityTitle="Grid Electricity T&D Losses"
            />
        </>
    );
}
