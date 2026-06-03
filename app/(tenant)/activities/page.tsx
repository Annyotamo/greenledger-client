"use client";

import { useMemo, useState } from "react";
import { FuelActivitySummary } from "@/components/activity/FuelActivitySummary";
import { FuelActivityTable } from "@/components/activity/FuelActivityTable";
import { useFuelActivities } from "@/lib/activity/hooks";

export default function ActivitiesPage() {
    const { data: activities = [], isPending, isError } = useFuelActivities();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const [selectedFuel, setSelectedFuel] = useState("");
    const [status, setStatus] = useState("");
    const [usageType, setUsageType] = useState("");
    const [emissionType, setEmissionType] = useState("");

    const facilityOptions = useMemo(
        () =>
            Array.from(new Set(activities.map((activity) => activity.facilityId)))
                .sort()
                .map((id) => ({ id, name: id })),
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
            <FuelActivitySummary activities={filteredActivities} />

            <FuelActivityTable
                activities={filteredActivities}
                isLoading={isPending}
                isError={isError}
                searchTerm={searchTerm}
                selectedFacility={selectedFacility}
                selectedFuel={selectedFuel}
                status={status}
                usageType={usageType}
                emissionType={emissionType}
                onSearchChange={setSearchTerm}
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
