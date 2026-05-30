"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { FuelActivitySummary } from "@/components/activity/FuelActivitySummary";
import { FuelActivityTable } from "@/components/activity/FuelActivityTable";
import { useFuelActivities } from "@/lib/activity/hooks";

export default function FuelActivitiesPage() {
    const { data: activities = [], isPending, isError } = useFuelActivities();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const [selectedFuel, setSelectedFuel] = useState("");

    const facilityOptions = useMemo(
        () => Array.from(new Set(activities.map((activity) => activity.facilityId))).sort(),
        [activities],
    );

    const fuelOptions = useMemo(
        () => Array.from(new Set(activities.map((activity) => activity.fuelName))).sort(),
        [activities],
    );

    const filteredActivities = useMemo(() => {
        return activities.filter((activity) => {
            const searchLower = searchTerm.trim().toLowerCase();
            const matchesSearch =
                !searchLower ||
                activity.fuelName.toLowerCase().includes(searchLower) ||
                activity.facilityId.toLowerCase().includes(searchLower) ||
                activity.usageType.toLowerCase().includes(searchLower) ||
                activity.workflowStatus.toLowerCase().includes(searchLower);

            const matchesFacility = !selectedFacility || activity.facilityId === selectedFacility;
            const matchesFuel = !selectedFuel || activity.fuelName === selectedFuel;
            return matchesSearch && matchesFacility && matchesFuel;
        });
    }, [activities, searchTerm, selectedFacility, selectedFuel]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Fuel Activity Log</h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Review, filter and manage fuel activity emissions with quick access to new entries.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="md">
                        <MaterialIcon name="filter_list" size="sm" />
                        Filter
                    </Button>
                    <Link href="/activities/fuel/create">
                        <button className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm">
                            <MaterialIcon name="add" size="sm" />
                            <span className="font-label-md text-label-md uppercase">New Fuel Activity</span>
                        </button>
                    </Link>
                </div>
            </div>

            <FuelActivitySummary activities={filteredActivities} />

            <FuelActivityTable
                activities={filteredActivities}
                isLoading={isPending}
                isError={isError}
                searchTerm={searchTerm}
                selectedFacility={selectedFacility}
                selectedFuel={selectedFuel}
                onSearchChange={setSearchTerm}
                onFacilityChange={setSelectedFacility}
                onFuelChange={setSelectedFuel}
                facilityOptions={facilityOptions}
                fuelOptions={fuelOptions}
            />
        </div>
    );
}
