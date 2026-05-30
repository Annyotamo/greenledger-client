"use client";

import { useMemo, useState } from "react";
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
