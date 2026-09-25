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
                    <MaterialIcon name="apartment" size="sm" className="text-primary" />
                    <h3 className="text-headline-sm font-semibold text-primary">
                        Top Facility Emissions (MT)
                    </h3>
                </div>
                <Link href="/facilities" className="font-sans text-xs font-semibold text-primary hover:underline">
                    View All Facilities
                </Link>
            </CardHeader>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Facility ID</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Emissions</TableHead>
                            <TableHead>YoY Change</TableHead>
                            <TableHead>Data Quality</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-semibold text-primary">{row.id}</TableCell>
                                <TableCell>{row.region}</TableCell>
                                <TableCell>
                                    <Badge variant="active" size="md">
                                        {row.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-sans font-semibold text-primary tabular-nums">
                                    {row.emissions.toLocaleString("en-US", { minimumFractionDigits: 1 })}
                                </TableCell>
                                <TableCell
                                    className={cn("font-medium tabular-nums", row.yoyDirection === "down" ? "text-secondary" : "text-error")}>
                                    {row.yoyChange}
                                </TableCell>
                                <TableCell>
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
