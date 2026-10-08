"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CBAMInstallationGood } from "@/lib/cbam/types";

interface CBAMGoodsSummaryTableProps {
    goods: CBAMInstallationGood[];
}

export function CBAMGoodsSummaryTable({ goods }: CBAMGoodsSummaryTableProps) {
    if (!goods || goods.length === 0) {
        return (
            <Card className="p-6 border-outline-variant/60">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="inventory_2" size="sm" className="text-emerald-700" />
                        <h3 className="font-display text-sm font-bold text-slate-900">
                            Declared Produced Goods (G1..G10)
                        </h3>
                    </div>
                    <Link href="/tenant-cbam/installation">
                        <Button variant="secondary" size="sm" className="font-sans text-xs">
                            Add Goods
                        </Button>
                    </Link>
                </div>
                <p className="font-sans text-xs text-slate-500 text-center py-6">
                    No produced goods declared for this installation yet. Declare up to 10 goods (G1..G10) in Sheet A_InstData.
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-5 border-outline-variant/60 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-3">
                <div className="flex items-center gap-2">
                    <MaterialIcon name="inventory_2" size="sm" className="text-emerald-700" />
                    <div>
                        <h3 className="font-display text-sm font-bold text-slate-900">
                            Declared Produced Goods (G1..G10)
                        </h3>
                        <p className="font-sans text-[11px] text-slate-500">
                            Aggregated CBAM categories and declared production routes for this installation.
                        </p>
                    </div>
                </div>

                <Link href="/tenant-cbam/installation">
                    <Button variant="secondary" size="sm" className="gap-1 font-sans text-xs font-semibold">
                        <MaterialIcon name="tune" size="xs" />
                        <span>Manage Goods</span>
                    </Button>
                </Link>
            </div>

            <div className="overflow-x-auto rounded-lg border border-outline-variant/40">
                <Table>
                    <TableHeader className="bg-surface-container-low">
                        <TableRow>
                            <TableHead className="w-16 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Slot
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Aggregated Category
                            </TableHead>
                            <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Declared Production Routes
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goods.map((item, idx) => (
                            <TableRow key={item.id || `good-${idx}`} className="hover:bg-surface-container-low/50">
                                <TableCell className="font-sans font-bold text-xs text-slate-900 tabular-nums">
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                        G{item.slot_number || idx + 1}
                                    </span>
                                </TableCell>
                                <TableCell className="font-sans font-semibold text-xs text-slate-900">
                                    {item.category_name || item.category_slug || item.category_id}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.production_routes && item.production_routes.length > 0 ? (
                                            item.production_routes.map((route, rIdx) => (
                                                <span
                                                    key={rIdx}
                                                    className="inline-flex items-center rounded-md bg-surface-container-high border border-outline-variant/60 px-2 py-0.5 font-sans text-[11px] font-medium text-slate-700">
                                                    {route}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="font-sans text-xs text-slate-400 italic">No routes selected</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
