"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category1SpendEntry } from "@/lib/scope3/category1/types";
import { cn } from "@/lib/utils/cn";
import { Scope3DocumentManagerModal } from "@/components/scope3/documents/Scope3DocumentManagerModal";

interface Category1TableProps {
    entries: Category1SpendEntry[];
    isLoading: boolean;
    onViewDetail: (entry: Category1SpendEntry) => void;
    onEdit: (entry: Category1SpendEntry) => void;
    onAmend: (entry: Category1SpendEntry) => void;
    onSubmitEntry: (id: string) => void;
    onVerifyEntry: (id: string) => void;
    onRejectEntry: (entry: Category1SpendEntry) => void;
    onDeleteEntry: (id: string) => void;
}

export function Category1Table({
    entries,
    isLoading,
    onViewDetail,
    onEdit,
    onAmend,
    onSubmitEntry,
    onVerifyEntry,
    onRejectEntry,
    onDeleteEntry,
}: Category1TableProps) {
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [documentsEntry, setDocumentsEntry] = useState<Category1SpendEntry | null>(null);

    return (
        <>
            <Card className="overflow-hidden border-outline-variant/60">
                <div className="overflow-x-auto bg-white">
                    <Table className="w-full table-auto font-sans">
                        <TableHeader className="bg-surface-container-low border-b border-outline-variant">
                            <TableRow className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hover:bg-transparent">
                                <TableHead className="py-3 px-4">Commodity / Activity Details</TableHead>
                                <TableHead className="py-3 px-4">Period &amp; Date</TableHead>
                                <TableHead className="py-3 px-4">Procurement Spend</TableHead>
                                <TableHead className="py-3 px-4">Emission Factor</TableHead>
                                <TableHead className="py-3 px-4">Emissions (tCO₂e)</TableHead>
                                <TableHead className="py-3 px-4">Status</TableHead>
                                <TableHead className="py-3 px-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-outline-variant/40 text-xs">
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-12 text-center text-on-surface-variant italic">
                                        Loading Category 1 spend entries...
                                    </TableCell>
                                </TableRow>
                            ) : entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-12 text-center text-on-surface-variant italic">
                                        No spend records found matching the selected filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entries.map((entry) => {
                                    const formattedDate = entry.spendDate
                                        ? format(new Date(entry.spendDate), "MMM dd, yyyy")
                                        : "N/A";
                                    const isMenuOpen = openActionId === entry.id;

                                    return (
                                        <TableRow
                                            key={entry.id}
                                            className="hover:bg-surface-container-lowest transition-colors">
                                            {/* Commodity Info */}
                                            <TableCell className="py-3 px-4">
                                                <div className="font-semibold text-primary">
                                                    {entry.factor?.commodityTitle ?? entry.factor?.naicsTitle ?? "Purchased Good"}
                                                </div>
                                                <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                                                    <span className="font-mono text-[10px] bg-surface-container-high px-1 py-0.2 rounded">
                                                        NAICS {entry.factor?.naicsCode ?? "N/A"}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="truncate max-w-[200px]">
                                                        {entry.factor?.naicsSectorCategory ?? "General Commodities"}
                                                    </span>
                                                </div>
                                                {entry.facilityName && (
                                                    <div className="text-[10px] text-on-surface-variant/80 mt-0.5">
                                                        Facility: {entry.facilityName}
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Period & Date */}
                                            <TableCell className="py-3 px-4">
                                                <div className="font-medium text-primary">{entry.reportingPeriod}</div>
                                                <div className="text-[11px] text-on-surface-variant">{formattedDate}</div>
                                                <div className="text-[10px] text-on-surface-variant/70 tabular-nums">
                                                    Year: {entry.spendYear}
                                                </div>
                                            </TableCell>

                                            {/* Procurement Spend */}
                                            <TableCell className="py-3 px-4">
                                                <div className="font-semibold text-primary tabular-nums">
                                                    ₹{entry.spendInInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                                <div className="text-[11px] text-on-surface-variant tabular-nums">
                                                    ${entry.spendInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                                                </div>
                                                <div className="text-[10px] text-on-surface-variant/70 tabular-nums">
                                                    Ex: ₹{entry.exchangeRateUsdToInr}/$
                                                </div>
                                            </TableCell>

                                            {/* Emission Factor */}
                                            <TableCell className="py-3 px-4 font-mono text-[11px]">
                                                <div className="text-primary font-semibold tabular-nums">
                                                    {entry.factor?.kgCo2ePerUsdWithMargins ?? 0.52} kg/USD
                                                </div>
                                                <div className="text-[10px] text-on-surface-variant tabular-nums">
                                                    Producer: {entry.factor?.kgCo2ePerUsdWithoutMargins ?? 0.42}
                                                </div>
                                                <div className="text-[10px] text-secondary tabular-nums">
                                                    Margin: {entry.factor?.marginKgCo2ePerUsd ?? 0.10}
                                                </div>
                                            </TableCell>

                                            {/* Calculated Emissions */}
                                            <TableCell className="py-3 px-4">
                                                <div className="font-bold text-primary tabular-nums text-sm">
                                                    {entry.calculatedTCo2e.toFixed(4)} <span className="text-[11px] font-normal">tCO₂e</span>
                                                </div>
                                                <div className="text-[11px] text-on-surface-variant tabular-nums">
                                                    {entry.calculatedKgCo2e.toLocaleString(undefined, { maximumFractionDigits: 2 })} kgCO₂e
                                                </div>
                                                <div className="text-[10px] text-on-surface-variant tabular-nums">
                                                    Margin Split: {entry.marginTCo2e.toFixed(4)} tCO₂e
                                                </div>
                                            </TableCell>

                                            {/* Status Tag */}
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

                                            {/* Actions Dropdown */}
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

                                                {/* Action Popover */}
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
                category="category_1"
                activityId={documentsEntry?.id ?? null}
                activityTitle={documentsEntry?.factor?.commodityTitle ?? "Category 1 Spend"}
            />
        </>
    );
}
