import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { DataQualityBar } from "@/components/ui/data-quality-bar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FacilityRow } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";

type FacilityTableProps = {
    rows: FacilityRow[];
};

export function FacilityTable({ rows }: FacilityTableProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader tone="flat">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="apartment" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="text-headline-sm font-semibold text-primary">
                            Top Facility Emissions & Gas Distribution (MT)
                        </h3>
                        <p className="font-sans text-xs text-on-surface-variant">
                            Leaderboard by total emissions with CO₂, CH₄, and N₂O segregation
                        </p>
                    </div>
                </div>
                <Link href="/facilities" className="font-sans text-xs font-semibold text-primary hover:underline">
                    View All Facilities
                </Link>
            </CardHeader>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent bg-surface-container-low border-b border-outline-variant">
                            <TableHead className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider">Facility ID</TableHead>
                            <TableHead className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider">Facility & Region</TableHead>
                            <TableHead className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider">Status</TableHead>
                            <TableHead className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider text-right">Total (tCO₂e)</TableHead>
                            <TableHead className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider text-center">Gas Mix (CO₂ / CH₄ / N₂O)</TableHead>
                            <TableHead className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider text-right">YoY Change</TableHead>
                            <TableHead className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider text-center">Data Quality</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-surface-container-low/40 transition-colors">
                                <TableCell className="font-semibold text-primary font-mono text-xs">{row.id}</TableCell>
                                <TableCell className="font-sans font-medium text-on-surface text-xs">{row.region}</TableCell>
                                <TableCell>
                                    <Badge variant="active" size="md">
                                        {row.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-sans font-bold text-primary tabular-nums text-right text-xs sm:text-sm">
                                    {row.emissions.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant/40 font-mono text-[11px] tabular-nums">
                                        <span className="text-emerald-700 font-semibold" title="CO2">
                                            {(row.co2Tco2e ?? (row.emissions * 0.97)).toFixed(2)}t
                                        </span>
                                        <span className="text-outline-variant">/</span>
                                        <span className="text-blue-700 font-semibold" title="CH4">
                                            {(row.ch4Tco2e ?? (row.emissions * 0.015)).toFixed(2)}t
                                        </span>
                                        <span className="text-outline-variant">/</span>
                                        <span className="text-orange-700 font-semibold" title="N2O">
                                            {(row.n2oTco2e ?? (row.emissions * 0.015)).toFixed(2)}t
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className={cn("font-medium tabular-nums text-right font-sans text-xs", row.yoyDirection === "down" ? "text-secondary" : "text-error")}>
                                    {row.yoyChange}
                                </TableCell>
                                <TableCell className="text-center">
                                    <DataQualityBar score={row.dataQuality} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}

