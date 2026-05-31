"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CreateReportingPeriodForm } from "@/components/reportingPeriod/CreateReportingPeriodForm";

export default function CreateReportingPeriodPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-container-margin">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-label-md text-label-md">
                <Link href="/reporting-period" className="hover:text-primary transition-colors">
                    Reporting Periods
                </Link>
                <MaterialIcon name="chevron_right" size="xs" />
                <span className="text-primary font-semibold">Create New Period</span>
            </div>

            {/* Page Header */}
            <header className="mb-10">
                <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Create Reporting Period</h1>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                    Define a new reporting period for GHG emissions accounting. This period will be used to organize
                    activities, facilities, and scope-specific emissions data.
                </p>
            </header>

            {/* Form */}
            <CreateReportingPeriodForm />
        </div>
    );
}
