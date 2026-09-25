"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category15InvestmentEntry } from "@/lib/scope3/category15/types";
import { cn } from "@/lib/utils/cn";

interface Category15TableProps {
    entries: Category15InvestmentEntry[];
    isLoading: boolean;
    onViewDetail: (entry: Category15InvestmentEntry) => void;
    onEdit: (entry: Category15InvestmentEntry) => void;
    onAmend: (entry: Category15InvestmentEntry) => void;
    onSubmitEntry: (id: string) => void;
    onVerifyEntry: (id: string) => void;
    onRejectEntry: (entry: Category15InvestmentEntry) => void;
    onDeleteEntry: (id: string) => void;
}

export function Category15Table({
    entries,
    isLoading,
    onViewDetail,
    onEdit,
    onAmend,
    onSubmitEntry,
    onVerifyEntry,
    onRejectEntry,
    onDeleteEntry,
}: Category15TableProps) {
    const [openActionId, setOpenActionId] = useState<string | null>(null);

    return (
        <Card className="overflow-hidden border-outline-variant/60 font-sans">
            <div className="overflow-x-auto bg-white">
                <Table className="w-full table-auto">
                    <TableHeader>
                        <TableRow className="bg-surface-container-low border-b border-outline-variant/60 font-sans text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <TableHead className="py-3 px-4">Period & Date</TableHead>
                            <TableHead className="py-3 px-4">Financed Asset & PCAF Class</TableHead>
                            <TableHead className="py-3 px-4">Outstanding / Worth (Cr)</TableHead>
                            <TableHead className="py-3 px-4">Attribution %</TableHead>
                            <TableHead className="py-3 px-4">Financed Emissions</TableHead>
                            <TableHead className="py-3 px-4">Status</TableHead>
                            <TableHead className="py-3 px-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center font-sans text-xs text-slate-500">
                                    Loading investment activities...
                                </TableCell>
                            </TableRow>
                        ) : entries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center font-sans text-xs text-slate-500">
                                    No investment activity recorded yet. Click &quot;Log Investment Activity&quot; to begin.
                                </TableCell>
                            </TableRow>
                        ) : (
                            entries.map((entry) => {
                                const isMenuOpen = openActionId === entry.id;

                                return (
                                    <TableRow
                                        key={entry.id}
                                        className="hover:bg-surface-container-high/50 transition-colors font-sans text-xs border-b border-outline-variant/30">
                                        <TableCell className="py-3 px-4">
                                            <div className="font-semibold text-slate-900">{entry.reportingPeriodName}</div>
                                            <div className="text-[11px] text-slate-500 font-medium tabular-nums">
                                                {entry.activityDate ? format(new Date(entry.activityDate), "MMM d, yyyy") : "N/A"}
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-3 px-4">
                                            <div className="font-semibold text-slate-900">{entry.whatYouFinanced}</div>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className="flex h-4 w-4 items-center justify-center rounded bg-secondary/15 text-[9px] font-bold text-secondary tabular-nums">
                                                    #{entry.assetClassNo}
                                                </span>
                                                <span className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                                                    {entry.assetClassName}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-3 px-4">
                                            <div className="font-semibold text-slate-900 tabular-nums">
                                                ₹{entry.outstandingAmountCrores.toLocaleString(undefined, { minimumFractionDigits: 2 })} Cr
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-medium tabular-nums">
                                                Worth: ₹{entry.totalCompanyWorthCrores.toLocaleString(undefined, { minimumFractionDigits: 2 })} Cr
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-3 px-4">
                                            <div className="font-semibold text-secondary tabular-nums">
                                                {entry.attributionFactorPercentage.toFixed(2)}%
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-medium tabular-nums">
                                                Factor: {entry.attributionFactor.toFixed(4)}
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-3 px-4">
                                            <div className="font-semibold text-secondary tabular-nums">
                                                {entry.calculatedTCo2e.toFixed(4)} tCO₂e
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-medium tabular-nums">
                                                S1: {entry.financedScope1Emissions.toFixed(1)}t • S2: {entry.financedScope2Emissions.toFixed(1)}t • S3: {entry.financedScope3Emissions.toFixed(1)}t
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
                                                    className="h-7 px-2 text-[11px] font-semibold">
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
                                                    className="absolute right-4 top-10 z-30 w-44 rounded-xl border border-outline-variant/80 bg-surface-container-lowest p-1.5 shadow-xl text-left font-sans text-xs">
                                                    {entry.status === "draft" && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenActionId(null);
                                                                    onSubmitEntry(entry.id);
                                                                }}
                                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-primary hover:bg-surface-container-high">
                                                                <MaterialIcon name="send" size="xs" className="text-secondary" />
                                                                <span>Submit for Review</span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenActionId(null);
                                                                    onEdit(entry);
                                                                }}
                                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-primary hover:bg-surface-container-high">
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
                                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-secondary hover:bg-secondary-container/20 font-semibold">
                                                                <MaterialIcon name="check_circle" size="xs" />
                                                                <span>Verify Activity</span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenActionId(null);
                                                                    onRejectEntry(entry);
                                                                }}
                                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-error hover:bg-error-container/20 font-medium">
                                                                <MaterialIcon name="cancel" size="xs" />
                                                                <span>Reject Activity</span>
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
                                                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-primary hover:bg-surface-container-high font-medium">
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
                                                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-error hover:bg-error-container/20 border-t border-outline-variant/30 mt-1 pt-1.5 font-medium">
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
