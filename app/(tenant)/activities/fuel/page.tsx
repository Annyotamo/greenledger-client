"use client";

import { useMemo, useState } from "react";
import { FuelActivitySummary } from "@/components/activity/FuelActivitySummary";
import { FuelActivityTable } from "@/components/activity/FuelActivityTable";
import { useFuelActivities } from "@/lib/activity/hooks";
import { getScope1Report } from "@/lib/ghg/api";

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
