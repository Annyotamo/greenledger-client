"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { ElectricityActivitySummary } from "@/components/activity/ElectricityActivitySummary";
import { ElectricityActivityTable } from "@/components/activity/ElectricityActivityTable";
import { useElectricityActivities } from "@/lib/activity/hooks";

export default function ElectricityActivitiesPage() {
    const { data: activities = [], isPending, isError } = useElectricityActivities();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");

    const facilityOptions = useMemo(
        () => Array.from(new Set(activities.map((activity) => activity.facilityId))).sort(),
        [activities],
    );

    const filteredActivities = useMemo(() => {
        return activities.filter((activity) => {
            const searchLower = searchTerm.trim().toLowerCase();
            const matchesSearch =
                !searchLower ||
                activity.sourceType?.toLowerCase().includes(searchLower) ||
                activity.facilityId.toLowerCase().includes(searchLower) ||
                activity.electricityActivityType?.toLowerCase().includes(searchLower) ||
                activity.workflowStatus.toLowerCase().includes(searchLower);

            const matchesFacility = !selectedFacility || activity.facilityId === selectedFacility;
            return matchesSearch && matchesFacility;
        });
    }, [activities, searchTerm, selectedFacility]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                        Electricity Activity Log
                    </h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Review, filter and manage electricity activity emissions across your operational sites.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="md">
                        <MaterialIcon name="filter_list" size="sm" />
                        Filter
                    </Button>
                    <Link href="/activities/electricity/create" className="inline-flex">
                        <button className="inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity">
                            <MaterialIcon name="add" size="sm" />
                            New Electricity Activity
                        </button>
                    </Link>
                </div>
            </div>

            <ElectricityActivitySummary activities={filteredActivities} />

            <ElectricityActivityTable
                activities={filteredActivities}
                isLoading={isPending}
                isError={isError}
                searchTerm={searchTerm}
                selectedFacility={selectedFacility}
                onSearchChange={setSearchTerm}
                onFacilityChange={setSelectedFacility}
                facilityOptions={facilityOptions}
            />
        </div>
    );
}
