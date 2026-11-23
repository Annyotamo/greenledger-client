"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { FacilitySummary } from "@/components/facility/FacilitySummary";
import { FacilityPortfolioTable } from "@/components/facility/FacilityPortfolioTable";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { Authorize } from "@/components/rbac/Authorize";
import { useFacilities } from "@/lib/facility/hooks";

function FacilitiesContent() {
    const { data: facilities = [], isPending, isError } = useFacilities();

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header Section */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                        Facilities Management
                    </h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Detailed inventory of global operational centers and energy profiles.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-outline-variant px-4 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors rounded">
                        <MaterialIcon name="filter_list" size="sm" />
                        <span className="font-label-md text-label-md uppercase">Filter</span>
                    </button>
                    <Authorize
                        feature="facilities"
                        level="write"
                        disabledTooltip="Requires Write permission on Facilities to add a new facility">
                        <Link href="/facilities/create">
                            <button className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm">
                                <MaterialIcon name="add" size="sm" />
                                <span className="font-label-md text-label-md uppercase">New Facility</span>
                            </button>
                        </Link>
                    </Authorize>
                </div>
            </div>

            {/* Stats Row - Full Width */}
            <FacilitySummary facilities={facilities} />

            {/* Portfolio Table - Full Width */}
            <FacilityPortfolioTable facilities={facilities} isLoading={isPending} isError={isError} />
        </div>
    );
}

export default function FacilitiesPage() {
    return (
        <ProtectedRoute feature="facilities" requiredLevel="read" featureTitle="Facilities Management">
            <FacilitiesContent />
        </ProtectedRoute>
    );
}
