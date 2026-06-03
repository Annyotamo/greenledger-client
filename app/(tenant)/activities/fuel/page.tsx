"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { FuelActivitySummary } from "@/components/activity/FuelActivitySummary";
import { FuelActivityTable } from "@/components/activity/FuelActivityTable";
import { useFuelActivities } from "@/lib/activity/hooks";
import { useFacilities } from "@/lib/facility/hooks";

export default function FuelActivitiesPage() {
    const [status, setStatus] = useState("");
    const [usageType, setUsageType] = useState("");
    const [emissionType, setEmissionType] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const [selectedFuel, setSelectedFuel] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const {
        data: activities = [],
        isPending,
        isError,
    } = useFuelActivities({
        status: status || undefined,
        usage_type: usageType || undefined,
        emission_type: emissionType || undefined,
        facility_id: selectedFacility || undefined,
    });

    const { data: facilities = [] } = useFacilities();

    const facilityOptions = useMemo(() => facilities.map((f) => ({ id: f.id, name: f.name })), [facilities]);

    const fuelOptions = useMemo(
        () => Array.from(new Set(activities.map((activity) => activity.fuelName))).sort(),
        [activities],
    );

    const filteredActivities = useMemo(() => {
        return activities.filter((activity) => {
            const matchesFuel = !selectedFuel || activity.fuelName === selectedFuel;
            return matchesFuel;
        });
    }, [activities, selectedFuel]);

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
                    <Button variant="secondary" size="md" onClick={() => setShowFilters((s) => !s)}>
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
                selectedFacility={selectedFacility}
                selectedFuel={selectedFuel}
                status={status}
                usageType={usageType}
                emissionType={emissionType}
                showFilters={showFilters}
                onToggleFilters={setShowFilters}
                onFacilityChange={setSelectedFacility}
                onFuelChange={setSelectedFuel}
                onStatusChange={setStatus}
                onUsageTypeChange={setUsageType}
                onEmissionTypeChange={setEmissionType}
                facilityOptions={facilityOptions}
                fuelOptions={fuelOptions}
            />
        </div>
    );
}
