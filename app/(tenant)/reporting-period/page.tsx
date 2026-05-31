"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { ReportingPeriodSummary } from "@/components/reportingPeriod/ReportingPeriodSummary";
import { ReportingPeriodTable } from "@/components/reportingPeriod/ReportingPeriodTable";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";

export default function ReportingPeriodsPage() {
    const { data: periods = [], isPending, isError } = useReportingPeriods();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const statusOptions = useMemo(() => Array.from(new Set(periods.map((p) => p.periodStatus))).sort(), [periods]);

    const filteredPeriods = useMemo(() => {
        return periods.filter((period) => {
            const searchLower = searchTerm.trim().toLowerCase();
            const matchesSearch =
                !searchLower ||
                period.name.toLowerCase().includes(searchLower) ||
                period.reportingYear.toString().includes(searchLower);

            const matchesStatus = !selectedStatus || period.periodStatus === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [periods, searchTerm, selectedStatus]);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Reporting Periods</h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Manage accounting periods for GHG emissions reporting and compliance tracking.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" size="md">
                        <MaterialIcon name="filter_list" size="sm" />
                        Filter
                    </Button>
                    <Link href="/reporting-period/create">
                        <button className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm">
                            <MaterialIcon name="add" size="sm" />
                            <span className="font-label-md text-label-md uppercase">New Period</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Summary Section */}
            <ReportingPeriodSummary periods={filteredPeriods} />

            {/* Table Section */}
            <ReportingPeriodTable periods={filteredPeriods} isLoading={isPending} isError={isError} />
        </div>
    );
}
