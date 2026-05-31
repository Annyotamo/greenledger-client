import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ReportingPeriod } from "@/lib/reportingPeriods/types";
import { cn } from "@/lib/utils/cn";

type ReportingPeriodTableProps = {
    periods: ReportingPeriod[];
    isLoading?: boolean;
    isError?: boolean;
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function getStatusBadgeVariant(status: string): "active" | "neutral" | "positive" | "negative" {
    switch (status) {
        case "open":
            return "active";
        case "closed":
            return "neutral";
        case "locked":
            return "negative";
        default:
            return "neutral";
    }
}

export function ReportingPeriodTable({ periods, isLoading = false, isError = false }: ReportingPeriodTableProps) {
    if (isLoading) {
        return (
            <Card className="flex flex-col">
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="calendar_month" size="sm" className="text-primary" />
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Reporting Periods
                        </h3>
                    </div>
                </CardHeader>
                <div className="p-card-padding text-center text-on-surface-variant">Loading...</div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="flex flex-col">
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="calendar_month" size="sm" className="text-primary" />
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Reporting Periods
                        </h3>
                    </div>
                </CardHeader>
                <div className="p-card-padding text-center text-error">Failed to load reporting periods.</div>
            </Card>
        );
    }

    if (periods.length === 0) {
        return (
            <Card className="flex flex-col">
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="calendar_month" size="sm" className="text-primary" />
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Reporting Periods
                        </h3>
                    </div>
                </CardHeader>
                <div className="p-card-padding text-center text-on-surface-variant">No reporting periods found.</div>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col">
            <CardHeader tone="flat">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="calendar_month" size="sm" className="text-primary" />
                    <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                        Reporting Periods
                    </h3>
                </div>
            </CardHeader>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Period Name</TableHead>
                            <TableHead>Reporting Year</TableHead>
                            <TableHead>Period Range</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total Emissions</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {periods.map((period) => (
                            <TableRow key={period.id}>
                                <TableCell className="font-bold">{period.name}</TableCell>
                                <TableCell>{period.reportingYear}</TableCell>
                                <TableCell className="text-sm">
                                    {formatDate(period.periodStart)} to {formatDate(period.periodEnd)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(period.periodStatus)} size="md">
                                        {period.periodStatus.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono">
                                    {period.scope1TotalTCo2e !== null
                                        ? `${period.scope1TotalTCo2e.toLocaleString("en-US", { maximumFractionDigits: 1 })} MT`
                                        : "—"}
                                </TableCell>
                                <TableCell className="text-sm text-on-surface-variant">
                                    {formatDate(period.createdAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link
                                        href={`/reporting-period/${period.id}`}
                                        className="text-on-tertiary-container hover:underline font-mono text-[11px] font-bold">
                                        View
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
